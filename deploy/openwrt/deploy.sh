#!/usr/bin/env bash
#
# Installs and manages one static binary as a procd service on an OpenWrt
# router over SSH. Shared by every appliance service (cheng-panel today,
# cheng-api next); a caller passes only its own name, binary, port and env.
#
# Usage:
#   deploy/openwrt/deploy.sh --name NAME [options] COMMAND
#
# Commands:
#   deploy    verify the binary, upload it, stop stale copies on the port,
#             install /etc/init.d/NAME, enable and restart, wait for readiness
#   start|stop|restart|enable|disable   pass through to /etc/init.d/NAME
#   status    procd state and current listeners on --port
#   logs      last --lines lines of `logread -e NAME`, ANSI codes removed
#   rollback  restore NAME.prev (kept by the last deploy) and restart
#
# Options:
#   --name NAME          service and binary name on the router (required)
#   --binary PATH        local static ELF to install (deploy)
#   --remote-dir DIR     install directory (default: /opt/NAME)
#   --data-dir DIR       directory created before start (default: DIR/data)
#   --port PORT          TCP port the service listens on (deploy/status)
#   --env KEY=VALUE      service environment entry (repeatable)
#   --arg ARG            extra service argument (repeatable)
#   --respawn "T TO R"   procd respawn threshold/timeout/retry (default "3600 5 5")
#   --ready-timeout SECS readiness wait after restart (default: 30)
#   --lines N            log lines for `logs` (default: 100)
#   --router USER@HOST   default: $ROUTER or root@192.168.1.1
#   --ssh-port PORT      default: $SSH_PORT or 22
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"
# shellcheck source=lib/ssh.sh
source "${OPENWRT_DIR}/lib/ssh.sh"
# shellcheck source=lib/procd.sh
source "${OPENWRT_DIR}/lib/procd.sh"

usage() { sed -n '2,31p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

NAME=""
BINARY=""
REMOTE_DIR=""
DATA_DIR=""
DATA_DIR_SET=0
PORT=""
SERVICE_ENV=()
SERVICE_ARGS=()
RESPAWN="3600 5 5"
READY_TIMEOUT=30
LINES=100
COMMAND=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        --name) NAME="${2:-}"; shift 2 ;;
        --binary) BINARY="${2:-}"; shift 2 ;;
        --remote-dir) REMOTE_DIR="${2:-}"; shift 2 ;;
        --data-dir) DATA_DIR="${2:-}"; DATA_DIR_SET=1; shift 2 ;;
        --port) PORT="${2:-}"; shift 2 ;;
        --env) SERVICE_ENV+=("${2:-}"); shift 2 ;;
        --arg) SERVICE_ARGS+=("${2:-}"); shift 2 ;;
        --respawn) RESPAWN="${2:-}"; shift 2 ;;
        --ready-timeout) READY_TIMEOUT="${2:-}"; shift 2 ;;
        --lines) LINES="${2:-}"; shift 2 ;;
        --router) ROUTER="${2:-}"; shift 2 ;;
        --ssh-port) SSH_PORT="${2:-}"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        -*) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
        *) [[ -z "$COMMAND" ]] || ow_die "unexpected argument: $1"; COMMAND="$1"; shift ;;
    esac
done

[[ "$NAME" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]] || ow_die "--name is required (letters, digits, . _ -)"
[[ -n "$COMMAND" ]] || { usage >&2; exit 2; }
: "${REMOTE_DIR:=/opt/${NAME}}"
[[ "$REMOTE_DIR" == /* ]] || ow_die "--remote-dir must be absolute"
REMOTE_DIR="${REMOTE_DIR%/}"
[[ "$DATA_DIR_SET" -eq 1 ]] || DATA_DIR="${REMOTE_DIR}/data"
[[ -z "$PORT" || "$PORT" =~ ^[0-9]+$ ]] || ow_die "--port must be numeric"
[[ "$READY_TIMEOUT" =~ ^[0-9]+$ && "$LINES" =~ ^[0-9]+$ ]] || ow_die "--ready-timeout/--lines must be numeric"

REMOTE_BIN="${REMOTE_DIR}/${NAME}"
INIT_SCRIPT="/etc/init.d/${NAME}"
LISTENERS_SCRIPT="${OPENWRT_DIR}/remote/port-listeners.sh"
Q_NAME="$(ow_sh_quote "$NAME")"
Q_DIR="$(ow_sh_quote "$REMOTE_DIR")"
Q_BIN="$(ow_sh_quote "$REMOTE_BIN")"
Q_INIT="$(ow_sh_quote "$INIT_SCRIPT")"

listeners() { ow_remote_script "$@" < "$LISTENERS_SCRIPT"; }

local_sha256() { sha256sum "$1" | awk '{print $1}'; }

cmd_deploy() {
    [[ -n "$BINARY" && -f "$BINARY" ]] || ow_die "--binary must name an existing file"
    [[ -n "$PORT" ]] || ow_die "--port is required for deploy (stale-listener preflight and readiness)"

    local machine arch remote_arch digest
    machine="$(ow_elf_machine_of "$BINARY")" || ow_die "${BINARY} is not a 64-bit ELF"
    case "$machine" in
        62) arch=amd64 ;;
        183) arch=arm64 ;;
        *) ow_die "${BINARY} has unsupported ELF machine ${machine}" ;;
    esac
    "${OPENWRT_DIR}/elf-check.sh" --expect-arch "$arch" "$BINARY"

    remote_arch="$(ow_release_arch_for_uname "$(ow_remote uname -m)")" \
        || ow_die "router architecture is not supported"
    [[ "$remote_arch" == "$arch" ]] \
        || ow_die "binary is ${arch} but the router is ${remote_arch}"

    digest="$(local_sha256 "$BINARY")"
    ow_log "Uploading ${BINARY} -> ${ROUTER}:${REMOTE_BIN}.new"
    ow_remote "mkdir -p ${Q_DIR}"
    ow_upload "$BINARY" "${REMOTE_BIN}.new"
    ow_remote "chmod 0755 ${Q_BIN}.new && [ \"\$(sha256sum ${Q_BIN}.new | cut -d' ' -f1)\" = '${digest}' ]" \
        || ow_die "uploaded binary failed its SHA-256 check; the installed binary is unchanged"

    INIT_TMP="$(mktemp)"
    trap 'rm -f "$INIT_TMP"' EXIT
    ow_procd_render "$NAME" "$REMOTE_BIN" "$REMOTE_DIR" "$DATA_DIR" "$RESPAWN" SERVICE_ENV SERVICE_ARGS > "$INIT_TMP"

    # Stop the procd instance first, then anything still on the port: a copy
    # started outside procd keeps the port and drives the new instance into
    # an AddrInUse respawn loop.
    ow_remote "[ ! -x ${Q_INIT} ] || ${Q_INIT} stop" || true
    listeners clear "$PORT" "$REMOTE_BIN" 15 \
        || ow_die "port ${PORT} is not free; the installed binary is unchanged"

    ow_remote "if [ -f ${Q_BIN} ]; then cp -p ${Q_BIN} ${Q_BIN}.prev; fi && mv -f ${Q_BIN}.new ${Q_BIN}"
    ow_upload "$INIT_TMP" "$INIT_SCRIPT"
    ow_remote "chmod 0755 ${Q_INIT} && ${Q_INIT} enable && ${Q_INIT} restart"

    if listeners wait "$PORT" "$REMOTE_BIN" "$READY_TIMEOUT"; then
        ow_log "${NAME} is running and listening on port ${PORT}"
    else
        ow_error "${NAME} did not become ready; recent log:"
        cmd_logs 30 >&2 || true
        ow_error "previous binary kept as ${REMOTE_BIN}.prev; run '$0 --name ${NAME} rollback' to restore it"
        exit 1
    fi
}

cmd_rollback() {
    ow_remote "[ -f ${Q_BIN}.prev ]" || ow_die "no ${REMOTE_BIN}.prev on the router"
    ow_remote "${Q_INIT} stop || true; cp -p ${Q_BIN} ${Q_BIN}.failed 2>/dev/null; mv -f ${Q_BIN}.prev ${Q_BIN} && ${Q_INIT} start"
    ow_log "restored previous ${NAME}; the replaced binary is ${REMOTE_BIN}.failed"
}

cmd_status() {
    ow_remote "if [ -x ${Q_INIT} ]; then ${Q_INIT} status; else echo 'not installed'; fi; ${Q_INIT} enabled 2>/dev/null && echo 'enabled at boot' || echo 'not enabled at boot'"
    if [[ -n "$PORT" ]]; then
        local found
        found="$(listeners list "$PORT")"
        if [[ -n "$found" ]]; then
            printf 'listeners on port %s:\n%s\n' "$PORT" "$found"
        else
            printf 'nothing listens on port %s\n' "$PORT"
        fi
    fi
}

cmd_logs() {
    local lines="${1:-$LINES}"
    ow_remote "logread -e ${Q_NAME} | tail -n ${lines}" | ow_strip_ansi
}

case "$COMMAND" in
    deploy) cmd_deploy ;;
    start|stop|restart|enable|disable) ow_remote "${Q_INIT} ${COMMAND}" ;;
    status) cmd_status ;;
    logs) cmd_logs ;;
    rollback) cmd_rollback ;;
    *) ow_error "unknown command: ${COMMAND}"; usage >&2; exit 2 ;;
esac
