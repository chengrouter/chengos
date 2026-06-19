# ChengOS Docker Deployment

This directory is the GitHub-friendly Docker deployment template. It does not
ship compiled binaries or frontend `dist` files; those are published as Docker
images and selected through `.env`.

Use this when you want one-command deployment. Use `deploy/hybrid` when you want
the backend binary on the host and only the infrastructure in Docker.

## Layout

```text
deploy/docker/
├── docker-compose.yml          # local/default full Docker deployment
├── docker-compose.binds.yml    # optional host-editable backend mounts
├── docker-compose.remote.yml   # remote override for VPS/reverse-proxy use
├── generate-env.sh             # generate .env with Docker-network URLs
├── start.sh                    # one-command local/remote startup
├── upgrade.sh                  # one-command upgrade for api/ui/app images
├── models/                     # optional local OCR model files
├── .env.example
└── README.md
```

`start.sh` creates these runtime directories beside the compose files:

```bash
mkdir -p skills config logs runtime models/paddle
```

Suggested contents:

- `skills/`: workflow skill definitions mounted to `/app/skills`
- `config/`: optional config overrides mounted to `/app/config`
- `logs/`: host log directory mounted to `/app/logs`
- `runtime/`: runtime scratch/PID state mounted to `/app/runtime`
- `models/paddle/`: optional PaddleOCR ONNX model files mounted to `/home/chengos/.chengflow/models/paddle`

## One-Click Upgrade

Use `upgrade.sh` to pull the latest `api`, `ui`, and `app` images and recreate
only those three services. Existing Postgres, Redis, and Qdrant data volumes are
left untouched.

```bash
bash upgrade.sh
```

Through the unified manager, use:

```bash
./chengos.sh update --mode docker
./chengos.sh restart --mode docker
./chengos.sh uninstall --mode docker
```

The manager preserves `.env` by default. Docker volume and image removal during
uninstall is prompted separately.

If you are using the remote compose override, run:

```bash
bash upgrade.sh --remote
```

If you do not want the optional bind override, add `--no-binds`.

## OCR Engines

The backend image includes Tesseract and Poppler runtime packages, so the
default OCR engine works without extra model files.

PaddleOCR ONNX is optional. To use it, the backend binary must be built with
the `ocr-paddle` feature and the model files must be placed in:

```text
deploy/docker/models/paddle/
├── det.onnx
├── rec.onnx
├── ppocr_keys_v1.txt
└── cls.onnx                 # optional
```

For a Paddle-enabled API image, build the binary with:

```bash
cargo build -p cheng-api --release --features ocr-paddle --target x86_64-unknown-linux-musl
docker build -t chengos/chengos:paddle ../..
```

Then point `.env` at that image:

```env
CHENGOS_API_IMAGE=chengos/chengos:paddle
```

If a workflow selects `paddle_onnx` but the binary or model files are missing,
the OCR node returns an explicit setup error instead of silently falling back to
Tesseract.

The default `docker-compose.yml` uses the files baked into the backend image.
`start.sh` enables the optional bind override by default and seeds `skills/`
and `config/` from the repository if those directories are empty:

```bash
bash start.sh
```

Use `bash start.sh --no-binds` if you want to rely only on files baked into the
backend image.

## Local Start

```bash
cd deploy/docker
bash start.sh
```

For command shortcuts, choose the manager menu item "Install Command Shortcuts";
it installs shell commands such as `chengos` and, when available, `cheng`.

Open:

```text
UI:  http://localhost:8080
App: http://localhost:5055
API: http://localhost:3000
```

The host ports are bound to `127.0.0.1` by default. That is good for local
testing and reverse proxies. If you intentionally want LAN access without a
proxy, change the port bindings in `docker-compose.yml`.

## Remote Start

On a VPS, keep the services bound to `127.0.0.1` and put HTTPS in front with
Cloudflare Tunnel, Caddy, Nginx Proxy Manager, Traefik, or your existing proxy.

```bash
cd deploy/docker
bash start.sh --remote \
  --public-ui-url https://chengos.example.com \
  --public-app-url https://app.chengos.example.com \
  --public-api-url https://api.chengos.example.com
```

Set these in `.env` for remote mode:

```env
PUBLIC_UI_URL=https://chengos.example.com
PUBLIC_APP_URL=https://app.chengos.example.com
PUBLIC_API_URL=https://api.chengos.example.com
CORS_PERMISSIVE=false
CORS_ALLOWED_ORIGINS=https://chengos.example.com,https://app.chengos.example.com
```

The UI and App containers use same-origin paths by default:

```env
UI_API_BASE_URL=/api/v1
UI_WS_URL=/ws
APP_API_BASE_URL=/api/v1
APP_WS_URL=/ws/executions
```

Their Nginx containers proxy API/WebSocket traffic to:

```text
http://api:3000
```

That keeps browser traffic same-origin and avoids most CORS friction.

## Native/Static Alternative

For people who want to save resources or customize deployment:

- build the backend binary with `./build.sh --hybrid`
- serve `chengflow-ui/dist` and `chengflow-app/dist-app` with host Nginx/Caddy
- run `bin/cheng-api` directly on the host
- keep Postgres, Redis, and Qdrant from `deploy/hybrid/infra/docker-compose.yml`

That path is intentionally kept separate from this Docker template so the
repository has clean source templates while release artifacts can still include
compiled binaries and static frontend files.
