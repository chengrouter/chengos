# shellcheck shell=bash
#
# Codex adapter for coding-agent CLI deployment (deployment plan §5–§8).
#
# Sourced by cli/setup.sh after lib/env-file.sh, lib/cli-common.sh and
# lib/npm-registry.sh. Owns everything Codex-specific: package source, version
# resolution, the vendor layout, probes, and the mapping to the backend's
# CHENG_CODING_AGENT_* / CHENG_CREDENTIAL_AUTH_* keys.

# shellcheck disable=SC2034  # read by cli/setup.sh
CODEX_PACKAGE="@openai/codex"
# Exact version with ChengFlow live evidence. Still re-probed on every host.
CODEX_TESTED_REFERENCE="0.162.0"
CODEX_TESTED_EVIDENCE="ChengFlow coding-agent live suites (resumable sessions, chat, managed credentials) on Linux x86_64, 2026-10"
CODEX_MIN_AGE_DAYS="${CHENGOS_CLI_MIN_RELEASE_AGE_DAYS:-7}"
CODEX_ENV_SECTION="Coding agent (Codex) - managed by chengos.sh setup-cli"

# ── Platform ─────────────────────────────────────────────────────────────────

# Sets CODEX_PLATFORM (npm platform build suffix), CODEX_TARGET (vendor triple)
# and CODEX_ELF_MACHINE (ELF e_machine bytes). Only verified paths are allowed:
# x86_64 today; ARM64 once its package and image paths are tested (plan §6.1).
codex_platform() {
    case "$(uname -s)/$(uname -m)" in
        Linux/x86_64)
            CODEX_PLATFORM="linux-x64"
            CODEX_TARGET="x86_64-unknown-linux-musl"
            CODEX_ELF_MACHINE="3e00"
            ;;
        Linux/aarch64|Linux/arm64)
            cli_err "Linux ARM64 is not a verified coding-agent platform yet (deployment plan §6.1)"
            return 1
            ;;
        *)
            cli_err "unsupported platform $(uname -s)/$(uname -m); coding agents need Linux x86_64"
            return 1
            ;;
    esac
}

codex_versions_dir() { printf '%s/codex/versions' "$(cli_root "$1")"; }
codex_version_dir() { printf '%s/%s' "$(codex_versions_dir "$1")" "$2"; }
codex_bin_path() { printf '%s/%s/bin/codex' "$(codex_version_dir "$1" "$2")" "$CODEX_TARGET"; }

_codex_sha256() { sha256sum "$1" | awk '{print $1}'; }

# ── Version resolution ───────────────────────────────────────────────────────

# codex_fetch_metadata WORKDIR — fetches the packument once into WORKDIR.
codex_fetch_metadata() {
    CODEX_PACKUMENT="${1}/packument.json"
    [[ -s "$CODEX_PACKUMENT" ]] && return 0
    npmr_fetch_packument "$CODEX_PACKAGE" "$CODEX_PACKUMENT"
}

# codex_resolve SELECTOR — stable | tested | X.Y.Z. Sets the NPMR_* fields.
codex_resolve() {
    local selector="$1"
    [[ "$selector" == "tested" ]] && selector="$CODEX_TESTED_REFERENCE"
    npmr_resolve "$CODEX_PACKUMENT" "$CODEX_PLATFORM" "$CODEX_MIN_AGE_DAYS" "$selector"
}

# ── Install and verify (stage B; never touches .env) ─────────────────────────

# ── Integrity manifest ───────────────────────────────────────────────────────
#
# Every installed tree gets a SHA-256 manifest of ALL its files (binary,
# codex-path/rg, codex-resources/…), kept next to its deployment record, so a
# later change to any companion file is detected, not only to bin/codex.

codex_manifest_file() { printf '%s/%s.manifest' "$(cli_record_dir "$1" codex)" "$2"; }

# _codex_write_manifest ROOT OUT — sorted `sha256  ./relative/path` lines.
_codex_write_manifest() {
    local root="$1" out="$2" tmp
    tmp="$(mktemp "${out}.XXXXXX")" || return 1
    if ! ( cd "$root" && find . -type f -print0 | LC_ALL=C sort -z | xargs -0 -r sha256sum ) > "$tmp"; then
        rm -f -- "$tmp"
        return 1
    fi
    [[ -s "$tmp" ]] || { rm -f -- "$tmp"; return 1; }
    mv -f -- "$tmp" "$out"
}

# codex_verify_tree SHARED VERSION — 0 intact, 1 changed (prints what), 2 no
# manifest (older record: falls back to the recorded binary checksum).
codex_verify_tree() {
    local shared="$1" version="$2" manifest root expected_files actual_files bad
    manifest="$(codex_manifest_file "$shared" "$version")"
    root="$(cli_record_get "$shared" codex "$version" MANIFEST_ROOT 2>/dev/null || true)"
    if [[ ! -f "$manifest" || -z "$root" ]]; then
        local bin sha
        bin="$(cli_record_get "$shared" codex "$version" BINARY_PATH 2>/dev/null || codex_bin_path "$shared" "$version")"
        sha="$(cli_record_get "$shared" codex "$version" BINARY_SHA256 2>/dev/null)" || return 2
        [[ -f "$bin" && "$(_codex_sha256 "$bin")" == "$sha" ]] && return 2
        echo "bin/codex differs from the recorded checksum"
        return 1
    fi
    [[ -d "$root" ]] || { echo "${root} is missing"; return 1; }
    local recorded_sum
    recorded_sum="$(cli_record_get "$shared" codex "$version" MANIFEST_SHA256 2>/dev/null || true)"
    if [[ -n "$recorded_sum" && "$(_codex_sha256 "$manifest")" != "$recorded_sum" ]]; then
        echo "the manifest itself was modified"
        return 1
    fi
    bad="$(cd "$root" && sha256sum --quiet -c "$manifest" 2>&1 | head -n 5)"
    if [[ -n "$bad" ]]; then
        printf '%s\n' "$bad"
        return 1
    fi
    expected_files="$(awk '{ $1=""; sub(/^ +/, ""); print }' "$manifest")"
    actual_files="$(cd "$root" && find . -type f -print | LC_ALL=C sort)"
    if [[ "$expected_files" != "$actual_files" ]]; then
        comm -13 <(printf '%s\n' "$expected_files") <(printf '%s\n' "$actual_files") | head -n 5 \
            | sed 's/^/unexpected file: /'
        comm -23 <(printf '%s\n' "$expected_files") <(printf '%s\n' "$actual_files") | head -n 5 \
            | sed 's/^/missing file: /'
        return 1
    fi
    return 0
}

# codex_record_tree SHARED VERSION ROOT BIN — writes the manifest and the
# checksum fields of the record.
codex_record_tree() {
    local shared="$1" version="$2" root="$3" bin="$4" manifest
    manifest="$(codex_manifest_file "$shared" "$version")"
    ( umask 077; mkdir -p "$(dirname "$manifest")" ) || return 1
    _codex_write_manifest "$root" "$manifest" || { cli_err "cannot write ${manifest}"; return 1; }
    cli_record_set "$shared" codex "$version" "MANIFEST_ROOT=${root}" \
        "MANIFEST_SHA256=$(_codex_sha256 "$manifest")" "BINARY_SHA256=$(_codex_sha256 "$bin")" >/dev/null
}

# Statuses that mean "the configuration uses (or may roll back to) this
# version": never downgraded by a reinstall, a probe, or a failure.
_codex_status_in_use() {
    case "${1:-}" in active|previous) return 0 ;; *) return 1 ;; esac
}

# codex_note_failure SHARED VERSION STAGE — records a failure without
# demoting a version the configuration uses.
codex_note_failure() {
    local shared="$1" version="$2" stage="$3" status
    status="$(cli_record_get "$shared" codex "$version" STATUS 2>/dev/null || true)"
    if _codex_status_in_use "$status"; then
        cli_record_set "$shared" codex "$version" "LAST_FAILURE_STAGE=${stage}" \
            "LAST_FAILED_AT=$(date -u +%FT%TZ)" >/dev/null 2>&1 || true
    else
        cli_record_set "$shared" codex "$version" STATUS=failed "FAILURE_STAGE=${stage}" \
            "FAILED_AT=$(date -u +%FT%TZ)" >/dev/null 2>&1 || true
    fi
}

# True when VERSION is installed, recorded as verified, and its whole tree
# still matches the recorded manifest.
codex_version_reusable() {
    local shared="$1" version="$2" status rc=0
    status="$(cli_record_get "$shared" codex "$version" STATUS 2>/dev/null)" || return 1
    case "$status" in installed|probed|active|previous|retired) ;; *) return 1 ;; esac
    [[ -x "$(codex_bin_path "$shared" "$version")" ]] || return 1
    codex_verify_tree "$shared" "$version" >/dev/null || rc=$?
    [[ $rc -eq 0 || $rc -eq 2 ]]
}

# codex_install_version SHARED WORKDIR — installs the resolved NPMR_VERSION
# into versions/<version>/<target>/ after integrity, signature, archive and
# layout checks. Everything happens in a staging directory first; an existing
# directory for the same version (e.g. a corrupted copy the configuration still
# points to) is never deleted up front: it is renamed aside and only discarded
# by codex_finish_replacement after the new tree passed its probes, or put back
# by codex_undo_replacement. Sets CODEX_REPLACED_BACKUP when a swap happened.
codex_install_version() {
    local shared="$1" work="$2"
    local version="$NPMR_VERSION"
    local versions dest staging tgz prior_status=""
    CODEX_REPLACED_BACKUP=""
    versions="$(codex_versions_dir "$shared")"
    dest="$(codex_version_dir "$shared" "$version")"

    if codex_version_reusable "$shared" "$version"; then
        cli_log "Codex ${version} is already installed and verified; reusing it"
        return 0
    fi
    if [[ -e "$dest" ]]; then
        prior_status="$(cli_record_get "$shared" codex "$version" STATUS 2>/dev/null || true)"
        if [[ -z "$prior_status" ]]; then
            cli_err "${dest} exists but has no deployment record; refusing to touch a directory this installer does not own"
            return 1
        fi
        cli_warn "${dest} (status: ${prior_status}) failed verification; a fresh copy will be staged and swapped in only after it verifies"
    fi

    ( umask 022; mkdir -p "$versions" ) || { cli_err "cannot create ${versions}"; return 1; }
    staging="$(mktemp -d "${versions}/.staging-${version}.XXXXXX")" || return 1
    tgz="${work}/codex-${NPMR_PLATFORM_VERSION}.tgz"

    cli_log "Downloading ${CODEX_PACKAGE}@${NPMR_PLATFORM_VERSION}"
    if ! npmr_fetch "$NPMR_TARBALL" "$tgz" \
        || ! npmr_verify_integrity "$tgz" "$NPMR_INTEGRITY" \
        || ! npmr_verify_signature "$CODEX_PACKAGE" "$NPMR_PLATFORM_VERSION" "$NPMR_INTEGRITY" "$NPMR_PUBLISHED"; then
        rm -rf -- "$staging"
        codex_note_failure "$shared" "$version" download
        CODEX_FAILURE_CLASS="download"
        return 1
    fi
    cli_log "Integrity and registry signature verified (key ${NPMR_SIGNING_KEYID})"

    mkdir -p "${staging}/x" "${staging}/final"
    local layout
    if ! npmr_extract "$tgz" "$CODEX_TARGET" "${staging}/x" \
        || ! mv -- "${staging}/x/package/vendor/${CODEX_TARGET}" "${staging}/final/${CODEX_TARGET}" \
        || ! layout="$(npmr_py check-layout "${staging}/final/${CODEX_TARGET}" "$version" "$CODEX_TARGET")"; then
        rm -rf -- "$staging"
        codex_note_failure "$shared" "$version" layout
        CODEX_FAILURE_CLASS="layout"
        return 1
    fi
    chmod -R go-w "${staging}/final"

    # Swap: the old tree (if any) is renamed aside, never deleted here.
    local rec backup=""
    rec="$(cli_record_file "$shared" codex "$version")"
    if [[ -e "$dest" ]]; then
        backup="$(mktemp -d "${versions}/.replaced-${version}.XXXXXX")" || { rm -rf -- "$staging"; return 1; }
        rmdir -- "$backup"
        # The record and manifest are copied FIRST and must succeed: a backup
        # tree without its matching metadata could not be restored faithfully,
        # so a failed copy means no swap at all.
        local manifest_file
        manifest_file="$(codex_manifest_file "$shared" "$version")"
        if ! cp -p -- "$rec" "${backup}.rec" \
            || { [[ -f "$manifest_file" ]] && ! cp -p -- "$manifest_file" "${backup}.manifest"; }; then
            rm -f -- "${backup}.rec" "${backup}.manifest"
            rm -rf -- "$staging"
            cli_err "cannot back up the deployment record of ${version}; nothing was changed"
            return 1
        fi
        if ! mv -T -- "$dest" "$backup"; then
            rm -f -- "${backup}.rec" "${backup}.manifest"
            rm -rf -- "$staging"
            cli_err "cannot move the existing ${dest} aside; nothing was changed"
            return 1
        fi
    fi
    if ! mv -T -- "${staging}/final" "$dest"; then
        [[ -n "$backup" ]] && mv -T -- "$backup" "$dest"
        rm -rf -- "$staging"
        cli_err "cannot move the verified build into ${dest}; the previous copy was kept"
        return 1
    fi
    rm -rf -- "$staging"
    CODEX_REPLACED_BACKUP="$backup"

    local bin new_status=installed
    bin="$(codex_bin_path "$shared" "$version")"
    _codex_status_in_use "$prior_status" && new_status="$prior_status"
    if ! cli_record_set "$shared" codex "$version" \
            "STATUS=${new_status}" "VERSION=${version}" SOURCE=registry "PACKAGE=${CODEX_PACKAGE}" \
            "PLATFORM_VERSION=${NPMR_PLATFORM_VERSION}" "TARGET=${CODEX_TARGET}" \
            "TARBALL=${NPMR_TARBALL}" "INTEGRITY=${NPMR_INTEGRITY}" \
            "SIGNING_KEYID=${NPMR_SIGNING_KEYID}" "ATTESTATIONS=${NPMR_ATTESTATIONS}" \
            "PUBLISHED=${NPMR_PUBLISHED}" "LAYOUT_VERSION=$(sed -n 's/^layout_version=//p' <<<"$layout")" \
            "INSTALLED_AT=$(date -u +%FT%TZ)" -FAILURE_STAGE -FAILURE_REASON >/dev/null \
        || ! codex_record_tree "$shared" "$version" "$dest" "$bin"; then
        cli_err "cannot record the installed build"
        codex_undo_replacement "$shared" "$version"
        return 1
    fi
    cli_log "Installed Codex ${version} into ${dest}"
}

# Discards the tree a reinstall replaced. Called only once the new tree is
# fully activated (local and backend probes passed, .env and records written).
codex_finish_replacement() {
    [[ -n "${CODEX_REPLACED_BACKUP:-}" ]] || return 0
    rm -rf -- "$CODEX_REPLACED_BACKUP" "${CODEX_REPLACED_BACKUP}.rec" "${CODEX_REPLACED_BACKUP}.manifest"
    CODEX_REPLACED_BACKUP=""
}

# Puts back the tree (and its record/manifest) a failed reinstall replaced, so
# a configuration pointing at this version keeps pointing at existing files.
codex_undo_replacement() {
    local shared="$1" version="$2" dest
    [[ -n "${CODEX_REPLACED_BACKUP:-}" ]] || return 0
    dest="$(codex_version_dir "$shared" "$version")"
    rm -rf -- "$dest"
    if mv -T -- "$CODEX_REPLACED_BACKUP" "$dest"; then
        [[ -f "${CODEX_REPLACED_BACKUP}.rec" ]] \
            && mv -f -- "${CODEX_REPLACED_BACKUP}.rec" "$(cli_record_file "$shared" codex "$version")"
        if [[ -f "${CODEX_REPLACED_BACKUP}.manifest" ]]; then
            mv -f -- "${CODEX_REPLACED_BACKUP}.manifest" "$(codex_manifest_file "$shared" "$version")"
        fi
        cli_log "Restored the previous copy of ${dest}"
    else
        cli_err "could not restore ${dest} from ${CODEX_REPLACED_BACKUP}; restore it by hand"
    fi
    CODEX_REPLACED_BACKUP=""
}

# ── Probes (plan §8) ─────────────────────────────────────────────────────────

# Layer 3: token-free app-server `initialize` (no login, no model call) with a
# throwaway CODEX_HOME. Prints the response line on success.
codex_handshake() {
    local bin="$1" timeout="${2:-30}"
    local work line="" got="" in_fd out_fd pid
    work="$(mktemp -d)" || return 1
    mkdir -p "${work}/home" "${work}/cwd"
    local req='{"id":1,"method":"initialize","params":{"clientInfo":{"name":"chengos-installer","title":"ChengOS installer","version":"1"},"capabilities":{"experimentalApi":true}}}'
    coproc CODEX_PROBE {
        cd "${work}/cwd" && CODEX_HOME="${work}/home" exec timeout "$timeout" \
            "$bin" app-server -c 'cli_auth_credentials_store="file"' 2>"${work}/stderr"
    }
    in_fd="${CODEX_PROBE[1]}"
    out_fd="${CODEX_PROBE[0]}"
    pid="$CODEX_PROBE_PID"
    printf '%s\n' "$req" 1>&"$in_fd" || true
    local deadline=$((SECONDS + timeout))
    while ((SECONDS < deadline)); do
        IFS= read -r -t "$((deadline - SECONDS))" line <&"$out_fd" || break
        if [[ "$line" == *'"id":1'* ]]; then
            got="$line"
            break
        fi
    done
    # Close our end of stdin so app-server exits. The braces scope the stderr
    # redirect: on a bare `exec` it would silence this shell for good.
    { exec {in_fd}>&-; } 2>/dev/null || true
    kill "$pid" 2>/dev/null || true
    wait "$pid" 2>/dev/null || true
    local err
    err="$(head -c 300 "${work}/stderr" 2>/dev/null | tr '\n' ' ')"
    rm -rf -- "$work"
    if [[ "$got" == *'"result"'* ]]; then
        printf '%s\n' "$got"
        return 0
    fi
    cli_err "app-server initialize failed${got:+: ${got:0:200}}${err:+ (stderr: ${err})}"
    return 1
}

# codex_probe_local BIN EXPECTED_VERSION — layers 1–3 without ChengOS running.
# Sets CODEX_FAILURE_CLASS (layout | protocol) and CODEX_PROBED_VERSION.
codex_probe_local() {
    local bin="$1" expected="${2:-}"
    local dir machine out
    CODEX_FAILURE_CLASS=""
    CODEX_PROBED_VERSION=""
    if _codex_fault localprobe; then
        cli_err "injected local probe failure (test hook)"; CODEX_FAILURE_CLASS="protocol"; return 1
    fi
    # Layer 1: path, architecture, accompanying resources.
    if [[ ! -f "$bin" || ! -x "$bin" ]]; then
        cli_err "${bin} is not an executable file"; CODEX_FAILURE_CLASS="layout"; return 1
    fi
    case "$bin" in *.js|*.mjs|*.cjs) cli_err "${bin} is the npm launcher, not the native binary"; CODEX_FAILURE_CLASS="layout"; return 1 ;; esac
    machine="$(od -An -tx1 -j18 -N2 "$bin" 2>/dev/null | tr -d ' \n')"
    if [[ "${CHENGOS_NPM_TEST_INSECURE:-0}" == "1" && "${CHENGOS_CODEX_TEST_SCRIPT_BINARY:-0}" == "1" ]]; then
        : # test hook: fixture binaries are scripts
    elif [[ "$(head -c4 "$bin" | od -An -tx1 | tr -d ' \n')" != "7f454c46" || "$machine" != "$CODEX_ELF_MACHINE" ]]; then
        cli_err "${bin} is not a native ${CODEX_TARGET} executable"; CODEX_FAILURE_CLASS="layout"; return 1
    fi
    dir="$(dirname "$(dirname "$bin")")"
    if [[ "$(basename "$(dirname "$bin")")" == "bin" && ! -d "${dir}/codex-path" ]]; then
        cli_warn "${dir}/codex-path is missing; the sandbox PATH helpers (rg) will be unavailable"
    fi
    # Layer 2: version, run as the runtime user (this process).
    if ! out="$(timeout 30 "$bin" --version 2>&1)"; then
        cli_err "\`codex --version\` failed: ${out:0:200}"; CODEX_FAILURE_CLASS="protocol"; return 1
    fi
    CODEX_PROBED_VERSION="${out##* }"
    if [[ -n "$expected" && "$CODEX_PROBED_VERSION" != "$expected" ]]; then
        cli_err "binary reports version ${CODEX_PROBED_VERSION}, expected ${expected}"; CODEX_FAILURE_CLASS="layout"; return 1
    fi
    # Layer 3: protocol handshake.
    if ! codex_handshake "$bin" 30 >/dev/null; then
        CODEX_FAILURE_CLASS="protocol"; return 1
    fi
    cli_log "Local probes passed: native ${CODEX_TARGET} binary, codex-cli ${CODEX_PROBED_VERSION}, app-server handshake"
}

# codex_backend_probe SHARED ENV_FILE KEY=VALUE... — layer 4: the backend's own
# `cheng-api admin coding-agent-probe` with the candidate configuration, i.e.
# the real config validation, Bubblewrap launcher and mounts. Sets
# CODEX_FAILURE_CLASS (environment | protocol) on failure; returns 2 when the
# installed backend predates the probe.
codex_backend_probe() {
    local shared="$1" env_file="$2"; shift 2
    local api="${shared}/bin/cheng-api" out rc work
    if [[ ! -x "$api" ]]; then
        cli_warn "cheng-api is not installed at ${api}; the backend sandbox probe cannot run yet"
        return 2
    fi
    if ! "$api" admin --help 2>/dev/null | grep -q 'coding-agent-probe'; then
        cli_warn "the installed cheng-api predates \`admin coding-agent-probe\`; update ChengOS to run the backend sandbox probe"
        return 2
    fi
    work="$(mktemp -d)" || return 1
    set +e
    out="$(
        cd "$work" || exit 1
        set -a
        # shellcheck disable=SC1090
        [[ -f "$env_file" ]] && source "$env_file"
        set +a
        for kv in "$@"; do export "${kv?}"; done
        "$api" admin coding-agent-probe --timeout-secs 30 2>&1
    )"
    rc=$?
    set -e
    rm -rf -- "$work"
    printf '%s\n' "$out" | sed 's/^/    /'
    if [[ $rc -eq 0 && "$out" == *"result: ok"* ]]; then
        return 0
    fi
    case "$out" in
        *"stage=handshake"*) CODEX_FAILURE_CLASS="protocol" ;;
        *) CODEX_FAILURE_CLASS="environment" ;;
    esac
    return 1
}

# ── Activation (stage C) ─────────────────────────────────────────────────────

_codex_flag() {
    local v
    v="$(envf_get "$1" "$2" 2>/dev/null)" || { printf 'unset'; return; }
    case "${v,,}" in 1|true|yes) printf 'true' ;; *) printf 'false' ;; esac
}

# Current tier from .env: none | tasks | sessions | chat.
codex_current_tier() {
    local env_file="$1"
    [[ "$(_codex_flag "$env_file" CHENG_CODING_AGENT_ENABLED)" == "true" ]] || { printf 'none'; return; }
    if [[ "$(_codex_flag "$env_file" CHENG_CODING_AGENT_RESUMABLE_ENABLED)" == "true" ]]; then
        if [[ "$(_codex_flag "$env_file" CHENG_CODING_AGENT_CHAT_ENABLED)" == "true" ]]; then
            printf 'chat'
        else
            printf 'sessions'
        fi
    else
        printf 'tasks'
    fi
}

# codex_validate_paths STATE ROOT SHARED — fail-closed path rules mirroring the
# backend's config validation plus the plan's placement rules.
codex_validate_paths() {
    local state="$1" root="$2" shared="$3" p
    for p in "$state" "$root"; do
        [[ "$p" == /* ]] || { cli_err "${p} must be an absolute path"; return 1; }
        [[ "$p" != *:* ]] || { cli_err "${p} must not contain ':' (the backend splits paths on it)"; return 1; }
        [[ "$p" != "/" ]] || { cli_err "the filesystem root cannot be used"; return 1; }
        [[ "$(readlink -f -- "$p")" == "$p" ]] || { cli_err "${p} is or passes through a symlink; use its real path"; return 1; }
    done
    case "$root/" in "$state"/*) cli_err "the working root must not be inside the state directory"; return 1 ;; esac
    case "$state/" in "$root"/*) cli_err "the state directory must not be inside the working root"; return 1 ;; esac
    case "$state/" in "$shared"/*) cli_err "the state directory must live outside the installation (${shared})"; return 1 ;; esac
    local home
    home="$(cli_runtime_home)"
    for p in "$shared" "$home" /root /home /chengos; do
        [[ "$root" != "$p" ]] || { cli_err "${root} is too broad for a coding-agent working root"; return 1; }
    done
}

# codex_credential_decision ENV_FILE REQUESTED — prints true | false | keep.
# REQUESTED: "" (default policy), enable, disable.
codex_credential_decision() {
    local env_file="$1" requested="$2" current enabled
    current="$(_codex_flag "$env_file" CHENG_CREDENTIAL_AUTH_ENABLED)"
    enabled="$(_codex_flag "$env_file" CHENG_CODING_AGENT_ENABLED)"
    if [[ "$current" == "true" ]]; then
        # Never disabled automatically: one-way once a credential is published.
        printf 'true'
        return
    fi
    if [[ "$enabled" == "true" ]]; then
        # Existing legacy-profile deployment (plan §7.1): explicit consent only.
        if [[ "$requested" == "enable" ]]; then
            printf 'true'
            return
        fi
        if [[ "$requested" != "disable" ]] && cli_can_prompt; then
            {
                echo ""
                echo "  This deployment runs coding agents with operator-provisioned profiles"
                echo "  (CHENG_CREDENTIAL_AUTH_ENABLED is ${current})."
                echo "  Switching to browser device-code login (managed credentials):"
                echo "    - workflows that select a profile by name stop working;"
                echo "    - every user re-authorizes in the UI credential settings;"
                echo "    - once a managed credential is published, the switch is IRREVERSIBLE:"
                echo "      turning it off later disables coding agents instead of restoring profiles."
            } >&2
            if cli_confirm "  Enable managed credentials now? [y/N]: " n; then
                printf 'true'
                return
            fi
        fi
        printf 'keep'
        return
    fi
    # New coding-agent setup: device-code login is the confirmed default.
    if [[ "$requested" == "disable" ]]; then
        printf 'keep'
    else
        printf 'true'
    fi
}

# codex_activate SHARED MODE VERSION BIN SOURCE TIER CREDENTIAL SKIP_PROBE
# Provisions directories, runs the backend probe, then commits every key of
# the selected tier in ONE locked .env transaction. Nothing is written when a
# check fails.
codex_activate() {
    local shared="$1" mode="$2" version="$3" bin="$4" source="$5" tier="$6" credential="$7" skip_probe="$8"
    local env_file state root host_id previous
    env_file="$(envf_canonical "${shared}/.env")"
    [[ -f "$env_file" ]] || { cli_err "no ${shared}/.env yet; install ChengOS first"; return 1; }

    state="$(envf_get "$env_file" CHENG_CODING_AGENT_STATE_DIR 2>/dev/null || true)"
    root="$(envf_get "$env_file" CHENG_CODING_AGENT_DEDICATED_ROOTS 2>/dev/null || true)"
    root="${root%%:*}"
    [[ -n "$state" ]] || state="$(cli_runtime_home)/.local/share/cheng/agent-state"
    [[ -n "$root" ]] || root="${shared}/workspace/coding-agent"
    ( umask 077; mkdir -p "$state" "$root" ) || { cli_err "cannot create ${state} or ${root}"; return 1; }
    chmod 0700 "$state" 2>/dev/null || true
    state="$(readlink -f -- "$state")"
    root="$(readlink -f -- "$root")"
    codex_validate_paths "$state" "$root" "$(readlink -f -- "$shared")" || { CODEX_FAILURE_CLASS="environment"; return 1; }

    local -a keys=(
        CHENG_CODING_AGENT_ENABLED=true
        "CHENG_CODING_AGENT_CODEX_BIN=${bin}"
        "CHENG_CODING_AGENT_STATE_DIR=${state}"
        "CHENG_CODING_AGENT_DEDICATED_ROOTS=$(envf_get "$env_file" CHENG_CODING_AGENT_DEDICATED_ROOTS 2>/dev/null || printf '%s' "$root")"
        "CHENGOS_CODEX_VERSION=${version}"
    )
    local need_host_id=false
    case "$tier" in
        tasks)
            keys+=(-CHENG_CODING_AGENT_RESUMABLE_ENABLED -CHENG_CODING_AGENT_CHAT_ENABLED)
            ;;
        sessions)
            keys+=(CHENG_CODING_AGENT_RESUMABLE_ENABLED=true CHENG_CODING_AGENT_DEPLOYMENT=single_host -CHENG_CODING_AGENT_CHAT_ENABLED)
            need_host_id=true
            ;;
        chat)
            keys+=(CHENG_CODING_AGENT_RESUMABLE_ENABLED=true CHENG_CODING_AGENT_DEPLOYMENT=single_host CHENG_CODING_AGENT_CHAT_ENABLED=true)
            need_host_id=true
            ;;
        *) cli_err "unknown tier ${tier}"; return 1 ;;
    esac
    case "$credential" in
        true) keys+=(CHENG_CREDENTIAL_AUTH_ENABLED=true); need_host_id=true ;;
        keep) ;;
        *) cli_err "unknown credential decision ${credential}"; return 1 ;;
    esac
    # Managed credentials and resumable sessions both bind to the host
    # identity, so it is written whenever either is on, and preserved always.
    host_id="$(envf_get "$env_file" CHENG_CODING_AGENT_HOST_ID 2>/dev/null || true)"
    if [[ "$need_host_id" == true ]]; then
        if [[ -z "$host_id" ]]; then
            host_id="$(cli_new_host_id "$mode")"
            keys+=("CHENG_CODING_AGENT_HOST_ID=${host_id}")
        fi
        cli_valid_host_id "$host_id" || { cli_err "CHENG_CODING_AGENT_HOST_ID '${host_id}' is invalid ([A-Za-z0-9._-], at most 128)"; return 1; }
    fi

    # Layer 4 with exactly the values about to be committed.
    local -a probe_env=()
    local kv
    for kv in "${keys[@]}"; do [[ "$kv" == -* ]] || probe_env+=("$kv"); done
    if [[ "$skip_probe" == "true" ]]; then
        cli_warn "backend sandbox probe skipped on request (--skip-backend-probe); recorded in the deployment record"
    else
        cli_log "Backend sandbox probe (cheng-api admin coding-agent-probe)..."
        local rc=0
        codex_backend_probe "$shared" "$env_file" "${probe_env[@]}" || rc=$?
        if [[ $rc -eq 2 ]]; then
            cli_err "the backend sandbox probe is required before activation; install/update ChengOS first, or pass --skip-backend-probe to accept the local probes only"
            CODEX_FAILURE_CLASS="environment"
            return 1
        elif [[ $rc -ne 0 ]]; then
            cli_err "backend sandbox probe failed (${CODEX_FAILURE_CLASS:-environment}); nothing was changed"
            return 1
        fi
    fi

    previous="$(cli_state_get "$shared" codex CONFIGURED_VERSION 2>/dev/null \
        || envf_get "$env_file" CHENGOS_CODEX_VERSION 2>/dev/null || true)"
    local now
    now="$(date -u +%FT%TZ)"

    # 1. Pre-commit marker. If the installer's own state cannot be written,
    #    stop here, before .env changes (disk full, permissions, read-only fs).
    if _codex_fault precommit || ! cli_state_set "$shared" codex "ACTIVATING=${version}" "ACTIVATING_AT=${now}" >/dev/null; then
        cli_err "cannot write the installer state under $(cli_root "$shared")/codex; nothing was changed"
        CODEX_FAILURE_CLASS="environment"
        return 1
    fi

    # 2. The configuration itself: one locked .env transaction.
    if ! envf_set "$env_file" --section "$CODEX_ENV_SECTION" "${keys[@]}"; then
        cli_state_set "$shared" codex -ACTIVATING -ACTIVATING_AT >/dev/null 2>&1 || true
        cli_err ".env was not changed"
        CODEX_FAILURE_CLASS="environment"
        return 1
    fi
    cli_log "Committed to ${env_file}:"
    for kv in "${keys[@]}"; do
        case "$kv" in
            -*) printf '    cleared %s\n' "${kv#-}" ;;
            *) printf '    %s\n' "$kv" ;;
        esac
    done

    # 3. Bookkeeping. Every write is checked; a failure here leaves a committed
    #    configuration with incomplete records, which is reported as such
    #    (status 5) and repaired by `--repair` (records follow .env).
    local failed=""
    if [[ -n "$previous" && "$previous" != "$version" ]]; then
        local v
        # Only one rollback target is retained; an older one becomes a
        # cleanup candidate.
        for v in $(cli_record_versions "$shared" codex); do
            [[ "$v" == "$previous" || "$v" == "$version" ]] && continue
            if [[ "$(cli_record_get "$shared" codex "$v" STATUS 2>/dev/null)" =~ ^(previous|active)$ ]]; then
                cli_record_set "$shared" codex "$v" STATUS=retired >/dev/null || failed+=" record:${v}"
            fi
        done
        if [[ -f "$(cli_record_file "$shared" codex "$previous")" ]]; then
            cli_record_set "$shared" codex "$previous" STATUS=previous >/dev/null || failed+=" record:${previous}"
        fi
    fi
    if _codex_fault bookkeeping || ! cli_record_set "$shared" codex "$version" STATUS=active "SOURCE=${source}" \
            "ACTIVATED_AT=${now}" "BACKEND_PROBE=$([[ "$skip_probe" == true ]] && echo skipped || echo passed)" >/dev/null; then
        failed+=" record:${version}"
    fi
    local -a state_kv=("CONFIGURED_VERSION=${version}" PENDING_RESTART=true "CONFIGURED_AT=${now}" -ACTIVATING -ACTIVATING_AT)
    [[ -n "$previous" && "$previous" != "$version" ]] && state_kv+=("PREVIOUS_VERSION=${previous}")
    cli_state_set "$shared" codex "${state_kv[@]}" >/dev/null || failed+=" state"
    if [[ -n "$failed" ]]; then
        cli_err "Codex ${version} IS configured in ${env_file} (restart required to apply it), but the installer could not record:${failed}."
        cli_err "Fix the cause (disk space, permissions), then run: ./chengos.sh setup-cli codex --repair"
        return 5
    fi
}

# Test hook: CHENGOS_CLI_TEST_FAIL_AT=<stage> injects a write failure at that
# stage. Honoured only together with CHENGOS_NPM_TEST_INSECURE=1.
_codex_fault() {
    [[ "${CHENGOS_NPM_TEST_INSECURE:-0}" == "1" && "${CHENGOS_CLI_TEST_FAIL_AT:-}" == "$1" ]]
}

# codex_repair SHARED — reconciles records and state with .env, which is the
# source of truth. Never changes .env or installed files.
codex_repair() {
    local shared="$1" env_file configured bin v st prev
    env_file="$(envf_canonical "${shared}/.env")"
    configured="$(envf_get "$env_file" CHENGOS_CODEX_VERSION 2>/dev/null || true)"
    bin="$(envf_get "$env_file" CHENG_CODING_AGENT_CODEX_BIN 2>/dev/null || true)"
    prev="$(cli_state_get "$shared" codex PREVIOUS_VERSION 2>/dev/null || true)"
    if [[ -z "$configured" || "$(codex_current_tier "$env_file")" == "none" ]]; then
        # Disabled (or never configured) in .env: nothing may stay "active".
        # The most recently configured version becomes the rollback target
        # (protected from cleanup); any other active/previous entry retires.
        local keep_prev
        keep_prev="$(cli_state_get "$shared" codex CONFIGURED_VERSION 2>/dev/null || true)"
        [[ -n "$keep_prev" && -f "$(cli_record_file "$shared" codex "$keep_prev")" ]] || keep_prev="$prev"
        for v in $(cli_record_versions "$shared" codex); do
            st="$(cli_record_get "$shared" codex "$v" STATUS 2>/dev/null || true)"
            [[ "$st" == "active" || "$st" == "previous" ]] || continue
            local target=retired
            [[ "$v" == "$keep_prev" ]] && target=previous
            if [[ "$st" != "$target" ]]; then
                cli_record_set "$shared" codex "$v" "STATUS=${target}" "DEACTIVATED_AT=$(date -u +%FT%TZ)" >/dev/null || return 1
                cli_log "record ${v}: ${st} -> ${target} (Codex is not configured in .env)"
            fi
        done
        local -a kv=(-CONFIGURED_VERSION -ACTIVATING -ACTIVATING_AT)
        [[ -n "$keep_prev" ]] && kv+=("PREVIOUS_VERSION=${keep_prev}")
        cli_state_set "$shared" codex "${kv[@]}" >/dev/null || return 1
        cli_log "Installer records now follow .env: Codex is not configured."
        return 0
    fi
    [[ -f "$(cli_record_file "$shared" codex "$configured")" ]] \
        || { cli_err "no deployment record for the configured version ${configured}; reinstall it: setup-cli codex --version ${configured}"; return 1; }
    for v in $(cli_record_versions "$shared" codex); do
        [[ "$v" == "$configured" ]] && continue
        st="$(cli_record_get "$shared" codex "$v" STATUS 2>/dev/null || true)"
        if [[ "$st" == "active" || ( "$st" == "previous" && "$v" != "$prev" ) ]]; then
            cli_record_set "$shared" codex "$v" "STATUS=$([[ "$v" == "$prev" ]] && echo previous || echo retired)" >/dev/null || return 1
            cli_log "record ${v}: ${st} -> $([[ "$v" == "$prev" ]] && echo previous || echo retired)"
        fi
    done
    if [[ "$(cli_record_get "$shared" codex "$configured" STATUS 2>/dev/null)" != "active" ]]; then
        cli_record_set "$shared" codex "$configured" STATUS=active "REPAIRED_AT=$(date -u +%FT%TZ)" >/dev/null || return 1
        cli_log "record ${configured}: -> active"
    fi
    # Whether the running services already use this configuration is unknown
    # here, so a restart is conservatively marked as pending.
    cli_state_set "$shared" codex "CONFIGURED_VERSION=${configured}" PENDING_RESTART=true \
        -ACTIVATING -ACTIVATING_AT >/dev/null || return 1
    cli_log "Installer records now follow .env (Codex ${configured}, ${bin}). Restart ChengOS if it is not yet running this configuration."
}

# ── Status (read-only) ───────────────────────────────────────────────────────

# codex_status SHARED MODE — doctor-style report. Returns 0 healthy or not
# configured, 1 configured-but-broken, 3 warnings.
codex_status() {
    local shared="$1" mode="$2"
    local env_file rc=0 layout tier bin version sha recorded state_pending
    env_file="$(envf_canonical "${shared}/.env")"
    layout="$(envf_layout "$shared")"
    case "$layout" in
        migrated) echo "  .env layout: env/.env (directory mount, atomic writes)" ;;
        legacy) echo "  .env layout: legacy single file" ;;
        split) echo "  ✗ .env layout is SPLIT: ${shared}/.env and ${shared}/env/.env are different files; resolve by hand"; rc=1 ;;
        missing) echo "  .env: not created yet"; return 0 ;;
    esac
    if [[ "$mode" == "docker" ]]; then
        echo "  Docker coding agents: not available (sandbox feasibility gate, deployment plan §7.4)."
        echo "    Evaluate this host: bash deploy/tests/docker-bwrap-poc.sh"
        return "$rc"
    fi

    tier="$(codex_current_tier "$env_file")"
    if [[ "$tier" == "none" ]]; then
        echo "  Codex: not configured (run: chengos.sh setup-cli codex)"
    else
        bin="$(envf_get "$env_file" CHENG_CODING_AGENT_CODEX_BIN 2>/dev/null || true)"
        version="$(envf_get "$env_file" CHENGOS_CODEX_VERSION 2>/dev/null || true)"
        echo "  configured: Codex ${version:-unknown} (tier: ${tier})"
        echo "    binary: ${bin:-<unset>}"
        if [[ -z "$bin" || ! -x "$bin" ]]; then
            echo "  ✗ the configured binary is missing; coding agents fail closed"
            rc=1
        elif [[ -n "$version" && -f "$(cli_record_file "$shared" codex "$version")" ]]; then
            local verify_out verify_rc=0
            verify_out="$(codex_verify_tree "$shared" "$version")" || verify_rc=$?
            case "$verify_rc" in
                0) echo "    integrity: every installed file matches the deployment manifest" ;;
                2) echo "    integrity: bin/codex matches its recorded checksum (older record without a full manifest)" ;;
                *)
                    echo "  ✗ installed files changed after installation:"
                    printf '%s\n' "$verify_out" | sed 's/^/      /'
                    echo "      reinstall: ./chengos.sh setup-cli codex --version ${version}"
                    rc=1
                    ;;
            esac
        else
            echo "  ! no deployment record for this binary (configured outside the installer)"
            [[ $rc -eq 0 ]] && rc=3
        fi
        echo "    state dir: $(envf_get "$env_file" CHENG_CODING_AGENT_STATE_DIR 2>/dev/null || echo '<unset>')"
        echo "    work roots: $(envf_get "$env_file" CHENG_CODING_AGENT_DEDICATED_ROOTS 2>/dev/null || echo '<unset>')"
        echo "    host id: $(envf_get "$env_file" CHENG_CODING_AGENT_HOST_ID 2>/dev/null || echo '<machine-id fallback>')"
        if [[ "$tier" != "tasks" && "$(envf_get "$env_file" CHENG_CODING_AGENT_DEPLOYMENT 2>/dev/null)" != "single_host" ]]; then
            echo "  ✗ resumable sessions are on but CHENG_CODING_AGENT_DEPLOYMENT is not single_host: the backend refuses them"
            rc=1
        fi
        echo "    device-code login (managed credentials): $(_codex_flag "$env_file" CHENG_CREDENTIAL_AUTH_ENABLED)"
        echo "    login state: managed per user in the UI credential settings (not visible here)"
    fi
    # Bookkeeping must agree with .env (the source of truth).
    local activating configured_state actives="" v2
    activating="$(cli_state_get "$shared" codex ACTIVATING 2>/dev/null || true)"
    configured_state="$(cli_state_get "$shared" codex CONFIGURED_VERSION 2>/dev/null || true)"
    for v2 in $(cli_record_versions "$shared" codex); do
        [[ "$(cli_record_get "$shared" codex "$v2" STATUS 2>/dev/null)" == "active" ]] && actives+=" ${v2}"
    done
    local inconsistent=""
    if [[ -n "$activating" ]]; then
        if [[ "$activating" == "${version:-}" ]]; then
            inconsistent+="an activation of ${activating} reached .env but its records were not completed; "
        else
            inconsistent+="an activation of ${activating} was interrupted before .env changed; "
        fi
    fi
    if [[ "$tier" != "none" && -n "${version:-}" ]]; then
        [[ "$configured_state" == "$version" ]] \
            || inconsistent+="installer state says ${configured_state:-nothing} is configured, .env says ${version}; "
        [[ "${actives# }" == "$version" ]] \
            || inconsistent+="records mark '${actives# }' active, .env configures ${version}; "
    elif [[ -n "${actives# }" ]]; then
        inconsistent+="records mark '${actives# }' active but .env configures no Codex; "
    fi
    if [[ "$tier" == "none" && -n "$configured_state" ]]; then
        inconsistent+="installer state still names ${configured_state} as configured, .env configures no Codex; "
    fi
    local leftover
    for leftover in "$(codex_versions_dir "$shared")"/.replaced-*; do
        [[ -d "$leftover" ]] || continue
        echo "  ! replacement backup kept for recovery: ${leftover} (remove it once --check is clean)"
        [[ $rc -eq 0 ]] && rc=3
    done
    if [[ -n "$inconsistent" ]]; then
        echo "  ✗ installer records disagree with .env: ${inconsistent%; }"
        echo "      .env is authoritative; reconcile with: ./chengos.sh setup-cli codex --repair"
        rc=1
    fi

    state_pending="$(cli_state_get "$shared" codex PENDING_RESTART 2>/dev/null || true)"
    if [[ "$state_pending" == "true" ]]; then
        echo "  ! configuration changed since the last restart: restart ChengOS to apply it"
        [[ $rc -eq 0 ]] && rc=3
    fi

    local v st any=false
    for v in $(cli_record_versions "$shared" codex); do
        any=true
        st="$(cli_record_get "$shared" codex "$v" STATUS 2>/dev/null || echo unknown)"
        printf '    installed: %-10s %s\n' "$v" "$st"
    done
    [[ "$any" == true ]] || echo "    installed versions: none"

    if cli_native_sandbox_preflight >/dev/null 2>&1; then
        echo "    native sandbox: bwrap namespaces available to $(cli_runtime_user)"
    else
        echo "  ! native sandbox: ${CLI_SANDBOX_DETAIL}"
        if [[ "$tier" != "none" ]]; then rc=1; elif [[ $rc -eq 0 ]]; then rc=3; fi
    fi
    return "$rc"
}

# ── Retention and explicit cleanup (plan §6.4) ───────────────────────────────

# Prints the protected versions, one per line.
codex_protected_versions() {
    local shared="$1" env_file v dir
    env_file="$(envf_canonical "${shared}/.env")"
    {
        envf_get "$env_file" CHENGOS_CODEX_VERSION 2>/dev/null && echo
        cli_state_get "$shared" codex CONFIGURED_VERSION 2>/dev/null && echo
        cli_state_get "$shared" codex PREVIOUS_VERSION 2>/dev/null && echo
        for v in $(cli_record_versions "$shared" codex); do
            case "$(cli_record_get "$shared" codex "$v" STATUS 2>/dev/null)" in
                active|previous|probed) printf '%s\n' "$v" ;;
            esac
            dir="$(codex_version_dir "$shared" "$v")"
            # Anything a live process runs from stays.
            if [[ -d "$dir" ]] && pgrep -f -- "$dir/" >/dev/null 2>&1; then
                printf '%s\n' "$v"
            fi
        done
    } | sed '/^$/d' | sort -u
}

# codex_prune SHARED APPLY — preview by default; deletes only with APPLY=true.
codex_prune() {
    local shared="$1" apply="$2"
    local versions protected v dir bytes total=0
    local -a candidates=()
    versions="$(codex_versions_dir "$shared")"
    [[ -d "$versions" ]] || { cli_log "No installed Codex versions."; return 0; }
    protected="$(codex_protected_versions "$shared")"
    for dir in "$versions"/*; do
        [[ -d "$dir" && ! -L "$dir" ]] || continue
        v="${dir##*/}"
        [[ "$v" == .staging-* ]] && continue
        if grep -qx -- "$v" <<<"$protected"; then
            continue
        fi
        if [[ ! -f "$(cli_record_file "$shared" codex "$v")" ]]; then
            cli_warn "skipping ${dir}: no deployment record (unknown ownership)"
            continue
        fi
        if [[ "$(readlink -f -- "$dir")" != "$dir" ]]; then
            cli_warn "skipping ${dir}: path resolves elsewhere"
            continue
        fi
        bytes="$(du -sb -- "$dir" 2>/dev/null | awk '{print $1}')"
        total=$((total + ${bytes:-0}))
        candidates+=("$dir")
        printf '  cleanup candidate: %s (%s bytes, status %s)\n' "$dir" "${bytes:-?}" \
            "$(cli_record_get "$shared" codex "$v" STATUS 2>/dev/null || echo unknown)"
    done
    if [[ ${#candidates[@]} -eq 0 ]]; then
        cli_log "Nothing to clean up; protected: $(tr '\n' ' ' <<<"$protected")"
        return 0
    fi
    cli_log "Reclaimable: ${total} bytes in ${#candidates[@]} director$([[ ${#candidates[@]} -eq 1 ]] && echo y || echo ies)"
    if [[ "$apply" != "true" ]]; then
        if ! cli_confirm "Delete the directories listed above? [y/N]: " n; then
            cli_log "Preview only; nothing deleted."
            return 0
        fi
    fi
    # Recompute protection immediately before deleting.
    protected="$(codex_protected_versions "$shared")"
    for dir in "${candidates[@]}"; do
        v="${dir##*/}"
        if grep -qx -- "$v" <<<"$protected"; then
            cli_warn "keeping ${dir}: it became protected"
            continue
        fi
        rm -rf -- "$dir" && cli_record_set "$shared" codex "$v" STATUS=removed "REMOVED_AT=$(date -u +%FT%TZ)" >/dev/null
        cli_log "Removed ${dir}"
    done
}
