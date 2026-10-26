#!/bin/sh
#
# ChengOS all-in-one appliance manager for OpenWrt (runs ON the router).
#
# Ships inside the release archive and is installed with it under
# <data_dir>/releases/<version>/. The procd services call it as their entry
# point, so it is POSIX/BusyBox sh only.
#
# Usage:
#   chengos                                   (installed copy: menu on a TTY)
#   chengos-openwrt.sh guided-install --manifest FILE --signature FILE [options]
#   chengos-openwrt.sh preflight --manifest FILE --signature FILE [options]
#   chengos-openwrt.sh install --data-dir DIR --pg-bundle FILE --pg-bundle-sha256 SHA [options]
#   chengos-openwrt.sh upgrade [--version X.Y.Z | --manifest FILE --signature FILE --asset-dir DIR] [--yes]
#   chengos-openwrt.sh update [--pg-bundle FILE --pg-bundle-sha256 SHA]
#                                             (run from the NEW extracted release)
#   chengos-openwrt.sh rollback --discard-changes-since-update
#   chengos-openwrt.sh check | repair | status | logs [-f] | menu
#   chengos-openwrt.sh setup-url | reset-admin [cheng-api reset-admin options]
#   chengos-openwrt.sh uninstall [--purge-data [--confirm-purge DATA_DIR]]
#   chengos-openwrt.sh configure-mount --device DEV --target DIR
#   chengos-openwrt.sh storage-check DIR [MIN_FREE_MB]
#   chengos-openwrt.sh lan-address
#
# guided-install / preflight options (preflight never changes anything):
#   --manifest FILE --signature FILE
#                        the release manifest and its usign signature
#   --asset-dir DIR      offline: take release assets from DIR, never download
#   --data-dir DIR       data dir (default: the one eligible data mount)
#   --interface NAME     LAN interface to bind (default: lan)
#   --port PORT          ChengOS HTTP port (default: 19225)
#   --accept-experimental
#                        allow a profile the manifest marks experimental
#   --yes                do not ask for confirmation (requires --data-dir
#                        when there is no terminal)
#   --machine            preflight: key=value output for scripts
#
# install options:
#   --data-dir DIR       ChengOS instance root on a durable, explicitly mounted
#                        filesystem (required on first install)
#   --interface NAME     LAN interface to bind (default: lan)
#   --port PORT          ChengOS HTTP port (default: 19225)
#   --pg-port PORT       loopback PostgreSQL port (default: 15432)
#   --pg-bundle FILE     signed-release PostgreSQL bundle for this profile
#   --pg-bundle-sha256 SHA
#                        its SHA-256 from the release manifest
#   --pg-from-feed       engineering only: unpack PostgreSQL from the live
#                        opkg feed instead of a bundle
#   --min-free-mb N      storage gate free-space floor (default: 2048)
#   --no-firewall        skip the WAN-deny firewall rule
#   --force-firewall-reload
#                        reload the firewall even if its running state has
#                        drifted from /etc/config/firewall (applies that drift)
#
# Internal entry points (procd): run-postgres, stop-postgres, run-api,
# clear-port PORT.
#
# Layout under the data dir:
#   releases/<version>/  package-owned, replaced by updates
#   current -> releases/<version>
#   staging/             verified downloads while an install/update runs
#   pg/root/             PostgreSQL unpacked from the release's bundle (never
#                        `opkg install`: pgsql-server pulls in blockd/autofs)
#   pg/bundle.tar.gz     that bundle, kept so repair can unpack it again
#   pgdata/  home/  logs/  etc/chengos.env (secrets, 0600 chengos)
#   backups/pgdata-<version>-<time>.tar.gz   cluster snapshot before an update
#   backups/last-update                      from/to versions and the snapshot
#
# An update always snapshots the stopped PostgreSQL cluster before the new
# release can migrate it, and a rollback restores that snapshot together with
# the previous binaries: an older binary alone is never pointed at a database
# a newer release has migrated.
#
# Trust: release manifests are verified with usign against the release key
# embedded below (rendered by package.sh); every asset is then checked against
# the SHA-256 the signed manifest records.
set -eu

CHENGOS_USER=chengos
CHENGOS_ID=19225
UCI_NAME=chengos
# --pg-from-feed only: PostgreSQL itself; its other libraries (zlib, readline,
# ncurses, ...) must already be on the image, which the library check after
# unpacking proves.
PG_PACKAGES="pgsql-server pgsql-cli libpq"
# usign public key (base64 line) of the release signing key; rendered by
# package.sh. Left as the placeholder, this is a development build.
RELEASE_PUBKEY='@CHENGOS_RELEASE_PUBKEY@'
RELEASE_BASE_URL=${CHENGOS_RELEASE_BASE_URL:-https://github.com/chengrouter/chengos/releases}
MANIFEST_NAME=chengos-openwrt-manifest.json
MANIFEST_SCHEMA=1
# Installed copy of this manager; works even while the data mount is missing.
COMMAND_FILE=/usr/sbin/chengos
# Downloads, extraction and snapshots aside, keep this much free.
HEADROOM_MARGIN_MB=512
SUPPORTED_FS="ext4 ext3 f2fs btrfs xfs"
RUN_DIR=/var/run/chengos
KEEP_FILE=/lib/upgrade/keep.d/chengos
HOTPLUG_FILE=/etc/hotplug.d/iface/90-chengos
BLOCK_HOTPLUG_FILE=/etc/hotplug.d/block/90-chengos
ROUTER_SOCKET=/var/run/chengos-router.sock
# Database, then the privileged router helper, then the API; stop in reverse.
SERVICES_START="chengos-db chengos-router chengos"
SERVICES_STOP="chengos chengos-router chengos-db"
# System state read by the checks; overridable only so tests can supply fixtures.
PROC_MOUNTS=${CHENGOS_PROC_MOUNTS:-/proc/mounts}
OPKG_LISTS=${CHENGOS_OPKG_LISTS:-/var/opkg-lists}
CONFIG_MD5=${CHENGOS_CONFIG_MD5:-/var/run/config.md5}
OPENWRT_RELEASE=${CHENGOS_OPENWRT_RELEASE:-/etc/openwrt_release}
BOARD_NAME_FILE=${CHENGOS_BOARD_NAME_FILE:-/tmp/sysinfo/board_name}
MEMINFO=${CHENGOS_MEMINFO:-/proc/meminfo}
PROC_NET=${CHENGOS_PROC_NET:-/proc/net}
LOCK_DIR=${CHENGOS_LOCK_DIR:-/var/lock/chengos.lock}
MUSL_LOADER=${CHENGOS_MUSL_LOADER:-}

log()  { printf '[chengos] %s\n' "$*" >&2; }
warn() { printf '[chengos] WARNING: %s\n' "$*" >&2; }
# FAIL_HINT, when set, tells the user how to recover from a failure mid-way.
die()  {
    printf '[chengos] ERROR: %s\n' "$*" >&2
    [ -z "${FAIL_HINT:-}" ] || printf '[chengos] %s\n' "$FAIL_HINT" >&2
    exit 1
}
# fail CATEGORY MESSAGE: a user-facing failure, tagged with what failed
# (firmware, network, trust, storage, mount, port, database, service, lan).
fail() { c=$1; shift; die "[$c] $*"; }
have() { command -v "$1" >/dev/null 2>&1; }
is_uint() { case "$1" in ''|*[!0-9]*) return 1 ;; esac; }
is_semver() {
    case "$1" in *[!0-9.]*|.*|*.|*..*) return 1 ;; esac
    [ "$(printf '%s' "$1" | tr -cd . | wc -c)" -eq 2 ]
}
# version_lt A B: MAJOR.MINOR.PATCH A sorts before B.
version_lt() {
    [ "$1" != "$2" ] || return 1
    [ "$(printf '%s\n%s\n' "$1" "$2" | sort -t. -k1,1n -k2,2n -k3,3n | head -n 1)" = "$1" ]
}
sha256_of() { sha256sum "$1" | cut -d' ' -f1; }
interactive() { [ -t 0 ] && [ -t 2 ]; }
# ask PROMPT: read one line from the terminal.
ask() { printf '%s' "$1" >&2; read -r answer || answer=""; printf '%s' "$answer"; }
confirm() {
    case "$(ask "$1 [y/N] ")" in y|Y|yes|YES) return 0 ;; *) return 1 ;; esac
}

# Hex of stdin. OpenWrt BusyBox builds often omit `od` but keep `hexdump`.
to_hex() {
    if have od; then od -An -tx1 -v | tr -d ' \n'; else hexdump -v -e '/1 "%02x"'; fi
}

self_path() {
    case "$0" in
        /*) printf '%s' "$0" ;;
        *) printf '%s/%s' "$(pwd)" "$0" ;;
    esac
}
RELEASE_DIR=$(cd "$(dirname "$(self_path)")" && pwd)

# ── configuration ────────────────────────────────────────────────────────────

cfg() { uci -q get "${UCI_NAME}.main.$1" 2>/dev/null || true; }

# The procd entry points run as the unprivileged service user, which may not
# read uci's root-only state; the init scripts pass these values in the
# environment instead (CHENGOS_DATA_DIR, CHENGOS_PG_PORT).
data_dir()  { d=${CHENGOS_DATA_DIR:-$(cfg data_dir)}; [ -n "$d" ] || die "ChengOS is not installed (no ${UCI_NAME}.main.data_dir)"; printf '%s' "$d"; }
iface_cfg() { v=$(cfg interface); printf '%s' "${v:-lan}"; }
port_cfg()  { v=$(cfg port);      printf '%s' "${v:-19225}"; }
pgport_cfg(){ v=${CHENGOS_PG_PORT:-$(cfg pg_port)}; printf '%s' "${v:-15432}"; }

# ── storage gate ─────────────────────────────────────────────────────────────

# Deepest existing ancestor of a path, symlinks resolved.
resolve_existing() {
    p=$1
    while [ ! -e "$p" ]; do
        p=$(dirname "$p")
    done
    readlink -f "$p"
}

# "MOUNTPOINT FSTYPE DEVICE" of the mount holding an existing path.
mount_of() {
    awk -v path="$1" '
        function unescape(s) { gsub(/\\040/, " ", s); return s }
        {
            mp = unescape($2)
            if (path == mp || index(path, (mp == "/" ? "/" : mp "/")) == 1) {
                if (length(mp) >= best_len) { best_len = length(mp); best = mp " " $3 " " $1 }
            }
        }
        END { if (best != "") print best }
    ' "$PROC_MOUNTS"
}

# storage_check DIR MIN_FREE_MB [MIN_FREE_INODES]: the data dir must sit on a
# durable, explicitly mounted filesystem with room for PostgreSQL. Path strings
# prove nothing; the resolved mount, its type and its free space do.
storage_check() {
    dir=$1 min_mb=${2:-2048} min_inodes=${3:-100000}
    case "$dir" in /*) ;; *) echo "data dir must be absolute: $dir"; return 1 ;; esac
    resolved=$(resolve_existing "$dir")
    set -- $(mount_of "$resolved")
    mp=${1:-} fstype=${2:-} dev=${3:-}
    [ -n "$mp" ] || { echo "no mount found for $resolved"; return 1; }
    case " $SUPPORTED_FS " in
        *" $fstype "*) ;;
        *) echo "$dir is on $fstype ($mp); PostgreSQL needs one of: $SUPPORTED_FS"; return 1 ;;
    esac
    case "$mp" in
        /|/overlay|/rom|/tmp|/tmp/*|/var|/var/*)
            echo "$dir resolves to the system mount $mp; use a dedicated data mount"; return 1 ;;
    esac
    case "$dev" in
        /dev/loop*|overlay*|tmpfs) echo "$mp is backed by $dev, not a block device"; return 1 ;;
    esac
    # stat -f: %a available blocks, %S block size, %d free inodes.
    set -- $(stat -f -c '%a %S %d' "$resolved")
    free_mb=$(( $1 / 1024 * $2 / 1024 ))
    free_inodes=$3
    [ "$free_mb" -ge "$min_mb" ] || { echo "only ${free_mb} MB free on $mp (need ${min_mb} MB)"; return 1; }
    [ "$free_inodes" -ge "$min_inodes" ] || { echo "only ${free_inodes} free inodes on $mp (need ${min_inodes})"; return 1; }
    echo "ok mount=$mp fstype=$fstype device=$dev free_mb=$free_mb free_inodes=$free_inodes"
}

# The mount must come back at boot by UUID, not by auto-mount guesswork.
mount_is_explicit() {
    mp=$1 dev=$2
    uuid=$(block info "$dev" 2>/dev/null | sed -n 's/.* UUID="\([^"]*\)".*/\1/p')
    [ -n "$uuid" ] || return 1
    i=0
    while uci -q get "fstab.@mount[$i]" >/dev/null; do
        if [ "$(uci -q get "fstab.@mount[$i].uuid")" = "$uuid" ] \
            && [ "$(uci -q get "fstab.@mount[$i].target")" = "$mp" ] \
            && [ "$(uci -q get "fstab.@mount[$i].enabled")" != "0" ]; then
            return 0
        fi
        i=$((i + 1))
    done
    return 1
}

cmd_configure_mount() {
    device="" target=""
    while [ $# -gt 0 ]; do
        case "$1" in
            --device) device=$2; shift 2 ;;
            --target) target=$2; shift 2 ;;
            *) die "unknown option: $1" ;;
        esac
    done
    [ -b "$device" ] || die "--device must be a block device"
    case "$target" in /mnt/?*) ;; *) die "--target must be under /mnt/" ;; esac
    require_clean_uci fstab
    info=$(block info "$device") || die "block info $device failed"
    uuid=$(printf '%s' "$info" | sed -n 's/.* UUID="\([^"]*\)".*/\1/p')
    fstype=$(printf '%s' "$info" | sed -n 's/.* TYPE="\([^"]*\)".*/\1/p')
    [ -n "$uuid" ] || die "$device has no filesystem UUID"
    case " $SUPPORTED_FS " in *" $fstype "*) ;; *) die "$device is $fstype; format it first (e.g. mkfs.ext4)" ;; esac

    current=$(awk -v d="$device" '$1 == d { print $2; exit }' /proc/mounts)
    if [ -n "$current" ] && [ "$current" != "$target" ]; then
        log "unmounting $device from $current"
        umount "$current" || die "$device is busy at $current"
    fi
    mkdir -p "$target"
    grep -q "^$device $target " /proc/mounts || mount -t "$fstype" -o noatime "$device" "$target"

    section=chengos_data
    uci -q delete "fstab.$section" || true
    uci set "fstab.$section=mount"
    uci set "fstab.$section.uuid=$uuid"
    uci set "fstab.$section.target=$target"
    uci set "fstab.$section.fstype=$fstype"
    uci set "fstab.$section.options=noatime"
    uci set "fstab.$section.enabled=1"
    uci commit fstab
    log "$device (UUID $uuid, $fstype) is mounted at $target and recorded in /etc/config/fstab"
}

# Refuse to commit a uci package that already carries someone else's pending
# edits: `uci commit` would silently apply them too.
require_clean_uci() {
    pending=$(uci changes "$1" 2>/dev/null || true)
    [ -z "$pending" ] || die "/etc/config/$1 has uncommitted changes from another tool; resolve them first:
$pending"
}

# True when the running state of a package matches its file, using the same
# hash reload_config compares. A reload would otherwise also apply that drift.
config_in_sync() {
    pkg=$1
    expected=$(awk -v f="/var/run/config.check/$pkg" '$2 == f { print $1 }' "$CONFIG_MD5" 2>/dev/null)
    [ -n "$expected" ] || return 0
    actual=$(uci show "$pkg" 2>/dev/null | md5sum | cut -d' ' -f1)
    [ "$expected" = "$actual" ]
}

# Mounts that could hold the data dir: real block devices with a supported
# filesystem outside the system mounts. Prints "MOUNTPOINT DEVICE FSTYPE".
candidate_mounts() {
    awk '{ gsub(/\\040/, " ", $2); print $2 "\t" $1 "\t" $3 }' "$PROC_MOUNTS" \
        | while IFS="$(printf '\t')" read -r mp dev fstype; do
            case "$dev" in /dev/sd*|/dev/mmcblk*|/dev/nvme*|/dev/vd*|/dev/hd*) ;; *) continue ;; esac
            case " $SUPPORTED_FS " in *" $fstype "*) ;; *) continue ;; esac
            case "$mp" in /|/overlay|/rom|/boot|/boot/*|/tmp|/tmp/*|/var|/var/*) continue ;; esac
            printf '%s %s %s\n' "$mp" "$dev" "$fstype"
        done | sort -u
}

# required_free_mb STAGED_MB PGDATA_MB FLOOR_MB: room for the staged download
# and its extraction, the cluster snapshot an update takes plus the copy it
# keeps beside it, and a margin; never below the profile's floor.
required_free_mb() {
    need=$(( $1 + 2 * $2 + HEADROOM_MARGIN_MB ))
    [ "$need" -ge "$3" ] && printf '%s' "$need" || printf '%s' "$3"
}

# The data mount the installed ChengOS needs, or a plain explanation.
require_data_mount() {
    d=$(data_dir)
    [ -x "$d/current/chengos-openwrt.sh" ] && return 0
    uuid=$(uci -q get fstab.chengos_data.uuid 2>/dev/null || true)
    fail mount "the ChengOS data directory $d is not available${uuid:+ (filesystem UUID $uuid)}.
Check that its disk is attached and mounted (block info; logread -e block).
ChengOS starts by itself when the mount appears."
}

# ── locking ──────────────────────────────────────────────────────────────────

# One install/update/repair/rollback/uninstall at a time. mkdir is atomic
# everywhere (BusyBox images often lack flock). The holder's pid lets a
# crashed run's lock be reclaimed, and a manager that execs into another
# (repair -> install, upgrade -> update) keeps its pid and so its lock.
acquire_lock() {
    read -r mypid _rest < /proc/self/stat
    mkdir -p "$(dirname "$LOCK_DIR")"
    tries=0
    while ! mkdir "$LOCK_DIR" 2>/dev/null; do
        holder=$(cat "$LOCK_DIR/pid" 2>/dev/null || true)
        if [ "$holder" = "$mypid" ]; then
            trap release_lock EXIT
            trap 'release_lock; exit 130' INT TERM
            return 0
        fi
        if [ -z "$holder" ]; then
            # Taken this instant and not yet stamped: give the holder a moment.
            sleep 1
            holder=$(cat "$LOCK_DIR/pid" 2>/dev/null || true)
        fi
        if [ -n "$holder" ] && kill -0 "$holder" 2>/dev/null; then
            die "another ChengOS operation is running ($(cat "$LOCK_DIR/what" 2>/dev/null || echo unknown), pid $holder); wait for it to finish"
        fi
        tries=$((tries + 1))
        [ "$tries" -le 3 ] || die "cannot take the lock $LOCK_DIR"
        rm -rf "${LOCK_DIR:?}"
    done
    printf '%s\n' "$mypid" > "$LOCK_DIR/pid"
    printf '%s\n' "$1" > "$LOCK_DIR/what"
    trap release_lock EXIT
    trap 'release_lock; exit 130' INT TERM
}

release_lock() {
    read -r mypid _rest < /proc/self/stat
    [ "$(cat "$LOCK_DIR/pid" 2>/dev/null)" != "$mypid" ] || rm -rf "${LOCK_DIR:?}"
}

# ── release trust and manifest ───────────────────────────────────────────────

# write_release_pubkey FILE: the release key in usign's file format.
write_release_pubkey() {
    if [ -n "${CHENGOS_RELEASE_PUBKEY_FILE:-}" ]; then
        warn "verifying with the release key override $CHENGOS_RELEASE_PUBKEY_FILE"
        cp "$CHENGOS_RELEASE_PUBKEY_FILE" "$1"
        return 0
    fi
    case "$RELEASE_PUBKEY" in
        @*) fail trust "this is a development build without a release signing key; set CHENGOS_RELEASE_PUBKEY_FILE to verify a self-built release" ;;
    esac
    printf 'untrusted comment: ChengOS release key\n%s\n' "$RELEASE_PUBKEY" > "$1"
}

# verify_signature FILE SIGNATURE: signed by the ChengOS release key.
verify_signature() {
    have usign || fail firmware "usign is required to verify ChengOS releases; install it with the firmware's package manager"
    [ -s "$2" ] || fail trust "signature $(basename "$2") is missing"
    keyfile="$2.key"
    write_release_pubkey "$keyfile"
    if ! usign -V -q -m "$1" -p "$keyfile" -x "$2" >/dev/null 2>&1; then
        rm -f "${keyfile:?}"
        fail trust "$(basename "$1") is not signed by the ChengOS release key"
    fi
    rm -f "${keyfile:?}"
}

# mj EXPR: a value from the loaded manifest (jsonfilter syntax), or nothing.
mj() { jsonfilter -i "$MANIFEST" -e "$1" 2>/dev/null || true; }
# pj FIELD: a value of the matched profile.
pj() { mj "@.profiles[$P].$1"; }

# load_manifest FILE SIGNATURE: verify, then check schema, version and
# validity window. Sets MANIFEST and M_VERSION.
load_manifest() {
    MANIFEST=$1
    [ -s "$1" ] || fail network "the release manifest is missing or empty"
    [ "$(head -c 1 "$1")" = "{" ] || fail network "$(basename "$1") is not a release manifest (an error page instead?)"
    verify_signature "$1" "$2"
    [ "$(mj @.schema)" = "$MANIFEST_SCHEMA" ] \
        || fail trust "manifest schema '$(mj @.schema)' is not supported by this installer; download the current installer"
    M_VERSION=$(mj @.version)
    is_semver "$M_VERSION" || fail trust "manifest version '$M_VERSION' is not MAJOR.MINOR.PATCH"
    issued=$(mj @.issued_epoch) expires=$(mj @.expires_epoch)
    is_uint "$issued" && is_uint "$expires" || fail trust "the manifest has no validity window"
    now=$(date +%s)
    [ "$now" -ge "$issued" ] \
        || fail network "the system clock ($(date -u '+%Y-%m-%d %H:%M') UTC) is earlier than this release; wait for NTP to set the time, then retry"
    [ "$now" -lt "$expires" ] \
        || fail trust "the release manifest expired on $(date -u -d "@$expires" '+%Y-%m-%d' 2>/dev/null || echo "$expires"); download the current installer"
}

# Facts the profile is matched on, read from the device itself.
osr() {
    sed -n "s/^$1=//p" "$OPENWRT_RELEASE" 2>/dev/null | head -n 1 | sed "s/^['\"]//; s/['\"]\$//"
}
read_device_facts() {
    F_DISTRIB_ID=$(osr DISTRIB_ID)
    F_DISTRIB_RELEASE=$(osr DISTRIB_RELEASE)
    F_DISTRIB_REVISION=$(osr DISTRIB_REVISION)
    F_DISTRIB_TARGET=$(osr DISTRIB_TARGET)
    F_BOARD=$(cat "$BOARD_NAME_FILE" 2>/dev/null || true)
    [ -n "$F_BOARD" ] || F_BOARD=$(ubus call system board 2>/dev/null | jsonfilter -e '@.board_name' 2>/dev/null || true)
    F_MACHINE=$(uname -m)
}

# profile_field_matches KEY VALUE: an absent key matches anything.
profile_field_matches() {
    want=$(mj "@.profiles[$i].match.$1")
    [ -z "$want" ] || [ "$want" = "$2" ]
}

# match_profile: the first manifest profile whose every recorded fact equals
# this device's. Sets P, P_ID, P_STATUS; fails when none matches.
match_profile() {
    i=0
    while :; do
        id=$(mj "@.profiles[$i].id")
        [ -n "$id" ] || break
        if profile_field_matches board "$F_BOARD" \
            && profile_field_matches machine "$F_MACHINE" \
            && profile_field_matches distrib_id "$F_DISTRIB_ID" \
            && profile_field_matches distrib_release "$F_DISTRIB_RELEASE" \
            && profile_field_matches distrib_revision "$F_DISTRIB_REVISION" \
            && profile_field_matches distrib_target "$F_DISTRIB_TARGET"; then
            P=$i P_ID=$id P_STATUS=$(mj "@.profiles[$i].status")
            return 0
        fi
        i=$((i + 1))
    done
    return 1
}

device_summary() {
    printf '%s %s (%s), board %s, %s' "${F_DISTRIB_ID:-unknown firmware}" "${F_DISTRIB_RELEASE:-?}" \
        "${F_DISTRIB_TARGET:-?}" "${F_BOARD:-unknown}" "$F_MACHINE"
}

# require_profile ACCEPT_EXPERIMENTAL: the device must match a profile the
# manifest supports, or an experimental one the user explicitly accepted.
require_profile() {
    read_device_facts
    match_profile || fail firmware "this device is not a supported ChengOS profile: $(device_summary).
Supported devices are listed with each release; nothing was changed."
    case "$P_STATUS" in
        supported) ;;
        experimental)
            [ "$1" = 1 ] || fail firmware "profile $P_ID is experimental (not yet hardware-qualified); re-run with --accept-experimental to install anyway" ;;
        *) fail firmware "profile $P_ID has status '$P_STATUS'; nothing was changed" ;;
    esac
}

# ── downloads ────────────────────────────────────────────────────────────────

# asset_source NAME: where a release asset comes from (offline dir or the
# versioned GitHub release, never the mutable "latest" pointer).
asset_source() {
    if [ -n "${ASSET_DIR:-}" ]; then
        printf '%s/%s' "$ASSET_DIR" "$1"
    else
        printf '%s/download/v%s/%s' "$RELEASE_BASE_URL" "$M_VERSION" "$1"
    fi
}

# fetch SOURCE DEST: SOURCE is a URL or, offline, a local path. Never leaves a
# partial DEST behind.
fetch() {
    rm -f "${2:?}.part"
    case "$1" in
        http://*|https://*)
            wget -q -T 30 -O "$2.part" "$1" 2>/dev/null || {
                rm -f "${2:?}.part"
                fail network "download failed: $1
Check internet access, DNS, the clock, and that wget supports HTTPS (libustream-* and ca-bundle)."
            } ;;
        *)
            [ -f "$1" ] || fail network "$1 not found (offline install)"
            cp "$1" "$2.part" ;;
    esac
    mv "$2.part" "$2"
}

# fetch_verified SOURCE DEST SHA256
fetch_verified() {
    fetch "$1" "$2"
    [ "$(sha256_of "$2")" = "$3" ] || { rm -f "${2:?}"; fail trust "$(basename "$2") does not match the SHA-256 in the signed manifest"; }
}

# stage_from_manifest DATA: download and verify the matched profile's release
# archive and PostgreSQL bundle into DATA/staging, extract the archive and
# check it the way install does. Sets STAGED_RELEASE, STAGED_PG, STAGED_PG_SHA.
stage_from_manifest() {
    staging="${1:?}/staging"
    rm -rf "${staging:?}" && mkdir -p "$staging"
    archive=$(pj archive.asset) pg_asset=$(pj postgres.asset)
    STAGED_PG_SHA=$(pj postgres.sha256)
    [ -n "$archive" ] && [ -n "$pg_asset" ] && [ -n "$STAGED_PG_SHA" ] \
        || fail trust "profile $P_ID lists no release archive or PostgreSQL bundle"
    log "downloading ChengOS $M_VERSION for $P_ID"
    fetch_verified "$(asset_source "$archive")" "$staging/$archive" "$(pj archive.sha256)"
    fetch_verified "$(asset_source "$pg_asset")" "$staging/$pg_asset" "$STAGED_PG_SHA"
    tar -xzf "$staging/$archive" -C "$staging" || fail storage "cannot extract $archive into $staging"
    rm -f "${staging:?}/${archive:?}"
    STAGED_RELEASE="$staging/chengos-openwrt"
    STAGED_PG="$staging/$pg_asset"
    verify_release "$STAGED_RELEASE"
    [ "$(tr -d '[:space:]' < "$STAGED_RELEASE/VERSION")" = "$M_VERSION" ] \
        || fail trust "the archive's VERSION does not match the manifest ($M_VERSION)"
    [ "$(tr -d '[:space:]' < "$STAGED_RELEASE/ARCH")" = "$(pj arch)" ] \
        || fail trust "the archive's ARCH does not match profile $P_ID"
}

# Free space a fresh staging of the matched profile needs, in MB.
manifest_staged_mb() {
    total=0
    for f in archive.size archive.unpacked_size postgres.size postgres.unpacked_size; do
        v=$(pj "$f")
        is_uint "$v" || fail trust "profile $P_ID has no $f"
        total=$((total + v))
    done
    printf '%s' $(( total / 1048576 + 1 ))
}

# ── network ──────────────────────────────────────────────────────────────────

# The IPv4 address of the configured LAN interface, or nothing. Never a
# wildcard address: callers fall back to loopback, not to every interface.
lan_address() {
    iface=${1:-$(iface_cfg)}
    addr=$(ubus call "network.interface.$iface" status 2>/dev/null \
        | jsonfilter -e '@["ipv4-address"][0].address' 2>/dev/null || true)
    case "$addr" in
        ""|0.0.0.0) return 1 ;;
    esac
    printf '%s' "$addr"
}

# ── PostgreSQL ───────────────────────────────────────────────────────────────

pg_root() { printf '%s/pg/root' "$(data_dir)"; }

# Run a one-shot command as the service user. The never-existing pidfile stops
# start-stop-daemon from matching (and refusing to start because of) any other
# running `env` process.
as_user() { start-stop-daemon -S -p /var/run/chengos-none.pid -c "$CHENGOS_USER" -x /usr/bin/env -- "$@"; }

pg_env() { printf 'LD_LIBRARY_PATH=%s/usr/lib' "$1"; }

# Expected SHA-256 of a package from the downloaded feed index.
feed_sha256() {
    for list in "$OPKG_LISTS"/*; do
        [ -f "$list" ] || continue
        if [ "$(head -c 2 "$list" | to_hex)" = 1f8b ]; then
            gzip -dc "$list"
        else
            cat "$list"
        fi
    done | awk -v pkg="$1" '
        /^Package: / { cur = $2 }
        /^SHA256sum: / && cur == pkg { print $2; exit }
    '
}

# unpack_ipk IPK ROOT: an .ipk is a tar.gz holding data.tar.gz.
unpack_ipk() {
    x="$2.ipk-x"
    rm -rf "${x:?}" && mkdir -p "$x"
    { tar -xzf "$1" -C "$x" && tar -xzf "$x/data.tar.gz" -C "$2"; } \
        || { rm -rf "${x:?}"; fail database "cannot unpack $(basename "$1")"; }
    rm -rf "${x:?}"
}

# Every PostgreSQL binary must resolve all its libraries on this device.
check_pg_libraries() {
    loader=${MUSL_LOADER:-$(ls /lib/ld-musl-*.so.1 2>/dev/null | head -n 1)}
    [ -n "$loader" ] || fail firmware "no musl loader (/lib/ld-musl-*.so.1); this firmware is not supported"
    for bin in postgres initdb pg_ctl psql; do
        [ -x "$1/usr/bin/$bin" ] || fail database "the PostgreSQL package set has no $bin"
        missing=$(env "$(pg_env "$1")" "$loader" --list "$1/usr/bin/$bin" 2>&1 \
            | grep -iE 'not found|error' || true)
        [ -z "$missing" ] || fail database "$bin cannot resolve its libraries: $missing"
    done
}

# install_postgres_from_feed ROOT (engineering only, --pg-from-feed): unpack
# PostgreSQL from the live firmware feed, hash-checked against its index.
install_postgres_from_feed() {
    root=$1
    # Only a fully unpacked and checked tree counts; a partial one is redone.
    [ -f "$root/.chengos-complete" ] && return 0
    rm -rf "${root:?}"
    have opkg || die "opkg is required to fetch PostgreSQL from the firmware feed"
    warn "--pg-from-feed: PostgreSQL comes from the live feed, not a signed release bundle"
    grep -qs '^option check_signature' /etc/opkg.conf \
        || warn "opkg signature checking is off on this image; package hashes are checked against an index protected only by HTTPS"
    ls "$OPKG_LISTS"/* >/dev/null 2>&1 || opkg update >/dev/null || die "opkg update failed"
    ipk_dir=$(dirname "$root")/ipk
    rm -rf "${ipk_dir:?}" && mkdir -p "$ipk_dir" "$root"
    for pkg in $PG_PACKAGES; do
        before=$(ls "$ipk_dir")
        (cd "$ipk_dir" && opkg download "$pkg" >/dev/null) || die "opkg download $pkg failed"
        # opkg saves whichever package provides the name; hash-check that one.
        file=$(ls "$ipk_dir" | grep -vxF "$before" | grep '\.ipk$' | head -n 1 || true)
        [ -n "$file" ] || die "$pkg was not downloaded"
        file="$ipk_dir/$file"
        name=$(basename "$file")
        want=$(feed_sha256 "${name%%_*}")
        got=$(sha256_of "$file")
        [ -n "$want" ] && [ "$want" = "$got" ] || die "$pkg SHA-256 does not match the feed index"
        unpack_ipk "$file" "$root"
        log "unpacked $name"
    done
    check_pg_libraries "$root"
    printf 'feed' > "$root/.chengos-complete"
}

# install_postgres_bundle ROOT BUNDLE SHA256 PGDATA: unpack the release's
# PostgreSQL package set. The bundle's own hash comes from the signed
# manifest, and each package inside is checked against the bundle's list. A
# tree already unpacked from the same bundle is kept; a different bundle
# replaces it, keeping the old one as ROOT.prev (restored by a failed update).
# A different PostgreSQL major version is refused: the cluster in PGDATA
# would need a dump and restore this installer does not do.
install_postgres_bundle() {
    root=$1 bundle=$2 want=$3 pgdata=$4
    marker="$root/.chengos-complete"
    [ -f "$marker" ] && [ "$(cat "$marker")" = "$want" ] && return 0
    [ -f "$bundle" ] || fail database "PostgreSQL bundle $bundle is missing"
    [ "$(sha256_of "$bundle")" = "$want" ] || fail trust "the PostgreSQL bundle does not match the SHA-256 in the signed manifest"
    work="$(dirname "$root")/bundle-x"
    new="$root.new"
    rm -rf "${work:?}" "${new:?}" && mkdir -p "$work" "$new"
    tar -xzf "$bundle" -C "$work" || fail database "cannot unpack the PostgreSQL bundle"
    list="$work/chengos-pg/PACKAGES"
    [ -s "$list" ] || fail trust "the PostgreSQL bundle has no PACKAGES list"
    server_version=""
    while read -r name version sha file; do
        case "$file" in ''|*/*|.*) fail trust "invalid file name in the PostgreSQL bundle: '$file'" ;; esac
        [ "$(sha256_of "$work/chengos-pg/$file")" = "$sha" ] || fail trust "$file does not match the SHA-256 in the bundle's list"
        [ "$name" != pgsql-server ] || server_version=$version
        unpack_ipk "$work/chengos-pg/$file" "$new"
        log "unpacked $name $version"
    done < "$list"
    [ -n "$server_version" ] || fail trust "the PostgreSQL bundle has no pgsql-server package"
    if [ -f "$pgdata/PG_VERSION" ]; then
        cluster_major=$(tr -d '[:space:]' < "$pgdata/PG_VERSION")
        [ "${server_version%%.*}" = "$cluster_major" ] \
            || fail database "the bundle has PostgreSQL $server_version but the cluster is version $cluster_major; a major upgrade is not supported by this installer"
    fi
    check_pg_libraries "$new"
    rm -rf "${root:?}.prev"
    [ ! -d "$root" ] || mv "$root" "$root.prev"
    mv "$new" "$root"
    printf '%s' "$want" > "$marker"
    rm -rf "${work:?}"
}

random_hex() { head -c "$1" /dev/urandom | to_hex; }

ensure_secrets() {
    env_file=$1 pg_port=$2
    [ -f "$env_file" ] && return 0
    # Created 0600 from the start; the subshell keeps the umask from leaking
    # into the files the rest of the install writes.
    (umask 077 && cat > "$env_file") <<EOF
CHENG_API_PROFILE=appliance
DATABASE_URL=postgres://chengos_app:$(random_hex 24)@127.0.0.1:${pg_port}/chengos
CREDENTIAL_MASTER_KEY_1=$(random_hex 32)
JWT_SECRET=$(random_hex 32)
CHENG_SETUP_TOKEN=$(random_hex 16)
RUN_MIGRATIONS=true
RUST_LOG=info
CHENG_API_LOG_FILE=stdout
EOF
    chown "$CHENGOS_USER:$CHENGOS_USER" "$env_file"
    chmod 0600 "$env_file"
}

env_value() { sed -n "s/^$1=//p" "$2" | head -n 1; }

# Installs from before the setup link get a token too; it only gates creating
# the first account, so adding it to a configured instance changes nothing.
ensure_setup_token() {
    [ -n "$(env_value CHENG_SETUP_TOKEN "$1")" ] && return 0
    printf 'CHENG_SETUP_TOKEN=%s\n' "$(random_hex 16)" >> "$1"
}

init_database() {
    data=$1 pg_port=$2
    root=$data/pg/root pgdata=$data/pgdata
    run=$data/run
    mkdir -p "$run" && chown "$CHENGOS_USER:$CHENGOS_USER" "$run" && chmod 0700 "$run"
    if [ ! -f "$pgdata/PG_VERSION" ]; then
        mkdir -p "$pgdata" && chown "$CHENGOS_USER:$CHENGOS_USER" "$pgdata" && chmod 0700 "$pgdata"
        as_user "$(pg_env "$root")" "$root/usr/bin/initdb" -D "$pgdata" -U "$CHENGOS_USER" \
            --auth-local=peer --auth-host=scram-sha-256 -E UTF8 --locale=C >"$data/logs/initdb.log" 2>&1 \
            || { tail -n 20 "$data/logs/initdb.log" >&2; die "initdb failed"; }
        log "initialized PostgreSQL cluster in $pgdata"
    fi

    url=$(env_value DATABASE_URL "$data/etc/chengos.env")
    password=$(printf '%s' "$url" | sed -n 's#^postgres://chengos_app:\([^@]*\)@.*#\1#p')
    [ -n "$password" ] || die "cannot read the application password from chengos.env"

    started=0
    if ! as_user "$(pg_env "$root")" "$root/usr/bin/pg_ctl" -D "$pgdata" status >/dev/null 2>&1; then
        as_user "$(pg_env "$root")" "$root/usr/bin/pg_ctl" -D "$pgdata" -w -t 120 \
            -l "$data/logs/postgres-setup.log" -o "$(pg_options "$data" "$pg_port")" start >/dev/null
        started=1
    fi
    sql() { as_user "$(pg_env "$root")" "$root/usr/bin/psql" -h "$run" -p "$pg_port" -U "$CHENGOS_USER" -d postgres -v ON_ERROR_STOP=1 -tAq "$@"; }
    if [ "$(sql -c "select 1 from pg_roles where rolname = 'chengos_app'")" != "1" ]; then
        sql -c "create role chengos_app login password '$password'"
    else
        sql -c "alter role chengos_app password '$password'"
    fi
    if [ "$(sql -c "select 1 from pg_database where datname = 'chengos'")" != "1" ]; then
        sql -c "create database chengos owner chengos_app"
    fi
    # The shutdown checkpoint can take minutes on slow flash.
    [ "$started" -eq 0 ] || as_user "$(pg_env "$root")" "$root/usr/bin/pg_ctl" -D "$pgdata" -m fast -w -t 300 stop >/dev/null
}

# Loopback TCP for the API (scram), a private socket directory for local
# administration (peer). Settings sized for a ~3 GB appliance.
pg_options() {
    printf '%s' "-c listen_addresses=127.0.0.1 -p $2 -k $1/run -c shared_buffers=128MB -c max_connections=20 -c wal_compression=on -c checkpoint_timeout=15min -c max_wal_size=512MB -c logging_collector=off"
}

# ── procd entry points ───────────────────────────────────────────────────────

cmd_run_postgres() {
    data=$(data_dir)
    root=$data/pg/root
    exec env "$(pg_env "$root")" "$root/usr/bin/postgres" -D "$data/pgdata" $(pg_options "$data" "$(pgport_cfg)")
}

cmd_stop_postgres() {
    data=$(data_dir)
    root=$data/pg/root
    [ -f "$data/pgdata/postmaster.pid" ] || return 0
    # Inside procd's term_timeout (180s) so the checkpoint can finish on slow
    # flash before anything is killed.
    as_user "$(pg_env "$root")" "$root/usr/bin/pg_ctl" -D "$data/pgdata" -m fast -w -t 170 stop >/dev/null 2>&1 || true
}

cmd_run_api() {
    data=$(data_dir)
    root=$data/pg/root
    i=0
    until env "$(pg_env "$root")" "$root/usr/bin/psql" -h "$data/run" -p "$(pgport_cfg)" -U "$CHENGOS_USER" \
            -d postgres -tAc 'select 1' >/dev/null 2>&1; do
        i=$((i + 1))
        [ "$i" -lt 120 ] || die "PostgreSQL is not ready after 120s"
        sleep 1
    done
    cd "$data/home"
    set -a
    . "$data/etc/chengos.env"
    set +a
    export HOME="$data/home"
    export CHENGOS_WEBUI_DIR="$data/current/ui"
    if [ -f "$data/current/app/index.html" ]; then
        export CHENGOS_GATEWAY_DIR="$data/current/app"
    fi
    export SKILLS_DIR="$data/current/skills"
    export TEMPLATE_WORKFLOWS_DIR="$data/current/workflow-templates"
    export CHENG_WORKSPACE_ROOT="$data/home/workspace"
    export CHENGOS_ROUTER_SOCKET="$ROUTER_SOCKET"
    exec "$data/current/bin/cheng-api"
}

# Stop leftover copies of our binary on the port (a foreground run over SSH
# survives the session and drives procd into an AddrInUse loop); refuse if a
# different program owns it.
cmd_clear_port() {
    # /proc/<pid>/exe shows the resolved path, never the `current` link.
    sh "$RELEASE_DIR/lib/port-listeners.sh" clear "$1" "$(readlink -f "$(data_dir)/current/bin/cheng-api")" 15
}

# ── system integration ───────────────────────────────────────────────────────

# /lib/functions.sh (user_add, group_add, ...) reads unset variables, so it is
# sourced, and its helpers called, with nounset relaxed.
load_openwrt_functions() {
    IPKG_INSTROOT=${IPKG_INSTROOT:-}
    set +u
    . /lib/functions.sh
    set -u
}

ensure_user() {
    set +u
    ensure_user_unchecked
    set -u
}

ensure_user_unchecked() {
    if ! group_exists "$CHENGOS_USER"; then
        grep -qs ":x:$CHENGOS_ID:" /etc/group && die "gid $CHENGOS_ID is taken"
        group_add "$CHENGOS_USER" "$CHENGOS_ID"
    fi
    if ! user_exists "$CHENGOS_USER"; then
        awk -F: -v id="$CHENGOS_ID" '$3 == id { found = 1 } END { exit !found }' /etc/passwd \
            && die "uid $CHENGOS_ID is taken"
        user_add "$CHENGOS_USER" "$CHENGOS_ID" "$CHENGOS_ID" "ChengOS" /var/run/chengos /bin/false
    fi
}

write_init_scripts() {
    cat > /etc/init.d/chengos-db <<'EOF'
#!/bin/sh /etc/rc.common
# ChengOS PostgreSQL (installed by chengos-openwrt.sh)
START=95
STOP=90
USE_PROCD=1

chengos_bin() {
	data=$(uci -q get chengos.main.data_dir) || return 1
	printf '%s/current/chengos-openwrt.sh' "$data"
}

start_service() {
	bin=$(chengos_bin) || { logger -t chengos "not configured"; return 1; }
	"$bin" storage-gate >/dev/null || { logger -t chengos "data mount unavailable; not starting PostgreSQL"; return 1; }
	procd_open_instance postgres
	procd_set_param command "$bin" run-postgres
	procd_set_param env CHENGOS_DATA_DIR="$(uci -q get chengos.main.data_dir)" CHENGOS_PG_PORT="$(uci -q get chengos.main.pg_port || echo 15432)"
	procd_set_param user chengos
	procd_set_param respawn 3600 10 5
	procd_set_param term_timeout 180
	procd_set_param stdout 1
	procd_set_param stderr 1
	procd_close_instance
}

stop_service() {
	bin=$(chengos_bin) && "$bin" stop-postgres
}
EOF
    cat > /etc/init.d/chengos <<'EOF'
#!/bin/sh /etc/rc.common
# ChengOS API and editor (installed by chengos-openwrt.sh)
START=99
STOP=10
USE_PROCD=1

start_service() {
	data=$(uci -q get chengos.main.data_dir) || { logger -t chengos "not configured"; return 1; }
	bin="$data/current/chengos-openwrt.sh"
	port=$(uci -q get chengos.main.port || echo 19225)
	"$bin" storage-gate >/dev/null || { logger -t chengos "data mount unavailable; not starting"; return 1; }
	addr=$("$bin" lan-address) || {
		addr=127.0.0.1
		logger -t chengos "LAN interface has no IPv4 address; listening on loopback only until it does"
	}
	mkdir -p /var/run/chengos
	echo "$addr" > /var/run/chengos/bind_address
	"$bin" clear-port "$port" || { logger -t chengos "port $port is held by another program"; return 1; }
	procd_open_instance api
	procd_set_param command "$bin" run-api
	procd_set_param env BIND_ADDRESS="$addr" PORT="$port" CHENGOS_DATA_DIR="$data" CHENGOS_PG_PORT="$(uci -q get chengos.main.pg_port || echo 15432)"
	procd_set_param user chengos
	procd_set_param respawn 3600 10 5
	procd_set_param term_timeout 20
	procd_set_param stdout 1
	procd_set_param stderr 1
	procd_close_instance
}
EOF
    cat > /etc/init.d/chengos-router <<'EOF'
#!/bin/sh /etc/rc.common
# ChengOS privileged router helper (installed by chengos-openwrt.sh). Runs as
# root, listens only on a Unix socket, serves only the chengos uid.
START=96
STOP=12
USE_PROCD=1

start_service() {
	data=$(uci -q get chengos.main.data_dir) || { logger -t chengos "not configured"; return 1; }
	"$data/current/chengos-openwrt.sh" storage-gate >/dev/null || { logger -t chengos "data mount unavailable; not starting the router helper"; return 1; }
	uid=$(id -u chengos) && gid=$(id -g chengos) || { logger -t chengos "user chengos missing"; return 1; }
	procd_open_instance helper
	procd_set_param command "$data/current/bin/chengos-router-helper" \
		--socket /var/run/chengos-router.sock --allow-uid "$uid" --socket-gid "$gid"
	procd_set_param respawn 3600 5 5
	procd_set_param term_timeout 10
	procd_set_param stdout 1
	procd_set_param stderr 1
	procd_close_instance
}
EOF
    chmod 0755 /etc/init.d/chengos-db /etc/init.d/chengos-router /etc/init.d/chengos

    mkdir -p "$(dirname "$HOTPLUG_FILE")"
    cat > "$HOTPLUG_FILE" <<'EOF'
#!/bin/sh
# Rebind ChengOS when its LAN interface comes up with a different address.
case "$ACTION" in ifup|ifupdate) ;; *) exit 0 ;; esac
[ "$INTERFACE" = "$(uci -q get chengos.main.interface || echo lan)" ] || exit 0
/etc/init.d/chengos enabled || exit 0
data=$(uci -q get chengos.main.data_dir) || exit 0
now=$("$data/current/chengos-openwrt.sh" lan-address) || exit 0
[ "$now" = "$(cat /var/run/chengos/bind_address 2>/dev/null)" ] && exit 0
logger -t chengos "LAN address is now $now; restarting"
/etc/init.d/chengos restart
EOF

    # USB storage can enumerate after the init scripts already refused to start
    # (late controller probe, re-plug). block-mount's 10-mount mounts it first;
    # this then starts ChengOS once its data mount passes the gate.
    mkdir -p "$(dirname "$BLOCK_HOTPLUG_FILE")"
    cat > "$BLOCK_HOTPLUG_FILE" <<'EOF'
#!/bin/sh
# Start ChengOS when its data mount appears after boot.
[ "$ACTION" = add ] || exit 0
/etc/init.d/chengos enabled || exit 0
data=$(uci -q get chengos.main.data_dir) || exit 0
"$data/current/chengos-openwrt.sh" storage-gate >/dev/null 2>&1 || exit 0
if ! pidof postgres >/dev/null; then
	logger -t chengos "data mount is available; starting"
	/etc/init.d/chengos-db start
fi
pidof chengos-router-helper >/dev/null || /etc/init.d/chengos-router start
pidof cheng-api >/dev/null || /etc/init.d/chengos start
EOF

    mkdir -p "$(dirname "$KEEP_FILE")"
    cat > "$KEEP_FILE" <<EOF
/etc/config/chengos
/etc/init.d/chengos
/etc/init.d/chengos-db
/etc/rc.d/S95chengos-db
/etc/rc.d/K90chengos-db
/etc/rc.d/S99chengos
/etc/rc.d/K10chengos
/etc/init.d/chengos-router
/etc/rc.d/S96chengos-router
/etc/rc.d/K12chengos-router
$HOTPLUG_FILE
$BLOCK_HOTPLUG_FILE
$COMMAND_FILE
$KEEP_FILE
EOF
}

# install_command RELEASE: the `chengos` command is a copy of this manager
# kept off the data mount, so status, logs and uninstall still work when that
# mount is missing.
install_command() {
    cp "$1/chengos-openwrt.sh" "$COMMAND_FILE.tmp" && chmod 0755 "$COMMAND_FILE.tmp" \
        && mv "$COMMAND_FILE.tmp" "$COMMAND_FILE"
}

firewall_rule() {
    port=$1 force=$2
    require_clean_uci firewall
    if [ "$(uci -q get firewall.chengos_wan_deny.dest_port)" = "$port" ]; then
        return 0
    fi
    if ! config_in_sync firewall && [ "$force" != 1 ]; then
        die "the running firewall differs from /etc/config/firewall; reloading would apply those edits too.
Re-run with --force-firewall-reload to accept that, or with --no-firewall to skip the rule."
    fi
    uci -q delete firewall.chengos_wan_deny || true
    uci set firewall.chengos_wan_deny=rule
    uci set firewall.chengos_wan_deny.name='ChengOS: deny WAN'
    uci set firewall.chengos_wan_deny.src=wan
    uci set firewall.chengos_wan_deny.proto=tcp
    uci set firewall.chengos_wan_deny.dest_port="$port"
    uci set firewall.chengos_wan_deny.target=REJECT
    uci commit firewall
    /etc/init.d/firewall reload >/dev/null 2>&1 || die "firewall reload failed"
    log "firewall: TCP $port from wan is rejected"
}

# ── commands ─────────────────────────────────────────────────────────────────

# setup_needed BASE_URL: the instance answers and has no administrator yet.
setup_needed() {
    status=$(wget -q -T 5 -O - "$1/api/v1/setup/status" 2>/dev/null || true)
    case "$status" in *'"needs_setup":true'*) return 0 ;; *) return 1 ;; esac
}

instance_url() {
    addr=$(cat "$RUN_DIR/bind_address" 2>/dev/null || true)
    [ -n "$addr" ] || addr=$(lan_address 2>/dev/null || echo 127.0.0.1)
    printf 'http://%s:%s' "$addr" "$(port_cfg)"
}

# The one-time setup link for the first administrator account.
setup_link() {
    token=$(env_value CHENG_SETUP_TOKEN "$(data_dir)/etc/chengos.env")
    printf '%s/register?setup=true&setup_token=%s' "$(instance_url)" "$token"
}

print_access() {
    base=$(instance_url)
    log "ChengOS $1 is running: $base/"
    if setup_needed "$base"; then
        log "create the administrator account (once) by opening:"
        printf '\n    %s\n\n' "$(setup_link)"
        log "the link is shown again by: chengos setup-url"
    fi
}

cmd_install() {
    data="" iface=lan port=19225 pg_port=15432 min_mb=2048 firewall=1 force_fw=0
    pg_bundle="" pg_sha="" pg_feed=0
    while [ $# -gt 0 ]; do
        case "$1" in
            --data-dir) data=$2; shift 2 ;;
            --interface) iface=$2; shift 2 ;;
            --port) port=$2; shift 2 ;;
            --pg-port) pg_port=$2; shift 2 ;;
            --pg-bundle) pg_bundle=$2; shift 2 ;;
            --pg-bundle-sha256) pg_sha=$2; shift 2 ;;
            --pg-from-feed) pg_feed=1; shift ;;
            --min-free-mb) min_mb=$2; shift 2 ;;
            --no-firewall) firewall=0; shift ;;
            --force-firewall-reload) force_fw=1; shift ;;
            *) die "unknown option: $1" ;;
        esac
    done
    [ "$(id -u)" = 0 ] || die "install must run as root"
    [ -f "$RELEASE_DIR/VERSION" ] || die "install runs from an extracted release; for an installed ChengOS use: chengos repair"
    [ -n "$data" ] || data=$(cfg data_dir)
    [ -n "$data" ] || die "--data-dir is required"
    data=${data%/}
    if [ "$pg_feed" -eq 0 ]; then
        [ -n "$pg_bundle" ] && [ -n "$pg_sha" ] \
            || die "--pg-bundle FILE and --pg-bundle-sha256 SHA are required (engineering installs: --pg-from-feed)"
    fi
    for tool in uci ubus jsonfilter start-stop-daemon block sha256sum tar; do
        have "$tool" || fail firmware "required tool missing: $tool"
    done
    [ "$pg_feed" -eq 0 ] || have opkg || fail firmware "required tool missing: opkg"
    have od || have hexdump || fail firmware "required tool missing: od or hexdump"
    acquire_lock install
    load_openwrt_functions

    verify_release "$RELEASE_DIR"
    version=$(tr -d '[:space:]' < "$RELEASE_DIR/VERSION")

    # A release staged on the data mount already occupies its space, and the
    # guided installer sized the whole install before downloading it.
    case "$RELEASE_DIR" in "$data"/staging/*) staged=1 ;; *) staged=0 ;; esac
    pg_mb=0
    [ -z "$pg_bundle" ] || pg_mb=$(( $(du -sm "$pg_bundle" | cut -f1) * 3 ))
    pgdata_mb=0
    [ ! -d "$data/pgdata" ] || pgdata_mb=$(du -sm "$data/pgdata" | cut -f1)
    if [ "$staged" -eq 1 ]; then
        need_mb=$(required_free_mb "$pg_mb" "$pgdata_mb" 0)
    else
        need_mb=$(required_free_mb $(( $(du -sm "$RELEASE_DIR" | cut -f1) + pg_mb )) "$pgdata_mb" "$min_mb")
    fi
    result=$(storage_check "$data" "$need_mb") || fail storage "$result"
    log "storage gate: $result"
    set -- $result
    mp=${2#mount=} dev=${4#device=}
    mount_is_explicit "$mp" "$dev" \
        || fail storage "$mp is not recorded in /etc/config/fstab by UUID; run: $0 configure-mount --device $dev --target $mp"

    current_version=""
    [ -f "$data/current/VERSION" ] && current_version=$(tr -d '[:space:]' < "$data/current/VERSION")
    if [ -n "$current_version" ] && [ "$current_version" != "$version" ]; then
        die "ChengOS $current_version is installed; run: chengos update"
    fi

    # Every refusal comes before the first change.
    require_clean_uci "$UCI_NAME"
    if [ "$firewall" -eq 1 ] && [ -z "$(uci -q get firewall.chengos_wan_deny)" ]; then
        require_clean_uci firewall
        config_in_sync firewall || [ "$force_fw" -eq 1 ] \
            || die "the running firewall differs from /etc/config/firewall; reloading would apply those edits too.
Re-run with --force-firewall-reload to accept that, or with --no-firewall to skip the rule."
    fi

    ensure_user
    mkdir -p "$data/releases" "$data/home" "$data/logs" "$data/etc" "$data/pg"
    chown "$CHENGOS_USER:$CHENGOS_USER" "$data/home" "$data/logs" "$data/etc"
    chmod 0700 "$data/etc"

    # Recorded first, so an interrupted install can be resumed by repair.
    uci -q get "$UCI_NAME.main" >/dev/null || { touch "/etc/config/$UCI_NAME"; uci set "$UCI_NAME.main=chengos"; }
    uci set "$UCI_NAME.main.data_dir=$data"
    uci set "$UCI_NAME.main.interface=$iface"
    uci set "$UCI_NAME.main.port=$port"
    uci set "$UCI_NAME.main.pg_port=$pg_port"
    uci set "$UCI_NAME.main.firewall=$firewall"
    if [ "$pg_feed" -eq 1 ]; then
        uci set "$UCI_NAME.main.pg_source=feed"
    else
        uci set "$UCI_NAME.main.pg_source=bundle"
        uci set "$UCI_NAME.main.pg_bundle_sha256=$pg_sha"
    fi
    uci set "$UCI_NAME.main.install_state=incomplete"
    uci commit "$UCI_NAME"
    install_command "$RELEASE_DIR"
    FAIL_HINT="The install did not finish. Resume it with: chengos repair   (or remove it with: chengos uninstall)"

    stage_release "$RELEASE_DIR" "$data" "$version"
    # -n replaces the existing link itself instead of creating one inside the
    # directory it points to.
    ln -sfn "releases/$version" "$data/current"
    # config/i18n is resolved relative to the working directory.
    ln -sfn ../current/config "$data/home/config"

    if [ "$pg_feed" -eq 1 ]; then
        install_postgres_from_feed "$data/pg/root"
    else
        kept="$data/pg/bundle.tar.gz"
        if [ "$(readlink -f "$pg_bundle")" != "$(readlink -f "$kept" 2>/dev/null || echo none)" ]; then
            case "$pg_bundle" in
                "$data"/staging/*) mv "$pg_bundle" "$kept.tmp" ;;
                *) cp "$pg_bundle" "$kept.tmp" ;;
            esac
            mv "$kept.tmp" "$kept"
        fi
        install_postgres_bundle "$data/pg/root" "$kept" "$pg_sha" "$data/pgdata"
        rm -rf "${data:?}/pg/root.prev"
    fi
    ensure_secrets "$data/etc/chengos.env" "$pg_port"
    ensure_setup_token "$data/etc/chengos.env"
    init_database "$data" "$pg_port"

    write_init_scripts
    enable_services
    [ "$firewall" -eq 0 ] || firewall_rule "$port" "$force_fw"

    # stop+start rather than restart: rc.common's restart prints a ubus error
    # for a service that is not running yet.
    for svc in $SERVICES_STOP; do "/etc/init.d/$svc" stop >/dev/null 2>&1 || true; done
    start_services
    wait_healthy 180 || fail service "ChengOS did not become healthy; see: chengos logs"

    uci -q delete "$UCI_NAME.main.install_state" || true
    uci commit "$UCI_NAME"
    FAIL_HINT=""
    [ "$staged" -eq 0 ] || rm -rf "${data:?}/staging"
    print_access "$version"
}

# wait_healthy SECONDS [VERSION]: /health is healthy (and reports VERSION).
wait_healthy() {
    i=0 want=${2:-}
    while [ "$i" -lt "$1" ]; do
        addr=$(cat "$RUN_DIR/bind_address" 2>/dev/null || true)
        body=""
        [ -z "$addr" ] || body=$(wget -q -T 3 -O - "http://$addr:$(port_cfg)/health" 2>/dev/null || true)
        if printf '%s' "$body" | grep -q '"healthy"' \
            && { [ -z "$want" ] || printf '%s' "$body" | grep -q "\"version\":\"$want\""; }; then
            return 0
        fi
        sleep 1
        i=$((i + 1))
    done
    return 1
}

# ── preflight and guided install ─────────────────────────────────────────────

pf()       { printf '%s=%s\n' "$1" "$2" >> "$PF_REPORT"; }
pf_issue() { PF_ISSUES=$((PF_ISSUES + 1)); printf 'issue=[%s] %s\n' "$1" "$2" >> "$PF_REPORT"; }

# port_in_use PORT: something listens on TCP PORT (IPv4 or IPv6).
port_in_use() {
    files=""
    for f in "$PROC_NET/tcp" "$PROC_NET/tcp6"; do [ ! -r "$f" ] || files="$files $f"; done
    [ -n "$files" ] || return 1
    awk -v suffix=":$(printf '%04X' "$1")" '
        $4 == "0A" && substr($2, length($2) - length(suffix) + 1) == suffix { found = 1 }
        END { exit !found }
    ' $files
}

parse_guided_args() {
    G_MANIFEST="" G_SIGNATURE="" ASSET_DIR="" G_YES=0 G_MACHINE=0 G_CHECK=0
    PF_DATA="" PF_DATA_EXPLICIT=0 PF_PORT=19225 PF_IFACE=lan PF_ACCEPT=0 PF_FIREWALL=1 PF_FORCE_FW=0
    while [ $# -gt 0 ]; do
        case "$1" in
            --manifest) G_MANIFEST=$2; shift 2 ;;
            --signature) G_SIGNATURE=$2; shift 2 ;;
            --asset-dir) ASSET_DIR=${2%/}; shift 2 ;;
            --data-dir) PF_DATA=${2%/}; PF_DATA_EXPLICIT=1; shift 2 ;;
            --port) PF_PORT=$2; shift 2 ;;
            --interface) PF_IFACE=$2; shift 2 ;;
            --accept-experimental) PF_ACCEPT=1; shift ;;
            --no-firewall) PF_FIREWALL=0; shift ;;
            --force-firewall-reload) PF_FORCE_FW=1; shift ;;
            --yes|--non-interactive) G_YES=1; shift ;;
            --machine) G_MACHINE=1; shift ;;
            --check) G_CHECK=1; shift ;;
            *) die "unknown option: $1" ;;
        esac
    done
    is_uint "$PF_PORT" && [ "$PF_PORT" -gt 0 ] && [ "$PF_PORT" -lt 65536 ] || die "--port must be a TCP port number"
    [ -n "$G_MANIFEST" ] && [ -n "$G_SIGNATURE" ] || die "--manifest FILE and --signature FILE are required"
}

# preflight_run: every check an install depends on, changing nothing. Needs a
# loaded manifest and parse_guided_args' inputs. Writes key=value lines to
# PF_REPORT; sets PF_ISSUES, PF_CANDIDATES, PF_NEED_MB and, when the choice is
# unambiguous, PF_DATA.
preflight_run() {
    PF_ISSUES=0 PF_CANDIDATES=0 PF_NEED_MB=0
    : > "$PF_REPORT"
    : > "$PF_REPORT.candidates"
    pf version "$M_VERSION"
    for tool in uci ubus jsonfilter usign start-stop-daemon block sha256sum tar gzip wget; do
        have "$tool" || pf_issue firmware "required tool missing: $tool"
    done
    have od || have hexdump || pf_issue firmware "required tool missing: od or hexdump"

    read_device_facts
    pf device "$(device_summary)"
    if ! match_profile; then
        pf_issue firmware "this device is not a supported ChengOS profile; supported devices are listed with each release"
        return 0
    fi
    pf profile "$P_ID ($P_STATUS)"
    case "$P_STATUS" in
        supported) ;;
        experimental)
            [ "$PF_ACCEPT" = 1 ] || pf_issue firmware "profile $P_ID is experimental (not yet hardware-qualified); pass --accept-experimental to install anyway" ;;
        *) pf_issue firmware "profile $P_ID has status '$P_STATUS'" ;;
    esac

    mem_mb=$(awk '/^MemTotal:/ { print int($2 / 1024) }' "$MEMINFO" 2>/dev/null || echo 0)
    min_ram=$(pj min_ram_mb)
    pf memory "${mem_mb} MB"
    if is_uint "$min_ram" && [ "${mem_mb:-0}" -lt "$min_ram" ]; then
        pf_issue firmware "${mem_mb} MB RAM; profile $P_ID needs ${min_ram} MB"
    fi
    set -- $(stat -f -c '%a %S' /tmp 2>/dev/null || echo 0 0)
    tmp_mb=$(( $1 / 1024 * $2 / 1024 ))
    [ "$tmp_mb" -ge 16 ] || pf_issue storage "/tmp has only ${tmp_mb} MB free; the installer needs 16 MB there"

    installed_data=$(cfg data_dir)
    if [ -n "$installed_data" ]; then
        pf installed "$(cat "$installed_data/current/VERSION" 2>/dev/null || echo unknown) in $installed_data"
        [ -n "$PF_DATA" ] || PF_DATA=$installed_data
    fi

    floor=$(pj min_free_mb); is_uint "$floor" || floor=2048
    inodes=$(pj min_free_inodes); is_uint "$inodes" || inodes=100000
    pgdata_mb=0
    [ -z "$PF_DATA" ] || [ ! -d "$PF_DATA/pgdata" ] || pgdata_mb=$(du -sm "$PF_DATA/pgdata" | cut -f1)
    PF_NEED_MB=$(required_free_mb "$(manifest_staged_mb)" "$pgdata_mb" "$floor")
    pf download "$(( ($(pj archive.size) + $(pj postgres.size)) / 1048576 + 1 )) MB"
    pf needs_free "${PF_NEED_MB} MB, ${inodes} inodes"

    if [ -n "$PF_DATA" ]; then
        if result=$(storage_check "$PF_DATA" "$PF_NEED_MB" "$inodes"); then
            set -- $result
            mp=${2#mount=} dev=${4#device=}
            if mount_is_explicit "$mp" "$dev"; then
                pf data_dir "$PF_DATA"
                pf data_mount "$mp ($dev, ${3#fstype=}, ${5#free_mb=} MB free)"
            else
                pf_issue storage "$mp is not recorded in /etc/config/fstab by UUID; first run: chengos-openwrt.sh configure-mount --device $dev --target $mp"
            fi
        else
            pf_issue storage "$result"
        fi
    else
        candidate_mounts > "$PF_REPORT.mounts"
        while read -r mp dev fstype; do
            if result=$(storage_check "$mp/chengos" "$PF_NEED_MB" "$inodes"); then
                set -- $result
                if mount_is_explicit "$mp" "$dev"; then
                    PF_CANDIDATES=$((PF_CANDIDATES + 1))
                    pf candidate "$mp/chengos ($dev, $fstype, ${5#free_mb=} MB free)"
                    printf '%s\n' "$mp/chengos" >> "$PF_REPORT.candidates"
                else
                    pf unrecorded_mount "$mp ($dev) is not mounted by UUID; to use it: chengos-openwrt.sh configure-mount --device $dev --target $mp"
                fi
            else
                pf rejected_mount "$mp: $result"
            fi
        done < "$PF_REPORT.mounts"
        case "$PF_CANDIDATES" in
            0) pf_issue storage "no eligible data disk. Attach an ext4/f2fs/btrfs/xfs disk with ${PF_NEED_MB} MB free, record its mount by UUID (configure-mount), then retry" ;;
            1) PF_DATA=$(head -n 1 "$PF_REPORT.candidates"); pf data_dir "$PF_DATA" ;;
            *) pf data_dir "one of the $PF_CANDIDATES candidates (--data-dir)" ;;
        esac
    fi

    if addr=$(lan_address "$PF_IFACE"); then
        pf url "http://$addr:$PF_PORT/"
    else
        pf_issue lan "interface $PF_IFACE has no IPv4 address; pass --interface NAME"
    fi
    if port_in_use "$PF_PORT"; then
        if [ -n "$installed_data" ]; then
            pf port "$PF_PORT (held by the installed ChengOS)"
        else
            pf_issue port "TCP port $PF_PORT is already in use; pass --port PORT"
        fi
    fi
    for pkg in "$UCI_NAME" fstab firewall; do
        [ -z "$(uci changes "$pkg" 2>/dev/null || true)" ] \
            || pf_issue config "/etc/config/$pkg has uncommitted changes from another tool; commit or revert them first"
    done
    if [ "$PF_FIREWALL" = 1 ]; then
        if [ -z "$(uci -q get firewall.chengos_wan_deny 2>/dev/null || true)" ]; then
            pf firewall "add rule: reject TCP $PF_PORT from wan, then reload the firewall"
            config_in_sync firewall || [ "$PF_FORCE_FW" = 1 ] \
                || pf_issue config "the running firewall differs from /etc/config/firewall; a reload would apply those edits too. Resolve them, or pass --force-firewall-reload (or --no-firewall)"
        fi
    else
        pf firewall "unchanged (--no-firewall): the port is reachable from every zone the firewall allows"
    fi
    pf services "chengos-db, chengos-router, chengos (procd, started at boot); command /usr/sbin/chengos"
    pf recovery "chengos status | logs | repair | uninstall (data is kept unless --purge-data)"
}

print_preflight() {
    if [ "$G_MACHINE" = 1 ]; then
        cat "$PF_REPORT"
        printf 'ok=%s\n' "$([ "$PF_ISSUES" -eq 0 ] && echo 1 || echo 0)"
        return 0
    fi
    printf '\nChengOS preflight\n' >&2
    while IFS= read -r line; do
        key=${line%%=*} val=${line#*=}
        case "$key" in
            issue) printf '  PROBLEM   %s\n' "$val" >&2 ;;
            *) printf '  %-16s %s\n' "$key" "$val" >&2 ;;
        esac
    done < "$PF_REPORT"
    if [ "$PF_ISSUES" -eq 0 ]; then
        printf '\n  All checks passed.\n\n' >&2
    else
        printf '\n  %s problem(s); nothing was changed.\n\n' "$PF_ISSUES" >&2
    fi
}

preflight_cleanup() { rm -f "${PF_REPORT:?}" "${PF_REPORT:?}.mounts" "${PF_REPORT:?}.candidates"; }

cmd_preflight() {
    parse_guided_args "$@"
    [ "$(id -u)" = 0 ] || fail firmware "preflight must run as root (it reads block devices and UCI)"
    load_manifest "$G_MANIFEST" "$G_SIGNATURE"
    PF_REPORT=$(mktemp /tmp/chengos-preflight.XXXXXX)
    preflight_run
    print_preflight
    issues=$PF_ISSUES
    preflight_cleanup
    [ "$issues" -eq 0 ]
}

# choose_data_dir: ask which candidate to use when several qualify.
choose_data_dir() {
    interactive || die "several data disks qualify; pass --data-dir with one of: $(tr '\n' ' ' < "$PF_REPORT.candidates")"
    n=0
    while read -r c; do n=$((n + 1)); printf '  %s) %s\n' "$n" "$c" >&2; done < "$PF_REPORT.candidates"
    pick=$(ask "Data directory [1-$n]: ")
    is_uint "$pick" && [ "$pick" -ge 1 ] && [ "$pick" -le "$n" ] || die "no data directory chosen; nothing was changed"
    PF_DATA=$(sed -n "${pick}p" "$PF_REPORT.candidates")
}

# The whole first install: verified manifest -> preflight -> one confirmation
# -> verified download onto the chosen disk -> the release's own installer.
cmd_guided_install() {
    parse_guided_args "$@"
    [ "$(id -u)" = 0 ] || fail firmware "the installer must run as root"
    acquire_lock install
    load_manifest "$G_MANIFEST" "$G_SIGNATURE"
    if [ -n "$(cfg data_dir)" ] && [ "$G_CHECK" = 0 ]; then
        die "ChengOS is already installed in $(cfg data_dir); manage it with: chengos"
    fi
    PF_REPORT=$(mktemp /tmp/chengos-preflight.XXXXXX)
    preflight_run
    if [ "$G_CHECK" = 1 ] || [ "$PF_ISSUES" -gt 0 ]; then
        print_preflight
        issues=$PF_ISSUES
        preflight_cleanup
        [ "$issues" -eq 0 ] || die "preflight found $issues problem(s); nothing was changed"
        return 0
    fi
    if [ "$PF_DATA_EXPLICIT" = 0 ] && [ "$PF_CANDIDATES" -gt 1 ]; then
        choose_data_dir
    fi
    if [ "$G_YES" = 1 ]; then
        interactive || [ "$PF_DATA_EXPLICIT" = 1 ] || die "an unattended install needs an explicit --data-dir"
    else
        interactive || die "no terminal: pass --yes together with --data-dir to install unattended"
    fi
    print_preflight
    printf '  Installing will create %s, add the services and command listed above,\n  and download the release there.\n\n' "$PF_DATA" >&2
    if [ "$G_YES" = 0 ]; then
        confirm "Install ChengOS $M_VERSION into $PF_DATA?" || { preflight_cleanup; die "cancelled; nothing was changed"; }
    fi
    preflight_cleanup

    mkdir -p "$PF_DATA"
    stage_from_manifest "$PF_DATA"
    set -- install --data-dir "$PF_DATA" --interface "$PF_IFACE" --port "$PF_PORT" \
        --pg-bundle "$STAGED_PG" --pg-bundle-sha256 "$STAGED_PG_SHA"
    [ "$PF_FIREWALL" = 1 ] || set -- "$@" --no-firewall
    [ "$PF_FORCE_FW" = 0 ] || set -- "$@" --force-firewall-reload
    # Same pid, so the lock carries over.
    exec sh "$STAGED_RELEASE/chengos-openwrt.sh" "$@"
}

# ── update and rollback ──────────────────────────────────────────────────────

# verify_release DIR: complete, untampered, and runnable on this device.
verify_release() {
    [ -f "$1/VERSION" ] || die "$1 is not a ChengOS release (no VERSION)"
    (cd "$1" && sha256sum -c SHA256SUMS >/dev/null) || fail trust "release files in $1 do not match SHA256SUMS"
    "$1/bin/cheng-api" --version >/dev/null 2>&1 || fail firmware "$1/bin/cheng-api does not run on this device"
}

# stage_release SRC DATA VERSION: put SRC at releases/VERSION atomically. A
# release staged on the same mount is moved, so it is never on disk twice.
stage_release() {
    src=$1 target="$2/releases/$3"
    [ "$(readlink -f "$src")" = "$(readlink -f "$target" 2>/dev/null || echo none)" ] && return 0
    rm -rf "${target:?}.tmp"
    case "$src" in
        "$2"/staging/*)
            rm -rf "${target:?}" && mv "$src" "$target"
            [ "$src" != "$RELEASE_DIR" ] || RELEASE_DIR=$target ;;
        *)
            mkdir -p "$target.tmp"
            cp -a "$src/." "$target.tmp/"
            rm -rf "${target:?}" && mv "$target.tmp" "$target" ;;
    esac
}

enable_services() {
    for svc in $SERVICES_START; do "/etc/init.d/$svc" enable; done
}

stop_services() {
    for svc in $SERVICES_STOP; do "/etc/init.d/$svc" stop >/dev/null 2>&1 || true; done
    # stop-postgres waits for the shutdown checkpoint; a cluster that is still
    # up must not be copied.
    [ ! -f "$(data_dir)/pgdata/postmaster.pid" ] || die "PostgreSQL is still running after stop"
}

start_services() {
    for svc in $SERVICES_START; do "/etc/init.d/$svc" start; done
}

# snapshot_db DATA LABEL: tar the stopped cluster; prints the archive path.
snapshot_db() {
    mkdir -p "$1/backups"
    snap="$1/backups/pgdata-$2-$(date +%Y%m%d%H%M%S).tar.gz"
    tar -C "$1" -czf "$snap.tmp" pgdata && mv "$snap.tmp" "$snap"
    printf '%s' "$snap"
}

# restore_db DATA SNAPSHOT: replace the cluster with the snapshot; the
# replaced cluster is kept beside it until the next successful update.
restore_db() {
    [ -f "$2" ] || die "snapshot $2 is missing"
    rm -rf "${1:?}/pgdata.failed"
    [ ! -d "$1/pgdata" ] || mv "$1/pgdata" "$1/pgdata.failed"
    tar -C "$1" -xzf "$2" || die "could not restore $2 (the replaced cluster is in pgdata.failed)"
}

# Keep the two newest snapshots and the current and previous releases.
prune_backups() {
    data=$1 keep_prev=$2
    ls -1t "$data/backups"/pgdata-*.tar.gz 2>/dev/null | tail -n +3 | while read -r old; do rm -f "$old"; done
    cur=$(readlink "$data/current" | sed 's#^releases/##')
    for rel in "$data/releases"/*; do
        v=${rel##*/}
        [ "$v" = "$cur" ] || [ "$v" = "$keep_prev" ] || rm -rf "${rel:?}"
    done
    rm -rf "${data:?}/pgdata.failed"
}

cmd_update() {
    pg_bundle="" pg_sha=""
    while [ $# -gt 0 ]; do
        case "$1" in
            --pg-bundle) pg_bundle=$2; shift 2 ;;
            --pg-bundle-sha256) pg_sha=$2; shift 2 ;;
            *) die "unknown option: $1" ;;
        esac
    done
    [ -z "$pg_bundle" ] || [ -n "$pg_sha" ] || die "--pg-bundle needs --pg-bundle-sha256"
    [ "$(id -u)" = 0 ] || die "update must run as root"
    acquire_lock update
    require_data_mount
    data=$(data_dir)
    [ "$(cfg install_state)" != incomplete ] || fail service "the last install did not finish; run chengos repair first"
    verify_release "$RELEASE_DIR"
    new=$(tr -d '[:space:]' < "$RELEASE_DIR/VERSION")
    old=$(tr -d '[:space:]' < "$data/current/VERSION")
    [ "$new" != "$old" ] || die "ChengOS $new is already installed; use repair to reinstall it"
    [ "$(tr -d '[:space:]' < "$RELEASE_DIR/ARCH")" = "$(tr -d '[:space:]' < "$data/current/ARCH")" ] \
        || die "the new release is for a different architecture"
    [ -z "$pg_bundle" ] || require_clean_uci "$UCI_NAME"
    case "$RELEASE_DIR" in "$data"/staging/*) staged_mb=0 ;; *) staged_mb=$(du -sm "$RELEASE_DIR" | cut -f1) ;; esac
    [ -z "$pg_bundle" ] || staged_mb=$(( staged_mb + $(du -sm "$pg_bundle" | cut -f1) * 2 ))
    need_mb=$(required_free_mb "$staged_mb" "$(du -sm "$data/pgdata" | cut -f1)" 0)
    result=$(storage_check "$data" "$need_mb") || fail storage "not enough space for the update and its snapshot: $result"

    stage_release "$RELEASE_DIR" "$data" "$new"
    verify_release "$data/releases/$new"
    log "staged $new; stopping ChengOS $old"
    stop_services
    snap=$(snapshot_db "$data" "$old")
    printf 'from=%s\nto=%s\nsnapshot=%s\n' "$old" "$new" "$snap" > "$data/backups/last-update"
    log "database snapshot: $snap"
    if [ -n "$pg_bundle" ] && ! ( install_postgres_bundle "$data/pg/root" "$pg_bundle" "$pg_sha" "$data/pgdata" ); then
        start_services
        fail database "the new release's PostgreSQL could not be installed; ChengOS $old was restarted unchanged"
    fi

    ln -sfn "releases/$new" "$data/current"
    # The init scripts and hotplug hooks ship with the release. Any failure from
    # here on takes the restore path below rather than leaving the switch half done.
    if write_init_scripts && install_command "$data/current" && start_services && wait_healthy 300 "$new"; then
        prune_backups "$data" "$old"
        rm -rf "${data:?}/pg/root.prev"
        if [ -n "$pg_bundle" ]; then
            if [ "$(readlink -f "$pg_bundle")" != "$(readlink -f "$data/pg/bundle.tar.gz" 2>/dev/null || echo none)" ]; then
                mv "$pg_bundle" "$data/pg/bundle.tar.gz"
            fi
            uci set "$UCI_NAME.main.pg_source=bundle"
            uci set "$UCI_NAME.main.pg_bundle_sha256=$pg_sha"
            uci commit "$UCI_NAME"
        fi
        rm -rf "${data:?}/staging"
        log "ChengOS updated $old -> $new"
        return 0
    fi

    warn "ChengOS $new did not become healthy; restoring $old and its database snapshot"
    stop_services
    restore_db "$data" "$snap"
    if [ -d "$data/pg/root.prev" ]; then
        rm -rf "${data:?}/pg/root"
        mv "$data/pg/root.prev" "$data/pg/root"
    fi
    ln -sfn "releases/$old" "$data/current"
    install_command "$data/current"
    start_services
    wait_healthy 300 "$old" || fail service "rollback to $old did not become healthy either; see: chengos logs"
    fail service "update to $new failed and was rolled back to $old (see: chengos logs)"
}

# Fetch, verify and stage the newest (or a given) release, then hand over to
# its own `update`.
cmd_upgrade() {
    want="" manifest="" signature="" yes=0 accept=0
    ASSET_DIR=""
    while [ $# -gt 0 ]; do
        case "$1" in
            --version) want=$2; shift 2 ;;
            --manifest) manifest=$2; shift 2 ;;
            --signature) signature=$2; shift 2 ;;
            --asset-dir) ASSET_DIR=${2%/}; shift 2 ;;
            --accept-experimental) accept=1; shift ;;
            --yes) yes=1; shift ;;
            *) die "unknown option: $1" ;;
        esac
    done
    [ "$(id -u)" = 0 ] || die "update must run as root"
    acquire_lock upgrade
    require_data_mount
    data=$(data_dir)
    [ "$(cfg install_state)" != incomplete ] || fail service "the last install did not finish; run chengos repair first"
    installed=$(tr -d '[:space:]' < "$data/current/VERSION")
    meta="$data/manifest"
    mkdir -p "$meta"
    if [ -n "$manifest" ]; then
        [ -n "$signature" ] || die "--manifest needs --signature"
        cp "$manifest" "$meta/$MANIFEST_NAME" && cp "$signature" "$meta/$MANIFEST_NAME.sig"
    else
        if [ -n "$want" ]; then base="$RELEASE_BASE_URL/download/v$want"; else base="$RELEASE_BASE_URL/latest/download"; fi
        [ -z "$ASSET_DIR" ] || base=$ASSET_DIR
        fetch "$base/$MANIFEST_NAME" "$meta/$MANIFEST_NAME"
        fetch "$base/$MANIFEST_NAME.sig" "$meta/$MANIFEST_NAME.sig"
    fi
    load_manifest "$meta/$MANIFEST_NAME" "$meta/$MANIFEST_NAME.sig"
    [ -z "$want" ] || [ "$M_VERSION" = "$want" ] || fail trust "the manifest is for $M_VERSION, not the requested $want"
    if [ "$M_VERSION" = "$installed" ]; then
        log "ChengOS $installed is up to date"
        return 0
    fi
    version_lt "$installed" "$M_VERSION" \
        || fail trust "the manifest offers $M_VERSION, older than the installed $installed; downgrades are refused"
    require_profile "$accept"
    need_mb=$(required_free_mb "$(manifest_staged_mb)" "$(du -sm "$data/pgdata" | cut -f1)" 0)
    result=$(storage_check "$data" "$need_mb") || fail storage "not enough space to update: $result"
    log "update $installed -> $M_VERSION for $P_ID; needs ${need_mb} MB free (${result#ok })"
    log "ChengOS stops briefly; the database is snapshotted first and restored automatically if the new release fails"
    if [ "$yes" = 0 ]; then
        interactive || die "no terminal: pass --yes to update unattended"
        confirm "Update ChengOS $installed -> $M_VERSION?" || die "cancelled; nothing was changed"
    fi
    stage_from_manifest "$data"
    exec sh "$STAGED_RELEASE/chengos-openwrt.sh" update --pg-bundle "$STAGED_PG" --pg-bundle-sha256 "$STAGED_PG_SHA"
}

# Manual return to the release before the last update. The database goes back
# to the snapshot taken then, so everything written since is discarded; the
# flag makes that explicit.
cmd_rollback() {
    [ "$(id -u)" = 0 ] || die "rollback must run as root"
    [ "${1:-}" = --discard-changes-since-update ] \
        || die "rollback restores the database snapshot taken before the last update and discards everything written since.
Re-run with --discard-changes-since-update to confirm."
    data=$(data_dir)
    record="$data/backups/last-update"
    [ -f "$record" ] || die "no update to roll back (no $record)"
    acquire_lock rollback
    from=$(sed -n 's/^from=//p' "$record") to=$(sed -n 's/^to=//p' "$record") snap=$(sed -n 's/^snapshot=//p' "$record")
    current=$(tr -d '[:space:]' < "$data/current/VERSION")
    [ "$current" = "$to" ] || die "the installed release is $current, not $to; refusing to guess"
    [ -x "$data/releases/$from/bin/cheng-api" ] || die "release $from is no longer on disk"
    [ -f "$snap" ] || die "snapshot $snap is missing"

    stop_services
    keep=$(snapshot_db "$data" "$to-before-rollback")
    log "current database kept as $keep"
    restore_db "$data" "$snap"
    ln -sfn "releases/$from" "$data/current"
    install_command "$data/current"
    start_services
    wait_healthy 300 "$from" || fail service "ChengOS $from did not become healthy after rollback; see: chengos logs"
    rm -f "$record"
    log "rolled back $to -> $from"
}

# Post-upgrade / health check: report everything an install needs, so a
# firmware upgrade never silently leaves a half-installed ChengOS.
cmd_check() {
    problems=0
    ok()  { printf '  ok    %s\n' "$*"; }
    bad() { printf '  FAIL  %s\n' "$*"; problems=$((problems + 1)); }
    data=$(cfg data_dir)
    [ -n "$data" ] && ok "configured data dir $data" || { bad "no ${UCI_NAME}.main.data_dir"; return 1; }
    [ "$(cfg install_state)" != incomplete ] && ok "install completed" || bad "the last install did not finish"
    load_openwrt_functions
    user_exists "$CHENGOS_USER" && ok "user $CHENGOS_USER" || bad "user $CHENGOS_USER missing"
    if result=$(storage_check "$data" 0); then ok "storage: $result"; else bad "storage: $result"; fi
    [ -x "$data/current/bin/cheng-api" ] && ok "release $(cat "$data/current/VERSION" 2>/dev/null)" || bad "no current release"
    [ -x "$data/pg/root/usr/bin/postgres" ] && ok "PostgreSQL binaries" || bad "PostgreSQL binaries missing"
    [ -f "$data/pgdata/PG_VERSION" ] && ok "PostgreSQL cluster" || bad "PostgreSQL cluster missing"
    [ -f "$data/etc/chengos.env" ] && ok "secrets" || bad "secrets file missing"
    for svc in $SERVICES_START; do
        if [ -x "/etc/init.d/$svc" ] && "/etc/init.d/$svc" enabled; then ok "service $svc enabled"; else bad "service $svc not installed/enabled"; fi
    done
    [ -x "$data/current/bin/chengos-router-helper" ] && ok "router helper binary" || bad "router helper binary missing"
    [ -f "$HOTPLUG_FILE" ] && ok "LAN rebind hotplug" || bad "hotplug script missing"
    [ -f "$BLOCK_HOTPLUG_FILE" ] && ok "start-on-data-mount hotplug" || bad "block hotplug script missing"
    [ -f "$KEEP_FILE" ] && ok "sysupgrade keep list" || bad "sysupgrade keep list missing"
    [ -x "$COMMAND_FILE" ] && ok "command $COMMAND_FILE" || bad "command $COMMAND_FILE missing"
    [ -n "$(uci -q get firewall.chengos_wan_deny)" ] && ok "WAN deny rule" || printf '  info  no WAN deny rule (installed with --no-firewall?)\n'
    [ "$problems" -eq 0 ] || { printf '%s problem(s); run: chengos repair\n' "$problems"; return 1; }
}

# Reinstall the current release in place with the recorded choices. Also how
# an interrupted first install is resumed.
cmd_repair() {
    [ "$(id -u)" = 0 ] || die "repair must run as root"
    acquire_lock repair
    require_data_mount
    data=$(data_dir)
    load_openwrt_functions
    ensure_user
    write_init_scripts
    enable_services
    set -- install --data-dir "$data" --interface "$(iface_cfg)" --port "$(port_cfg)" --pg-port "$(pgport_cfg)"
    # Installs from before the firewall choice was recorded never reloaded it here.
    [ "$(cfg firewall)" = 1 ] || set -- "$@" --no-firewall
    if [ "$(cfg pg_source)" = bundle ] && [ -f "$data/pg/bundle.tar.gz" ]; then
        set -- "$@" --pg-bundle "$data/pg/bundle.tar.gz" --pg-bundle-sha256 "$(cfg pg_bundle_sha256)"
    elif [ -f "$data/pg/root/.chengos-complete" ] || [ "$(cfg pg_source)" = feed ]; then
        set -- "$@" --pg-from-feed
    else
        fail database "the PostgreSQL bundle is missing from $data/pg; reinstall with the installer"
    fi
    exec sh "$data/current/chengos-openwrt.sh" "$@"
}

cmd_status() {
    data=$(cfg data_dir)
    [ -n "$data" ] || { echo "ChengOS is not installed"; return 1; }
    for svc in $SERVICES_START; do
        printf '%-15s %s\n' "$svc" "$(/etc/init.d/$svc status 2>/dev/null || echo 'not installed')"
    done
    if result=$(storage_check "$data" 0); then
        printf '%-15s %s (%s)\n' data "$data" "$(printf '%s' "$result" | sed 's/^ok //')"
    else
        printf '%-15s %s UNAVAILABLE: %s\n' data "$data" "$result"
    fi
    printf '%-15s %s\n' version "$(cat "$data/current/VERSION" 2>/dev/null || echo '?')"
    [ "$(cfg install_state)" != incomplete ] || printf '%-15s %s\n' install "INCOMPLETE; resume with: chengos repair"
    base=$(instance_url)
    printf '%-15s %s\n' url "$base/"
    if wget -q -T 3 -O - "$base/health" 2>/dev/null; then echo; else echo "health          unreachable"; fi
    if setup_needed "$base"; then
        printf '%-15s %s\n' setup "no administrator yet; open the link from: chengos setup-url"
    fi
}

cmd_logs() {
    if [ "${1:-}" = -f ]; then exec logread -f -e chengos; fi
    lines=${1:-200}
    is_uint "$lines" || die "usage: chengos logs [-f | LINES]"
    logread -e chengos | tail -n "$lines"
}

cmd_setup_url() {
    require_data_mount
    base=$(instance_url)
    if setup_needed "$base"; then
        setup_link
        echo
    elif wget -q -T 3 -O /dev/null "$base/health" 2>/dev/null; then
        log "the administrator account already exists; sign in at $base/login (lost access? chengos reset-admin)"
    else
        fail service "ChengOS is not answering at $base; see: chengos status"
    fi
}

# Recover access from the console: before setup, print the setup link;
# afterwards reset a password through cheng-api (prompted on the terminal).
cmd_reset_admin() {
    [ "$(id -u)" = 0 ] || die "reset-admin must run as root"
    require_data_mount
    data=$(data_dir)
    if setup_needed "$(instance_url)"; then
        log "no administrator exists yet; create one with the setup link:"
        setup_link
        echo
        return 0
    fi
    (
        set -a
        . "$data/etc/chengos.env"
        set +a
        cd "$data/home"
        as_user "$data/current/bin/cheng-api" reset-admin "$@"
    )
}

# Removes the system integration. The data dir (database, secrets, releases)
# is kept unless --purge-data is confirmed by typing its path.
cmd_uninstall() {
    purge=0 confirm_path=""
    while [ $# -gt 0 ]; do
        case "$1" in
            --purge-data) purge=1; shift ;;
            --confirm-purge) confirm_path=${2%/}; shift 2 ;;
            *) die "unknown option: $1" ;;
        esac
    done
    [ "$(id -u)" = 0 ] || die "uninstall must run as root"
    data=$(cfg data_dir)
    acquire_lock uninstall
    if [ "$purge" -eq 1 ]; then
        [ -n "$data" ] || die "no data dir is recorded; nothing to purge"
        # Only ever a dedicated data mount, never a system path.
        result=$(storage_check "$data" 0) || die "refusing to purge $data: $result"
        if [ -z "$confirm_path" ]; then
            interactive || die "--purge-data needs --confirm-purge $data when run without a terminal"
            log "this permanently deletes $data: database, secrets, releases and backups"
            confirm_path=$(ask "Type $data to confirm: ")
        fi
        [ "$confirm_path" = "$data" ] || die "the confirmation did not match $data; nothing was changed"
    fi
    for svc in $SERVICES_STOP; do
        [ -x "/etc/init.d/$svc" ] || continue
        "/etc/init.d/$svc" stop || true
        "/etc/init.d/$svc" disable || true
        rm -f "/etc/init.d/$svc"
    done
    rm -f "$HOTPLUG_FILE" "$BLOCK_HOTPLUG_FILE" "$KEEP_FILE"
    rm -rf "${RUN_DIR:?}"
    if [ -n "$(uci -q get firewall.chengos_wan_deny)" ]; then
        require_clean_uci firewall
        uci delete firewall.chengos_wan_deny
        uci commit firewall
        if config_in_sync firewall; then
            /etc/init.d/firewall reload >/dev/null 2>&1 || warn "firewall reload failed"
        else
            warn "the WAN rule was removed from /etc/config/firewall but not reloaded: the running firewall has other unapplied edits"
        fi
    fi
    rm -f "/etc/config/$UCI_NAME"
    if [ "$purge" -eq 0 ]; then
        rm -f "$COMMAND_FILE"
        log "system integration removed${data:+; data remains in $data}"
        return 0
    fi
    rm -rf "${data:?}"
    for f in /etc/passwd /etc/shadow /etc/group; do
        [ ! -f "$f" ] || sed -i "/^$CHENGOS_USER:/d" "$f"
    done
    rm -f "$COMMAND_FILE"
    log "ChengOS and its data in $data were removed"
}

# ── menu ─────────────────────────────────────────────────────────────────────

# Menu text in one table, so a translation can be added without touching the
# control flow.
msg() {
    case "$1" in
        title) echo "ChengOS appliance manager" ;;
        status) echo "Status" ;;
        logs) echo "Recent logs" ;;
        check) echo "Check the installation" ;;
        update) echo "Update to the latest release" ;;
        repair) echo "Repair (reinstall the current release)" ;;
        access) echo "Setup link / reset administrator password" ;;
        rollback) echo "Roll back the last update" ;;
        uninstall) echo "Uninstall" ;;
        quit) echo "Exit" ;;
        choose) echo "Choose: " ;;
        rollback_warn) echo "Rollback restores the database from before the last update; everything written since is lost. Continue?" ;;
        purge_ask) echo "Also delete all ChengOS data (database, secrets, backups)?" ;;
        uninstall_ask) echo "Remove ChengOS from this router (data is kept)?" ;;
        not_installed) echo "ChengOS is not installed. Download and run chengos-openwrt-install.sh to install it." ;;
    esac
}

cmd_menu() {
    interactive || die "no terminal; run a command instead (chengos --help)"
    [ -n "$(cfg data_dir)" ] || { msg not_installed >&2; return 1; }
    while :; do
        printf '\n%s (%s)\n' "$(msg title)" "$(cat "$(cfg data_dir)/current/VERSION" 2>/dev/null || echo '?')" >&2
        n=0
        for key in status logs check update repair access rollback uninstall; do
            n=$((n + 1))
            printf '  %s) %s\n' "$n" "$(msg "$key")" >&2
        done
        printf '  0) %s\n' "$(msg quit)" >&2
        choice=$(ask "$(msg choose)")
        # Each action runs in a subshell: a failure reports and returns here.
        case "$choice" in
            1) ( cmd_status ) || true ;;
            2) ( cmd_logs 100 ) || true ;;
            3) ( cmd_check ) || true ;;
            4) ( cmd_upgrade ) || true ;;
            5) ( cmd_repair ) || true ;;
            6) ( cmd_reset_admin ) || true ;;
            7) if confirm "$(msg rollback_warn)"; then ( cmd_rollback --discard-changes-since-update ) || true; fi ;;
            8) if confirm "$(msg uninstall_ask)"; then
                   if confirm "$(msg purge_ask)"; then ( cmd_uninstall --purge-data ) || true; else ( cmd_uninstall ) || true; fi
                   [ -n "$(cfg data_dir)" ] || return 0
               fi ;;
            0|q|"") return 0 ;;
            *) ;;
        esac
    done
}

main() {
    cmd=${1:-}
    [ $# -gt 0 ] && shift
    case "$cmd" in
        guided-install) cmd_guided_install "$@" ;;
        preflight) cmd_preflight "$@" ;;
        install) cmd_install "$@" ;;
        update) cmd_update "$@" ;;
        upgrade) cmd_upgrade "$@" ;;
        rollback) cmd_rollback "$@" ;;
        check) cmd_check ;;
        repair) cmd_repair ;;
        status) cmd_status ;;
        logs) cmd_logs "$@" ;;
        menu) cmd_menu ;;
        setup-url) cmd_setup_url ;;
        reset-admin) cmd_reset_admin "$@" ;;
        uninstall) cmd_uninstall "$@" ;;
        configure-mount) cmd_configure_mount "$@" ;;
        storage-check) storage_check "$@" ;;
        storage-gate) storage_check "$(data_dir)" 0 ;;
        lan-address) lan_address "$@" ;;
        run-postgres) cmd_run_postgres ;;
        stop-postgres) cmd_stop_postgres ;;
        run-api) cmd_run_api ;;
        clear-port) cmd_clear_port "$@" ;;
        "") if interactive && [ -n "$(cfg data_dir)" ]; then cmd_menu; else usage; fi ;;
        -h|--help) usage ;;
        *) die "unknown command: $cmd" ;;
    esac
}

usage() { sed -n '2,76p' "$(self_path)" | sed 's/^# \{0,1\}//'; }

# Sourcing with CHENGOS_LIB_ONLY=1 exposes the functions for tests.
[ "${CHENGOS_LIB_ONLY:-0}" = 1 ] || main "$@"
