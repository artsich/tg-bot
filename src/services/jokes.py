from pathlib import Path
import csv
import os
import threading

data_dir = Path(os.getenv("DATA_DIR") or "data")
file_path = data_dir / "joke_subs.csv"


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
    with file_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["chat_id", "topic"])
        for r in records:
            writer.writerow([int(r.chat_id), r.topic])


def _load_from_file() -> list[JokeSub]:
    if not file_path.exists():
        return []
    records: list[JokeSub] = []
    with file_path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.reader(f)
        for idx, row in enumerate(reader):
            if not row:
                continue
            # Skip header if present (expecting first cell to be exactly 'chat_id')
            if idx == 0 and len(row) >= 1 and str(row[0]).strip().lower() == "chat_id":
                continue
            try:
                cid = int(str(row[0]).strip())
                topic = (row[1] if len(row) > 1 else "").strip()
                records.append(JokeSub(chat_id=cid, topic=topic))
            except Exception:
                continue
    return records