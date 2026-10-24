#!/bin/sh
#
# ChengOS all-in-one appliance manager for OpenWrt (runs ON the router).
#
# Ships inside the release archive and is installed with it under
# <data_dir>/releases/<version>/. The procd services call it as their entry
# point, so it is POSIX/BusyBox sh only.
#
# Usage:
#   chengos-openwrt.sh install --data-dir DIR [options]
#   chengos-openwrt.sh update            (run from the NEW extracted release)
#   chengos-openwrt.sh rollback --discard-changes-since-update
#   chengos-openwrt.sh check | repair | status | uninstall
#   chengos-openwrt.sh configure-mount --device DEV --target DIR
#   chengos-openwrt.sh storage-check DIR [MIN_FREE_MB]
#   chengos-openwrt.sh lan-address
#
# install options:
#   --data-dir DIR       ChengOS instance root on a durable, explicitly mounted
#                        filesystem (required on first install)
#   --interface NAME     LAN interface to bind (default: lan)
#   --port PORT          ChengOS HTTP port (default: 19225)
#   --pg-port PORT       loopback PostgreSQL port (default: 15432)
#   --min-free-mb N      storage gate free-space minimum (default: 2048)
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
#   pg/root/             PostgreSQL unpacked from the feed (never `opkg install`:
#                        pgsql-server pulls in blockd/autofs)
#   pgdata/  home/  logs/  etc/chengos.env (secrets, 0600 chengos)
#   backups/pgdata-<version>-<time>.tar.gz   cluster snapshot before an update
#   backups/last-update                      from/to versions and the snapshot
#
# An update always snapshots the stopped PostgreSQL cluster before the new
# release can migrate it, and a rollback restores that snapshot together with
# the previous binaries: an older binary alone is never pointed at a database
# a newer release has migrated.
set -eu

CHENGOS_USER=chengos
CHENGOS_ID=19225
UCI_NAME=chengos
# Only PostgreSQL itself; its other libraries (zlib, readline, ncurses, ...)
# must already be on the image, which the library check after unpacking proves.
PG_PACKAGES="pgsql-server pgsql-cli libpq"
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

log()  { printf '[chengos] %s\n' "$*" >&2; }
warn() { printf '[chengos] WARNING: %s\n' "$*" >&2; }
die()  { printf '[chengos] ERROR: %s\n' "$*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

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

# storage_check DIR MIN_FREE_MB: the data dir must sit on a durable, explicitly
# mounted filesystem with room for PostgreSQL. Path strings prove nothing; the
# resolved mount, its type and its free space do.
storage_check() {
    dir=$1 min_mb=${2:-2048}
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
    [ "$free_inodes" -ge 100000 ] || { echo "only ${free_inodes} free inodes on $mp"; return 1; }
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

install_postgres_packages() {
    root=$1
    # Only a fully unpacked and checked tree counts; a partial one is redone.
    [ -f "$root/.chengos-complete" ] && return 0
    rm -rf "$root"
    have opkg || die "opkg is required to fetch PostgreSQL from the firmware feed"
    grep -qs '^option check_signature' /etc/opkg.conf \
        || warn "opkg signature checking is off on this image; package hashes are checked against an index protected only by HTTPS"
    ls "$OPKG_LISTS"/* >/dev/null 2>&1 || opkg update >/dev/null || die "opkg update failed"
    ipk_dir=$(dirname "$root")/ipk
    rm -rf "$ipk_dir" && mkdir -p "$ipk_dir" "$root"
    for pkg in $PG_PACKAGES; do
        before=$(ls "$ipk_dir")
        (cd "$ipk_dir" && opkg download "$pkg" >/dev/null) || die "opkg download $pkg failed"
        # opkg saves whichever package provides the name; hash-check that one.
        file=$(ls "$ipk_dir" | grep -vxF "$before" | grep '\.ipk$' | head -n 1 || true)
        [ -n "$file" ] || die "$pkg was not downloaded"
        file="$ipk_dir/$file"
        name=$(basename "$file")
        want=$(feed_sha256 "${name%%_*}")
        got=$(sha256sum "$file" | cut -d' ' -f1)
        [ -n "$want" ] && [ "$want" = "$got" ] || die "$pkg SHA-256 does not match the feed index"
        tmp="$ipk_dir/x" && rm -rf "$tmp" && mkdir -p "$tmp"
        tar -xzf "$file" -C "$tmp" && tar -xzf "$tmp/data.tar.gz" -C "$root"
        rm -rf "$tmp"
        log "unpacked $(basename "$file")"
    done
    for bin in postgres initdb pg_ctl psql; do
        missing=$(env "$(pg_env "$root")" /lib/ld-musl-*.so.1 --list "$root/usr/bin/$bin" 2>&1 \
            | grep -iE 'not found|error' || true)
        [ -z "$missing" ] || die "$bin cannot resolve its libraries: $missing"
    done
    touch "$root/.chengos-complete"
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
RUN_MIGRATIONS=true
RUST_LOG=info
CHENG_API_LOG_FILE=stdout
EOF
    chown "$CHENGOS_USER:$CHENGOS_USER" "$env_file"
    chmod 0600 "$env_file"
}

env_value() { sed -n "s/^$1=//p" "$2" | head -n 1; }

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
$KEEP_FILE
EOF
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

cmd_install() {
    data="" iface=lan port=19225 pg_port=15432 min_mb=2048 firewall=1 force_fw=0
    while [ $# -gt 0 ]; do
        case "$1" in
            --data-dir) data=$2; shift 2 ;;
            --interface) iface=$2; shift 2 ;;
            --port) port=$2; shift 2 ;;
            --pg-port) pg_port=$2; shift 2 ;;
            --min-free-mb) min_mb=$2; shift 2 ;;
            --no-firewall) firewall=0; shift ;;
            --force-firewall-reload) force_fw=1; shift ;;
            *) die "unknown option: $1" ;;
        esac
    done
    [ "$(id -u)" = 0 ] || die "install must run as root"
    [ -n "$data" ] || data=$(cfg data_dir)
    [ -n "$data" ] || die "--data-dir is required"
    data=${data%/}
    for tool in uci ubus jsonfilter opkg start-stop-daemon block sha256sum; do
        have "$tool" || die "required tool missing: $tool"
    done
    have od || have hexdump || die "required tool missing: od or hexdump"
    load_openwrt_functions

    version=$(tr -d '[:space:]' < "$RELEASE_DIR/VERSION")
    (cd "$RELEASE_DIR" && sha256sum -c SHA256SUMS >/dev/null) || die "release files do not match SHA256SUMS"
    "$RELEASE_DIR/bin/cheng-api" --version >/dev/null 2>&1 || die "bin/cheng-api does not run on this device"

    result=$(storage_check "$data" "$min_mb") || die "storage gate: $result"
    log "storage gate: $result"
    set -- $result
    mp=${2#mount=} dev=${4#device=}
    mount_is_explicit "$mp" "$dev" \
        || die "$mp is not recorded in /etc/config/fstab by UUID; run: $0 configure-mount --device $dev --target $mp"

    current_version=""
    [ -f "$data/current/VERSION" ] && current_version=$(tr -d '[:space:]' < "$data/current/VERSION")
    if [ -n "$current_version" ] && [ "$current_version" != "$version" ]; then
        die "ChengOS $current_version is installed; run this release's chengos-openwrt.sh update instead"
    fi

    require_clean_uci "$UCI_NAME"
    ensure_user
    mkdir -p "$data/releases" "$data/home" "$data/logs" "$data/etc" "$data/pg"
    chown "$CHENGOS_USER:$CHENGOS_USER" "$data/home" "$data/logs" "$data/etc"
    chmod 0700 "$data/etc"

    stage_release "$RELEASE_DIR" "$data" "$version"
    # -n replaces the existing link itself instead of creating one inside the
    # directory it points to.
    ln -sfn "releases/$version" "$data/current"
    # config/i18n is resolved relative to the working directory.
    ln -sfn ../current/config "$data/home/config"

    install_postgres_packages "$data/pg/root"
    ensure_secrets "$data/etc/chengos.env" "$pg_port"
    init_database "$data" "$pg_port"

    uci -q get "$UCI_NAME.main" >/dev/null || { touch "/etc/config/$UCI_NAME"; uci set "$UCI_NAME.main=chengos"; }
    uci set "$UCI_NAME.main.data_dir=$data"
    uci set "$UCI_NAME.main.interface=$iface"
    uci set "$UCI_NAME.main.port=$port"
    uci set "$UCI_NAME.main.pg_port=$pg_port"
    uci commit "$UCI_NAME"

    write_init_scripts
    enable_services
    [ "$firewall" -eq 0 ] || firewall_rule "$port" "$force_fw"

    # stop+start rather than restart: rc.common's restart prints a ubus error
    # for a service that is not running yet.
    for svc in $SERVICES_STOP; do "/etc/init.d/$svc" stop >/dev/null 2>&1 || true; done
    start_services
    wait_healthy 180 || die "ChengOS did not become healthy; see: logread -e chengos"
    log "ChengOS $version is running: http://$(cat "$RUN_DIR/bind_address"):$port/"
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

# ── update and rollback ──────────────────────────────────────────────────────

# verify_release DIR: complete, untampered, and runnable on this device.
verify_release() {
    [ -f "$1/VERSION" ] || die "$1 is not a ChengOS release (no VERSION)"
    (cd "$1" && sha256sum -c SHA256SUMS >/dev/null) || die "release files in $1 do not match SHA256SUMS"
    "$1/bin/cheng-api" --version >/dev/null 2>&1 || die "$1/bin/cheng-api does not run on this device"
}

# stage_release SRC DATA VERSION: copy SRC into releases/VERSION atomically.
stage_release() {
    src=$1 target="$2/releases/$3"
    [ "$(readlink -f "$src")" = "$(readlink -f "$target" 2>/dev/null || echo none)" ] && return 0
    rm -rf "$target.tmp" && mkdir -p "$target.tmp"
    cp -a "$src/." "$target.tmp/"
    rm -rf "$target" && mv "$target.tmp" "$target"
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
    rm -rf "$1/pgdata.failed"
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
        [ "$v" = "$cur" ] || [ "$v" = "$keep_prev" ] || rm -rf "$rel"
    done
    rm -rf "$data/pgdata.failed"
}

cmd_update() {
    [ "$(id -u)" = 0 ] || die "update must run as root"
    data=$(data_dir)
    verify_release "$RELEASE_DIR"
    new=$(tr -d '[:space:]' < "$RELEASE_DIR/VERSION")
    old=$(tr -d '[:space:]' < "$data/current/VERSION")
    [ "$new" != "$old" ] || die "ChengOS $new is already installed; use repair to reinstall it"
    [ "$(tr -d '[:space:]' < "$RELEASE_DIR/ARCH")" = "$(tr -d '[:space:]' < "$data/current/ARCH")" ] \
        || die "the new release is for a different architecture"
    result=$(storage_check "$data" 0) || die "storage gate: $result"
    need_mb=$(( $(du -sm "$data/pgdata" | cut -f1) * 2 + $(du -sm "$RELEASE_DIR" | cut -f1) + 256 ))
    result=$(storage_check "$data" "$need_mb") || die "not enough space for the update and its snapshot: $result"

    stage_release "$RELEASE_DIR" "$data" "$new"
    verify_release "$data/releases/$new"
    log "staged $new; stopping ChengOS $old"
    stop_services
    snap=$(snapshot_db "$data" "$old")
    printf 'from=%s\nto=%s\nsnapshot=%s\n' "$old" "$new" "$snap" > "$data/backups/last-update"
    log "database snapshot: $snap"

    ln -sfn "releases/$new" "$data/current"
    # The init scripts and hotplug hooks ship with the release.
    write_init_scripts
    start_services
    if wait_healthy 300 "$new"; then
        prune_backups "$data" "$old"
        log "ChengOS updated $old -> $new"
        return 0
    fi

    warn "ChengOS $new did not become healthy; restoring $old and its database snapshot"
    stop_services
    restore_db "$data" "$snap"
    ln -sfn "releases/$old" "$data/current"
    start_services
    wait_healthy 300 "$old" || die "rollback to $old did not become healthy either; see: logread -e chengos"
    die "update to $new failed and was rolled back to $old (see: logread -e chengos)"
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
    start_services
    wait_healthy 300 "$from" || die "ChengOS $from did not become healthy after rollback; see: logread -e chengos"
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
    [ -n "$(uci -q get firewall.chengos_wan_deny)" ] && ok "WAN deny rule" || printf '  info  no WAN deny rule (installed with --no-firewall?)\n'
    [ "$problems" -eq 0 ] || { printf '%s problem(s); run: %s repair\n' "$problems" "$data/current/chengos-openwrt.sh"; return 1; }
}

cmd_repair() {
    data=$(data_dir)
    load_openwrt_functions
    ensure_user
    write_init_scripts
    enable_services
    exec "$data/current/chengos-openwrt.sh" install --data-dir "$data" \
        --interface "$(iface_cfg)" --port "$(port_cfg)" --pg-port "$(pgport_cfg)" --no-firewall
}

cmd_status() {
    for svc in $SERVICES_START; do
        printf '%-15s %s\n' "$svc" "$(/etc/init.d/$svc status 2>/dev/null || echo 'not installed')"
    done
    addr=$(cat "$RUN_DIR/bind_address" 2>/dev/null || echo '?')
    printf 'bound      %s:%s\n' "$addr" "$(port_cfg)"
    if wget -q -T 3 -O - "http://$addr:$(port_cfg)/health" 2>/dev/null; then echo; else echo "health     unreachable"; fi
}

# Removes the system integration only. The data dir (database, secrets,
# releases) is left in place and reported.
cmd_uninstall() {
    data=$(cfg data_dir)
    for svc in $SERVICES_STOP; do
        [ -x "/etc/init.d/$svc" ] || continue
        "/etc/init.d/$svc" stop || true
        "/etc/init.d/$svc" disable || true
        rm -f "/etc/init.d/$svc"
    done
    rm -f "$HOTPLUG_FILE" "$BLOCK_HOTPLUG_FILE" "$KEEP_FILE"
    rm -rf "$RUN_DIR"
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
    log "system integration removed${data:+; data remains in $data}"
}

main() {
    cmd=${1:-}
    [ $# -gt 0 ] && shift
    case "$cmd" in
        install) cmd_install "$@" ;;
        update) cmd_update ;;
        rollback) cmd_rollback "$@" ;;
        check) cmd_check ;;
        repair) cmd_repair ;;
        status) cmd_status ;;
        uninstall) cmd_uninstall ;;
        configure-mount) cmd_configure_mount "$@" ;;
        storage-check) storage_check "$@" ;;
        storage-gate) storage_check "$(data_dir)" 0 ;;
        lan-address) lan_address "$@" ;;
        run-postgres) cmd_run_postgres ;;
        stop-postgres) cmd_stop_postgres ;;
        run-api) cmd_run_api ;;
        clear-port) cmd_clear_port "$@" ;;
        -h|--help|"") sed -n '2,40p' "$(self_path)" | sed 's/^# \{0,1\}//' ;;
        *) die "unknown command: $cmd" ;;
    esac
}

# Sourcing with CHENGOS_LIB_ONLY=1 exposes the functions for tests.
[ "${CHENGOS_LIB_ONLY:-0}" = 1 ] || main "$@"
