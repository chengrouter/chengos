#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENV_EXAMPLE="${SCRIPT_DIR}/.env.example"
ENV_FILE="${SCRIPT_DIR}/.env"

FORCE=false
CORS_ORIGIN=""
PUBLIC_UI_URL=""
PUBLIC_APP_URL=""
PUBLIC_API_URL=""

log()  { printf '[chengos-docker] %s\n' "$*"; }
fail() { printf '[chengos-docker] ERROR: %s\n' "$*" >&2; exit 1; }

usage() {
  cat <<'EOF'
Usage:
  bash generate-env.sh [options]

Options:
  --cors-origin URL      Fill CORS_ALLOWED_ORIGINS with one origin
  --public-ui-url URL    Set PUBLIC_UI_URL
  --public-app-url URL   Set PUBLIC_APP_URL
  --public-api-url URL   Set PUBLIC_API_URL
  --force                Overwrite an existing .env file
  -h, --help             Show this help
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

  KEY="$key" VALUE="$value" perl -0pi -e 's/^\Q$ENV{KEY}\E=.*/$ENV{KEY}."=".$ENV{VALUE}/me' "$ENV_FILE"
}

replace_env_line "POSTGRES_PASSWORD" "${postgres_password}"
replace_env_line "REDIS_PASSWORD" "${redis_password}"
replace_env_line "DATABASE_URL" "postgres://tianai_db:${postgres_password}@postgres:5432/master_router"
replace_env_line "REDIS_URL" "redis://:${redis_password}@redis:6379"
replace_env_line "QDRANT_URL" "http://qdrant:6334"
replace_env_line "DB_PASSWORD" "${postgres_password}"
replace_env_line "CREDENTIAL_MASTER_KEY_1" "${credential_master_key_1}"
replace_env_line "JWT_SECRET" "${jwt_secret}"
replace_env_line "CHENG_CLI_ALLOWED_ROOTS" "/app/workspace"
mkdir -p "${SCRIPT_DIR}/workspace"

if [[ -n "$CORS_ORIGIN" ]]; then
  replace_env_line "CORS_ALLOWED_ORIGINS" "${CORS_ORIGIN}"
fi

if [[ -n "$PUBLIC_UI_URL" ]]; then
  replace_env_line "PUBLIC_UI_URL" "${PUBLIC_UI_URL}"
fi

if [[ -n "$PUBLIC_APP_URL" ]]; then
  replace_env_line "PUBLIC_APP_URL" "${PUBLIC_APP_URL}"
fi

if [[ -n "$PUBLIC_API_URL" ]]; then
  replace_env_line "PUBLIC_API_URL" "${PUBLIC_API_URL}"
fi

chmod 600 "$ENV_FILE" 2>/dev/null || true

log "Created ${ENV_FILE} with generated Docker-network secrets"
log "Review ${ENV_FILE}, then run: bash start.sh"
