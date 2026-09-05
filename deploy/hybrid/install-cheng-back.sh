#!/usr/bin/env bash
#
# Install `cheng back` as a per-user service, so the background agent survives
# reboots, logouts and crashes.
#
# # Why this exists
#
# A scheduled task that targets a machine whose agent is not running does not
# fail — it skips, quietly, every time. A person who starts `cheng back` in a
# terminal has an agent until the next reboot, and no signal at all when it
# stops. This turns that into the operating system's problem.
#
# # Two decisions this script makes for you
#
# 1. **Credentials must unlock without a human.** A service starts before
#    anyone logs in, so an auth store that needs an interactive unlock leaves
#    the agent running but unauthenticated — connected to nothing. The
#    `auth_storage` policy is therefore pinned to `host-bound` (or
#    `encrypted-file`) *before* the unit is written, and the script refuses to
#    continue if the token is not usable non-interactively.
#
# 2. **The served roots live in the config file, not the unit.** `back_roots`
#    in `~/.config/cheng/config.json` is what `cheng back` reads when no
#    `--root` is given, so changing which directories are served is an edit to
#    a JSON file — not a reinstall, a unit rewrite, and a daemon-reload.
#
# Usage:
#   ./install-cheng-back.sh --root /home/me/works [--root /data/pages:ro]
#   ./install-cheng-back.sh --status
#   ./install-cheng-back.sh --uninstall
set -euo pipefail

SERVICE_NAME="cheng-back"
CHENG_BIN="${CHENG_BIN:-$(command -v cheng || true)}"
CONFIG_PATH="${CHENG_CONFIG:-$HOME/.config/cheng/config.json}"
AUTH_STORAGE="${CHENG_AUTH_STORAGE:-host-bound}"
ROOTS=()
ACTION="install"

log()  { printf '\033[0;36m[cheng-back]\033[0m %s\n' "$*"; }
warn() { printf '\033[0;33m[cheng-back]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[0;31m[cheng-back]\033[0m %s\n' "$*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --root)      ROOTS+=("$2"); shift 2 ;;
    --root=*)    ROOTS+=("${1#*=}"); shift ;;
    --bin)       CHENG_BIN="$2"; shift 2 ;;
    --auth-storage) AUTH_STORAGE="$2"; shift 2 ;;
    --status)    ACTION="status"; shift ;;
    --uninstall) ACTION="uninstall"; shift ;;
    -h|--help)   sed -n '2,30p' "$0"; exit 0 ;;
    *)           die "unknown argument: $1" ;;
  esac
done

platform() {
  case "$(uname -s)" in
    Linux)  echo linux ;;
    Darwin) echo macos ;;
    *)      die "unsupported platform: $(uname -s) (Linux and macOS only)" ;;
  esac
}

# ---------------------------------------------------------------------------
# Config: the roots and the auth policy
# ---------------------------------------------------------------------------

write_config() {
  [[ ${#ROOTS[@]} -gt 0 ]] || return 0
  mkdir -p "$(dirname "$CONFIG_PATH")"
  [[ -f "$CONFIG_PATH" ]] || echo '{}' > "$CONFIG_PATH"

  # python3 rather than jq: it is present on every machine that can run the
  # CLI, and this must not add a dependency to installing a service.
  CHENG_CFG="$CONFIG_PATH" CHENG_AUTH="$AUTH_STORAGE" python3 - "${ROOTS[@]}" <<'PY'
import json, os, sys

path = os.environ["CHENG_CFG"]
with open(path) as handle:
    try:
        config = json.load(handle)
    except json.JSONDecodeError:
        raise SystemExit(f"{path} is not valid JSON; fix or remove it first")

config["back_roots"] = list(sys.argv[1:])
# The service starts before anyone logs in, so an auth store that needs an
# interactive unlock would leave the agent running and signed out.
config["auth_storage"] = os.environ["CHENG_AUTH"]
with open(path, "w") as handle:
    json.dump(config, handle, indent=2)
    handle.write("\n")
PY
  log "wrote back_roots (${#ROOTS[@]}) and auth_storage=$AUTH_STORAGE to $CONFIG_PATH"
}

check_auth() {
  # A unit that starts and immediately cannot authenticate is worse than no
  # unit: the machine looks served and every scheduled task skips.
  # `sessions` is the cheapest authenticated call: it needs a usable token and
  # nothing else, so a success here is exactly the property the unit needs.
  if ! "$CHENG_BIN" sessions --auth-storage "$AUTH_STORAGE" >/dev/null 2>&1; then
    warn "the CLI cannot authenticate non-interactively with auth_storage=$AUTH_STORAGE."
    warn "sign in once from a terminal (run '$CHENG_BIN chat' and complete the login,"
    warn "or export CHENG_TOKEN), then re-run this script."
    die "refusing to install a service that would run signed out"
  fi
  log "credentials verified: the service can authenticate without a person"
}

# ---------------------------------------------------------------------------
# Linux — systemd user unit
# ---------------------------------------------------------------------------

UNIT_PATH="$HOME/.config/systemd/user/${SERVICE_NAME}.service"

install_systemd() {
  mkdir -p "$(dirname "$UNIT_PATH")"
  cat > "$UNIT_PATH" <<UNIT
[Unit]
Description=ChengFlow background workspace agent
Documentation=https://github.com/chengos/chengflow
# Network-dependent, but not network-blocked: the agent's own reconnect loop
# handles a link that is not up yet, and After= on a user unit is advisory.
After=network-online.target

[Service]
Type=simple
# The roots come from ~/.config/cheng/config.json (back_roots), so changing
# which directories are served is a config edit, not a service reinstall.
ExecStart=${CHENG_BIN} back
Restart=always
RestartSec=10
# A crash loop must not spin: after five failures in five minutes systemd
# gives up and leaves a state an operator can actually see.
StartLimitBurst=5
StartLimitIntervalSec=300
Environment=RUST_LOG=info

[Install]
WantedBy=default.target
UNIT
  log "wrote $UNIT_PATH"

  systemctl --user daemon-reload
  systemctl --user enable --now "$SERVICE_NAME"

  # Without lingering, the user manager stops at logout and takes the agent
  # with it — which is exactly the case this script exists to prevent.
  if command -v loginctl >/dev/null 2>&1; then
    if loginctl enable-linger "$USER" 2>/dev/null; then
      log "lingering enabled: the agent keeps running while you are logged out"
    else
      warn "could not enable lingering (needs sudo): run"
      warn "  sudo loginctl enable-linger $USER"
      warn "otherwise the agent stops when you log out and scheduled tasks skip"
    fi
  fi
}

status_systemd()    { systemctl --user status "$SERVICE_NAME" --no-pager || true; }
uninstall_systemd() {
  systemctl --user disable --now "$SERVICE_NAME" 2>/dev/null || true
  rm -f "$UNIT_PATH"
  systemctl --user daemon-reload
  log "removed $UNIT_PATH"
}

# ---------------------------------------------------------------------------
# macOS — launchd agent
# ---------------------------------------------------------------------------

PLIST_PATH="$HOME/Library/LaunchAgents/com.chengos.cheng-back.plist"

install_launchd() {
  mkdir -p "$(dirname "$PLIST_PATH")" "$HOME/Library/Logs"
  cat > "$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.chengos.cheng-back</string>
  <key>ProgramArguments</key>
  <array>
    <string>${CHENG_BIN}</string>
    <string>back</string>
  </array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>EnvironmentVariables</key>
  <dict><key>RUST_LOG</key><string>info</string></dict>
  <key>StandardOutPath</key><string>${HOME}/Library/Logs/cheng-back.log</string>
  <key>StandardErrorPath</key><string>${HOME}/Library/Logs/cheng-back.err.log</string>
</dict>
</plist>
PLIST
  log "wrote $PLIST_PATH"
  launchctl unload "$PLIST_PATH" 2>/dev/null || true
  launchctl load -w "$PLIST_PATH"
  log "loaded; logs at ~/Library/Logs/cheng-back.log"
}

status_launchd()    { launchctl list | grep -i cheng-back || echo "not loaded"; }
uninstall_launchd() {
  launchctl unload "$PLIST_PATH" 2>/dev/null || true
  rm -f "$PLIST_PATH"
  log "removed $PLIST_PATH"
}

# ---------------------------------------------------------------------------

PLATFORM="$(platform)"

case "$ACTION" in
  status)
    [[ "$PLATFORM" == linux ]] && status_systemd || status_launchd
    ;;
  uninstall)
    [[ "$PLATFORM" == linux ]] && uninstall_systemd || uninstall_launchd
    ;;
  install)
    [[ -n "$CHENG_BIN" && -x "$CHENG_BIN" ]] \
      || die "cheng binary not found; pass --bin /path/to/cheng or put it on PATH"
    if [[ ${#ROOTS[@]} -eq 0 ]] && ! grep -q '"back_roots"' "$CONFIG_PATH" 2>/dev/null; then
      die "no roots: pass --root /path (repeatable, ':ro' suffix for read-only)"
    fi
    write_config
    check_auth
    [[ "$PLATFORM" == linux ]] && install_systemd || install_launchd
    log "done. The agent now starts on boot and restarts on failure."
    log "Scheduled tasks targeting this machine will find it served."
    ;;
esac
