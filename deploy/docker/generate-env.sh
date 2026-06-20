#!/usr/bin/env bash
set -euo pipefail

# Docker environment generator.
# Delegates to the unified deploy/generate-env.sh so all modes share deploy/.env.
# Docker-specific connection URLs and the in-container CLI workspace are applied
# at runtime by docker-compose.yml, not in deploy/.env.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p "${ROOT_DIR}/workspace"

args=("--cli-workspace" "${ROOT_DIR}/workspace")

[[ -n "${UI_PORT:-}" ]] && args+=("--ui-port" "$UI_PORT")
[[ -n "${APP_PORT:-}" ]] && args+=("--app-port" "$APP_PORT")

exec bash generate-env.sh "${args[@]}" "$@"
