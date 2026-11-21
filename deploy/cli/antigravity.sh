#!/usr/bin/env bash
# Antigravity CLI (agy) task-mode installer adapter, dispatched by cli/setup.sh
# (Antigravity plan, Step 8).
#
# Never runs `agy install` (it edits shell profiles) and never uses
# ~/.local/bin: each version lives alone in <cli root>/antigravity/versions/
# <version>/bin/agy, because the sandbox mounts the binary's directory
# read-only. The vendor manifest gives version, url and sha512 but no
# signature or release date, so nothing is ever installed as "latest": the
# operator names the version, and the approved sha512 is recorded and
# re-checked by --check/--repair (trust on first use).
set -euo pipefail

SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIB_DIR="${SETUP_DIR}/../lib"
for _lib in env-file.sh cli-common.sh; do
    [[ -f "${LIB_DIR}/${_lib}" ]] || { echo "Missing ${LIB_DIR}/${_lib}; refresh deployment scripts" >&2; exit 1; }
    # shellcheck source=/dev/null
    source "${LIB_DIR}/${_lib}"
done
unset _lib

AGY_ENV_SECTION="Coding agent (Antigravity CLI) - managed by chengos.sh setup-cli"
# Used when CHENG_CODING_AGENT_ANTIGRAVITY_ALLOWED_RULES has never been set:
# read-only git and the usual check/test commands, agy rule syntax.
AGY_DEFAULT_ALLOWED_RULES='command(git status) command(git diff) command(git log) command(regex:cargo (check|test)) command(regex:pnpm (test|lint))'
SHARED_DIR="$(cd "${SETUP_DIR}/.." && pwd)"
MODE=""
EXACT_VERSION=""
REUSE_BIN=""
MANIFEST_BASE="${CHENGOS_ANTIGRAVITY_MANIFEST_BASE:-}"
PINNED_SHA512=""
ACTION="setup"
PRUNE_APPLY=false
SKIP_BACKEND_PROBE=false
MANAGED_AUTH_REQ=""
ALLOWED_RULES="" ALLOWED_RULES_SET=false
DISALLOWED_RULES="" DISALLOWED_RULES_SET=false
MODELS="" MODELS_SET=false
AGY_MODE="" AGY_MODE_SET=false
SETUP_LANG="${CHENGOS_LANG:-en}"
export CLI_NONINTERACTIVE="${CLI_NONINTERACTIVE:-false}"
export CLI_INSTALL_DEPS="${CLI_INSTALL_DEPS:-false}"

usage() {
    cat <<'EOF_USAGE'
Usage: setup.sh antigravity [options]

  --shared-dir DIR          Installation directory holding .env
  --mode native|docker      Deployment mode (Antigravity requires native)
  --bin PATH                Copy an existing native agy binary into a dedicated
                            versions directory (never used in place)
  --version X.Y.Z           Download this exact version from the vendor manifest
                            (<base>/manifests/<platform>.json); the manifest must
                            name this version. There is no "latest" default.
  --manifest-base URL       Vendor manifest base (https). Default:
                            $CHENGOS_ANTIGRAVITY_MANIFEST_BASE
  --sha512 HEX              Pin the expected sha512 out of band (refused on mismatch)
  --skip-backend-probe      Activate after local checks only (recorded)
  --check                   Read-only status: binary, isolation self-test, managed auth
  --repair                  Reconcile installer records with .env (sha512 re-checked)
  --prune [--yes]           Preview or delete unprotected managed versions
  --reconfigure             Change the settings below, keeping the installed binary
  --non-interactive         Never prompt
  --lang zh|en              Prompt language

Settings (setup or --reconfigure; a setting not given keeps its value):
  --enable-managed-auth     Let users connect their Google account in Settings ->
                            Credentials (CHENG_CODING_AGENT_ANTIGRAVITY_MANAGED_AUTH_ENABLED)
  --disable-managed-auth    Turn that off again
  --allowed-rules RULES     agy permission rules runs may use without asking, e.g.
                            'command(git status) command(regex:cargo (check|test))';
                            '' clears. Absent key: read-only git and test defaults
  --disallowed-rules RULES  Extra denials (web, browser and image tools are always denied)
  --models LIST             Model slugs a node may select (from `agy models`); '' = default
  --agent-mode MODE         accept-edits (default) or plan; auto is never accepted
EOF_USAGE
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --shared-dir) SHARED_DIR="${2:?--shared-dir needs a value}"; shift 2 ;;
        --mode) MODE="${2:?--mode needs a value}"; shift 2 ;;
        --version) EXACT_VERSION="${2:?--version needs a value}"; shift 2 ;;
        --bin) REUSE_BIN="${2:?--bin needs a value}"; shift 2 ;;
        --manifest-base) MANIFEST_BASE="${2:?--manifest-base needs a value}"; shift 2 ;;
        --sha512) PINNED_SHA512="${2:?--sha512 needs a value}"; shift 2 ;;
        --skip-backend-probe) SKIP_BACKEND_PROBE=true; shift ;;
        --enable-managed-auth|--disable-managed-auth)
            _req="${1#--}"; _req="${_req%-managed-auth}"
            [[ -z "$MANAGED_AUTH_REQ" || "$MANAGED_AUTH_REQ" == "$_req" ]] || {
                echo "--enable-managed-auth and --disable-managed-auth conflict" >&2; exit 2;
            }
            MANAGED_AUTH_REQ="$_req"; unset _req; shift ;;
        --allowed-rules) ALLOWED_RULES="${2?--allowed-rules needs a value}"; ALLOWED_RULES_SET=true; shift 2 ;;
        --disallowed-rules) DISALLOWED_RULES="${2?--disallowed-rules needs a value}"; DISALLOWED_RULES_SET=true; shift 2 ;;
        --models) MODELS="${2?--models needs a value}"; MODELS_SET=true; shift 2 ;;
        --agent-mode) AGY_MODE="${2:?--agent-mode needs a value}"; AGY_MODE_SET=true; shift 2 ;;
        --reconfigure) ACTION="reconfigure"; shift ;;
        --check) ACTION="check"; shift ;;
        --repair) ACTION="repair"; shift ;;
        --prune) ACTION="prune"; shift ;;
        --yes) PRUNE_APPLY=true; shift ;;
        --install-deps) CLI_INSTALL_DEPS=true; shift ;;
        --non-interactive) CLI_NONINTERACTIVE=true; shift ;;
        --lang) SETUP_LANG="${2:?--lang needs a value}"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
    esac
done

if [[ "$PRUNE_APPLY" == true && "$ACTION" != prune ]]; then
    cli_err "--yes is only valid with --prune"; exit 2
fi
if [[ -n "$EXACT_VERSION" && ! "$EXACT_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "--version must be an exact version (X.Y.Z)" >&2; exit 2
fi
if [[ -n "$REUSE_BIN" && -n "$EXACT_VERSION" ]]; then
    echo "--bin cannot be combined with --version" >&2; exit 2
fi
if [[ -n "$PINNED_SHA512" && ! "$PINNED_SHA512" =~ ^[0-9a-f]{128}$ ]]; then
    echo "--sha512 must be 128 lowercase hex characters" >&2; exit 2
fi
if [[ "$AGY_MODE_SET" == true && "$AGY_MODE" != accept-edits && "$AGY_MODE" != plan ]]; then
    echo "--agent-mode must be accept-edits or plan (auto is never accepted)" >&2; exit 2
fi
if [[ "$ACTION" == reconfigure && ( -n "$REUSE_BIN" || -n "$EXACT_VERSION" ) ]]; then
    echo "--reconfigure keeps the installed binary; it cannot be combined with --bin or --version" >&2; exit 2
fi
if [[ "$ACTION" == check || "$ACTION" == repair || "$ACTION" == prune ]] \
    && [[ -n "$MANAGED_AUTH_REQ" || "$ALLOWED_RULES_SET" == true || "$DISALLOWED_RULES_SET" == true \
          || "$MODELS_SET" == true || "$AGY_MODE_SET" == true ]]; then
    echo "settings flags apply to setup or --reconfigure only" >&2; exit 2
fi
if [[ "$ACTION" == setup && -z "$REUSE_BIN" && -z "$EXACT_VERSION" ]]; then
    echo "name the binary: --bin PATH or --version X.Y.Z (there is no 'latest': the vendor manifest carries no signature or release date)" >&2
    exit 2
fi

[[ -d "$SHARED_DIR" ]] || { cli_err "no installation directory: ${SHARED_DIR}"; exit 2; }
SHARED_DIR="$(cd "$SHARED_DIR" && pwd)"
if [[ -z "$MODE" ]]; then
    MODE="native"
    for _mf in "${SHARED_DIR}/.chengos_install_mode" "${SHARED_DIR}/../.chengos_install_mode"; do
        if [[ -f "$_mf" ]]; then MODE="$(tr -d '[:space:]' < "$_mf")"; break; fi
    done
    unset _mf
fi
case "$MODE" in native|docker) ;; *) cli_err "--mode must be native or docker"; exit 2 ;; esac

agy_versions_dir() { printf '%s/antigravity/versions' "$(cli_root "$1")"; }
agy_version_dir() { printf '%s/%s' "$(agy_versions_dir "$1")" "$2"; }
agy_bin_path() { printf '%s/bin/agy' "$(agy_version_dir "$1" "$2")"; }
_agy_sha512() { sha512sum "$1" | awk '{print $1}'; }

# linux_amd64 | linux_arm64, with _musl on musl hosts (F13).
agy_platform() {
    local arch libc=""
    case "$(uname -s)/$(uname -m)" in
        Linux/x86_64) arch=amd64 ;;
        Linux/aarch64|Linux/arm64) arch=arm64 ;;
        *) cli_err "the Antigravity CLI is supported on Linux x86_64 and arm64 only (Bubblewrap)"; return 1 ;;
    esac
    getconf GNU_LIBC_VERSION 2>/dev/null | grep -q '^glibc ' || libc="_musl"
    AGY_PLATFORM="linux_${arch}${libc}"
}

# agy_probe_local BIN [EXPECTED_VERSION] — native ELF for this machine, and
# `--version` in an empty environment and a throwaway HOME.
agy_probe_local() {
    local bin="$1" expected="${2:-}" machine want out probe_home
    [[ -f "$bin" && -x "$bin" ]] || { cli_err "${bin} is not an executable file"; return 1; }
    [[ "$(head -c4 "$bin" | od -An -tx1 | tr -d ' \n')" == "7f454c46" ]] || {
        cli_err "${bin} is not a native ELF binary"; return 1;
    }
    machine="$(od -An -tx1 -j18 -N2 "$bin" 2>/dev/null | tr -d ' \n')"
    case "$(uname -m)" in x86_64) want=3e00 ;; aarch64|arm64) want=b700 ;; *) want="" ;; esac
    [[ -z "$want" || "$machine" == "$want" ]] || { cli_err "${bin} is not built for $(uname -m)"; return 1; }
    probe_home="$(mktemp -d)" || return 1
    if ! out="$(env -i PATH=/usr/bin:/bin HOME="$probe_home" AGY_CLI_DISABLE_AUTO_UPDATE=1 \
        timeout 30 "$bin" --version 2>&1)"; then
        rm -rf -- "$probe_home"
        cli_err "agy --version failed: ${out:0:240}"
        return 1
    fi
    rm -rf -- "$probe_home"
    [[ "$out" =~ ([0-9]+\.[0-9]+\.[0-9]+) ]] || { cli_err "agy did not report a version"; return 1; }
    AGY_PROBED_VERSION="${BASH_REMATCH[1]}"
    if [[ -n "$expected" && "$AGY_PROBED_VERSION" != "$expected" ]]; then
        cli_err "binary reports version ${AGY_PROBED_VERSION}, expected ${expected}"
        return 1
    fi
    cli_log "Local probes passed: native agy ${AGY_PROBED_VERSION}"
}

# agy_fetch_version VERSION OUT — downloads through the vendor manifest and
# verifies its sha512 (and the operator's pin, when given).
agy_fetch_version() {
    local version="$1" out="$2" manifest url expected mv code
    [[ "$MANIFEST_BASE" =~ ^https://[^[:space:]]+$ ]] || {
        cli_err "--version needs --manifest-base https://... (or CHENGOS_ANTIGRAVITY_MANIFEST_BASE)"; return 1;
    }
    manifest="${WORK}/agy-manifest.json"
    code="$(curl -sS --proto '=https' --tlsv1.2 --max-time 120 -w '%{http_code}' -o "$manifest" \
        "${MANIFEST_BASE%/}/manifests/${AGY_PLATFORM}.json")" || return 1
    [[ "$code" == 200 ]] || { cli_err "vendor manifest returned HTTP ${code}"; return 1; }
    read -r mv url expected < <(python3 -I -c '
import json, sys
d = json.load(open(sys.argv[1], encoding="utf-8"))
print(d["version"], d["url"], d["sha512"])' "$manifest") || { cli_err "vendor manifest is malformed"; return 1; }
    [[ "$mv" == "$version" ]] || {
        cli_err "the vendor manifest offers ${mv}, not the requested ${version}; nothing was changed"; return 1;
    }
    [[ "$url" =~ ^https://[^[:space:]]+$ && "$expected" =~ ^[0-9a-f]{128}$ ]] || {
        cli_err "vendor manifest url or sha512 is not acceptable"; return 1;
    }
    if [[ -n "$PINNED_SHA512" && "$PINNED_SHA512" != "$expected" ]]; then
        cli_err "the vendor sha512 differs from --sha512; nothing was changed"; return 1
    fi
    code="$(curl -sS --proto '=https' --tlsv1.2 --max-time 600 -w '%{http_code}' -o "$out" "$url")" || return 1
    [[ "$code" == 200 ]] || { cli_err "agy download returned HTTP ${code}"; return 1; }
    [[ "$(_agy_sha512 "$out")" == "$expected" ]] || { cli_err "agy download does not match the manifest sha512"; return 1; }
    cli_log "agy ${version} downloaded; sha512 matches the vendor manifest (transfer integrity only: no vendor signature exists)"
}

_agy_flag() {
    case "$(envf_get "$1" "$2" 2>/dev/null || true)" in
        1|true|TRUE|True|yes|YES|Yes) printf 'true' ;;
        *) printf 'false' ;;
    esac
}

agy_managed_auth_notice() {
    {
        echo ""
        echo "  Antigravity Google login (Settings -> Credentials) lets each user connect their own"
        echo "  personal Google account to this server. Before turning it on:"
        echo "    - the login grants broad Google scopes, including cloud-platform: a stored refresh"
        echo "      token is valuable, and a host compromise exposes the user's Google Cloud access;"
        echo "    - Google's Antigravity terms may limit automated or server-side use;"
        echo "    - Workspace accounts are not supported; each user consents before logging in;"
        echo "    - the backend keeps the provider off unless its keyring isolation self-test passes."
        echo "  Terms: https://antigravity.google/terms"
    } >&2
}

agy_managed_auth_decision() {
    local env_file="$1" current
    current="$(_agy_flag "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_MANAGED_AUTH_ENABLED)"
    case "$MANAGED_AUTH_REQ" in
        enable) agy_managed_auth_notice; printf 'true'; return ;;
        disable)
            [[ "$current" == true ]] && cli_warn "Google logins users already connected stay stored, but no run can use them until the switch is on again"
            printf 'false'; return ;;
    esac
    if [[ "$current" == true ]]; then printf 'true'; return; fi
    if cli_can_prompt; then
        agy_managed_auth_notice
        if cli_confirm "  Let users connect their Google account in Credentials? [y/N]: " n; then
            printf 'true'; return
        fi
    fi
    printf 'false'
}

agy_collect_settings() {
    local env_file="$1"
    AGY_SETTING_KEYS=(
        "CHENG_CODING_AGENT_ANTIGRAVITY_MANAGED_AUTH_ENABLED=$(agy_managed_auth_decision "$env_file")"
    )
    if [[ "$ALLOWED_RULES_SET" != true ]] \
        && ! envf_get "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_ALLOWED_RULES >/dev/null 2>&1; then
        ALLOWED_RULES="$AGY_DEFAULT_ALLOWED_RULES"
        ALLOWED_RULES_SET=true
        cli_log "allowing the default read-only and test commands: ${ALLOWED_RULES}"
    fi
    [[ "$ALLOWED_RULES_SET" == true ]] && AGY_SETTING_KEYS+=("CHENG_CODING_AGENT_ANTIGRAVITY_ALLOWED_RULES=${ALLOWED_RULES}")
    [[ "$DISALLOWED_RULES_SET" == true ]] && AGY_SETTING_KEYS+=("CHENG_CODING_AGENT_ANTIGRAVITY_DISALLOWED_RULES=${DISALLOWED_RULES}")
    [[ "$MODELS_SET" == true ]] && AGY_SETTING_KEYS+=("CHENG_CODING_AGENT_ANTIGRAVITY_MODELS=${MODELS}")
    [[ "$AGY_MODE_SET" == true ]] && AGY_SETTING_KEYS+=("CHENG_CODING_AGENT_ANTIGRAVITY_MODE=${AGY_MODE}")
    return 0
}

# Runs the backend's token-free probe: `--version` plus the keyring
# isolation self-test through the production launcher. Prints its report.
agy_backend_probe() {
    local shared="$1" env_file="$2"; shift 2
    local api="${shared}/bin/cheng-api" out rc work
    if [[ ! -x "$api" ]] || ! "$api" admin --help 2>/dev/null | grep -q 'antigravity'; then
        cli_err "installed cheng-api lacks the Antigravity probe; update ChengOS or explicitly pass --skip-backend-probe"
        return 2
    fi
    work="$(mktemp -d)" || return 1
    set +e
    out="$(cd "$work" && set -a && source "$env_file" && set +a && \
        for kv in "$@"; do export "$kv"; done && \
        "$api" admin coding-agent-probe --provider antigravity --timeout-secs 60 2>&1)"
    rc=$?
    set -e
    rm -rf -- "$work"
    printf '%s\n' "$out" | sed 's/^/    /'
    AGY_PROBE_ISOLATION=failed
    [[ "$out" == *"isolation:   ok"* ]] && AGY_PROBE_ISOLATION=ok
    [[ $rc -eq 0 && "$out" == *"result: ok"* ]]
}

agy_status() {
    local shared="$1" env_file enabled version bin recorded rc=0
    env_file="$(envf_canonical "${shared}/.env")"
    [[ -f "$env_file" ]] || { cli_err "no ${env_file}"; return 1; }
    enabled="$(envf_get "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_ENABLED 2>/dev/null || true)"
    version="$(envf_get "$env_file" CHENGOS_ANTIGRAVITY_VERSION 2>/dev/null || true)"
    bin="$(envf_get "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_BIN 2>/dev/null || true)"
    echo "Antigravity CLI task provider: ${enabled:-off}"
    echo "  version:       ${version:-<not managed>}"
    echo "  binary:        ${bin:-<not configured>}"
    echo "  allowed rules: $(envf_get "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_ALLOWED_RULES 2>/dev/null || true)"
    echo "  models:        $(envf_get "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_MODELS 2>/dev/null || printf '<account default>')"
    echo "  agent mode:    $(envf_get "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_MODE 2>/dev/null || printf 'accept-edits')"
    if [[ "${enabled,,}" != "true" && "${enabled,,}" != "1" && "${enabled,,}" != "yes" ]]; then
        echo "  managed auth:  $(_agy_flag "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_MANAGED_AUTH_ENABLED)"
        cli_log "Antigravity is not enabled in .env (run: ./chengos.sh setup-cli antigravity)"
        return 0
    fi
    # 1. Binary
    if [[ -n "$bin" && -x "$bin" ]] && agy_probe_local "$bin" "$version"; then
        recorded="$(cli_record_get "$shared" antigravity "$version" BINARY_SHA512 2>/dev/null || true)"
        if [[ -n "$recorded" && "$(_agy_sha512 "$bin")" != "$recorded" ]]; then
            echo "  binary check:  FAILED (differs from the approved sha512)"; rc=1
        else
            echo "  binary check:  ok"
        fi
    else
        echo "  binary check:  FAILED"; rc=1
    fi
    # 2. Isolation self-test (backend probe)
    if [[ $rc -eq 0 ]] && agy_backend_probe "$shared" "$env_file" >/dev/null 2>&1; then
        echo "  isolation:     ok (empty sandboxed home is signed out)"
    else
        echo "  isolation:     FAILED or not run (see: cheng-api admin coding-agent-probe --provider antigravity)"
        rc=1
    fi
    # 3. Managed auth (reported separately; credential auth needs a host id)
    echo "  managed auth:  $(_agy_flag "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_MANAGED_AUTH_ENABLED)"
    [[ $rc -eq 0 ]] && cli_log "Status: healthy"
    return "$rc"
}

agy_repair() {
    local shared="$1" env_file version bin recorded v st prior
    env_file="$(envf_canonical "${shared}/.env")"
    version="$(envf_get "$env_file" CHENGOS_ANTIGRAVITY_VERSION 2>/dev/null || true)"
    bin="$(envf_get "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_BIN 2>/dev/null || true)"
    if [[ -z "$version" || -z "$bin" ]]; then
        cli_state_set "$shared" antigravity -CONFIGURED_VERSION -ACTIVATING -ACTIVATING_AT >/dev/null
        cli_log "Installer records now follow .env: Antigravity is not configured."
        return 0
    fi
    [[ -f "$(cli_record_file "$shared" antigravity "$version")" ]] || {
        cli_err "no deployment record for ${version}; rerun setup-cli antigravity"; return 1;
    }
    recorded="$(cli_record_get "$shared" antigravity "$version" BINARY_SHA512 2>/dev/null || true)"
    [[ -n "$recorded" && -x "$bin" && "$(_agy_sha512 "$bin")" == "$recorded" ]] || {
        cli_err "the configured agy differs from its approved sha512; reinstall it with setup-cli antigravity"; return 1;
    }
    prior="$(cli_state_get "$shared" antigravity PREVIOUS_VERSION 2>/dev/null || true)"
    for v in $(cli_record_versions "$shared" antigravity); do
        st="$(cli_record_get "$shared" antigravity "$v" STATUS 2>/dev/null || true)"
        if [[ "$v" == "$version" ]]; then
            cli_record_set "$shared" antigravity "$v" STATUS=active "REPAIRED_AT=$(date -u +%FT%TZ)" >/dev/null || return 1
        elif [[ "$v" == "$prior" ]]; then
            cli_record_set "$shared" antigravity "$v" STATUS=previous >/dev/null || return 1
        elif [[ "$st" == active || "$st" == previous ]]; then
            cli_record_set "$shared" antigravity "$v" STATUS=retired >/dev/null || return 1
        fi
    done
    cli_state_set "$shared" antigravity "CONFIGURED_VERSION=${version}" PENDING_RESTART=true -ACTIVATING -ACTIVATING_AT >/dev/null
    cli_log "Installer records now follow .env (agy ${version}); restart ChengOS if needed."
}

agy_prune() {
    local shared="$1" apply="$2" configured previous v status path versions removed=0 candidates=()
    configured="$(envf_get "$(envf_canonical "${shared}/.env")" CHENGOS_ANTIGRAVITY_VERSION 2>/dev/null || true)"
    previous="$(cli_state_get "$shared" antigravity PREVIOUS_VERSION 2>/dev/null || true)"
    for v in $(cli_record_versions "$shared" antigravity); do
        status="$(cli_record_get "$shared" antigravity "$v" STATUS 2>/dev/null || true)"
        if [[ "$v" == "$configured" || "$v" == "$previous" || "$status" == active || "$status" == previous ]]; then
            printf '  keep   %s (configured or rollback target)\n' "$v"
        else
            path="$(agy_version_dir "$shared" "$v")"
            [[ -e "$path" ]] && candidates+=("$v")
        fi
    done
    if [[ ${#candidates[@]} -eq 0 ]]; then
        cli_log "No unprotected managed agy versions to remove."; return 0
    fi
    for v in "${candidates[@]}"; do
        printf '  %s %s\n' "$([[ "$apply" == true ]] && echo remove || echo would-remove)" "$v"
    done
    [[ "$apply" == true ]] || { cli_log "Preview only; pass --prune --yes to delete these managed versions."; return 0; }
    versions="$(agy_versions_dir "$shared")"
    for v in "${candidates[@]}"; do
        [[ "$v" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { cli_err "refusing invalid recorded version ${v}"; return 1; }
        path="$(agy_version_dir "$shared" "$v")"
        [[ "$path" == "${versions}/${v}" && ! -L "$path" ]] || { cli_err "refusing unsafe version path ${path}"; return 1; }
        rm -rf -- "$path" || return 1
        rm -f -- "$(cli_record_file "$shared" antigravity "$v")" || return 1
        cli_log "Removed managed agy ${v}"
        removed=$((removed + 1))
    done
    cli_log "Removed ${removed} unprotected agy version(s)."
}

agy_reconfigure() {
    local shared="$1" env_file bin kv key value old changed=false
    env_file="$(envf_canonical "${shared}/.env")"
    bin="$(envf_get "$env_file" CHENG_CODING_AGENT_ANTIGRAVITY_BIN 2>/dev/null || true)"
    [[ -n "$bin" && -x "$bin" ]] || {
        cli_err "the Antigravity CLI is not installed here; run ./chengos.sh setup-cli antigravity first"; return 1;
    }
    for kv in "${AGY_SETTING_KEYS[@]}"; do
        key="${kv%%=*}"; value="${kv#*=}"
        if [[ "$key" == CHENG_CODING_AGENT_ANTIGRAVITY_MANAGED_AUTH_ENABLED ]]; then
            old="$(_agy_flag "$env_file" "$key")"
        else
            old="$(envf_get "$env_file" "$key" 2>/dev/null || true)"
        fi
        [[ "$old" == "$value" ]] || changed=true
    done
    [[ "$changed" == true ]] || { cli_log "Nothing to change."; return 0; }
    if [[ "$SKIP_BACKEND_PROBE" == true ]]; then
        cli_warn "backend probe skipped by request; the settings are checked when ChengOS starts"
    else
        agy_backend_probe "$shared" "$env_file" "${AGY_SETTING_KEYS[@]}" || {
            cli_err "backend probe failed; .env was not changed"; return 1;
        }
    fi
    envf_set "$env_file" --section "$AGY_ENV_SECTION" "${AGY_SETTING_KEYS[@]}" || { cli_err ".env was not changed"; return 1; }
    cli_state_set "$shared" antigravity PENDING_RESTART=true "RECONFIGURED_AT=$(date -u +%FT%TZ)" >/dev/null || true
    cli_log "Antigravity settings updated; restart ChengOS to apply them."
}

agy_activate() {
    local shared="$1" version="$2" bin="$3" source="$4" env_file state roots root previous now failed=""
    env_file="$(envf_canonical "${shared}/.env")"
    state="$(envf_get "$env_file" CHENG_CODING_AGENT_STATE_DIR 2>/dev/null || true)"
    [[ -n "$state" ]] || state="$(cli_runtime_home)/.local/share/cheng/agent-state"
    roots="$(envf_get "$env_file" CHENG_CODING_AGENT_DEDICATED_ROOTS 2>/dev/null || true)"
    [[ -n "$roots" ]] || roots="${shared}/workspace/coding-agent"
    root="${roots%%:*}"
    (umask 077; mkdir -p "$state" "$root") || { cli_err "cannot create the state or working directories"; return 1; }
    chmod 0700 "$state" 2>/dev/null || true
    state="$(readlink -f -- "$state")"
    case "$state/" in "${shared}/"*) cli_err "state directory must live outside ${shared}"; return 1 ;; esac
    local host_id
    host_id="$(envf_get "$env_file" CHENG_CODING_AGENT_HOST_ID 2>/dev/null || true)"
    [[ -n "$host_id" ]] || host_id="$(cli_new_host_id native)"
    local -a keys=(
        CHENG_CODING_AGENT_ENABLED=true
        CHENG_CODING_AGENT_ANTIGRAVITY_ENABLED=true
        "CHENG_CODING_AGENT_ANTIGRAVITY_BIN=${bin}"
        "CHENG_CODING_AGENT_STATE_DIR=${state}"
        "CHENG_CODING_AGENT_DEDICATED_ROOTS=${roots}"
        "CHENG_CODING_AGENT_HOST_ID=${host_id}"
        "CHENGOS_ANTIGRAVITY_VERSION=${version}"
        "${AGY_SETTING_KEYS[@]}"
    )
    if [[ "$SKIP_BACKEND_PROBE" == true ]]; then
        cli_warn "backend probe (keyring isolation self-test) skipped by request; this decision is recorded and the backend still runs the self-test at startup"
    else
        cli_log "Backend Antigravity probe (version + keyring isolation self-test)..."
        agy_backend_probe "$shared" "$env_file" "${keys[@]}" || { cli_err "backend probe failed; .env was not changed"; return 1; }
    fi
    previous="$(cli_state_get "$shared" antigravity CONFIGURED_VERSION 2>/dev/null \
        || envf_get "$env_file" CHENGOS_ANTIGRAVITY_VERSION 2>/dev/null || true)"
    now="$(date -u +%FT%TZ)"
    cli_state_set "$shared" antigravity "ACTIVATING=${version}" "ACTIVATING_AT=${now}" >/dev/null || {
        cli_err "cannot write installer state; .env was not changed"; return 1;
    }
    if ! envf_set "$env_file" --section "$AGY_ENV_SECTION" "${keys[@]}"; then
        cli_state_set "$shared" antigravity -ACTIVATING -ACTIVATING_AT >/dev/null 2>&1 || true
        cli_err ".env was not changed"; return 1
    fi
    if [[ -n "$previous" && "$previous" != "$version" && -f "$(cli_record_file "$shared" antigravity "$previous")" ]]; then
        cli_record_set "$shared" antigravity "$previous" STATUS=previous >/dev/null || failed+=" record:${previous}"
        cli_state_set "$shared" antigravity "PREVIOUS_VERSION=${previous}" >/dev/null || failed+=" state"
    fi
    cli_record_set "$shared" antigravity "$version" STATUS=active "VERSION=${version}" "SOURCE=${source}" \
        "BINARY_PATH=${bin}" "BINARY_SHA512=$(_agy_sha512 "$bin")" \
        "BACKEND_PROBE=$([[ "$SKIP_BACKEND_PROBE" == true ]] && echo skipped || echo passed)" \
        "ACTIVATED_AT=${now}" >/dev/null || failed+=" record:${version}"
    cli_state_set "$shared" antigravity "CONFIGURED_VERSION=${version}" PENDING_RESTART=true \
        "CONFIGURED_AT=${now}" -ACTIVATING -ACTIVATING_AT >/dev/null || failed+=" state"
    if [[ -n "$failed" ]]; then
        cli_err "Antigravity is configured in .env, but installer bookkeeping failed:${failed}; run setup-cli antigravity --repair"
        return 5
    fi
    cli_log "Antigravity CLI ${version} is configured (task mode); restart ChengOS to apply it."
}

# Installs BIN as VERSION into its own versions directory. A version already
# recorded with a different sha512 is never replaced silently.
agy_install_version() {
    local shared="$1" version="$2" src="$3" dest staging recorded sha
    dest="$(agy_version_dir "$shared" "$version")"
    sha="$(_agy_sha512 "$src")"
    if [[ -n "$PINNED_SHA512" && "$sha" != "$PINNED_SHA512" ]]; then
        cli_err "the binary's sha512 differs from --sha512; nothing was changed"; return 1
    fi
    recorded="$(cli_record_get "$shared" antigravity "$version" BINARY_SHA512 2>/dev/null || true)"
    if [[ -e "$dest" ]]; then
        if [[ -n "$recorded" && "$recorded" == "$sha" && -x "${dest}/bin/agy" \
            && "$(_agy_sha512 "${dest}/bin/agy")" == "$sha" ]]; then
            cli_log "agy ${version} is already installed with the same sha512; reusing it"
            return 0
        fi
        cli_err "${dest} exists with different contents (approved sha512 ${recorded:-<none>}); prune it first. Nothing was changed"
        return 1
    fi
    (umask 022; mkdir -p "$(agy_versions_dir "$shared")") || return 1
    staging="$(mktemp -d "$(agy_versions_dir "$shared")/.staging-${version}.XXXXXX")" || return 1
    mkdir -p "${staging}/bin"
    install -m 0755 "$src" "${staging}/bin/agy" || { rm -rf -- "$staging"; return 1; }
    agy_probe_local "${staging}/bin/agy" "$version" || { rm -rf -- "$staging"; return 1; }
    chmod -R go-w "$staging"
    mv -T -- "$staging" "$dest" || { rm -rf -- "$staging"; return 1; }
    cli_record_set "$shared" antigravity "$version" STATUS=probed "VERSION=${version}" \
        "BINARY_SHA512=${sha}" "INSTALLED_AT=$(date -u +%FT%TZ)" >/dev/null
}

run_setup() {
    local version src source
    if [[ -n "$REUSE_BIN" ]]; then
        source=bin
        [[ "$REUSE_BIN" == /* ]] || { cli_err "--bin must be an absolute path"; return 2; }
        src="$(readlink -f -- "$REUSE_BIN")"
        agy_probe_local "$src" || return 1
        version="$AGY_PROBED_VERSION"
    else
        source=manifest
        version="$EXACT_VERSION"
        src="${WORK}/agy-${version}"
        agy_fetch_version "$version" "$src" || return 1
        chmod 0755 "$src"
    fi
    agy_install_version "$SHARED_DIR" "$version" "$src" || return 1
    agy_activate "$SHARED_DIR" "$version" "$(agy_bin_path "$SHARED_DIR" "$version")" "$source"
}

docker_refusal() {
    cli_err "the Antigravity CLI requires native deployment with Bubblewrap; Docker is unavailable"
    exit 3
}

case "$ACTION" in
    check) [[ "$MODE" == docker ]] && docker_refusal; set +e; agy_status "$SHARED_DIR"; exit $? ;;
    repair) [[ "$MODE" == docker ]] && docker_refusal; cli_with_install_lock "$SHARED_DIR" agy_repair "$SHARED_DIR"; exit $? ;;
    prune) [[ "$MODE" == docker ]] && docker_refusal; cli_with_install_lock "$SHARED_DIR" agy_prune "$SHARED_DIR" "$PRUNE_APPLY"; exit $? ;;
esac
[[ "$MODE" == docker ]] && docker_refusal
ENV_FILE="$(envf_canonical "${SHARED_DIR}/.env")"
[[ -f "$ENV_FILE" ]] || { cli_err "no ${SHARED_DIR}/.env yet; install ChengOS first"; exit 1; }
[[ "$(envf_layout "$SHARED_DIR")" != split ]] || { cli_err ".env layout is split; resolve it first"; exit 1; }
if [[ "$ACTION" == reconfigure ]]; then
    agy_collect_settings "$ENV_FILE"
    cli_with_install_lock "$SHARED_DIR" agy_reconfigure "$SHARED_DIR"
    exit $?
fi
agy_platform || exit 3
cli_ensure_tools curl sha512sum python3 flock timeout od || exit 3
if ! cli_native_sandbox_preflight; then
    if [[ "$CLI_SANDBOX_STATUS" == missing_bwrap ]]; then
        cli_ensure_tools bwrap || exit 3
        cli_native_sandbox_preflight || true
    fi
    if [[ "$CLI_SANDBOX_STATUS" != ok ]]; then
        cli_err "native sandbox unavailable for $(cli_runtime_user): ${CLI_SANDBOX_DETAIL}"
        cli_sandbox_remediation >&2
        exit 3
    fi
fi
WORK="$(mktemp -d)"
trap 'rm -rf -- "$WORK"' EXIT

if cli_can_prompt; then
    echo ""
    echo "Antigravity CLI setup summary"
    if [[ -n "$REUSE_BIN" ]]; then
        echo "    binary:        ${REUSE_BIN} (copied into a dedicated versions directory)"
    else
        echo "    version:       ${EXACT_VERSION} (${AGY_PLATFORM}, vendor manifest ${MANIFEST_BASE:-<unset>})"
    fi
    echo "    feature:       task mode only, managed Google logins, Bubblewrap only"
    echo "    managed auth:  $(_agy_flag "$ENV_FILE" CHENG_CODING_AGENT_ANTIGRAVITY_MANAGED_AUTH_ENABLED) (separate switch; asked next)"
    echo "    .env:          ${ENV_FILE}"
    if ! cli_confirm "Install and enable the Antigravity CLI task mode? [Y/n]: " y; then
        echo "Cancelled; nothing was changed."
        exit 4
    fi
fi
agy_collect_settings "$ENV_FILE"
cli_with_install_lock "$SHARED_DIR" run_setup
