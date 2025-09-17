import httpx

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
