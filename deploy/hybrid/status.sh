#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ROOT_DIR}/.env"

log() { printf '[chengos] %s\n' "$*"; }

PORT=3000
UI_PORT=8080
APP_PORT=5055
ENABLE_REDIS=false
ENABLE_QDRANT=false
DB_INSTALL_MODE=managed-process
REDIS_PASSWORD=""

if [[ -f "$ENV_FILE" ]]; then
    # shellcheck disable=SC1090
    set -a; source "$ENV_FILE" 2>/dev/null || true; set +a
fi

API_LOG_FILE="${CHENG_API_LOG_FILE:-${ROOT_DIR}/logs/cheng-api.log}"
UI_LOG_FILE="${CHENG_UI_LOG_FILE:-${ROOT_DIR}/logs/ui-server.log}"
APP_LOG_FILE="${CHENG_APP_LOG_FILE:-${ROOT_DIR}/logs/app-server.log}"

HR() { printf -- '─%.0s' {1..60}; printf '\n'; }

HR
log "ChengOS Native Services Process Status"
HR

check_process() {
    local pid_file="$1"
    local name="$2"
    
    if [[ -f "$pid_file" ]]; then
        local pid
        pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            log "  %-18s : RUNNING (PID ${pid})" "$name"
        else
            log "  %-18s : DEAD (PID ${pid} not found — stale PID file)" "$name"
        fi
    else
        log "  %-18s : STOPPED (no PID file)" "$name"
    fi
}

check_process "${ROOT_DIR}/runtime/cheng-api.pid" "cheng-api backend"
check_process "${ROOT_DIR}/runtime/ui-server.pid" "cheng-ui server"
check_process "${ROOT_DIR}/runtime/app-server.pid" "cheng-app server"
if [[ "$ENABLE_QDRANT" == "true" ]]; then
    check_process "${ROOT_DIR}/runtime/qdrant.pid" "Qdrant Vector"
fi

HR
log "Database Connections & Ports Status"
HR

# 1. PostgreSQL Status
if pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
    log "  PostgreSQL (5432) : ONLINE"
else
    log "  PostgreSQL (5432) : OFFLINE"
fi

# 2. Redis Status
if [[ "$ENABLE_REDIS" == "true" ]]; then
    if redis-cli -p 6379 ping >/dev/null 2>&1 || redis-cli -p 6379 -a "$REDIS_PASSWORD" ping | grep -q PONG 2>/dev/null; then
        log "  Redis (6379)      : ONLINE"
    else
        log "  Redis (6379)      : OFFLINE"
    fi
fi

# 3. Qdrant Status
if [[ "$ENABLE_QDRANT" == "true" ]]; then
    if curl -sf "http://127.0.0.1:6333/readyz" >/dev/null 2>&1; then
        log "  Qdrant HTTP (6333): ONLINE (readyz OK)"
    else
        log "  Qdrant HTTP (6333): OFFLINE"
    fi
fi

HR
log "HTTP Endpoints & Health"
HR

# Check /health
HEALTH_URL="http://127.0.0.1:${PORT}/health"
if curl -sf --max-time 3 "$HEALTH_URL" >/dev/null 2>&1; then
    log "  API Health (/health) : OK"
else
    log "  API Health (/health) : NOT RESPONDING (${HEALTH_URL})"
fi

# Check UI server port
if curl -sf --max-time 3 "http://127.0.0.1:${UI_PORT}/" >/dev/null 2>&1; then
    log "  UI Server (${UI_PORT})    : RESPONDING"
else
    log "  UI Server (${UI_PORT})    : NOT RESPONDING"
fi

# Check App server port
if curl -sf --max-time 3 "http://127.0.0.1:${APP_PORT}/" >/dev/null 2>&1; then
    log "  App Server (${APP_PORT})   : RESPONDING"
else
    log "  App Server (${APP_PORT})   : NOT RESPONDING"
fi

HR
log "Recent Application Logs"
HR

print_logs() {
    local file="$1"
    local name="$2"
    case "${file,,}" in
        off|stdout|/dev/null|"")
            log "--- File logging disabled for ${name} ---"
            printf '\n'
            return
            ;;
    esac

    if [[ -f "$file" ]]; then
        log "--- Last 5 lines of ${name} ---"
        tail -n 5 "$file"
    else
        log "--- No log file for ${name} ---"
    fi
    printf '\n'
}

print_logs "$API_LOG_FILE" "cheng-api"
print_logs "$UI_LOG_FILE" "cheng-ui"
print_logs "$APP_LOG_FILE" "cheng-app"
if [[ "$ENABLE_QDRANT" == "true" ]]; then
    print_logs "${ROOT_DIR}/logs/qdrant.log" "Qdrant"
fi
