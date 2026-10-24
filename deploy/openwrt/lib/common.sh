#!/usr/bin/env bash
#
# Shared helpers for the OpenWrt appliance tooling under deploy/openwrt/.
#
# This file is sourced, never executed:
#   source "${OPENWRT_DIR}/lib/common.sh"
#
# It holds only workstation-side helpers (logging, architecture mapping, log
# sanitising). Anything that runs on the router is plain POSIX/BusyBox `sh`
# and lives in the scripts that ship it over SSH.

ow_log()   { printf '[openwrt] %s\n' "$*" >&2; }
ow_warn()  { printf '[openwrt] WARNING: %s\n' "$*" >&2; }
ow_error() { printf '[openwrt] ERROR: %s\n' "$*" >&2; }
ow_die()   { ow_error "$*"; exit 1; }

# Release architecture label for a Rust target triple. Only the architectures
# the appliance plan names are accepted; anything else fails instead of being
# packaged under a guessed label.
ow_release_arch_for_triple() {
    case "${1:?target triple required}" in
        x86_64-*)  printf 'amd64' ;;
        aarch64-*) printf 'arm64' ;;
        *) return 1 ;;
    esac
}

# Release architecture label for `uname -m` output (workstation or router).
ow_release_arch_for_uname() {
    case "${1:?uname -m value required}" in
        x86_64|amd64)          printf 'amd64' ;;
        aarch64|arm64|armv8*)  printf 'arm64' ;;
        *) return 1 ;;
    esac
}

# ELF e_machine values (decimal) for each release architecture.
ow_elf_machine_for_arch() {
    case "${1:?release arch required}" in
        amd64) printf '62' ;;   # EM_X86_64
        arm64) printf '183' ;;  # EM_AARCH64
        *) return 1 ;;
    esac
}

# Reads e_machine from an ELF64 little-endian header with nothing but `od`, so
# the check also works where binutils/file are not installed. Prints the
# decimal value, or fails when the file is not a 64-bit little-endian ELF.
ow_elf_machine_of() {
    local file="${1:?file required}" magic class data machine lo hi
    magic="$(od -An -tx1 -N4 "$file" 2>/dev/null | tr -d ' \n')"
    [[ "$magic" == "7f454c46" ]] || return 1
    class="$(od -An -tu1 -j4 -N1 "$file" | tr -d ' \n')"
    data="$(od -An -tu1 -j5 -N1 "$file" | tr -d ' \n')"
    [[ "$class" == "2" && "$data" == "1" ]] || return 1
    # Two single bytes instead of `od --endian` (GNU-only).
    read -r lo hi <<< "$(od -An -tu1 -j18 -N2 "$file")"
    [[ -n "${lo:-}" && -n "${hi:-}" ]] || return 1
    machine=$(( lo + 256 * hi ))
    printf '%s' "$machine"
}

# Removes ANSI escape sequences (colors, cursor movement) from stdin. Router
# and service logs may carry them; parse only sanitised text.
ow_strip_ansi() {
    # CSI: ESC [ params (0x30-0x3F) intermediates (0x20-0x2F) final (0x40-0x7E);
    # OSC: ESC ] ... BEL. `#` delimiters keep `/` literal inside the brackets.
    LC_ALL=C sed -E $'s#\x1b\\[[0-?]*[ -/]*[@-~]##g; s#\x1b\\][^\x07]*\x07##g; s#\r$##'
}
