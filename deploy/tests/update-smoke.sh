#!/usr/bin/env bash
#
# Shell-level integration tests for the ChengOS release update path.
#
# Everything runs against throwaway installation roots and locally built fixture
# archives — no network, no Docker, no real installation is touched. The tests
# cover the failure modes that decide whether an update is safe:
#
#   - version normalization and upgrade-only comparison
#   - a correct update, end to end
#   - a corrupted download (checksum mismatch)
#   - a malformed archive (wrong layout / wrong embedded version)
#   - insufficient staging space
#   - instance-owned data surviving an update
#   - restart failure triggering an automatic restore
#   - rollback restoring the previous package and version record
#   - rollback refused for an irreversible migration policy
#
# Usage: bash deploy/tests/update-smoke.sh
set -uo pipefail

TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${TEST_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${DEPLOY_DIR}/.." && pwd)"
VERIFIER="${REPO_ROOT}/scripts/verify-release-archive.sh"

# shellcheck source=../lib/release-update.sh
source "${DEPLOY_DIR}/lib/release-update.sh"

WORK_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/chengos-update-smoke-XXXXXX")"
trap 'rm -rf "$WORK_ROOT"' EXIT

PASS=0
FAIL=0

ok() { printf '  \033[32mPASS\033[0m %s\n' "$*"; PASS=$(( PASS + 1 )); }
ko() { printf '  \033[31mFAIL\033[0m %s\n' "$*"; FAIL=$(( FAIL + 1 )); }
section() { printf '\n== %s\n' "$*"; }

assert_eq() {
    local expected="$1" actual="$2" label="$3"
    if [[ "$expected" == "$actual" ]]; then
        ok "$label"
    else
        ko "${label} (expected '${expected}', got '${actual}')"
    fi
}

assert_true() {
    if "${@:2}"; then ok "$1"; else ko "$1"; fi
}

assert_false() {
    if "${@:2}"; then ko "$1"; else ok "$1"; fi
}

# ── Fixtures ──────────────────────────────────────────────────────────────────

# Builds a complete, verifiable bundle for $version at $dest/chengos and packs
# it into $dest/<archive>.tar.gz with an adjacent .sha256.
make_fixture_archive() {
    local version="$1" dest="$2"
    local bundle="${dest}/build/chengos"

    mkdir -p "${bundle}/bin" "${bundle}/ui" "${bundle}/app" "${bundle}/config/i18n" \
             "${bundle}/workflow-templates" "${bundle}/skills" "${bundle}/hybrid" \
             "${bundle}/lib" "${bundle}/infra" "${bundle}/node_skills"

    printf '%s\n' "$version" > "${bundle}/VERSION"
    printf '#!/bin/sh\necho "cheng-api %s"\n' "$version" > "${bundle}/bin/cheng-api"
    printf '#!/bin/sh\necho "cheng %s"\n' "$version" > "${bundle}/bin/cheng"
    printf 'API_PORT=3000\n' > "${bundle}/.env.example"
    printf '#!/bin/sh\nexit 0\n' > "${bundle}/chengos.sh"
    printf '#!/bin/sh\nexit 0\n' > "${bundle}/generate-env.sh"
    local script
    for script in start.sh stop.sh status.sh generate-env.sh; do
        printf '#!/bin/sh\nexit 0\n' > "${bundle}/hybrid/${script}"
    done
    cp "${DEPLOY_DIR}/lib/release-update.sh" "${bundle}/lib/release-update.sh"
    cp "$VERIFIER" "${bundle}/lib/verify-release-archive.sh"
    printf 'services: {}\n' > "${bundle}/infra/docker-compose.yml"
    printf 'presets: []\n' > "${bundle}/config/presets.yaml"
    printf 'shortcuts: []\n' > "${bundle}/config/shortcuts.yaml"
    printf '{}\n' > "${bundle}/config/i18n/nodes-zh-overrides.json"
    printf 'ui-%s\n' "$version" > "${bundle}/ui/index.html"
    printf 'app-%s\n' "$version" > "${bundle}/app/index.html"

    chmod +x "${bundle}/bin/"* "${bundle}/chengos.sh" "${bundle}/generate-env.sh" \
             "${bundle}/hybrid/"*.sh "${bundle}/lib/verify-release-archive.sh"

    local archive="${dest}/$(rel_archive_name "$version")"
    tar -czf "$archive" -C "${dest}/build" chengos
    ( cd "$dest" && sha256sum "$(basename "$archive")" > "$(basename "$archive").sha256" )
    printf '%s' "$archive"
}

# Builds an installation root holding $version plus instance-owned data that
# must survive every operation below.
make_install_root() {
    local version="$1" root="$2"
    local archive_dir="${root}.src"
    mkdir -p "$archive_dir"
    local archive
    archive="$(make_fixture_archive "$version" "$archive_dir")"

    mkdir -p "$root"
    tar -xzf "$archive" -C "$archive_dir/extracted" --one-top-level 2>/dev/null \
        || { mkdir -p "${archive_dir}/extracted"; tar -xzf "$archive" -C "${archive_dir}/extracted"; }
    cp -a "${archive_dir}/extracted/chengos/." "$root/"

    # Instance-owned content: created by the operator, never packaged, and
    # never replaced or removed by an update or a rollback.
    mkdir -p "${root}/logs" "${root}/runtime" "${root}/workspace" "${root}/models"
    printf 'API_PORT=3000\nJWT_SECRET=operator-secret\n' > "${root}/.env"
    printf 'operator log line\n' > "${root}/logs/cheng-api.log"
    printf 'operator workspace file\n' > "${root}/workspace/notes.txt"
    printf 'model-bytes\n' > "${root}/models/model.bin"
    printf 'v%s\n' "$version" > "${root}/.chengos_version"
    rm -rf "${archive_dir}/extracted" "${archive_dir}/build"
}

assert_instance_data_intact() {
    local root="$1" label="$2"
    if [[ "$(cat "${root}/.env" 2>/dev/null)" == *"operator-secret"* ]] \
        && [[ -f "${root}/logs/cheng-api.log" ]] \
        && [[ "$(cat "${root}/workspace/notes.txt" 2>/dev/null)" == "operator workspace file" ]] \
        && [[ -f "${root}/models/model.bin" ]]; then
        ok "$label"
    else
        ko "$label"
    fi
}

# ── 1. Version handling ───────────────────────────────────────────────────────

section "Version normalization and comparison"

assert_eq "1.2.3" "$(rel_normalize_version ' v1.2.3 ')" "normalizes 'v1.2.3' to bare SemVer"
assert_eq "1.2.3" "$(rel_normalize_version '1.2.3')" "leaves a bare SemVer unchanged"
assert_true "accepts a stable SemVer" rel_is_stable_semver "0.1.0"
assert_false "rejects a pre-release version" rel_is_stable_semver "1.0.0-rc.1"
assert_false "rejects a leading-zero version" rel_is_stable_semver "1.02.3"
assert_true "0.1.1 > 0.1.0" rel_version_gt "0.1.1" "0.1.0"
assert_false "equal versions do not update" rel_version_gt "0.1.0" "0.1.0"
assert_false "older remote does not update" rel_version_gt "0.1.0" "0.2.0"

VERSION_RECORD="${WORK_ROOT}/version-record"
printf 'v0.1.0\n' > "$VERSION_RECORD"
assert_eq "0.1.0" "$(rel_read_installed_version "$VERSION_RECORD")" "reads a legacy 'v'-prefixed record as bare SemVer"
rel_write_installed_version "$VERSION_RECORD" "v0.1.1" >/dev/null
assert_eq "0.1.1" "$(cat "$VERSION_RECORD" | tr -d '[:space:]')" "writes the record back in bare form"
assert_false "refuses to record a non-SemVer version" rel_write_installed_version "$VERSION_RECORD" "not-a-version"

# ── 2. Successful update ──────────────────────────────────────────────────────

section "Successful update 0.1.0 -> 0.2.0"

ROOT_OK="${WORK_ROOT}/ok"
make_install_root "0.1.0" "$ROOT_OK"
SRC_OK="${WORK_ROOT}/ok-release"
mkdir -p "$SRC_OK"
ARCHIVE_OK="$(make_fixture_archive "0.2.0" "$SRC_OK")"

assert_true "checksum verification passes for an intact archive" \
    rel_verify_checksum "$ARCHIVE_OK" "${ARCHIVE_OK}.sha256"

STAGE_OK="${WORK_ROOT}/stage-ok"
mkdir -p "$STAGE_OK"
BUNDLE_OK="$(rel_extract_and_verify "$ARCHIVE_OK" "$STAGE_OK" "0.2.0" "$VERIFIER")"
assert_eq "${STAGE_OK}/chengos" "$BUNDLE_OK" "extracts and verifies the bundle root"

BACKUP_OK="$(rel_backup_package_state "$ROOT_OK" "$ROOT_OK" "${ROOT_OK}/hybrid" "0.1.0")"
assert_true "creates a backup directory" test -d "$BACKUP_OK"
assert_eq "0.1.0" "$(rel_backup_version "$BACKUP_OK")" "records the backed-up version"
assert_false "the backup contains no instance-owned .env" test -f "${BACKUP_OK}/shared/.env"
assert_false "the backup contains no instance-owned logs" test -d "${BACKUP_OK}/shared/logs"

assert_true "installs the new package-owned state" \
    rel_install_package_state "$BUNDLE_OK" "$ROOT_OK" "$ROOT_OK" "${ROOT_OK}/hybrid" "api,ui,app"
assert_eq "0.2.0" "$(rel_normalize_version "$(cat "${ROOT_OK}/VERSION")")" "package VERSION is now 0.2.0"
assert_eq "ui-0.2.0" "$(cat "${ROOT_OK}/ui/index.html")" "UI assets were replaced"
assert_true "binaries remain executable" test -x "${ROOT_OK}/bin/cheng-api"
rel_write_installed_version "${ROOT_OK}/.chengos_version" "0.2.0"
assert_eq "0.2.0" "$(rel_read_installed_version "${ROOT_OK}/.chengos_version")" "version record normalized to 0.2.0"
assert_instance_data_intact "$ROOT_OK" "instance-owned data survived the update"

# ── 3. Corrupted download ─────────────────────────────────────────────────────

section "Corrupted download and malformed archives"

ROOT_BAD="${WORK_ROOT}/bad"
make_install_root "0.1.0" "$ROOT_BAD"
SRC_BAD="${WORK_ROOT}/bad-release"
mkdir -p "$SRC_BAD"
ARCHIVE_BAD="$(make_fixture_archive "0.2.0" "$SRC_BAD")"
# Flip one byte: the artifact is no longer the one that was signed/published.
printf 'corruption' >> "$ARCHIVE_BAD"

assert_false "checksum verification fails after a single-byte change" \
    rel_verify_checksum "$ARCHIVE_BAD" "${ARCHIVE_BAD}.sha256"
assert_eq "0.1.0" "$(rel_read_installed_version "${ROOT_BAD}/.chengos_version")" \
    "a corrupted download leaves the version record untouched"
assert_eq "ui-0.1.0" "$(cat "${ROOT_BAD}/ui/index.html")" \
    "a corrupted download leaves installed files untouched"
assert_instance_data_intact "$ROOT_BAD" "a corrupted download leaves instance data untouched"

# An archive whose embedded VERSION disagrees with the selected release must be
# rejected even though it is structurally valid and its checksum matches.
SRC_MISMATCH="${WORK_ROOT}/mismatch-release"
mkdir -p "$SRC_MISMATCH"
ARCHIVE_MISMATCH="$(make_fixture_archive "0.3.0" "$SRC_MISMATCH")"
STAGE_MISMATCH="${WORK_ROOT}/stage-mismatch"
mkdir -p "$STAGE_MISMATCH"
assert_false "rejects an archive whose embedded version is not the selected release" \
    rel_extract_and_verify "$ARCHIVE_MISMATCH" "$STAGE_MISMATCH" "0.2.0" "$VERIFIER"

# An archive missing a required package entry must be rejected outright.
SRC_INCOMPLETE="${WORK_ROOT}/incomplete-release"
mkdir -p "${SRC_INCOMPLETE}/build/chengos/bin"
printf '0.2.0\n' > "${SRC_INCOMPLETE}/build/chengos/VERSION"
printf '#!/bin/sh\n' > "${SRC_INCOMPLETE}/build/chengos/bin/cheng-api"
tar -czf "${SRC_INCOMPLETE}/incomplete.tar.gz" -C "${SRC_INCOMPLETE}/build" chengos
STAGE_INCOMPLETE="${WORK_ROOT}/stage-incomplete"
mkdir -p "$STAGE_INCOMPLETE"
assert_false "rejects an archive missing required package entries" \
    rel_extract_and_verify "${SRC_INCOMPLETE}/incomplete.tar.gz" "$STAGE_INCOMPLETE" "0.2.0" "$VERIFIER"

# ── 4. Staging space ──────────────────────────────────────────────────────────

section "Staging space guard"

assert_true "accepts a modest space requirement" rel_check_free_space "$WORK_ROOT" 1024
assert_false "refuses to stage when free space is insufficient" \
    rel_check_free_space "$WORK_ROOT" 999999999999999

# ── 5. Restart failure triggers an automatic restore ──────────────────────────

section "Restart failure restores the previous package"

ROOT_RESTORE="${WORK_ROOT}/restore"
make_install_root "0.1.0" "$ROOT_RESTORE"
SRC_RESTORE="${WORK_ROOT}/restore-release"
mkdir -p "$SRC_RESTORE"
ARCHIVE_RESTORE="$(make_fixture_archive "0.2.0" "$SRC_RESTORE")"
STAGE_RESTORE="${WORK_ROOT}/stage-restore"
mkdir -p "$STAGE_RESTORE"
BUNDLE_RESTORE="$(rel_extract_and_verify "$ARCHIVE_RESTORE" "$STAGE_RESTORE" "0.2.0" "$VERIFIER")"

BACKUP_RESTORE="$(rel_backup_package_state "$ROOT_RESTORE" "$ROOT_RESTORE" "${ROOT_RESTORE}/hybrid" "0.1.0")"
rel_install_package_state "$BUNDLE_RESTORE" "$ROOT_RESTORE" "$ROOT_RESTORE" "${ROOT_RESTORE}/hybrid" "api,ui,app" >/dev/null

# Simulate the post-switch failure: start/health did not succeed, so the
# updater restores the previous package and never writes the version record.
assert_true "restores the previous package after a failed start" \
    rel_restore_package_state "$BACKUP_RESTORE" "$ROOT_RESTORE" "$ROOT_RESTORE" "${ROOT_RESTORE}/hybrid"
assert_eq "0.1.0" "$(rel_normalize_version "$(cat "${ROOT_RESTORE}/VERSION")")" "package VERSION is back to 0.1.0"
assert_eq "ui-0.1.0" "$(cat "${ROOT_RESTORE}/ui/index.html")" "UI assets are back to 0.1.0"
assert_eq "0.1.0" "$(rel_read_installed_version "${ROOT_RESTORE}/.chengos_version")" \
    "the version record was never advanced"
assert_instance_data_intact "$ROOT_RESTORE" "instance data survived the failed update"

# ── 6. Rollback ───────────────────────────────────────────────────────────────

section "Rollback"

ROOT_RB="${WORK_ROOT}/rollback"
make_install_root "0.1.0" "$ROOT_RB"
SRC_RB="${WORK_ROOT}/rollback-release"
mkdir -p "$SRC_RB"
ARCHIVE_RB="$(make_fixture_archive "0.2.0" "$SRC_RB")"
STAGE_RB="${WORK_ROOT}/stage-rollback"
mkdir -p "$STAGE_RB"
BUNDLE_RB="$(rel_extract_and_verify "$ARCHIVE_RB" "$STAGE_RB" "0.2.0" "$VERIFIER")"

rel_backup_package_state "$ROOT_RB" "$ROOT_RB" "${ROOT_RB}/hybrid" "0.1.0" >/dev/null
rel_install_package_state "$BUNDLE_RB" "$ROOT_RB" "$ROOT_RB" "${ROOT_RB}/hybrid" "api,ui,app" >/dev/null
rel_write_installed_version "${ROOT_RB}/.chengos_version" "0.2.0"

BACKUP_LATEST="$(rel_latest_backup "$ROOT_RB")"
assert_eq "0.1.0" "$(rel_backup_version "$BACKUP_LATEST")" "the newest rollback point is 0.1.0"
assert_true "rollback is allowed under the default reversible policy" rel_rollback_allowed "$ROOT_RB"
assert_true "restores the previous release" \
    rel_restore_package_state "$BACKUP_LATEST" "$ROOT_RB" "$ROOT_RB" "${ROOT_RB}/hybrid"
rel_write_installed_version "${ROOT_RB}/.chengos_version" "0.1.0"

assert_eq "0.1.0" "$(rel_normalize_version "$(cat "${ROOT_RB}/VERSION")")" "rollback restored the 0.1.0 package"
assert_eq "0.1.0" "$(rel_read_installed_version "${ROOT_RB}/.chengos_version")" "rollback restored the version record"
assert_eq "ui-0.1.0" "$(cat "${ROOT_RB}/ui/index.html")" "rollback restored the UI assets"
assert_true "rollback restored the deployment scripts" test -x "${ROOT_RB}/hybrid/start.sh"
assert_instance_data_intact "$ROOT_RB" "instance data survived the rollback"

# ── 7. Backup retention ───────────────────────────────────────────────────────

section "Backup retention"

ROOT_KEEP="${WORK_ROOT}/keep"
make_install_root "0.1.0" "$ROOT_KEEP"
for i in 1 2 3 4 5; do
    rel_backup_package_state "$ROOT_KEEP" "$ROOT_KEEP" "${ROOT_KEEP}/hybrid" "0.1.${i}" >/dev/null
    # Distinct timestamps so the newest-first ordering is unambiguous.
    sleep 1
done
rel_prune_backups "$ROOT_KEEP" 3
KEPT="$(rel_list_backups "$ROOT_KEEP" | wc -l | tr -d '[:space:]')"
assert_eq "3" "$KEPT" "retains exactly the configured number of backups"
assert_eq "0.1.5" "$(rel_backup_version "$(rel_latest_backup "$ROOT_KEEP")")" "keeps the newest backups"

# ── 8. Irreversible migration policy ──────────────────────────────────────────

section "Irreversible migration policy"

ROOT_IRR="${WORK_ROOT}/irreversible"
make_install_root "0.2.0" "$ROOT_IRR"
assert_eq "reversible" "$(rel_migration_policy "$ROOT_IRR")" "defaults to a reversible policy"
printf 'irreversible\n' > "${ROOT_IRR}/config/.migration-policy"
assert_eq "irreversible" "$(rel_migration_policy "$ROOT_IRR")" "reads the declared policy from the package"
assert_false "refuses automatic rollback for an irreversible release" rel_rollback_allowed "$ROOT_IRR"

# ── Summary ───────────────────────────────────────────────────────────────────

printf '\n─────────────────────────────────────────\n'
printf 'passed: %d   failed: %d\n' "$PASS" "$FAIL"
if (( FAIL > 0 )); then
    printf 'update smoke tests FAILED\n'
    exit 1
fi
printf 'update smoke tests passed\n'
