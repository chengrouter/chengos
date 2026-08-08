#!/usr/bin/env bash
set -euo pipefail

# Hybrid environment generator.
# Delegates to the unified deploy/generate-env.sh so all modes share deploy/.env.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p "${ROOT_DIR}/workspace"

args=()

[[ -z "${CHENG_CLI_WORKSPACE:-}" ]] && CHENG_CLI_WORKSPACE="${ROOT_DIR}/workspace"

[[ -n "${ENABLE_REDIS:-}" ]] && args+=("--enable-redis" "$ENABLE_REDIS")
[[ -n "${ENABLE_QDRANT:-}" ]] && args+=("--enable-qdrant" "$ENABLE_QDRANT")
[[ -n "${DB_INSTALL_MODE:-}" ]] && args+=("--db-install-mode" "$DB_INSTALL_MODE")
[[ -n "${UI_PORT:-}" ]] && args+=("--ui-port" "$UI_PORT")
[[ -n "${APP_PORT:-}" ]] && args+=("--app-port" "$APP_PORT")
[[ -n "${CHENG_CLI_WORKSPACE:-}" ]] && args+=("--cli-workspace" "$CHENG_CLI_WORKSPACE")

exec bash generate-env.sh "${args[@]+"${args[@]}"}" "$@"
