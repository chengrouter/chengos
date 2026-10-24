#!/bin/sh
#
# Runs ON THE ROUTER (BusyBox ash), streamed by deploy.sh over SSH.
#
# Finds TCP listeners from /proc instead of `ss`/`netstat`, which BusyBox
# images may omit or build without -p.
#
# Usage (as `sh -s -- ARGS`):
#   list  PORT              print "PID EXE" for every listener on PORT
#   clear PORT BIN [SECS]   stop listeners on PORT whose executable is BIN
#                           (a stale non-procd copy, e.g. one started in the
#                           foreground over SSH); refuse if another program
#                           holds the port. Exit 0 once the port is free.
#   wait  PORT BIN SECS     wait until BIN listens on PORT; exit 1 on timeout
set -u

listener_inodes() {
    hex=$(printf '%04X' "$1")
    # local_address is HEXIP:HEXPORT; state 0A is LISTEN; field 10 is inode.
    awk -v suffix=":${hex}" '
        $4 == "0A" && substr($2, length($2) - length(suffix) + 1) == suffix { print $10 }
    ' /proc/net/tcp /proc/net/tcp6 2>/dev/null | sort -u
}

listeners() {
    inodes=$(listener_inodes "$1")
    [ -n "$inodes" ] || return 0
    for fd in /proc/[0-9]*/fd/*; do
        link=$(readlink "$fd" 2>/dev/null) || continue
        case "$link" in
            socket:\[*\]) ;;
            *) continue ;;
        esac
        inode=${link#socket:[}
        inode=${inode%]}
        for want in $inodes; do
            if [ "$inode" = "$want" ]; then
                pid=${fd#/proc/}
                pid=${pid%%/*}
                exe=$(readlink "/proc/${pid}/exe" 2>/dev/null || echo '?')
                echo "${pid} ${exe}"
            fi
        done
    done | sort -u
}

# A replaced binary shows as "PATH (deleted)"; a staged upload as PATH.new.
is_our_binary() {
    case "$1" in
        "$2"|"$2 (deleted)"|"$2.new"|"$2.new (deleted)") return 0 ;;
    esac
    return 1
}

# True when every listener on PORT is BIN (also true when there are none).
only_ours() {
    listeners "$1" | {
        ok=0
        while read -r pid exe; do is_our_binary "$exe" "$2" || ok=1; done
        exit "$ok"
    }
}

# True when at least one listener on PORT is BIN.
any_ours() {
    listeners "$1" | {
        ok=1
        while read -r pid exe; do is_our_binary "$exe" "$2" && ok=0; done
        exit "$ok"
    }
}

cmd_clear() {
    port=$1 bin=$2 secs=${3:-10}
    found=$(listeners "$port")
    [ -n "$found" ] || return 0
    echo "$found" | while read -r pid exe; do
        if is_our_binary "$exe" "$bin"; then
            echo "stopping stale ${bin} (pid ${pid}) still holding port ${port}" >&2
            kill -TERM "$pid" 2>/dev/null
        else
            echo "port ${port} is held by another program: pid ${pid} ${exe}" >&2
        fi
    done
    i=0
    while [ "$i" -lt "$secs" ]; do
        [ -n "$(listeners "$port")" ] || return 0
        if ! only_ours "$port" "$bin"; then
            echo "refusing to continue: port ${port} belongs to another program" >&2
            return 1
        fi
        sleep 1
        i=$((i + 1))
    done
    listeners "$port" | while read -r pid exe; do
        is_our_binary "$exe" "$bin" && kill -KILL "$pid" 2>/dev/null
    done
    sleep 1
    [ -z "$(listeners "$port")" ] || { echo "port ${port} is still in use" >&2; return 1; }
}

cmd_wait() {
    port=$1 bin=$2 secs=$3
    i=0
    while [ "$i" -lt "$secs" ]; do
        any_ours "$port" "$bin" && return 0
        sleep 1
        i=$((i + 1))
    done
    echo "${bin} is not listening on port ${port} after ${secs}s" >&2
    return 1
}

case "${1:-}" in
    list)  listeners "$2" ;;
    clear) cmd_clear "$2" "$3" "${4:-10}" ;;
    wait)  cmd_wait "$2" "$3" "$4" ;;
    *) echo "usage: list PORT | clear PORT BIN [SECS] | wait PORT BIN SECS" >&2; exit 2 ;;
esac
