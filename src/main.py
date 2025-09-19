import sys
import logging
from telegram.ext import Application, CommandHandler, MessageHandler, filters
from openai import OpenAI

from config import load_config
from src.handlers.ask_ai import ask_ai
from src.handlers.help import help_command
from src.handlers.store_msg import store_text_message
from src.handlers.stupid_msg import try_check_stupid_msg


def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        stream=sys.stdout,
        format="%(asctime)s [%(levelname)s] %(message)s"
    )

    cfg = load_config()

    app = Application.builder().token(cfg.bot_token).build()

    app.bot_data["llm_client"] = OpenAI()
    app.bot_data["app_config"] = cfg

    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("ai", ask_ai))

    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, store_text_message), group=0)
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, try_check_stupid_msg), group=1)

    logging.info("Bot is running... 🚀")
    app.run_polling(close_loop=False)
    logging.info("Bot is stopped...")

if __name__ == "__main__":
    main()
