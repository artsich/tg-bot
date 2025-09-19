from collections import deque
from typing import Optional
from telegram import Update, User
from telegram.constants import ChatType
from telegram.ext import ContextTypes

from config import AppConfig

def _display_name(update_user: Optional[User]) -> str:
    if not update_user:
        return ""

    username = (update_user.username or "").strip()
    if username:
        return f"@{username}"

    parts = [
        (update_user.first_name or "").strip(),
        (update_user.last_name or "").strip(),
    ]
    full = " ".join(filter(None, parts))
    if full:
        return full

    try:
        return f"id={int(update_user.id)}"
    except Exception:
        return ""


def append_history_entry(
    history: deque,
    *,
    role: str,
    text: str,
    user: Optional[User],
) -> None:
    cleaned = text.strip()
    if not cleaned:
        return

    entry = {
        "role": role,
        "text": cleaned,
    }

    if user and not getattr(user, "is_bot", False):
        entry["user_id"] = user.id
        entry["display_name"] = _display_name(user)

    history.append(entry)


def ensure_history(update: Update, context: ContextTypes.DEFAULT_TYPE) -> deque:
    chat = update.effective_chat
    user = update.effective_user

    app_config: AppConfig = context.bot_data["app_config"]

    if chat and chat.type == ChatType.PRIVATE:
        history = context.user_data.get("history")
        if not isinstance(history, deque):
            history = deque(maxlen=app_config.history_max_len)
            context.user_data["history"] = history
        return history

    store = context.chat_data.setdefault("history", {})
    user_id = user.id if user else 0
    history = store.get(user_id)
    if not isinstance(history, deque):
        history = deque(maxlen=app_config.history_max_len)
        store[user_id] = history
    return history


def build_prompt(history: list) -> list[dict[str, str]]:
    messages = []
    for item in history:
        role = item.get("role")
        text = (item.get("text") or "").strip()
        if not text:
            continue

        if role == "assistant":
            messages.append({"role": "assistant", "content": text})
        else:
            label = item.get("display_name") or item.get("user_id") or "user"
            messages.append({"role": "user", "content": f"{label}: {text}"})

    return messages


def get_last_user_messages(history: list[dict[str, str]], user_id: int, n: int) -> list[dict[str, str]]:
    user_msgs = [m for m in history if m.get("role") == "user" and m.get("user_id") == user_id]
    return user_msgs[-n:]


