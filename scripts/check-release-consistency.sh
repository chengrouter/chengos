#!/usr/bin/env bash
#
# Read-only release consistency validation.
#
# Asserts that the single editable release version (/VERSION), the ChengFlow
# Cargo workspace version, and — when supplied — a Git tag all describe exactly
# the same strict stable SemVer release.
#
# This script never writes to the repository. It is safe to run from CI, from
# release.sh before any mutation, and from a developer shell.
#
# Usage:
#   ./scripts/check-release-consistency.sh [--tag vX.Y.Z] [--expect X.Y.Z] [--quiet]
#
# Exit codes:
#   0  every checked source agrees and is a valid stable SemVer
#   1  a mismatch, malformed version, or missing source was found
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION_FILE="${REPO_ROOT}/VERSION"
CARGO_TOML="${REPO_ROOT}/chengflow/Cargo.toml"

TAG_ARG=""
EXPECT_ARG=""
QUIET="false"

usage() {
    sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --tag)
            TAG_ARG="${2:-}"
            shift 2
            ;;
        --expect)
            EXPECT_ARG="${2:-}"
            shift 2
            ;;
        --quiet|-q)
            QUIET="true"
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "check-release-consistency: unknown option: $1" >&2
            usage >&2
            exit 1
            ;;
    esac
done

log() {
    [[ "$QUIET" == "true" ]] && return 0
    printf '%s\n' "$*"
}

fail() {
    printf 'ERROR: %s\n' "$*" >&2
    exit 1
}

# Strict stable SemVer: MAJOR.MINOR.PATCH with no pre-release/build metadata and
# no leading zeroes. Pre-release channels are intentionally out of scope until a
# SemVer-capable comparator and explicit channel selection exist.
is_stable_semver() {
    [[ "$1" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]
}

# Strip an optional leading `v` so tags and bare versions can be compared.
strip_v() {
    printf '%s' "${1#v}"
}

read_version_file() {
    [[ -f "$VERSION_FILE" ]] || fail "VERSION file not found: ${VERSION_FILE}"
    local value
    value="$(tr -d '[:space:]' < "$VERSION_FILE")"
    [[ -n "$value" ]] || fail "VERSION file is empty: ${VERSION_FILE}"
    printf '%s' "$value"
}

# Reads `version = "..."` from the [workspace.package] table only, so a crate or
# dependency version elsewhere in the manifest can never be picked up by mistake.
read_cargo_workspace_version() {
    [[ -f "$CARGO_TOML" ]] || fail "Cargo manifest not found: ${CARGO_TOML}"
    local value
    value="$(awk '
        /^[[:space:]]*\[/ { in_section = ($0 ~ /^[[:space:]]*\[workspace\.package\][[:space:]]*$/) }
        in_section && /^[[:space:]]*version[[:space:]]*=/ {
            line = $0
            sub(/^[^=]*=[[:space:]]*/, "", line)
            gsub(/["\x27]/, "", line)
            sub(/[[:space:]]*(#.*)?$/, "", line)
            print line
            exit
        }
    ' "$CARGO_TOML")"
    [[ -n "$value" ]] || fail "[workspace.package].version not found in ${CARGO_TOML}"
    printf '%s' "$value"
}

FILE_VERSION="$(read_version_file)"
CARGO_VERSION="$(read_cargo_workspace_version)"

is_stable_semver "$FILE_VERSION" \
    || fail "VERSION is not a strict stable SemVer (MAJOR.MINOR.PATCH): '${FILE_VERSION}'"
is_stable_semver "$CARGO_VERSION" \
    || fail "chengflow/Cargo.toml [workspace.package].version is not a strict stable SemVer: '${CARGO_VERSION}'"

log "VERSION                        : ${FILE_VERSION}"
log "chengflow workspace version    : ${CARGO_VERSION}"

[[ "$FILE_VERSION" == "$CARGO_VERSION" ]] \
    || fail "version mismatch: VERSION=${FILE_VERSION} but chengflow/Cargo.toml=${CARGO_VERSION}"

if [[ -n "$TAG_ARG" ]]; then
    tag_version="$(strip_v "$TAG_ARG")"
    is_stable_semver "$tag_version" \
        || fail "tag '${TAG_ARG}' is not a stable release tag (expected vMAJOR.MINOR.PATCH)"
    log "git tag                        : ${TAG_ARG} (${tag_version})"
    [[ "$tag_version" == "$FILE_VERSION" ]] \
        || fail "version mismatch: tag=${tag_version} but VERSION=${FILE_VERSION}"
fi

if [[ -n "$EXPECT_ARG" ]]; then
    expect_version="$(strip_v "$EXPECT_ARG")"
    is_stable_semver "$expect_version" \
        || fail "--expect '${EXPECT_ARG}' is not a strict stable SemVer"
    log "expected version               : ${expect_version}"
    [[ "$expect_version" == "$FILE_VERSION" ]] \
        || fail "version mismatch: expected=${expect_version} but VERSION=${FILE_VERSION}"
fi

log "Release version consistency OK (${FILE_VERSION})"
