#!/usr/bin/env bash
# Claude Code task-mode installer adapter, dispatched by cli/setup.sh.
set -euo pipefail

SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIB_DIR="${SETUP_DIR}/../lib"
for _lib in env-file.sh cli-common.sh npm-registry.sh; do
    [[ -f "${LIB_DIR}/${_lib}" ]] || { echo "Missing ${LIB_DIR}/${_lib}; refresh deployment scripts" >&2; exit 1; }
    # shellcheck source=/dev/null
    source "${LIB_DIR}/${_lib}"
done
unset _lib

CLAUDE_PACKAGE="@anthropic-ai/claude-code-linux-x64"
CLAUDE_MIN_AGE_DAYS="${CHENGOS_CLAUDE_MIN_RELEASE_AGE_DAYS:-7}"
# Used when CHENG_CODING_AGENT_CLAUDE_ALLOWED_TOOLS has never been set.
# Read-only git, plus the check/test commands a task needs. No arbitrary
# shell, git push, or package installs.
CLAUDE_DEFAULT_ALLOWED_TOOLS="Bash(git status:*) Bash(git diff:*) Bash(git log:*) Bash(git show:*) Bash(cargo check:*) Bash(cargo test:*) Bash(pnpm test:*)"
CLAUDE_ENV_SECTION="Coding agent (Claude Code) - managed by chengos.sh setup-cli"
SHARED_DIR="$(cd "${SETUP_DIR}/.." && pwd)"
MODE=""
POLICY=""
EXACT_VERSION=""
REUSE_BIN=""
ACTION="setup"
PRUNE_APPLY=false
SKIP_BACKEND_PROBE=false
MANAGED_AUTH_REQ=""
ALLOWED_TOOLS="" ALLOWED_TOOLS_SET=false
DISALLOWED_TOOLS="" DISALLOWED_TOOLS_SET=false
MODELS="" MODELS_SET=false
SETUP_LANG="${CHENGOS_LANG:-en}"
export CLI_NONINTERACTIVE="${CLI_NONINTERACTIVE:-false}"
export CLI_INSTALL_DEPS="${CLI_INSTALL_DEPS:-false}"

usage() {
    cat <<'EOF_USAGE'
Usage: setup.sh claude [options]

  --shared-dir DIR          Installation directory holding .env
  --mode native|docker      Deployment mode (Claude requires native)
  --version-policy stable   Newest release at least 7 days old (default)
  --version X.Y.Z           Install an exact stable version
  --bin PATH                Reuse an existing native Claude binary
  --skip-backend-probe      Activate after local checks only (recorded)
  --check                   Read-only status report
  --repair                  Reconcile installer records with .env
  --prune [--yes]           Preview or delete unprotected managed versions
  --reconfigure             Change the settings below, keeping the installed binary
  --install-deps            Authorize installing missing system packages (gnupg)
  --non-interactive         Never prompt
  --lang zh|en              Prompt language

Settings (setup or --reconfigure; a setting not given keeps its value):
  --enable-managed-auth     Let users connect a Claude subscription in
                            Settings -> Credentials (CHENG_CODING_AGENT_CLAUDE_MANAGED_AUTH_ENABLED)
  --disable-managed-auth    Turn that off again
  --allowed-tools RULES     Shell rules runs may use without asking, e.g.
                            'Bash(git status:*) Bash(cargo test:*)'; '' clears.
                            Absent key: the read-only git and test defaults
                            are written, with no prompt
  --disallowed-tools RULES  Extra denials (WebFetch, WebSearch are always denied)
  --models LIST             Models a node may select; '' = CLI default only
EOF_USAGE
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --shared-dir) SHARED_DIR="${2:?--shared-dir needs a value}"; shift 2 ;;
        --mode) MODE="${2:?--mode needs a value}"; shift 2 ;;
        --version-policy) POLICY="${2:?--version-policy needs a value}"; shift 2 ;;
        --version) EXACT_VERSION="${2:?--version needs a value}"; shift 2 ;;
        --bin) REUSE_BIN="${2:?--bin needs a value}"; shift 2 ;;
        --skip-backend-probe) SKIP_BACKEND_PROBE=true; shift ;;
        --enable-managed-auth|--disable-managed-auth)
            _req="${1#--}"; _req="${_req%-managed-auth}"
            [[ -z "$MANAGED_AUTH_REQ" || "$MANAGED_AUTH_REQ" == "$_req" ]] || {
                echo "--enable-managed-auth and --disable-managed-auth conflict" >&2; exit 2;
            }
            MANAGED_AUTH_REQ="$_req"; unset _req; shift ;;
        --allowed-tools) ALLOWED_TOOLS="${2?--allowed-tools needs a value}"; ALLOWED_TOOLS_SET=true; shift 2 ;;
        --disallowed-tools) DISALLOWED_TOOLS="${2?--disallowed-tools needs a value}"; DISALLOWED_TOOLS_SET=true; shift 2 ;;
        --models) MODELS="${2?--models needs a value}"; MODELS_SET=true; shift 2 ;;
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

case "$POLICY" in ""|stable) ;; *) echo "--version-policy must be stable" >&2; exit 2 ;; esac
if [[ "$PRUNE_APPLY" == true && "$ACTION" != prune ]]; then
    cli_err "--yes is only valid with --prune"
    exit 2
fi
if [[ -n "$EXACT_VERSION" && ! "$EXACT_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "--version must be an exact stable version (X.Y.Z)" >&2
    exit 2
fi
if [[ -n "$REUSE_BIN" && ( -n "$EXACT_VERSION" || -n "$POLICY" ) ]]; then
    echo "--bin cannot be combined with --version or --version-policy" >&2
    exit 2
fi
if [[ "$ACTION" == reconfigure && ( -n "$REUSE_BIN" || -n "$EXACT_VERSION" || -n "$POLICY" ) ]]; then
    echo "--reconfigure keeps the installed binary; it cannot be combined with --bin or --version" >&2
    exit 2
fi
if [[ "$ACTION" == check || "$ACTION" == repair || "$ACTION" == prune ]] \
    && [[ -n "$MANAGED_AUTH_REQ" || "$ALLOWED_TOOLS_SET" == true || "$DISALLOWED_TOOLS_SET" == true \
          || "$MODELS_SET" == true ]]; then
    echo "settings flags apply to setup or --reconfigure only" >&2
    exit 2
fi
[[ -d "$SHARED_DIR" ]] || { cli_err "no installation directory: ${SHARED_DIR}"; exit 2; }
SHARED_DIR="$(cd "$SHARED_DIR" && pwd -P)"
if [[ -z "$MODE" ]]; then
    MODE="native"
    for _mf in "${SHARED_DIR}/.chengos_install_mode" "${SHARED_DIR}/../.chengos_install_mode"; do
        if [[ -f "$_mf" ]]; then MODE="$(tr -d '[:space:]' < "$_mf")"; break; fi
    done
    unset _mf
fi
case "$MODE" in native|docker) ;; *) cli_err "--mode must be native or docker"; exit 2 ;; esac

claude_versions_dir() { printf '%s/claude/versions' "$(cli_root "$1")"; }
claude_version_dir() { printf '%s/%s' "$(claude_versions_dir "$1")" "$2"; }
claude_bin_path() { printf '%s/bin/claude' "$(claude_version_dir "$1" "$2")"; }
claude_manifest_file() { printf '%s/%s.manifest' "$(cli_record_dir "$1" claude)" "$2"; }
_claude_sha256() { sha256sum "$1" | awk '{print $1}'; }

claude_platform() {
    case "$(uname -s)/$(uname -m)" in
        Linux/x86_64) ;;
        *) cli_err "Claude installer currently supports Linux x86_64 only"; return 1 ;;
    esac
    if ! getconf GNU_LIBC_VERSION 2>/dev/null | grep -q '^glibc '; then
        cli_err "Claude installer currently requires glibc Linux x86_64; musl is not enabled yet"
        return 1
    fi
}

claude_probe_local() {
    local bin="$1" expected="${2:-}" machine out probe_home
    [[ -f "$bin" && -x "$bin" ]] || { cli_err "${bin} is not an executable file"; return 1; }
    case "$bin" in *.js|*.mjs|*.cjs) cli_err "${bin} is a JavaScript launcher, not a native binary"; return 1 ;; esac
    machine="$(od -An -tx1 -j18 -N2 "$bin" 2>/dev/null | tr -d ' \n')"
    if [[ "$(head -c4 "$bin" | od -An -tx1 | tr -d ' \n')" != "7f454c46" || "$machine" != "3e00" ]]; then
        cli_err "${bin} is not a native Linux x86_64 ELF binary"
        return 1
    fi
    probe_home="$(mktemp -d)" || return 1
    mkdir -p "${probe_home}/config"
    if ! out="$(HOME="$probe_home" CLAUDE_CONFIG_DIR="${probe_home}/config" \
        DISABLE_AUTOUPDATER=1 DISABLE_UPDATES=1 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 \
        timeout 30 "$bin" --version 2>&1)"; then
        rm -rf -- "$probe_home"
        cli_err "claude --version failed: ${out:0:240}"
        return 1
    fi
    rm -rf -- "$probe_home"
    [[ "$out" =~ ([0-9]+\.[0-9]+\.[0-9]+) ]] || { cli_err "Claude did not report a stable version"; return 1; }
    CLAUDE_PROBED_VERSION="${BASH_REMATCH[1]}"
    if [[ -n "$expected" && "$CLAUDE_PROBED_VERSION" != "$expected" ]]; then
        cli_err "binary reports version ${CLAUDE_PROBED_VERSION}, expected ${expected}"
        return 1
    fi
    cli_log "Local probes passed: native Linux x86_64 Claude Code ${CLAUDE_PROBED_VERSION}"
}

# One line of gpg stderr, safe to append to cli_err.
_claude_gpg_detail() {
    local err="${1//$'\n'/; }"
    err="${err#"${err%%[![:space:]]*}"}"
    err="${err%"${err##*[![:space:]]}"}"
    printf '%s' "${err:0:240}"
}

claude_verify_release_manifest() {
    local version="$1" bin="$2" work="$3" verify_dir key manifest sig fingerprint expected actual code gnupg_home gpg_err
    verify_dir="$(mktemp -d "${work}/claude-release-verify.XXXXXX")" || return 1
    key="${verify_dir}/claude-code.asc"
    manifest="${verify_dir}/manifest.json"
    sig="${verify_dir}/manifest.json.sig"
    gnupg_home="${verify_dir}/gnupg"
    mkdir -m 0700 "$gnupg_home" || { rm -rf -- "$verify_dir"; return 1; }
    code="$(curl -sS --proto '=https' --tlsv1.2 --max-time 120 -w '%{http_code}' -o "$key" \
        https://downloads.claude.ai/keys/claude-code.asc)" || { rm -rf -- "$verify_dir"; return 1; }
    [[ "$code" == 200 ]] || { rm -rf -- "$verify_dir"; cli_err "Anthropic signing key download returned HTTP ${code}"; return 1; }
    gpg_err=""
    if ! gpg_err="$(gpg --batch --homedir "$gnupg_home" --import "$key" 2>&1 >/dev/null)"; then
        gpg_err="$(_claude_gpg_detail "$gpg_err")"
        rm -rf -- "$verify_dir"
        cli_err "cannot import Anthropic release signing key${gpg_err:+: ${gpg_err}}"
        return 1
    fi
    fingerprint="$(gpg --batch --homedir "$gnupg_home" --with-colons --fingerprint \
        | awk -F: '$1 == "fpr" { print toupper($10); exit }')"
    [[ "$fingerprint" == "31DDDE24DDFAB679F42D7BD2BAA929FF1A7ECACE" ]] || {
        rm -rf -- "$verify_dir"; cli_err "Anthropic signing-key fingerprint did not match the pinned value"; return 1;
    }
    local base="https://downloads.claude.ai/claude-code-releases/${version}"
    code="$(curl -sS --proto '=https' --tlsv1.2 --max-time 120 -w '%{http_code}' -o "$manifest" "${base}/manifest.json")" || {
        rm -rf -- "$verify_dir"; return 1;
    }
    [[ "$code" == 200 ]] || { rm -rf -- "$verify_dir"; cli_err "Claude release manifest returned HTTP ${code}"; return 1; }
    code="$(curl -sS --proto '=https' --tlsv1.2 --max-time 120 -w '%{http_code}' -o "$sig" "${base}/manifest.json.sig")" || {
        rm -rf -- "$verify_dir"; return 1;
    }
    [[ "$code" == 200 ]] || { rm -rf -- "$verify_dir"; cli_err "Claude manifest signature returned HTTP ${code}"; return 1; }
    gpg_err=""
    if ! gpg_err="$(gpg --batch --homedir "$gnupg_home" --verify "$sig" "$manifest" 2>&1 >/dev/null)"; then
        gpg_err="$(_claude_gpg_detail "$gpg_err")"
        rm -rf -- "$verify_dir"
        cli_err "Anthropic release manifest signature verification failed${gpg_err:+: ${gpg_err}}"
        return 1
    fi
    expected="$(python3 -I -c 'import json,sys; d=json.load(open(sys.argv[1], encoding="utf-8")); print(d["platforms"]["linux-x64"]["checksum"])' "$manifest")" || {
        rm -rf -- "$verify_dir"; cli_err "Claude release manifest has no linux-x64 checksum"; return 1;
    }
    actual="$(_claude_sha256 "$bin")"
    rm -rf -- "$verify_dir"
    [[ "$actual" == "$expected" ]] || { cli_err "Claude binary does not match Anthropic's signed release manifest"; return 1; }
    cli_log "Anthropic release manifest signature and Linux x86_64 binary checksum verified"
}

claude_manifest_write() {
    local root="$1" out="$2" tmp
    tmp="$(mktemp "${out}.XXXXXX")" || return 1
    (cd "$root" && sha256sum ./bin/claude) > "$tmp" || { rm -f -- "$tmp"; return 1; }
    mv -f -- "$tmp" "$out"
}

claude_verify_tree() {
    local shared="$1" version="$2" root manifest expected actual
    root="$(cli_record_get "$shared" claude "$version" INSTALL_ROOT 2>/dev/null || true)"
    manifest="$(claude_manifest_file "$shared" "$version")"
    [[ -n "$root" && -d "$root" && -f "$manifest" ]] || return 1
    expected="$(cli_record_get "$shared" claude "$version" MANIFEST_SHA256 2>/dev/null || true)"
    [[ -n "$expected" && "$(_claude_sha256 "$manifest")" == "$expected" ]] || return 1
    (cd "$root" && sha256sum --quiet -c "$manifest") || return 1
    actual="$(cli_record_get "$shared" claude "$version" BINARY_PATH 2>/dev/null || true)"
    [[ "$actual" == "${root}/bin/claude" && -x "$actual" ]]
}

claude_version_reusable() {
    local shared="$1" version="$2" source
    [[ -x "$(claude_bin_path "$shared" "$version")" ]] || return 1
    source="$(cli_record_get "$shared" claude "$version" SOURCE 2>/dev/null || true)"
    [[ "$source" == registry ]] || return 1
    claude_verify_tree "$shared" "$version"
}

claude_finish_replacement() {
    [[ -n "${CLAUDE_REPLACED_BACKUP:-}" ]] || return 0
    rm -rf -- "$CLAUDE_REPLACED_BACKUP" "${CLAUDE_REPLACED_BACKUP}.rec" \
        "${CLAUDE_REPLACED_BACKUP}.manifest"
    CLAUDE_REPLACED_BACKUP=""
}

claude_undo_replacement() {
    local shared="$1" version="$2" dest rec manifest
    [[ -n "${CLAUDE_REPLACED_BACKUP:-}" ]] || return 0
    dest="$(claude_version_dir "$shared" "$version")"
    rec="$(cli_record_file "$shared" claude "$version")"
    manifest="$(claude_manifest_file "$shared" "$version")"
    rm -rf -- "$dest"
    if mv -T -- "$CLAUDE_REPLACED_BACKUP" "$dest"; then
        [[ -f "${CLAUDE_REPLACED_BACKUP}.rec" ]] && mv -f -- "${CLAUDE_REPLACED_BACKUP}.rec" "$rec"
        [[ -f "${CLAUDE_REPLACED_BACKUP}.manifest" ]] && mv -f -- "${CLAUDE_REPLACED_BACKUP}.manifest" "$manifest"
        cli_log "Restored the previous Claude ${version} installation"
    else
        cli_err "could not restore ${dest} from ${CLAUDE_REPLACED_BACKUP}; restore it by hand"
    fi
    CLAUDE_REPLACED_BACKUP=""
}

_claude_flag() {
    case "$(envf_get "$1" "$2" 2>/dev/null || true)" in
        1|true|TRUE|True|yes|YES|Yes) printf 'true' ;;
        *) printf 'false' ;;
    esac
}

claude_managed_auth_notice() {
    {
        echo ""
        echo "  Claude subscription login (Settings -> Credentials) lets each user connect their"
        echo "  own Claude subscription to this server. Before turning it on:"
        echo "    - Anthropic documents 'claude auth login' for remote terminals, but does not say"
        echo "      that server-hosted automation products may use subscription accounts;"
        echo "    - Anthropic's Consumer Terms restrict automated access other than through API"
        echo "      keys; an account can be warned, limited or suspended;"
        echo "    - each user still sees these risks and must consent before logging in."
        echo "  Docs:  https://code.claude.com/docs/en/authentication"
        echo "  Terms: https://www.anthropic.com/legal/consumer-terms"
        echo "  Runs with a user's own Anthropic API key do not need this switch."
    } >&2
}

# claude_managed_auth_decision ENV_FILE — prints true | false. A flag decides;
# otherwise the current value stays, and an interactive run that finds it off
# asks once (default: no). Never switched on silently.
claude_managed_auth_decision() {
    local env_file="$1" current
    current="$(_claude_flag "$env_file" CHENG_CODING_AGENT_CLAUDE_MANAGED_AUTH_ENABLED)"
    case "$MANAGED_AUTH_REQ" in
        enable)
            claude_managed_auth_notice
            printf 'true'
            return
            ;;
        disable)
            [[ "$current" == true ]] && cli_warn "subscription credentials users already connected stay stored, but no run can use them until the switch is on again"
            printf 'false'
            return
            ;;
    esac
    if [[ "$current" == true ]]; then
        printf 'true'
        return
    fi
    if cli_can_prompt; then
        claude_managed_auth_notice
        if cli_confirm "  Let users connect their Claude subscription in Credentials? [y/N]: " n; then
            printf 'true'
            return
        fi
    fi
    printf 'false'
}

# claude_collect_settings ENV_FILE — decides the settings this run writes into
# CLAUDE_SETTING_KEYS (KEY=VALUE). Settings that were neither given nor
# answered keep their value and are not written.
claude_collect_settings() {
    local env_file="$1"
    CLAUDE_SETTING_KEYS=(
        "CHENG_CODING_AGENT_CLAUDE_MANAGED_AUTH_ENABLED=$(claude_managed_auth_decision "$env_file")"
    )
    if [[ "$ALLOWED_TOOLS_SET" != true ]]; then
        # A missing key gets the safe default. An assignment, including an
        # explicit empty one from --allowed-tools '', is left as the operator set it.
        if ! envf_get "$env_file" CHENG_CODING_AGENT_CLAUDE_ALLOWED_TOOLS >/dev/null 2>&1; then
            ALLOWED_TOOLS="$CLAUDE_DEFAULT_ALLOWED_TOOLS"
            ALLOWED_TOOLS_SET=true
            cli_log "allowing the default read-only and test commands: ${ALLOWED_TOOLS}"
        fi
    fi
    [[ "$ALLOWED_TOOLS_SET" == true ]] && CLAUDE_SETTING_KEYS+=("CHENG_CODING_AGENT_CLAUDE_ALLOWED_TOOLS=${ALLOWED_TOOLS}")
    [[ "$DISALLOWED_TOOLS_SET" == true ]] && CLAUDE_SETTING_KEYS+=("CHENG_CODING_AGENT_CLAUDE_DISALLOWED_TOOLS=${DISALLOWED_TOOLS}")
    [[ "$MODELS_SET" == true ]] && CLAUDE_SETTING_KEYS+=("CHENG_CODING_AGENT_CLAUDE_MODELS=${MODELS}")
    return 0
}

# Without allowed shell rules a writable run can edit files but not run a
# test or a build, so most real tasks end in CODING_AGENT_PERMISSION_DENIED.
claude_warn_empty_allowlist() {
    local env_file="$1"
    [[ -z "$(envf_get "$env_file" CHENG_CODING_AGENT_CLAUDE_ALLOWED_TOOLS 2>/dev/null || true)" ]] || return 0
    cli_warn "no shell commands are allowed for Claude runs: they can edit files but not run tests or builds, so tasks that need them end in CODING_AGENT_PERMISSION_DENIED."
    cli_warn "allow what tasks need, e.g.: ./chengos.sh setup-cli claude --reconfigure --allowed-tools 'Bash(git status:*) Bash(cargo test:*)'"
}

claude_status() {
    local shared="$1" env_file enabled version bin expected source recorded_sha
    env_file="$(envf_canonical "${shared}/.env")"
    [[ -f "$env_file" ]] || { cli_err "no ${env_file}"; return 1; }
    enabled="$(envf_get "$env_file" CHENG_CODING_AGENT_CLAUDE_ENABLED 2>/dev/null || true)"
    version="$(envf_get "$env_file" CHENGOS_CLAUDE_VERSION 2>/dev/null || true)"
    bin="$(envf_get "$env_file" CHENG_CODING_AGENT_CLAUDE_BIN 2>/dev/null || true)"
    echo "Claude Code task provider: ${enabled:-off}"
    echo "  version:       ${version:-<not managed>}"
    echo "  binary:        ${bin:-<not configured>}"
    echo "  managed login: $(_claude_flag "$env_file" CHENG_CODING_AGENT_CLAUDE_MANAGED_AUTH_ENABLED)"
    echo "  allowed tools: $(envf_get "$env_file" CHENG_CODING_AGENT_CLAUDE_ALLOWED_TOOLS 2>/dev/null || true)"
    echo "  models:        $(envf_get "$env_file" CHENG_CODING_AGENT_CLAUDE_MODELS 2>/dev/null || printf '<CLI default>')"
    if [[ -z "$(envf_get "$env_file" CHENG_CODING_AGENT_CODEX_BIN 2>/dev/null || true)" ]]; then
        echo "  codex:         not configured (Claude-only host)"
    fi
    if [[ "${enabled,,}" != "true" && "${enabled,,}" != "1" && "${enabled,,}" != "yes" ]]; then
        cli_log "Claude is not enabled in .env (run: ./chengos.sh setup-cli claude)"
        return 0
    fi
    [[ -n "$bin" && -x "$bin" ]] || { cli_err "configured Claude binary is missing or not executable"; return 1; }
    expected="${version:-}"
    claude_probe_local "$bin" "$expected" || return 1
    if [[ -n "$version" && -f "$(cli_record_file "$shared" claude "$version")" ]]; then
        source="$(cli_record_get "$shared" claude "$version" SOURCE 2>/dev/null || true)"
        recorded_sha="$(cli_record_get "$shared" claude "$version" BINARY_SHA256 2>/dev/null || true)"
        if [[ "$source" == registry ]]; then
            claude_verify_tree "$shared" "$version" || { cli_err "managed Claude files differ from the installer record"; return 1; }
        elif [[ -n "$recorded_sha" && "$(_claude_sha256 "$bin")" != "$recorded_sha" ]]; then
            cli_err "configured Claude binary differs from the installer record"
            return 1
        fi
    fi
    cli_log "Status: healthy"
}

claude_repair() {
    local shared="$1" env_file version bin prior
    env_file="$(envf_canonical "${shared}/.env")"
    version="$(envf_get "$env_file" CHENGOS_CLAUDE_VERSION 2>/dev/null || true)"
    bin="$(envf_get "$env_file" CHENG_CODING_AGENT_CLAUDE_BIN 2>/dev/null || true)"
    if [[ -z "$version" || -z "$bin" ]]; then
        cli_state_set "$shared" claude -CONFIGURED_VERSION -ACTIVATING -ACTIVATING_AT >/dev/null
        cli_log "Installer records now follow .env: Claude is not configured."
        return 0
    fi
    [[ -f "$(cli_record_file "$shared" claude "$version")" ]] || {
        cli_err "no deployment record for ${version}; rerun setup-cli claude --version ${version}"
        return 1
    }
    prior="$(cli_state_get "$shared" claude PREVIOUS_VERSION 2>/dev/null || true)"
    local v st
    for v in $(cli_record_versions "$shared" claude); do
        st="$(cli_record_get "$shared" claude "$v" STATUS 2>/dev/null || true)"
        if [[ "$v" == "$version" ]]; then
            cli_record_set "$shared" claude "$v" STATUS=active "REPAIRED_AT=$(date -u +%FT%TZ)" >/dev/null || return 1
        elif [[ "$v" == "$prior" ]]; then
            cli_record_set "$shared" claude "$v" STATUS=previous >/dev/null || return 1
        elif [[ "$st" == active || "$st" == previous ]]; then
            cli_record_set "$shared" claude "$v" STATUS=retired >/dev/null || return 1
        fi
    done
    cli_state_set "$shared" claude "CONFIGURED_VERSION=${version}" PENDING_RESTART=true -ACTIVATING -ACTIVATING_AT >/dev/null
    cli_log "Installer records now follow .env (Claude Code ${version}); restart ChengOS if needed."
}

claude_prune() {
    local shared="$1" apply="$2" configured previous v status path removed=0 candidates=()
    configured="$(envf_get "$(envf_canonical "${shared}/.env")" CHENGOS_CLAUDE_VERSION 2>/dev/null || true)"
    previous="$(cli_state_get "$shared" claude PREVIOUS_VERSION 2>/dev/null || true)"
    for v in $(cli_record_versions "$shared" claude); do
        status="$(cli_record_get "$shared" claude "$v" STATUS 2>/dev/null || true)"
        if [[ "$v" == "$configured" || "$v" == "$previous" || "$status" == active || "$status" == previous ]]; then
            printf '  keep   %s (configured or rollback target)\n' "$v"
        else
            path="$(claude_version_dir "$shared" "$v")"
            [[ -e "$path" ]] && candidates+=("$v")
        fi
    done
    if [[ ${#candidates[@]} -eq 0 ]]; then
        cli_log "No unprotected managed Claude versions to remove."
        return 0
    fi
    for v in "${candidates[@]}"; do
        printf '  %s %s\n' "$([[ "$apply" == true ]] && echo remove || echo would-remove)" "$v"
    done
    [[ "$apply" == true ]] || { cli_log "Preview only; pass --prune --yes to delete these managed versions."; return 0; }
    local versions
    versions="$(claude_versions_dir "$shared")"
    for v in "${candidates[@]}"; do
        [[ "$v" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { cli_err "refusing invalid recorded version ${v}"; return 1; }
        path="$(claude_version_dir "$shared" "$v")"
        [[ "$path" == "${versions}/${v}" && ! -L "$path" ]] || { cli_err "refusing unsafe version path ${path}"; return 1; }
        rm -rf -- "$path" || { cli_err "cannot remove ${path}"; return 1; }
        rm -f -- "$(cli_record_file "$shared" claude "$v")" "$(claude_manifest_file "$shared" "$v")" || return 1
        cli_log "Removed managed Claude Code ${v}"
        removed=$((removed + 1))
    done
    cli_log "Removed ${removed} unprotected Claude version(s)."
}

# Changes only the settings, keeping the installed binary. Probed like a
# setup (the backend validates the rules), then one .env transaction.
claude_reconfigure() {
    local shared="$1" env_file bin kv key value old changed=false
    env_file="$(envf_canonical "${shared}/.env")"
    bin="$(envf_get "$env_file" CHENG_CODING_AGENT_CLAUDE_BIN 2>/dev/null || true)"
    [[ -n "$bin" && -x "$bin" ]] || {
        cli_err "Claude Code is not installed here; run ./chengos.sh setup-cli claude first"
        return 1
    }
    for kv in "${CLAUDE_SETTING_KEYS[@]}"; do
        key="${kv%%=*}"
        value="${kv#*=}"
        if [[ "$key" == CHENG_CODING_AGENT_CLAUDE_MANAGED_AUTH_ENABLED ]]; then
            old="$(_claude_flag "$env_file" "$key")"
        else
            old="$(envf_get "$env_file" "$key" 2>/dev/null || true)"
        fi
        [[ "$old" == "$value" ]] || changed=true
    done
    if [[ "$changed" != true ]]; then
        cli_log "Nothing to change."
        claude_warn_empty_allowlist "$env_file"
        return 0
    fi
    if [[ "$SKIP_BACKEND_PROBE" == true ]]; then
        cli_warn "backend probe skipped by request; the rules are checked when ChengOS starts"
    else
        cli_log "Backend Claude sandbox probe (validates the new settings)..."
        claude_backend_probe "$shared" "$env_file" "${CLAUDE_SETTING_KEYS[@]}" || {
            cli_err "backend probe failed; .env was not changed"
            return 1
        }
    fi
    envf_set "$env_file" --section "$CLAUDE_ENV_SECTION" "${CLAUDE_SETTING_KEYS[@]}" || {
        cli_err ".env was not changed"
        return 1
    }
    cli_state_set "$shared" claude PENDING_RESTART=true "RECONFIGURED_AT=$(date -u +%FT%TZ)" >/dev/null \
        || cli_warn "cannot record the pending restart; restart ChengOS to apply the settings"
    cli_log "Claude Code settings updated; restart ChengOS to apply them."
    claude_warn_empty_allowlist "$env_file"
}

claude_backend_probe() {
    local shared="$1" env_file="$2"; shift 2
    local api="${shared}/bin/cheng-api" out rc work
    if [[ ! -x "$api" ]] || ! "$api" admin --help 2>/dev/null | grep -q 'coding-agent-probe'; then
        cli_err "installed cheng-api lacks the provider-aware coding-agent probe; update ChengOS or explicitly pass --skip-backend-probe"
        return 2
    fi
    work="$(mktemp -d)" || return 1
    set +e
    out="$(cd "$work" && set -a && source "$env_file" && set +a && \
        for kv in "$@"; do export "$kv"; done && \
        "$api" admin coding-agent-probe --provider claude --timeout-secs 30 2>&1)"
    rc=$?
    set -e
    rm -rf -- "$work"
    printf '%s\n' "$out" | sed 's/^/    /'
    [[ $rc -eq 0 && "$out" == *"result: ok"* ]]
}

claude_activate() {
    local shared="$1" mode="$2" version="$3" bin="$4" source="$5" skip_probe="$6"
    local env_file state roots root claude_root default_root previous now failed=""
    env_file="$(envf_canonical "${shared}/.env")"
    state="$(envf_get "$env_file" CHENG_CODING_AGENT_STATE_DIR 2>/dev/null || true)"
    [[ -n "$state" ]] || state="$(cli_runtime_home)/.local/share/cheng/agent-state"
    roots="$(envf_get "$env_file" CHENG_CODING_AGENT_DEDICATED_ROOTS 2>/dev/null || true)"
    [[ -n "$roots" ]] || roots="${shared}/workspace/coding-agent"
    root="${roots%%:*}"
    default_root="$(envf_get "$env_file" CHENG_CODING_AGENT_DEFAULT_ROOT 2>/dev/null || true)"
    [[ -n "$default_root" ]] || default_root="$root"
    claude_root="$(envf_get "$env_file" CHENG_CODING_AGENT_CLAUDE_ROOT 2>/dev/null || true)"
    [[ -n "$claude_root" ]] || claude_root="${state}/claude"
    (umask 077; mkdir -p "$state" "$root" "$claude_root/users" "$claude_root/runs") || {
        cli_err "cannot create the state, working or Claude directories"; return 1;
    }
    chmod 0700 "$state" "$claude_root" "$claude_root/users" "$claude_root/runs" 2>/dev/null || true
    state="$(readlink -f -- "$state")"
    claude_root="$(readlink -f -- "$claude_root")"
    local -a canon_roots=()
    local IFS=':' path
    for path in $roots; do
        [[ -n "$path" && -d "$path" ]] || { cli_err "coding-agent work root is missing: ${path}"; return 1; }
        path="$(readlink -f -- "$path")"
        [[ "$path" != *:* ]] || { cli_err "coding-agent root contains ':'"; return 1; }
        canon_roots+=("$path")
    done
    roots="$(IFS=:; printf '%s' "${canon_roots[*]}")"
    root="${canon_roots[0]}"
    [[ -d "$default_root" ]] || { cli_err "default coding-agent root is missing: ${default_root}"; return 1; }
    default_root="$(readlink -f -- "$default_root")"
    local found_default=false
    for path in "${canon_roots[@]}"; do
        case "$default_root/" in "$path/"*) found_default=true ;; esac
    done
    [[ "$found_default" == true ]] || { cli_err "default coding-agent root is outside CHENG_CODING_AGENT_DEDICATED_ROOTS"; return 1; }
    [[ "$state" == /* && "$claude_root" == /* && "$root" == /* ]] || { cli_err "state and work paths must be absolute"; return 1; }
    case "$state/" in "${shared}/"*) cli_err "state directory must live outside ${shared}"; return 1 ;; esac
    case "$root/" in "$state/"*|"$claude_root/"*) cli_err "work root overlaps coding-agent state"; return 1 ;; esac
    case "$state/" in "$root/"*) cli_err "coding-agent state overlaps a work root"; return 1 ;; esac
    case "$claude_root/" in "$root/"*) cli_err "Claude state root overlaps a coding-agent work root"; return 1 ;; esac
    case "$claude_root/" in "$state/"*) : ;; *) cli_err "Claude state root must live under the coding-agent state directory"; return 1 ;; esac
    if [[ -n "$(cli_runtime_home)/.claude" && ( "$claude_root" == "$(readlink -f "$(cli_runtime_home)/.claude" 2>/dev/null || true)" || "$claude_root" == *"/.claude" ) ]]; then
        cli_err "Claude state root must not point at a personal ~/.claude directory"; return 1
    fi
    local -a keys=(
        CHENG_CODING_AGENT_ENABLED=true
        CHENG_CODING_AGENT_CLAUDE_ENABLED=true
        "CHENG_CODING_AGENT_CLAUDE_BIN=${bin}"
        "CHENG_CODING_AGENT_STATE_DIR=${state}"
        "CHENG_CODING_AGENT_DEDICATED_ROOTS=${roots}"
        "CHENG_CODING_AGENT_DEFAULT_ROOT=${default_root}"
        "CHENG_CODING_AGENT_CLAUDE_ROOT=${claude_root}"
        "CHENGOS_CLAUDE_VERSION=${version}"
        "${CLAUDE_SETTING_KEYS[@]}"
    )
    if [[ "$skip_probe" == true ]]; then
        cli_warn "backend sandbox probe skipped by request; this decision will be recorded"
    else
        cli_log "Backend Claude sandbox probe (cheng-api admin coding-agent-probe --provider claude)..."
        claude_backend_probe "$shared" "$env_file" "${keys[@]}" || {
            cli_err "backend probe failed; .env was not changed"
            return 1
        }
    fi
    previous="$(cli_state_get "$shared" claude CONFIGURED_VERSION 2>/dev/null \
        || envf_get "$env_file" CHENGOS_CLAUDE_VERSION 2>/dev/null || true)"
    now="$(date -u +%FT%TZ)"
    cli_state_set "$shared" claude "ACTIVATING=${version}" "ACTIVATING_AT=${now}" >/dev/null || {
        cli_err "cannot write installer state; .env was not changed"; return 1;
    }
    if ! envf_set "$env_file" --section "$CLAUDE_ENV_SECTION" "${keys[@]}"; then
        cli_state_set "$shared" claude -ACTIVATING -ACTIVATING_AT >/dev/null 2>&1 || true
        cli_err ".env was not changed"
        return 1
    fi
    local v
    if [[ -n "$previous" && "$previous" != "$version" ]]; then
        for v in $(cli_record_versions "$shared" claude); do
            [[ "$v" == "$previous" || "$v" == "$version" ]] && continue
            case "$(cli_record_get "$shared" claude "$v" STATUS 2>/dev/null || true)" in
                active|previous) cli_record_set "$shared" claude "$v" STATUS=retired >/dev/null || failed+=" record:${v}" ;;
            esac
        done
        [[ -f "$(cli_record_file "$shared" claude "$previous")" ]] && \
            cli_record_set "$shared" claude "$previous" STATUS=previous >/dev/null || true
    fi
    local probe_result=passed
    [[ "$skip_probe" == true ]] && probe_result=skipped
    cli_record_set "$shared" claude "$version" STATUS=active "VERSION=${version}" "SOURCE=${source}" \
        "BINARY_PATH=${bin}" "BINARY_SHA256=$(_claude_sha256 "$bin")" "BACKEND_PROBE=${probe_result}" \
        "ACTIVATED_AT=${now}" >/dev/null || failed+=" record:${version}"
    if [[ "$source" == registry ]]; then
        local dest manifest
        dest="$(claude_version_dir "$shared" "$version")"
        manifest="$(claude_manifest_file "$shared" "$version")"
        claude_manifest_write "$dest" "$manifest" || failed+=" manifest:${version}"
        cli_record_set "$shared" claude "$version" "INSTALL_ROOT=${dest}" \
            "MANIFEST_SHA256=$(_claude_sha256 "$manifest")" >/dev/null || failed+=" record:${version}"
    fi
    cli_state_set "$shared" claude "CONFIGURED_VERSION=${version}" PENDING_RESTART=true "CONFIGURED_AT=${now}" \
        -ACTIVATING -ACTIVATING_AT >/dev/null || failed+=" state"
    if [[ -n "$failed" ]]; then
        cli_err "Claude is configured in .env, but installer bookkeeping failed:${failed}; run setup-cli claude --repair"
        return 5
    fi
    cli_log "Claude Code ${version} is configured; restart ChengOS to apply it."
    claude_warn_empty_allowlist "$env_file"
}

run_setup() {
    local version bin source=registry
    CLAUDE_REPLACED_BACKUP=""
    if [[ -n "$REUSE_BIN" ]]; then
        source=bin
        [[ "$REUSE_BIN" == /* ]] || { cli_err "--bin must be an absolute path"; return 2; }
        bin="$(readlink -f -- "$REUSE_BIN")"
        claude_probe_local "$bin" || return 1
        version="$CLAUDE_PROBED_VERSION"
    else
        version="$NPMR_VERSION"
        if ! claude_version_reusable "$SHARED_DIR" "$version"; then
            local versions dest staging tgz prior=""
            versions="$(claude_versions_dir "$SHARED_DIR")"
            dest="$(claude_version_dir "$SHARED_DIR" "$version")"
            if [[ -e "$dest" ]]; then
                prior="$(cli_record_get "$SHARED_DIR" claude "$version" STATUS 2>/dev/null || true)"
                [[ -n "$prior" ]] || { cli_err "${dest} exists but has no installer record; refusing to modify it"; return 1; }
            fi
            (umask 022; mkdir -p "$versions") || return 1
            staging="$(mktemp -d "${versions}/.staging-${version}.XXXXXX")" || return 1
            tgz="${WORK}/claude-${version}.tgz"
            cli_log "Downloading ${CLAUDE_PACKAGE}@${version}"
            if ! npmr_fetch "$NPMR_TARBALL" "$tgz" \
                || ! npmr_verify_integrity "$tgz" "$NPMR_INTEGRITY" \
                || ! npmr_verify_signature "$CLAUDE_PACKAGE" "$version" "$NPMR_INTEGRITY" "$NPMR_PUBLISHED"; then
                rm -rf -- "$staging"
                cli_err "Claude package integrity or registry signature verification failed"
                return 1
            fi
            cli_log "npm integrity and registry signature verified (key ${NPMR_SIGNING_KEYID})"
            mkdir -p "${staging}/extract" "${staging}/final/bin"
            if ! npmr_extract_claude "$tgz" "$CLAUDE_PACKAGE" "$version" "${staging}/extract" \
                || ! claude_verify_release_manifest "$version" "${staging}/extract/claude" "$WORK" \
                || ! install -m 0755 "${staging}/extract/claude" "${staging}/final/bin/claude" \
                || ! claude_probe_local "${staging}/final/bin/claude" "$version"; then
                rm -rf -- "$staging"
                cli_err "Claude ${version} failed archive, native-binary or version probes"
                return 1
            fi
            chmod -R go-w "${staging}/final"
            local backup=""
            if [[ -e "$dest" ]]; then
                backup="${dest}.replaced.$(date +%s).$$"
                local rec
                rec="$(cli_record_file "$SHARED_DIR" claude "$version")"
                local prior_manifest
                prior_manifest="$(claude_manifest_file "$SHARED_DIR" "$version")"
                cp -p -- "$rec" "${backup}.rec" || { rm -rf -- "$staging"; return 1; }
                if [[ -f "$prior_manifest" ]] && ! cp -p -- "$prior_manifest" "${backup}.manifest"; then
                    rm -f "${backup}.rec" "${backup}.manifest"
                    rm -rf -- "$staging"
                    return 1
                fi
                mv -T -- "$dest" "$backup" || {
                    rm -f "${backup}.rec" "${backup}.manifest"
                    rm -rf -- "$staging"
                    return 1
                }
                CLAUDE_REPLACED_BACKUP="$backup"
            fi
            if ! mv -T -- "${staging}/final" "$dest"; then
                [[ -n "$backup" ]] && mv -T -- "$backup" "$dest"
                rm -rf -- "$staging"
                return 1
            fi
            rm -rf -- "$staging"
            bin="$(claude_bin_path "$SHARED_DIR" "$version")"
            local manifest
            manifest="$(claude_manifest_file "$SHARED_DIR" "$version")"
            mkdir -p "$(dirname "$manifest")"
            if ! claude_manifest_write "$dest" "$manifest"; then
                claude_undo_replacement "$SHARED_DIR" "$version"
                return 1
            fi
            cli_record_set "$SHARED_DIR" claude "$version" STATUS=probed "VERSION=${version}" SOURCE=registry \
                "BINARY_PATH=${bin}" "BINARY_SHA256=$(_claude_sha256 "$bin")" "INSTALL_ROOT=${dest}" \
                "MANIFEST_SHA256=$(_claude_sha256 "$manifest")" "PUBLISHED=${NPMR_PUBLISHED}" \
                "INTEGRITY=${NPMR_INTEGRITY}" "SIGNING_KEYID=${NPMR_SIGNING_KEYID}" \
                "INSTALLED_AT=$(date -u +%FT%TZ)" >/dev/null || {
                    claude_undo_replacement "$SHARED_DIR" "$version"
                    return 1
                }
        else
            cli_log "Claude Code ${version} is already installed and verified; reusing it"
            bin="$(claude_bin_path "$SHARED_DIR" "$version")"
        fi
    fi
    local rc=0
    claude_activate "$SHARED_DIR" "$MODE" "$version" "$bin" "$source" "$SKIP_BACKEND_PROBE" || rc=$?
    if [[ $rc -eq 0 ]]; then
        claude_finish_replacement
    elif [[ $rc -eq 5 ]]; then
        [[ -n "${CLAUDE_REPLACED_BACKUP:-}" ]] && cli_warn "previous installation kept at ${CLAUDE_REPLACED_BACKUP} until setup-cli claude --repair"
    else
        claude_undo_replacement "$SHARED_DIR" "$version"
    fi
    return "$rc"
}

if [[ "$ACTION" == check ]]; then
    [[ "$MODE" == docker ]] && { cli_err "Claude Code coding agents require native deployment; Docker is unavailable"; exit 3; }
    set +e
    claude_status "$SHARED_DIR"
    exit $?
fi
if [[ "$ACTION" == repair ]]; then
    [[ "$MODE" == docker ]] && { cli_err "Claude Code coding agents require native deployment; Docker is unavailable"; exit 3; }
    cli_with_install_lock "$SHARED_DIR" claude_repair "$SHARED_DIR"
    exit $?
fi
if [[ "$ACTION" == prune ]]; then
    [[ "$MODE" == docker ]] && { cli_err "Claude Code coding agents require native deployment; Docker is unavailable"; exit 3; }
    cli_with_install_lock "$SHARED_DIR" claude_prune "$SHARED_DIR" "$PRUNE_APPLY"
    exit $?
fi
if [[ "$PRUNE_APPLY" == true ]]; then
    cli_err "--yes is only valid with --prune"
    exit 2
fi
if [[ "$MODE" == docker ]]; then
    cli_err "Claude Code coding agents require native deployment; Docker is unavailable"
    exit 3
fi
if [[ "$ACTION" == reconfigure ]]; then
    ENV_FILE="$(envf_canonical "${SHARED_DIR}/.env")"
    [[ -f "$ENV_FILE" ]] || { cli_err "no ${SHARED_DIR}/.env yet; install ChengOS first"; exit 1; }
    [[ "$(envf_layout "$SHARED_DIR")" != split ]] || { cli_err ".env layout is split; resolve it first"; exit 1; }
    claude_collect_settings "$ENV_FILE"
    cli_with_install_lock "$SHARED_DIR" claude_reconfigure "$SHARED_DIR"
    exit $?
fi
claude_platform || exit 3

# gnupg, bubblewrap, and the other probe tools are required for Claude to
# install and run. Declining leaves the provider unusable, so install them
# without a second prompt. Codex keeps its own consent check.
CLI_INSTALL_DEPS=true
cli_ensure_tools curl tar gzip openssl base64 sha256sum python3 gpg flock timeout od || exit 3
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
ENV_FILE="$(envf_canonical "${SHARED_DIR}/.env")"
[[ -f "$ENV_FILE" ]] || { cli_err "no ${SHARED_DIR}/.env yet; install ChengOS first"; exit 1; }
[[ "$(envf_layout "$SHARED_DIR")" != split ]] || { cli_err ".env layout is split; resolve it first"; exit 1; }
WORK="$(mktemp -d)"
trap 'rm -rf -- "$WORK"' EXIT

if [[ -n "$REUSE_BIN" ]]; then
    SOURCE=bin
    [[ "$REUSE_BIN" == /* ]] || { cli_err "--bin must be an absolute path"; exit 2; }
    REUSE_BIN="$(readlink -f -- "$REUSE_BIN")"
else
    cli_can_prompt && echo "Resolving Claude Code versions (Linux x86_64)..."
    PACKUMENT="${WORK}/claude-packument.json"
    if ! npmr_fetch_packument "$CLAUDE_PACKAGE" "$PACKUMENT"; then
        cli_err "cannot read npm metadata; nothing was changed"
        exit 1
    fi
    SELECTOR="${EXACT_VERSION:-${POLICY:-stable}}"
    if ! npmr_resolve_package "$PACKUMENT" "$CLAUDE_PACKAGE" "$CLAUDE_MIN_AGE_DAYS" "$SELECTOR" linux x64; then
        cli_err "cannot resolve Claude version '${SELECTOR}'; nothing was changed"
        exit 1
    fi
    if [[ "$NPMR_WITHIN_WINDOW" == true ]]; then
        cli_warn "Claude ${NPMR_VERSION} is newer than the ${CLAUDE_MIN_AGE_DAYS}-day release-age window (explicit version)"
    fi
fi

if cli_can_prompt; then
    echo ""
    echo "Claude Code setup summary"
    if [[ -n "$REUSE_BIN" ]]; then
        echo "    binary:       ${REUSE_BIN} (existing native installation)"
    else
        echo "    version:      ${NPMR_VERSION} (Linux x86_64, published ${NPMR_PUBLISHED})"
        echo "    install to:   $(claude_version_dir "$SHARED_DIR" "$NPMR_VERSION")/bin/claude"
    fi
    echo "    feature:      Claude task mode only"
    if [[ "$ALLOWED_TOOLS_SET" == true ]]; then
        echo "    allowed tools: ${ALLOWED_TOOLS:-<none>}"
    elif _shown="$(envf_get "$ENV_FILE" CHENG_CODING_AGENT_CLAUDE_ALLOWED_TOOLS 2>/dev/null)"; then
        echo "    allowed tools: ${_shown:-<none>}"
    else
        echo "    allowed tools: ${CLAUDE_DEFAULT_ALLOWED_TOOLS}"
    fi
    unset _shown
    echo "    managed auth: $(_claude_flag "$ENV_FILE" CHENG_CODING_AGENT_CLAUDE_MANAGED_AUTH_ENABLED) (separate switch; asked next)"
    echo "    .env:         ${ENV_FILE}"
    if ! cli_confirm "Install and enable Claude Code task mode? [Y/n]: " y; then
        echo "Cancelled; nothing was changed."
        exit 4
    fi
fi
claude_collect_settings "$ENV_FILE"

cli_with_install_lock "$SHARED_DIR" run_setup
