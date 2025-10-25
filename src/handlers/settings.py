from telegram import Update
from telegram.ext import ContextTypes

from src.services.settings import update_chat_settings, get_chat_settings


async def stupidity_on(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    chat_id = update.effective_chat.id
    update_chat_settings(chat_id, stupidity_check=True)
    await update.message.reply_text("✅")


async def stupidity_off(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    chat_id = update.effective_chat.id
    update_chat_settings(chat_id, stupidity_check=False)
    await update.message.reply_text("❌")


