#!/usr/bin/env bash
#
# Antigravity CLI (`agy acp`) signed-in probe for the items still open after
# the full run. ONE login, ONE process, at most 2 model turns (enforced).
# DISPOSABLE Google account only. The authorization code is typed into this
# terminal and never written to disk or echoed. The login home is deleted on
# exit. Revoke the Google grant by hand afterwards:
#   https://myaccount.google.com/permissions
#
# Coverage:
#   A1  auto mode: one file write, answered reject_once (turn 1)
#   A2  auto mode: one shell command, answered reject_once (turn 2)
#   A3  sandbox project config present before the session: does the
#       "failed to read project file ... GetSandboxConfig" warning go away? (no turn)
#   A4  remote control state after sign-in, with no local override (no turn)
#
# Usage:
#   bash deploy/tests/antigravity-acp-auto-probe.sh --bin /opt/agy/bin/agy --out ./acp-auto --spend
set -uo pipefail

MAX_TURNS=2
BIN=""
OUT=""
SPEND=0
usage() { sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }
while [[ $# -gt 0 ]]; do
    case "$1" in
        --bin) BIN="${2:-}"; shift 2 ;;
        --out) OUT="${2:-}"; shift 2 ;;
        --spend) SPEND=1; shift ;;
        -h|--help) usage 0 ;;
        *) echo "unknown argument: $1" >&2; usage 2 ;;
    esac
done
[[ -n "$BIN" && -n "$OUT" && "$SPEND" == 1 ]] || { echo "--spend is required (this run uses up to $MAX_TURNS model turns)" >&2; usage 2; }
command -v bwrap >/dev/null || { echo "bwrap is required" >&2; exit 2; }
command -v python3 >/dev/null || { echo "python3 is required" >&2; exit 2; }
BIN="$(readlink -f "$BIN")"
[[ -x "$BIN" ]] || { echo "not executable: $BIN" >&2; exit 2; }
INSTALL_DIR="$(dirname "$BIN")"
others="$(find "$INSTALL_DIR" -maxdepth 1 -type f -perm -u+x ! -path "$BIN" | head -1)"
[[ -z "$others" ]] || { echo "install directory holds other executables; copy agy into a dedicated directory" >&2; exit 2; }

mkdir -p "$OUT"
OUT="$(readlink -f "$OUT")"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/agy-acp-auto-XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

SUPPORT_MOUNTS=(/usr /bin /sbin /lib /lib64 /lib32 /libx32 /etc/ld.so.cache /etc/ld.so.conf
    /etc/ld.so.conf.d /etc/alternatives /etc/ssl /etc/ca-certificates /etc/ca-certificates.conf
    /etc/resolv.conf /etc/hosts /etc/nsswitch.conf /etc/localtime)

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
sandbox() {
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
note "agy acp auto probe $(date -u +%Y-%m-%dT%H:%M:%SZ) version=$(sandbox "$LH" "$CWD" --version 2>&1 | head -1)"
note "sha512=$(sha512sum "$BIN" | cut -d' ' -f1)"

# ── Login (one time; code typed here, never echoed) ─────────────────────────
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

# A3 setup: a sandbox project config present before the session (no turn).
mkdir -p "$LH/.gemini/config/projects"
printf '%s\n' '{}' > "$LH/.gemini/config/projects/default-cli-project.json"
note "A3 project config planted: .gemini/config/projects/default-cli-project.json"

ARGV_FILE="$WORK/argv.bin"
sandbox_argv "$LH" "$CWD" > "$ARGV_FILE"
export ARGV_FILE CWD OUT MAX_TURNS
python3 - <<'PY'
import json, os, queue, subprocess, threading, time

ARGV = [a.decode() for a in open(os.environ["ARGV_FILE"], "rb").read().split(b"\0") if a]
CWD, OUT = os.environ["CWD"], os.environ["OUT"]
MAX_TURNS = int(os.environ["MAX_TURNS"])
turns = 0
INIT = {"protocolVersion": 1, "clientCapabilities": {"fs": {"readTextFile": False, "writeTextFile": False}, "terminal": False}}

def note(s):
    with open(os.path.join(OUT, "summary.txt"), "a") as f:
        f.write(s + "\n")

class Proc:
    def __init__(self, label, extra):
        self.label = label
        self.q = queue.Queue()
        self.frames = []
        self.notes = []
        self.nid = 0
        self.p = subprocess.Popen(ARGV + ["acp", "--disable-telemetry"] + extra, stdin=subprocess.PIPE,
                                  stdout=subprocess.PIPE, stderr=open(os.path.join(OUT, f"stderr_{label}.txt"), "a"), bufsize=0)
        threading.Thread(target=self._read, daemon=True).start()
    def _read(self):
        for raw in iter(self.p.stdout.readline, b""):
            line = raw.decode(errors="replace").rstrip("\n")
            self.frames.append("<< " + line)
            try:
                self.q.put(json.loads(line))
            except ValueError:
                self.q.put({"_malformed": line[:200]})
        self.q.put({"_eof": True})
    def send(self, obj):
        line = json.dumps(obj, separators=(",", ":"))
        self.frames.append(">> " + line)
        self.p.stdin.write((line + "\n").encode()); self.p.stdin.flush()
    def request(self, method, params, timeout=240, on_request=None):
        self.nid += 1
        rid = self.nid
        self.send({"jsonrpc": "2.0", "id": rid, "method": method, "params": params})
        end = time.time() + timeout
        while time.time() < end:
            try:
                msg = self.q.get(timeout=max(0.1, end - time.time()))
            except queue.Empty:
                break
            if msg.get("_eof"):
                return {"error": {"message": "eof"}}
            if msg.get("id") == rid and ("result" in msg or "error" in msg):
                return msg
            if "id" in msg and "method" in msg:
                if on_request:
                    on_request(msg)
                else:
                    self.send({"jsonrpc": "2.0", "id": msg["id"], "error": {"code": -32601, "message": "probe: not supported"}})
            else:
                self.notes.append(msg)
        return {"error": {"message": "timeout"}}
    def close(self):
        try:
            self.p.stdin.close()
            self.p.wait(timeout=30)
        except Exception:
            self.p.kill()
        with open(os.path.join(OUT, f"frames_{self.label}.jsonl"), "w") as f:
            f.write("\n".join(self.frames) + "\n")
        with open(os.path.join(OUT, f"notifications_{self.label}.jsonl"), "w") as f:
            f.write("\n".join(json.dumps(n)[:4000] for n in self.notes) + "\n")

def turn(proc, sid, label, text):
    global turns
    turns += 1
    if turns > MAX_TURNS:
        raise SystemExit(f"turn cap of {MAX_TURNS} exceeded; stopping")
    perms = []
    def handle(msg):
        opts = msg.get("params", {}).get("options", [])
        perms.append({"tool": msg["params"]["toolCall"].get("name"),
                      "options": [[o.get("optionId"), o.get("kind")] for o in opts], "answered": "reject_once"})
        opt = next((o["optionId"] for o in opts if o.get("kind") == "reject_once"), None)
        outcome = {"outcome": "selected", "optionId": opt} if opt else {"outcome": "cancelled"}
        proc.send({"jsonrpc": "2.0", "id": msg["id"], "result": {"outcome": outcome}})
    start = len(proc.notes)
    r = proc.request("session/prompt", {"sessionId": sid, "prompt": [{"type": "text", "text": text}]}, on_request=handle)
    tools, agent = {}, []
    for n in proc.notes[start:]:
        u = n.get("params", {}).get("update", {})
        if u.get("sessionUpdate") in ("tool_call", "tool_call_update") and u.get("name"):
            tools[u["toolCallId"]] = (u["name"], u.get("status"))
        if u.get("sessionUpdate") == "agent_message_chunk":
            agent.append(u.get("content", {}).get("text", ""))
    note(f"{label} turn {turns}/{MAX_TURNS}: stop={r.get('result', {}).get('stopReason')} error={r.get('error')}")
    note(f"{label} permission requests: {json.dumps(perms)}")
    note(f"{label} tool calls: {json.dumps(sorted(set(tools.values())))}")
    note(f"{label} agent text: {''.join(agent)[:300]!r}")
    return r

INIT_RESULT = None
p = Proc("auto_main", [])
init = p.request("initialize", INIT)
note(f"A0 initialize: {'ok' if 'result' in init else init.get('error')}")
new = p.request("session/new", {"cwd": CWD, "mcpServers": []})
note(f"A0 session/new: {'ok' if 'result' in new else 'ERROR ' + json.dumps(new.get('error'))}")
sid = new.get("result", {}).get("sessionId")
time.sleep(1)
note(f"A4 remote control state after sign-in is in the CLI log (see cli facts); no local override applied")

if sid:
    mode = p.request("session/set_mode", {"sessionId": sid, "modeId": "auto"})
    note(f"A1 set_mode auto: {'ok' if 'result' in mode else json.dumps(mode.get('error'))}")
    turn(p, sid, "A1 auto write", "Create the file auto.txt containing the word one. Do not run any other command.")
    note(f"A1 auto.txt exists after the turn (reject_once was the answer): {os.path.exists(os.path.join(CWD, 'auto.txt'))}")
    turn(p, sid, "A2 auto command", "Run the shell command: touch auto-cmd.txt")
    note(f"A2 auto-cmd.txt exists after the turn (reject_once was the answer): {os.path.exists(os.path.join(CWD, 'auto-cmd.txt'))}")
p.close()
note(f"done: {turns} model turns used of {MAX_TURNS}")
PY
py_rc=$?
[[ "$py_rc" -eq 0 ]] || note "python client exited $py_rc"

# A3/A4 evidence from the CLI log of the login home (sanitized, relevant lines only).
log_dir="$LH/.gemini/antigravity-cli/log"
if compgen -G "$log_dir/*.log" >/dev/null; then
    grep -hiE "sandbox|project|RemoteControl|remote|customiz|AGENTS|toolPermission|settings|permission|mode" "$log_dir"/*.log \
        | sed -E 's/^[IWE][0-9]{4} [0-9:.]+ +[0-9]+ //' | sanitize | sort -u > "$OUT/cli_log_facts.txt"
    note "A3/A4 CLI log facts recorded: $(wc -l < "$OUT/cli_log_facts.txt") lines (cli_log_facts.txt)"
    note "A3 project-file warning present after planting: $(grep -c 'failed to read project file' "$OUT/cli_log_facts.txt")"
else
    note "A3/A4 no CLI log found in the login home"
fi

for f in "$OUT"/frames_*.jsonl "$OUT"/notifications_*.jsonl "$OUT"/stderr_*.txt "$OUT"/summary.txt; do
    [[ -f "$f" ]] && sanitize < "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done
note "Sanitized. The login home is deleted on exit."
note "NEXT: revoke this disposable account's Antigravity access at https://myaccount.google.com/permissions"
