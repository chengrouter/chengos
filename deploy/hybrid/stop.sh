#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ROOT_DIR}/.env"

WITH_INFRA=false
for arg in "$@"; do
    case "$arg" in
        --with-infra) WITH_INFRA=true ;;
        *) printf '[chengos] Unknown argument: %s\n' "$arg" >&2; exit 1 ;;
    esac
done

log()  { printf '[chengos] %s\n' "$*"; }
fail() { printf '[chengos] ERROR: %s\n' "$*" >&2; exit 1; }

# Load Env config
if [[ -f "$ENV_FILE" ]]; then
    # shellcheck disable=SC1090
    set -a; source "$ENV_FILE" 2>/dev/null || true; set +a
fi

DB_INSTALL_MODE="${DB_INSTALL_MODE:-managed-process}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-}"
REDIS_PASSWORD="${REDIS_PASSWORD:-}"

stop_pid() {
    local pid_file="$1"
    local name="$2"

    if [[ ! -f "$pid_file" ]]; then
        return 0
    fi

    local pid
    pid="$(cat "$pid_file")"

    if ! kill -0 "$pid" 2>/dev/null; then
        rm -f "$pid_file"
        return 0
    fi

    log "Sending SIGTERM to ${name} (PID ${pid})..."
    kill -TERM "$pid" 2>/dev/null || true

    local deadline=$(( $(date +%s) + 15 ))
    while kill -0 "$pid" 2>/dev/null; do
        if [[ $(date +%s) -ge $deadline ]]; then
            log "${name} did not exit in time; sending SIGKILL"
            kill -KILL "$pid" 2>/dev/null || true
            break
        fi
        sleep 1
    done
    rm -f "$pid_file"
    log "${name} stopped"
}

# 1. Stop Applications
stop_pid "${ROOT_DIR}/runtime/app-server.pid" "cheng-app server"
stop_pid "${ROOT_DIR}/runtime/ui-server.pid" "cheng-ui server"
stop_pid "${ROOT_DIR}/runtime/cheng-api.pid" "cheng-api backend"

# 2. Stop Qdrant if running locally
stop_pid "${ROOT_DIR}/runtime/qdrant.pid" "Qdrant"

# 3. Stop Local Databases in managed-process mode
if [[ "$DB_INSTALL_MODE" == "managed-process" ]]; then
    log "Stopping local databases (managed-process mode)..."
    
    # Stop local Redis
    if [[ -f "${ROOT_DIR}/runtime/redis.pid" ]]; then
        r_pid=$(cat "${ROOT_DIR}/runtime/redis.pid")
        if kill -0 "$r_pid" 2>/dev/null; then
            log "Shutting down local Redis..."
            if [[ -n "$REDIS_PASSWORD" ]]; then
                redis-cli -p 6379 -a "$REDIS_PASSWORD" shutdown 2>/dev/null || kill -TERM "$r_pid" || true
            else
                redis-cli -p 6379 shutdown 2>/dev/null || kill -TERM "$r_pid" || true
            fi
        fi
        rm -f "${ROOT_DIR}/runtime/redis.pid"
        log "Local Redis stopped"
    fi

    # Stop local Postgres
    if [[ -f "${ROOT_DIR}/runtime/postgres.pid" ]]; then
        pg_pid=$(cat "${ROOT_DIR}/runtime/postgres.pid")
        if kill -0 "$pg_pid" 2>/dev/null; then
            log "Shutting down local PostgreSQL..."
            pg_data="${ROOT_DIR}/runtime/pg-data"
            run_prefix=""
            if [[ "$(id -u)" -eq 0 ]]; then
                pg_data="/var/lib/chengos/pg-data"
                run_prefix="runuser -u postgres --"
            fi
            
            # Add PostgreSQL server binaries to PATH (on Debian/Ubuntu they are under /usr/lib/postgresql/*/bin)
            for pg_bin in /usr/lib/postgresql/*/bin; do
                if [[ -d "$pg_bin" ]]; then
                    export PATH="$PATH:$pg_bin"
                fi
            done
            
            (cd /tmp && ${run_prefix} env PATH="$PATH" pg_ctl -D "$pg_data" stop -m fast 2>/dev/null) || kill -TERM "$pg_pid" || true
        fi
        rm -f "${ROOT_DIR}/runtime/postgres.pid"
        log "Local PostgreSQL stopped"
    fi
fi

# 4. Optionally stop system services if requested and DB mode is system-service
if $WITH_INFRA && [[ "$DB_INSTALL_MODE" == "system-service" ]]; then
    if [[ "$(id -u)" -eq 0 ]]; then
        SUDO=""
    else
        SUDO="sudo"
    fi
    
    log "Stopping infrastructure system services (system-service mode)..."
    if command -v systemctl >/dev/null 2>&1; then
        log "Stopping postgresql and redis-server via systemctl..."
        ${SUDO} systemctl stop postgresql redis-server 2>/dev/null || true
    else
        log "Stopping postgresql and redis-server via service..."
        ${SUDO} service postgresql stop 2>/dev/null || true
        ${SUDO} service redis-server stop 2>/dev/null || true
    fi
    log "Infrastructure system services stopped"
fi

log "All specified services stopped."
