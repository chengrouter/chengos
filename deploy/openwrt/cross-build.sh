#!/usr/bin/env bash
#
# Builds a Rust binary for the OpenWrt appliance and enforces the static ELF
# contract on the result.
#
# Usage:
#   deploy/openwrt/cross-build.sh --project DIR --bin NAME [options]
#
# Options:
#   --project DIR        Cargo project/workspace root (contains Cargo.toml)
#   --bin NAME           Binary name produced under target/TRIPLE/release/
#   --package PKG        Cargo package to build (-p); default: whole project
#   --target TRIPLE      Rust target (default: aarch64-unknown-linux-musl)
#   --features LIST      Passed to cargo/cross --features
#   --builder MODE       auto|cross|cargo (default: auto). auto uses plain cargo
#                        only when the target architecture matches the
#                        workstation and a matching musl linker is installed;
#                        otherwise it uses cross (Docker, no OpenWrt SDK).
#   --skip-build         Only run the ELF check on an existing artifact
#
# cross builds use PROJECT/target/cross as the target directory so the
# container's host-side build scripts never share (and invalidate) the
# workstation's native target/ cache.
#
# Prints the verified artifact path on stdout. Environment such as
# CHENGOS_VERSION reaches the cross container only when the project's
# Cross.toml lists it under [build.env] passthrough.
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"

usage() { sed -n '2,28p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

PROJECT=""
BIN_NAME=""
PACKAGE=""
TARGET="aarch64-unknown-linux-musl"
FEATURES=""
BUILDER="auto"
SKIP_BUILD=0
while [[ $# -gt 0 ]]; do
    case "$1" in
        --project) PROJECT="${2:-}"; shift 2 ;;
        --bin) BIN_NAME="${2:-}"; shift 2 ;;
        --package) PACKAGE="${2:-}"; shift 2 ;;
        --target) TARGET="${2:-}"; shift 2 ;;
        --features) FEATURES="${2:-}"; shift 2 ;;
        --builder) BUILDER="${2:-}"; shift 2 ;;
        --skip-build) SKIP_BUILD=1; shift ;;
        -h|--help) usage; exit 0 ;;
        *) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
    esac
done

[[ -n "$PROJECT" && -f "${PROJECT}/Cargo.toml" ]] || ow_die "--project must point at a Cargo project"
[[ -n "$BIN_NAME" ]] || ow_die "--bin is required"
[[ "$TARGET" == *-linux-musl ]] || ow_die "target ${TARGET} is not a musl target; the appliance contract is a static musl ELF"
ARCH="$(ow_release_arch_for_triple "$TARGET")" || ow_die "unsupported target architecture: ${TARGET}"
PROJECT="$(cd "$PROJECT" && pwd)"

# Cargo's linker for a musl target: the project config names it (e.g.
# x86_64-linux-musl-gcc). Plain cargo is safe only if that program exists.
musl_linker_available() {
    local prefix="${TARGET%%-*}"
    command -v "${prefix}-linux-musl-gcc" >/dev/null 2>&1
}

resolve_builder() {
    case "$BUILDER" in
        cross|cargo) printf '%s' "$BUILDER" ;;
        auto)
            local host_arch
            host_arch="$(ow_release_arch_for_uname "$(uname -m)" 2>/dev/null || true)"
            if [[ "$host_arch" == "$ARCH" ]] && musl_linker_available; then
                printf 'cargo'
            else
                printf 'cross'
            fi
            ;;
        *) ow_die "invalid --builder '${BUILDER}' (auto|cross|cargo)" ;;
    esac
}

builder="$(resolve_builder)"
TARGET_DIR="${PROJECT}/target"
[[ "$builder" == "cross" ]] && TARGET_DIR="${PROJECT}/target/cross"

if [[ "$SKIP_BUILD" -eq 0 ]]; then
    if [[ "$builder" == "cross" ]]; then
        command -v cross >/dev/null 2>&1 || ow_die "cross is not installed (cargo install cross)"
        docker info >/dev/null 2>&1 || ow_die "Docker is not reachable; cross needs it"
    fi
    args=(build --release --target "$TARGET" --target-dir "$TARGET_DIR")
    [[ -n "$PACKAGE" ]] && args+=(-p "$PACKAGE")
    [[ -n "$FEATURES" ]] && args+=(--features "$FEATURES")
    ow_log "Building ${BIN_NAME} for ${TARGET} with ${builder} (${PROJECT})"
    # cross's linker wrapper prints one shell-debug warning to stderr on every
    # build; it is harmless, so success is judged by the exit status and the
    # ELF check below, never by stderr being empty.
    ( cd "$PROJECT" && "$builder" "${args[@]}" ) >&2
fi

ARTIFACT="${TARGET_DIR}/${TARGET}/release/${BIN_NAME}"
[[ -f "$ARTIFACT" ]] || ow_die "artifact not found: ${ARTIFACT}"
"${OPENWRT_DIR}/elf-check.sh" --expect-arch "$ARCH" "$ARTIFACT"
printf '%s\n' "$ARTIFACT"
