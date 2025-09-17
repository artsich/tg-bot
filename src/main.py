import os
import sys
import httpx
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
from telegram.constants import ChatAction
from typing import Optional
from pydantic import BaseModel, Field, AnyUrl, ValidationError, field_validator

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
	endpoint = f"{base}/api/generate"

	app.bot_data["llm_client"] = LlmClient(
		base_url=endpoint,
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
