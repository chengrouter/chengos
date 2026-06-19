# ChengOS Hybrid Deployment

Native binary + Docker-managed infrastructure.  
The app binary runs directly on the host; Postgres, Redis, and Qdrant run in Docker containers.

## Prerequisites

| Requirement | Version |
|---|---|
| Linux x86-64 | any modern distro |
| Docker Engine | 20.10+ (Compose plugin included) |
| curl | any |
| Your user in the `docker` group | `sudo usermod -aG docker $USER` |

Docker is only needed for the three infrastructure containers — the app binary itself runs as your own user with no elevated privileges.

---

## Quick Start

### 1. Unpack

```bash
tar -xzf chengos-full-linux-amd64.tar.gz
cd chengos
```

### 2. Create `.env`

Recommended:

```bash
bash generate-env.sh --cors-origin https://your-frontend.example.com
```

This script:

- copies `.env.example` to `.env`
- generates random `POSTGRES_PASSWORD` / `REDIS_PASSWORD`
- generates valid 64-hex `CREDENTIAL_MASTER_KEY_1` / `JWT_SECRET`
- keeps derived values like `DATABASE_URL`, `REDIS_URL`, and `DB_PASSWORD` in sync

Important behavior:

- `generate-env.sh --force` overwrites `.env` with new passwords and secrets
- existing Docker data volumes do **not** automatically adopt a new `POSTGRES_PASSWORD`
- on a fresh test machine, if you regenerate `.env`, also recreate the infra volumes before starting again

Reset infra volumes for a clean re-init:

```bash
bash stop.sh --with-infra
docker compose -f infra/docker-compose.yml --env-file .env down -v
```

If you prefer manual setup:

```bash
cp .env.example .env
$EDITOR .env
```

Minimum required edits (start.sh will refuse to run until these are correct):

```bash
# Infrastructure passwords — any strong random string
POSTGRES_PASSWORD=<strong-password>
REDIS_PASSWORD=<strong-password>

# Must also match the passwords above
DATABASE_URL=postgres://tianai_db:<POSTGRES_PASSWORD>@127.0.0.1:5432/master_router
REDIS_URL=redis://:<REDIS_PASSWORD>@127.0.0.1:6379
DB_PASSWORD=<POSTGRES_PASSWORD>

# Must be exactly 64 hex characters each
CREDENTIAL_MASTER_KEY_1=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)

# Set your frontend origin; do not leave as the placeholder
CORS_ALLOWED_ORIGINS=https://your-frontend.example.com
```

> **Important**: `CREDENTIAL_MASTER_KEY_1` encrypts all stored API keys and credentials. Back it up in a secrets manager before first start — losing it means losing access to all stored credentials.

`generate-env.sh` options:

```bash
bash generate-env.sh --help
bash generate-env.sh --force
```

### 3. Start

```bash
bash start.sh
```

You can also use the unified manager from the package/repository root:

```bash
./chengos.sh install --mode native --with api,ui,app,cli
./chengos.sh start --mode native
./chengos.sh status --mode native
./chengos.sh restart --mode native
./chengos.sh update --mode native
./chengos.sh uninstall --mode native
```

The manager reuses an existing `.env` by default. It does not regenerate
secrets during install, update, or restart.

When `cli` is selected from a developer workspace, the manager builds the
`cheng-cli` Cargo package and copies its `cheng` chat binary to `bin/cheng`.
The command shortcut installer uses that binary for `/usr/local/bin/cheng`.

What it does, in order:

1. Validates Docker is available
2. Checks all required env vars (fails fast with a clear message if anything is missing or still a placeholder)
3. Guards against double-start via `runtime/cheng-api.pid`
4. Starts `infra/docker-compose.yml` — Postgres, Redis, Qdrant
5. Polls until all three containers report `(healthy)` — up to 90 seconds
6. Appends startup diagnostics to `logs/cheng-api.log`
7. Launches `bin/cheng-api --log` via `nohup`, appending application logs to `logs/cheng-api.log`
8. Polls `http://127.0.0.1:PORT/health` until the app responds — up to 30 seconds
9. If the process dies during startup, removes the PID file and prints the last 50 log lines

On success:

```
[chengos]   ChengOS is running!
[chengos]   API: http://127.0.0.1:3000
[chengos]   Health: http://127.0.0.1:3000/health
[chengos]   Logs: tail -f logs/cheng-api.log
[chengos]   Stop: bash stop.sh
```

### 4. Check status

```bash
bash status.sh
```

Shows: process state, `/health` and `/ready` response bodies, `docker compose ps` output, last 20 log lines, and disk usage.

### 5. Stop

```bash
bash stop.sh                # stop app only (infra keeps running)
bash stop.sh --with-infra   # stop app + containers (data volumes preserved)
```

Stop sends SIGTERM and waits up to 30 seconds, then SIGKILL if the process hasn't exited.

### 6. Reset infrastructure data for a clean test

If you want PostgreSQL / Redis / Qdrant to re-initialize from scratch with the current `.env`:

```bash
bash stop.sh --with-infra
docker compose -f infra/docker-compose.yml --env-file .env down -v
bash start.sh
```

This removes all local test data stored in Docker volumes.

---

## Directory Layout

```
chengos/
├── bin/
│   └── cheng-api          # application binary
├── config/
│   └── providers.toml     # LLM provider & credential schema definitions
├── infra/
│   └── docker-compose.yml # Postgres + Redis + Qdrant
├── skills/                # workflow skill definitions
├── ui/                    # static frontend files (if bundled)
├── app/                   # app-managed assets
├── logs/
│   └── cheng-api.log      # application log (appended on each start)
├── runtime/
│   └── cheng-api.pid      # PID of running process
├── .env.example           # template — copy to .env
├── generate-env.sh        # generate .env with random secrets
├── .env                   # your config (not shipped, gitignored)
├── start.sh
├── stop.sh
└── status.sh
```

---

## Upgrade

Recommended manager path:

```bash
./chengos.sh update --mode native
```

The update path preserves `.env`, runtime data, logs, skills, workspaces, and
language preference.

```bash
# 1. Stop the running app (leave infra up to preserve data)
bash stop.sh

# 2. Back up the binary in case rollback is needed
cp bin/cheng-api bin/cheng-api.prev

# 3. Drop the new binary into place
cp /path/to/new/cheng-api bin/cheng-api
chmod +x bin/cheng-api

# 4. Optionally update skills if the release includes new ones
# (skip if you have local customisations you want to keep)
# cp -a /path/to/new/skills/. skills/

# 5. Start
bash start.sh
```

Database migrations run automatically on startup (`RUN_MIGRATIONS=true` in `.env`).  
To disable auto-migration: set `RUN_MIGRATIONS=false` and run migrations manually before starting.

---

## Rollback

```bash
bash stop.sh

# Restore the previous binary
cp bin/cheng-api.prev bin/cheng-api
chmod +x bin/cheng-api

bash start.sh
```

If the new release included a migration that needs to be reverted:

```bash
# Requires diesel_cli installed locally with the same DATABASE_URL
cd /path/to/source && cargo install diesel_cli --no-default-features --features postgres
diesel migration revert --database-url "$DATABASE_URL"
```

---

## Log Management

Logs append to `logs/cheng-api.log` indefinitely. Rotate manually or with logrotate:

If you run the binary directly instead of `start.sh`, enable file logging with:

```bash
./bin/cheng-api --log
# or choose an explicit path
./bin/cheng-api --log-file /var/log/chengos/cheng-api.log
```

```bash
# /etc/logrotate.d/chengos
/path/to/chengos/logs/cheng-api.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
```

`copytruncate` is used instead of `create` because the process holds the file open.

---

## Troubleshooting

**`CREDENTIAL_MASTER_KEY_1 must be a 64-character hex string`**  
Generate one: `openssl rand -hex 32`

**`password authentication failed for user "tianai_db"` after regenerating `.env`**  
Your PostgreSQL container was initialized with an older password. Either:
```bash
# Fresh test environment: wipe and recreate local volumes
bash stop.sh --with-infra
docker compose -f infra/docker-compose.yml --env-file .env down -v
bash start.sh
```
Or keep the old PostgreSQL password in `.env` so it still matches the existing database volume.

**Infrastructure health timeout after 90s**  
Check container logs:
```bash
docker compose -f infra/docker-compose.yml logs
```
Common causes: port 5432/6379/6334 already in use on the host, or insufficient disk space for Docker volumes.

**`/health` did not respond after 30s**  
The process is still running but the app didn't bind. Check the tail of `logs/cheng-api.log` — start.sh prints it automatically on timeout. Common causes: `DATABASE_URL` mismatch with the passwords set in `.env`, or the port is already in use.

**`cheng-api is already running`**  
A previous run left a PID file. If the process is truly gone:
```bash
rm runtime/cheng-api.pid
bash start.sh
```
If the process is actually running, stop it first: `bash stop.sh`

**Port conflicts**  
All three infrastructure ports are bound to `127.0.0.1` only (not `0.0.0.0`), so they are not accessible from other machines. If something else on the host is using 5432, 6379, or 6334, edit `infra/docker-compose.yml` to remap the host-side port, then update `DATABASE_URL` / `REDIS_URL` / `QDRANT_URL` in `.env` accordingly.

**Fresh VPS smoke test passed, what should I verify next?**  
Run:
```bash
bash status.sh
curl http://127.0.0.1:3000/health
curl http://127.0.0.1:3000/ready
bash stop.sh
bash start.sh
bash stop.sh --with-infra
```
This confirms health, readiness, restart behavior, and infra shutdown behavior.
