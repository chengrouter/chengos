#!/usr/bin/env bash
set -euo pipefail

# Unified environment generator for ChengOS.
# Creates a single deploy/.env shared by hybrid, docker, and distributed modes.
#
# The generated .env is INSTANCE-OWNED: it sits at the installation root, not
# inside any package-owned directory, and it is never staged, backed up,
# replaced, or removed by `chengos.sh update` / `rollback` (see
# deploy/lib/release-update.sh). Only .env.example is package-owned, so a new
# release can introduce settings without ever overwriting operator values.
#
# CHENGOS_VERSION lives in this file for Docker installations: it is the single
# release pin from which API, UI, App, and CLI resolve their image tags, and the
# updater rewrites it only after the selected release has been verified.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
cd "$ROOT_DIR"

ENV_EXAMPLE="${ROOT_DIR}/.env.example"
ENV_FILE="${ROOT_DIR}/.env"
# A migrated instance keeps .env in env/ behind a compatibility symlink. Edit
# the real file: perl -i / sed -i replace whatever path they are given, and
# replacing the link would split the configuration in two.
ENV_FILE="$(readlink -f -- "$ENV_FILE" 2>/dev/null || printf '%s' "$ENV_FILE")"

FORCE=false
ALLOW_RUNNING=false
CORS_ORIGIN=""
UI_PORT=""
APP_PORT=""
DB_INSTALL_MODE=""
ENABLE_REDIS=""
ENABLE_QDRANT=""
CLI_WORKSPACE=""
WORKSPACE_ROOT=""
BROWSER_PROFILE_ROOT=""
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
  --force                  Overwrite an existing .env file (regenerates every
                           secret; refused while this instance is running)
  --allow-running          With --force: proceed even though ChengOS appears
                           to be running (maintenance use only)
  --cors-origin URL        Fill CORS_ALLOWED_ORIGINS with a real origin
  --ui-port PORT           Set UI_PORT
  --app-port PORT          Set APP_PORT
  --db-install-mode MODE   Set DB_INSTALL_MODE (managed-process|system-service)
  --enable-redis true|false   Set ENABLE_REDIS
  --enable-qdrant true|false  Set ENABLE_QDRANT
  --cli-workspace PATH     Set CHENG_CLI_ALLOWED_ROOTS to an absolute workspace path
  --workspace-root PATH    Set CHENG_WORKSPACE_ROOT to an absolute workspace root path
  --browser-profile-root PATH
                           Set BROWSER_PROFILE_ROOT (remembered browser sign-in;
                           default: <install root>/runtime/browser-profiles)
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
        --allow-running)
            ALLOW_RUNNING=true
            shift
            ;;
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
        --workspace-root)
            WORKSPACE_ROOT="${2:-}"
            [[ -n "$WORKSPACE_ROOT" ]] || fail "--workspace-root requires a value"
            shift 2
            ;;
        --browser-profile-root)
            BROWSER_PROFILE_ROOT="${2:-}"
            [[ -n "$BROWSER_PROFILE_ROOT" ]] || fail "--browser-profile-root requires a value"
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

# A forced regeneration replaces the database password, JWT secret and the
# credential master key. Under a running instance that breaks database access
# and every session, and it would race the settings panel's own writes, so it
# is a maintenance-window operation: stop ChengOS first.
instance_running() {
    if command -v pgrep >/dev/null 2>&1 && pgrep -f -- "${ROOT_DIR}/bin/cheng-api" >/dev/null 2>&1; then
        return 0
    fi
    # A running API container of THIS installation (its mounts come from here).
    if command -v docker >/dev/null 2>&1; then
        local id
        for id in $(docker ps -q --filter 'name=^chengos-api$' 2>/dev/null); do
            if docker inspect -f '{{range .Mounts}}{{.Source}}{{"\n"}}{{end}}' "$id" 2>/dev/null \
                | grep -q -- "^${ROOT_DIR}/"; then
                return 0
            fi
        done
    fi
    return 1
}
if [[ -f "$ENV_FILE" && "$FORCE" == true && "$ALLOW_RUNNING" != true ]] && instance_running; then
    fail "ChengOS appears to be running. Stop it first (./chengos.sh stop): --force regenerates every secret. Use --allow-running only in a maintenance window."
fi

command -v openssl >/dev/null 2>&1 || fail "openssl is required to generate random secrets"

postgres_password="$(openssl rand -hex 16)"
redis_password="$(openssl rand -hex 16)"
credential_master_key_1="$(openssl rand -hex 32)"
jwt_secret="$(openssl rand -hex 32)"

# Build the complete file in a staged copy next to the target, then commit it
# once under the shared .env lock (lib/env-file.sh), so a generator never
# interleaves with the settings panel or another script.
mkdir -p "$(dirname "$ENV_FILE")"
STAGED="$(mktemp "$(dirname "$ENV_FILE")/.env.generate.XXXXXX")" || fail "cannot stage ${ENV_FILE}"
trap 'rm -f -- "$STAGED"' EXIT
chmod 600 "$STAGED"
cp "$ENV_EXAMPLE" "$STAGED"

replace_env_line() {
    local key="$1"
    local value="$2"

    if command -v perl > /dev/null 2>&1; then
        KEY="$key" VALUE="$value" perl -0pi -e 's/^(#+\s*)?\Q$ENV{KEY}\E=.*/$ENV{KEY}."=".$ENV{VALUE}/me' "$STAGED"
    else
        # sed fallback: use | as delimiter (the pattern contains # for matching commented lines)
        # escape & and | in the replacement value
        local escaped_value="${value//&/\\&}"
        escaped_value="${escaped_value//|/\\|}"
        sed -i "s|^\(#*[[:space:]]*\)${key}=.*|${key}=${escaped_value}|" "$STAGED"
    fi
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

if [[ -n "$WORKSPACE_ROOT" ]]; then
    mkdir -p "$WORKSPACE_ROOT"
    WORKSPACE_ROOT="$(cd "$WORKSPACE_ROOT" && pwd)"
    replace_env_line "CHENG_WORKSPACE_ROOT" "${WORKSPACE_ROOT}"
fi

# Remembered browser sign-in keeps per-user Chrome profiles under one private
# directory. Point the (still disabled) setting at the instance's runtime/ so
# enabling it later is a single switch; Docker pins its own container path.
# The API creates the directory with mode 0700 on first use.
if [[ -n "$BROWSER_PROFILE_ROOT" ]]; then
    case "$BROWSER_PROFILE_ROOT" in
        /*) ;;
        *) fail "--browser-profile-root must be an absolute path" ;;
    esac
    replace_env_line "BROWSER_PROFILE_ROOT" "${BROWSER_PROFILE_ROOT}"
else
    replace_env_line "BROWSER_PROFILE_ROOT" "${ROOT_DIR}/runtime/browser-profiles"
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

# Point the API at this file so the deployment settings panel can edit it.
# Native deployments read the host path directly; Docker overrides this with
# the in-container mount path in docker-compose.yml, because compose's
# `env_file` injects the variables without exposing the file itself.
replace_env_line "CHENGOS_ENV_FILE" "${ENV_FILE}"

[[ -n "$CORS_ORIGIN" ]] && replace_env_line "CORS_ALLOWED_ORIGINS" "${CORS_ORIGIN}"
[[ -n "$PUBLIC_UI_URL" ]] && replace_env_line "PUBLIC_UI_URL" "${PUBLIC_UI_URL}"
[[ -n "$PUBLIC_APP_URL" ]] && replace_env_line "PUBLIC_APP_URL" "${PUBLIC_APP_URL}"
[[ -n "$PUBLIC_API_URL" ]] && replace_env_line "PUBLIC_API_URL" "${PUBLIC_API_URL}"
[[ -n "$DB_POOL" ]] && replace_env_line "DATABASE_MAX_CONNECTIONS" "${DB_POOL}" && replace_env_line "REDIS_MAX_CONNECTIONS" "${DB_POOL}"

# Commit. --if-absent re-checks existence under the lock for a non-forced run.
commit_mode=""
[[ "$FORCE" == true ]] || commit_mode="--if-absent"
if [[ -f "${ROOT_DIR}/lib/env-file.sh" ]]; then
    # shellcheck source=lib/env-file.sh
    source "${ROOT_DIR}/lib/env-file.sh"
    envf_replace_file "$ENV_FILE" "$STAGED" $commit_mode \
        || fail "could not write ${ENV_FILE}"
else
    # Minimal fallback for layouts without lib/: the same lock file and rules.
    (
        exec 9>>"${ENV_FILE}.lock" || exit 1
        flock -w "${ENVF_LOCK_TIMEOUT:-30}" 9 || { echo "timed out waiting for ${ENV_FILE}.lock" >&2; exit 1; }
        [[ -n "$commit_mode" && -e "$ENV_FILE" ]] && exit 3
        if [[ -e "$ENV_FILE" ]]; then
            cp -p -- "$ENV_FILE" "${ENV_FILE}.bak" || exit 1
            cat -- "$STAGED" > "$ENV_FILE" || exit 1
        else
            mv -f -- "$STAGED" "$ENV_FILE" || exit 1
        fi
    ) || fail "could not write ${ENV_FILE}"
fi
# Modes: a new file keeps the staged 0600; a replaced file keeps its own mode
# (0660 for a Docker env/ layout whose API container must write it).

log "Created ${ENV_FILE} with generated secrets"
log "Review ${ENV_FILE}, then run the start script for your deployment mode"
