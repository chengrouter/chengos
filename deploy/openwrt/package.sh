#!/usr/bin/env bash
#
# Builds the ChengOS OpenWrt all-in-one release asset:
#   dist/chengos-openwrt-<arch>-v<version>.tar.gz (+ .sha256 beside it)
#
# The archive holds one `chengos-openwrt/` directory: the static cheng-api
# and chengos-router-helper (the privileged Router Hub helper),
# the built editor UI (ui/), the channel-gateway App built for the /gateway/
# prefix (app/), server config/skills/templates, the on-device manager
# (chengos-openwrt.sh) and SHA256SUMS over every file. PostgreSQL ships as a
# separate per-profile asset (pg-bundle.sh).
#
# With CHENGOS_RELEASE_PUBKEY_FILE set (a usign public key), the manager is
# rendered with it as its release trust anchor; without, the archive is a
# development build that cannot verify signed releases.
#
# This is a separate asset from the Linux GNU hybrid bundle and is never
# named or relabelled as one.
#
# Usage:
#   deploy/openwrt/package.sh [--target TRIPLE] [--ui-dir DIR] [--skip-build]
#
#   --target TRIPLE   default aarch64-unknown-linux-musl
#   --ui-dir DIR      built editor (default: chengflow-ui/dist)
#   --sdk-dir DIR     gateway App source (default: chengflow-sdk); built here
#                     with CHENGOS_APP_BASE=/gateway/
#   --skip-build      package the already built binary instead of building
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${OPENWRT_DIR}/../.." && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"

usage() { sed -n '2,22p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

TARGET="aarch64-unknown-linux-musl"
UI_DIR="${REPO_ROOT}/chengflow-ui/dist"
SDK_DIR="${REPO_ROOT}/chengflow-sdk"
GATEWAY_BASE="/gateway/"
SKIP_BUILD=0
while [[ $# -gt 0 ]]; do
    case "$1" in
        --target) TARGET="${2:-}"; shift 2 ;;
        --ui-dir) UI_DIR="${2:-}"; shift 2 ;;
        --sdk-dir) SDK_DIR="${2:-}"; shift 2 ;;
        --skip-build) SKIP_BUILD=1; shift ;;
        -h|--help) usage; exit 0 ;;
        *) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
    esac
done

ARCH="$(ow_release_arch_for_triple "$TARGET")" || ow_die "unsupported target: ${TARGET}"
VERSION="$(tr -d '[:space:]' < "${REPO_ROOT}/VERSION")"
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || ow_die "VERSION '${VERSION}' is not MAJOR.MINOR.PATCH"
[[ -f "${UI_DIR}/index.html" ]] || ow_die "no built editor at ${UI_DIR} (run pnpm build in chengflow-ui)"
[[ -d "${SDK_DIR}/node_modules" ]] || ow_die "no node_modules in ${SDK_DIR} (run pnpm install there)"

CHENGFLOW="${REPO_ROOT}/chengflow"
build_args=(--project "$CHENGFLOW" --package cheng-api --bin cheng-api --target "$TARGET")
[[ "$SKIP_BUILD" -eq 1 ]] && build_args+=(--skip-build)
BINARY="$(CHENGOS_VERSION="$VERSION" "${OPENWRT_DIR}/cross-build.sh" "${build_args[@]}" | tail -n 1)"
helper_args=(--project "$CHENGFLOW" --package cheng-router-agent --bin chengos-router-helper --target "$TARGET")
[[ "$SKIP_BUILD" -eq 1 ]] && helper_args+=(--skip-build)
HELPER="$(CHENGOS_VERSION="$VERSION" "${OPENWRT_DIR}/cross-build.sh" "${helper_args[@]}" | tail -n 1)"

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
ROOT="${STAGE}/chengos-openwrt"
mkdir -p "${ROOT}/bin" "${ROOT}/lib"

install -m 0755 "$BINARY" "${ROOT}/bin/cheng-api"
install -m 0755 "$HELPER" "${ROOT}/bin/chengos-router-helper"
cp -a "$UI_DIR" "${ROOT}/ui"
ow_log "Building the gateway App for ${GATEWAY_BASE}"
( cd "$SDK_DIR" && CHENGOS_APP_BASE="$GATEWAY_BASE" pnpm exec vite build --outDir "${ROOT}/app" >&2 )
# The API generates runtime-env.js for the prefix; the build's copy is never served.
rm -f "${ROOT}/app/runtime-env.js"
grep -q "src=\"${GATEWAY_BASE}assets/" "${ROOT}/app/index.html" \
    || ow_die "the gateway build does not reference ${GATEWAY_BASE}assets/"
for dir in config skills workflow-templates; do
    cp -a "${CHENGFLOW}/${dir}" "${ROOT}/${dir}"
done
install -m 0755 "${OPENWRT_DIR}/appliance/chengos-openwrt.sh" "${ROOT}/chengos-openwrt.sh"
if [[ -n "${CHENGOS_RELEASE_PUBKEY_FILE:-}" ]]; then
    "${OPENWRT_DIR}/release-sign.sh" render "$CHENGOS_RELEASE_PUBKEY_FILE" "${ROOT}/chengos-openwrt.sh"
else
    ow_warn "CHENGOS_RELEASE_PUBKEY_FILE is not set: development build without a release key"
fi
install -m 0644 "${OPENWRT_DIR}/remote/port-listeners.sh" "${ROOT}/lib/port-listeners.sh"
printf '%s\n' "$VERSION" > "${ROOT}/VERSION"
printf '%s\n' "$ARCH" > "${ROOT}/ARCH"
# Never ship instance state or editor droppings.
find "$ROOT" \( -name '.env' -o -name '.DS_Store' -o -name '*.swp' \) -delete

( cd "$ROOT" && find . -type f ! -name SHA256SUMS | LC_ALL=C sort | sed 's#^\./##' \
    | xargs -d '\n' sha256sum > SHA256SUMS )

# Verify the staged tree the way the device will: static ELF for ARCH, the
# entry points present, and every file matching SHA256SUMS.
"${OPENWRT_DIR}/elf-check.sh" --expect-arch "$ARCH" "${ROOT}/bin/cheng-api" "${ROOT}/bin/chengos-router-helper"
for required in chengos-openwrt.sh lib/port-listeners.sh ui/index.html app/index.html config/presets.yaml VERSION ARCH; do
    [[ -s "${ROOT}/${required}" ]] || ow_die "staged release is missing ${required}"
done
( cd "$ROOT" && sha256sum -c --quiet SHA256SUMS ) || ow_die "SHA256SUMS does not verify"

DIST="${REPO_ROOT}/dist"
ARCHIVE="${DIST}/chengos-openwrt-${ARCH}-v${VERSION}.tar.gz"
mkdir -p "$DIST"
tar -C "$STAGE" --owner=0 --group=0 -czf "$ARCHIVE" chengos-openwrt
( cd "$DIST" && sha256sum "$(basename "$ARCHIVE")" > "$(basename "$ARCHIVE").sha256" )
ow_log "Packaged ${ARCHIVE} ($(du -h "$ARCHIVE" | cut -f1))"
printf '%s\n' "$ARCHIVE"
