#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"

REMOTE=false
WITH_BINDS=true
SERVICES=(api ui app)

log()  { printf '[chengos-upgrade] %s\n' "$*"; }
fail() { printf '[chengos-upgrade] ERROR: %s\n' "$*" >&2; exit 1; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || fail "Missing command: $1"; }

usage() {
  cat <<'EOF'
Usage:
  bash upgrade.sh [options]

Options:
  --remote       Use docker-compose.remote.yml override
  --no-binds     Do not include docker-compose.binds.yml
  -h, --help     Show this help
EOF
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

[[ -f "$ENV_FILE" ]] || fail "Missing ${ENV_FILE}. Run start.sh first to generate it."

START_SCRIPT="${SCRIPT_DIR}/start.sh"
[[ -x "$START_SCRIPT" || -f "$START_SCRIPT" ]] || fail "Missing ${START_SCRIPT}"

compose_files=(-f docker-compose.yml)
if [[ "$WITH_BINDS" == true ]]; then
  compose_files+=(-f docker-compose.binds.yml)
fi
if [[ "$REMOTE" == true ]]; then
  compose_files+=(-f docker-compose.remote.yml)
fi

start_args=()
if [[ "$REMOTE" == true ]]; then
  start_args+=(--remote)
fi
if [[ "$WITH_BINDS" == false ]]; then
  start_args+=(--no-binds)
fi

log "Using compose files: ${compose_files[*]}"
log "Pulling updated images for: ${SERVICES[*]}"
docker compose "${compose_files[@]}" --env-file "$ENV_FILE" pull "${SERVICES[@]}"

log "Starting ChengOS Docker stack via start.sh"
bash "$START_SCRIPT" "${start_args[@]}"

log "Upgrade completed"
docker compose "${compose_files[@]}" --env-file "$ENV_FILE" ps "${SERVICES[@]}"
log "Logs: bash start.sh ${start_args[*]}"
