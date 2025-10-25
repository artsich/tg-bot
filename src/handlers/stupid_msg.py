import logging
import random
from telegram import Update
from telegram.ext import ContextTypes

from src.config import AppConfig
from src.history import ensure_history, get_last_user_messages, build_prompt
from src.services.settings import get_chat_settings

from collections import deque
from openai import OpenAI


def _detect_stupid_msgs_from_user(llm: OpenAI, history: deque, llm_model: str, user_id: int) -> bool | None:
    last_msgs = build_prompt(get_last_user_messages(history, n=3, user_id=user_id))

    if not last_msgs:
        return None

    response = llm.responses.create(
        model=llm_model,
        instructions=
        """
Ты модератор чата.
У тебя список последних сообщений одного пользователя.  
Определи, выглядел ли он глупо.
Если есть хоть намёк на глупость или нелепость → ответь "yes".
Если сообщения осмысленные и нормальные → ответь "no".  
Никакого другого текста.
""",
        input=last_msgs,
    )

    return response.output_text.strip().lower() == "yes"


async def try_check_stupid_msg(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    app_config: AppConfig = context.bot_data["app_config"]

    chat_settings = get_chat_settings(update.effective_chat.id)
    if not chat_settings.stupidity_check:
        return None

    if random.random() > app_config.stupid_check:
        return None

    logging.info("Try to detect stupidity...")

    if _detect_stupid_msgs_from_user(
        history=ensure_history(update, context),
        user_id=update.effective_user.id,
        llm=context.bot_data["llm_client"],
        llm_model=app_config.llm_model,
    ):
        logging.info("Stupidity detected.")
        await update.message.reply_text("Лучше бы промолчал 🥴")

    return None


