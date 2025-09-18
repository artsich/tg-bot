import os
import sys
from collections import deque
from typing import Optional, List
from pydantic import BaseModel, Field, AnyUrl, ValidationError, field_validator
from telegram import Update, User
from telegram.constants import ChatAction, ChatType
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

from openai import OpenAI, RateLimitError

class AppConfig(BaseModel):
    bot_token: str = Field(min_length=10)
    llm_model: str = Field(min_length=1)
    history_max_len: int = Field(default=40)

    @field_validator("bot_token")
    @classmethod
    def bot_token_not_placeholder(cls, v: str) -> str:
        if v.strip() in {"", "YOUR_TELEGRAM_BOT_TOKEN"}:
            raise ValueError("BOT_TOKEN must be a real token")
        return v


def load_config() -> AppConfig:
    env = os.environ
    bot_token = env.get("BOT_TOKEN")
    llm_model = env.get("LLM_MODEL", "qwen2.5:7b-instruct")


    try:
        return AppConfig(
            bot_token=bot_token,
            llm_model=llm_model,
            history_max_len=int(env.get("HISTORY_MAX_LEN", 40)),
        )
    except ValidationError as e:
        sys.stderr.write(f"Invalid configuration: {e}\n")
        sys.exit(1)

def _display_name(update_user: Optional[User]) -> str:
    if not update_user:
        return ""

    username = (update_user.username or "").strip()
    if username:
        return f"@{username}"

    parts = [
        (update_user.first_name or "").strip(),
        (update_user.last_name or "").strip(),
    ]
    full = " ".join(filter(None, parts))
    if full:
        return full

    try:
        return f"id={int(update_user.id)}"
    except Exception:
        return ""


def _append_history_entry(
    history: deque,
    *,
    role: str,
    text: str,
    user: Optional[User],
) -> None:
    cleaned = text.strip()
    if not cleaned:
        return

    entry = {
        "role": role,
        "text": cleaned,
    }

    if user and not getattr(user, "is_bot", False):
        entry["user_id"] = user.id
        entry["display_name"] = _display_name(user)

    history.append(entry)


def _ensure_history(update: Update, context: ContextTypes.DEFAULT_TYPE) -> deque:
    chat = update.effective_chat
    user = update.effective_user

    app_config: AppConfig = context.bot_data["app_config"]

    if chat and chat.type == ChatType.PRIVATE:
        history = context.user_data.get("history")
        if not isinstance(history, deque):
            history = deque(maxlen=app_config.history_max_len)
            context.user_data["history"] = history
        return history

    store = context.chat_data.setdefault("history", {})
    user_id = user.id if user else 0
    history = store.get(user_id)
    if not isinstance(history, deque):
        history = deque(maxlen=app_config.history_max_len)
        store[user_id] = history
    return history


def _build_prompt(history: deque) -> list[dict[str, str]]:
    messages = []
    for item in history:
        role = item.get("role")
        text = (item.get("text") or "").strip()
        if not text:
            continue

        if role == "assistant":
            messages.append({"role": "assistant", "content": text})
        else:
            label = item.get("display_name") or item.get("user_id") or "user"
            messages.append({"role": "user", "content": f"{label}: {text}"})

    return messages


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Available commands: /ai <запрос>")


async def ask_ai(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_text = " ".join(context.args).strip()
    if not user_text and update.message and update.message.reply_to_message:
        user_text = (update.message.reply_to_message.text or "").strip()

    if not user_text:
        await update.message.reply_text("Использование: /ai <запрос>")
        return

    await context.bot.send_chat_action(
        chat_id=update.effective_chat.id,
        action=ChatAction.TYPING,
    )

    history = _ensure_history(update, context)
    _append_history_entry(
        history,
        role="user",
        text=user_text,
        user=update.effective_user,
    )

    input_history = _build_prompt(history)

    llm: OpenAI = context.bot_data["llm_client"]
    app_config: AppConfig = context.bot_data["app_config"]

    try:
        response = llm.responses.create(
            model=app_config.llm_model,
            input = input_history,
            instructions="""
    Отвечай на том языке, на котором тебя спросили.
    Ты должен вести себя как человек уставший от жизни, которому задают идиотские вопросы.
    Отвечай только результатом, без лишнего текста. 
    Будь токсичным, устраивай прожарку, но в контексте вопроса.
    Можно использовать матюки.
    Эмодзий можно использовать, но не перегружать сообщение ими. (максимум 4 штуки)
    """)
        answer = response.output_text
    except RateLimitError:
        await update.message.reply_text('❌💸 Kurwa, a деняг то больше нiма...')
        return
    except Exception as e:
        print("OpenAI error:", e, file=sys.stderr)
        await update.message.reply_text('Бляяяяяя, чет проблема какая с openai :(')
        return

    _append_history_entry(
        history,
        role="assistant",
        text=answer,
        user=None,
    )

    await update.message.reply_text(answer)


async def store_text_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    message = update.effective_message
    if not message or not message.text:
        return

    sender = message.from_user
    if sender and sender.is_bot:
        return

    text = message.text.strip()
    if not text:
        return

    history = _ensure_history(update, context)
    _append_history_entry(
        history,
        role="user",
        text=text,
        user=sender,
    )

def main() -> None:
    cfg = load_config()

    app = Application.builder().token(cfg.bot_token).build()

    app.bot_data["llm_client"] = OpenAI()
    app.bot_data["app_config"] = cfg

    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("ai", ask_ai))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, store_text_message))

    print("Bot is running...")
    app.run_polling(close_loop=False)
    print("Bot is stopped...")

if __name__ == "__main__":
    main()
