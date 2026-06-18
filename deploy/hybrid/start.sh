#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENV_FILE="${SCRIPT_DIR}/.env"
ENV_EXAMPLE="${SCRIPT_DIR}/.env.example"
BINARY="${SCRIPT_DIR}/bin/cheng-api"

log()  { printf '[chengos] %s\n' "$*"; }
fail() { printf '[chengos] ERROR: %s\n' "$*" >&2; exit 1; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || fail "Missing command: $1"; }

mkdir -p "${SCRIPT_DIR}/logs" "${SCRIPT_DIR}/runtime" "${SCRIPT_DIR}/skills" "${SCRIPT_DIR}/ui" "${SCRIPT_DIR}/app"

# ── Parse Arguments ──────────────────────────────────────────────────────────
WITH_MODULES="api,ui,app"
DB_MODE_OVERRIDE=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --with)
            WITH_MODULES="${2:-}"
            shift 2
            ;;
        --db-install-mode)
            DB_MODE_OVERRIDE="${2:-}"
            shift 2
            ;;
        *)
            fail "Unknown argument: $1"
            ;;
    esac
done

# Convert to lowercase
WITH_MODULES=$(echo "$WITH_MODULES" | tr '[:upper:]' '[:lower:]')

# Helper to check selected module
has_module() {
    [[ ",$WITH_MODULES," == *",$1,"* ]]
}

# ── Load Environment ─────────────────────────────────────────────────────────
if [[ ! -f "$ENV_FILE" ]]; then
    if [[ -f "$ENV_EXAMPLE" ]]; then
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        log "Created .env from .env.example"
    fi
    fail "No .env file found. Edit ${ENV_FILE} with your settings, then rerun start.sh"
fi

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

# Override DB_INSTALL_MODE if specified in arguments
if [[ -n "$DB_MODE_OVERRIDE" ]]; then
    DB_INSTALL_MODE="$DB_MODE_OVERRIDE"
fi

# Set defaults
DB_INSTALL_MODE="${DB_INSTALL_MODE:-managed-process}"
ENABLE_REDIS="${ENABLE_REDIS:-false}"
ENABLE_QDRANT="${ENABLE_QDRANT:-false}"
PORT="${PORT:-3000}"
UI_PORT="${UI_PORT:-8080}"
APP_PORT="${APP_PORT:-5055}"

# Check sudo permissions if system-service is selected
if [[ "$DB_INSTALL_MODE" == "system-service" ]]; then
    if [[ "$(id -u)" -eq 0 ]]; then
        SUDO=""
    else
        SUDO="sudo"
    fi
fi

# Validate env keys
require_env() {
    local key="$1"
    local val="${!key:-}"
    [[ -n "$val" ]] || fail "Required env var ${key} is not set in .env"
    case "$val" in
        change_this_*|replace_with_*)
            fail "${key} still has its placeholder value — set a real value in .env"
            ;;
    esac
}

require_hex64() {
    local key="$1"
    local val="${!key:-}"
    require_env "$key"
    [[ "$val" =~ ^[0-9a-fA-F]{64}$ ]] || \
        fail "${key} must be a 64-character hex string (generate with: openssl rand -hex 32)"
}

require_env DATABASE_URL
if [[ "$ENABLE_REDIS" == "true" ]]; then
    require_env REDIS_URL
fi
require_hex64 CREDENTIAL_MASTER_KEY_1
require_hex64 JWT_SECRET

# ── Native Database Setup & Start ───────────────────────────────────────────

setup_and_start_postgres() {
    if [[ "$DB_INSTALL_MODE" == "system-service" ]]; then
        # 1. System service installation
        if ! command -v psql >/dev/null 2>&1; then
            log "Installing native PostgreSQL system package..."
            ${SUDO} apt-get update
            ${SUDO} apt-get install -y postgresql postgresql-contrib
        fi
        
        # Ensure started
        if command -v systemctl >/dev/null 2>&1; then
            ${SUDO} systemctl enable --now postgresql
        else
            ${SUDO} service postgresql start
        fi
        
        # Setup DB/User
        log "Setting up database master_router and user tianai_db natively..."
        ${SUDO} -u postgres psql -c "CREATE USER tianai_db WITH PASSWORD '${POSTGRES_PASSWORD}';" || true
        ${SUDO} -u postgres psql -c "ALTER USER tianai_db WITH PASSWORD '${POSTGRES_PASSWORD}';" || true
        ${SUDO} -u postgres psql -c "CREATE DATABASE master_router OWNER tianai_db;" || true
        ${SUDO} -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE master_router TO tianai_db;" || true
    else
        # 2. Managed sandboxed process (without root)
        if ! command -v initdb >/dev/null 2>&1; then
            fail "Postgres tools (initdb, postgres) are not installed. Please install them on your host first (e.g. apt-get install postgresql)."
        fi
        
        local pg_data="${SCRIPT_DIR}/runtime/pg-data"
        local pg_pid_file="${SCRIPT_DIR}/runtime/postgres.pid"
        
        if [[ ! -d "$pg_data" ]]; then
            log "Initializing local PostgreSQL data directory at ${pg_data}..."
            initdb -D "$pg_data"
        fi
        
        # Check if already running on 5432
        if ! pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
            log "Starting local PostgreSQL process..."
            postgres -D "$pg_data" -p 5432 > "${SCRIPT_DIR}/logs/postgres.log" 2>&1 &
            local pg_pid=$!
            echo "$pg_pid" > "$pg_pid_file"
            
            # Wait for PG
            log "Waiting for local PostgreSQL to become ready..."
            local attempts=0
            until pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1 || [[ $attempts -ge 10 ]]; do
                sleep 1
                attempts=$((attempts + 1))
            done
            if [[ $attempts -ge 10 ]]; then
                fail "Local PostgreSQL failed to start. Check: ${SCRIPT_DIR}/logs/postgres.log"
            fi
        fi
        
        # Configure DB & user natively under current user context
        psql -h 127.0.0.1 -p 5432 -d postgres -c "CREATE USER tianai_db WITH PASSWORD '${POSTGRES_PASSWORD}';" 2>/dev/null || true
        psql -h 127.0.0.1 -p 5432 -d postgres -c "ALTER USER tianai_db WITH PASSWORD '${POSTGRES_PASSWORD}';" 2>/dev/null || true
        psql -h 127.0.0.1 -p 5432 -d postgres -c "CREATE DATABASE master_router OWNER tianai_db;" 2>/dev/null || true
        psql -h 127.0.0.1 -p 5432 -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE master_router TO tianai_db;" 2>/dev/null || true
        log "Local PostgreSQL is ready"
    fi
}

setup_and_start_redis() {
    if [[ "$DB_INSTALL_MODE" == "system-service" ]]; then
        if ! command -v redis-server >/dev/null 2>&1; then
            log "Installing native Redis system package..."
            ${SUDO} apt-get update
            ${SUDO} apt-get install -y redis-server
        fi
        
        # Add password configuration if missing
        if ! ${SUDO} grep -q "^requirepass" /etc/redis/redis.conf; then
            echo "requirepass ${REDIS_PASSWORD}" | ${SUDO} tee -a /etc/redis/redis.conf
            if command -v systemctl >/dev/null 2>&1; then
                ${SUDO} systemctl restart redis-server
            else
                ${SUDO} service redis-server restart
            fi
        fi
        
        if command -v systemctl >/dev/null 2>&1; then
            ${SUDO} systemctl enable --now redis-server
        else
            ${SUDO} service redis-server start
        fi
    else
        if ! command -v redis-server >/dev/null 2>&1; then
            fail "redis-server is not installed. Please install it on your host first (e.g. apt-get install redis-server)."
        fi
        
        local redis_pid_file="${SCRIPT_DIR}/runtime/redis.pid"
        
        # Check if already running on 6379
        if ! redis-cli -p 6379 ping >/dev/null 2>&1 && ! redis-cli -p 6379 -a "$REDIS_PASSWORD" ping >/dev/null 2>&1; then
            log "Starting local Redis process..."
            nohup redis-server --port 6379 --requirepass "${REDIS_PASSWORD}" --dir "${SCRIPT_DIR}/runtime" > "${SCRIPT_DIR}/logs/redis.log" 2>&1 &
            local redis_pid=$!
            echo "$redis_pid" > "$redis_pid_file"
            
            # Wait for Redis
            sleep 1
            if ! redis-cli -p 6379 -a "$REDIS_PASSWORD" ping | grep -q PONG; then
                fail "Local Redis failed to start. Check: ${SCRIPT_DIR}/logs/redis.log"
            fi
        fi
        log "Local Redis is ready"
    fi
}

setup_and_start_qdrant() {
    local qdrant_bin="${SCRIPT_DIR}/bin/qdrant"
    local qdrant_storage="${SCRIPT_DIR}/runtime/qdrant-storage"
    local qdrant_pid_file="${SCRIPT_DIR}/runtime/qdrant.pid"
    
    if [[ ! -f "$qdrant_bin" ]]; then
        log "Downloading native Qdrant binary..."
        local qdrant_ver="v1.10.1"
        local arch
        arch=$(uname -m)
        local tarball=""
        
        if [[ "$arch" == "x86_64" ]]; then
            tarball="qdrant-x86_64-unknown-linux-gnu.tar.gz"
        elif [[ "$arch" == "aarch64" || "$arch" == "arm64" ]]; then
            tarball="qdrant-aarch64-unknown-linux-gnu.tar.gz"
        else
            fail "Unsupported architecture for Qdrant binary: $arch"
        fi
        
        mkdir -p /tmp/qdrant-install
        curl -L "https://github.com/qdrant/qdrant/releases/download/${qdrant_ver}/${tarball}" -o /tmp/qdrant-install/qdrant.tar.gz
        tar -xzf /tmp/qdrant-install/qdrant.tar.gz -C /tmp/qdrant-install
        mkdir -p "${SCRIPT_DIR}/bin"
        cp /tmp/qdrant-install/qdrant "$qdrant_bin"
        chmod +x "$qdrant_bin"
        rm -rf /tmp/qdrant-install
        log "Qdrant native binary installed successfully to bin/qdrant"
    fi
    
    mkdir -p "$qdrant_storage"
    
    if ! curl -sf "http://127.0.0.1:6333/readyz" >/dev/null 2>&1; then
        log "Starting Qdrant process..."
        QDRANT__STORAGE__STORAGE_PATH="$qdrant_storage" \
        QDRANT__SERVICE__HTTP_PORT=6333 \
        QDRANT__SERVICE__GRPC_PORT=6334 \
        nohup "$qdrant_bin" > "${SCRIPT_DIR}/logs/qdrant.log" 2>&1 &
        local qd_pid=$!
        echo "$qd_pid" > "$qdrant_pid_file"
        
        # Wait for Qdrant readyz
        log "Waiting for Qdrant to become ready..."
        local attempts=0
        until curl -sf "http://127.0.0.1:6333/readyz" >/dev/null 2>&1 || [[ $attempts -ge 15 ]]; do
            sleep 1
            attempts=$((attempts + 1))
        done
        if [[ $attempts -ge 15 ]]; then
            fail "Qdrant failed to start. Check: ${SCRIPT_DIR}/logs/qdrant.log"
        fi
    fi
    log "Qdrant is ready"
}

# Run DB startup routines
setup_and_start_postgres

if [[ "$ENABLE_REDIS" == "true" ]]; then
    setup_and_start_redis
fi

if [[ "$ENABLE_QDRANT" == "true" ]]; then
    setup_and_start_qdrant
fi

# ── Start Applications ────────────────────────────────────────────────────────

# 1. Start cheng-api
if has_module "api"; then
    log "Starting cheng-api..."
    
    # PID guard
    local api_pid_file="${SCRIPT_DIR}/runtime/cheng-api.pid"
    if [[ -f "$api_pid_file" ]]; then
        local old_pid
        old_pid=$(cat "$api_pid_file")
        if kill -0 "$old_pid" 2>/dev/null; then
            log "cheng-api is already running (PID ${old_pid})"
        else
            rm -f "$api_pid_file"
        fi
    fi
    
    if [[ ! -f "$api_pid_file" ]]; then
        [[ -f "$BINARY" ]] || fail "Binary not found: ${BINARY}"
        [[ -x "$BINARY" ]] || fail "Binary not executable: ${BINARY}"
        
        # Inject empty REDIS_URL if Redis is disabled
        if [[ "$ENABLE_REDIS" != "true" ]]; then
            export REDIS_URL=""
        fi
        
        nohup "$BINARY" --log >> "${SCRIPT_DIR}/logs/cheng-api.log" 2>&1 &
        local api_pid=$!
        echo "$api_pid" > "$api_pid_file"
        log "cheng-api started (PID ${api_pid}), logging to logs/cheng-api.log"
        
        # Wait for /health
        log "Waiting for cheng-api /health endpoint (up to 30s)..."
        local api_deadline=$(( $(date +%s) + 30 ))
        while true; do
            if curl -sf "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
                log "cheng-api is ready"
                break
            fi
            if ! kill -0 "$api_pid" 2>/dev/null; then
                rm -f "$api_pid_file"
                log "cheng-api exited unexpectedly"
                tail -n 20 "${SCRIPT_DIR}/logs/cheng-api.log" >&2
                fail "cheng-api crashed during start"
            fi
            if [[ $(date +%s) -ge $api_deadline ]]; then
                fail "cheng-api /health timeout"
            fi
            sleep 1
        done
    fi
fi

# 2. Start cheng-ui static server
if has_module "ui"; then
    log "Starting cheng-ui static proxy server..."
    local ui_pid_file="${SCRIPT_DIR}/runtime/ui-server.pid"
    
    if [[ -f "$ui_pid_file" ]]; then
        local old_pid
        old_pid=$(cat "$ui_pid_file")
        if kill -0 "$old_pid" 2>/dev/null; then
            log "cheng-ui server is already running (PID ${old_pid})"
        else
            rm -f "$ui_pid_file"
        fi
    fi
    
    if [[ ! -f "$ui_pid_file" ]]; then
        [[ -f "${SCRIPT_DIR}/bin/ui-server.js" ]] || fail "UI server file not found: bin/ui-server.js"
        
        UI_PORT="$UI_PORT" BACKEND_URL="http://127.0.0.1:${PORT}" \
        nohup node "${SCRIPT_DIR}/bin/ui-server.js" >> "${SCRIPT_DIR}/logs/ui-server.log" 2>&1 &
        local ui_pid=$!
        echo "$ui_pid" > "$ui_pid_file"
        log "cheng-ui server started (PID ${ui_pid}), listening on port ${UI_PORT}"
    fi
fi

# 3. Start cheng-app static server
if has_module "app"; then
    log "Starting cheng-app static proxy server..."
    local app_pid_file="${SCRIPT_DIR}/runtime/app-server.pid"
    
    if [[ -f "$app_pid_file" ]]; then
        local old_pid
        old_pid=$(cat "$app_pid_file")
        if kill -0 "$old_pid" 2>/dev/null; then
            log "cheng-app server is already running (PID ${old_pid})"
        else
            rm -f "$app_pid_file"
        fi
    fi
    
    if [[ ! -f "$app_pid_file" ]]; then
        [[ -f "${SCRIPT_DIR}/bin/app-server.js" ]] || fail "App server file not found: bin/app-server.js"
        
        APP_PORT="$APP_PORT" BACKEND_URL="http://127.0.0.1:${PORT}" \
        nohup node "${SCRIPT_DIR}/bin/app-server.js" >> "${SCRIPT_DIR}/logs/app-server.log" 2>&1 &
        local app_pid=$!
        echo "$app_pid" > "$app_pid_file"
        log "cheng-app server started (PID ${app_pid}), listening on port ${APP_PORT}"
    fi
fi

log ""
log "  ChengOS is running natively!"
log "  API Backend : http://127.0.0.1:${PORT}"
if has_module "ui"; then
    log "  Frontend UI : http://127.0.0.1:${UI_PORT}"
fi
if has_module "app"; then
    log "  Channel App : http://127.0.0.1:${APP_PORT}"
fi
log "  Stop script : bash stop.sh"
log ""
