from __future__ import annotations
import json, os, threading
from dataclasses import dataclass, fields as dc_fields
from pathlib import Path
from typing import Any, Dict

DATA_DIR = Path(os.getenv("DATA_DIR", "data"))
FILE_PATH = DATA_DIR / "chat_settings.json"
_LOCK = threading.Lock()


@dataclass(slots=True)
class ChatSettings:
    chat_id: int
    stupidity_check: bool = True

    def to_dict(self) -> Dict[str, Any]:
        return {"chat_id": int(self.chat_id), "stupidity_check": bool(self.stupidity_check)}

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> "ChatSettings":
        cid = int(payload.get("chat_id"))
        stupidity_check = bool(payload.get("stupidity_check", True))
        return cls(chat_id=cid, stupidity_check=stupidity_check)

    # Allow dict-like access for known fields
    def __getitem__(self, key: str) -> Any:
        if key == "chat_id":
            return self.chat_id
        allowed = {f.name for f in dc_fields(self) if f.name != "chat_id"}
        if key in allowed:
            return getattr(self, key)
        raise KeyError(key)

    def __setitem__(self, key: str, value: Any) -> None:
        if key == "chat_id":
            raise KeyError("chat_id is immutable")
        allowed = {f.name for f in dc_fields(self) if f.name != "chat_id"}
        if key in allowed:
            setattr(self, key, value)
            return
        raise KeyError(key)


def _load() -> Dict[int, ChatSettings]:
    if not FILE_PATH.exists():
        return {}
    try:
        with FILE_PATH.open("r", encoding="utf-8") as f:
            raw = json.load(f)
            if not isinstance(raw, list):
                return {}
    except Exception:
        return {}

    result: Dict[int, ChatSettings] = {}
    for item in raw:
        try:
            rec = ChatSettings.from_dict(item)
            result[rec.chat_id] = rec
        except Exception:
            continue
    return result


def _save(records: Dict[int, ChatSettings]) -> None:
    FILE_PATH.parent.mkdir(parents=True, exist_ok=True)
    data = [r.to_dict() for r in records.values()]
    with FILE_PATH.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_chat_settings(chat_id: int) -> ChatSettings:
    with _LOCK:
        records = _load()
        return records.get(chat_id, ChatSettings(chat_id=int(chat_id)))


def update_chat_settings(chat_id: int, **fields: Any) -> ChatSettings:
    with _LOCK:
        records = _load()
        chat_id = int(chat_id)
        rec = records.get(chat_id, ChatSettings(chat_id=chat_id))

        for k, v in fields.items():
            if k == "chat_id":
                continue
            try:
                rec[k] = v
            except KeyError:
                raise ValueError(f"Unknown chat settings field: {k}") from None

        records[chat_id] = rec
        _save(records)
        return rec
