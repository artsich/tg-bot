# Admin

## Dev infra

```bash
docker compose -f admin/docker/dev-infra.docker-compose.yml up -d
```

## Prod (single compose file)

```bash
docker compose -f admin/docker/docker-compose.yml up -d --build
```
