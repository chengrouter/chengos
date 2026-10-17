#!/usr/bin/env bash
#
# Coding-agent CLI deployment router (deployment plan §4–§5).
#
#   bash cli/setup.sh <cli> [options]
#
# Normally reached through `chengos.sh setup-cli <cli> ...` (and the menu
# item / install step built on it), which passes --shared-dir and --mode.
# One pass: select → install and verify (never touches .env) → activate (one
# locked .env transaction). Restarting ChengOS stays with chengos.sh.
#
# Exit status: 0 done (or --check healthy / not configured), 1 failed,
# 2 usage, 3 blocked by the environment (sandbox, Docker gate, platform),
# 4 cancelled or nothing to do, 5 configuration committed to .env but the
# installer's records could not be completed (run --repair).
set -euo pipefail

SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
    cat <<'EOF'
Usage: setup.sh {codex|claude} [options]

Options below are for codex; Claude Code has its own: setup.sh claude --help

  --shared-dir DIR          Installation directory holding .env (default: ..)
  --mode native|docker      Deployment mode (default: recorded mode, else native)
  --version-policy P        stable (default; newest release >= 7 days old) | tested
  --version X.Y.Z           Exact version (also the manual rollback path)
  --bin PATH                Reuse an existing native binary (…/<target>/bin/codex)
  --tier T                  tasks | sessions | chat (default: current, else tasks)
  --enable-credential-auth  Switch an existing legacy-profile deployment to
                            device-code login (irreversible once used)
  --no-credential-auth      New setups only: leave device-code login off
  --enable-web-default-scope
                            Let the platform administrator of a single-user
                            install run coding agents from the web without a
                            CLI session (needs device-code login)
  --no-web-default-scope    Switch the web default scope off
  --close-signup            Set CHENG_SIGNUP_MODE=closed (asked interactively
                            when the web default scope is on and signup open)
  --install-deps            Authorize installing missing system packages
  --skip-backend-probe      Activate on local probes only (recorded)
  --check                   Read-only status report
  --prune [--yes]           Preview (or with --yes, delete) unprotected versions
  --repair                  Reconcile installer records with .env (never edits .env)
  --non-interactive         Never prompt; refuse anything that needs consent
  --lang zh|en              Prompt language
EOF
}

CLI_NAME="${1:-}"
case "$CLI_NAME" in
    codex) shift ;;
    claude) shift; exec bash "${SETUP_DIR}/claude.sh" "$@" ;;
    -h|--help|"") usage; exit 2 ;;
    *) echo "Unsupported coding-agent CLI: ${CLI_NAME} (available: codex, claude)" >&2; exit 2 ;;
esac

SHARED_DIR="$(cd "${SETUP_DIR}/.." && pwd)"
MODE=""
POLICY=""
EXACT_VERSION=""
REUSE_BIN=""
TIER=""
CREDENTIAL_REQUEST=""
WEB_SCOPE_REQUEST=""
SIGNUP_REQUEST=""
SKIP_BACKEND_PROBE=false
ACTION="setup"
PRUNE_APPLY=false
SETUP_LANG="${CHENGOS_LANG:-en}"
export CLI_NONINTERACTIVE="${CLI_NONINTERACTIVE:-false}"
export CLI_INSTALL_DEPS="${CLI_INSTALL_DEPS:-false}"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --shared-dir) SHARED_DIR="${2:?--shared-dir needs a value}"; shift 2 ;;
        --mode) MODE="${2:?--mode needs a value}"; shift 2 ;;
        --version-policy) POLICY="${2:?--version-policy needs a value}"; shift 2 ;;
        --version) EXACT_VERSION="${2:?--version needs a value}"; shift 2 ;;
        --bin) REUSE_BIN="${2:?--bin needs a value}"; shift 2 ;;
        --tier) TIER="${2:?--tier needs a value}"; shift 2 ;;
        --enable-credential-auth) CREDENTIAL_REQUEST="enable"; shift ;;
        --no-credential-auth) CREDENTIAL_REQUEST="disable"; shift ;;
        --enable-web-default-scope) WEB_SCOPE_REQUEST="enable"; shift ;;
        --no-web-default-scope) WEB_SCOPE_REQUEST="disable"; shift ;;
        --close-signup) SIGNUP_REQUEST="close"; shift ;;
        --install-deps) CLI_INSTALL_DEPS=true; shift ;;
        --skip-backend-probe) SKIP_BACKEND_PROBE=true; shift ;;
        --check) ACTION="check"; shift ;;
        --prune) ACTION="prune"; shift ;;
        --repair) ACTION="repair"; shift ;;
        --yes) PRUNE_APPLY=true; shift ;;
        --non-interactive) CLI_NONINTERACTIVE=true; shift ;;
        --lang) SETUP_LANG="${2:?--lang needs a value}"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
    esac
done

case "$POLICY" in ""|stable|tested) ;; *) echo "--version-policy must be stable or tested" >&2; exit 2 ;; esac
case "$TIER" in ""|tasks|sessions|chat) ;; *) echo "--tier must be tasks, sessions or chat" >&2; exit 2 ;; esac
if [[ -n "$EXACT_VERSION" && ! "$EXACT_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "--version must be an exact stable version (X.Y.Z)" >&2
    exit 2
fi
if [[ -n "$REUSE_BIN" && ( -n "$EXACT_VERSION" || -n "$POLICY" ) ]]; then
    echo "--bin cannot be combined with --version or --version-policy" >&2
    exit 2
fi
[[ -d "$SHARED_DIR" ]] || { echo "No such installation directory: ${SHARED_DIR}" >&2; exit 2; }
SHARED_DIR="$(cd "$SHARED_DIR" && pwd -P)"

# Fixed module paths only; nothing derived from user input is ever sourced.
LIB_DIR="${SETUP_DIR}/../lib"
for _lib in env-file.sh cli-common.sh npm-registry.sh; do
    [[ -f "${LIB_DIR}/${_lib}" ]] || { echo "Missing ${LIB_DIR}/${_lib}; refresh the deployment scripts" >&2; exit 1; }
    # shellcheck source=/dev/null
    source "${LIB_DIR}/${_lib}"
done
# shellcheck source=codex.sh
source "${SETUP_DIR}/codex.sh"
unset _lib

if [[ -z "$MODE" ]]; then
    MODE="native"
    for _mf in "${SHARED_DIR}/.chengos_install_mode" "${SHARED_DIR}/../.chengos_install_mode"; do
        if [[ -f "$_mf" ]]; then
            MODE="$(tr -d '[:space:]' < "$_mf")"
            break
        fi
    done
    unset _mf
fi
case "$MODE" in native|docker) ;; *) echo "--mode must be native or docker" >&2; exit 2 ;; esac

msg() {
    # msg KEY — the few interactive strings, in the operator's language.
    local key="$1"
    if [[ "$SETUP_LANG" == "zh" ]]; then
        case "$key" in
            title) echo "== 配置编码智能体 CLI (Codex) ==" ;;
            resolving) echo "正在查询 Codex 版本..." ;;
            pick_version) echo "选择 Codex 版本:" ;;
            opt_stable) echo "最新稳定版 (发布满 ${CODEX_MIN_AGE_DAYS} 天)" ;;
            opt_tested) echo "已测试参考版本" ;;
            opt_exact) echo "输入精确版本号" ;;
            opt_cancel) echo "取消" ;;
            prompt_choice) echo "请选择 [默认 1]: " ;;
            prompt_exact) echo "版本号 (X.Y.Z): " ;;
            pick_tier) echo "功能层级:" ;;
            tier_tasks) echo "一次性任务 (tools/coding_agent_task)" ;;
            tier_sessions) echo "可恢复会话 (需要 single_host 与 HOST_ID)" ;;
            tier_chat) echo "会话 + 直接对话 (chat/coding_agent_chat)" ;;
            prompt_tier) echo "请选择 [默认 %s]: " ;;
            confirm) echo "按以上配置安装并启用 Codex? [Y/n]: " ;;
            cancelled) echo "已取消，未做任何更改。" ;;
            finished) echo "Codex 已安装并完成配置，需要重启 ChengOS 后生效。" ;;
            *) echo "$key" ;;
        esac
    else
        case "$key" in
            title) echo "== Configure Coding-Agent CLI (Codex) ==" ;;
            resolving) echo "Resolving Codex versions..." ;;
            pick_version) echo "Choose the Codex version:" ;;
            opt_stable) echo "Latest stable (published at least ${CODEX_MIN_AGE_DAYS} days ago)" ;;
            opt_tested) echo "Tested reference version" ;;
            opt_exact) echo "Enter an exact version" ;;
            opt_cancel) echo "Cancel" ;;
            prompt_choice) echo "Select [default 1]: " ;;
            prompt_exact) echo "Version (X.Y.Z): " ;;
            pick_tier) echo "Feature tier:" ;;
            tier_tasks) echo "One-shot tasks (tools/coding_agent_task)" ;;
            tier_sessions) echo "Resumable sessions (needs single_host and HOST_ID)" ;;
            tier_chat) echo "Sessions + direct chat (chat/coding_agent_chat)" ;;
            prompt_tier) echo "Select [default %s]: " ;;
            confirm) echo "Install and enable Codex with the settings above? [Y/n]: " ;;
            cancelled) echo "Cancelled; nothing was changed." ;;
            finished) echo "Codex is installed and configured; restart ChengOS to apply it." ;;
            *) echo "$key" ;;
        esac
    fi
}

# ── Read-only and maintenance actions ────────────────────────────────────────

if [[ "$ACTION" == "check" ]]; then
    codex_platform >/dev/null 2>&1 || CODEX_TARGET="x86_64-unknown-linux-musl"
    set +e
    codex_status "$SHARED_DIR" "$MODE"
    exit $?
fi

if [[ "$ACTION" == "repair" ]]; then
    codex_platform >/dev/null 2>&1 || CODEX_TARGET="x86_64-unknown-linux-musl"
    cli_with_install_lock "$SHARED_DIR" codex_repair "$SHARED_DIR"
    exit $?
fi

if [[ "$ACTION" == "prune" ]]; then
    codex_platform || exit 3
    cli_with_install_lock "$SHARED_DIR" codex_prune "$SHARED_DIR" "$PRUNE_APPLY"
    exit $?
fi

# ── Setup ────────────────────────────────────────────────────────────────────

if [[ "$MODE" == "docker" ]]; then
    cat >&2 <<'EOF'
[coding-agent] Docker coding agents are not available.
  The sandbox feasibility gate (deployment plan §7.4) failed under Docker's
  default security policy: bwrap inside the non-root API container cannot
  create its namespaces (reference host, Docker 26.1, 2026-10-13). Docker
  integration stays disabled until the unchanged baseline passes on a host or a
  least-privilege policy is separately reviewed and approved. ChengOS never
  widens container privileges to make this work.

  Evaluate a host:  bash deploy/tests/docker-bwrap-poc.sh --codex-dir <vendor dir>
  Run coding agents: use a native (hybrid) installation.
EOF
    exit 3
fi

codex_platform || exit 3
cli_can_prompt && msg title

cli_ensure_tools curl tar gzip openssl base64 sha256sum python3 flock timeout od || exit 3

if ! cli_native_sandbox_preflight; then
    if [[ "$CLI_SANDBOX_STATUS" == "missing_bwrap" ]]; then
        cli_ensure_tools bwrap || exit 3
        cli_native_sandbox_preflight || true
    fi
    if [[ "$CLI_SANDBOX_STATUS" != "ok" ]]; then
        cli_err "native sandbox unavailable for $(cli_runtime_user): ${CLI_SANDBOX_DETAIL}"
        cli_sandbox_remediation >&2
        exit 3
    fi
fi
cli_log "Native sandbox pre-flight passed for $(cli_runtime_user)"

ENV_FILE="$(envf_canonical "${SHARED_DIR}/.env")"
[[ -f "$ENV_FILE" ]] || { cli_err "no ${SHARED_DIR}/.env yet; install ChengOS first"; exit 1; }
if [[ "$(envf_layout "$SHARED_DIR")" == "split" ]]; then
    cli_err ".env layout is split (${SHARED_DIR}/.env vs env/.env); resolve it before configuring coding agents"
    exit 1
fi

WORK="$(mktemp -d)"
trap 'rm -rf -- "$WORK"' EXIT

# ── A. Select ────────────────────────────────────────────────────────────────

SOURCE="registry"
if [[ -n "$REUSE_BIN" ]]; then
    SOURCE="bin"
    [[ "$REUSE_BIN" == /* ]] || { cli_err "--bin must be an absolute path"; exit 2; }
    REUSE_BIN="$(readlink -f -- "$REUSE_BIN")"
else
    cli_can_prompt && msg resolving
    if ! codex_fetch_metadata "$WORK"; then
        cli_err "cannot read the npm registry metadata (network/TLS); nothing was changed"
        exit 1
    fi
    SELECTOR=""
    if [[ -n "$EXACT_VERSION" ]]; then
        SELECTOR="$EXACT_VERSION"
    elif [[ -n "$POLICY" ]]; then
        SELECTOR="$POLICY"
    elif cli_can_prompt; then
        stable_line="unavailable"
        tested_line="unavailable"
        if codex_resolve stable 2>"${WORK}/why"; then
            stable_line="${NPMR_VERSION} (published ${NPMR_PUBLISHED%%T*})"
        else
            stable_line="unavailable: $(cat "${WORK}/why")"
        fi
        if codex_resolve tested 2>"${WORK}/why"; then
            tested_line="${NPMR_VERSION} (published ${NPMR_PUBLISHED%%T*}, ${NPMR_AGE_DAYS} days old"
            [[ "$NPMR_WITHIN_WINDOW" == "true" ]] && tested_line+=", inside the ${CODEX_MIN_AGE_DAYS}-day window"
            tested_line+=")"
        fi
        echo ""
        msg pick_version
        echo "  1) $(msg opt_stable): ${stable_line}"
        echo "  2) $(msg opt_tested): ${tested_line}"
        echo "     evidence: ${CODEX_TESTED_EVIDENCE}; still probed on this host"
        echo "  3) $(msg opt_exact)"
        echo "  0) $(msg opt_cancel)"
        case "$(cli_ask "$(msg prompt_choice)" 1)" in
            1) SELECTOR="stable" ;;
            2) SELECTOR="tested" ;;
            3) SELECTOR="$(cli_ask "$(msg prompt_exact)" "")" ;;
            *) msg cancelled; exit 4 ;;
        esac
    else
        SELECTOR="stable"
    fi
    if ! codex_resolve "$SELECTOR"; then
        cli_err "cannot resolve Codex version '${SELECTOR}'; nothing was changed"
        exit 1
    fi
    if [[ "$NPMR_WITHIN_WINDOW" == "true" ]]; then
        cli_warn "Codex ${NPMR_VERSION} was published ${NPMR_AGE_DAYS} days ago, inside the ${CODEX_MIN_AGE_DAYS}-day release-age window (explicit choice)"
    fi
fi

CURRENT_TIER="$(codex_current_tier "$ENV_FILE")"
if [[ -z "$TIER" ]]; then
    TIER="$CURRENT_TIER"
    [[ "$TIER" == "none" ]] && TIER="tasks"
    if cli_can_prompt; then
        case "$TIER" in tasks) d=1 ;; sessions) d=2 ;; chat) d=3 ;; esac
        echo ""
        msg pick_tier
        echo "  1) $(msg tier_tasks)"
        echo "  2) $(msg tier_sessions)"
        echo "  3) $(msg tier_chat)"
        # shellcheck disable=SC2059
        case "$(cli_ask "$(printf "$(msg prompt_tier)" "$d")" "$d")" in
            1) TIER="tasks" ;;
            2) TIER="sessions" ;;
            3) TIER="chat" ;;
            *) msg cancelled; exit 4 ;;
        esac
    fi
fi

CREDENTIAL="$(codex_credential_decision "$ENV_FILE" "$CREDENTIAL_REQUEST")"
WEB_SCOPE="$(codex_web_scope_decision "$ENV_FILE" "$WEB_SCOPE_REQUEST" "$CREDENTIAL")" || exit 2
SIGNUP="$(codex_signup_decision "$ENV_FILE" "$SIGNUP_REQUEST" "$WEB_SCOPE")"

echo ""
cli_log "Summary"
if [[ "$SOURCE" == "bin" ]]; then
    echo "    binary:      ${REUSE_BIN} (existing installation)"
else
    echo "    version:     ${NPMR_VERSION} (${CODEX_PLATFORM}, published ${NPMR_PUBLISHED})"
    echo "    install to:  $(codex_version_dir "$SHARED_DIR" "$NPMR_VERSION")/${CODEX_TARGET}"
fi
echo "    tier:        ${TIER} (current: ${CURRENT_TIER})"
case "$CREDENTIAL" in
    true) echo "    device-code login: enabled (CHENG_CREDENTIAL_AUTH_ENABLED=true)" ;;
    keep) echo "    device-code login: unchanged ($(_codex_flag "$ENV_FILE" CHENG_CREDENTIAL_AUTH_ENABLED))" ;;
esac
case "$WEB_SCOPE" in
    on) echo "    web default scope: on (administrator can use coding agents from the web)" ;;
    off) echo "    web default scope: off" ;;
    keep) _codex_scope_on "$ENV_FILE" && echo "    web default scope: on (unchanged)" \
        || echo "    web default scope: off (enable with --enable-web-default-scope)" ;;
esac
if [[ "$SIGNUP" == "closed" ]]; then
    echo "    registration: closed (CHENG_SIGNUP_MODE=closed)"
elif [[ "$WEB_SCOPE" == "on" ]]; then
    echo "    registration: unchanged ($(envf_get "$ENV_FILE" CHENG_SIGNUP_MODE 2>/dev/null || echo 'open'); consider --close-signup)"
fi
echo "    runtime user: $(cli_runtime_user); .env: ${ENV_FILE}"
if cli_can_prompt && ! cli_confirm "$(msg confirm)" y; then
    msg cancelled
    exit 4
fi

# ── B + C under the installer lock ───────────────────────────────────────────

# Marks a probed version without demoting one the configuration uses.
mark_probed() {
    local version="$1" status
    status="$(cli_record_get "$SHARED_DIR" codex "$version" STATUS 2>/dev/null || true)"
    if _codex_status_in_use "$status"; then
        cli_record_set "$SHARED_DIR" codex "$version" "PROBED_AT=$(date -u +%FT%TZ)" >/dev/null
    else
        cli_record_set "$SHARED_DIR" codex "$version" STATUS=probed "PROBED_AT=$(date -u +%FT%TZ)" >/dev/null
    fi
}

run_setup() {
    local version bin
    CODEX_FAILURE_CLASS=""
    if [[ "$SOURCE" == "bin" ]]; then
        bin="$REUSE_BIN"
        if ! codex_probe_local "$bin" ""; then
            cli_err "the existing binary failed its probes (${CODEX_FAILURE_CLASS}); nothing was changed"
            return 1
        fi
        version="$CODEX_PROBED_VERSION"
        local root
        root="$(dirname "$(dirname "$bin")")"
        if [[ -f "${root}/codex-package.json" ]]; then
            npmr_py check-layout "$root" "$version" "$CODEX_TARGET" >/dev/null \
                || { cli_err "the existing installation's layout manifest does not match"; return 1; }
        fi
        cli_record_set "$SHARED_DIR" codex "$version" "VERSION=${version}" SOURCE=bin \
            "BINARY_PATH=${bin}" "TARGET=${CODEX_TARGET}" "BINARY_SHA256=$(_codex_sha256 "$bin")" >/dev/null \
            || { cli_err "cannot write the deployment record"; return 1; }
        if [[ -f "${root}/codex-package.json" ]]; then
            codex_record_tree "$SHARED_DIR" "$version" "$root" "$bin" || return 1
        fi
        mark_probed "$version" || { cli_err "cannot write the deployment record"; return 1; }
    else
        version="$NPMR_VERSION"
        if ! codex_install_version "$SHARED_DIR" "$WORK"; then
            cli_err "installation of Codex ${version} failed (${CODEX_FAILURE_CLASS:-unknown}); nothing was changed"
            return 1
        fi
        bin="$(codex_bin_path "$SHARED_DIR" "$version")"
        if ! codex_probe_local "$bin" "$version"; then
            local class="$CODEX_FAILURE_CLASS"
            codex_undo_replacement "$SHARED_DIR" "$version"
            codex_note_failure "$SHARED_DIR" "$version" "$class"
            cli_err "Codex ${version} failed its probes (${class}); nothing was changed"
            [[ "$class" == "protocol" ]] \
                && cli_log "A different version may help, typically the tested reference: --version-policy tested"
            return 1
        fi
        if ! mark_probed "$version"; then
            codex_undo_replacement "$SHARED_DIR" "$version"
            cli_err "cannot write the deployment record; nothing was changed"
            return 1
        fi
    fi

    # A replaced tree stays recoverable until activation has fully succeeded:
    # the backend probe and the commit still run after the local probes.
    local rc=0
    codex_activate "$SHARED_DIR" "$MODE" "$version" "$bin" "$SOURCE" "$TIER" "$CREDENTIAL" "$SKIP_BACKEND_PROBE" "$WEB_SCOPE" "$SIGNUP" || rc=$?
    if [[ $rc -eq 0 ]]; then
        codex_finish_replacement
    elif [[ $rc -eq 5 ]]; then
        # .env already uses the new tree; keep the old one too until the
        # operator has repaired the records.
        if [[ -n "${CODEX_REPLACED_BACKUP:-}" ]]; then
            cli_err "the replaced copy of ${version} is kept for recovery: ${CODEX_REPLACED_BACKUP} (+ .rec/.manifest); remove it after --repair"
        fi
        return 5
    else
        # Nothing was committed: put the previous copy (and its records) back.
        codex_undo_replacement "$SHARED_DIR" "$version"
    fi
    if [[ $rc -ne 0 ]]; then
        case "$CODEX_FAILURE_CLASS" in
            protocol) cli_log "A different Codex version may help: --version-policy tested or --version X.Y.Z" ;;
            environment|"") cli_log "This is an environment problem; a different Codex version will not fix it." ;;
        esac
        return 1
    fi
    cli_log "$(msg finished)"
}

cli_with_install_lock "$SHARED_DIR" run_setup
