#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ROOT_DIR}/.env"
ENV_EXAMPLE="${ROOT_DIR}/.env.example"
BINARY="${ROOT_DIR}/bin/cheng-api"
PID_FILE="${ROOT_DIR}/runtime/cheng-api.pid"
LOG_FILE="${ROOT_DIR}/logs/cheng-api.log"

APP_WAIT_SECS=30

log()  { printf '[chengos] %s\n' "$*"; }
fail() { printf '[chengos] ERROR: %s\n' "$*" >&2; exit 1; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || fail "Missing command: $1"; }

mkdir -p "${ROOT_DIR}/logs" "${ROOT_DIR}/runtime"
touch "$LOG_FILE" || fail "Cannot write log file: ${LOG_FILE}"
exec > >(tee -a "$LOG_FILE") 2>&1

log "start.sh invoked from ${SCRIPT_DIR}, running in ${ROOT_DIR}"

if [[ "$(id -u)" -eq 0 ]]; then
    SUDO=""
else
    SUDO="sudo"
fi

install_runtime_deps_on_debian() {
    [[ -n "$SUDO" ]] && require_cmd sudo

    log "Installing ChengOS runtime dependencies..."
    ${SUDO} apt-get update
    ${SUDO} apt-get install -y libpq5 libssl3 ca-certificates curl
    log "Runtime dependencies installed"
}

ensure_runtime_deps() {
    local missing=()

    command -v curl >/dev/null 2>&1 || missing+=("curl")

    if command -v ldd >/dev/null 2>&1; then
        while IFS= read -r line; do
            [[ "$line" == *"not found"* ]] || continue
            lib_name="$(printf '%s\n' "$line" | awk '{print $1}')"
            [[ -n "$lib_name" ]] && missing+=("$lib_name")
        done < <(ldd "$BINARY" 2>/dev/null || true)
    fi

    if [[ ${#missing[@]} -eq 0 ]]; then
        return
    fi

    log "Missing runtime dependencies detected: ${missing[*]}"

    if [[ ! -f /etc/debian_version ]]; then
        fail "Missing runtime dependencies (${missing[*]}). Automatic installation currently supports Debian/Ubuntu only"
    fi

    install_runtime_deps_on_debian
}

# ── Environment ──────────────────────────────────────────────────────────────

if [[ ! -f "$ENV_FILE" ]]; then
    if [[ -f "$ENV_EXAMPLE" ]]; then
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        log "Created .env from .env.example"
    fi
    fail "No .env file found. Edit ${ENV_FILE} with your settings, then rerun start.sh"
fi

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

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
require_env REDIS_URL
require_hex64 CREDENTIAL_MASTER_KEY_1
require_hex64 JWT_SECRET

PORT="${PORT:-3000}"

# ── Binary ───────────────────────────────────────────────────────────────────

[[ -f "$BINARY" ]] || fail "Binary not found: ${BINARY}"
[[ -x "$BINARY" ]] || fail "Binary is not executable: ${BINARY} (run: chmod +x bin/cheng-api)"
ensure_runtime_deps

# ── Directories ──────────────────────────────────────────────────────────────

mkdir -p "${ROOT_DIR}/skills" "${ROOT_DIR}/logs" "${ROOT_DIR}/runtime"

# ── PID guard ────────────────────────────────────────────────────────────────

if [[ -f "$PID_FILE" ]]; then
    OLD_PID="$(cat "$PID_FILE")"
    if kill -0 "$OLD_PID" 2>/dev/null; then
        log "cheng-api is already running (PID ${OLD_PID})"
        log "Run stop.sh first, or check: kill -0 ${OLD_PID}"
        exit 0
    else
        log "Stale PID file found (PID ${OLD_PID} is gone); cleaning up"
        rm -f "$PID_FILE"
    fi
fi

# ── Application ──────────────────────────────────────────────────────────────

log "Starting cheng-api..."
nohup "$BINARY" --log >> "$LOG_FILE" 2>&1 &
APP_PID=$!
echo "$APP_PID" > "$PID_FILE"
log "cheng-api started (PID ${APP_PID}), logging to ${LOG_FILE}"

log "Waiting for /health endpoint (up to ${APP_WAIT_SECS}s)..."
APP_DEADLINE=$(( $(date +%s) + APP_WAIT_SECS ))

while true; do
    if curl -sf "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
        log "cheng-api is ready"
        break
    fi

    # Check if the process died
    if ! kill -0 "$APP_PID" 2>/dev/null; then
        rm -f "$PID_FILE"
        log "--- last 50 lines of ${LOG_FILE} ---"
        tail -n 50 "$LOG_FILE" >&2 || true
        fail "cheng-api process exited unexpectedly (PID file removed)"
    fi

    if [[ $(date +%s) -ge $APP_DEADLINE ]]; then
        # Process still alive but /health never responded
        log "--- last 50 lines of ${LOG_FILE} ---"
        tail -n 50 "$LOG_FILE" >&2 || true
        log "PID file kept at ${PID_FILE} (process ${APP_PID} still running)"
        fail "/health did not respond after ${APP_WAIT_SECS}s — check the log above"
    fi

    sleep 2
done

log ""
log "  ChengOS is running!"
log "  API: http://127.0.0.1:${PORT}"
log "  Health: http://127.0.0.1:${PORT}/health"
log "  Logs: tail -f ${LOG_FILE}"
log "  Stop: bash stop.sh"
log ""
