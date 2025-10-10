from pathlib import Path
import json
import os
import threading

data_dir = Path(os.getenv("DATA_DIR") or "data")
file_path = data_dir / "joke_subs.json"


_lock = threading.Lock()


class JokeSub:
    chat_id: int
    topic: str

    def __init__(self, chat_id: int, topic: str) -> None:
        self.chat_id = int(chat_id)
        self.topic = (topic or "").strip()


def sub(chat_id: int, topic: str) -> None:
    with _lock:
        records = _load_from_file()
        updated = False
        for rec in records:
            if rec.chat_id == int(chat_id):
                rec.topic = (topic or "").strip()
                updated = True
                break
        if not updated:
            records.append(JokeSub(chat_id=int(chat_id), topic=topic))
        _save_to_file(records)


def unsub(chat_id: int) -> None:
    with _lock:
        records = _load_from_file()
        filtered = [r for r in records if r.chat_id != chat_id]
        if len(filtered) != len(records):
            _save_to_file(filtered)


def get_subs() -> list[JokeSub]:
    with _lock:
        return _load_from_file()


def _save_to_file(records: list[JokeSub]) -> None:
    # Ensure parent directory exists
    file_path.parent.mkdir(parents=True, exist_ok=True)
    data = [{"chat_id": int(r.chat_id), "topic": r.topic} for r in records]
    with file_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def _load_from_file() -> list[JokeSub]:
    if not file_path.exists():
        return []
    try:
        with file_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        return []

    records: list[JokeSub] = []
    if not isinstance(data, list):
        return records

    for item in data:
        try:
            cid = int((item.get("chat_id")))
            topic = (item.get("topic") or "").strip()
            records.append(JokeSub(chat_id=cid, topic=topic))
        except Exception:
            continue
    return records