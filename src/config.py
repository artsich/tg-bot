import os
import sys
from typing import Optional
from pydantic import BaseModel, Field, AnyUrl, ValidationError, field_validator

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
