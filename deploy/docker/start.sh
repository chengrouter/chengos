#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENV_FILE="${SCRIPT_DIR}/../.env"
GENERATE_ENV="${SCRIPT_DIR}/../generate-env.sh"

REMOTE=false
WITH_BINDS=true
FORCE_ENV=false
PULL=false
DETACHED=true
EXTRA_ENV_ARGS=()
CORS_ORIGIN=""
PUBLIC_UI_URL=""
PUBLIC_APP_URL=""
PUBLIC_API_URL=""

log()  { printf '[chengos-docker] %s\n' "$*"; }
fail() { printf '[chengos-docker] ERROR: %s\n' "$*" >&2; exit 1; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || fail "Missing command: $1"; }

print_compose_diagnostics() {
  local compose_args=("$@")

  log "Compose startup failed; collecting diagnostics..."
  docker compose "${compose_args[@]}" --env-file "$ENV_FILE" ps || true
  docker compose "${compose_args[@]}" --env-file "$ENV_FILE" logs --tail 80 postgres redis qdrant api || true
}

usage() {
  cat <<'EOF'
Usage:
  bash start.sh [options]

Options:
  --remote               Use docker-compose.remote.yml override
  --no-binds             Do not mount optional host-editable skills/config overrides
  --force-env            Regenerate .env even if it already exists
  --cors-origin URL      Pass through to generate-env.sh
  --public-ui-url URL    Pass through to generate-env.sh
  --public-app-url URL   Pass through to generate-env.sh
  --public-api-url URL   Pass through to generate-env.sh
  --pull                 Pull images before starting
  --foreground           Run docker compose in foreground
  -h, --help             Show this help
EOF
}

find_source_root() {
  local candidate

  for candidate in "${SCRIPT_DIR}/../.." "${SCRIPT_DIR}/.." "${SCRIPT_DIR}"; do
    candidate="$(cd "$candidate" && pwd)"
    if [[ -d "${candidate}/skills" || -d "${candidate}/config" ]]; then
      printf '%s\n' "$candidate"
      return
    fi
  done

  printf '%s\n' "$SCRIPT_DIR"
}

replace_env_line() {
  local key="$1"
  local value="$2"

  KEY="$key" VALUE="$value" perl -0pi -e 's/^\Q$ENV{KEY}\E=.*/$ENV{KEY}."=".$ENV{VALUE}/me' "$ENV_FILE"
}

generate_env_fallback() {
  local env_example="${SCRIPT_DIR}/../.env.example"

  [[ -f "$env_example" ]] || fail "Missing template: ${env_example}"
  command -v openssl >/dev/null 2>&1 || fail "openssl is required to generate random secrets"
  command -v perl >/dev/null 2>&1 || fail "perl is required to update .env"

  local postgres_password redis_password credential_master_key_1 jwt_secret
  postgres_password="$(openssl rand -hex 16)"
  redis_password="$(openssl rand -hex 16)"
  credential_master_key_1="$(openssl rand -hex 32)"
  jwt_secret="$(openssl rand -hex 32)"

  cp "$env_example" "$ENV_FILE"
  replace_env_line "POSTGRES_PASSWORD" "$postgres_password"
  replace_env_line "REDIS_PASSWORD" "$redis_password"
  replace_env_line "DATABASE_URL" "postgres://tianai_db:${postgres_password}@127.0.0.1:5432/master_router"
  replace_env_line "REDIS_URL" "redis://:${redis_password}@127.0.0.1:6379"
  replace_env_line "QDRANT_URL" "http://127.0.0.1:6334"
  replace_env_line "DB_PASSWORD" "$postgres_password"
  replace_env_line "CREDENTIAL_MASTER_KEY_1" "$credential_master_key_1"
  replace_env_line "JWT_SECRET" "$jwt_secret"
  mkdir -p "${SCRIPT_DIR}/../workspace"
  replace_env_line "CHENG_CLI_ALLOWED_ROOTS" "${SCRIPT_DIR}/../workspace"

  if [[ "$REMOTE" == true && -n "$PUBLIC_UI_URL" && -n "$PUBLIC_APP_URL" ]]; then
    replace_env_line "CORS_ALLOWED_ORIGINS" "${PUBLIC_UI_URL},${PUBLIC_APP_URL}"
  elif [[ -n "$CORS_ORIGIN" ]]; then
    replace_env_line "CORS_ALLOWED_ORIGINS" "$CORS_ORIGIN"
  fi

  if [[ -n "$PUBLIC_UI_URL" ]]; then
    replace_env_line "PUBLIC_UI_URL" "$PUBLIC_UI_URL"
  fi

  if [[ -n "$PUBLIC_APP_URL" ]]; then
    replace_env_line "PUBLIC_APP_URL" "$PUBLIC_APP_URL"
  fi

  if [[ -n "$PUBLIC_API_URL" ]]; then
    replace_env_line "PUBLIC_API_URL" "$PUBLIC_API_URL"
  fi

  chmod 600 "$ENV_FILE" 2>/dev/null || true
  log "Created ${ENV_FILE} with generated secrets"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --remote)
      REMOTE=true
      shift
      ;;
    --no-binds)
      WITH_BINDS=false
      shift
      ;;
    --force-env)
      FORCE_ENV=true
      shift
      ;;
    --cors-origin)
      CORS_ORIGIN="${2:-}"
      [[ -n "$CORS_ORIGIN" ]] || fail "--cors-origin requires a value"
      EXTRA_ENV_ARGS+=("$1" "$2")
      shift 2
      ;;
    --public-ui-url)
      PUBLIC_UI_URL="${2:-}"
      [[ -n "$PUBLIC_UI_URL" ]] || fail "--public-ui-url requires a value"
      EXTRA_ENV_ARGS+=("$1" "$2")
      shift 2
      ;;
    --public-app-url)
      PUBLIC_APP_URL="${2:-}"
      [[ -n "$PUBLIC_APP_URL" ]] || fail "--public-app-url requires a value"
      EXTRA_ENV_ARGS+=("$1" "$2")
      shift 2
      ;;
    --public-api-url)
      PUBLIC_API_URL="${2:-}"
      [[ -n "$PUBLIC_API_URL" ]] || fail "--public-api-url requires a value"
      EXTRA_ENV_ARGS+=("$1" "$2")
      shift 2
      ;;
    --pull)
      PULL=true
      shift
      ;;
    --foreground)
      DETACHED=false
      shift
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

require_cmd docker
docker compose version >/dev/null 2>&1 || fail "docker compose plugin is required"

SOURCE_ROOT="$(find_source_root)"
log "Using source root: ${SOURCE_ROOT}"

log "Preparing runtime directories..."
mkdir -p "${SCRIPT_DIR}/../logs" "${SCRIPT_DIR}/../runtime" "${SCRIPT_DIR}/../models/paddle" "${SCRIPT_DIR}/../workspace"

if [[ ! -f "$ENV_FILE" || "$FORCE_ENV" == true ]]; then
  env_args=()
  if [[ "$FORCE_ENV" == true ]]; then
    env_args+=(--force)
  fi
  if [[ "$REMOTE" == true && -n "$PUBLIC_UI_URL" && -n "$PUBLIC_APP_URL" ]]; then
    env_args+=(--cors-origin "${PUBLIC_UI_URL},${PUBLIC_APP_URL}")
  fi
  env_args+=("${EXTRA_ENV_ARGS[@]}")
  log "Generating .env..."
  if [[ -f "$GENERATE_ENV" ]]; then
    bash "$GENERATE_ENV" "${env_args[@]}"
  else
    log "generate-env.sh not found; using built-in .env generator"
    generate_env_fallback
  fi
else
  log "Using existing .env"
fi

compose_files=(-f docker-compose.yml)
if [[ "$WITH_BINDS" == true ]]; then
  compose_files+=(-f docker-compose.binds.yml)
fi
if [[ "$REMOTE" == true ]]; then
  compose_files+=(-f docker-compose.remote.yml)
fi

if [[ "$PULL" == true ]]; then
  log "Pulling images..."
  docker compose "${compose_files[@]}" --env-file "$ENV_FILE" pull
fi

up_args=(up)
if [[ "$DETACHED" == true ]]; then
  up_args+=(-d)
fi

log "Starting ChengOS Docker stack..."
if ! docker compose "${compose_files[@]}" --env-file "$ENV_FILE" "${up_args[@]}"; then
  print_compose_diagnostics "${compose_files[@]}"
  fail "Docker stack failed to start"
fi

if [[ "$DETACHED" == true ]]; then
  log "Started."
  log "UI : http://localhost:8080"
  log "App: http://localhost:5055"
  log "API: http://localhost:3000"
  log "Logs: docker compose ${compose_files[*]} --env-file .env logs -f"
fi
