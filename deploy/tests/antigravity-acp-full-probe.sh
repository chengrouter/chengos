#!/usr/bin/env bash
#
# Antigravity CLI (`agy acp`) full protocol probe (plan stage 0, signed-in).
#
# ONE login, ONE run. DISPOSABLE Google account only. The authorization code is
# typed into this terminal and never written to disk or echoed. At most
# MAX_TURNS (8) model turns are sent; the script refuses a ninth. Everything
# recorded is sanitized. The login home is deleted on exit. Revoke the Google
# grant by hand afterwards: https://myaccount.google.com/permissions
#
# Coverage:
#   Q1  settings.json ceiling: CLI log facts (token-free) and a write under it
#   Q2  session/set_mode to plan, accept-edits, default; a write in each mode
#   Q3  process tree: default and --process-per-session (token-free)
#   Q4  repository customizations: AGENTS.md with and without
#       --include-default-customizations=false
#   Q5  --sandbox launch, one approved command
#   Q6  one command refused with reject_once; it must not run
#   Q7  pinned auth method and invalid mode id (token-free)
#
# Usage:
#   bash deploy/tests/antigravity-acp-full-probe.sh --bin /opt/agy/bin/agy --out ./acp-full --spend
set -uo pipefail

BIN=""
OUT=""
SPEND=0
usage() {
    sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
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
[[ -n "$BIN" && -n "$OUT" && "$SPEND" == 1 ]] || { echo "--spend is required (this run uses up to 8 model turns)" >&2; usage 2; }
command -v bwrap >/dev/null || { echo "bwrap is required" >&2; exit 2; }
command -v python3 >/dev/null || { echo "python3 is required" >&2; exit 2; }
BIN="$(readlink -f "$BIN")"
[[ -x "$BIN" ]] || { echo "not executable: $BIN" >&2; exit 2; }
INSTALL_DIR="$(dirname "$BIN")"
others="$(find "$INSTALL_DIR" -maxdepth 1 -type f -perm -u+x ! -path "$BIN" | head -1)"
[[ -z "$others" ]] || { echo "install directory holds other executables; copy agy into a dedicated directory" >&2; exit 2; }

mkdir -p "$OUT"
OUT="$(readlink -f "$OUT")"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/agy-acp-full-XXXXXX")"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

SUPPORT_MOUNTS=(/usr /bin /sbin /lib /lib64 /lib32 /libx32 /etc/ld.so.cache /etc/ld.so.conf
    /etc/ld.so.conf.d /etc/alternatives /etc/ssl /etc/ca-certificates /etc/ca-certificates.conf
    /etc/resolv.conf /etc/hosts /etc/nsswitch.conf /etc/localtime)

# bwrap argv up to and including the binary, NUL-separated. Same profile as the
# other probes; each given working directory is bound read-write.
sandbox_argv() {
    local home="$1"; shift
    local first="$1"
    local args=(bwrap --unshare-pid --unshare-ipc --unshare-uts --new-session --die-with-parent
        --unsetenv DBUS_SESSION_BUS_ADDRESS --unsetenv XDG_RUNTIME_DIR)
    local m d
    for m in "${SUPPORT_MOUNTS[@]}"; do [[ -e "$m" ]] && args+=(--ro-bind "$m" "$m"); done
    args+=(--proc /proc --dev /dev --tmpfs /tmp
        --ro-bind "$INSTALL_DIR" "$INSTALL_DIR"
        --bind "$home" "$home")
    for d in "$@"; do args+=(--bind "$d" "$d"); done
    args+=(--chdir "$first"
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
sandbox() { # home cwd1 cwd2 [agy args...]
    local home="$1" c1="$2" c2="$3"; shift 3
    local argv=(); while IFS= read -r -d '' a; do argv+=("$a"); done < <(sandbox_argv "$home" "$c1" "$c2")
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
LH="$WORK/home"; CWD1="$WORK/cwd1"; CWD2="$WORK/cwd2"
mkdir -p "$LH" "$CWD1" "$CWD2"; chmod 700 "$LH"
# Repository customization marker, only in cwd2 (Q4).
printf '%s\n' 'Always answer with the single word MANGO.' > "$CWD2/AGENTS.md"
note "agy acp full probe $(date -u +%Y-%m-%dT%H:%M:%SZ) version=$(sandbox "$LH" "$CWD1" "$CWD2" --version 2>&1 | head -1)"
note "sha512=$(sha512sum "$BIN" | cut -d' ' -f1)"

# ── Login (one time) ────────────────────────────────────────────────────────
coproc LOGINPROC { sandbox "$LH" "$CWD1" "$CWD2" acp --login --disable-telemetry 2>&1; }
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

# Q1 ceiling under test (plan 2.5 option a).
mkdir -p "$LH/.gemini/antigravity-cli"
printf '%s\n' '{"toolPermission":"request-review","permissions":{"allow":[],"deny":[]}}' > "$LH/.gemini/antigravity-cli/settings.json"
note "Q1 settings.json written (toolPermission=request-review, empty allow/deny)"

ARGV_FILE="$WORK/argv.bin"
sandbox_argv "$LH" "$CWD1" "$CWD2" > "$ARGV_FILE"
export ARGV_FILE CWD1 CWD2 OUT
python3 - <<'PY'
import json, os, queue, subprocess, threading, time

ARGV = [a.decode() for a in open(os.environ["ARGV_FILE"], "rb").read().split(b"\0") if a]
CWD1, CWD2, OUT = os.environ["CWD1"], os.environ["CWD2"], os.environ["OUT"]
MAX_TURNS = 8
turns = 0
INIT = {"protocolVersion": 1, "clientCapabilities": {"fs": {"readTextFile": False, "writeTextFile": False}, "terminal": False}}

def note(s):
    with open(os.path.join(OUT, "summary.txt"), "a") as f:
        f.write(s + "\n")

def descendants(pid):
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
        kids = [k for k, pp in parent.items() if pp == cur and k not in found]
        found.update(kids); frontier.extend(kids)
    return len(found)

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

def decide_reject(msg): return "reject_once"
def decide_allow(msg): return "allow_once"

def turn(proc, sid, label, text, decide):
    global turns
    turns += 1
    if turns > MAX_TURNS:
        raise SystemExit(f"turn cap of {MAX_TURNS} exceeded; stopping")
    perms = []
    def handle(msg):
        kind = decide(msg)
        opts = msg.get("params", {}).get("options", [])
        perms.append({"tool": msg["params"]["toolCall"].get("name"),
                      "options": [[o.get("optionId"), o.get("kind")] for o in opts],
                      "answered": kind})
        opt = next((o["optionId"] for o in opts if o.get("kind") == kind), None)
        outcome = {"outcome": "selected", "optionId": opt} if opt else {"outcome": "cancelled"}
        proc.send({"jsonrpc": "2.0", "id": msg["id"], "result": {"outcome": outcome}})
    start = len(proc.notes)
    r = proc.request("session/prompt", {"sessionId": sid, "prompt": [{"type": "text", "text": text}]}, on_request=handle)
    updates = proc.notes[start:]
    tools = {}
    agent = []
    for n in updates:
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

def exists(name):
    return os.path.exists(os.path.join(CWD1, name))

# ── Q3 (token-free): process tree with --process-per-session ───────────────
p0 = Proc("q3_per_session", ["--process-per-session"])
p0.request("initialize", INIT)
n0 = p0.request("session/new", {"cwd": CWD1, "mcpServers": []})
note(f"Q3 session/new with --process-per-session: {'ok' if 'result' in n0 else 'ERROR ' + json.dumps(n0.get('error'))}")
time.sleep(1)
note(f"Q3 descendants with --process-per-session (no prompt): {descendants(p0.p.pid)}")
p0.close()

# ── Q1, Q2, Q6, Q7 in the default process ───────────────────────────────────
p1 = Proc("p1_main", [])
init1 = p1.request("initialize", INIT)
auth = [m.get("id") for m in init1.get("result", {}).get("authMethods", [])]
note(f"Q7 initialize authMethods offered: {auth}")
note("Q7 method ChengFlow pins: oauth-personal; this run only records what the server offers (no authenticate call is sent)")
new1 = p1.request("session/new", {"cwd": CWD1, "mcpServers": []})
note(f"Q1 session/new: {'ok' if 'result' in new1 else 'ERROR ' + json.dumps(new1.get('error'))}")
sid = new1.get("result", {}).get("sessionId")
note(f"Q2 session initial modes: {json.dumps(new1.get('result', {}).get('modes', {}).get('currentModeId'))}")
time.sleep(1)
note(f"Q3 descendants in the default process (no prompt): {descendants(p1.p.pid)}")

if sid:
    bad = p1.request("session/set_mode", {"sessionId": sid, "modeId": "not-a-mode"})
    note(f"Q7 set_mode with an invalid id: {json.dumps(bad.get('error', bad.get('result')))[:200]}")

    for mode, name, label in [("plan", "plan.txt", "Q2 plan"), ("accept-edits", "acc.txt", "Q2 accept-edits"), ("default", "def.txt", "Q1 default with settings")]:
        r = p1.request("session/set_mode", {"sessionId": sid, "modeId": mode})
        note(f"{label}: set_mode {mode} -> {'ok' if 'result' in r else json.dumps(r.get('error'))}")
        turn(p1, sid, label, f"Create the file {name} containing the word one. Do not run any other command.", decide_reject)
        note(f"{label}: {name} exists after the turn (reject_once was the answer): {exists(name)}")

    turn(p1, sid, "Q6 command refused", "Run the shell command: touch cmd-deny-marker.txt", decide_reject)
    note(f"Q6 cmd-deny-marker.txt exists after reject_once: {exists('cmd-deny-marker.txt')}")
p1.close()

# ── Q4: customizations on and off (cwd2 has AGENTS.md) ─────────────────────
QUESTION = "Which single word were you told to always answer with, if any? Reply with only that word."
p2 = Proc("q4_customizations_on", [])
p2.request("initialize", INIT)
n2 = p2.request("session/new", {"cwd": CWD2, "mcpServers": []})
if "result" in n2:
    turn(p2, n2["result"]["sessionId"], "Q4 customizations on", QUESTION, decide_reject)
else:
    note(f"Q4 on: session/new ERROR {json.dumps(n2.get('error'))}")
p2.close()

p3 = Proc("q4_customizations_off", ["--include-default-customizations=false"])
i3 = p3.request("initialize", INIT)
if "result" in i3:
    n3 = p3.request("session/new", {"cwd": CWD2, "mcpServers": []})
    if "result" in n3:
        turn(p3, n3["result"]["sessionId"], "Q4 customizations off", QUESTION, decide_reject)
    else:
        note(f"Q4 off: session/new ERROR {json.dumps(n3.get('error'))}")
else:
    note(f"Q4 off: flag refused at initialize: {json.dumps(i3.get('error'))}")
p3.close()

# ── Q5: --sandbox launch, one approved command ─────────────────────────────
p4 = Proc("q5_sandbox", ["--sandbox"])
i4 = p4.request("initialize", INIT)
if "result" in i4:
    n4 = p4.request("session/new", {"cwd": CWD1, "mcpServers": []})
    if "result" in n4:
        turn(p4, n4["result"]["sessionId"], "Q5 sandbox approved command", "Run the shell command: echo sandboxed > sb.txt", decide_allow)
        note(f"Q5 sb.txt exists after allow_once: {exists('sb.txt')}")
    else:
        note(f"Q5 sandbox: session/new ERROR {json.dumps(n4.get('error'))}")
else:
    note(f"Q5 sandbox: flag refused at initialize: {json.dumps(i4.get('error'))}")
p4.close()

note(f"done: {turns} model turns used of {MAX_TURNS}")
PY
py_rc=$?
[[ "$py_rc" -eq 0 ]] || note "python client exited $py_rc"

# Q1 evidence: which settings lines the CLI logged for this login home.
log_dir="$LH/.gemini/antigravity-cli/log"
if compgen -G "$log_dir/*.log" >/dev/null; then
    grep -hiE "setting|toolPermission|permission|agentMode|sandbox|customiz|AGENTS|hook|plugin|mcp" "$log_dir"/*.log \
        | sed -E 's/^[IWE][0-9]{4} [0-9:.]+ +[0-9]+ //' | sanitize | sort -u > "$OUT/cli_log_facts.txt"
    note "Q1 CLI log facts recorded: $(wc -l < "$OUT/cli_log_facts.txt") lines (cli_log_facts.txt)"
else
    note "Q1 no CLI log found in the login home"
fi

# Sanitize every recorded file before it is kept.
for f in "$OUT"/frames_*.jsonl "$OUT"/notifications_*.jsonl "$OUT"/stderr_*.txt "$OUT"/summary.txt; do
    [[ -f "$f" ]] && sanitize < "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done
note "Sanitized. The login home is deleted on exit."
note "NEXT: revoke this disposable account's Antigravity access at https://myaccount.google.com/permissions"
