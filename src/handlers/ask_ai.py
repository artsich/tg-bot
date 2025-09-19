import logging
import sys
from telegram import Update
from telegram.constants import ChatAction
from telegram.ext import ContextTypes
from openai import OpenAI, RateLimitError

from src.config import AppConfig
from src.history import ensure_history, append_history_entry, build_prompt


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

    history = ensure_history(update, context)
    append_history_entry(
        history,
        role="user",
        text=user_text,
        user=update.effective_user,
    )

    input_history = build_prompt(list(history))

    llm: OpenAI = context.bot_data["llm_client"]
    app_config: AppConfig = context.bot_data["app_config"]

    try:
        response = llm.responses.create(
            model=app_config.llm_model,
            input=input_history,
            instructions=
            """
    Отвечай на том языке, на котором тебя спросили.
    Ты должен вести себя как человек уставший от жизни, которому задают идиотские вопросы.
    Отвечай только результатом, без лишнего текста. 
    Будь токсичным, устраивай прожарку, но в контексте вопроса.
    Можно использовать матюки.
    Эмодзий можно использовать, но не перегружать сообщение ими. (максимум 4 штуки)
    """,
        )
        answer = response.output_text
    except RateLimitError:
        await update.message.reply_text('❌💸 Kurwa, a деняг то больше нiма...')
        return
    except Exception as e:
        logging.error("OpenAI error:", e, file=sys.stderr)
        await update.message.reply_text('Бляяяяяя, чет проблема какая с openai :(')
        return

    append_history_entry(
        history,
        role="assistant",
        text=answer,
        user=None,
    )

    await update.message.reply_text(answer)
