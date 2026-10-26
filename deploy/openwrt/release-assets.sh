#!/usr/bin/env bash
#
# The reproducible OpenWrt release job: builds, signs and self-verifies every
# asset the on-device installer uses, then optionally uploads them to the
# GitHub release v<VERSION>.
#
#   chengos-openwrt-<arch>-v<V>.tar.gz (+ .sha256)   package.sh, key rendered
#   chengos-openwrt-pg-<profile>-v<V>.tar.gz         pg-bundle.sh, per profile
#   chengos-openwrt-manager-v<V>.sh                  the archive's manager
#   chengos-openwrt-install.sh (+ .sha256, .sig)     the bootstrap, key rendered
#   chengos-openwrt-manifest.json (+ .sig)           release-manifest.sh
#
# Usage:
#   deploy/openwrt/release-assets.sh --key KEY.pem --pg-ipks PROFILE=DIR [...]
#       [--skip-build] [--ui-dir DIR] [--sdk-dir DIR] [--publish]
#
#   --key KEY.pem        release signing key (Ed25519 PEM; see release-sign.sh)
#   --pg-ipks P=DIR      the qualified PostgreSQL .ipk files for profile P;
#                        required for every advertised profile
#   --publish            upload to the existing GitHub release v<VERSION> with
#                        gh; refuses to replace an asset already there
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${OPENWRT_DIR}/../.." && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"

usage() { sed -n '2,22p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

KEY="" PUBLISH=0
declare -A PG_IPKS=()
package_args=()
while [[ $# -gt 0 ]]; do
    case "$1" in
        --key) KEY="${2:-}"; shift 2 ;;
        --pg-ipks) [[ "${2:-}" == *=* ]] || ow_die "--pg-ipks needs PROFILE=DIR"; PG_IPKS["${2%%=*}"]="${2#*=}"; shift 2 ;;
        --skip-build) package_args+=(--skip-build); shift ;;
        --ui-dir|--sdk-dir) package_args+=("$1" "${2:-}"); shift 2 ;;
        --publish) PUBLISH=1; shift ;;
        -h|--help) usage; exit 0 ;;
        *) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
    esac
done
[[ -f "$KEY" ]] || ow_die "--key KEY.pem is required"
VERSION="$(tr -d '[:space:]' < "${REPO_ROOT}/VERSION")"
DIST="${REPO_ROOT}/dist"
SIGN="${OPENWRT_DIR}/release-sign.sh"
PROFILES="${OPENWRT_DIR}/profiles.json"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
PUB="${WORK}/release.pub"
"$SIGN" pubkey "$KEY" > "$PUB"

mkdir -p "$DIST"
# Assets of this version from an earlier run would be advertised unverified.
rm -f "${DIST}"/chengos-openwrt-*"v${VERSION}"* "${DIST}/chengos-openwrt-install.sh"* "${DIST}/chengos-openwrt-manifest.json"*

# Advertised profiles and the architectures they need.
mapfile -t advertised < <(jq -r '.profiles[] | select(.status == "supported" or .status == "experimental") | .id' "$PROFILES")
mapfile -t arches < <(jq -r '.profiles[] | select(.status == "supported" or .status == "experimental") | .arch' "$PROFILES" | sort -u)
[[ ${#advertised[@]} -gt 0 ]] || ow_die "profiles.json advertises no profile"
for id in "${advertised[@]}"; do
    [[ -n "${PG_IPKS[$id]:-}" ]] || ow_die "profile ${id} is advertised but --pg-ipks ${id}=DIR is missing"
done

for arch in "${arches[@]}"; do
    case "$arch" in arm64) target=aarch64-unknown-linux-musl ;; amd64) target=x86_64-unknown-linux-musl ;; *) ow_die "unknown arch ${arch}" ;; esac
    archive="$(CHENGOS_RELEASE_PUBKEY_FILE="$PUB" "${OPENWRT_DIR}/package.sh" --target "$target" "${package_args[@]}" | tail -n 1)"
    [[ -f "$archive" ]] || ow_die "package.sh did not produce an archive for ${arch}"
done
for id in "${advertised[@]}"; do
    "${OPENWRT_DIR}/pg-bundle.sh" --profile "$id" --ipk-dir "${PG_IPKS[$id]}" --version "$VERSION" --out "$DIST" >/dev/null
done

# The manager asset is the archive's own manager, byte for byte; every
# architecture's archive must carry the same one.
manager="${DIST}/chengos-openwrt-manager-v${VERSION}.sh"
for arch in "${arches[@]}"; do
    tar -xzOf "${DIST}/chengos-openwrt-${arch}-v${VERSION}.tar.gz" chengos-openwrt/chengos-openwrt.sh > "${WORK}/manager-${arch}.sh"
    if [[ -f "$manager" ]]; then
        cmp -s "$manager" "${WORK}/manager-${arch}.sh" || ow_die "the ${arch} archive carries a different manager"
    else
        cp "${WORK}/manager-${arch}.sh" "$manager"
    fi
done

bootstrap="${DIST}/chengos-openwrt-install.sh"
cp "${OPENWRT_DIR}/install.sh" "$bootstrap"
"$SIGN" render "$PUB" "$bootstrap"
sed -i "s#@CHENGOS_BUILD_EPOCH@#$(date +%s)#" "$bootstrap"
chmod 0755 "$bootstrap"
"$SIGN" sign "$KEY" "$bootstrap"
( cd "$DIST" && sha256sum "$(basename "$bootstrap")" > "$(basename "$bootstrap").sha256" )
cp "$PUB" "${DIST}/chengos-release.pub"

manifest="$("${OPENWRT_DIR}/release-manifest.sh" --key "$KEY" --dist "$DIST" --version "$VERSION" | tail -n 1)"

# Self-verify the way the device will.
"$SIGN" verify "$PUB" "$manifest" || ow_die "manifest signature does not verify"
"$SIGN" verify "$PUB" "$bootstrap" || ow_die "bootstrap signature does not verify"
for f in "$manager" "$bootstrap"; do
    grep -q '@CHENGOS_' "$f" && ow_die "$(basename "$f") still has an unrendered placeholder"
    busybox ash -n "$f" 2>/dev/null || sh -n "$f" || ow_die "$(basename "$f") does not parse"
done
[[ "$(jq -r .manager.sha256 "$manifest")" == "$(sha256sum "$manager" | cut -d' ' -f1)" ]] || ow_die "manager hash mismatch"
while read -r asset sha; do
    [[ "$(sha256sum "${DIST}/${asset}" | cut -d' ' -f1)" == "$sha" ]] || ow_die "${asset} does not match the manifest"
done < <(jq -r '.profiles[] | (.archive, .postgres) | "\(.asset) \(.sha256)"' "$manifest")

assets=(
    "$bootstrap" "${bootstrap}.sha256" "${bootstrap}.sig" "${DIST}/chengos-release.pub"
    "$manifest" "${manifest}.sig" "$manager"
)
for arch in "${arches[@]}"; do
    assets+=("${DIST}/chengos-openwrt-${arch}-v${VERSION}.tar.gz" "${DIST}/chengos-openwrt-${arch}-v${VERSION}.tar.gz.sha256")
done
for id in "${advertised[@]}"; do assets+=("${DIST}/chengos-openwrt-pg-${id}-v${VERSION}.tar.gz"); done
ow_log "release assets for v${VERSION} verified:"
printf '  %s\n' "${assets[@]##*/}" >&2

if [[ "$PUBLISH" -eq 1 ]]; then
    command -v gh >/dev/null 2>&1 || ow_die "gh is required to publish"
    existing="$(gh release view "v${VERSION}" --json assets -q '.assets[].name')" \
        || ow_die "GitHub release v${VERSION} does not exist; create it with release.sh first"
    for a in "${assets[@]}"; do
        grep -qxF "$(basename "$a")" <<< "$existing" && ow_die "$(basename "$a") is already published; release assets are immutable"
    done
    gh release upload "v${VERSION}" "${assets[@]}"
    ow_log "uploaded to v${VERSION}"
fi
printf '%s\n' "${assets[@]}"
