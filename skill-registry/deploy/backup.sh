#!/usr/bin/env bash
# skill-registry backup: PostgreSQL dump + artifact store rsync.
#
# PostgreSQL is the source of truth; artifacts are content-addressed and
# immutable, so an rsync without --delete is always safe to re-run. Redis is
# deliberately NOT backed up (cache/accelerator only).
#
# Usage: backup.sh <backup-root>
# Cron:  15 3 * * * /usr/local/bin/skill-registry-backup /srv/backups/skill-registry

set -euo pipefail

BACKUP_ROOT="${1:?usage: backup.sh <backup-root>}"
ARTIFACT_ROOT="${REGISTRY_ARTIFACT_ROOT:-/var/lib/skill-registry/artifacts}"
DATABASE_URL="${DATABASE_URL:?DATABASE_URL must be set}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
KEEP_DAYS="${KEEP_DAYS:-14}"

mkdir -p "${BACKUP_ROOT}/db" "${BACKUP_ROOT}/artifacts"

# 1. Database dump (custom format: supports selective restore).
pg_dump --format=custom --no-owner --file="${BACKUP_ROOT}/db/skill_registry_${STAMP}.dump" "${DATABASE_URL}"

# 2. Artifact bytes. Immutable + content-addressed: additive sync, no
#    --delete, exclude in-flight work files.
rsync -a --exclude 'work/' "${ARTIFACT_ROOT}/" "${BACKUP_ROOT}/artifacts/"

# 3. Retention for database dumps (artifact mirror is cumulative).
find "${BACKUP_ROOT}/db" -name '*.dump' -mtime "+${KEEP_DAYS}" -delete

echo "backup complete: ${BACKUP_ROOT}/db/skill_registry_${STAMP}.dump"
