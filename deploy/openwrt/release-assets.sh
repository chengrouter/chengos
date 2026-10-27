#!/usr/bin/env bash
# Prepare a frozen, signed OpenWrt release locally; optionally upload to GitHub.
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${OPENWRT_DIR}/../.." && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"
# shellcheck source=lib/release-bundle.sh
source "${OPENWRT_DIR}/lib/release-bundle.sh"
# shellcheck source=lib/release-upload.sh
source "${OPENWRT_DIR}/lib/release-upload.sh"

usage() {
    cat <<'EOF'
Usage: deploy/openwrt/release-assets.sh [options]
  The release is always root VERSION (tag v<VERSION>); there is no tag option.
  --key FILE          OpenSSL Ed25519 PEM signing key (never uploaded)
                      default: $CHENGOS_RELEASE_KEY or ~/.config/chengos/release/release-key.pem
  --pg-ipks ID=DIR    qualified PostgreSQL .ipks for one advertised profile
                      default: $CHENGOS_OPENWRT_PG_IPKS_ROOT/ID or
                      ~/.config/chengos/release/openwrt-pg-ipks/ID
  --repo OWNER/REPO   GitHub repository (default: chengrouter/chengos)
  --out DIR          frozen bundle directory (default: dist/openwrt/v<VERSION>/)
  --ui-dir DIR       use a prebuilt editor instead of building chengflow-ui
  --sdk-dir DIR      gateway source (default: chengflow-sdk)
  --skip-build       reuse Rust binaries; still package UI/gateway and sign
  --publish          upload missing assets to an EXISTING GitHub Release
  --upload-only      reuse a prepared bundle; no builds, signing or private key
  --dry-run          show checks/plan; no builds, signing, output or uploads
  -h, --help         show help

Preparation requires clean, tagged root/backend/editor/gateway source trees.
The bundle is never overwritten. Retry with --upload-only --publish.
Same-name identical remote assets are skipped; conflicts are never overwritten.
GitHub Release assets have no /openwrt subfolders; only local output is grouped.
No Release, tag, or source commit is created or changed by this command.
EOF
}

KEY="" PUBLISH=0 UPLOAD_ONLY=0 DRY_RUN=0 SKIP_BUILD=0 UI_PREBUILT=0
KEY_DEFAULT="${CHENGOS_RELEASE_KEY:-$HOME/.config/chengos/release/release-key.pem}"
PG_IPKS_ROOT="${CHENGOS_OPENWRT_PG_IPKS_ROOT:-$HOME/.config/chengos/release/openwrt-pg-ipks}"
RELEASE_REPO="chengrouter/chengos" DIST=""
UI_DIR="${REPO_ROOT}/chengflow-ui/dist"
SDK_DIR="${REPO_ROOT}/chengflow-sdk"
declare -A PG_IPKS=()
package_args=()
need_arg() { [[ -n "${2:-}" && "$2" != --* ]] || ow_die "$1 requires a value"; }
while [[ $# -gt 0 ]]; do
    case "$1" in
        --key) need_arg "$@"; KEY=$2; shift 2 ;;
        --pg-ipks)
            need_arg "$@"
            [[ "$2" == *=* ]] || ow_die "--pg-ipks needs PROFILE=DIR"
            id="${2%%=*}"; [[ "$id" =~ ^[a-z0-9][a-z0-9._-]*$ ]] || ow_die "invalid profile id"
            PG_IPKS["$id"]="${2#*=}"; shift 2 ;;
        --repo) need_arg "$@"; RELEASE_REPO=$2; shift 2 ;;
        --out) need_arg "$@"; DIST=$2; shift 2 ;;
        --ui-dir) need_arg "$@"; UI_DIR=$2; UI_PREBUILT=1; shift 2 ;;
        --sdk-dir) need_arg "$@"; SDK_DIR=$2; shift 2 ;;
        --skip-build) SKIP_BUILD=1; package_args+=(--skip-build); shift ;;
        --publish) PUBLISH=1; shift ;;
        --upload-only) UPLOAD_ONLY=1; shift ;;
        --dry-run) DRY_RUN=1; shift ;;
        -h|--help) usage; exit 0 ;;
        *) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
    esac
done
[[ "$RELEASE_REPO" =~ ^[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_.-]*$ ]] || ow_die "invalid --repo OWNER/REPO"
VERSION="$(tr -d '[:space:]' < "${REPO_ROOT}/VERSION")"
[[ "$VERSION" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]] || ow_die "VERSION must be MAJOR.MINOR.PATCH"
TAG="v${VERSION}"
for tool in jq openssl sha256sum tar gzip stat realpath mktemp cmp git; do
    command -v "$tool" >/dev/null 2>&1 || ow_die "required tool not found: $tool"
done
DIST="$(realpath -m "${DIST:-${REPO_ROOT}/dist/openwrt/$TAG}")"
SIGN="${OPENWRT_DIR}/release-sign.sh"
PROFILES="${OPENWRT_DIR}/profiles.json"
STAGE="" LOCK=""
WORK="$(mktemp -d)"
cleanup() {
    [[ -z "$STAGE" ]] || rm -rf "${STAGE:?}"
    rm -rf "${WORK:?}"
    [[ -z "$LOCK" ]] || rmdir "$LOCK"
    :
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
SOURCES='{}'
check_sources() {
    local part path head tagged top
    for part in root chengflow chengflow-ui chengflow-sdk; do
        path="$REPO_ROOT"; [[ "$part" == root ]] || path="$REPO_ROOT/$part"
        top="$(git -C "$path" rev-parse --show-toplevel)" || ow_die "$part is not a Git checkout"
        [[ "$(realpath "$top")" == "$(realpath "$path")" ]] || ow_die "$part must have its own tagged source repository"
        [[ -z "$(git -C "$path" status --porcelain)" ]] || ow_die "$part has uncommitted changes"
        head="$(git -C "$path" rev-parse HEAD)"
        tagged="$(git -C "$path" rev-parse --verify "$TAG^{commit}")" || ow_die "$part has no local $TAG"
        [[ "$head" == "$tagged" ]] || ow_die "$part HEAD does not match $TAG"
        SOURCES="$(jq --arg p "$part" --arg c "$head" '. + {($p):$c}' <<< "$SOURCES")"
    done
}

if [[ "$UPLOAD_ONLY" == 1 || ( "$DRY_RUN" == 1 && -d "$DIST" ) ]]; then
    ow_bundle_verify "$DIST" "$VERSION"
    ow_bundle_verify_inventory "$DIST"
    EXPECTED_ROOT_COMMIT="$(jq -r '.sources.root' "$DIST/release-assets.json")"
    if [[ -n "$KEY" ]]; then
        "$SIGN" pubkey "$KEY" > "$WORK/expected.pub"
        cmp -s "$WORK/expected.pub" "$DIST/chengos-release.pub" || ow_die "--key differs from frozen bundle key"
    fi
    if [[ "$PUBLISH" == 1 ]]; then
        ow_upload_execute
    else
        ow_log "Verified frozen bundle: $DIST (use --publish to upload)"
    fi
    exit 0
fi
[[ ! -e "$DIST" ]] || ow_die "output already exists: $DIST; use --upload-only rather than rebuilding"
KEY="${KEY:-$KEY_DEFAULT}"
[[ -f "$KEY" ]] || ow_die "signing key not found: $KEY (put it there, or set CHENGOS_RELEASE_KEY / --key)"
KEY="$(realpath "$KEY")"
"$SIGN" pubkey "$KEY" > "$WORK/release.pub"
PUB="$WORK/release.pub"

# Advertised profiles and the architectures they need.
jq -e '.schema == 1 and (.profiles | type == "array")' "$PROFILES" >/dev/null
mapfile -t advertised < <(jq -r '.profiles[] | select(.status == "supported" or .status == "experimental") | .id' "$PROFILES")
mapfile -t arches < <(jq -r '.profiles[] | select(.status == "supported" or .status == "experimental") | .arch' "$PROFILES" | sort -u)
[[ ${#advertised[@]} -gt 0 ]] || ow_die "profiles.json advertises no profile"
for id in "${advertised[@]}"; do
    [[ "$id" =~ ^[a-z0-9][a-z0-9._-]*$ ]] || ow_die "invalid advertised profile: $id"
    PG_IPKS["$id"]="${PG_IPKS[$id]:-$PG_IPKS_ROOT/$id}"
    [[ -d "${PG_IPKS[$id]}" ]] || ow_die "PostgreSQL .ipk directory not found: ${PG_IPKS[$id]} (put the qualified .ipk files there, or pass --pg-ipks)"
    PG_IPKS["$id"]="$(realpath "${PG_IPKS[$id]}")"
done
if [[ "$UI_PREBUILT" == 1 ]]; then
    [[ -f "$UI_DIR/index.html" ]] || ow_die "built editor not found: $UI_DIR/index.html"
else
    [[ -d "$REPO_ROOT/chengflow-ui/node_modules" ]] || ow_die "run pnpm install in chengflow-ui first"
fi
[[ -d "$SDK_DIR/node_modules" ]] || ow_die "gateway dependencies not installed: $SDK_DIR"
UI_DIR="$(realpath -m "$UI_DIR")"; SDK_DIR="$(realpath "$SDK_DIR")"
package_args+=(--ui-dir "$UI_DIR" --sdk-dir "$SDK_DIR" --release-repo "$RELEASE_REPO")
command -v pnpm >/dev/null 2>&1 || ow_die "pnpm is required to package the gateway"
command -v readelf >/dev/null 2>&1 || ow_die "readelf is required to verify the packaged binaries"
if [[ "$SKIP_BUILD" == 0 ]]; then
    command -v cargo >/dev/null 2>&1 || ow_die "cargo is required"
    for arch in "${arches[@]}"; do
        case "$arch" in arm64) linker=aarch64-linux-musl-gcc ;; amd64) linker=x86_64-linux-musl-gcc ;; *) ow_die "unsupported arch $arch" ;; esac
        if [[ "$(ow_release_arch_for_uname "$(uname -m)")" == "$arch" ]] && command -v "$linker" >/dev/null 2>&1; then
            continue
        fi
        command -v cross >/dev/null 2>&1 || ow_die "cross is required for $arch (or use a native musl builder)"
        command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1 || ow_die "Docker must be reachable for cross"
    done
fi
check_sources
EXPECTED_ROOT_COMMIT="$(jq -r .root <<< "$SOURCES")"
if [[ "$PUBLISH" == 1 ]]; then ow_upload_load_remote; fi
if [[ "$DRY_RUN" == 1 ]]; then
    ow_log "Dry run: sources checked; would build/sign OpenWrt assets in $DIST"
    ow_log "Profiles: ${advertised[*]}; architectures: ${arches[*]}; repo/tag: $RELEASE_REPO $TAG"
    ow_log "No build, output directory, or upload was performed; prepare a bundle to compare hashes"
    exit 0
fi
mkdir -p "$(dirname "$DIST")"
lock_path="$DIST.lock"
mkdir "$lock_path" || ow_die "another preparation is active: $lock_path"
LOCK="$lock_path"
[[ ! -e "$DIST" ]] || ow_die "output was created by another process: $DIST"
FINAL_DIST="$DIST"
STAGE="$(mktemp -d "${DIST}.prepare.XXXXXX")"
DIST="$STAGE"
PREPARED_SOURCES="$SOURCES"

for id in "${advertised[@]}"; do
    "${OPENWRT_DIR}/pg-bundle.sh" --profile "$id" --ipk-dir "${PG_IPKS[$id]}" --version "$VERSION" --out "$DIST" >/dev/null
done
if [[ "$UI_PREBUILT" == 0 ]]; then
    ow_log "Building the editor from its tagged source"
    (cd "$REPO_ROOT/chengflow-ui" && pnpm build) >&2
    [[ -f "$UI_DIR/index.html" ]] || ow_die "editor build produced no index.html"
fi
for arch in "${arches[@]}"; do
    case "$arch" in arm64) target=aarch64-unknown-linux-musl ;; amd64) target=x86_64-unknown-linux-musl ;; *) ow_die "unknown arch ${arch}" ;; esac
    archive="$(CHENGOS_RELEASE_PUBKEY_FILE="$PUB" "${OPENWRT_DIR}/package.sh" --target "$target" --out "$DIST" "${package_args[@]}" | tail -n 1)" \
        || ow_die "OpenWrt package build failed for $arch"
    [[ -f "$archive" ]] || ow_die "package.sh did not produce an archive for ${arch}"
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
sed -i "s#https://github.com/chengrouter/chengos/releases#https://github.com/${RELEASE_REPO}/releases#g" "$bootstrap"
"$SIGN" render "$PUB" "$bootstrap"
sed -i "s#@CHENGOS_BUILD_EPOCH@#$(date +%s)#" "$bootstrap"
chmod 0755 "$bootstrap"
"$SIGN" sign "$KEY" "$bootstrap"
( cd "$DIST" && sha256sum "$(basename "$bootstrap")" > "$(basename "$bootstrap").sha256" )
cp "$PUB" "${DIST}/chengos-release.pub"

"${OPENWRT_DIR}/release-manifest.sh" --key "$KEY" --dist "$DIST" --version "$VERSION" >&2
ow_bundle_verify "$DIST" "$VERSION"
check_sources
[[ "$SOURCES" == "$PREPARED_SOURCES" ]] || ow_die "source commits changed during preparation"
ow_bundle_inventory "$DIST"
ow_bundle_verify_inventory "$DIST"
# GNU mv -n can succeed without moving when the destination appears. Check
# that our stage disappeared before treating the immutable directory as ours.
mv -T -n "$STAGE" "$FINAL_DIST"
[[ ! -d "$STAGE" ]] || ow_die "output appeared during preparation; nothing was overwritten"
STAGE=""
DIST="$FINAL_DIST"
ow_log "Prepared frozen bundle: $DIST"
printf '  %s\n' "${ASSET_NAMES[@]}" >&2
if [[ "$PUBLISH" == 1 ]]; then ow_upload_execute; fi
printf '%s\n' "$DIST/release-assets.json"
