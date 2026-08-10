#!/usr/bin/env bash
#
# ChengOS release contract gate.
#
# One command that proves a checkout is releasable. It is the gate `release.sh`
# runs before it commits or pushes anything, and the gate CI runs before it
# publishes any artifact or advances a floating tag.
#
# Checks, in order (cheapest first, so a broken version fails in a second):
#   1. version consistency: VERSION == Cargo workspace version (== tag)
#   2. shell syntax of every release-critical script
#   3. updater unit/integration tests (deploy/tests/update-smoke.sh)
#   4. compose resolution: all four ChengOS images resolve to one pin
#   5. Rust version embedding: cheng-api and cheng report the release version
#   6. archive verification, when a built archive is available
#
# Usage:
#   ./scripts/test-release-contract.sh [--version X.Y.Z] [--tag vX.Y.Z]
#                                      [--archive PATH] [--fast]
#
# Options:
#   --version X.Y.Z  Version every check must agree on (default: root VERSION).
#   --tag vX.Y.Z     Also assert the tag agrees.
#   --archive PATH   Verify this native archive too.
#   --fast           Skip the Rust build/version checks (shell/version gates
#                    only). Never use --fast for a real release.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

EXPECT_VERSION=""
TAG=""
ARCHIVE=""
FAST="false"

PASS=0
FAIL=0

ok()   { printf '  [ OK ] %s\n' "$*"; PASS=$(( PASS + 1 )); }
bad()  { printf '  [FAIL] %s\n' "$*" >&2; FAIL=$(( FAIL + 1 )); }
skip() { printf '  [SKIP] %s\n' "$*"; }
section() { printf '\n== %s\n' "$*"; }

usage() { sed -n '2,26p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

while [[ $# -gt 0 ]]; do
    case "$1" in
        --version) EXPECT_VERSION="${2#v}"; shift 2 ;;
        --tag) TAG="${2:-}"; shift 2 ;;
        --archive) ARCHIVE="${2:-}"; shift 2 ;;
        --fast) FAST="true"; shift ;;
        -h|--help) usage; exit 0 ;;
        *) echo "test-release-contract: unknown option: $1" >&2; usage >&2; exit 1 ;;
    esac
done

# ── 1. Version consistency ────────────────────────────────────────────────────

section "Version consistency"

consistency_args=()
[[ -n "$TAG" ]] && consistency_args+=(--tag "$TAG")
[[ -n "$EXPECT_VERSION" ]] && consistency_args+=(--expect "$EXPECT_VERSION")

if bash scripts/check-release-consistency.sh "${consistency_args[@]}" --quiet; then
    ok "VERSION, Cargo workspace version${TAG:+, and tag ${TAG}} agree"
else
    bad "version sources disagree or are malformed"
fi

RELEASE_VERSION="${EXPECT_VERSION:-$(tr -d '[:space:]' < VERSION 2>/dev/null || true)}"
printf '  release version: %s\n' "${RELEASE_VERSION:-<unresolved>}"

# ── 2. Shell syntax ───────────────────────────────────────────────────────────

section "Shell syntax of release-critical scripts"

RELEASE_SCRIPTS=(
    release.sh
    scripts/check-release-consistency.sh
    scripts/verify-release-archive.sh
    scripts/test-release-contract.sh
    deploy/chengos.sh
    deploy/lib/release-update.sh
    deploy/tests/update-smoke.sh
    deploy/hybrid/start.sh
    deploy/hybrid/stop.sh
    deploy/hybrid/status.sh
    deploy/generate-env.sh
    chengflow/build.sh
)

for script in "${RELEASE_SCRIPTS[@]}"; do
    if [[ ! -f "$script" ]]; then
        skip "${script} (not present in this checkout)"
        continue
    fi
    if bash -n "$script" 2>/dev/null; then
        ok "syntax: ${script}"
    else
        bad "syntax error in ${script}"
        bash -n "$script" || true
    fi
done

if command -v shellcheck >/dev/null 2>&1; then
    # Style findings must not gate a release; only genuine errors do.
    if shellcheck --severity=error --exclude=SC1090,SC1091 "${RELEASE_SCRIPTS[@]}" 2>/dev/null; then
        ok "shellcheck (error severity) clean"
    else
        bad "shellcheck reported errors in release-critical scripts"
    fi
else
    skip "shellcheck not installed"
fi

# ── 3. Updater tests ──────────────────────────────────────────────────────────

section "Updater integration tests"

if [[ -f deploy/tests/update-smoke.sh ]]; then
    if bash deploy/tests/update-smoke.sh >/tmp/chengos-update-smoke.log 2>&1; then
        ok "deploy/tests/update-smoke.sh"
    else
        bad "deploy/tests/update-smoke.sh failed (see /tmp/chengos-update-smoke.log)"
        tail -n 40 /tmp/chengos-update-smoke.log >&2
    fi
else
    bad "deploy/tests/update-smoke.sh is missing"
fi

# ── 4. Compose resolution ─────────────────────────────────────────────────────

section "Docker image pin resolution"

COMPOSE_FILE="deploy/docker/docker-compose.yml"
if [[ ! -f "$COMPOSE_FILE" ]]; then
    bad "${COMPOSE_FILE} is missing"
elif command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    # A clean environment: no per-image override may leak in from the shell.
    resolved="$(
        env -u CHENGOS_API_IMAGE -u CHENGOS_UI_IMAGE -u CHENGOS_APP_IMAGE -u CHENGOS_CLI_IMAGE \
            CHENGOS_VERSION="${RELEASE_VERSION:-0.0.0}" \
            docker compose -f "$COMPOSE_FILE" --profile cli config 2>/dev/null \
            | grep -E '^\s+image: chengos/' | sed 's/^ *image: //'
    )"
    expected_count=4
    actual_count="$(printf '%s\n' "$resolved" | grep -c ":${RELEASE_VERSION:-0.0.0}\$" || true)"
    if (( actual_count == expected_count )); then
        ok "all ${expected_count} ChengOS images resolve to :${RELEASE_VERSION}"
    else
        bad "expected ${expected_count} images pinned to :${RELEASE_VERSION}, found ${actual_count}"
        printf '%s\n' "$resolved" >&2
    fi
else
    # Static fallback: assert the template itself derives every tag from the pin.
    pinned="$(grep -cE 'image: \$\{CHENGOS_(API|UI|APP|CLI)_IMAGE:-chengos/[a-z_]+:\$\{CHENGOS_VERSION:-latest\}\}' "$COMPOSE_FILE" || true)"
    if (( pinned == 4 )); then
        ok "all 4 ChengOS services derive their tag from CHENGOS_VERSION (static check; docker unavailable)"
    else
        bad "only ${pinned}/4 ChengOS services derive their tag from CHENGOS_VERSION"
    fi
fi

# ── 5. Rust version embedding ─────────────────────────────────────────────────

section "Embedded Rust release version"

if [[ "$FAST" == "true" ]]; then
    skip "Rust build checks (--fast)"
elif ! command -v cargo >/dev/null 2>&1; then
    skip "cargo not installed"
elif [[ ! -d chengflow ]]; then
    skip "chengflow/ not present in this checkout"
else
    if ( cd chengflow && CHENGOS_VERSION="$RELEASE_VERSION" cargo build --release -p cheng-api -p cheng-cli ); then
        ok "cheng-api and cheng built"
        for pair in "target/release/cheng-api:cheng-api" "target/release/cheng:cheng"; do
            bin="chengflow/${pair%%:*}"
            name="${pair##*:}"
            if [[ ! -x "$bin" ]]; then
                bad "${name} binary not found at ${bin}"
                continue
            fi
            reported="$("$bin" --version 2>/dev/null | tr -d '[:space:]')"
            reported="${reported#"$name"}"
            reported="${reported#cheng}"
            if [[ "$reported" == "$RELEASE_VERSION" ]]; then
                ok "${name} --version reports ${RELEASE_VERSION}"
            else
                bad "${name} --version reported '${reported}', expected '${RELEASE_VERSION}'"
            fi
        done
    else
        bad "cargo build of cheng-api/cheng-cli failed"
    fi
fi

# ── 6. Archive verification ───────────────────────────────────────────────────

section "Native archive"

if [[ -z "$ARCHIVE" ]]; then
    candidate="dist/chengos-full-linux-amd64-v${RELEASE_VERSION}.tar.gz"
    [[ -f "$candidate" ]] && ARCHIVE="$candidate"
fi

if [[ -z "$ARCHIVE" ]]; then
    skip "no built archive to verify (build one with chengflow/build.sh --hybrid)"
elif bash scripts/verify-release-archive.sh --archive "$ARCHIVE" --expect-version "$RELEASE_VERSION" --quiet; then
    ok "archive verified: $(basename "$ARCHIVE")"
    if [[ -f "${ARCHIVE}.sha256" ]]; then
        if ( cd "$(dirname "$ARCHIVE")" && sha256sum -c "$(basename "$ARCHIVE").sha256" >/dev/null 2>&1 ); then
            ok "archive checksum matches its .sha256"
        else
            bad "archive checksum does not match its .sha256"
        fi
    else
        bad "archive has no adjacent .sha256"
    fi
else
    bad "archive verification failed: ${ARCHIVE}"
fi

# ── Summary ───────────────────────────────────────────────────────────────────

printf '\n─────────────────────────────────────────\n'
printf 'release contract: %d passed, %d failed\n' "$PASS" "$FAIL"
if (( FAIL > 0 )); then
    printf 'RELEASE BLOCKED\n' >&2
    exit 1
fi
printf 'release contract satisfied\n'
