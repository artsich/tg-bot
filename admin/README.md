# Admin

## Dev infra

```bash
docker compose -f admin/docker/dev-infra.docker-compose.yml up -d
```

## Prod (single compose file)

```bash
docker compose -f admin/docker/docker-compose.yml up -d --build
```

## Publish Admin to the Internet (Cloudflare Tunnel, no VPN, no port-forwarding)

1) **Create a tunnel** in Cloudflare Zero Trust:
- Go to **Zero Trust** → **Networks** → **Tunnels**
- Create a tunnel and choose **Docker** connector
- Copy the provided **token**

2) **Create a public hostname** for that tunnel:
- **Admin UI**: `admin.example.com` → Service: `http://portal:80`

The API is served from the same domain as **`/api/*`** (the portal's nginx proxies it internally to `backend`).

3) **Add/extend your `.env`** file next to `admin/docker/docker-compose.yml` (or export env vars):

```bash
# Cloudflare tunnel connector token (from Zero Trust -> Tunnels -> your tunnel)
CLOUDFLARED_TOKEN=...
```

4) Start:

```bash
docker compose -f admin/docker/docker-compose.yml up -d --build
```

5) (Recommended) Protect access with Cloudflare Access:
- Zero Trust → **Access** → **Applications**
- Add an application for `admin.example.com`
- Allow only your email accounts, enable MFA if possible