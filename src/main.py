import os
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
from telegram.constants import ChatAction
from llm_client import LlmClient
from config import load_config

SYSTEM_PROMPT = (
    "Отвечай на том языке, на котором тебя спросили."
    "Отвечай только результатом, без лишнего текста. "
    "Будь токсичным как можно больше, но и на вопрос отвечай."
    "Эмодзий можно использовать, но не перегружать сообщение ими."
)

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        "Available commands: /ai <запрос>"
    )

async def ask_ai(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_text = " ".join(context.args).strip()
    if not user_text and update.message and update.message.reply_to_message:
        user_text = (update.message.reply_to_message.text or "").strip()

    if not user_text:
        await update.message.reply_text("Использование: /ai <запрос>")
        return

    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action=ChatAction.TYPING)

    llm: LlmClient = context.bot_data["llm_client"]
    answer = await llm.generate(user_text)
    await update.message.reply_text(answer)

def main() -> None:
    cfg = load_config()

    app = Application.builder().token(cfg.bot_token).build()

    base = str(cfg.llm_url).rstrip("/")
    app.bot_data["llm_client"] = LlmClient(
        base_url=f"{base}/api/generate",
        model=cfg.llm_model,
        system_prompt=SYSTEM_PROMPT,
        timeout_seconds=cfg.llm_timeout_seconds,
    )

    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("ai", ask_ai))

    print("Bot is running...")
    app.run_polling(close_loop=False)
    print("Bot is stopped...")

if __name__ == "__main__":
    main()
