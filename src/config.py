import os
import sys
from pydantic import BaseModel, Field, ValidationError, field_validator

class AppConfig(BaseModel):
    bot_token: str = Field(min_length=10)
    llm_model: str = Field(min_length=1)
    history_max_len: int = Field(default=40)
    stupid_check: float = Field(default=0.15)

    @field_validator("bot_token")
    @classmethod
    def bot_token_not_placeholder(cls, v: str) -> str:
        if v.strip() in {"", "YOUR_TELEGRAM_BOT_TOKEN"}:
            raise ValueError("BOT_TOKEN must be a real token")
        return v


def load_config() -> AppConfig:
    env = os.environ
    bot_token = env.get("BOT_TOKEN")
    llm_model = env.get("LLM_MODEL", "qwen2.5:7b-instruct")

    try:
        return AppConfig(
            bot_token=bot_token,
            llm_model=llm_model,
            history_max_len=int(env.get("HISTORY_MAX_LEN", 40)),
            stupid_check=float(env.get("STUPID_CHECK", 0.15)),
        )
    except ValidationError as e:
        sys.stderr.write(f"Invalid configuration: {e}\n")
        sys.exit(1)


