#!/usr/bin/env bash
#
# Collects the read-only device facts the appliance plan's Phase 0 decision
# log needs (board identity, RAM, firmware/feeds, package manager, PostgreSQL
# availability, rpcd uci methods, storage, clock, sysupgrade keep-list).
#
# Usage:
#   deploy/openwrt/probe.sh [--router USER@HOST] [--ssh-port PORT]
#                           [--output FILE] [--refresh-feeds]
#
#   --refresh-feeds  download the package index first (tmpfs cache only;
#                    no configuration or installed package changes)
#   --output FILE    also write the sanitised report to FILE
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"
# shellcheck source=lib/ssh.sh
source "${OPENWRT_DIR}/lib/ssh.sh"

usage() { sed -n '2,14p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

OUTPUT=""
REFRESH=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        --router) ROUTER="${2:-}"; shift 2 ;;
        --ssh-port) SSH_PORT="${2:-}"; shift 2 ;;
        --output) OUTPUT="${2:-}"; shift 2 ;;
        --refresh-feeds) REFRESH="refresh-feeds"; shift ;;
        -h|--help) usage; exit 0 ;;
        *) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
    esac
done

ow_log "Probing ${ROUTER} (read-only${REFRESH:+, refreshing package index})"
if [[ -n "$OUTPUT" ]]; then
    ow_remote_script ${REFRESH:+"$REFRESH"} < "${OPENWRT_DIR}/remote/probe.sh" | ow_strip_ansi | tee "$OUTPUT"
    ow_log "Report written to ${OUTPUT}"
else
    ow_remote_script ${REFRESH:+"$REFRESH"} < "${OPENWRT_DIR}/remote/probe.sh" | ow_strip_ansi
fi
