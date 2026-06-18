#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENV_EXAMPLE="${SCRIPT_DIR}/.env.example"
ENV_FILE="${SCRIPT_DIR}/.env"

FORCE=false
CORS_ORIGIN=""

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
        -h|--help)
            cat <<'EOF'
Usage:
  bash generate-env.sh [--cors-origin https://your-frontend.example.com] [--force]

Options:
  --cors-origin URL   Fill CORS_ALLOWED_ORIGINS with a real origin
  --force             Overwrite an existing .env file
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

postgres_password="$(openssl rand -hex 16)"
redis_password="$(openssl rand -hex 16)"
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
replace_env_line "DATABASE_URL" "postgres://tianai_db:${postgres_password}@127.0.0.1:5432/master_router"

enable_redis="${ENABLE_REDIS:-false}"
enable_qdrant="${ENABLE_QDRANT:-false}"
db_install_mode="${DB_INSTALL_MODE:-managed-process}"
ui_port="${UI_PORT:-8080}"
app_port="${APP_PORT:-5055}"

if [[ "$enable_redis" == "true" ]]; then
    replace_env_line "REDIS_URL" "redis://:${redis_password}@127.0.0.1:6379"
else
    replace_env_line "REDIS_URL" ""
fi

replace_env_line "QDRANT_URL" "http://127.0.0.1:6334"
replace_env_line "DB_PASSWORD" "${postgres_password}"
replace_env_line "CREDENTIAL_MASTER_KEY_1" "${credential_master_key_1}"
replace_env_line "JWT_SECRET" "${jwt_secret}"
replace_env_line "DB_INSTALL_MODE" "${db_install_mode}"
replace_env_line "ENABLE_REDIS" "${enable_redis}"
replace_env_line "ENABLE_QDRANT" "${enable_qdrant}"
replace_env_line "UI_PORT" "${ui_port}"
replace_env_line "APP_PORT" "${app_port}"

if [[ -n "$CORS_ORIGIN" ]]; then
    replace_env_line "CORS_ALLOWED_ORIGINS" "${CORS_ORIGIN}"
fi

chmod 600 "$ENV_FILE" 2>/dev/null || true

log "Created ${ENV_FILE} with generated secrets"
if [[ -z "$CORS_ORIGIN" ]]; then
    log "CORS_ALLOWED_ORIGINS is still a placeholder; edit ${ENV_FILE} before production use"
fi
log "Next step: review ${ENV_FILE}, then run: bash start.sh"
