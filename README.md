This project is a simple Telegram chatbot implemented in Python.

Run with Docker Compose

1) Create a .env file next to docker-compose.yml (do not commit secrets):

```
MODEL_NAME=gpt-5-nano
HISTORY_MAX_LEN=40
BOT_TOKEN= ...
OPENAI_API_KEY= ...
```

2) Build and start services:

```bash
docker compose up -d --build
```

3) Check logs:

```bash
# ollama service
docker compose logs -f ollama
# model pre-pull job
docker compose logs -f init-model
# bot service
docker compose logs -f bot
```
