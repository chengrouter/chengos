#!/usr/bin/env bash
#
# ChengOS release update library.
#
# Version parsing, release discovery, artifact verification, staging, backup
# retention, atomic directory swaps, health probing, and rollback selection all
# live here rather than inside the interactive manager, so every critical step
# is callable and testable on its own (see deploy/tests/update-smoke.sh).
#
# This file is sourced, never executed:
#   source "${ROOT_DIR}/lib/release-update.sh"
#
# Two ownership classes govern everything below and must never be blurred:
#
#   package-owned  replaced wholesale by an update, restored wholesale by a
#                  rollback, and always present in a release archive
#   instance-owned created and owned by the operator (.env, databases, logs,
#                  runtime state, workspaces, models). Never staged, never
#                  backed up by the updater, never replaced, never deleted.

# ── Configuration ─────────────────────────────────────────────────────────────

: "${CHENGOS_REPO:=chengrouter/chengos}"
: "${CHENGOS_GITHUB_API:=https://api.github.com}"
: "${CHENGOS_GITHUB_BASE:=https://github.com}"
# Short timeouts: a status check must never hang a terminal, and an update must
# fail loudly rather than stall.
: "${CHENGOS_META_TIMEOUT:=10}"
: "${CHENGOS_DOWNLOAD_TIMEOUT:=1800}"
: "${CHENGOS_HEALTH_TIMEOUT:=90}"
: "${CHENGOS_BACKUP_KEEP:=3}"
# auto     verify a signature when one is published and a verifier is available
# required refuse to install an artifact without a valid signature
# off       skip signature verification entirely (development only)
: "${CHENGOS_REQUIRE_SIGNATURE:=auto}"

# Package-owned entries living under the shared resource directory.
REL_PACKAGE_DIRS=(bin ui app config workflow-templates skills node_skills infra)
REL_PACKAGE_FILES=(.env.example VERSION)
# Package-owned deployment scripts living under the hybrid directory.
REL_HYBRID_SCRIPTS=(start.sh stop.sh status.sh generate-env.sh)

# ── Small utilities ───────────────────────────────────────────────────────────

rel_log() { printf '%s\n' "$*"; }
rel_warn() { printf 'WARNING: %s\n' "$*" >&2; }
rel_error() { printf 'ERROR: %s\n' "$*" >&2; }

# Strict stable SemVer only. Pre-release channels stay out of scope until a
# SemVer-capable comparator and explicit channel selection exist.
rel_is_stable_semver() {
    [[ "${1:-}" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]
}

# Normalizes a recorded or discovered version to bare SemVer. Historical
# `.chengos_version` files hold either `v1.2.3` or `1.2.3`; both read back as
# `1.2.3`, and that bare form is what gets written from now on.
rel_normalize_version() {
    local value="${1:-}"
    value="$(printf '%s' "$value" | tr -d '[:space:]')"
    value="${value#v}"
    printf '%s' "$value"
}

# Strictly greater-than comparison of two stable SemVers.
# Returns 0 when $1 > $2, 1 otherwise (including equality and invalid input).
rel_version_gt() {
    local left right
    left="$(rel_normalize_version "${1:-}")"
    right="$(rel_normalize_version "${2:-}")"
    rel_is_stable_semver "$left" || return 1
    rel_is_stable_semver "$right" || return 1
    [[ "$left" == "$right" ]] && return 1

    local l_major l_minor l_patch r_major r_minor r_patch
    IFS='.' read -r l_major l_minor l_patch <<< "$left"
    IFS='.' read -r r_major r_minor r_patch <<< "$right"

    (( l_major != r_major )) && { (( l_major > r_major )); return $?; }
    (( l_minor != r_minor )) && { (( l_minor > r_minor )); return $?; }
    (( l_patch > r_patch ))
}

# Reads the installed version record, normalized. Prints nothing and returns 1
# when no valid record exists, so callers can distinguish "unknown" from a real
# version instead of guessing.
rel_read_installed_version() {
    local version_file="${1:?version file required}"
    [[ -f "$version_file" ]] || return 1
    local value
    value="$(rel_normalize_version "$(cat "$version_file" 2>/dev/null || true)")"
    [[ -n "$value" ]] || return 1
    rel_is_stable_semver "$value" || { printf '%s' "$value"; return 2; }
    printf '%s' "$value"
}

# Writes the version record in normalized bare form. Called only after a
# successful health verification.
rel_write_installed_version() {
    local version_file="${1:?version file required}"
    local version
    version="$(rel_normalize_version "${2:?version required}")"
    rel_is_stable_semver "$version" || {
        rel_error "refusing to record a non-SemVer version: '${2}'"
        return 1
    }
    printf '%s\n' "$version" > "$version_file"
}

# ── Release discovery ─────────────────────────────────────────────────────────

# Latest stable release version, bare SemVer, from the GitHub Releases API.
# Prints nothing and returns non-zero on any network/parse failure so callers
# can report "latest version unavailable" instead of "up to date".
rel_fetch_latest_version() {
    command -v curl >/dev/null 2>&1 || return 1

    local body
    body="$(curl -fsSL --max-time "$CHENGOS_META_TIMEOUT" \
        -H 'Accept: application/vnd.github+json' \
        "${CHENGOS_GITHUB_API}/repos/${CHENGOS_REPO}/releases/latest" 2>/dev/null)" || return 1

    local tag
    tag="$(printf '%s' "$body" | sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"

    if [[ -z "$tag" ]]; then
        # Fall back to the HTML redirect when the API is rate limited.
        local effective
        effective="$(curl -fsSLI -o /dev/null -w '%{url_effective}' --max-time "$CHENGOS_META_TIMEOUT" \
            "${CHENGOS_GITHUB_BASE}/${CHENGOS_REPO}/releases/latest" 2>/dev/null)" || return 1
        tag="${effective##*/tag/}"
    fi

    local version
    version="$(rel_normalize_version "$tag")"
    rel_is_stable_semver "$version" || return 1
    printf '%s' "$version"
}

rel_archive_name() {
    printf 'chengos-full-linux-amd64-v%s.tar.gz' "$(rel_normalize_version "${1:?version required}")"
}

rel_asset_url() {
    local version archive
    version="$(rel_normalize_version "${1:?version required}")"
    archive="${2:?asset name required}"
    printf '%s/%s/releases/download/v%s/%s' \
        "$CHENGOS_GITHUB_BASE" "$CHENGOS_REPO" "$version" "$archive"
}

# ── Download and verification ─────────────────────────────────────────────────

# Downloads the versioned archive, its checksum, and — when published — its
# detached signature into $stage_dir. Prints the archive path on success.
rel_download_release() {
    local version stage_dir
    version="$(rel_normalize_version "${1:?version required}")"
    stage_dir="${2:?stage dir required}"

    rel_is_stable_semver "$version" || { rel_error "invalid release version: '${1}'"; return 1; }
    [[ -d "$stage_dir" ]] || { rel_error "staging directory does not exist: ${stage_dir}"; return 1; }

    local archive_name archive_path
    archive_name="$(rel_archive_name "$version")"
    archive_path="${stage_dir}/${archive_name}"

    rel_log "Downloading ${archive_name}" >&2
    if ! curl -fL --max-time "$CHENGOS_DOWNLOAD_TIMEOUT" \
        "$(rel_asset_url "$version" "$archive_name")" -o "$archive_path"; then
        rel_error "failed to download release asset ${archive_name}"
        return 1
    fi

    # The checksum is mandatory: an unverifiable artifact is never installed.
    if ! curl -fL --max-time "$CHENGOS_META_TIMEOUT" \
        "$(rel_asset_url "$version" "${archive_name}.sha256")" -o "${archive_path}.sha256"; then
        rel_error "release ${version} does not publish ${archive_name}.sha256; refusing to install an unverifiable artifact"
        return 1
    fi

    # The signature is optional while signing is being rolled out; the policy
    # in CHENGOS_REQUIRE_SIGNATURE decides whether its absence is fatal.
    curl -fsL --max-time "$CHENGOS_META_TIMEOUT" \
        "$(rel_asset_url "$version" "${archive_name}.sig")" -o "${archive_path}.sig" 2>/dev/null \
        || rm -f "${archive_path}.sig"

    printf '%s' "$archive_path"
}

# Verifies the archive against its published SHA-256 digest.
rel_verify_checksum() {
    local archive="${1:?archive required}"
    local checksum_file="${2:-${1}.sha256}"

    [[ -f "$archive" ]] || { rel_error "archive not found: ${archive}"; return 1; }
    [[ -f "$checksum_file" ]] || { rel_error "checksum file not found: ${checksum_file}"; return 1; }

    local expected actual
    expected="$(awk 'NR==1 {print $1}' "$checksum_file")"
    if [[ ! "$expected" =~ ^[0-9a-fA-F]{64}$ ]]; then
        rel_error "checksum file does not contain a SHA-256 digest: ${checksum_file}"
        return 1
    fi

    if command -v sha256sum >/dev/null 2>&1; then
        actual="$(sha256sum "$archive" | awk '{print $1}')"
    elif command -v shasum >/dev/null 2>&1; then
        actual="$(shasum -a 256 "$archive" | awk '{print $1}')"
    else
        rel_error "no SHA-256 tool available (sha256sum or shasum); cannot verify the download"
        return 1
    fi

    if [[ "${actual,,}" != "${expected,,}" ]]; then
        rel_error "checksum mismatch for $(basename "$archive")"
        rel_error "  expected ${expected,,}"
        rel_error "  actual   ${actual,,}"
        return 1
    fi

    rel_log "Checksum verified: $(basename "$archive")"
}

# Verifies the detached signature according to CHENGOS_REQUIRE_SIGNATURE.
#
#   CHENGOS_RELEASE_PUBKEY    path to a GPG or minisign public key
#   CHENGOS_COSIGN_IDENTITY   expected keyless-signing identity
#   CHENGOS_COSIGN_ISSUER     expected keyless-signing OIDC issuer
rel_verify_signature() {
    local archive="${1:?archive required}"
    local sig_file="${2:-${1}.sig}"

    if [[ "$CHENGOS_REQUIRE_SIGNATURE" == "off" ]]; then
        rel_warn "signature verification disabled (CHENGOS_REQUIRE_SIGNATURE=off)"
        return 0
    fi

    if [[ ! -f "$sig_file" ]]; then
        if [[ "$CHENGOS_REQUIRE_SIGNATURE" == "required" ]]; then
            rel_error "no signature published for $(basename "$archive") and CHENGOS_REQUIRE_SIGNATURE=required"
            return 1
        fi
        rel_warn "no detached signature published for $(basename "$archive"); continuing on checksum verification only"
        return 0
    fi

    if [[ -n "${CHENGOS_COSIGN_IDENTITY:-}" ]] && command -v cosign >/dev/null 2>&1; then
        if cosign verify-blob \
            --certificate-identity "$CHENGOS_COSIGN_IDENTITY" \
            --certificate-oidc-issuer "${CHENGOS_COSIGN_ISSUER:-https://token.actions.githubusercontent.com}" \
            --signature "$sig_file" "$archive" >/dev/null 2>&1; then
            rel_log "Signature verified (cosign keyless): $(basename "$archive")"
            return 0
        fi
        rel_error "cosign signature verification failed for $(basename "$archive")"
        return 1
    fi

    if [[ -n "${CHENGOS_RELEASE_PUBKEY:-}" && -f "${CHENGOS_RELEASE_PUBKEY}" ]]; then
        if command -v minisign >/dev/null 2>&1 && head -n1 "$CHENGOS_RELEASE_PUBKEY" | grep -q 'minisign'; then
            if minisign -V -p "$CHENGOS_RELEASE_PUBKEY" -x "$sig_file" -m "$archive" >/dev/null 2>&1; then
                rel_log "Signature verified (minisign): $(basename "$archive")"
                return 0
            fi
            rel_error "minisign signature verification failed for $(basename "$archive")"
            return 1
        fi
        if command -v gpg >/dev/null 2>&1; then
            local keyring
            keyring="$(mktemp -d)"
            if gpg --homedir "$keyring" --batch --quiet --import "$CHENGOS_RELEASE_PUBKEY" 2>/dev/null \
                && gpg --homedir "$keyring" --batch --quiet --verify "$sig_file" "$archive" 2>/dev/null; then
                rm -rf "$keyring"
                rel_log "Signature verified (gpg): $(basename "$archive")"
                return 0
            fi
            rm -rf "$keyring"
            rel_error "gpg signature verification failed for $(basename "$archive")"
            return 1
        fi
    fi

    if [[ "$CHENGOS_REQUIRE_SIGNATURE" == "required" ]]; then
        rel_error "a signature is published but no verifier/public key is configured, and CHENGOS_REQUIRE_SIGNATURE=required"
        rel_error "  configure CHENGOS_RELEASE_PUBKEY or CHENGOS_COSIGN_IDENTITY, or install cosign/minisign/gpg"
        return 1
    fi
    rel_warn "a signature is published but cannot be verified here; continuing on checksum verification only"
    return 0
}

# Extracts the archive into $extract_dir and validates that the extracted tree
# is a complete bundle for exactly $expected_version. Prints the bundle root.
rel_extract_and_verify() {
    local archive="${1:?archive required}"
    local extract_dir="${2:?extract dir required}"
    local expected_version
    expected_version="$(rel_normalize_version "${3:?expected version required}")"
    local verifier="${4:-}"

    mkdir -p "$extract_dir"
    if ! tar -xzf "$archive" -C "$extract_dir"; then
        rel_error "failed to extract ${archive}"
        return 1
    fi

    local bundle_root="${extract_dir}/chengos"
    if [[ ! -d "$bundle_root" ]]; then
        rel_error "archive does not contain a top-level chengos/ directory"
        return 1
    fi

    if [[ -n "$verifier" && -f "$verifier" ]]; then
        bash "$verifier" --dir "$bundle_root" --expect-version "$expected_version" --quiet || return 1
    fi

    # Independent of the verifier: the embedded version must equal the release
    # version we selected, or we downloaded something other than what we asked
    # for and must not touch the installation.
    local embedded
    embedded="$(rel_normalize_version "$(cat "${bundle_root}/VERSION" 2>/dev/null || true)")"
    if [[ "$embedded" != "$expected_version" ]]; then
        rel_error "archive carries version '${embedded:-<none>}' but release ${expected_version} was selected"
        return 1
    fi

    printf '%s' "$bundle_root"
}

# Refuses to proceed when the staging filesystem cannot hold the new package.
# $1 = directory to check, $2 = required bytes.
rel_check_free_space() {
    local target="${1:?target required}"
    local required_bytes="${2:?required bytes required}"
    command -v df >/dev/null 2>&1 || return 0

    local available_kb
    available_kb="$(df -Pk "$target" 2>/dev/null | awk 'NR==2 {print $4}')" || return 0
    [[ -n "$available_kb" ]] || return 0

    local required_kb=$(( (required_bytes + 1023) / 1024 ))
    if (( available_kb < required_kb )); then
        rel_error "insufficient space in ${target}: ${available_kb} KiB available, ${required_kb} KiB required"
        return 1
    fi
}

# ── Backup, swap, restore ─────────────────────────────────────────────────────

rel_backup_root() {
    printf '%s/.chengos_backups' "${1:?root dir required}"
}

# Moves the current package-owned state into a versioned backup directory.
# Instance-owned content is never touched. Prints the backup directory.
rel_backup_package_state() {
    local root_dir="${1:?root dir required}"
    local shared_dir="${2:?shared dir required}"
    local hybrid_dir="${3:?hybrid dir required}"
    local version="${4:-unknown}"

    local backup_root backup_dir
    backup_root="$(rel_backup_root "$root_dir")"
    backup_dir="${backup_root}/${version}-$(date -u +%Y%m%dT%H%M%SZ)"
    mkdir -p "${backup_dir}/shared" "${backup_dir}/hybrid"

    local item
    for item in "${REL_PACKAGE_DIRS[@]}" "${REL_PACKAGE_FILES[@]}"; do
        if [[ -e "${shared_dir}/${item}" ]]; then
            cp -a "${shared_dir}/${item}" "${backup_dir}/shared/${item}"
        fi
    done
    for item in "${REL_HYBRID_SCRIPTS[@]}"; do
        if [[ -e "${hybrid_dir}/${item}" ]]; then
            cp -a "${hybrid_dir}/${item}" "${backup_dir}/hybrid/${item}"
        fi
    done
    if [[ -f "${root_dir}/chengos.sh" ]]; then
        cp -a "${root_dir}/chengos.sh" "${backup_dir}/chengos.sh"
    fi

    printf '%s\n' "$version" > "${backup_dir}/BACKUP_VERSION"
    printf '%s' "$backup_dir"
}

# Replaces package-owned content from a verified bundle. Directories are swapped
# with same-filesystem renames when possible: the staged tree is moved next to
# the target, the old target is renamed aside, and the new one takes its place,
# so the window in which a directory is absent is a single rename.
rel_install_package_state() {
    local bundle_root="${1:?bundle root required}"
    local root_dir="${2:?root dir required}"
    local shared_dir="${3:?shared dir required}"
    local hybrid_dir="${4:?hybrid dir required}"
    local installed_modules="${5:-api,ui,app}"

    local item target staged retired
    for item in "${REL_PACKAGE_DIRS[@]}"; do
        [[ -d "${bundle_root}/${item}" ]] || continue
        # Frontends are only replaced when they are actually installed, so a
        # headless install never grows a UI it did not ask for.
        case "$item" in
            ui|app)
                [[ ",${installed_modules}," == *",${item},"* ]] || continue
                ;;
        esac

        target="${shared_dir}/${item}"
        staged="${shared_dir}/.${item}.staged.$$"
        retired="${shared_dir}/.${item}.retired.$$"

        rm -rf "$staged" "$retired"
        # A copy into the destination filesystem first, so the following
        # renames are metadata-only and cannot fail halfway.
        cp -a "${bundle_root}/${item}" "$staged" || {
            rel_error "failed to stage ${item}"
            rm -rf "$staged"
            return 1
        }
        if [[ -e "$target" ]]; then
            mv "$target" "$retired" || { rel_error "failed to retire ${item}"; rm -rf "$staged"; return 1; }
        fi
        if ! mv "$staged" "$target"; then
            rel_error "failed to install ${item}"
            [[ -e "$retired" ]] && mv "$retired" "$target"
            rm -rf "$staged"
            return 1
        fi
        rm -rf "$retired"
    done

    for item in "${REL_PACKAGE_FILES[@]}"; do
        [[ -f "${bundle_root}/${item}" ]] || continue
        cp -a "${bundle_root}/${item}" "${shared_dir}/${item}" || return 1
    done

    for item in "${REL_HYBRID_SCRIPTS[@]}"; do
        [[ -f "${bundle_root}/hybrid/${item}" ]] || continue
        cp -a "${bundle_root}/hybrid/${item}" "${hybrid_dir}/${item}" || return 1
        chmod +x "${hybrid_dir}/${item}" 2>/dev/null || true
    done

    if [[ -f "${bundle_root}/chengos.sh" ]]; then
        cp -a "${bundle_root}/chengos.sh" "${root_dir}/chengos.sh" || return 1
        chmod +x "${root_dir}/chengos.sh" 2>/dev/null || true
    fi

    chmod +x "${shared_dir}/bin/"* 2>/dev/null || true
    return 0
}

# Restores package-owned content from a backup directory produced by
# rel_backup_package_state. Instance-owned content is never touched.
rel_restore_package_state() {
    local backup_dir="${1:?backup dir required}"
    local root_dir="${2:?root dir required}"
    local shared_dir="${3:?shared dir required}"
    local hybrid_dir="${4:?hybrid dir required}"

    [[ -d "$backup_dir" ]] || { rel_error "backup not found: ${backup_dir}"; return 1; }

    local item target retired
    for item in "${REL_PACKAGE_DIRS[@]}"; do
        [[ -d "${backup_dir}/shared/${item}" ]] || continue
        target="${shared_dir}/${item}"
        retired="${shared_dir}/.${item}.rollback.$$"
        rm -rf "$retired"
        [[ -e "$target" ]] && mv "$target" "$retired"
        if ! cp -a "${backup_dir}/shared/${item}" "$target"; then
            rel_error "failed to restore ${item}"
            [[ -e "$retired" ]] && { rm -rf "$target"; mv "$retired" "$target"; }
            return 1
        fi
        rm -rf "$retired"
    done

    for item in "${REL_PACKAGE_FILES[@]}"; do
        [[ -f "${backup_dir}/shared/${item}" ]] || continue
        cp -a "${backup_dir}/shared/${item}" "${shared_dir}/${item}" || return 1
    done

    for item in "${REL_HYBRID_SCRIPTS[@]}"; do
        [[ -f "${backup_dir}/hybrid/${item}" ]] || continue
        cp -a "${backup_dir}/hybrid/${item}" "${hybrid_dir}/${item}" || return 1
        chmod +x "${hybrid_dir}/${item}" 2>/dev/null || true
    done

    if [[ -f "${backup_dir}/chengos.sh" ]]; then
        cp -a "${backup_dir}/chengos.sh" "${root_dir}/chengos.sh" || return 1
        chmod +x "${root_dir}/chengos.sh" 2>/dev/null || true
    fi

    chmod +x "${shared_dir}/bin/"* 2>/dev/null || true
    return 0
}

# Keeps the newest $CHENGOS_BACKUP_KEEP backups and removes the rest.
rel_prune_backups() {
    local root_dir="${1:?root dir required}"
    local keep="${2:-$CHENGOS_BACKUP_KEEP}"
    local backup_root
    backup_root="$(rel_backup_root "$root_dir")"
    [[ -d "$backup_root" ]] || return 0

    local -a entries=()
    local entry
    while IFS= read -r entry; do
        [[ -n "$entry" ]] && entries+=("$entry")
    done < <(find "$backup_root" -mindepth 1 -maxdepth 1 -type d | sort)

    local total=${#entries[@]}
    (( total > keep )) || return 0
    local remove=$(( total - keep ))
    local i
    for (( i = 0; i < remove; i++ )); do
        rm -rf "${entries[$i]}"
    done
}

# Prints backup directories, newest first.
rel_list_backups() {
    local backup_root
    backup_root="$(rel_backup_root "${1:?root dir required}")"
    [[ -d "$backup_root" ]] || return 0
    find "$backup_root" -mindepth 1 -maxdepth 1 -type d | sort -r
}

# Prints the newest backup directory, or returns 1 when there is none.
rel_latest_backup() {
    local newest
    newest="$(rel_list_backups "${1:?root dir required}" | head -n1)"
    [[ -n "$newest" ]] || return 1
    printf '%s' "$newest"
}

rel_backup_version() {
    local backup_dir="${1:?backup dir required}"
    if [[ -f "${backup_dir}/BACKUP_VERSION" ]]; then
        rel_normalize_version "$(cat "${backup_dir}/BACKUP_VERSION")"
    elif [[ -f "${backup_dir}/shared/VERSION" ]]; then
        rel_normalize_version "$(cat "${backup_dir}/shared/VERSION")"
    else
        printf 'unknown'
    fi
}

# ── Health ────────────────────────────────────────────────────────────────────

# Bounded health probe. Returns 0 only when the endpoint answers healthy inside
# $CHENGOS_HEALTH_TIMEOUT seconds.
rel_wait_for_health() {
    local url="${1:?health url required}"
    local timeout="${2:-$CHENGOS_HEALTH_TIMEOUT}"
    local deadline=$(( SECONDS + timeout ))

    while (( SECONDS < deadline )); do
        if curl -sf --max-time 5 "$url" >/dev/null 2>&1; then
            return 0
        fi
        sleep 2
    done
    return 1
}

# Reads the ChengOS version the running API reports, for status output.
rel_running_version() {
    local url="${1:?health url required}"
    local body
    body="$(curl -sf --max-time 5 "$url" 2>/dev/null)" || return 1
    local version
    version="$(printf '%s' "$body" | sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"
    [[ -n "$version" ]] || return 1
    printf '%s' "$(rel_normalize_version "$version")"
}

# ── Migration policy ──────────────────────────────────────────────────────────
#
# A release that declares an irreversible database migration must never be
# rolled back automatically: the previous binaries cannot read the migrated
# data. The declaration travels with the package as `.migration-policy`
# (written from the release notes), so the check works offline.

rel_migration_policy() {
    local shared_dir="${1:?shared dir required}"
    local policy_file="${shared_dir}/config/.migration-policy"
    if [[ -f "$policy_file" ]]; then
        tr -d '[:space:]' < "$policy_file"
        return 0
    fi
    printf 'reversible'
}

# Returns 0 when rolling back FROM the currently installed release is allowed.
rel_rollback_allowed() {
    local shared_dir="${1:?shared dir required}"
    [[ "$(rel_migration_policy "$shared_dir")" != "irreversible" ]]
}

rel_print_manual_recovery() {
    cat >&2 <<'EOF'
Automatic rollback is refused: the installed release declares an irreversible
database migration, so the previous release cannot read the migrated data.

Manual recovery procedure:
  1. Stop ChengOS:            ./chengos.sh stop
  2. Restore the database backup taken before the update (see the release notes
     for the exact dump/restore commands required by that release).
  3. Restore the package files from the newest entry under .chengos_backups/.
  4. Write the restored version into .chengos_version (bare SemVer).
  5. Start ChengOS:           ./chengos.sh start
  6. Verify /health reports the restored version.

Full procedure: chengflow/docs/release-operations-guide.md
EOF
}
