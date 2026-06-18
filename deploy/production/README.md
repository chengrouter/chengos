# ChengOS Production Deployment

This folder is the complete production deployment bundle for a single VPS.

Included files:

- `docker-compose.yml`: starts PostgreSQL, Redis, and the ChengOS app
- `.env.example`: the only config template you need to edit
- `deploy-production.sh`: installs Docker and Docker Compose, then deploys
- `bin/cheng-api`: the built ChengOS backend binary copied from the selected Cargo target
- `skills/`: host-mounted skills directory used by the app container

## 1. Build the image and export the deployment bundle

Run this in the project root on your local machine:

```bash
./build.sh --release --tag chengos/chengos:latest
docker push chengos/chengos:latest
```

After that, the build will generate:

- `dist/production/`
- `dist/chengos-production-bundle.tar.gz`

`dist/production/.env.example` will already contain the image tag you used in `build.sh`.

## 2. Upload the production folder to the VPS

You can upload either the folder or the archive.

Example with `scp`:

```bash
scp -r dist/production user@your-vps:/opt/chengos
```

If you uploaded the archive instead:

```bash
ssh user@your-vps
mkdir -p /opt/chengos
tar -xzf chengos-production-bundle.tar.gz -C /opt/chengos
mv /opt/chengos/production /opt/chengos/app
cd /opt/chengos/app
```

If you uploaded the folder directly:

```bash
ssh user@your-vps
cd /opt/chengos/production
```

## 3. Prepare the `.env` file

In the deployment directory:

```bash
cp .env.example .env
```

Generate the required secrets:

```bash
openssl rand -hex 32
openssl rand -hex 32
```

Then edit `.env` and fill in the real values for:

- `POSTGRES_PASSWORD`
- `REDIS_PASSWORD`
- `CREDENTIAL_MASTER_KEY_1`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`

Important values:

- `DATABASE_URL` must keep the hostname `postgres`
- `REDIS_URL` must keep the hostname `redis`
- `CREDENTIAL_MASTER_KEY_1` must be a 64-character hex string
- `JWT_SECRET` must be a 64-character hex string

If you are converting from the root development `.env`, pay attention to these changes:

- replace `localhost` in `DATABASE_URL` with `postgres`
- replace `localhost` in `REDIS_URL` with `redis`
- replace `DB_HOST=localhost` with `DB_HOST=postgres`
- replace `REDIS_HOST=localhost` with `REDIS_HOST=redis`
- remove any `export ...` style lines and keep plain `KEY=value`
- do not reuse an invalid `JWT_SECRET`; it must be a real 64-character hex string
- if `MCP_ENABLED=true`, also set `MCP_SERVER_TOKEN`

## 4. Run the production deployment

Inside the deployment directory on the VPS:

```bash
bash deploy-production.sh
```

The script will:

- install Docker Engine and Docker Compose plugin on Debian-based systems
- create `.env` from `.env.example` if missing
- validate required production variables
- pull the image from `CHENGOS_IMAGE`
- start PostgreSQL, Redis, and ChengOS
- mount `./skills` into the app container

## 5. Check the running status

```bash
sudo docker compose --env-file .env -f docker-compose.yml ps
```

```bash
sudo docker compose --env-file .env -f docker-compose.yml logs -f chengos-app
```

```bash
curl http://127.0.0.1:3000/health
```

## 6. Common operations

Restart:

```bash
sudo docker compose --env-file .env -f docker-compose.yml restart
```

Stop:

```bash
sudo docker compose --env-file .env -f docker-compose.yml down
```

Update to a new image:

```bash
vi .env
# update CHENGOS_IMAGE if needed
bash deploy-production.sh
```

## 7. Notes

- `RUN_MIGRATIONS=true` is enabled by default, so pending database migrations run automatically at startup
- `skills/` is mounted from the VPS host, so skill changes do not require rebuilding the image
- production CORS is locked down by `.env`; do not set `CORS_PERMISSIVE=true` unless you really intend to open it
