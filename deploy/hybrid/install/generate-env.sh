#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ENV_EXAMPLE="${SCRIPT_DIR}/.env.example"
ENV_FILE="${ROOT_DIR}/.env"
VPS_ENV_FILE="${SCRIPT_DIR}/vps_b_env.txt"

FORCE=false
CORS_ORIGIN=""
DB_POOL=""

log()  { printf '[chengos] %s\n' "$*"; }
fail() { printf '[chengos] ERROR: %s\n' "$*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
    case "$1" in
        --force)
            FORCE=true
            shift
            ;;
        --cors-origin)
            CORS_ORIGIN="${2:-}"
            [[ -n "$CORS_ORIGIN" ]] || fail "--cors-origin requires a value"
            shift 2
            ;;
        --db-pool)
            DB_POOL="${2:-}"
            [[ -n "$DB_POOL" ]] || fail "--db-pool requires a number"
            shift 2
            ;;
        -h|--help)
            cat <<'EOF'
Usage:
  bash generate-env.sh [--cors-origin https://your-frontend.example.com] [--force] [--db-pool <number>]

Options:
  --cors-origin URL   Fill CORS_ALLOWED_ORIGINS with a real origin
  --force             Overwrite an existing .env file
  --db-pool NUMBER    Set the database and redis max connection pool size (Default: 10)
  -h, --help          Show this help
EOF
            exit 0
            ;;
        *)
            fail "Unknown argument: $1"
            ;;
    esac
done

[[ -f "$ENV_EXAMPLE" ]] || fail "Missing template: ${ENV_EXAMPLE}"

if [[ -f "$ENV_FILE" && "$FORCE" != true ]]; then
    fail "${ENV_FILE} already exists. Use --force to overwrite it."
fi

command -v openssl >/dev/null 2>&1 || fail "openssl is required to generate random secrets"

if [[ -f "$VPS_ENV_FILE" ]]; then
    log "Found ${VPS_ENV_FILE}! Loading database configuration from VPS A..."
    # source the file securely, ignoring empty lines and comments
    set -a; source "$VPS_ENV_FILE" 2>/dev/null || true; set +a
    
    db_host="${POSTGRES_HOST:-127.0.0.1}"
    qdrant_host="${QDRANT_HOST:-$db_host}"
    postgres_password="${POSTGRES_PASSWORD:-$(openssl rand -hex 16)}"
    redis_password="${REDIS_PASSWORD:-$(openssl rand -hex 16)}"
else
    log "No ${VPS_ENV_FILE} found. Using local/random fallback credentials."
    db_host="127.0.0.1"
    qdrant_host="127.0.0.1"
    postgres_password="$(openssl rand -hex 16)"
    redis_password="$(openssl rand -hex 16)"
fi

credential_master_key_1="$(openssl rand -hex 32)"
jwt_secret="$(openssl rand -hex 32)"

cp "$ENV_EXAMPLE" "$ENV_FILE"

replace_env_line() {
    local key="$1"
    local value="$2"

    KEY="$key" VALUE="$value" perl -0pi -e 's/^\Q$ENV{KEY}\E=.*/$ENV{KEY}."=".$ENV{VALUE}/me' "$ENV_FILE"
}

replace_env_line "POSTGRES_PASSWORD" "${postgres_password}"
replace_env_line "REDIS_PASSWORD" "${redis_password}"
replace_env_line "DATABASE_URL" "postgres://tianai_db:${postgres_password}@${db_host}:5432/master_router"
replace_env_line "REDIS_URL" "redis://:${redis_password}@${db_host}:6379"
replace_env_line "QDRANT_URL" "http://${qdrant_host}:6334"
replace_env_line "DB_PASSWORD" "${postgres_password}"
replace_env_line "CREDENTIAL_MASTER_KEY_1" "${credential_master_key_1}"
replace_env_line "JWT_SECRET" "${jwt_secret}"

if [[ -n "$DB_POOL" ]]; then
    replace_env_line "DATABASE_MAX_CONNECTIONS" "${DB_POOL}"
    replace_env_line "REDIS_MAX_CONNECTIONS" "${DB_POOL}"
fi

if [[ -n "$CORS_ORIGIN" ]]; then
    replace_env_line "CORS_ALLOWED_ORIGINS" "${CORS_ORIGIN}"
fi

chmod 600 "$ENV_FILE" 2>/dev/null || true

log "Created ${ENV_FILE} successfully!"
if [[ -z "$CORS_ORIGIN" ]]; then
    log "CORS_ALLOWED_ORIGINS is still a placeholder; edit ${ENV_FILE} before production use"
fi
log "Next step: review ${ENV_FILE}, then run: bash start.sh"
