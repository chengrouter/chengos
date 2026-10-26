#!/bin/sh
#
# ChengOS installer for OpenWrt (runs ON the router, BusyBox sh).
#
# Download this one file from the ChengOS release page and run it as root:
#
#   wget -O chengos-openwrt-install.sh \
#     https://github.com/chengrouter/chengos/releases/latest/download/chengos-openwrt-install.sh
#   sh ./chengos-openwrt-install.sh
#
# It holds no installation logic of its own. It checks that this router can
# verify and download a release, fetches the signed release manifest, checks
# its signature against the release key embedded below, fetches the release's
# appliance manager (hash-checked against that manifest) and runs the
# manager's guided install, which checks the device, asks once and installs.
# When ChengOS is already installed it opens the installed `chengos` menu.
#
# Usage:
#   sh chengos-openwrt-install.sh [options]
#
#   --check                 only check this router; change nothing
#   --version X.Y.Z         install that release instead of the latest
#   --archive DIR           offline: DIR holds the manifest, its .sig, the
#                           manager and the release assets; nothing is fetched
#   --data-dir DIR          data directory (default: the one eligible disk)
#   --interface NAME        LAN interface (default: lan)
#   --port PORT             ChengOS HTTP port (default: 19225)
#   --accept-experimental   allow a profile marked experimental
#   --no-firewall           do not add the WAN-deny firewall rule
#   --force-firewall-reload reload the firewall despite unapplied edits
#   --yes                   unattended (requires --data-dir)
#
# To verify this script before running it, compare it with the published
# chengos-openwrt-install.sh.sha256, or with usign:
#   usign -V -m chengos-openwrt-install.sh -p chengos-release.pub
set -eu

# Rendered by the release job: the usign release key and the build time
# (a clock earlier than the build cannot be right).
RELEASE_PUBKEY='@CHENGOS_RELEASE_PUBKEY@'
BUILD_EPOCH='@CHENGOS_BUILD_EPOCH@'
RELEASE_BASE_URL=${CHENGOS_RELEASE_BASE_URL:-https://github.com/chengrouter/chengos/releases}
MANIFEST_NAME=chengos-openwrt-manifest.json
COMMAND_FILE=${CHENGOS_COMMAND_FILE:-/usr/sbin/chengos}

log()  { printf '[chengos-install] %s\n' "$*" >&2; }
die()  { printf '[chengos-install] ERROR: %s\n' "$*" >&2; exit 1; }
fail() { c=$1; shift; die "[$c] $*"; }
have() { command -v "$1" >/dev/null 2>&1; }
interactive() { [ -t 0 ] && [ -t 2 ]; }
usage() { sed -n '2,35p' "$0" | sed 's/^# \{0,1\}//'; }

version="" archive_dir="" check=0
# Options handed to the manager unchanged.
pass=""
add_pass() { for a in "$@"; do pass="$pass '$(printf '%s' "$a" | sed "s/'/'\\\\''/g")'"; done; }
while [ $# -gt 0 ]; do
    case "$1" in
        --check) check=1; shift ;;
        --version) version=${2:-}; shift 2 ;;
        --archive) archive_dir=${2%/}; shift 2 ;;
        --data-dir|--interface|--port) add_pass "$1" "${2:-}"; shift 2 ;;
        --accept-experimental|--no-firewall|--force-firewall-reload|--yes) add_pass "$1"; shift ;;
        -h|--help) usage; exit 0 ;;
        *) die "unknown option: $1 (see --help)" ;;
    esac
done
case "$version" in ''|[0-9]*.[0-9]*.[0-9]*) ;; *) die "--version must be X.Y.Z" ;; esac

[ "$(id -u)" = 0 ] || die "run this installer as root"

if [ "$check" = 0 ] && [ -n "$(uci -q get chengos.main.data_dir 2>/dev/null || true)" ] && [ -x "$COMMAND_FILE" ]; then
    log "ChengOS is already installed; opening its manager"
    exec "$COMMAND_FILE"
fi

missing=""
for tool in usign jsonfilter wget sha256sum tar gzip mktemp; do
    have "$tool" || missing="$missing $tool"
done
[ -z "$missing" ] || fail firmware "this firmware lacks:$missing. ChengOS needs an OpenWrt image with these tools."

case "$BUILD_EPOCH" in
    @*|'') ;;
    *) [ "$(date +%s)" -ge "$BUILD_EPOCH" ] \
        || fail network "the system clock ($(date -u '+%Y-%m-%d %H:%M') UTC) is wrong; wait for NTP to set it (or check System > System in LuCI), then retry" ;;
esac

if [ -z "$archive_dir" ] && [ "$check" = 0 ] && interactive; then
    printf '\nChengOS installer\n  1) Install\n  2) Check this router only\n  0) Exit\n' >&2
    printf 'Choose: ' >&2
    read -r choice || choice=0
    case "$choice" in
        1) ;;
        2) check=1 ;;
        *) exit 0 ;;
    esac
fi

work=$(mktemp -d /tmp/chengos-install.XXXXXX)
trap 'rm -rf "${work:?}"' EXIT
trap 'exit 130' INT TERM

# get SOURCE DEST: download (or, offline, copy) without leaving partial files.
get() {
    case "$1" in
        http://*|https://*)
            if ! wget -q -T 30 -O "$2" "$1" 2>/dev/null; then
                rm -f "${2:?}"
                if ! ls /lib/libustream-* /usr/lib/libustream-* >/dev/null 2>&1; then
                    fail network "wget cannot use HTTPS on this firmware; install libustream-mbedtls (or -openssl) and ca-bundle"
                fi
                fail network "download failed: $1. Check internet access, DNS and the clock."
            fi ;;
        *) [ -f "$1" ] || fail network "$1 not found"; cp "$1" "$2" ;;
    esac
}

if [ -n "$archive_dir" ]; then
    src=$archive_dir
elif [ -n "$version" ]; then
    src="$RELEASE_BASE_URL/download/v$version"
else
    src="$RELEASE_BASE_URL/latest/download"
fi
manifest="$work/$MANIFEST_NAME"
get "$src/$MANIFEST_NAME" "$manifest"
get "$src/$MANIFEST_NAME.sig" "$manifest.sig"
[ "$(head -c 1 "$manifest")" = "{" ] || fail network "the release manifest download returned something else (an error page?)"

key="$work/release.pub"
if [ -n "${CHENGOS_RELEASE_PUBKEY_FILE:-}" ]; then
    log "WARNING: verifying with the release key override $CHENGOS_RELEASE_PUBKEY_FILE"
    cp "$CHENGOS_RELEASE_PUBKEY_FILE" "$key"
else
    case "$RELEASE_PUBKEY" in
        @*) fail trust "this installer was not built by the release job (no release key); set CHENGOS_RELEASE_PUBKEY_FILE to use a self-built release" ;;
    esac
    printf 'untrusted comment: ChengOS release key\n%s\n' "$RELEASE_PUBKEY" > "$key"
fi
usign -V -q -m "$manifest" -p "$key" -x "$manifest.sig" >/dev/null 2>&1 \
    || fail trust "the release manifest is not signed by the ChengOS release key; nothing was changed"

release=$(jsonfilter -i "$manifest" -e '@.version' 2>/dev/null || true)
[ -z "$version" ] || [ "$release" = "$version" ] || fail trust "the manifest is for $release, not $version"
manager_asset=$(jsonfilter -i "$manifest" -e '@.manager.asset' 2>/dev/null || true)
manager_sha=$(jsonfilter -i "$manifest" -e '@.manager.sha256' 2>/dev/null || true)
case "$manager_asset" in ''|*/*|.*) fail trust "the manifest names no valid manager asset" ;; esac
[ -n "$manager_sha" ] || fail trust "the manifest has no manager hash"

if [ -n "$archive_dir" ]; then
    asset_src="$archive_dir/$manager_asset"
else
    # Assets always come from the versioned release the manifest names.
    asset_src="$RELEASE_BASE_URL/download/v$release/$manager_asset"
fi
manager="$work/chengos-openwrt.sh"
get "$asset_src" "$manager"
[ "$(sha256sum "$manager" | cut -d' ' -f1)" = "$manager_sha" ] \
    || fail trust "the downloaded manager does not match the signed manifest; nothing was changed"

log "ChengOS $release: checking this router"
set -- guided-install --manifest "$manifest" --signature "$manifest.sig"
[ -z "$archive_dir" ] || set -- "$@" --asset-dir "$archive_dir"
[ "$check" = 0 ] || set -- "$@" --check
eval "set -- \"\$@\" $pass"
# A child, not exec: the work dir is removed when it returns.
status=0
sh "$manager" "$@" || status=$?
exit "$status"
