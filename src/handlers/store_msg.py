from telegram import Update
from telegram.ext import ContextTypes
from src.history import ensure_history, append_history_entry

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

    history = ensure_history(update, context)
    append_history_entry(
        history,
        role="user",
        text=text,
        user=sender,
    )
