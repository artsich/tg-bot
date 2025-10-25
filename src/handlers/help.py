from telegram import Update
from telegram.ext import ContextTypes

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        "\n".join(
            [
                "Доступные команды:",
                "/ai <запрос>",
                "/subjoke <тема>",
                "/unjoke",
                "/stupidity_on — включить проверку тупости",
                "/stupidity_off — выключить проверку тупости",
            ]
        )
    )
