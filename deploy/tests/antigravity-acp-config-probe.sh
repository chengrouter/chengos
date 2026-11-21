#!/usr/bin/env bash
#
# Antigravity CLI (`agy acp`) token-free configuration probe.
#
# No sign-in, no prompt, no model turn, no Google grant. Each case starts the
# real `agy acp` in the Bubblewrap profile with a fresh empty home (or a home
# with one planted file), sends `initialize` and `session/new` (the latter is
# answered "Authentication required"), then reads the CLI's own log for the
# facts each case is about. Output is sanitized and written under --out.
#
# Cases:
#   C1  baseline: empty home; what the CLI logs at startup
#   C2  settings.json present: is toolPermission logged at startup (no login)?
#   C3  project config present: does the sandbox-config warning go away?
#   C4  --include-default-customizations=false: what is logged about customizations
#   C5  the config.json the CLI writes by itself (names and keys only)
#
# Usage:
#   bash deploy/tests/antigravity-acp-config-probe.sh --bin /opt/agy/bin/agy --out ./acp-config
set -uo pipefail

BIN=""
OUT=""
usage() { sed -n '2,17p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }
while [[ $# -gt 0 ]]; do
    case "$1" in
        --bin) BIN="${2:-}"; shift 2 ;;
        --out) OUT="${2:-}"; shift 2 ;;
        -h|--help) usage 0 ;;
        *) echo "unknown argument: $1" >&2; usage 2 ;;
    esac
done
[[ -n "$BIN" && -n "$OUT" ]] || usage 2
command -v bwrap >/dev/null || { echo "bwrap is required" >&2; exit 2; }
command -v python3 >/dev/null || { echo "python3 is required" >&2; exit 2; }
BIN="$(readlink -f "$BIN")"
[[ -x "$BIN" ]] || { echo "not executable: $BIN" >&2; exit 2; }
INSTALL_DIR="$(dirname "$BIN")"
others="$(find "$INSTALL_DIR" -maxdepth 1 -type f -perm -u+x ! -path "$BIN" | head -1)"
[[ -z "$others" ]] || { echo "install directory holds other executables; copy agy into a dedicated directory" >&2; exit 2; }

mkdir -p "$OUT"
OUT="$(readlink -f "$OUT")"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/agy-acp-config-XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

SUPPORT_MOUNTS=(/usr /bin /sbin /lib /lib64 /lib32 /libx32 /etc/ld.so.cache /etc/ld.so.conf
    /etc/ld.so.conf.d /etc/alternatives /etc/ssl /etc/ca-certificates /etc/ca-certificates.conf
    /etc/resolv.conf /etc/hosts /etc/nsswitch.conf /etc/localtime)

# bwrap argv for one case: a home and one working directory, NUL-separated.
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

sanitize() {
    sed -E \
        -e "s#${WORK}#<WORK>#g" \
        -e "s#${INSTALL_DIR}#<INSTALL>#g" \
        -e 's#(https?://[^ "?]+)\?[^ "]*#\1?<QUERY>#g' \
        -e 's#[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}#<EMAIL>#g'
}
note() { printf '%s\n' "$*" | tee -a "$OUT/summary.txt"; }

: > "$OUT/summary.txt"
note "agy acp config probe (token-free) $(date -u +%Y-%m-%dT%H:%M:%SZ) sha512=$(sha512sum "$BIN" | cut -d' ' -f1)"

# One case: a fresh home (optionally with a planted file), the acp handshake,
# then the CLI log facts. Args: name, relative path to plant (or -), content (or -), extra agy flags...
run_case() {
    local name="$1" plant_path="$2" plant_body="$3"; shift 3
    local home="$WORK/$name/home" cwd="$WORK/$name/cwd"
    mkdir -p "$home" "$cwd"; chmod 700 "$home"
    if [[ "$plant_path" != "-" ]]; then
        mkdir -p "$home/$(dirname "$plant_path")"
        printf '%s\n' "$plant_body" > "$home/$plant_path"
    fi
    local argvf="$WORK/$name/argv.bin"
    sandbox_argv "$home" "$cwd" > "$argvf"
    ARGV_FILE="$argvf" HOME_DIR="$home" CWD_DIR="$cwd" CASE="$name" OUT="$OUT" EXTRA="$(printf '%s\n' "$@")" \
        python3 - <<'PY'
import json, os, subprocess, sys, time, glob
argv = [a.decode() for a in open(os.environ["ARGV_FILE"], "rb").read().split(b"\0") if a]
extra = [e for e in os.environ.get("EXTRA", "").split("\n") if e]
case, home, cwd, out = os.environ["CASE"], os.environ["HOME_DIR"], os.environ["CWD_DIR"], os.environ["OUT"]
p = subprocess.Popen(argv + ["acp", "--disable-telemetry"] + extra, stdin=subprocess.PIPE,
                     stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=0)
def send(o):
    p.stdin.write((json.dumps(o) + "\n").encode()); p.stdin.flush()
def read_id(rid, secs=25):
    end = time.time() + secs
    while time.time() < end:
        line = p.stdout.readline()
        if not line:
            return None
        try:
            m = json.loads(line.decode(errors="replace"))
        except ValueError:
            continue
        if m.get("id") == rid and ("result" in m or "error" in m):
            return m
    return None
send({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": 1, "clientCapabilities": {}}})
init = read_id(1)
send({"jsonrpc": "2.0", "id": 2, "method": "session/new", "params": {"cwd": cwd, "mcpServers": []}})
new = read_id(2)
time.sleep(1)
try:
    p.stdin.close()
except Exception:
    pass
try:
    p.wait(timeout=20)
except subprocess.TimeoutExpired:
    p.kill()
rec = {"initialize": "ok" if init and "result" in init else (init or {}).get("error"),
       "session/new": "ok" if new and "result" in new else (new or {}).get("error")}
with open(os.path.join(out, f"{case}_handshake.json"), "w") as f:
    json.dump(rec, f, indent=1)
logs = sorted(glob.glob(os.path.join(home, ".gemini/antigravity-cli/log/*.log")))
lines = []
for lp in logs:
    with open(lp, errors="replace") as f:
        lines += [l.rstrip("\n") for l in f]
with open(os.path.join(out, f"{case}_log.txt"), "w") as f:
    f.write("\n".join(lines) + "\n")
with open(os.path.join(out, "summary.txt"), "a") as f:
    f.write(f"{case}: initialize={rec['initialize'] if isinstance(rec['initialize'], str) else 'error'}, session/new={rec['session/new'] if isinstance(rec['session/new'], str) else json.dumps(rec['session/new'])[:160]}, log lines={len(lines)}\n")
PY
    # Keep only the facts each case is about, sanitized.
    local log="$OUT/${name}_log.txt"
    [[ -f "$log" ]] && sanitize < "$log" | grep -iE "setting|toolPermission|permission|customiz|AGENTS|sandbox|remote|telemetry|config" \
        | sed -E 's/^[IWE][0-9]{4} [0-9:.]+ +[0-9]+ //' | sort -u > "$OUT/${name}_facts.txt"
    rm -f "$log"
    if [[ -f "$home/.gemini/config/config.json" ]]; then
        python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); print("keys:", sorted(d.keys())); print(json.dumps(d)[:400])' \
            "$home/.gemini/config/config.json" > "$OUT/${name}_config_shape.txt" 2>&1
    fi
}

run_case C1_baseline - -
run_case C2_settings_request_review .gemini/antigravity-cli/settings.json '{"toolPermission":"request-review","permissions":{"allow":[],"deny":[]}}'
run_case C3_project_config .gemini/config/projects/default-cli-project.json '{}'
run_case C4_customizations_off - - --include-default-customizations=false
run_case C5_remote_control_off .gemini/config/config.json '{"remoteControl":false}'

note "done. Token-free: no sign-in, no grant, no model turn."
