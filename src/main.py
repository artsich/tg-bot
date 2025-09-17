import os
import sys
from collections import deque
from typing import Optional

import httpx
from pydantic import BaseModel, Field, AnyUrl, ValidationError, field_validator
from telegram import Update, User
from telegram.constants import ChatAction, ChatType
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

class LlmClient:
    def __init__(
        self,
        base_url: str,
        model: str,
        system_prompt: str,
        timeout_seconds: float = 60.0,
    ) -> None:
        self.base_url = base_url
        self.model = model
        self.system_prompt = system_prompt
        self.timeout_seconds = timeout_seconds

    async def generate(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "system": self.system_prompt,
            "prompt": prompt,
            "stream": False,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                resp = await client.post(self.base_url, json=payload)
                resp.raise_for_status()
                data = resp.json()
                text = data.get("response") or data.get("message") or ""
                if not text:
                    return "Модель ничего не ответила. Попробуй сформулировать иначе."
                return text.strip()
        except Exception:
            return "Ошибка запроса к LLM. Повтори попытку позже."

class AppConfig(BaseModel):
    bot_token: str = Field(min_length=10)
    llm_url: AnyUrl
    llm_model: str = Field(min_length=1)
    llm_timeout_seconds: float = Field(default=60.0, gt=0)

    @field_validator("bot_token")
    @classmethod
    def bot_token_not_placeholder(cls, v: str) -> str:
        if v.strip() in {"", "YOUR_TELEGRAM_BOT_TOKEN"}:
            raise ValueError("BOT_TOKEN must be a real token")
        return v


def load_config() -> AppConfig:
    env = os.environ
    bot_token = env.get("BOT_TOKEN")
    llm_url = env.get("LLM_URL", "http://localhost:11434")
    llm_model = env.get("LLM_MODEL", "qwen2.5:7b-instruct")

    try:
        timeout_raw: Optional[str] = env.get("LLM_TIMEOUT_SECONDS")
        timeout = float(timeout_raw) if timeout_raw else 60.0
    except Exception:
        timeout = 60.0

    try:
        return AppConfig(
            bot_token=bot_token,
            llm_url=llm_url,
            llm_model=llm_model,
            llm_timeout_seconds=timeout,
        )
    except ValidationError as e:
        sys.stderr.write(f"Invalid configuration: {e}\n")
        sys.exit(1)


SYSTEM_PROMPT = (
    "Отвечай на том языке, на котором тебя спросили."
    "Отвечай только результатом, без лишнего текста. "
    "Будь токсичным как можно больше, но и на вопрос отвечай."
    "Эмодзий можно использовать, но не перегружать сообщение ими."
)

HISTORY_MAX_LEN = 40

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

    if chat and chat.type == ChatType.PRIVATE:
        history = context.user_data.get("history")
        if not isinstance(history, deque):
            history = deque(maxlen=HISTORY_MAX_LEN)
            context.user_data["history"] = history
        return history

    store = context.chat_data.setdefault("history", {})
    user_id = user.id if user else 0
    history = store.get(user_id)
    if not isinstance(history, deque):
        history = deque(maxlen=HISTORY_MAX_LEN)
        store[user_id] = history
    return history


def _build_prompt(history: deque, user_text: str, sender: Optional[User]) -> str:
    parts = []
    for item in history:
        role = item.get("role")
        text = (item.get("text") or "").strip()
        if not text:
            continue
        if role == "assistant":
            prefix = "assistant"
        else:
            label = item.get("display_name") or item.get("user_id")
            if label:
                prefix = f"user({label})"
            else:
                prefix = "user"
        parts.append(f"{prefix}: {text}")

    label = _display_name(sender)
    if label:
        parts.append(f"user({label}): {user_text}")
    else:
        parts.append(f"user: {user_text}")
    return "\n\n".join(parts)


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
    prompt = _build_prompt(history, user_text, update.effective_user)

    llm: LlmClient = context.bot_data["llm_client"]
    answer = await llm.generate(prompt)

    _append_history_entry(
        history,
        role="user",
        text=user_text,
        user=update.effective_user,
    )
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

    base = str(cfg.llm_url).rstrip("/")
    endpoint = f"{base}/api/generate"

    app.bot_data["llm_client"] = LlmClient(
        base_url=endpoint,
        model=cfg.llm_model,
        system_prompt=SYSTEM_PROMPT,
        timeout_seconds=cfg.llm_timeout_seconds,
    )

    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("ai", ask_ai))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, store_text_message))

    print("Bot is running...")
    app.run_polling(close_loop=False)
    print("Bot is stopped...")


if __name__ == "__main__":
    main()
