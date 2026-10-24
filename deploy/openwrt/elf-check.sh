#!/usr/bin/env bash
#
# Static ELF contract check for binaries that run on the OpenWrt appliance.
#
# A release binary passes only when it is a 64-bit ELF for the expected
# architecture with no program interpreter (PT_INTERP) and no dynamic NEEDED
# libraries. A musl target triple alone is not proof of that.
#
# Usage:
#   deploy/openwrt/elf-check.sh --expect-arch amd64|arm64 BINARY...
#
# Requires `od`; uses `readelf` for the interpreter/NEEDED checks and refuses
# to pass without it rather than skipping them. `file` output is informational.
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"

usage() { sed -n '2,13p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

EXPECT_ARCH=""
BINARIES=()
while [[ $# -gt 0 ]]; do
    case "$1" in
        --expect-arch) EXPECT_ARCH="${2:-}"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        -*) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
        *) BINARIES+=("$1"); shift ;;
    esac
done

[[ -n "$EXPECT_ARCH" ]] || ow_die "--expect-arch is required"
[[ ${#BINARIES[@]} -gt 0 ]] || ow_die "at least one binary is required"
expected_machine="$(ow_elf_machine_for_arch "$EXPECT_ARCH")" \
    || ow_die "unsupported --expect-arch '${EXPECT_ARCH}' (expected amd64 or arm64)"
command -v readelf >/dev/null 2>&1 \
    || ow_die "readelf is required to prove the static ELF contract (install binutils)"

check_one() {
    local bin="$1" machine interp needed
    [[ -f "$bin" ]] || { ow_error "${bin}: not found"; return 1; }

    machine="$(ow_elf_machine_of "$bin")" \
        || { ow_error "${bin}: not a 64-bit little-endian ELF"; return 1; }
    if [[ "$machine" != "$expected_machine" ]]; then
        ow_error "${bin}: ELF machine ${machine} does not match ${EXPECT_ARCH} (${expected_machine})"
        return 1
    fi

    # readelf exits non-zero on malformed input; treat that as a failure, not
    # as "no INTERP found".
    interp="$(readelf -lW "$bin" 2>/dev/null)" || { ow_error "${bin}: readelf -l failed"; return 1; }
    if grep -q 'INTERP' <<< "$interp"; then
        ow_error "${bin}: has a PT_INTERP program header (dynamically linked)"
        return 1
    fi
    needed="$(readelf -dW "$bin" 2>/dev/null)" || { ow_error "${bin}: readelf -d failed"; return 1; }
    if grep -q '(NEEDED)' <<< "$needed"; then
        ow_error "${bin}: depends on shared libraries:"
        grep '(NEEDED)' <<< "$needed" >&2
        return 1
    fi

    if command -v file >/dev/null 2>&1; then
        ow_log "$(file -b "$bin" | cut -c1-120)"
    fi
    ow_log "${bin}: static ${EXPECT_ARCH} ELF, $(du -h "$bin" | cut -f1)"
}

status=0
for bin in "${BINARIES[@]}"; do
    check_one "$bin" || status=1
done
exit "$status"
