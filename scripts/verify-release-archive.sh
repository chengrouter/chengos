#!/usr/bin/env bash
#
# Structural verification of a ChengOS native release archive.
#
# Runs in two places with identical semantics:
#   - CI, immediately after packaging and before publishing a Release
#   - the updater (`deploy/chengos.sh`), after download and checksum/signature
#     verification and before any installed file is touched
#
# It answers one question: is this tarball a complete ChengOS bundle for the
# exact version we intended to install?
#
# Usage:
#   ./scripts/verify-release-archive.sh --archive PATH  [--expect-version X.Y.Z] [--expect-arch ARCH]
#   ./scripts/verify-release-archive.sh --dir PATH      [--expect-version X.Y.Z] [--expect-arch ARCH]
#
# Options:
#   --archive PATH         Verify a .tar.gz archive (listed, and VERSION read).
#   --dir PATH             Verify an already-extracted bundle root (the
#                          directory that directly contains bin/ and VERSION).
#   --expect-version X.Y.Z Require the embedded VERSION to equal this value.
#   --expect-arch ARCH     Require bin/cheng-api and bin/cheng to be 64-bit ELFs
#                          for ARCH (amd64 or arm64).
#   --quiet                Only report failures.
set -euo pipefail

ARCHIVE=""
BUNDLE_DIR=""
EXPECT_VERSION=""
EXPECT_ARCH=""
QUIET="false"

usage() {
    sed -n '2,24p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

fail() {
    printf 'ERROR: %s\n' "$*" >&2
    exit 1
}

log() {
    [[ "$QUIET" == "true" ]] && return 0
    printf '%s\n' "$*"
}

is_stable_semver() {
    [[ "$1" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --archive) ARCHIVE="${2:-}"; shift 2 ;;
        --dir) BUNDLE_DIR="${2:-}"; shift 2 ;;
        --expect-version) EXPECT_VERSION="${2#v}"; shift 2 ;;
        --expect-arch) EXPECT_ARCH="${2:-}"; shift 2 ;;
        --quiet|-q) QUIET="true"; shift ;;
        -h|--help) usage; exit 0 ;;
        *) echo "verify-release-archive: unknown option: $1" >&2; usage >&2; exit 1 ;;
    esac
done

if [[ -n "$ARCHIVE" && -n "$BUNDLE_DIR" ]]; then
    fail "--archive and --dir are mutually exclusive"
fi
if [[ -z "$ARCHIVE" && -z "$BUNDLE_DIR" ]]; then
    fail "one of --archive PATH or --dir PATH is required"
fi
if [[ -n "$EXPECT_VERSION" ]] && ! is_stable_semver "$EXPECT_VERSION"; then
    fail "--expect-version '${EXPECT_VERSION}' is not a strict stable SemVer"
fi
case "$EXPECT_ARCH" in
    "") ;;
    amd64) expected_machine=62 ;;   # EM_X86_64
    arm64) expected_machine=183 ;;  # EM_AARCH64
    *) fail "--expect-arch '${EXPECT_ARCH}' is not supported (amd64 or arm64)" ;;
esac

# Prints the ELF e_machine of a file (64-bit little-endian only) using od
# byte reads, which also work on BusyBox and BSD userlands.
elf_machine() {
    local magic class data lo hi
    magic="$(od -An -tx1 -N4 "$1" 2>/dev/null | tr -d ' \n')"
    [[ "$magic" == "7f454c46" ]] || return 1
    class="$(od -An -tu1 -j4 -N1 "$1" | tr -d ' \n')"
    data="$(od -An -tu1 -j5 -N1 "$1" | tr -d ' \n')"
    [[ "$class" == "2" && "$data" == "1" ]] || return 1
    read -r lo hi <<< "$(od -An -tu1 -j18 -N2 "$1")"
    [[ -n "${lo:-}" && -n "${hi:-}" ]] || return 1
    printf '%s' "$(( lo + 256 * hi ))"
}

check_binary_arch() {
    local label="$1" file="$2" machine
    machine="$(elf_machine "$file")" || fail "${label} is not a 64-bit little-endian ELF"
    [[ "$machine" == "$expected_machine" ]] \
        || fail "${label} is built for ELF machine ${machine}, not ${EXPECT_ARCH}"
}

# Package-owned entries that must exist in every native bundle. Anything an
# operator owns (.env, data, logs, runtime, workspace, models) is deliberately
# absent from this list — it must never ship inside a release archive.
REQUIRED_PATHS=(
    "VERSION"
    "bin/cheng-api"
    "bin/cheng"
    "bin/ui-server.js"
    "bin/app-server.js"
    "bin/lib/http-hardening.js"
    ".env.example"
    "chengos.sh"
    "generate-env.sh"
    "hybrid/start.sh"
    "hybrid/stop.sh"
    "hybrid/status.sh"
    "hybrid/generate-env.sh"
    "lib/release-update.sh"
    "lib/verify-release-archive.sh"
    "infra/docker-compose.yml"
    "config/presets.yaml"
    "config/shortcuts.yaml"
)
REQUIRED_DIR_PREFIXES=(
    "config/i18n/"
)
# Entries that must be executable in the installed tree.
REQUIRED_EXECUTABLES=(
    "bin/cheng-api"
    "bin/cheng"
    "chengos.sh"
    "generate-env.sh"
    "hybrid/start.sh"
    "hybrid/stop.sh"
    "hybrid/status.sh"
    "lib/verify-release-archive.sh"
)
# Instance-owned content that a package must never carry.
FORBIDDEN_PATHS=(
    ".env"
    ".chengos_version"
    ".chengos_install_mode"
)

embedded_version=""

if [[ -n "$ARCHIVE" ]]; then
    [[ -f "$ARCHIVE" ]] || fail "archive not found: ${ARCHIVE}"
    log "Verifying archive: ${ARCHIVE}"

    # One listing; reused for all structural checks below via bash builtin
    # string matching to avoid SIGPIPE issues under pipefail.
    listing="$(tar -tzf "$ARCHIVE")" || fail "archive is not a readable gzip tarball: ${ARCHIVE}"

    # Every entry must live under a single `chengos/` top-level directory so
    # extraction can never escape the staging root.
    while IFS= read -r entry; do
        [[ -n "$entry" ]] || continue
        case "$entry" in
            chengos|chengos/*) ;;
            *) fail "archive contains an entry outside chengos/: ${entry}" ;;
        esac
        case "$entry" in
            */../*|../*) fail "archive contains a path traversal entry: ${entry}" ;;
        esac
    done <<< "$listing"

    # Use bash builtin string matching instead of `printf | grep` pipelines:
    # under `set -o pipefail`, `grep -q` exiting early on match sends SIGPIPE
    # to `printf`, making the pipeline return non-zero and causing false
    # "missing entry" failures on large archives.
    nl=$'\n' wrapped="${nl}${listing}${nl}"
    for required in "${REQUIRED_PATHS[@]}"; do
        [[ "${wrapped}" == *"${nl}chengos/${required}${nl}"* ]] \
            || fail "required entry missing from archive: chengos/${required}"
    done
    for prefix in "${REQUIRED_DIR_PREFIXES[@]}"; do
        [[ "${wrapped}" == *"${nl}chengos/${prefix}"* ]] \
            || fail "required directory missing from archive: chengos/${prefix}"
    done
    for forbidden in "${FORBIDDEN_PATHS[@]}"; do
        if [[ "${wrapped}" == *"${nl}chengos/${forbidden}${nl}"* ]]; then
            fail "archive contains instance-owned content that must never be packaged: chengos/${forbidden}"
        fi
    done

    embedded_version="$(tar -xzOf "$ARCHIVE" chengos/VERSION 2>/dev/null | tr -d '[:space:]')" \
        || fail "failed to read chengos/VERSION from ${ARCHIVE}"

    if [[ -n "$EXPECT_ARCH" ]]; then
        arch_tmp="$(mktemp -d)"
        trap 'rm -rf "$arch_tmp"' EXIT
        tar -xzf "$ARCHIVE" -C "$arch_tmp" chengos/bin/cheng-api chengos/bin/cheng \
            || fail "failed to extract binaries from ${ARCHIVE}"
        check_binary_arch "chengos/bin/cheng-api" "${arch_tmp}/chengos/bin/cheng-api"
        check_binary_arch "chengos/bin/cheng" "${arch_tmp}/chengos/bin/cheng"
    fi
else
    [[ -d "$BUNDLE_DIR" ]] || fail "bundle directory not found: ${BUNDLE_DIR}"
    BUNDLE_DIR="${BUNDLE_DIR%/}"
    log "Verifying extracted bundle: ${BUNDLE_DIR}"

    for required in "${REQUIRED_PATHS[@]}"; do
        [[ -e "${BUNDLE_DIR}/${required}" ]] \
            || fail "required entry missing from bundle: ${required}"
    done
    for prefix in "${REQUIRED_DIR_PREFIXES[@]}"; do
        [[ -d "${BUNDLE_DIR}/${prefix%/}" ]] \
            || fail "required directory missing from bundle: ${prefix}"
    done
    for forbidden in "${FORBIDDEN_PATHS[@]}"; do
        if [[ -e "${BUNDLE_DIR}/${forbidden}" ]]; then
            fail "bundle contains instance-owned content that must never be packaged: ${forbidden}"
        fi
    done
    for exe in "${REQUIRED_EXECUTABLES[@]}"; do
        [[ -x "${BUNDLE_DIR}/${exe}" ]] \
            || fail "bundle entry is not executable: ${exe}"
    done

    embedded_version="$(tr -d '[:space:]' < "${BUNDLE_DIR}/VERSION")"

    if [[ -n "$EXPECT_ARCH" ]]; then
        check_binary_arch "bin/cheng-api" "${BUNDLE_DIR}/bin/cheng-api"
        check_binary_arch "bin/cheng" "${BUNDLE_DIR}/bin/cheng"
    fi
fi

[[ -n "$embedded_version" ]] || fail "embedded VERSION is empty"
is_stable_semver "$embedded_version" \
    || fail "embedded VERSION is not a strict stable SemVer: '${embedded_version}'"

log "Embedded version: ${embedded_version}"

if [[ -n "$EXPECT_VERSION" && "$embedded_version" != "$EXPECT_VERSION" ]]; then
    fail "version mismatch: bundle carries ${embedded_version} but ${EXPECT_VERSION} was expected"
fi

log "Archive verification passed (${embedded_version}${EXPECT_ARCH:+, ${EXPECT_ARCH}})"
