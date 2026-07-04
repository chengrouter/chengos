# ChengHub

Shared cloud service for ChengFlow deployments: unified identity (GitHub /
WeChat OAuth + device authorization for local instances) and the community
board (feature requests, experience sharing, sanitized workflow sharing,
moderation, admin operations).

Independent Rust crate — not a member of the `chengflow` Cargo workspace and
free of `cheng-*` dependencies, mirroring `skill-registry`.

## Local setup

```bash
createdb chenghub
cp .env.example .env            # fill DATABASE_URL etc.
cargo run -- migrate            # apply schema (the only schema-mutating command)
cargo run -- serve              # http://127.0.0.1:8400
```

Redis is optional in development: without it, rate limits fail open and
OAuth state falls back to an in-process store (single instance only).

## OAuth providers

A provider is enabled when both its credentials are configured:

| Provider | Env vars | Callback URL |
| --- | --- | --- |
| GitHub | `CHENGHUB_GITHUB_CLIENT_ID/SECRET` | `{public_url}/api/v1/auth/github/callback` |
| WeChat | `CHENGHUB_WECHAT_APP_ID/SECRET` | `{public_url}/api/v1/auth/wechat/callback` |
| QQ (off by default) | `CHENGHUB_QQ_APP_ID/SECRET` | `{public_url}/api/v1/auth/qq/callback` |

Local ChengFlow instances bind via the OAuth 2.0 Device Authorization Flow:
`POST /api/v1/auth/device/code`, user approves at `{public_url}/device`,
client polls `POST /api/v1/auth/device/token`.

## Admin bootstrap

```bash
# grant a role to an existing (OAuth-created) user
cargo run -- admin grant-role <username> admin
# or auto-grant on first login:
CHENGHUB_BOOTSTRAP_ADMINS=your-github-login cargo run -- serve
```

Roles: `moderator` (content moderation), `operator` (requirement triage),
`admin` (everything, incl. role management).

## Tests

Unit tests run standalone. Integration tests need a scratch database and
run only when `CHENGHUB_TEST_DATABASE_URL` is set:

```bash
createdb chenghub_test
CHENGHUB_TEST_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/chenghub_test cargo test
```

## Deployment

`deploy/` contains a Dockerfile, a docker-compose stack (chenghub +
PostgreSQL + Redis + Caddy), and Caddy/Nginx reverse-proxy examples.
Production hard-requires: https `public_url`, `cookies.secure = true`, and
a non-default `CHENGHUB_TOKEN_HMAC_SECRET` (>= 32 chars). Health endpoints:
`/healthz`, `/readyz`, `/metrics`.
