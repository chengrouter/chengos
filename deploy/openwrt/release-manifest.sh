#!/usr/bin/env bash
#
# Writes and signs the OpenWrt release manifest:
#   dist/chengos-openwrt-manifest.json (+ .sig)
#
# Every profile in the support matrix (profiles.json) whose status is
# "supported" or "experimental" is advertised, and each must have its release
# archive and PostgreSQL bundle in DIST: a missing asset fails the release
# instead of publishing a manifest that points at nothing.
#
# Usage:
#   deploy/openwrt/release-manifest.sh --key KEY.pem [--dist DIR] [--profiles FILE]
#                                      [--version X.Y.Z] [--validity-days N]
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${OPENWRT_DIR}/../.." && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"

usage() { sed -n '2,13p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

KEY="" DIST="${REPO_ROOT}/dist" PROFILES="${OPENWRT_DIR}/profiles.json" VALIDITY_DAYS=365
VERSION="$(tr -d '[:space:]' < "${REPO_ROOT}/VERSION")"
while [[ $# -gt 0 ]]; do
    case "$1" in
        --key) KEY="${2:-}"; shift 2 ;;
        --dist) DIST="${2:-}"; shift 2 ;;
        --profiles) PROFILES="${2:-}"; shift 2 ;;
        --version) VERSION="${2:-}"; shift 2 ;;
        --validity-days) VALIDITY_DAYS="${2:-}"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        *) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
    esac
done
command -v jq >/dev/null 2>&1 || ow_die "jq is required"
[[ -f "$KEY" ]] || ow_die "--key KEY.pem (the release signing key) is required"
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || ow_die "version '${VERSION}' is not MAJOR.MINOR.PATCH"
[[ "$VALIDITY_DAYS" =~ ^[0-9]+$ && "$VALIDITY_DAYS" -ge 1 ]] || ow_die "--validity-days must be a positive number"
[[ "$(jq -r .schema "$PROFILES")" == 1 ]] || ow_die "${PROFILES}: unsupported schema"

# asset_json FILE: {asset, sha256, size, unpacked_size}.
asset_json() {
    local file=$1
    [[ -f "$file" ]] || ow_die "missing release asset: ${file}"
    jq -n --arg asset "$(basename "$file")" --arg sha "$(sha256sum "$file" | cut -d' ' -f1)" \
        --argjson size "$(stat -c %s "$file")" --argjson unpacked "$(gzip -dc "$file" | wc -c)" \
        '{asset: $asset, sha256: $sha, size: $size, unpacked_size: $unpacked}'
}

MANAGER="${DIST}/chengos-openwrt-manager-v${VERSION}.sh"
[[ -f "$MANAGER" ]] || ow_die "missing manager asset: ${MANAGER}"
grep -q '@CHENGOS_RELEASE_PUBKEY@' "$MANAGER" && ow_die "${MANAGER} has no release key rendered"

profiles='[]'
count="$(jq '.profiles | length' "$PROFILES")"
for ((i = 0; i < count; i++)); do
    p="$(jq -c ".profiles[$i]" "$PROFILES")"
    id="$(jq -r .id <<< "$p")" status="$(jq -r .status <<< "$p")" arch="$(jq -r .arch <<< "$p")"
    case "$status" in supported|experimental) ;; *) ow_log "not advertising ${id} (${status})"; continue ;; esac
    [[ "$id" =~ ^[a-z0-9][a-z0-9._-]*$ ]] || ow_die "profile id '${id}' is invalid"
    [[ "$arch" == arm64 || "$arch" == amd64 ]] || ow_die "profile ${id}: arch '${arch}' is invalid"
    for field in board machine distrib_release; do
        [[ -n "$(jq -r ".match.${field} // empty" <<< "$p")" ]] || ow_die "profile ${id}: match.${field} is required"
    done
    for field in min_ram_mb min_free_mb min_free_inodes; do
        [[ "$(jq -r ".${field} | numbers" <<< "$p")" =~ ^[0-9]+$ ]] || ow_die "profile ${id}: ${field} must be a number"
    done
    archive="$(asset_json "${DIST}/chengos-openwrt-${arch}-v${VERSION}.tar.gz")"
    pg_file="${DIST}/chengos-openwrt-pg-${id}-v${VERSION}.tar.gz"
    pg="$(asset_json "$pg_file")"
    packages="$(gzip -dc "$pg_file" | tar -xOf - chengos-pg/PACKAGES \
        | jq -R -s 'split("\n") | map(select(length > 0) | split(" ")
            | {name: .[0], version: .[1], sha256: .[2], file: .[3]})')"
    pg="$(jq --argjson packages "$packages" '. + {packages: $packages}' <<< "$pg")"
    entry="$(jq --argjson archive "$archive" --argjson postgres "$pg" \
        '{id, status, arch, match, min_ram_mb, min_free_mb, min_free_inodes, archive: $archive, postgres: $postgres}' <<< "$p")"
    profiles="$(jq --argjson e "$entry" '. + [$e]' <<< "$profiles")"
    ow_log "advertising ${id} (${status})"
done
[[ "$(jq length <<< "$profiles")" -gt 0 ]] || ow_die "no profile is advertised; refusing to publish an empty manifest"

issued="$(date +%s)"
expires=$(( issued + VALIDITY_DAYS * 86400 ))
OUT="${DIST}/chengos-openwrt-manifest.json"
jq -n --arg version "$VERSION" --argjson issued "$issued" --argjson expires "$expires" \
    --arg manager "$(basename "$MANAGER")" --arg manager_sha "$(sha256sum "$MANAGER" | cut -d' ' -f1)" \
    --argjson profiles "$profiles" \
    '{schema: 1, version: $version, channel: "stable",
      issued_at: ($issued | todate), expires_at: ($expires | todate),
      issued_epoch: $issued, expires_epoch: $expires,
      manager: {asset: $manager, sha256: $manager_sha}, profiles: $profiles}' > "$OUT"
"${OPENWRT_DIR}/release-sign.sh" sign "$KEY" "$OUT"
ow_log "manifest ${OUT} (valid until $(date -u -d "@${expires}" +%F))"
printf '%s\n' "$OUT"
