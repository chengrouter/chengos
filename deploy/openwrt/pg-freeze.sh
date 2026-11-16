#!/usr/bin/env bash
#
# Freezes the PostgreSQL inputs of an apk-v3-adb profile into a publisher
# directory that pg-bundle.sh (and release-assets.sh --pg-pkgs) then builds
# from:
#   keys/*.pem                 the profile's pinned feed signing keys
#   feeds/<name>/packages.adb  each signed feed index of profiles.json feed.urls
#   *.apk                      pgsql-server, pgsql-cli, libpq and --package extras
#   base-libs.txt, base-packages.txt, firmware.txt   (--device)
#
# With --device it also reads the qualified router: its identity must match
# the profile, and its library file names become the closure check's base.
# Files already present are kept when identical and refused when different:
# a frozen directory is never silently changed.
# License texts (licenses/<package>) are not fetched; the missing ones are
# listed at the end.
#
# Usage:
#   deploy/openwrt/pg-freeze.sh --profile ID --dir DIR --keys KEYDIR
#       [--apk PATH] [--device root@HOST] [--package NAME]... [--profiles FILE]
#   KEYDIR is e.g. the release's ImageBuilder keys/ directory; --apk defaults
#   to $CHENGOS_OPENWRT_APK or apk on PATH (apk-tools 3.x).
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"

usage() { sed -n '2,24p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

PROFILE="" DIR="" KEYS="" DEVICE="" PROFILES="${OPENWRT_DIR}/profiles.json"
APK="${CHENGOS_OPENWRT_APK:-}"
PACKAGES=(pgsql-server pgsql-cli libpq)
while [[ $# -gt 0 ]]; do
    case "$1" in
        --profile) PROFILE="${2:-}"; shift 2 ;;
        --dir) DIR="${2:-}"; shift 2 ;;
        --keys) KEYS="${2:-}"; shift 2 ;;
        --apk) APK="${2:-}"; shift 2 ;;
        --device) DEVICE="${2:-}"; shift 2 ;;
        --package) PACKAGES+=("${2:-}"); shift 2 ;;
        --profiles) PROFILES="${2:-}"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        *) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
    esac
done
[[ -n "$PROFILE" && -n "$DIR" && -d "$KEYS" ]] || { usage >&2; exit 2; }
command -v jq >/dev/null 2>&1 || ow_die "jq is required"
command -v curl >/dev/null 2>&1 || ow_die "curl is required"
P="$(jq -c --arg id "$PROFILE" '.profiles[] | select(.id == $id)' "$PROFILES")"
[[ -n "$P" ]] || ow_die "profile ${PROFILE} is not in ${PROFILES}"
[[ "$(jq -r '.package_format // empty' <<< "$P")" == apk-v3-adb ]] || ow_die "profile ${PROFILE} is not an apk-v3-adb profile"
PKG_ARCH="$(jq -r '.package_arch // empty' <<< "$P")"
[[ -n "$PKG_ARCH" ]] || ow_die "profile ${PROFILE}: package_arch is required"
mapfile -t URLS < <(jq -r '.feed.urls // [] | .[]' <<< "$P")
mapfile -t PINNED < <(jq -r '.feed.key_sha256 // [] | .[]' <<< "$P")
[[ ${#URLS[@]} -gt 0 && ${#PINNED[@]} -gt 0 ]] || ow_die "profile ${PROFILE}: feed.urls and feed.key_sha256 are required"
[[ -n "$APK" ]] || APK="$(command -v apk || true)"
[[ -n "$APK" ]] && "$APK" --version 2>/dev/null | grep -q '^apk-tools 3\.' \
    || ow_die "apk-tools 3.x is required (pass --apk, e.g. an ImageBuilder's staging_dir/host/bin/apk)"

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$DIR"
DIR="$(realpath "$DIR")"

# place SRC DEST: move SRC to DEST unless DEST exists; an existing DEST must be identical.
place() {
    if [[ -e "$2" ]]; then
        cmp -s "$1" "$2" || ow_die "$2 already exists with different content; this directory is frozen (use a new one)"
        rm -f "$1"
    else
        mkdir -p "$(dirname "$2")"
        mv "$1" "$2"
    fi
}

# ── keys ─────────────────────────────────────────────────────────────────────
mkdir -p "${STAGE}/keys"
for key in "$KEYS"/*.pem; do
    sum="$(sha256sum "$key" | cut -d' ' -f1)"
    printf '%s\n' "${PINNED[@]}" | grep -qx "$sum" || continue
    cp "$key" "${STAGE}/keys/"
done
compgen -G "${STAGE}/keys/*.pem" >/dev/null || ow_die "no key in ${KEYS} matches the sha256 profile ${PROFILE} pins"
for key in "${STAGE}"/keys/*.pem; do
    cp "$key" "${STAGE}/key.tmp"; place "${STAGE}/key.tmp" "${DIR}/keys/$(basename "$key")"
done

# ── feed indexes ─────────────────────────────────────────────────────────────
repos=()
for url in "${URLS[@]}"; do
    url="${url%/}"
    name="$(basename "$url")"
    [[ "$name" =~ ^[a-z0-9._-]+$ ]] || ow_die "cannot name a feed directory after ${url}"
    curl -fsSL -o "${STAGE}/index.adb" "${url}/packages.adb" || ow_die "cannot download ${url}/packages.adb"
    "$APK" verify --keys-dir "${STAGE}/keys" "${STAGE}/index.adb" >/dev/null 2>&1 \
        || ow_die "${url}/packages.adb is not signed by a pinned key"
    place "${STAGE}/index.adb" "${DIR}/feeds/${name}/packages.adb"
    repos+=(--repository "${url}/packages.adb")
    ow_log "feed ${name}: index frozen"
done

# ── packages ─────────────────────────────────────────────────────────────────
mkdir -p "${STAGE}/root" "${STAGE}/fetched"
"$APK" --root "${STAGE}/root" --keys-dir "${STAGE}/keys" --repositories-file /dev/null "${repos[@]}" \
    --arch "$PKG_ARCH" --no-cache --no-interactive fetch -o "${STAGE}/fetched" "${PACKAGES[@]}" >&2 \
    || ow_die "apk fetch failed"
for f in "${STAGE}"/fetched/*.apk; do
    place "$f" "${DIR}/$(basename "$f")"
    ow_log "package $(basename "$f")"
done

# ── device ───────────────────────────────────────────────────────────────────
if [[ -n "$DEVICE" ]]; then
    ROUTER="$DEVICE"  # read by lib/ssh.sh
    export ROUTER
    # shellcheck source=lib/ssh.sh
    source "${OPENWRT_DIR}/lib/ssh.sh"
    ow_remote_script > "${STAGE}/device.txt" <<'EOF'
set -eu
osr() { sed -n "s/^$1=//p" /etc/openwrt_release | head -n 1 | sed "s/^['\"]//; s/['\"]\$//"; }
echo "== facts"
echo "board=$(cat /tmp/sysinfo/board_name 2>/dev/null || true)"
echo "machine=$(uname -m)"
for k in DISTRIB_ID DISTRIB_RELEASE DISTRIB_REVISION DISTRIB_TARGET DISTRIB_ARCH DISTRIB_TAINTS; do
    echo "$(echo "$k" | tr 'A-Z' 'a-z')=$(osr "$k")"
done
echo "== libs"
find /lib /usr/lib -maxdepth 1 \( -type f -o -type l \) -name '*.so*' | sed 's#.*/##' | sort -u
echo "== packages"
{ apk info -v 2>/dev/null || opkg list-installed 2>/dev/null || true; } | sort
EOF
    section() { sed -n "/^== $1\$/,/^== /p" "${STAGE}/device.txt" | sed '1d; /^== /d'; }
    section facts > "${STAGE}/firmware.txt"
    section libs > "${STAGE}/base-libs.txt"
    section packages > "${STAGE}/base-packages.txt"
    fact() { sed -n "s/^$1=//p" "${STAGE}/firmware.txt"; }
    for field in board machine distrib_id distrib_release distrib_revision distrib_target; do
        want="$(jq -r ".match.${field} // empty" <<< "$P")"
        [[ -z "$want" || "$want" == "$(fact "$field")" ]] \
            || ow_die "${DEVICE} is not profile ${PROFILE}: ${field} is '$(fact "$field")', the profile pins '${want}'"
    done
    [[ "$(fact distrib_arch)" == "$PKG_ARCH" ]] || ow_die "${DEVICE} uses package arch '$(fact distrib_arch)', the profile pins ${PKG_ARCH}"
    grep -qx libc.so "${STAGE}/base-libs.txt" || ow_die "no libc.so on ${DEVICE}; capture failed"
    for f in firmware.txt base-libs.txt base-packages.txt; do place "${STAGE}/$f" "${DIR}/$f"; done
    ow_log "device ${DEVICE}: $(wc -l < "${DIR}/base-libs.txt") libraries, $(wc -l < "${DIR}/base-packages.txt") packages"
fi

# ── licenses still needed ────────────────────────────────────────────────────
missing=()
for f in "${DIR}"/*.apk; do
    name="$("$APK" adbdump "$f" 2>/dev/null | sed -n '/^info:/,/^[a-z]/s/^  name: //p' | head -n 1)"
    [[ -e "${DIR}/licenses/${name}" ]] || missing+=("$name")
done
[[ -f "${DIR}/base-libs.txt" ]] || ow_warn "no base-libs.txt yet: re-run with --device on the qualified image"
[[ ${#missing[@]} -eq 0 ]] || ow_warn "add license texts before bundling: ${missing[*]/#/${DIR}/licenses/}"
printf '%s\n' "$DIR"
