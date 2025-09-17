This project is a simple Telegram chatbot implemented in Python.

Run with Docker Compose

1) Create a .env file next to docker-compose.yml (do not commit secrets):

```
MODEL_NAME=qwen2.5:7b-instruct
LLM_TIMEOUT_SECONDS=60
BOT_TOKEN= # set your token value here locally, do not commit
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
