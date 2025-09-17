# syntax=docker/dockerfile:1

FROM python:3.12-slim

WORKDIR /app

# Install Python deps
COPY src/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire repo to preserve structure (`/app/src/...`)
COPY . /app

# Ensure imports resolve from both /app and /app/src
ENV PYTHONPATH=/app:/app/src

# Run main explicitly from src
CMD ["python", "-m", "main"]
