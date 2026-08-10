#!/usr/bin/env bash
#
# ChengOS maintainer release entry point.
#
# Produces exactly one release commit and one annotated, immutable tag:
#
#   1. validate tooling, branch, worktree, and remote divergence
#   2. validate current version consistency (VERSION == Cargo workspace version)
#   3. compute the target version from --bump / --set
#   4. refuse a target that already exists locally or on the remote
#   5. write VERSION, the Cargo workspace version, and a CHANGELOG section
#   6. run the release contract gates
#   7. commit `release: vX.Y.Z`, tag `vX.Y.Z` annotated, push branch then tag
#
# The script never force-pushes and never moves an existing tag. Re-running it
# for an already released version fails before any write.
#
# Usage:
#   ./release.sh --bump patch|minor|major [options]
#   ./release.sh --set X.Y.Z [options]
#
# Options:
#   --dry-run        Report every proposed file and Git action; change nothing.
#   --skip-checks    Skip the release contract gates (rehearsal only; never for
#                    a public release).
#   --remote NAME    Git remote to validate and push to (default: origin).
#   --branch NAME    Release branch that must be checked out (default: main).
#   --notes TEXT     Seed the generated changelog section with a release note.
#   --irreversible   Declare the release's migration policy as irreversible, so
#                    automatic rollback is refused for it.
#   -h, --help       Show this help.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

VERSION_FILE="${REPO_ROOT}/VERSION"
CARGO_TOML="${REPO_ROOT}/chengflow/Cargo.toml"
CHANGELOG="${REPO_ROOT}/CHANGELOG.md"
CONSISTENCY_CHECK="${REPO_ROOT}/scripts/check-release-consistency.sh"
CONTRACT_TEST="${REPO_ROOT}/scripts/test-release-contract.sh"

BUMP=""
SET_VERSION=""
DRY_RUN="false"
SKIP_CHECKS="false"
REMOTE="origin"
RELEASE_BRANCH="main"
RELEASE_NOTES=""
MIGRATION_POLICY="reversible"

usage() {
    sed -n '2,32p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

fail() {
    printf 'ERROR: %s\n' "$*" >&2
    exit 1
}

info() {
    printf '==> %s\n' "$*"
}

# In dry-run mode every mutating action is only described.
action() {
    if [[ "$DRY_RUN" == "true" ]]; then
        printf '  [dry-run] %s\n' "$*"
        return 1
    fi
    printf '  %s\n' "$*"
    return 0
}

is_stable_semver() {
    [[ "$1" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --bump)
            BUMP="${2:-}"
            shift 2
            ;;
        --set)
            SET_VERSION="${2:-}"
            shift 2
            ;;
        --dry-run)
            DRY_RUN="true"
            shift
            ;;
        --skip-checks)
            SKIP_CHECKS="true"
            shift
            ;;
        --remote)
            REMOTE="${2:-}"
            shift 2
            ;;
        --branch)
            RELEASE_BRANCH="${2:-}"
            shift 2
            ;;
        --notes)
            RELEASE_NOTES="${2:-}"
            shift 2
            ;;
        --irreversible)
            MIGRATION_POLICY="irreversible"
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "release: unknown option: $1" >&2
            usage >&2
            exit 1
            ;;
    esac
done

# ── 1. Tooling ────────────────────────────────────────────────────────────────
for tool in git awk sed date; do
    command -v "$tool" >/dev/null 2>&1 || fail "required tool not found: ${tool}"
done
[[ -x "$CONSISTENCY_CHECK" || -f "$CONSISTENCY_CHECK" ]] \
    || fail "consistency checker not found: ${CONSISTENCY_CHECK}"
[[ -f "$CHANGELOG" ]] || fail "changelog not found: ${CHANGELOG}"
[[ -f "$CARGO_TOML" ]] || fail "Cargo manifest not found: ${CARGO_TOML}"

git rev-parse --is-inside-work-tree >/dev/null 2>&1 \
    || fail "not inside a Git worktree: ${REPO_ROOT}"

# chengflow/ may be an independent repository that the meta repo ignores, or a
# plain subdirectory of this one. Comparing worktree roots is the only reliable
# test: `--is-inside-work-tree` is true in both cases.
CHENGFLOW_IS_SEPARATE_REPO="false"
if [[ -d "${REPO_ROOT}/chengflow" ]]; then
    _meta_top="$(git rev-parse --show-toplevel 2>/dev/null || true)"
    _flow_top="$(git -C "${REPO_ROOT}/chengflow" rev-parse --show-toplevel 2>/dev/null || true)"
    if [[ -n "$_flow_top" && "$_flow_top" != "$_meta_top" ]]; then
        CHENGFLOW_IS_SEPARATE_REPO="true"
    fi
    unset _meta_top _flow_top
fi

# ── 2. Argument validation ────────────────────────────────────────────────────
if [[ -n "$BUMP" && -n "$SET_VERSION" ]]; then
    fail "--bump and --set are mutually exclusive"
fi
if [[ -z "$BUMP" && -z "$SET_VERSION" ]]; then
    fail "one of --bump major|minor|patch or --set X.Y.Z is required"
fi
if [[ -n "$BUMP" ]]; then
    case "$BUMP" in
        major|minor|patch) ;;
        *) fail "invalid --bump value: '${BUMP}' (expected major, minor, or patch)" ;;
    esac
fi
if [[ -n "$SET_VERSION" ]]; then
    SET_VERSION="${SET_VERSION#v}"
    is_stable_semver "$SET_VERSION" \
        || fail "invalid --set value: '${SET_VERSION}' (expected strict stable MAJOR.MINOR.PATCH)"
fi

# ── 3. Repository state ───────────────────────────────────────────────────────
current_branch="$(git rev-parse --abbrev-ref HEAD)"
[[ "$current_branch" == "$RELEASE_BRANCH" ]] \
    || fail "releases must be cut from '${RELEASE_BRANCH}' but '${current_branch}' is checked out"

if [[ -n "$(git status --porcelain)" ]]; then
    git status --short >&2
    fail "worktree is dirty; commit or stash every change before releasing"
fi

git remote get-url "$REMOTE" >/dev/null 2>&1 \
    || fail "git remote not configured: ${REMOTE}"

info "Fetching remote refs from '${REMOTE}'"
git fetch --prune --tags "$REMOTE" \
    || fail "git fetch from '${REMOTE}' failed; releases require current remote refs"

remote_ref="refs/remotes/${REMOTE}/${RELEASE_BRANCH}"
git rev-parse --verify --quiet "$remote_ref" >/dev/null \
    || fail "remote branch not found: ${REMOTE}/${RELEASE_BRANCH}"

local_head="$(git rev-parse HEAD)"
remote_head="$(git rev-parse "$remote_ref")"
if [[ "$local_head" != "$remote_head" ]]; then
    ahead="$(git rev-list --count "${remote_ref}..HEAD")"
    behind="$(git rev-list --count "HEAD..${remote_ref}")"
    fail "local ${RELEASE_BRANCH} diverges from ${REMOTE}/${RELEASE_BRANCH} (ahead ${ahead}, behind ${behind}); synchronize before releasing"
fi

# ── 4. Current and target version ─────────────────────────────────────────────
info "Validating current version consistency"
bash "$CONSISTENCY_CHECK" || fail "release blocked: version sources are inconsistent"

current_version="$(tr -d '[:space:]' < "$VERSION_FILE")"

if [[ -n "$SET_VERSION" ]]; then
    target_version="$SET_VERSION"
else
    IFS='.' read -r cur_major cur_minor cur_patch <<< "$current_version"
    case "$BUMP" in
        major) target_version="$((cur_major + 1)).0.0" ;;
        minor) target_version="${cur_major}.$((cur_minor + 1)).0" ;;
        patch) target_version="${cur_major}.${cur_minor}.$((cur_patch + 1))" ;;
    esac
fi

is_stable_semver "$target_version" || fail "computed target version is invalid: '${target_version}'"
[[ "$target_version" != "$current_version" ]] \
    || fail "target version ${target_version} equals the current version; nothing to release"

# Guard against a --set that walks the version backwards.
lowest="$(printf '%s\n%s\n' "$current_version" "$target_version" | sort -t. -k1,1n -k2,2n -k3,3n | head -n1)"
[[ "$lowest" == "$current_version" ]] \
    || fail "target version ${target_version} is older than the current version ${current_version}"

target_tag="v${target_version}"

if git rev-parse --verify --quiet "refs/tags/${target_tag}" >/dev/null; then
    fail "tag already exists locally: ${target_tag} (tags are immutable and are never moved)"
fi
if git ls-remote --exit-code --tags "$REMOTE" "refs/tags/${target_tag}" >/dev/null 2>&1; then
    fail "tag already exists on '${REMOTE}': ${target_tag} (tags are immutable and are never moved)"
fi

echo ""
info "Release plan"
printf '  current version : %s\n' "$current_version"
printf '  target version  : %s\n' "$target_version"
printf '  target tag      : %s\n' "$target_tag"
printf '  branch / remote : %s -> %s\n' "$RELEASE_BRANCH" "$REMOTE"
printf '  migration policy: %s\n' "$MIGRATION_POLICY"
printf '  files to change : VERSION, chengflow/Cargo.toml, CHANGELOG.md\n'
echo ""

# ── 5. Write release metadata ─────────────────────────────────────────────────
write_version_file() {
    if action "write ${VERSION_FILE} <- ${target_version}"; then
        printf '%s\n' "$target_version" > "$VERSION_FILE"
    fi
}

# Rewrites `version = "..."` inside the [workspace.package] table only.
write_cargo_version() {
    if action "write ${CARGO_TOML} [workspace.package].version <- ${target_version}"; then
        local tmp
        tmp="$(mktemp)"
        awk -v new_version="$target_version" '
            /^[[:space:]]*\[/ { in_section = ($0 ~ /^[[:space:]]*\[workspace\.package\][[:space:]]*$/) }
            {
                if (in_section && !done && $0 ~ /^[[:space:]]*version[[:space:]]*=/) {
                    print "version = \"" new_version "\""
                    done = 1
                    next
                }
                print
            }
            END { if (!done) exit 3 }
        ' "$CARGO_TOML" > "$tmp" || { rm -f "$tmp"; fail "failed to rewrite [workspace.package].version"; }
        mv "$tmp" "$CARGO_TOML"
    fi
}

# Inserts a dated release section above the most recent released section and
# leaves the `[Unreleased]` heading in place for the next cycle. The generated
# body groups conventional commits but always keeps a maintainer-editable
# "Release notes" block, because a raw commit list is not release documentation.
write_changelog() {
    if ! action "insert CHANGELOG.md section '[${target_version}]'"; then
        return 0
    fi

    local range subject_lines added changed fixed other tmp today
    today="$(date -u +%Y-%m-%d)"

    local previous_tag
    previous_tag="$(git tag --list 'v*' --sort=-v:refname | head -n1)"
    if [[ -n "$previous_tag" ]]; then
        range="${previous_tag}..HEAD"
    else
        range="HEAD"
    fi
    subject_lines="$(git log --no-merges --pretty=format:'%s' "$range" 2>/dev/null || true)"

    added=""
    changed=""
    fixed=""
    other=""
    while IFS= read -r subject; do
        [[ -n "$subject" ]] || continue
        case "$subject" in
            release:*|"release "*) continue ;;
            feat:*|feat\(*) added+="- ${subject}"$'\n' ;;
            fix:*|fix\(*) fixed+="- ${subject}"$'\n' ;;
            refactor:*|refactor\(*|perf:*|perf\(*|chore:*|chore\(*|docs:*|docs\(*) changed+="- ${subject}"$'\n' ;;
            *) other+="- ${subject}"$'\n' ;;
        esac
    done <<< "$subject_lines"

    tmp="$(mktemp)"
    {
        printf '## [%s] - %s\n\n' "$target_version" "$today"
        printf '### Release notes\n\n'
        if [[ -n "$RELEASE_NOTES" ]]; then
            printf '%s\n\n' "$RELEASE_NOTES"
        else
            printf '<!-- Maintainer: describe the user-facing changes, required migration\n'
            printf '     steps, and any rollback limitation before publishing. -->\n\n'
        fi
        if [[ -n "$added" ]]; then printf '### Added\n\n%s\n' "$added"; fi
        if [[ -n "$changed" ]]; then printf '### Changed\n\n%s\n' "$changed"; fi
        if [[ -n "$fixed" ]]; then printf '### Fixed\n\n%s\n' "$fixed"; fi
        if [[ -n "$other" ]]; then printf '### Other\n\n%s\n' "$other"; fi
        printf '### Notes\n\n'
        printf -- '- Migration policy: %s\n' "$MIGRATION_POLICY"
        if [[ "$MIGRATION_POLICY" == "irreversible" ]]; then
            printf -- '- Automatic rollback to the previous release is NOT supported for this\n'
            printf -- '  version. Follow the manual recovery procedure in\n'
            printf -- '  `chengflow/docs/release-operations-guide.md`.\n'
        fi
        printf '\n'
    } > "$tmp"

    # Insert before the first released section; fall back to appending.
    if grep -qE '^## \[[0-9]' "$CHANGELOG"; then
        awk -v section_file="$tmp" '
            !inserted && /^## \[[0-9]/ {
                while ((getline line < section_file) > 0) print line
                close(section_file)
                inserted = 1
            }
            { print }
            END { if (!inserted) { while ((getline line < section_file) > 0) print line } }
        ' "$CHANGELOG" > "${CHANGELOG}.new"
        mv "${CHANGELOG}.new" "$CHANGELOG"
    else
        cat "$tmp" >> "$CHANGELOG"
    fi
    rm -f "$tmp"
}

info "Applying release metadata"
write_version_file
write_cargo_version
write_changelog

# ── 6. Gates ──────────────────────────────────────────────────────────────────
echo ""
info "Verifying post-write consistency"
if [[ "$DRY_RUN" == "true" ]]; then
    printf '  [dry-run] %s --tag %s\n' "$CONSISTENCY_CHECK" "$target_tag"
else
    bash "$CONSISTENCY_CHECK" --tag "$target_tag" \
        || fail "post-write consistency check failed; the worktree still holds the edits for inspection"
fi

if [[ "$SKIP_CHECKS" == "true" ]]; then
    info "Skipping release contract gates (--skip-checks)"
elif [[ "$DRY_RUN" == "true" ]]; then
    printf '  [dry-run] %s --version %s\n' "$CONTRACT_TEST" "$target_version"
elif [[ -f "$CONTRACT_TEST" ]]; then
    info "Running release contract gates"
    bash "$CONTRACT_TEST" --version "$target_version" \
        || fail "release contract gates failed; nothing was committed or pushed"
else
    fail "release contract gates not found: ${CONTRACT_TEST} (use --skip-checks only for a rehearsal)"
fi

# ── 7. Commit, tag, push ──────────────────────────────────────────────────────
echo ""
info "Git actions"
commit_message="release: ${target_tag}"

if action "git add VERSION chengflow/Cargo.toml CHANGELOG.md"; then
    git add VERSION CHANGELOG.md
    if [[ "$CHENGFLOW_IS_SEPARATE_REPO" == "true" ]]; then
        git -C "${REPO_ROOT}/chengflow" add Cargo.toml
    else
        git add chengflow/Cargo.toml
    fi
fi

if action "git commit -m '${commit_message}'"; then
    # When chengflow/ is its own repository the meta repo cannot see its
    # Cargo.toml, so the synchronized version is committed there separately.
    # The tag still lives on the meta repo: it is the release identity.
    if [[ "$CHENGFLOW_IS_SEPARATE_REPO" == "true" ]] \
        && ! git -C "${REPO_ROOT}/chengflow" diff --cached --quiet; then
        git -C "${REPO_ROOT}/chengflow" commit -m "$commit_message"
    fi
    git commit -m "$commit_message"
fi

if action "git tag -a ${target_tag} -m 'ChengOS ${target_version}'"; then
    git tag -a "$target_tag" -m "ChengOS ${target_version}"
fi

if action "git push ${REMOTE} ${RELEASE_BRANCH}"; then
    git push "$REMOTE" "$RELEASE_BRANCH" \
        || fail "push of ${RELEASE_BRANCH} failed; the local tag ${target_tag} was NOT pushed"
fi

if action "git push ${REMOTE} refs/tags/${target_tag}"; then
    git push "$REMOTE" "refs/tags/${target_tag}" \
        || fail "push of tag ${target_tag} failed; delete the local tag and retry after fixing the cause"
fi

echo ""
if [[ "$DRY_RUN" == "true" ]]; then
    info "Dry run complete — the repository was not modified."
else
    info "Released ${target_tag}. CI now builds, verifies, and publishes the artifacts."
fi
