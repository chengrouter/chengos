# skill-registry

Independent ChengOS Skills Registry: public catalog/search/download, publisher
authentication for publishing, immutable content-addressed artifact storage,
registry-side scanning, and moderation. One Rust binary + PostgreSQL + Redis +
local artifact storage + Nginx.

## Trust boundaries (non-negotiable)

- The Registry never receives ChengFlow passwords, tokens, workspace
  credentials, or credential bindings. Publisher identity arrives only as a
  signed, short-lived ChengFlow Identity Assertion.
- The Registry never executes skills. Scan results are evidence for reviewers
  and for ChengFlow — they never replace ChengFlow local validation.
- Published release artifacts, manifests, and digests are immutable.
- Redis is an accelerator (cache, counters, rate limits, job delivery).
  PostgreSQL is the only source of business truth; the registry keeps serving
  public reads and downloads when Redis is down.
- User input never determines artifact storage paths (content-addressed by
  SHA-256 only).

This package is an independent Cargo workspace. It must not join the
`chengflow` workspace or depend on `cheng-*` crates. Package format
compatibility is governed by `../skill-package-spec`.

## Local development

```bash
# 1. Dependencies
docker run -d --name reg-pg -e POSTGRES_DB=skill_registry \
  -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
docker run -d --name reg-redis -p 6379:6379 redis:7

# 2. Configure (defaults work for the setup above)
cp .env.example .env

# 3. Apply migrations (the only command that mutates schema)
cargo run -- migrate

# 4. Run API + workers in one process
cargo run -- serve
```

Health probes: `GET /health/live` (process only, no dependencies touched) and
`GET /health/ready` (PostgreSQL, migration version, artifact root, Redis
degradation state). Metrics: `GET /metrics` (Prometheus).

## Commands

```bash
skill-registry serve              # HTTP API + background workers
skill-registry migrate            # apply pending migrations explicitly
skill-registry admin dead-letters # inspect dead-lettered jobs
skill-registry admin requeue-job <id>
skill-registry admin quarantine-release <id> --reason "..."
skill-registry admin revoke-token <id>
skill-registry admin show-config  # effective config, secrets redacted
```

`REGISTRY_RUN_JOBS=false` turns `serve` into an API-only node so API and
worker roles can be split across processes later without code changes.

## Test

```bash
cargo test                        # unit + fixture contract tests
DATABASE_URL=... cargo test -- --ignored   # repository/API tests needing PostgreSQL
```

The shared Package v1 fixtures in `../skill-package-spec/fixtures` are part of
the test suite; changing the package format requires updating fixtures and the
spec together.

## Build & deploy

```bash
cargo build --release             # single binary target/release/skill-registry
```

Deployment assets live in `deploy/`: `Dockerfile`, `docker-compose.yml`,
`skill-registry.service` (systemd), `nginx.conf.example`, `backup.sh`,
`restore.md`, `logrotate.conf.example`. Operations runbook: `docs/runbook.md`.

Production startup verifies the migration version and refuses to run on a
mismatched schema — it never modifies the database silently. See
`migrations/README.md` for the migration policy.
