#!/bin/sh
#
# Runs ON THE ROUTER (BusyBox ash), streamed by probe.sh over SSH.
#
# Read-only fact collection for the appliance plan's Phase 0 decisions
# (D2-D7). It changes no configuration, installs nothing and restarts
# nothing. The only optional write is `refresh-feeds`, which downloads the
# package index into its tmpfs cache.
#
# Usage (as `sh -s -- [refresh-feeds]`)
set -u
REFRESH_FEEDS=${1:-}

section() { printf '\n=== %s ===\n' "$1"; }
show() { [ -r "$1" ] && { printf -- '--- %s\n' "$1"; cat "$1"; }; }
have() { command -v "$1" >/dev/null 2>&1; }

section "identity (D2)"
printf 'board_name: %s\n' "$(cat /tmp/sysinfo/board_name 2>/dev/null || echo unknown)"
printf 'model: %s\n' "$(cat /tmp/sysinfo/model 2>/dev/null || echo unknown)"
have ubus && ubus call system board 2>/dev/null
printf 'uname: %s\n' "$(uname -a)"
printf 'cpus: %s\n' "$(grep -c '^processor' /proc/cpuinfo)"

section "firmware and feeds (D3)"
show /etc/openwrt_release
show /etc/os-release
for f in /etc/apk/repositories /etc/apk/repositories.d/*.list /etc/opkg/distfeeds.conf /etc/opkg/customfeeds.conf; do
    show "$f"
done

section "memory (D2)"
grep -E '^(MemTotal|MemAvailable|SwapTotal|SwapFree):' /proc/meminfo
show /proc/swaps
for z in /sys/block/zram*; do
    [ -d "$z" ] && printf '%s disksize=%s algorithm=%s\n' "$z" \
        "$(cat "$z/disksize" 2>/dev/null)" "$(cat "$z/comp_algorithm" 2>/dev/null)"
done

section "storage"
df -h 2>/dev/null
printf -- '--- inodes\n'
df -i 2>/dev/null || echo 'df -i unsupported'
printf -- '--- mounts\n'
grep -vE ' (proc|sysfs|devpts|cgroup2?|debugfs|bpf|pstore|securityfs|tracefs|configfs) ' /proc/mounts
have block && { printf -- '--- block info\n'; block info 2>/dev/null; }
printf -- '--- block devices\n'
for b in /sys/block/*; do
    n=${b##*/}
    case "$n" in loop*|ram*|zram*) continue ;; esac
    printf '%s size_512b=%s rotational=%s removable=%s\n' "$n" \
        "$(cat "$b/size" 2>/dev/null)" "$(cat "$b/queue/rotational" 2>/dev/null)" "$(cat "$b/removable" 2>/dev/null)"
done

section "package manager (D4)"
if have apk; then printf 'apk: %s\n' "$(apk --version 2>/dev/null | head -n1)"; else echo 'apk: absent'; fi
if have opkg; then echo 'opkg: present'; else echo 'opkg: absent'; fi

if [ "$REFRESH_FEEDS" = "refresh-feeds" ]; then
    section "refreshing package index (tmpfs cache only)"
    if have apk; then apk update 2>&1 | tail -n 5; elif have opkg; then opkg update 2>&1 | tail -n 5; fi
fi

section "PostgreSQL availability (D5)"
if have apk; then
    apk search 'postgresql*' 'pgsql*' 'libpq*' 2>/dev/null | sort -u || echo 'apk search failed (run with --refresh-feeds?)'
elif have opkg; then
    opkg list 2>/dev/null | grep -iE '^(postgresql|pgsql|libpq)' || echo 'no match (run with --refresh-feeds?)'
fi
have postgres && postgres --version
have pg_ctl && pg_ctl --version

section "Redis/Valkey and containers (D6)"
for p in valkey-server redis-server dockerd docker containerd; do
    if have "$p"; then printf '%s: %s\n' "$p" "$(command -v "$p")"; else printf '%s: absent\n' "$p"; fi
done
printf 'cgroup: %s\n' "$(grep -E ' cgroup2? ' /proc/mounts | awk '{print $3":"$2}' | tr '\n' ' ')"

section "rpcd uci apply/confirm (D7)"
if have ubus; then
    ubus -v list uci 2>/dev/null || echo 'ubus uci object not available'
    ls -la /etc/rpcd/ /usr/share/rpcd/acl.d/ 2>/dev/null | head -n 40
else
    echo 'ubus absent'
fi

section "network"
have ubus && ubus call network.interface dump 2>/dev/null \
    | grep -E '"(interface|up|device|l3_device|proto|address|mask)"' | head -n 60
ip -4 addr show 2>/dev/null | grep -E '^[0-9]+:|inet '

section "time"
printf 'date_utc: %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
printf 'uptime_s: %s\n' "$(cut -d' ' -f1 /proc/uptime)"
for p in ntpd sysntpd chronyd; do pidof "$p" >/dev/null 2>&1 && printf '%s running\n' "$p"; done
[ -e /dev/rtc0 ] && echo 'rtc: /dev/rtc0 present' || echo 'rtc: none'
have uci && uci -q show system.ntp 2>/dev/null

section "sysupgrade"
show /etc/sysupgrade.conf
ls /lib/upgrade/keep.d/ 2>/dev/null

section "services"
ls /etc/init.d/
