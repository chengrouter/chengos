#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

PID_FILE="${ROOT_DIR}/runtime/cheng-api.pid"

log()  { printf '[chengos] %s\n' "$*"; }

stop_pid() {
    local app_pid="$1"

    if ! kill -0 "$app_pid" 2>/dev/null; then
        return 0
    fi

    log "Sending SIGTERM to cheng-api (PID ${app_pid})..."
    kill -TERM "$app_pid"

    WAIT_DEADLINE=$(( $(date +%s) + 30 ))
    while kill -0 "$app_pid" 2>/dev/null; do
        if [[ $(date +%s) -ge $WAIT_DEADLINE ]]; then
            log "Process did not exit after 30s; sending SIGKILL"
            kill -KILL "$app_pid" 2>/dev/null || true
            break
        fi
        sleep 1
    done
}

# ── Stop cheng-api ───────────────────────────────────────────────────────────

if [[ ! -f "$PID_FILE" ]]; then
    log "cheng-api is not running (no PID file)"
else
    APP_PID="$(cat "$PID_FILE")"

    if ! kill -0 "$APP_PID" 2>/dev/null; then
        log "cheng-api is not running (PID ${APP_PID} is gone); removing stale PID file"
        rm -f "$PID_FILE"
    else
        stop_pid "$APP_PID"
        rm -f "$PID_FILE"
        log "cheng-api stopped"
    fi
fi

if command -v pgrep >/dev/null 2>&1; then
    BINARY="${ROOT_DIR}/bin/cheng-api"
    mapfile -t EXTRA_PIDS < <(pgrep -f "$BINARY" || true)
    if [[ ${#EXTRA_PIDS[@]} -gt 0 ]]; then
        log "Found additional cheng-api process(es) for ${BINARY}: ${EXTRA_PIDS[*]}"
        for pid in "${EXTRA_PIDS[@]}"; do
            stop_pid "$pid"
        done
        log "additional cheng-api process(es) stopped"
    fi
fi
