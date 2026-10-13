#!/usr/bin/env bash
set -euo pipefail

# Distributed environment generator.
# Delegates to the unified deploy/generate-env.sh so all modes share deploy/.env,
# then applies external VPS host overrides if vps_b_env.txt is present.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

VPS_ENV_FILE="${SCRIPT_DIR}/vps_b_env.txt"
ENV_FILE="${ROOT_DIR}/.env"
# A migrated instance keeps .env in env/ behind a compatibility symlink. Edit
# the real file: perl -i / sed -i replace whatever path they are given, and
# replacing the link would split the configuration in two.
ENV_FILE="$(readlink -f -- "$ENV_FILE" 2>/dev/null || printf '%s' "$ENV_FILE")"

log()  { printf '[chengos] %s\n' "$*"; }
fail() { printf '[chengos] ERROR: %s\n' "$*" >&2; exit 1; }

args=()

while [[ $# -gt 0 ]]; do
    case "$1" in
        --force)
            args+=("$1")
            shift
            ;;
        --cors-origin|--db-pool)
            [[ -n "${2:-}" ]] || fail "$1 requires a value"
            args+=("$1" "$2")
            shift 2
            ;;
        -h|--help)
            bash generate-env.sh --help
            exit 0
            ;;
        *)
            fail "Unknown argument: $1"
            ;;
    esac
done

bash generate-env.sh "${args[@]+"${args[@]}"}"

# Apply distributed-specific overrides if a VPS env file is present.
if [[ -f "$VPS_ENV_FILE" ]]; then
    log "Found ${VPS_ENV_FILE}! Applying external database configuration..."
    set -a; source "$VPS_ENV_FILE" 2>/dev/null || true; set +a

    db_host="${POSTGRES_HOST:-127.0.0.1}"
    qdrant_host="${QDRANT_HOST:-$db_host}"
    postgres_password="${POSTGRES_PASSWORD:-$(openssl rand -hex 16)}"
    redis_password="${REDIS_PASSWORD:-$(openssl rand -hex 16)}"

    overrides=(
        "POSTGRES_PASSWORD=${postgres_password}"
        "REDIS_PASSWORD=${redis_password}"
        "DB_PASSWORD=${postgres_password}"
        "DATABASE_URL=postgres://tianai_db:${postgres_password}@${db_host}:5432/master_router"
        "REDIS_URL=redis://:${redis_password}@${db_host}:6379"
        "QDRANT_URL=http://${qdrant_host}:6334"
    )
    # One locked transaction through the shared writer (lib/env-file.sh).
    if [[ -f "${ROOT_DIR}/lib/env-file.sh" ]]; then
        # shellcheck source=../lib/env-file.sh
        source "${ROOT_DIR}/lib/env-file.sh"
        envf_set "$ENV_FILE" --section "Distributed database overrides" "${overrides[@]}" \
            || fail "could not apply the distributed overrides to ${ENV_FILE}"
    else
        (
            exec 9>>"${ENV_FILE}.lock" || exit 1
            flock -w 30 9 || exit 1
            for kv in "${overrides[@]}"; do
                KEY="${kv%%=*}" VALUE="${kv#*=}" perl -0pi -e 's/^\Q$ENV{KEY}\E=.*/$ENV{KEY}."=".$ENV{VALUE}/me' "$ENV_FILE" || exit 1
            done
        ) || fail "could not apply the distributed overrides to ${ENV_FILE}"
    fi
fi

log "Created ${ENV_FILE} successfully!"
log "Next step: review ${ENV_FILE}, then run: bash start.sh"
