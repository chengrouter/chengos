#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ROOT_DIR}/.env"
ENV_EXAMPLE="${ROOT_DIR}/.env.example"
BINARY="${ROOT_DIR}/bin/cheng-api"

log()  { printf '[chengos] %s\n' "$*"; }
fail() { printf '[chengos] ERROR: %s\n' "$*" >&2; exit 1; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || fail "Missing command: $1"; }

mkdir -p "${ROOT_DIR}/logs" "${ROOT_DIR}/runtime" "${ROOT_DIR}/skills" "${ROOT_DIR}/ui" "${ROOT_DIR}/app"

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
API_LOG_FILE="${CHENG_API_LOG_FILE:-${ROOT_DIR}/logs/cheng-api.log}"
UI_LOG_FILE="${CHENG_UI_LOG_FILE:-${ROOT_DIR}/logs/ui-server.log}"
APP_LOG_FILE="${CHENG_APP_LOG_FILE:-${ROOT_DIR}/logs/app-server.log}"

resolve_process_log_file() {
    local value="$1"
    local default_file="$2"

    case "${value,,}" in
        off|stdout) printf '/dev/null\n' ;;
        "") printf '%s\n' "$default_file" ;;
        *) printf '%s\n' "$value" ;;
    esac
}

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

# Add PostgreSQL server binaries to PATH
# Debian/Ubuntu: /usr/lib/postgresql/*/bin
# CentOS/RHEL:   /usr/pgsql-*/bin
add_pg_bins_to_path() {
    for pg_bin in /usr/lib/postgresql/*/bin /usr/pgsql-*/bin; do
        if [[ -d "$pg_bin" ]]; then
            export PATH="$pg_bin:$PATH"
        fi
    done
}
add_pg_bins_to_path

setup_and_start_postgres() {
    if [[ "$DB_INSTALL_MODE" == "system-service" ]]; then
        # 1. System service installation
        if ! command -v psql >/dev/null 2>&1; then
            log "Installing native PostgreSQL system package..."
            if command -v apt-get >/dev/null 2>&1; then
                ${SUDO} apt-get update
                ${SUDO} apt-get install -y postgresql postgresql-contrib
            elif command -v dnf >/dev/null 2>&1; then
                ${SUDO} dnf install -y postgresql-server postgresql-contrib
            elif command -v yum >/dev/null 2>&1; then
                # CentOS 7 base repos only have PG 9.2; install PG 15 from pgdg repo
                if ! rpm -q pgdg-redhat-repo >/dev/null 2>&1; then
                    ${SUDO} yum --disablerepo='*' install -y "https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm"
                fi
                ${SUDO} yum-config-manager --disable pgdg12 pgdg13 pgdg11 pgdg10 pgdg96 pgdg95 pgdg94 pgdg93 2>/dev/null || true
                ${SUDO} yum install -y --enablerepo='pgdg15' --disablerepo='pgdg1[0-4],pgdg9*' "postgresql15-server" "postgresql15-contrib"
            else
                fail "No supported package manager found. Please install PostgreSQL manually."
            fi
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
        ${SUDO} -u postgres psql -c "ALTER USER tianai_db WITH SUPERUSER;" || true
        ${SUDO} -u postgres psql -d master_router -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" || true
        ${SUDO} -u postgres psql -d master_router -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;" || true
    else
        # 2. Managed sandboxed process (without root)
        if ! command -v initdb >/dev/null 2>&1; then
            local local_sudo=""
            if [[ "$(id -u)" -ne 0 ]]; then
                local_sudo="sudo"
            fi
            if command -v apt-get >/dev/null 2>&1; then
                log "PostgreSQL tools not found. Automatically installing PostgreSQL via apt-get..."
                $local_sudo apt-get update
                $local_sudo apt-get install -y postgresql postgresql-contrib
                
                # Stop and disable system-wide PostgreSQL so it does not block port 5432
                log "Stopping and disabling system-wide PostgreSQL service for sandbox mode..."
                if command -v systemctl >/dev/null 2>&1; then
                    $local_sudo systemctl stop postgresql || true
                    $local_sudo systemctl disable postgresql || true
                else
                    $local_sudo service postgresql stop || true
                fi
            elif command -v dnf >/dev/null 2>&1; then
                log "PostgreSQL tools not found. Automatically installing PostgreSQL via dnf..."
                $local_sudo dnf install -y postgresql-server postgresql-contrib
            elif command -v yum >/dev/null 2>&1; then
                log "PostgreSQL tools not found. Installing PostgreSQL 15 from official repo via yum..."
                # CentOS 7 base repos only have PG 9.2; install PG 15 from pgdg repo
                if ! rpm -q pgdg-redhat-repo >/dev/null 2>&1; then
                    $local_sudo yum --disablerepo='*' install -y "https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm"
                fi
                # Disable stale PG repos (pgdg12 etc.) that return 410 Gone
                $local_sudo yum-config-manager --disable pgdg12 pgdg13 pgdg11 pgdg10 pgdg96 pgdg95 pgdg94 pgdg93 2>/dev/null || true
                # Install PG 15 (confirmed available for EL7)
                $local_sudo yum install -y --enablerepo='pgdg15' --disablerepo='pgdg1[0-4],pgdg9*' "postgresql15-server" "postgresql15-contrib"
            else
                fail "Postgres tools (initdb, postgres) are not installed. Please install them manually on your host."
            fi
        fi
        add_pg_bins_to_path

        local pg_data="${ROOT_DIR}/runtime/pg-data"
        local pg_pid_file="${ROOT_DIR}/runtime/postgres.pid"
        local run_prefix=""
        
        if [[ "$(id -u)" -eq 0 ]]; then
            log "Running as root. Configuring PostgreSQL to run as 'postgres' user..."
            if ! id -u postgres >/dev/null 2>&1; then
                if command -v useradd >/dev/null 2>&1; then
                    useradd -r -s /bin/bash postgres || true
                fi
            fi
            if ! id -u postgres >/dev/null 2>&1; then
                fail "Cannot run PostgreSQL as root, and failed to find or create the 'postgres' user."
            fi
            
            # Use /var/lib/chengos/pg-data to avoid permission issues inside /root
            pg_data="/var/lib/chengos/pg-data"
            mkdir -p "$pg_data"
            chown -R postgres:postgres "$pg_data"
            run_prefix="runuser -u postgres --"
        fi
        
        if [[ ! -f "${pg_data}/PG_VERSION" ]]; then
            log "Initializing local PostgreSQL data directory at ${pg_data}..."
            (cd /tmp && ${run_prefix} env PATH="$PATH" initdb -D "$pg_data")
        fi
        
        # Check if already running on 5432
        if ! pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
            # Kill any stale postgres process occupying port 5432
            local stale_pg_pid
            stale_pg_pid="$(ss -tlnp 2>/dev/null | grep ':5432 ' | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' | head -1 || true)"
            if [[ -n "$stale_pg_pid" ]]; then
                log "Killing stale process (PID ${stale_pg_pid}) on port 5432..."
                kill "$stale_pg_pid" 2>/dev/null || true
                sleep 1
                kill -9 "$stale_pg_pid" 2>/dev/null || true
            fi
            # Remove stale postmaster.pid from a previous failed start
            if [[ -f "${pg_data}/postmaster.pid" ]]; then
                log "Removing stale postmaster.pid..."
                rm -f "${pg_data}/postmaster.pid"
            fi
            log "Starting local PostgreSQL process..."
            # When running as postgres user, ensure the log file is writable
            local pg_log="${ROOT_DIR}/logs/postgres.log"
            if [[ -n "$run_prefix" ]]; then
                pg_log="/var/lib/chengos/postgres.log"
                touch "$pg_log"
                chown postgres:postgres "$pg_log"
            fi
            (cd /tmp && ${run_prefix} env PATH="$PATH" pg_ctl -D "$pg_data" -o "-p 5432" -l "$pg_log" -w start)
            local pg_pid
            pg_pid="$(cat "${pg_data}/postmaster.pid" 2>/dev/null | head -1 || echo "")"
            [[ -n "$pg_pid" ]] && echo "$pg_pid" > "$pg_pid_file"
        fi
        
        # Configure DB & user natively under current user context
        (cd /tmp && ${run_prefix} env PATH="$PATH" psql -h 127.0.0.1 -p 5432 -d postgres -c "CREATE USER tianai_db WITH PASSWORD '${POSTGRES_PASSWORD}';" 2>/dev/null) || true
        (cd /tmp && ${run_prefix} env PATH="$PATH" psql -h 127.0.0.1 -p 5432 -d postgres -c "ALTER USER tianai_db WITH PASSWORD '${POSTGRES_PASSWORD}';" 2>/dev/null) || true
        (cd /tmp && ${run_prefix} env PATH="$PATH" psql -h 127.0.0.1 -p 5432 -d postgres -c "CREATE DATABASE master_router OWNER tianai_db;" 2>/dev/null) || true
        (cd /tmp && ${run_prefix} env PATH="$PATH" psql -h 127.0.0.1 -p 5432 -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE master_router TO tianai_db;" 2>/dev/null) || true
        # Grant superuser so migrations can create extensions (uuid-ossp, etc.)
        (cd /tmp && ${run_prefix} env PATH="$PATH" psql -h 127.0.0.1 -p 5432 -d postgres -c "ALTER USER tianai_db WITH SUPERUSER;" 2>/dev/null) || true
        # Pre-create common extensions in master_router database
        (cd /tmp && ${run_prefix} env PATH="$PATH" psql -h 127.0.0.1 -p 5432 -d master_router -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" 2>/dev/null) || true
        (cd /tmp && ${run_prefix} env PATH="$PATH" psql -h 127.0.0.1 -p 5432 -d master_router -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;" 2>/dev/null) || true
        log "Local PostgreSQL is ready"
    fi
}

setup_and_start_redis() {
    if [[ "$DB_INSTALL_MODE" == "system-service" ]]; then
        if ! command -v valkey-server >/dev/null 2>&1; then
            log "Installing native Valkey system package..."
            ${SUDO} apt-get update
            ${SUDO} apt-get install -y valkey
        fi
        
        # Add password configuration if missing
        if ! ${SUDO} grep -q "^requirepass" /etc/valkey/valkey.conf; then
            echo "requirepass ${REDIS_PASSWORD}" | ${SUDO} tee -a /etc/valkey/valkey.conf
            if command -v systemctl >/dev/null 2>&1; then
                ${SUDO} systemctl restart valkey-server
            else
                ${SUDO} service valkey-server restart
            fi
        fi
        
        if command -v systemctl >/dev/null 2>&1; then
            ${SUDO} systemctl enable --now valkey-server
        else
            ${SUDO} service valkey-server start
        fi
    else
        if ! command -v valkey-server >/dev/null 2>&1; then
            if command -v apt-get >/dev/null 2>&1; then
                log "valkey-server not found. Automatically installing Valkey via apt-get..."
                local local_sudo=""
                if [[ "$(id -u)" -ne 0 ]]; then
                    local_sudo="sudo"
                fi
                $local_sudo apt-get update
                $local_sudo apt-get install -y valkey
                
                # Stop and disable system-wide Valkey so it does not block port 6379
                log "Stopping and disabling system-wide Valkey service for sandbox mode..."
                if command -v systemctl >/dev/null 2>&1; then
                    $local_sudo systemctl stop valkey-server || true
                    $local_sudo systemctl disable valkey-server || true
                else
                    $local_sudo service valkey-server stop || true
                fi
            else
                fail "valkey-server is not installed. Please install it manually on your host (e.g. apt-get install valkey)."
            fi
        fi
        
        local redis_pid_file="${ROOT_DIR}/runtime/valkey.pid"
        
        # Check if already running on 6379
        if ! valkey-cli -p 6379 ping >/dev/null 2>&1 && ! valkey-cli -p 6379 -a "$REDIS_PASSWORD" ping >/dev/null 2>&1; then
            log "Starting local Valkey process..."
            nohup valkey-server --port 6379 --requirepass "${REDIS_PASSWORD}" --dir "${ROOT_DIR}/runtime" > "${ROOT_DIR}/logs/valkey.log" 2>&1 &
            local redis_pid=$!
            echo "$redis_pid" > "$redis_pid_file"
            
            # Wait for Valkey
            sleep 1
            if ! valkey-cli -p 6379 -a "$REDIS_PASSWORD" ping | grep -q PONG; then
                fail "Local Valkey failed to start. Check: ${ROOT_DIR}/logs/valkey.log"
            fi
        fi
        log "Local Valkey is ready"
    fi
}

setup_and_start_qdrant() {
    local qdrant_bin="${ROOT_DIR}/bin/qdrant"
    local qdrant_storage="${ROOT_DIR}/runtime/qdrant-storage"
    local qdrant_pid_file="${ROOT_DIR}/runtime/qdrant.pid"
    
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
        mkdir -p "${ROOT_DIR}/bin"
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
        nohup "$qdrant_bin" > "${ROOT_DIR}/logs/qdrant.log" 2>&1 &
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
            fail "Qdrant failed to start. Check: ${ROOT_DIR}/logs/qdrant.log"
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
    api_pid_file="${ROOT_DIR}/runtime/cheng-api.pid"
    if [[ -f "$api_pid_file" ]]; then
        old_pid=$(cat "$api_pid_file")
        if kill -0 "$old_pid" 2>/dev/null; then
            log "cheng-api is already running (PID ${old_pid})"
        else
            rm -f "$api_pid_file"
        fi
    fi
    
    if [[ ! -f "$api_pid_file" ]]; then
        [[ -f "$BINARY" ]] || fail "Binary not found: ${BINARY}"
        if [[ ! -x "$BINARY" ]]; then
            log "Binary not executable, fixing permissions: ${BINARY}"
            chmod +x "$BINARY"
        fi
        
        # Inject empty REDIS_URL if Redis is disabled
        if [[ "$ENABLE_REDIS" != "true" ]]; then
            export REDIS_URL=""
        fi
        
        api_log_args=()
        api_output_log="${ROOT_DIR}/logs/cheng-api.log"
        case "${API_LOG_FILE,,}" in
            off|stdout)
                api_output_log="/dev/null"
                ;;
            *)
                mkdir -p "$(dirname "$API_LOG_FILE")"
                api_log_args=(--log-file "$API_LOG_FILE")
                api_output_log="$API_LOG_FILE"
                ;;
        esac

        nohup "$BINARY" "${api_log_args[@]}" >> "$api_output_log" 2>&1 &
        api_pid=$!
        echo "$api_pid" > "$api_pid_file"
        log "cheng-api started (PID ${api_pid}), logging to ${api_output_log}"
        
        # Wait for /health
        log "Waiting for cheng-api /health endpoint (up to 30s)..."
        api_deadline=$(( $(date +%s) + 30 ))
        while true; do
            if curl -sf "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
                log "cheng-api is ready"
                break
            fi
            if ! kill -0 "$api_pid" 2>/dev/null; then
                rm -f "$api_pid_file"
                log "cheng-api exited unexpectedly"
                tail -n 20 "${ROOT_DIR}/logs/cheng-api.log" >&2
                fail "cheng-api crashed during start"
            fi
            if [[ $(date +%s) -ge $api_deadline ]]; then
                fail "cheng-api /health timeout"
            fi
            sleep 1
        done
    fi
fi

# Verify Node.js is installed if running UI/App
if has_module "ui" || has_module "app"; then
    if ! command -v node >/dev/null 2>&1; then
        local_sudo=""
        if [[ "$(id -u)" -ne 0 ]]; then
            local_sudo="sudo"
        fi
        if command -v apt-get >/dev/null 2>&1; then
            log "Node.js not found. Automatically installing Node.js via apt-get..."
            $local_sudo apt-get update
            $local_sudo apt-get install -y nodejs npm
        elif command -v dnf >/dev/null 2>&1; then
            log "Node.js not found. Installing Node.js 20 via NodeSource (dnf)..."
            curl -fsSL https://rpm.nodesource.com/setup_20.x | $local_sudo bash -
            $local_sudo dnf install -y nodejs
        elif command -v yum >/dev/null 2>&1; then
            log "Node.js not found. Installing Node.js 16 via NodeSource (yum)..."
            # Node 18+ requires glibc 2.28+ (not available on CentOS 7); use Node 16
            # Disable all stale pgdg repos to avoid 410 Gone errors
            $local_sudo yum-config-manager --disable 'pgdg1[0-4]' pgdg13 pgdg96 pgdg95 pgdg94 pgdg93 2>/dev/null || true
            # Remove any existing nodesource repo to avoid stale cache
            $local_sudo rm -f /etc/yum.repos.d/nodesource*.repo 2>/dev/null || true
            $local_sudo yum clean all 2>/dev/null || true
            curl -fsSL https://rpm.nodesource.com/setup_16.x | $local_sudo bash -
            $local_sudo yum clean all 2>/dev/null || true
            $local_sudo yum install -y --disablerepo='pgdg*' nodejs
        else
            fail "Node.js is not installed. Please install Node.js on your host first."
        fi
    fi
fi

# 2. Start cheng-ui static server
if has_module "ui"; then
    log "Starting cheng-ui static proxy server..."
    ui_pid_file="${ROOT_DIR}/runtime/ui-server.pid"
    
    if [[ -f "$ui_pid_file" ]]; then
        old_pid=$(cat "$ui_pid_file")
        if kill -0 "$old_pid" 2>/dev/null; then
            log "cheng-ui server is already running (PID ${old_pid})"
        else
            rm -f "$ui_pid_file"
        fi
    fi
    
    if [[ ! -f "$ui_pid_file" ]]; then
        [[ -f "${ROOT_DIR}/bin/ui-server.js" ]] || fail "UI server file not found: bin/ui-server.js"
        
        ui_output_log="$(resolve_process_log_file "$UI_LOG_FILE" "${ROOT_DIR}/logs/ui-server.log")"
        mkdir -p "$(dirname "$ui_output_log")"
        UI_PORT="$UI_PORT" BACKEND_URL="http://127.0.0.1:${PORT}" \
        nohup node "${ROOT_DIR}/bin/ui-server.js" >> "$ui_output_log" 2>&1 &
        ui_pid=$!
        echo "$ui_pid" > "$ui_pid_file"
        log "cheng-ui server started (PID ${ui_pid}), listening on port ${UI_PORT}, logging to ${ui_output_log}"
    fi
fi

# 3. Start cheng-app static server
if has_module "app"; then
    log "Starting cheng-app static proxy server..."
    app_pid_file="${ROOT_DIR}/runtime/app-server.pid"
    
    if [[ -f "$app_pid_file" ]]; then
        old_pid=$(cat "$app_pid_file")
        if kill -0 "$old_pid" 2>/dev/null; then
            log "cheng-app server is already running (PID ${old_pid})"
        else
            rm -f "$app_pid_file"
        fi
    fi
    
    if [[ ! -f "$app_pid_file" ]]; then
        [[ -f "${ROOT_DIR}/bin/app-server.js" ]] || fail "App server file not found: bin/app-server.js"
        
        app_output_log="$(resolve_process_log_file "$APP_LOG_FILE" "${ROOT_DIR}/logs/app-server.log")"
        mkdir -p "$(dirname "$app_output_log")"
        APP_PORT="$APP_PORT" BACKEND_URL="http://127.0.0.1:${PORT}" \
        nohup node "${ROOT_DIR}/bin/app-server.js" >> "$app_output_log" 2>&1 &
        app_pid=$!
        echo "$app_pid" > "$app_pid_file"
        log "cheng-app server started (PID ${app_pid}), listening on port ${APP_PORT}, logging to ${app_output_log}"
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
