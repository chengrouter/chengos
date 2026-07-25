#!/usr/bin/env bash
set -euo pipefail

# Unified environment generator for ChengOS.
# Creates a single deploy/.env shared by hybrid, docker, and distributed modes.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
cd "$ROOT_DIR"

ENV_EXAMPLE="${ROOT_DIR}/.env.example"
ENV_FILE="${ROOT_DIR}/.env"

FORCE=false
CORS_ORIGIN=""
UI_PORT=""
APP_PORT=""
DB_INSTALL_MODE=""
ENABLE_REDIS=""
ENABLE_QDRANT=""
CLI_WORKSPACE=""
PUBLIC_UI_URL=""
PUBLIC_APP_URL=""
PUBLIC_API_URL=""
DB_POOL=""

log()  { printf '[chengos] %s\n' "$*"; }
fail() { printf '[chengos] ERROR: %s\n' "$*" >&2; exit 1; }

usage() {
    cat <<'EOF'
Usage:
  bash generate-env.sh [options]

Options:
  --force                  Overwrite an existing .env file
  --cors-origin URL        Fill CORS_ALLOWED_ORIGINS with a real origin
  --ui-port PORT           Set UI_PORT
  --app-port PORT          Set APP_PORT
  --db-install-mode MODE   Set DB_INSTALL_MODE (managed-process|system-service)
  --enable-redis true|false   Set ENABLE_REDIS
  --enable-qdrant true|false  Set ENABLE_QDRANT
  --cli-workspace PATH     Set CHENG_CLI_ALLOWED_ROOTS to an absolute workspace path
  --public-ui-url URL      Set PUBLIC_UI_URL (docker deployments)
  --public-app-url URL     Set PUBLIC_APP_URL (docker deployments)
  --public-api-url URL     Set PUBLIC_API_URL (docker deployments)
  --db-pool NUMBER         Set database and redis max connection pool size
  -h, --help               Show this help

Generates deploy/.env from deploy/.env.example.
Docker mode overrides connection URLs to service names at runtime via docker-compose.yml.
EOF
}

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
        --ui-port)
            UI_PORT="${2:-}"
            [[ -n "$UI_PORT" ]] || fail "--ui-port requires a value"
            shift 2
            ;;
        --app-port)
            APP_PORT="${2:-}"
            [[ -n "$APP_PORT" ]] || fail "--app-port requires a value"
            shift 2
            ;;
        --db-install-mode)
            DB_INSTALL_MODE="${2:-}"
            [[ -n "$DB_INSTALL_MODE" ]] || fail "--db-install-mode requires a value"
            shift 2
            ;;
        --enable-redis)
            ENABLE_REDIS="${2:-}"
            [[ -n "$ENABLE_REDIS" ]] || fail "--enable-redis requires a value"
            shift 2
            ;;
        --enable-qdrant)
            ENABLE_QDRANT="${2:-}"
            [[ -n "$ENABLE_QDRANT" ]] || fail "--enable-qdrant requires a value"
            shift 2
            ;;
        --cli-workspace)
            CLI_WORKSPACE="${2:-}"
            [[ -n "$CLI_WORKSPACE" ]] || fail "--cli-workspace requires a value"
            shift 2
            ;;
        --public-ui-url)
            PUBLIC_UI_URL="${2:-}"
            [[ -n "$PUBLIC_UI_URL" ]] || fail "--public-ui-url requires a value"
            shift 2
            ;;
        --public-app-url)
            PUBLIC_APP_URL="${2:-}"
            [[ -n "$PUBLIC_APP_URL" ]] || fail "--public-app-url requires a value"
            shift 2
            ;;
        --public-api-url)
            PUBLIC_API_URL="${2:-}"
            [[ -n "$PUBLIC_API_URL" ]] || fail "--public-api-url requires a value"
            shift 2
            ;;
        --db-pool)
            DB_POOL="${2:-}"
            [[ -n "$DB_POOL" ]] || fail "--db-pool requires a value"
            shift 2
            ;;
        -h|--help)
            usage
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

    KEY="$key" VALUE="$value" perl -0pi -e 's/^(#+\s*)?\Q$ENV{KEY}\E=.*/$ENV{KEY}."=".$ENV{VALUE}/me' "$ENV_FILE"
}

replace_env_line "POSTGRES_PASSWORD" "${postgres_password}"
replace_env_line "REDIS_PASSWORD" "${redis_password}"
replace_env_line "DATABASE_URL" "postgres://tianai_db:${postgres_password}@127.0.0.1:5432/master_router"
replace_env_line "DB_PASSWORD" "${postgres_password}"

enable_redis="${ENABLE_REDIS:-false}"
if [[ "$enable_redis" == "true" ]]; then
    replace_env_line "REDIS_URL" "redis://:${redis_password}@127.0.0.1:6379"
else
    replace_env_line "REDIS_URL" ""
fi

replace_env_line "QDRANT_URL" "http://127.0.0.1:6334"
replace_env_line "CREDENTIAL_MASTER_KEY_1" "${credential_master_key_1}"
replace_env_line "JWT_SECRET" "${jwt_secret}"

[[ -n "$DB_INSTALL_MODE" ]] && replace_env_line "DB_INSTALL_MODE" "${DB_INSTALL_MODE}"
[[ -n "$ENABLE_REDIS" ]] && replace_env_line "ENABLE_REDIS" "${ENABLE_REDIS}"
[[ -n "$ENABLE_QDRANT" ]] && replace_env_line "ENABLE_QDRANT" "${ENABLE_QDRANT}"
[[ -n "$UI_PORT" ]] && replace_env_line "UI_PORT" "${UI_PORT}"
[[ -n "$APP_PORT" ]] && replace_env_line "APP_PORT" "${APP_PORT}"

if [[ -n "$CLI_WORKSPACE" ]]; then
    mkdir -p "$CLI_WORKSPACE"
    CLI_WORKSPACE="$(cd "$CLI_WORKSPACE" && pwd)"
    replace_env_line "CHENG_CLI_ALLOWED_ROOTS" "${CLI_WORKSPACE}"
fi

# Resolve global config and workflow template directories relative to the
# deploy root (shared_dir). These are only set for native deployments; Docker
# sets them via docker-compose.yml environment block.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -d "${SCRIPT_DIR}/config" ]]; then
    replace_env_line "CHENG_GLOBAL_CONFIG_DIR" "${SCRIPT_DIR}/config"
fi
if [[ -d "${SCRIPT_DIR}/workflow-templates" ]]; then
    replace_env_line "TEMPLATE_WORKFLOWS_DIR" "${SCRIPT_DIR}/workflow-templates"
fi

[[ -n "$CORS_ORIGIN" ]] && replace_env_line "CORS_ALLOWED_ORIGINS" "${CORS_ORIGIN}"
[[ -n "$PUBLIC_UI_URL" ]] && replace_env_line "PUBLIC_UI_URL" "${PUBLIC_UI_URL}"
[[ -n "$PUBLIC_APP_URL" ]] && replace_env_line "PUBLIC_APP_URL" "${PUBLIC_APP_URL}"
[[ -n "$PUBLIC_API_URL" ]] && replace_env_line "PUBLIC_API_URL" "${PUBLIC_API_URL}"
[[ -n "$DB_POOL" ]] && replace_env_line "DATABASE_MAX_CONNECTIONS" "${DB_POOL}" && replace_env_line "REDIS_MAX_CONNECTIONS" "${DB_POOL}"

chmod 600 "$ENV_FILE" 2>/dev/null || true

log "Created ${ENV_FILE} with generated secrets"
log "Review ${ENV_FILE}, then run the start script for your deployment mode"
