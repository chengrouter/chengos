#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ROOT_DIR}/.env"
PID_FILE="${ROOT_DIR}/runtime/cheng-api.pid"
LOG_FILE="${ROOT_DIR}/logs/cheng-api.log"

log() { printf '[chengos] %s\n' "$*"; }

# Load PORT from .env if available
PORT=3000
if [[ -f "$ENV_FILE" ]]; then
    # shellcheck disable=SC1090
    set -a; source "$ENV_FILE" 2>/dev/null || true; set +a
    PORT="${PORT:-3000}"
fi

HR() { printf -- '─%.0s' {1..60}; printf '\n'; }

HR
log "cheng-api process"
HR

if [[ -f "$PID_FILE" ]]; then
    APP_PID="$(cat "$PID_FILE")"
    if kill -0 "$APP_PID" 2>/dev/null; then
        log "  Status : RUNNING (PID ${APP_PID})"
    else
        log "  Status : DEAD (PID ${APP_PID} not found — stale PID file)"
    fi
else
    log "  Status : STOPPED (no PID file)"
fi

HR
log "API health"
HR

HEALTH_URL="http://127.0.0.1:${PORT}/health"
READY_URL="http://127.0.0.1:${PORT}/ready"

TMP_HEALTH="$(mktemp)"
TMP_READY="$(mktemp)"
trap 'rm -f "$TMP_HEALTH" "$TMP_READY"' EXIT

if curl -sf --max-time 5 "$HEALTH_URL" -o "$TMP_HEALTH" 2>/dev/null; then
    log "  /health : OK"
    if command -v python3 >/dev/null 2>&1; then
        python3 -c "import json,sys; d=json.load(open(sys.argv[1])); [print(f'    {k}: {v}') for k,v in d.items()]" "$TMP_HEALTH" 2>/dev/null || cat "$TMP_HEALTH"
    else
        cat "$TMP_HEALTH"
    fi
else
    log "  /health : NOT RESPONDING (${HEALTH_URL})"
fi

printf '\n'

if curl -sf --max-time 5 "$READY_URL" -o "$TMP_READY" 2>/dev/null; then
    log "  /ready : OK"
    if command -v python3 >/dev/null 2>&1; then
        python3 -c "import json,sys; d=json.load(open(sys.argv[1])); [print(f'    {k}: {v}') for k,v in d.items()]" "$TMP_READY" 2>/dev/null || cat "$TMP_READY"
    else
        cat "$TMP_READY"
    fi
else
    log "  /ready  : NOT RESPONDING (${READY_URL})"
fi

HR
log "Recent logs (last 20 lines)"
HR

if [[ -f "$LOG_FILE" ]]; then
    tail -n 20 "$LOG_FILE"
else
    log "  No log file at ${LOG_FILE}"
fi

HR
log "Disk usage"
HR

[[ -d logs ]]    && printf '  logs/    : ' && du -sh logs/    2>/dev/null || printf '0\n'
[[ -d runtime ]] && printf '  runtime/ : ' && du -sh runtime/ 2>/dev/null || printf '0\n'
