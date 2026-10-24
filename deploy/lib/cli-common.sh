# shellcheck shell=bash
#
# Common layer for coding-agent CLI deployment (deployment plan §4).
#
# Sourced by cli/setup.sh, never executed. Holds what every CLI adapter shares:
# prompts and consent, the installer lock, per-version deployment records,
# runtime-user facts, HOST_ID sourcing, consent-gated distro package recipes,
# and the native sandbox pre-flight. Provider specifics (package source,
# versions, probes, env mapping) live in cli/<provider>.sh.
#
# Requires lib/env-file.sh (records and state files are KEY=VALUE files written
# through the same locked writer as .env).

# shellcheck disable=SC2034  # CLI_SANDBOX_* are read by the callers
: "${CLI_NONINTERACTIVE:=false}"
: "${CLI_INSTALL_DEPS:=false}"

cli_log()  { printf '[coding-agent] %s\n' "$*"; }
cli_warn() { printf '[coding-agent] WARNING: %s\n' "$*" >&2; }
cli_err()  { printf '[coding-agent] ERROR: %s\n' "$*" >&2; }

# ── Prompts ──────────────────────────────────────────────────────────────────

# True when a person can answer. Non-interactive runs never read the terminal.
cli_can_prompt() {
    [[ "$CLI_NONINTERACTIVE" != "true" ]] || return 1
    { : < /dev/tty; } 2>/dev/null
}

# cli_confirm PROMPT [default:n|y] — returns 0 for yes. Without a terminal the
# answer is always the safe "no".
cli_confirm() {
    local prompt="$1" default="${2:-n}" answer=""
    cli_can_prompt || return 1
    read -r -p "$prompt" answer < /dev/tty || return 1
    answer="${answer:-$default}"
    [[ "$answer" =~ ^[Yy]([Ee][Ss])?$ ]]
}

# cli_ask PROMPT DEFAULT — prints the answer (DEFAULT on empty input or when
# nobody can answer).
cli_ask() {
    local prompt="$1" default="$2" answer=""
    if cli_can_prompt; then
        read -r -p "$prompt" answer < /dev/tty || answer=""
    fi
    printf '%s' "${answer:-$default}"
}

# ── Layout, lock, records ────────────────────────────────────────────────────

cli_root() { printf '%s/runtime/cli' "$1"; }

# cli_with_install_lock SHARED CMD... — one installer run at a time per host.
cli_with_install_lock() {
    local shared="$1"; shift
    local root
    root="$(cli_root "$shared")"
    ( umask 077; mkdir -p "$root" ) || { cli_err "cannot create ${root}"; return 1; }
    command -v flock >/dev/null 2>&1 || { cli_err "flock (util-linux) is required"; return 1; }
    (
        exec 8>>"${root}/.install.lock" || exit 1
        if ! flock -n 8; then
            cli_err "another coding-agent installer run holds ${root}/.install.lock"
            exit 1
        fi
        "$@"
    )
}

cli_record_dir() { printf '%s/%s/records' "$(cli_root "$1")" "$2"; }
cli_record_file() { printf '%s/%s.rec' "$(cli_record_dir "$1" "$2")" "$3"; }
cli_state_file() { printf '%s/%s/state' "$(cli_root "$1")" "$2"; }

# cli_record_set SHARED CLI VERSION KEY=VALUE...
cli_record_set() {
    local shared="$1" cli="$2" version="$3"; shift 3
    local dir
    dir="$(cli_record_dir "$shared" "$cli")"
    ( umask 077; mkdir -p "$dir" ) || return 1
    envf_set "$(cli_record_file "$shared" "$cli" "$version")" --section "deployment record" "$@"
}

cli_record_get() {
    envf_get "$(cli_record_file "$1" "$2" "$3")" "$4"
}

# Versions that have a deployment record, newest first.
cli_record_versions() {
    local dir f
    dir="$(cli_record_dir "$1" "$2")"
    [[ -d "$dir" ]] || return 0
    for f in "$dir"/*.rec; do
        [[ -f "$f" ]] || continue
        f="${f##*/}"
        printf '%s\n' "${f%.rec}"
    done | sort -t. -k1,1nr -k2,2nr -k3,3nr
}

cli_state_set() {
    local shared="$1" cli="$2"; shift 2
    ( umask 077; mkdir -p "$(dirname "$(cli_state_file "$shared" "$cli")")" ) || return 1
    envf_set "$(cli_state_file "$shared" "$cli")" --section "installer state" "$@"
}

cli_state_get() {
    envf_get "$(cli_state_file "$1" "$2")" "$3"
}

# ── Runtime user ─────────────────────────────────────────────────────────────

# The native backend runs as the operator who starts ChengOS (hybrid/start.sh
# executes cheng-api directly), so that is the runtime user the installer
# provisions for and probes as.
cli_runtime_user() { id -un; }

cli_runtime_home() {
    if [[ -n "${CHENGOS_CLI_RUNTIME_HOME:-}" ]]; then
        printf '%s' "$CHENGOS_CLI_RUNTIME_HOME"
        return
    fi
    local user home
    user="$(cli_runtime_user)"
    home="$(getent passwd "$user" 2>/dev/null | cut -d: -f6)"
    printf '%s' "${home:-$HOME}"
}

# ── HOST_ID ──────────────────────────────────────────────────────────────────

cli_valid_host_id() {
    [[ "${1:-}" =~ ^[A-Za-z0-9._-]{1,128}$ ]]
}

_cli_uuid() {
    if [[ -r /proc/sys/kernel/random/uuid ]]; then
        cat /proc/sys/kernel/random/uuid
    else
        od -An -tx1 -N16 /dev/urandom | tr -d ' \n'
    fi
}

# cli_new_host_id MODE — native: the host's machine-id, persisted explicitly
# (the backend's own fallback, made visible and stable). Docker, or a missing /
# blank / template machine-id: a generated instance identifier. Never derived
# from hostname, which is renamed and duplicated across cloned images.
cli_new_host_id() {
    local mode="$1" mid=""
    if [[ "$mode" == "native" && -r /etc/machine-id ]]; then
        mid="$(tr -d '[:space:]' < /etc/machine-id)"
        if [[ "$mid" =~ ^[0-9a-f]{32}$ && "$mid" != "00000000000000000000000000000000" ]]; then
            printf '%s' "$mid"
            return 0
        fi
    fi
    printf 'chengos-%s' "$(_cli_uuid)"
}

# ── Package recipes (consent-gated) ──────────────────────────────────────────

cli_package_manager() {
    local pm
    for pm in apt-get dnf yum zypper pacman apk; do
        if command -v "$pm" >/dev/null 2>&1; then
            printf '%s' "$pm"
            return 0
        fi
    done
    return 1
}

# Distro package that provides a tool on a given manager.
cli_package_for() {
    local tool="$1" pm="$2"
    case "$tool" in
        bwrap) printf 'bubblewrap' ;;
        flock) printf 'util-linux' ;;
        base64|sha256sum) printf 'coreutils' ;;
        python3) [[ "$pm" == "pacman" ]] && printf 'python' || printf 'python3' ;;
        # The bare `gpg` package is the binary only. `gpg --import` needs
        # gpg-agent, which the metapackage depends on. apt installs with
        # --no-install-recommends, so the binary package would not pull it.
        gpg)
            case "$pm" in
                dnf|yum) printf 'gnupg2' ;;
                zypper) printf 'gpg2' ;;
                *) printf 'gnupg' ;;
            esac
            ;;
        *) printf '%s' "$tool" ;;
    esac
}

# True when gpg can open a keyring. A binary without gpg-agent exits here,
# which is the failure behind "cannot import Anthropic release signing key".
cli_gpg_usable() {
    local home rc=0
    command -v gpg >/dev/null 2>&1 || return 1
    home="$(mktemp -d "${TMPDIR:-/tmp}/chengos-gpg.XXXXXX")" || return 1
    chmod 700 "$home" || { rm -rf -- "$home"; return 1; }
    gpg --batch --homedir "$home" --list-keys >/dev/null 2>&1 || rc=1
    rm -rf -- "$home"
    return "$rc"
}

# cli_install_packages PKG... — shows the exact command and installs only with
# --install-deps or an explicit interactive yes. Never adds third-party repos
# except EPEL on yum, where bubblewrap lives; that is listed before consent.
cli_install_packages() {
    local -a pkgs=("$@") cmd=()
    local pm sudo=""
    [[ ${#pkgs[@]} -gt 0 ]] || return 0
    if ! pm="$(cli_package_manager)"; then
        cli_err "no supported package manager found; install manually: ${pkgs[*]}"
        return 1
    fi
    [[ "$(id -u)" -eq 0 ]] || sudo="sudo"
    case "$pm" in
        apt-get) cmd=(${sudo:+"$sudo"} apt-get install -y --no-install-recommends "${pkgs[@]}") ;;
        dnf)     cmd=(${sudo:+"$sudo"} dnf install -y "${pkgs[@]}") ;;
        yum)     cmd=(${sudo:+"$sudo"} yum install -y "${pkgs[@]}") ;;
        zypper)  cmd=(${sudo:+"$sudo"} zypper --non-interactive install "${pkgs[@]}") ;;
        pacman)  cmd=(${sudo:+"$sudo"} pacman -S --noconfirm --needed "${pkgs[@]}") ;;
        apk)     cmd=(${sudo:+"$sudo"} apk add --no-cache "${pkgs[@]}") ;;
    esac
    local epel=false
    if [[ "$pm" == "yum" && " ${pkgs[*]} " == *" bubblewrap "* ]] && ! rpm -q epel-release >/dev/null 2>&1; then
        epel=true
    fi

    cli_log "System packages required: ${pkgs[*]}"
    [[ "$epel" == true ]] && cli_log "  bubblewrap is in EPEL on this system: epel-release will be installed first"
    cli_log "  command: ${cmd[*]}"
    if [[ "$CLI_INSTALL_DEPS" != "true" ]]; then
        if ! cli_confirm "Install these system packages now? [y/N]: " n; then
            cli_err "not installing system packages without consent; rerun with --install-deps or install them manually"
            return 1
        fi
    fi
    if [[ "$pm" == "apt-get" ]]; then
        ${sudo:+"$sudo"} apt-get update -qq || { cli_err "apt-get update failed"; return 1; }
    fi
    if [[ "$epel" == true ]]; then
        ${sudo:+"$sudo"} yum install -y epel-release || { cli_err "epel-release installation failed"; return 1; }
    fi
    "${cmd[@]}" || { cli_err "package installation failed"; return 1; }
}

# cli_ensure_tools TOOL... — installs missing tools through the recipes above.
cli_ensure_tools() {
    local -a missing=() pkgs=()
    local tool pm pkg
    for tool in "$@"; do
        if [[ "$tool" == "gpg" ]]; then
            cli_gpg_usable || missing+=("gpg")
            continue
        fi
        command -v "$tool" >/dev/null 2>&1 || missing+=("$tool")
    done
    [[ ${#missing[@]} -gt 0 ]] || return 0
    cli_warn "missing tools: ${missing[*]}"
    if [[ " ${missing[*]} " == *" gpg "* ]] && command -v gpg >/dev/null 2>&1; then
        cli_warn "gpg is present but cannot open a keyring; the gnupg package (with gpg-agent) is required"
    fi
    pm="$(cli_package_manager || true)"
    for tool in "${missing[@]}"; do
        pkg="$(cli_package_for "$tool" "$pm")"
        [[ " ${pkgs[*]} " == *" ${pkg} "* ]] || pkgs+=("$pkg")
    done
    cli_install_packages "${pkgs[@]}" || return 1
    for tool in "${missing[@]}"; do
        if [[ "$tool" == "gpg" ]]; then
            cli_gpg_usable || { cli_err "gpg is still unavailable"; return 1; }
            continue
        fi
        command -v "$tool" >/dev/null 2>&1 || { cli_err "${tool} is still unavailable"; return 1; }
    done
}

# ── Native sandbox pre-flight (plan §6.1) ────────────────────────────────────

_cli_sysctl() { cat "/proc/sys/$1" 2>/dev/null; }

# Arguments shaped like ChengFlow's launcher (pid/ipc/uts namespaces, new
# session, die-with-parent, system dirs read-only, private /proc /dev /tmp).
_cli_bwrap_base_args() {
    local d target
    printf '%s\n' --unshare-pid --unshare-ipc --unshare-uts --new-session --die-with-parent
    for d in /usr /etc; do printf '%s\n' --ro-bind "$d" "$d"; done
    for d in /bin /sbin /lib /lib64; do
        if [[ -L "$d" ]]; then
            target="$(readlink "$d")"
            printf '%s\n' --symlink "$target" "$d"
        elif [[ -d "$d" ]]; then
            printf '%s\n' --ro-bind "$d" "$d"
        fi
    done
    printf '%s\n' --proc /proc --dev /dev --tmpfs /tmp
}

# cli_native_sandbox_preflight — read-only. Prints findings and sets
# CLI_SANDBOX_STATUS (ok | missing_bwrap | blocked) and CLI_SANDBOX_DETAIL.
# Runs as the runtime user (this process), never as a substitute root.
cli_native_sandbox_preflight() {
    CLI_SANDBOX_STATUS="ok"
    CLI_SANDBOX_DETAIL=""
    local bwrap_path mode v
    if ! bwrap_path="$(command -v bwrap 2>/dev/null)"; then
        CLI_SANDBOX_STATUS="missing_bwrap"
        CLI_SANDBOX_DETAIL="bubblewrap (bwrap) is not installed"
        return 1
    fi
    mode="$(stat -c %A "$(readlink -f "$bwrap_path")" 2>/dev/null || echo unknown)"
    if [[ "$mode" == *s* ]]; then
        cli_warn "bwrap at ${bwrap_path} is setuid (${mode}); the sandbox then runs with elevated privileges at setup. Review this deliberately."
    fi

    v="$(_cli_sysctl user/max_user_namespaces)"
    if [[ "$v" == "0" ]]; then
        CLI_SANDBOX_STATUS="blocked"
        CLI_SANDBOX_DETAIL="user.max_user_namespaces is 0 (user namespaces disabled)"
    fi
    v="$(_cli_sysctl kernel/unprivileged_userns_clone)"
    if [[ "$v" == "0" && "$(id -u)" -ne 0 ]]; then
        CLI_SANDBOX_STATUS="blocked"
        CLI_SANDBOX_DETAIL="kernel.unprivileged_userns_clone is 0 (Debian kernel restriction)"
    fi
    local apparmor_restricted=false
    [[ "$(_cli_sysctl kernel/apparmor_restrict_unprivileged_userns)" == "1" ]] && apparmor_restricted=true

    # The kernel settings only predict; a real namespace probe decides.
    local -a args=()
    mapfile -t args < <(_cli_bwrap_base_args)
    local out
    if ! out="$(bwrap "${args[@]}" -- /bin/true 2>&1)"; then
        CLI_SANDBOX_STATUS="blocked"
        if [[ "$apparmor_restricted" == true ]]; then
            CLI_SANDBOX_DETAIL="kernel.apparmor_restrict_unprivileged_userns=1 blocks unprivileged bwrap (${out%%$'\n'*})"
        else
            CLI_SANDBOX_DETAIL="bwrap cannot create its namespaces: ${out%%$'\n'*}"
        fi
    elif [[ "$CLI_SANDBOX_STATUS" == "blocked" ]]; then
        # A sysctl predicted a block but the probe passed (e.g. running as root).
        CLI_SANDBOX_STATUS="ok"
        CLI_SANDBOX_DETAIL=""
    fi
    [[ "$CLI_SANDBOX_STATUS" == "ok" ]]
}

# Distro-specific remediation text for a blocked native sandbox. Nothing here
# is applied automatically: these are host security changes (plan §6.1).
cli_sandbox_remediation() {
    cat <<'EOF'
  The coding-agent sandbox needs unprivileged user namespaces for bwrap.
  Options (each is a host security change you must review and apply yourself):
    - Ubuntu 23.10+: install the distro AppArmor profile that permits bwrap
      (package apparmor-profiles, profile bwrap-userns-restrict), or a local
      profile for /usr/bin/bwrap with `userns,`; then `apparmor_parser -r` it.
    - Debian kernels with kernel.unprivileged_userns_clone=0: set it to 1 in
      /etc/sysctl.d/ and run `sysctl --system`.
    - user.max_user_namespaces=0: raise it in /etc/sysctl.d/.
  This installer never changes sysctls, AppArmor profiles, or bwrap permissions.
EOF
}
