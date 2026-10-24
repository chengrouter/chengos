#!/usr/bin/env bash
#
# Smoke tests for the OpenWrt appliance manager's decision logic
# (deploy/openwrt/appliance/chengos-openwrt.sh), run under BusyBox ash with
# fixture mount tables, feed indexes and stubbed ubus/uci. No router needed.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="${REPO_ROOT}/deploy/openwrt/appliance/chengos-openwrt.sh"
command -v busybox >/dev/null 2>&1 || { echo "SKIP: busybox not installed"; exit 0; }

# Outside /tmp and /var: the gate rightly refuses anything mounted under them.
T="$(mktemp -d "${XDG_RUNTIME_DIR:-$HOME}/.chengos-appliance-smoke.XXXXXX")"
trap 'rm -rf "$T"' EXIT
pass=0 fail=0
ok()  { pass=$((pass + 1)); printf '  ok    %s\n' "$1"; }
bad() { fail=$((fail + 1)); printf '  FAIL  %s\n' "$1"; }

# run_lib SNIPPET: source the manager as a library under BusyBox ash.
run_lib() {
    CHENGOS_LIB_ONLY=1 CHENGOS_PROC_MOUNTS="$T/mounts" CHENGOS_OPKG_LISTS="$T/lists" \
        CHENGOS_CONFIG_MD5="$T/config.md5" busybox ash -c ". '$SCRIPT'; $1" 2>&1
}

expect_ok()   { if out=$(run_lib "$2"); then ok "$1"; else bad "$1: $out"; fi; }
expect_fail() {
    if out=$(run_lib "$2"); then bad "$1: unexpectedly passed: $out"
    elif [[ -n "${3:-}" && "$out" != *"$3"* ]]; then bad "$1: wrong reason: $out"
    else ok "$1"; fi
}

echo "== storage gate"
mkdir -p "$T/data/chengos" "$T/ram/x" "$T/ntfs" "$T/loop"
ln -s "$T/ram/x" "$T/data/link"
cat > "$T/mounts" <<EOF
/dev/root / ext4 rw 0 0
tmpfs $T/ram tmpfs rw 0 0
/dev/sda1 $T/data ext4 rw,noatime 0 0
/dev/sdb1 $T/ntfs ntfs3 rw 0 0
/dev/loop0 $T/loop f2fs rw 0 0
EOF
expect_ok   "dedicated ext4 mount passes"            "storage_check '$T/data/chengos' 1"
expect_ok   "a not-yet-created dir resolves to its mount" "storage_check '$T/data/chengos/new/deeper' 1"
expect_fail "tmpfs is rejected"                      "storage_check '$T/ram/x' 1" "tmpfs"
expect_fail "a symlink into tmpfs is rejected"       "storage_check '$T/data/link/chengos' 1" "tmpfs"
expect_fail "NTFS is rejected"                       "storage_check '$T/ntfs' 1" "ntfs3"
expect_fail "a loop-backed mount is rejected"        "storage_check '$T/loop' 1" "not a block device"
expect_fail "the root filesystem is rejected"        "storage_check /usr 1" "system mount"
expect_fail "a relative path is rejected"            "storage_check data 1" "absolute"
expect_fail "insufficient free space is rejected"    "storage_check '$T/data/chengos' 999999999" "MB free"

echo "== LAN address"
expect_ok   "LAN IPv4 is returned" \
    "ubus() { echo '{}'; }; jsonfilter() { echo 192.168.1.1; }; [ \"\$(lan_address lan)\" = 192.168.1.1 ]"
expect_fail "no address means no answer, not a wildcard" \
    "ubus() { echo '{}'; }; jsonfilter() { :; }; lan_address lan"
expect_fail "0.0.0.0 is never returned" \
    "ubus() { echo '{}'; }; jsonfilter() { echo 0.0.0.0; }; lan_address lan"

echo "== feed index hash"
mkdir -p "$T/lists"
printf 'Package: libpq\nVersion: 17.5-r3\nSHA256sum: aaa111\n\nPackage: pgsql-server\nSHA256sum: bbb222\n' > "$T/lists/base"
printf 'Package: other\nSHA256sum: ccc333\n' | gzip > "$T/lists/packages"
expect_ok "plain index lookup"   "[ \"\$(feed_sha256 pgsql-server)\" = bbb222 ]"
expect_ok "gzip index lookup"    "[ \"\$(feed_sha256 other)\" = ccc333 ]"
expect_ok "unknown package is empty" "[ -z \"\$(feed_sha256 nope)\" ]"

echo "== firewall drift"
synced=$(printf 'firewall.x=rule\n' | md5sum | cut -d' ' -f1)
echo "$synced  /var/run/config.check/firewall" > "$T/config.md5"
expect_ok   "matching running state is in sync" "uci() { printf 'firewall.x=rule\n'; }; config_in_sync firewall"
expect_fail "edited-but-not-reloaded config is drift" "uci() { printf 'firewall.x=changed\n'; }; config_in_sync firewall"
expect_ok   "a package never reloaded has no baseline" "uci() { :; }; config_in_sync dhcp"

echo "== secrets"
expect_ok "random_hex yields 2 hex chars per byte" "v=\$(random_hex 32); [ \${#v} -eq 64 ] && case \$v in *[!0-9a-f]*) exit 1 ;; esac"
expect_ok "without od (OpenWrt BusyBox) hexdump is used" \
    "have() { [ \"\$1\" != od ] && command -v \"\$1\" >/dev/null; }; v=\$(random_hex 16); [ \${#v} -eq 32 ] && [ \"\$(printf '\\037\\213' | to_hex)\" = 1f8b ]"

echo "== update snapshots and rollback guard"
D="$T/inst"
mkdir -p "$D/pgdata" "$D/releases/0.1.0" "$D/releases/0.2.0" "$D/releases/0.0.9"
echo v1-data > "$D/pgdata/PG_VERSION"
ln -s releases/0.2.0 "$D/current"
expect_ok "snapshot then restore brings the cluster back and keeps the replaced one" "
    snap=\$(snapshot_db '$D' 0.1.0)
    [ -f \"\$snap\" ] || exit 1
    echo migrated > '$D/pgdata/PG_VERSION'
    restore_db '$D' \"\$snap\"
    [ \"\$(cat '$D/pgdata/PG_VERSION')\" = v1-data ] && [ \"\$(cat '$D/pgdata.failed/PG_VERSION')\" = migrated ]"
expect_ok "prune keeps two snapshots and the current + previous releases" "
    for n in 1 2 3; do sleep 1; snapshot_db '$D' old\$n >/dev/null; done
    prune_backups '$D' 0.1.0
    [ \$(ls '$D'/backups/pgdata-*.tar.gz | wc -l) -eq 2 ] && [ -d '$D/releases/0.2.0' ] && [ -d '$D/releases/0.1.0' ] \
        && [ ! -d '$D/releases/0.0.9' ] && [ ! -d '$D/pgdata.failed' ]"
expect_fail "rollback refuses without the explicit data-loss flag" \
    "CHENGOS_DATA_DIR='$D'; id() { echo 0; }; cmd_rollback" "discard-changes-since-update"
expect_fail "rollback refuses when nothing was updated" \
    "CHENGOS_DATA_DIR='$D'; id() { echo 0; }; cmd_rollback --discard-changes-since-update" "no update to roll back"

echo "== release verification"
R="$T/release"
mkdir -p "$R/bin"
printf '#!/bin/sh\necho cheng-api 9.9.9\n' > "$R/bin/cheng-api"; chmod +x "$R/bin/cheng-api"
echo 9.9.9 > "$R/VERSION"
(cd "$R" && sha256sum VERSION bin/cheng-api > SHA256SUMS)
expect_ok   "an intact release verifies" "verify_release '$R'"
echo tampered >> "$R/VERSION"
expect_fail "a tampered release is refused" "verify_release '$R'" "SHA256SUMS"

echo
echo "openwrt appliance smoke: ${pass} passed, ${fail} failed"
[[ "$fail" -eq 0 ]]
