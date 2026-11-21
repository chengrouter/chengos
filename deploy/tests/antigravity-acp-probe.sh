#!/usr/bin/env bash
#
# Antigravity CLI (`agy acp`) token-free protocol probe (plan: coding-agent
# unified permission and Antigravity ACP, stage 0).
#
# Runs the real `agy acp` inside the same Bubblewrap profile as
# antigravity-live-probe.sh (cleared environment, empty HOME, private PID/IPC/
# UTS, no D-Bus, read-only install directory). It sends only `initialize` and
# `session/new` over JSON-RPC stdio, so it signs nothing in, spends no quota and
# never sends a prompt. Output is sanitized and written under --out.
#
# Usage:
#   bash deploy/tests/antigravity-acp-probe.sh --bin /opt/agy/bin/agy --out ./acp-evidence
set -uo pipefail

BIN=""
OUT=""
KEEP=0
usage() {
    sed -n '2,16p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
    exit "${1:-0}"
}
while [[ $# -gt 0 ]]; do
    case "$1" in
        --bin) BIN="${2:-}"; shift 2 ;;
        --out) OUT="${2:-}"; shift 2 ;;
        --keep) KEEP=1; shift ;;
        -h|--help) usage 0 ;;
        *) echo "unknown argument: $1" >&2; usage 2 ;;
    esac
done
[[ -n "$BIN" && -n "$OUT" ]] || usage 2
command -v bwrap >/dev/null || { echo "bwrap is required" >&2; exit 2; }
BIN="$(readlink -f "$BIN")"
[[ -x "$BIN" ]] || { echo "not executable: $BIN" >&2; exit 2; }
INSTALL_DIR="$(dirname "$BIN")"
others="$(find "$INSTALL_DIR" -maxdepth 1 -type f -perm -u+x ! -path "$BIN" | head -1)"
[[ -z "$others" ]] || { echo "install directory holds other executables; copy agy into a dedicated directory" >&2; exit 2; }

mkdir -p "$OUT"
OUT="$(readlink -f "$OUT")"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/agy-acp-probe-XXXXXX")"
cleanup() {
    [[ -n "${ACP_PID:-}" ]] && kill "$ACP_PID" 2>/dev/null
    if [[ "$KEEP" == 0 ]]; then rm -rf "$WORK"; else echo "kept: $WORK"; fi
}
trap cleanup EXIT

SUPPORT_MOUNTS=(/usr /bin /sbin /lib /lib64 /lib32 /libx32 /etc/ld.so.cache /etc/ld.so.conf
    /etc/ld.so.conf.d /etc/alternatives /etc/ssl /etc/ca-certificates /etc/ca-certificates.conf
    /etc/resolv.conf /etc/hosts /etc/nsswitch.conf /etc/localtime)

# sandbox HOME CWD [agy args...] — same profile as the login/spend probes.
sandbox() {
    local home="$1" cwd="$2"
    shift 2
    local args=(--unshare-pid --unshare-ipc --unshare-uts --new-session --die-with-parent
        --unsetenv DBUS_SESSION_BUS_ADDRESS --unsetenv XDG_RUNTIME_DIR)
    local m
    for m in "${SUPPORT_MOUNTS[@]}"; do [[ -e "$m" ]] && args+=(--ro-bind "$m" "$m"); done
    args+=(--proc /proc --dev /dev --tmpfs /tmp
        --ro-bind "$INSTALL_DIR" "$INSTALL_DIR"
        --bind "$home" "$home"
        --bind "$cwd" "$cwd"
        --chdir "$cwd"
        --clearenv
        --setenv PATH /usr/bin:/bin
        --setenv HOME "$home"
        --setenv XDG_CONFIG_HOME "$home/.config"
        --setenv XDG_DATA_HOME "$home/.local/share"
        --setenv XDG_CACHE_HOME "$home/.cache"
        --setenv XDG_STATE_HOME "$home/.local/state"
        --setenv AGY_CLI_DISABLE_AUTO_UPDATE 1
        --setenv LANG C.UTF-8)
    bwrap "${args[@]}" "$BIN" "$@"
}

sanitize() {
    sed -E \
        -e "s#${WORK}#<WORK>#g" \
        -e "s#${INSTALL_DIR}#<INSTALL>#g" \
        -e 's#(https?://[^ "?]+)\?[^ "]*#\1?<QUERY>#g' \
        -e 's#("(access_token|refresh_token|id_token|token|code|email)"[[:space:]]*:[[:space:]]*")[^"]*#\1<REDACTED>#g' \
        -e 's#[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}#<EMAIL>#g'
}
note() { printf '%s\n' "$*" | tee -a "$OUT/summary.txt"; }

: > "$OUT/summary.txt"
mkdir -p "$WORK/home" "$WORK/cwd"; chmod 700 "$WORK/home"
note "agy acp probe $(date -u +%Y-%m-%dT%H:%M:%SZ) version=$(sandbox "$WORK/home" "$WORK/cwd" --version 2>&1 | head -1)"
note "sha512=$(sha512sum "$BIN" | cut -d' ' -f1)"

# A1: the flag inventory of `agy acp` (no spend).
sandbox "$WORK/home" "$WORK/cwd" acp --help 2>&1 | sanitize > "$OUT/acp_help.txt"
for flag in --settings --mode --sandbox --process-per-session --dangerously-skip-permissions --include-default-customizations --ide-mcp-port; do
    if grep -q -- "^  $flag " "$OUT/acp_help.txt"; then note "A1 acp $flag: present"; else note "A1 acp $flag: absent"; fi
done

# A2: JSON-RPC handshake, signed out. initialize, then session/new (no prompt).
coproc ACP { sandbox "$WORK/home" "$WORK/cwd" acp --disable-telemetry 2>"$WORK/acp.err"; }
ACP_PID="$ACP_PID"
exec {ACP_R}<&"${ACP[0]}"
exec {ACP_W}>&"${ACP[1]}"
: > "$WORK/frames.txt"
send() { printf '%s\n' "$1" >&"$ACP_W"; printf '>> %s\n' "$1" >> "$WORK/frames.txt"; }
read_until_id() { # id seconds
    local want="$1" secs="$2" line
    while IFS= read -r -t "$secs" line <&"$ACP_R"; do
        printf '<< %s\n' "$line" >> "$WORK/frames.txt"
        if [[ "$line" == *"\"id\":$want,"* || "$line" == *"\"id\":$want}"* ]]; then return 0; fi
    done
    return 1
}
send '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1,"clientCapabilities":{"fs":{"readTextFile":false,"writeTextFile":false},"terminal":false}}}'
if read_until_id 1 30; then note "A2 initialize: answered"; else note "A2 initialize: no answer within 30s"; fi
send "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"session/new\",\"params\":{\"cwd\":\"$WORK/cwd\",\"mcpServers\":[]}}"
if read_until_id 2 30; then note "A2 session/new: answered"; else note "A2 session/new: no answer within 30s"; fi
exec {ACP_W}>&-
kill "$ACP_PID" 2>/dev/null; wait "$ACP_PID" 2>/dev/null; ACP_PID=""
sanitize < "$WORK/frames.txt" > "$OUT/acp_unauth_frames.jsonl"
sanitize < "$WORK/acp.err" > "$OUT/acp_unauth_stderr.txt"
note "A2 frames recorded: $(grep -c '^<<' "$WORK/frames.txt") responses"
note "A2 error codes seen: $(grep -o '"code":-\?[0-9]*' "$WORK/frames.txt" | sort | uniq -c | tr -s ' ' | tr '\n' ' ')"
note "done. Nothing was signed in; no prompt was sent."
