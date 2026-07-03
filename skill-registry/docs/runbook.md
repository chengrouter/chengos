# skill-registry operations runbook

## Architecture in one paragraph

Axum HTTP API + background workers in one binary. PostgreSQL is the only
source of truth (catalog, releases, audit, job outbox, download aggregates).
The filesystem artifact store holds immutable, content-addressed package
bytes (`sha256/ab/cd/<digest>`). Redis accelerates: cache, rate limits,
download counters, job delivery — losing Redis degrades latency and
protection, never correctness or data.

## Start / stop / deploy

```bash
skill-registry migrate               # apply schema (only command that does)
skill-registry serve                 # API + workers (REGISTRY_RUN_JOBS=0 for API-only)
skill-registry admin show-config     # effective, secret-redacted config
```

`serve` refuses to start when migrations are pending
(`database.require_migrations_applied = true`). Deploy order: stop one
instance → `migrate` → start new binary. Migrations are additive-only;
the previous binary keeps working against the migrated schema.

Graceful shutdown (SIGTERM): readiness flips to 503 → HTTP drains →
background loops stop → running jobs get the lease budget to finish;
anything cut off is reclaimed via lease expiry.

## Health & dashboards

* `GET /health/live` — process up.
* `GET /health/ready` — PostgreSQL + artifact storage reachable; reports
  Redis as informational.
* `GET /metrics` — Prometheus. Key series:
  * `registry_redis_errors_total` rising → Redis degradation (see below)
  * `registry_job_backlog{job_type}` → worker starvation / stuck jobs
  * `registry_job_dead_letters_total` → failing jobs needing attention
  * `registry_http_errors_total` → 5xx by route
  * `registry_artifact_bytes` vs volume size → capacity planning

## Common incidents

### Redis down
Symptoms: `registry_redis_errors_total` climbing, slower catalog reads.
Impact: no cache, no rate limits, downloads not counted, job pickup falls
back to outbox polling (`jobs.outbox_poll_interval_secs`). **No action
required** beyond restoring Redis; nothing needs replay.

### Disk full (artifact volume)
Uploads fail with stable code `STORAGE_FULL` (HTTP 507); downloads keep
working. Free space (grow volume; check `work/` for orphans — the cleanup
job removes files older than `jobs.cleanup_min_age_secs`).

### Scan jobs stuck / dead-lettered
```bash
skill-registry admin dead-letters
skill-registry admin requeue-job <job-id>
```
A release stuck in `scanning` after a worker crash returns to `uploaded`
automatically when the job lease expires and the retry runs.

### Malicious package published
```bash
skill-registry admin quarantine-release <release-id> --reason "..."
```
or `POST /api/v1/admin/releases/{id}/quarantine`. Quarantine blocks all
downloads immediately (including pinned). Follow with
`POST /api/v1/admin/publishers/{id}/ban` if the publisher is hostile, and
`POST /api/v1/admin/releases/{id}/rescan` after policy updates.

### Leaked publisher token
```bash
skill-registry admin revoke-token <token-id>
```
Tokens are stored only as HMAC hashes; rotating `REGISTRY_TOKEN_HMAC_SECRET`
invalidates **every** token at once (publishers re-run the grant flow).

## Backup / restore

`deploy/backup.sh` (pg_dump + artifact rsync, additive). Restore:
`deploy/restore.md`. Redis is never backed up or restored.

## Configuration

Order: defaults → TOML (`--config` / `REGISTRY_CONFIG`) → env vars
(`.env.example` lists them). Production hard requirements enforced at boot:
https `public_url`, non-default `REGISTRY_TOKEN_HMAC_SECRET` (≥32 chars),
non-default `REGISTRY_COUNTER_HMAC_KEY`, https-only CORS origins.

## Security invariants (do not "fix" these)

* The registry never receives ChengFlow credentials — only Ed25519-signed
  identity assertions and registry-issued tokens.
* Published artifacts/manifests/digests are immutable (DB triggers enforce).
* Audit, moderation, and scan-report tables are append-only (triggers).
* Storage paths derive from digests only, never from user input.
* Registry approval is advisory; ChengFlow's local validation is the final
  safety boundary — marketplace installs arrive disabled + needs-review.
