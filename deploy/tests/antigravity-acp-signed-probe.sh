#!/usr/bin/env bash
#
# Antigravity CLI (`agy acp`) signed-in protocol probe (plan stage 0, signed-in).
#
# DISPOSABLE Google account only. The authorization code is typed into this
# terminal and is never written to disk or echoed. Quota: at most TWO short
# model turns, both in one run. Everything else is token-free.
#
# Steps:
#   L   `agy acp --login` inside the sandbox (interactive; you paste the code)
#   S1  session/new under the stored login; records the effective session state
#   S2  process tree of a bare session (no prompt), with and without
#       --process-per-session
#   T1  settings.json requests review of everything; one file write must then
#       produce a permission request. It is rejected (reject_once) and the
#       file must not exist afterwards.
#   T2  one shell command; the permission request is approved (allow_once),
#       and the command must then run.
#   Two model turns in total. No cancel test here: it was already observed
#       with the correct request id (see the plan, stage 0).
#
# Sanitized frames go to --out; the login home is removed on exit.
#
# Usage:
#   bash deploy/tests/antigravity-acp-signed-probe.sh --bin /opt/agy/bin/agy --out ./acp-signed --spend
set -uo pipefail

BIN=""
OUT=""
SPEND=0
usage() {
    sed -n '2,24p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
    exit "${1:-0}"
}
while [[ $# -gt 0 ]]; do
    case "$1" in
        --bin) BIN="${2:-}"; shift 2 ;;
        --out) OUT="${2:-}"; shift 2 ;;
        --spend) SPEND=1; shift ;;
        -h|--help) usage 0 ;;
        *) echo "unknown argument: $1" >&2; usage 2 ;;
    esac
done
[[ -n "$BIN" && -n "$OUT" && "$SPEND" == 1 ]] || { echo "--spend is required (this run uses two model turns)" >&2; usage 2; }
command -v bwrap >/dev/null || { echo "bwrap is required" >&2; exit 2; }
command -v python3 >/dev/null || { echo "python3 is required" >&2; exit 2; }
BIN="$(readlink -f "$BIN")"
[[ -x "$BIN" ]] || { echo "not executable: $BIN" >&2; exit 2; }
INSTALL_DIR="$(dirname "$BIN")"
others="$(find "$INSTALL_DIR" -maxdepth 1 -type f -perm -u+x ! -path "$BIN" | head -1)"
[[ -z "$others" ]] || { echo "install directory holds other executables; copy agy into a dedicated directory" >&2; exit 2; }

mkdir -p "$OUT"
OUT="$(readlink -f "$OUT")"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/agy-acp-signed-XXXXXX")"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

SUPPORT_MOUNTS=(/usr /bin /sbin /lib /lib64 /lib32 /libx32 /etc/ld.so.cache /etc/ld.so.conf
    /etc/ld.so.conf.d /etc/alternatives /etc/ssl /etc/ca-certificates /etc/ca-certificates.conf
    /etc/resolv.conf /etc/hosts /etc/nsswitch.conf /etc/localtime)

# The bwrap argv up to and including the binary (NUL-separated). Same profile
# as antigravity-live-probe.sh: cleared env, private namespaces, no D-Bus.
sandbox_argv() {
    local home="$1" cwd="$2"
    local args=(bwrap --unshare-pid --unshare-ipc --unshare-uts --new-session --die-with-parent
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
        --setenv LANG C.UTF-8
        "$BIN")
    printf '%s\0' "${args[@]}"
}
sandbox() { # home cwd [agy args...]
    local home="$1" cwd="$2"; shift 2
    local argv=(); while IFS= read -r -d '' a; do argv+=("$a"); done < <(sandbox_argv "$home" "$cwd")
    "${argv[@]}" "$@"
}

sanitize() {
    sed -E \
        -e "s#${WORK}#<WORK>#g" \
        -e "s#${INSTALL_DIR}#<INSTALL>#g" \
        -e 's#(https?://[^ "?]+)\?[^ "]*#\1?<QUERY>#g' \
        -e 's#("(access_token|refresh_token|id_token|token|code|email)"[[:space:]]*:[[:space:]]*")[^"]*#\1<REDACTED>#g' \
        -e 's#4/[A-Za-z0-9._~+/-]{16,}#<AUTH_CODE>#g' \
        -e 's#[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}#<EMAIL>#g' \
        -e 's#ya29\.[A-Za-z0-9._-]+#<TOKEN>#g' \
        -e 's#1//[A-Za-z0-9._-]+#<TOKEN>#g'
}
note() { printf '%s\n' "$*" | tee -a "$OUT/summary.txt"; }

: > "$OUT/summary.txt"
LH="$WORK/home"; CWD="$WORK/cwd"
mkdir -p "$LH" "$CWD"; chmod 700 "$LH"
note "agy acp signed-in probe $(date -u +%Y-%m-%dT%H:%M:%SZ) version=$(sandbox "$LH" "$CWD" --version 2>&1 | head -1)"
note "sha512=$(sha512sum "$BIN" | cut -d' ' -f1)"

# ── L: login (the operator pastes the code locally; nothing is echoed) ──────
coproc LOGINPROC { sandbox "$LH" "$CWD" acp --login --disable-telemetry 2>&1; }
LOGIN_PID="$LOGINPROC_PID"
exec {LR}<&"${LOGINPROC[0]}"
exec {LW}>&"${LOGINPROC[1]}"
url=""
while IFS= read -r -t 60 line <&"$LR"; do
    if [[ "$line" =~ ^[[:space:]]*(https://accounts\.google\.com/[^[:space:]]+)[[:space:]]*$ ]]; then url="${BASH_REMATCH[1]}"; fi
    [[ "$line" == *"press Enter"* ]] && break
done
[[ -n "$url" ]] || { note "L no authorization URL printed"; kill "$LOGIN_PID" 2>/dev/null; exit 1; }
echo; echo "Open this URL in a browser, sign in with the DISPOSABLE account, and consent:"; echo "$url"; echo
read -r -p "L: paste the bare code here (not in chat): " answer
printf '%s\n' "$answer" >&"$LW"; exec {LW}>&-; unset answer
while IFS= read -r -t 120 line <&"$LR"; do :; done
exec {LR}<&-
wait "$LOGIN_PID"; rc=$?
if [[ "$rc" -ne 0 || ! -f "$LH/.gemini/antigravity-cli/antigravity-oauth-token" ]]; then
    note "L login failed (exit $rc) or no token artifact; stopping before any model turn"
    exit 1
fi
note "L login: exit 0; token artifact present (metadata only)"
# Ceiling under test (plan 2.5 option a): review everything, no pre-allowed rules.
mkdir -p "$LH/.gemini/antigravity-cli"
printf '%s\n' '{"toolPermission":"request-review","permissions":{"allow":[],"deny":[]}}' > "$LH/.gemini/antigravity-cli/settings.json"
note "L settings.json written for the ceiling test (toolPermission=request-review)"

# ── S1, S2, T1, T2: JSON-RPC client over the sandboxed agy acp ──────────────
ARGV_FILE="$WORK/argv.bin"
sandbox_argv "$LH" "$CWD" > "$ARGV_FILE"
export ARGV_FILE CWD OUT WORK
python3 - <<'PY'
import json, os, queue, subprocess, sys, threading, time

ARGV = open(os.environ["ARGV_FILE"], "rb").read().split(b"\0")
ARGV = [a.decode() for a in ARGV if a]
CWD = os.environ["CWD"]
OUT = os.environ["OUT"]
frames, notes = [], []
inbox = queue.Queue()

def spawn(extra):
    p = subprocess.Popen(ARGV + ["acp", "--disable-telemetry"] + extra,
                         stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=open(os.path.join(OUT, "acp_signed_stderr.txt"), "a"), bufsize=0)
    threading.Thread(target=reader, args=(p,), daemon=True).start()
    return p

def reader(p):
    for raw in iter(p.stdout.readline, b""):
        line = raw.decode(errors="replace").rstrip("\n")
        frames.append("<< " + line)
        try:
            inbox.put(json.loads(line))
        except ValueError:
            inbox.put({"_malformed": line[:200]})
    inbox.put({"_eof": True})

class Client:
    def __init__(self, proc):
        self.p = proc
        self.next_id = 0
    def send(self, obj):
        line = json.dumps(obj, separators=(",", ":"))
        frames.append(">> " + line)
        self.p.stdin.write((line + "\n").encode())
        self.p.stdin.flush()
    def request(self, method, params, timeout=240, on_request=None):
        self.next_id += 1
        rid = self.next_id
        self.send({"jsonrpc": "2.0", "id": rid, "method": method, "params": params})
        deadline = time.time() + timeout
        while time.time() < deadline:
            try:
                msg = inbox.get(timeout=max(0.1, deadline - time.time()))
            except queue.Empty:
                break
            if msg.get("_eof"):
                return {"error": {"message": "eof"}}
            if "id" in msg and msg.get("id") == rid and ("result" in msg or "error" in msg):
                return msg
            if "id" in msg and "method" in msg:
                if on_request:
                    on_request(msg)
                else:
                    self.send({"jsonrpc": "2.0", "id": msg["id"], "error": {"code": -32601, "message": "not supported by probe"}})
            else:
                notes.append(msg)
        return {"error": {"message": "timeout"}}

def option_for(msg, kind):
    for o in msg.get("params", {}).get("options", []):
        if o.get("kind") == kind:
            return o.get("optionId")
    return None

def count_descendants(pid):
    # bwrap (--unshare-pid) forks an init; agy is a descendant, not a direct child.
    parent = {}
    for d in os.listdir("/proc"):
        if d.isdigit():
            try:
                with open(f"/proc/{d}/stat") as f:
                    parent[int(d)] = int(f.read().rsplit(")", 1)[1].split()[1])
            except (OSError, IndexError, ValueError):
                pass
    found, frontier = set(), [pid]
    while frontier:
        cur = frontier.pop()
        kids = [k for k, ppid in parent.items() if ppid == cur and k not in found]
        found.update(kids)
        frontier.extend(kids)
    return len(found)

summary = []
def note(s):
    summary.append(s)
    with open(os.path.join(OUT, "summary.txt"), "a") as f:
        f.write(s + "\n")

init_params = {"protocolVersion": 1, "clientCapabilities": {"fs": {"readTextFile": False, "writeTextFile": False}, "terminal": False}}

# S2a: bare session, default transport.
p = spawn([])
c = Client(p)
init = c.request("initialize", init_params)
note(f"S0 initialize: {'ok' if 'result' in init else init.get('error')}")
new = c.request("session/new", {"cwd": CWD, "mcpServers": []})
note(f"S1 session/new: {'ok' if 'result' in new else 'ERROR ' + json.dumps(new.get('error'))}")
session_id = new.get("result", {}).get("sessionId")
time.sleep(1)
note(f"S2 descendants of the sandbox (default, no prompt): {count_descendants(p.pid)}")
note("S1 session result keys: " + ",".join(sorted(new.get("result", {}).keys())))

def responder(decision_for_call):
    # Answers a permission request with the option of the given kind; a
    # missing kind is answered cancelled (never approved).
    seen = []
    def handle(msg):
        kind = decision_for_call(msg)
        seen.append({"kind_requested": kind, "params_keys": sorted(msg.get("params", {}).keys())})
        opt = option_for(msg, kind)
        outcome = {"outcome": "selected", "optionId": opt} if opt else {"outcome": "cancelled"}
        c.send({"jsonrpc": "2.0", "id": msg["id"], "result": {"outcome": outcome}})
    return seen, handle

if session_id:
    # T1 (ceiling test): settings.json asks for review of everything. A file
    # write must now produce a permission request. The probe rejects it, and
    # the file must not exist afterwards.
    seen1, h1 = responder(lambda m: "reject_once")
    t1 = c.request("session/prompt", {"sessionId": session_id, "prompt": [{"type": "text", "text":
        "Create the file ceiling.txt containing the word one. Do not run any other command."}]},
        on_request=h1)
    note(f"T1 prompt: {json.dumps(t1.get('result', t1.get('error')))[:300]}")
    note(f"T1 permission requests: {len(seen1)} {json.dumps(seen1)}")
    note(f"T1 ceiling.txt exists after reject: {os.path.exists(os.path.join(CWD, 'ceiling.txt'))}")

    # T2 (approve path): a shell command is approved once; it must then run.
    seen2, h2 = responder(lambda m: "allow_once")
    t2 = c.request("session/prompt", {"sessionId": session_id, "prompt": [{"type": "text", "text":
        "Run the shell command: true"}]}, on_request=h2)
    note(f"T2 prompt: {json.dumps(t2.get('result', t2.get('error')))[:300]}")
    note(f"T2 permission requests: {len(seen2)} {json.dumps(seen2)}")

try:
    c.send({"jsonrpc": "2.0", "method": "session/close", "params": {"sessionId": session_id}}) if session_id else None
except Exception:
    pass
p.stdin.close()
p.wait(timeout=30)

# S2b: the same bare session with --process-per-session (no prompt, no quota).
p2 = spawn(["--process-per-session"])
c2 = Client(p2)
c2.request("initialize", init_params)
new2 = c2.request("session/new", {"cwd": CWD, "mcpServers": []})
note(f"S2b session/new with --process-per-session: {'ok' if 'result' in new2 else 'ERROR ' + json.dumps(new2.get('error'))}")
time.sleep(1)
note(f"S2b descendants of the sandbox (--process-per-session, no prompt): {count_descendants(p2.pid)}")
p2.stdin.close()
p2.wait(timeout=30)

with open(os.path.join(OUT, "acp_signed_frames.jsonl"), "w") as f:
    f.write("\n".join(frames) + "\n")
with open(os.path.join(OUT, "acp_signed_notifications.jsonl"), "w") as f:
    f.write("\n".join(json.dumps(n)[:2000] for n in notes) + "\n")
PY
py_rc=$?
[[ "$py_rc" -eq 0 ]] || note "python client exited $py_rc"

# Sanitize all recorded frames and stderr before anything is kept.
for f in acp_signed_frames.jsonl acp_signed_notifications.jsonl acp_signed_stderr.txt; do
    [[ -f "$OUT/$f" ]] && sanitize < "$OUT/$f" > "$OUT/$f.tmp" && mv "$OUT/$f.tmp" "$OUT/$f"
done
note "done. Frames sanitized; the login home was removed on exit."
