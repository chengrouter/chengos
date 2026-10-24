#!/usr/bin/env bash
#
# Shell-level tests for coding-agent CLI deployment (deployment plan §12).
#
# Everything runs against throwaway installation roots, a local file:// mock
# npm registry signed with a throwaway key, script stand-ins for codex, bwrap
# and cheng-api, and fixture archives. No network, no Docker, no real
# credentials, and no real installation or home directory is touched.
#
# Usage: bash deploy/tests/coding-agent-setup-smoke.sh
set -uo pipefail

TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${TEST_DIR}/.." && pwd)"

WORK_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/chengos-cli-smoke-XXXXXX")"
trap 'rm -rf "$WORK_ROOT"' EXIT

PASS=0
FAIL=0
ok() { printf '  \033[32mPASS\033[0m %s\n' "$*"; PASS=$((PASS + 1)); }
ko() { printf '  \033[31mFAIL\033[0m %s\n' "$*"; FAIL=$((FAIL + 1)); }
section() { printf '\n== %s\n' "$*"; }
assert_eq() { if [[ "$1" == "$2" ]]; then ok "$3"; else ko "$3 (expected '$1', got '$2')"; fi; }
assert_true() { if "${@:2}"; then ok "$1"; else ko "$1"; fi; }
assert_false() { if "${@:2}"; then ko "$1"; else ok "$1"; fi; }
assert_contains() { if [[ "$2" == *"$1"* ]]; then ok "$3"; else ko "$3 (missing '$1')"; fi; }

# shellcheck source=../lib/env-file.sh
source "${DEPLOY_DIR}/lib/env-file.sh"
# shellcheck source=../lib/compose-files.sh
source "${DEPLOY_DIR}/lib/compose-files.sh"

# ── 1. .env reader/writer ────────────────────────────────────────────────────

section ".env reader/writer (lib/env-file.sh)"

E="${WORK_ROOT}/envtest"
mkdir -p "$E"
cat > "${E}/.env" <<'EOF'
# header comment
JWT_SECRET=keep-me-verbatim
A=1
#B=template
export C="quoted value"
A=duplicate
D=x # inline comment
EOF
chmod 600 "${E}/.env"

envf_set "${E}/.env" --section "Test" A=2 "B=/path with space" NEW=v EMPTY= -D
assert_eq "2" "$(envf_get "${E}/.env" A)" "rewrites an active assignment"
assert_eq "2" "$(grep -c '^A=2$' "${E}/.env")" "rewrites every duplicate to the same value (like the backend)"
assert_eq "0" "$(grep -c '^A=duplicate' "${E}/.env")" "leaves no stale duplicate"
assert_eq "/path with space" "$(envf_get "${E}/.env" B)" "uncomments a template line and quotes a spaced value"
assert_eq "4" "$(grep -n '^B=' "${E}/.env" | cut -d: -f1)" "keeps the template line's position"
assert_eq "quoted value" "$(envf_get "${E}/.env" C)" "reads export + double quotes like the backend"
assert_false "clearing a key removes its assignment" envf_get "${E}/.env" D
assert_eq "keep-me-verbatim" "$(envf_get "${E}/.env" JWT_SECRET)" "leaves unrelated secrets verbatim"
assert_true "an empty value is an assignment" envf_get "${E}/.env" EMPTY
assert_eq "600" "$(stat -c %a "${E}/.env")" "keeps the file mode"
assert_true "keeps a .bak copy" test -f "${E}/.env.bak"
before="$(sha256sum < "${E}/.env")"
assert_false "refuses a value needing quotes that contains a single quote" envf_set "${E}/.env" "X=it's \$1" 2>/dev/null
assert_false "refuses a multi-line value" envf_set "${E}/.env" $'X=a\nb' 2>/dev/null
assert_false "refuses an invalid key" envf_set "${E}/.env" "lower=1" 2>/dev/null
assert_eq "$before" "$(sha256sum < "${E}/.env")" "a refused update changes nothing"
envf_set "${E}/.env" A=2 NEW=v
assert_eq "1" "$(grep -c '^NEW=' "${E}/.env")" "repeated runs do not append duplicates"

# Lock contention: a writer must wait for, and here time out on, a held lock.
( exec 9>>"${E}/.env.lock"; flock 9; sleep 3 ) &
holder=$!
sleep 0.5
assert_false "times out while another writer holds the lock" env ENVF_LOCK_TIMEOUT=1 bash -c \
    "source '${DEPLOY_DIR}/lib/env-file.sh'; envf_set '${E}/.env' A=3" 2>/dev/null
wait "$holder"
assert_eq "2" "$(envf_get "${E}/.env" A)" "the blocked write left the file unchanged"

# Layout migration keeps one file reachable through the compatibility link.
assert_eq "legacy" "$(envf_layout "$E")" "detects the legacy layout"
envf_migrate "$E"
assert_eq "migrated" "$(envf_layout "$E")" "migrates into env/"
assert_true ".env is now a symlink" test -L "${E}/.env"
envf_set "${E}/.env" A=4
assert_true "a write through the link keeps the link" test -L "${E}/.env"
assert_eq "4" "$(envf_get "${E}/env/.env" A)" "the write landed in env/.env"
assert_true "migrated writes lock next to the real file" test -f "${E}/env/.env.lock"
ino1="$(stat -c %i "${E}/env/.env")"
envf_set "${E}/.env" A=5
ino2="$(stat -c %i "${E}/env/.env")"
assert_false "migrated writes are rename-based (new inode)" test "$ino1" = "$ino2"
envf_unmigrate "$E"
assert_eq "legacy" "$(envf_layout "$E")" "unmigrate restores the legacy layout"
ino1="$(stat -c %i "${E}/.env")"
envf_set "${E}/.env" A=6
ino2="$(stat -c %i "${E}/.env")"
assert_eq "$ino1" "$ino2" "legacy writes keep the inode (single-file bind mounts stay attached)"
mkdir -p "${E}/env" && cp "${E}/.env" "${E}/env/.env"
assert_eq "split" "$(envf_layout "$E")" "detects a split layout"
rm -rf "${E}/env"

# generate-env.sh --force on a migrated layout must not replace the link.
G="${WORK_ROOT}/gen"
mkdir -p "${G}/lib"
cp "${DEPLOY_DIR}/generate-env.sh" "${DEPLOY_DIR}/.env.example" "$G/"
cp "${DEPLOY_DIR}/lib/env-file.sh" "${G}/lib/"
( cd "$G" && bash generate-env.sh >/dev/null 2>&1 )
envf_migrate "$G"
( cd "$G" && bash generate-env.sh --force >/dev/null 2>&1 )
assert_true "generate-env.sh --force keeps the compatibility link" test -L "${G}/.env"
assert_eq "migrated" "$(envf_layout "$G")" "generate-env.sh --force writes the real file"
assert_eq "$(readlink -f "${G}/env/.env")" "$(envf_get "${G}/env/.env" CHENGOS_ENV_FILE)" \
    "CHENGOS_ENV_FILE names the canonical file"

# Generators commit under the shared lock.
before="$(sha256sum < "${G}/env/.env")"
( exec 9>>"${G}/env/.env.lock"; flock 9; sleep 3 ) &
holder=$!
sleep 0.5
assert_false "generate-env.sh --force waits for, and here times out on, the shared lock" \
    env ENVF_LOCK_TIMEOUT=1 bash -c "cd '$G' && bash generate-env.sh --force" >/dev/null 2>&1
wait "$holder"
assert_eq "$before" "$(sha256sum < "${G}/env/.env")" "a generator blocked by the lock changes nothing"
assert_false "no staged generator file is left behind" compgen -G "${G}/env/.env.generate.*"

# Without lib/ (older layouts) the generator's fallback takes the same lock.
GF="${WORK_ROOT}/gen-fallback"
mkdir -p "$GF"
cp "${DEPLOY_DIR}/generate-env.sh" "${DEPLOY_DIR}/.env.example" "$GF/"
( cd "$GF" && bash generate-env.sh >/dev/null 2>&1 )
fb_before="$(sha256sum < "${GF}/.env")"
( exec 9>>"${GF}/.env.lock"; flock 9; sleep 3 ) &
holder=$!
sleep 0.5
assert_false "the lib-less fallback also waits for, and times out on, the lock" \
    env ENVF_LOCK_TIMEOUT=1 bash -c "cd '$GF' && bash generate-env.sh --force" >/dev/null 2>&1
wait "$holder"
assert_eq "$fb_before" "$(sha256sum < "${GF}/.env")" "the blocked fallback changes nothing"

# --force refuses while this installation's API runs.
mkdir -p "${G}/bin"
printf '#!/bin/sh\nsleep 30\n' > "${G}/bin/cheng-api"
chmod 755 "${G}/bin/cheng-api"
"${G}/bin/cheng-api" &
api_pid=$!
sleep 0.3
out="$(cd "$G" && bash generate-env.sh --force 2>&1)"
assert_contains "appears to be running" "$out" "generate-env.sh --force is refused while ChengOS runs"
assert_eq "$before" "$(sha256sum < "${G}/env/.env")" "a refused --force changes nothing"
( cd "$G" && bash generate-env.sh --force --allow-running >/dev/null 2>&1 )
assert_false "--allow-running regenerates deliberately" test "$before" = "$(sha256sum < "${G}/env/.env")"
kill "$api_pid" 2>/dev/null; wait "$api_pid" 2>/dev/null

# Create-if-absent is decided under the lock.
printf 'X=1\n' > "${G}/env/.staged-test"
envf_replace_file "${G}/.env" "${G}/env/.staged-test" --if-absent 2>/dev/null
assert_eq "3" "$?" "envf_replace_file --if-absent refuses an existing target"
rm -f "${G}/env/.staged-test"

# The distributed generator applies its overrides in one locked transaction.
DG="${WORK_ROOT}/dist"
mkdir -p "${DG}/lib" "${DG}/distributed"
cp "${DEPLOY_DIR}/generate-env.sh" "${DEPLOY_DIR}/.env.example" "$DG/"
cp "${DEPLOY_DIR}/lib/env-file.sh" "${DG}/lib/"
cp "${DEPLOY_DIR}/distributed/generate-env.sh" "${DG}/distributed/"
printf 'POSTGRES_HOST=10.0.0.9\nPOSTGRES_PASSWORD=pw123\nREDIS_PASSWORD=rp456\n' > "${DG}/distributed/vps_b_env.txt"
( cd "${DG}/distributed" && bash generate-env.sh >/dev/null 2>&1 )
assert_eq "postgres://tianai_db:pw123@10.0.0.9:5432/master_router" "$(envf_get "${DG}/.env" DATABASE_URL)" \
    "distributed overrides land through the shared writer"
assert_eq "1" "$(grep -c '^DATABASE_URL=' "${DG}/.env")" "distributed overrides leave one assignment per key"

# A migration whose permission step fails is rolled back completely.
MR="${WORK_ROOT}/migrate-rollback"
mkdir -p "$MR"
printf 'A=1\n' > "${MR}/.env"
if [[ "$(id -u)" -ne 0 ]]; then
    envf_migrate "$MR" 4294967290 2>/dev/null
    assert_eq "1" "$?" "a failed permission step reports failure"
    assert_eq "legacy" "$(envf_layout "$MR")" "and rolls the move back (layout really unchanged)"
    assert_eq "1" "$(envf_get "${MR}/.env" A)" "the rolled-back .env is intact"
fi

# Real ENOSPC on a size-limited tmpfs (user + mount namespace, no root needed).
section ".env writes on a full disk (real ENOSPC)"
if unshare -rm true 2>/dev/null; then
    cat > "${WORK_ROOT}/enospc.sh" <<'ENOSPC'
set -u
source "$1/lib/env-file.sh"
export CHENGOS_NPM_TEST_INSECURE=1
d="$(mktemp -d)"
mount -t tmpfs -o size=1m tmpfs "$d" || { echo "SKIP tmpfs"; exit 0; }
say() { printf '%s %s\n' "$1" "$2"; }
fresh() {   # fresh LEGACY .env of one page, disk left with $1 free pages
    rm -f "$d"/.env* "$d/fill"
    printf 'A=1\nB=2\n' > "$d/.env"
    cp "$d/.env" "$d/orig"
    local used=2   # .env + orig
    dd if=/dev/zero of="$d/fill" bs=4096 count=$((256 - used - $1)) 2>/dev/null
}
big="$(head -c 20000 /dev/zero | tr '\0' 'x')"   # ~5 pages

fresh 10   # 40 KiB free: staging fits, but below need + 64 KiB margin
envf_set "$d/.env" "C=${big}" 2>/dev/null; rc=$?
[[ $rc -ne 0 ]] && cmp -s "$d/.env" "$d/orig" && say PASS "space pre-check refuses before touching the file" \
    || say FAIL "space pre-check (rc=$rc)"

fresh 0
envf_set "$d/.env" "C=${big}" 2>/dev/null; rc=$?
[[ $rc -ne 0 ]] && cmp -s "$d/.env" "$d/orig" && say PASS "a full disk fails at staging and leaves the file intact" \
    || say FAIL "full-disk staging (rc=$rc)"
ls "$d"/.env.tmp.* >/dev/null 2>&1 && say FAIL "staging leftovers" || say PASS "no staging leftovers on a full disk"

fresh 7   # staging (5) + .bak (1) fit; the in-place write (5) then cannot
ENVF_TEST_SKIP_SPACE_CHECK=1 envf_set "$d/.env" "C=${big}" 2>/dev/null; rc=$?
[[ $rc -eq 1 ]] && cmp -s "$d/.env" "$d/orig" \
    && say PASS "ENOSPC during the in-place write: previous content restored and verified" \
    || say FAIL "in-place ENOSPC restore (rc=$rc, now: $(head -c 40 "$d/.env" | tr '\n' ' '))"
umount "$d"
ENOSPC
    while read -r verdict label; do
        case "$verdict" in
            PASS) ok "$label" ;;
            FAIL) ko "$label" ;;
            SKIP) printf '  SKIP %s\n' "$label" ;;
        esac
    done < <(unshare -rm bash "${WORK_ROOT}/enospc.sh" "$DEPLOY_DIR" 2>&1)
else
    printf '  SKIP real ENOSPC tests (unprivileged user namespaces unavailable)\n'
fi
# Both the write and the restore failing: status 4, previous content in .bak.
W4="${WORK_ROOT}/write-fail"
mkdir -p "$W4"
printf 'A=1\n' > "${W4}/.env"
if [[ "$(id -u)" -ne 0 ]]; then
    chmod 400 "${W4}/.env"
    envf_set "${W4}/.env" A=2 2>/dev/null
    assert_eq "4" "$?" "write and restore both failing returns status 4"
    assert_eq "1" "$(envf_get "${W4}/.env.bak" A)" "the intact previous content is in .bak"
    chmod 600 "${W4}/.env"
fi

# ── 2. Compose file list ─────────────────────────────────────────────────────

section "Compose file list (lib/compose-files.sh)"

C="${WORK_ROOT}/compose"
mkdir -p "${C}/docker"
touch "${C}/docker/docker-compose.yml" "${C}/docker/docker-compose.binds.yml" \
      "${C}/docker/docker-compose.remote.yml" "${C}/docker/docker-compose.env-dir.yml"
echo "A=1" > "${C}/.env"
compose_file_args "${C}/docker" "$C"
assert_eq "-f ${C}/docker/docker-compose.yml -f ${C}/docker/docker-compose.binds.yml" "${COMPOSE_FILE_ARGS[*]}" \
    "legacy layout: base + binds"
compose_file_args "${C}/docker" "$C" false true
assert_eq "-f ${C}/docker/docker-compose.yml -f ${C}/docker/docker-compose.remote.yml" "${COMPOSE_FILE_ARGS[*]}" \
    "--no-binds --remote keep their semantics"
envf_migrate "$C"
compose_file_args "${C}/docker" "$C"
assert_contains "docker-compose.env-dir.yml" "${COMPOSE_FILE_ARGS[*]}" "migrated layout adds the env/ directory mount"
assert_eq "${C}/env/.env" "$(compose_env_file "$C")" "--env-file uses the canonical file"

# ── 3. Fixtures: mock registry, codex, bwrap, cheng-api ─────────────────────

TARGET="x86_64-unknown-linux-musl"
REG="${WORK_ROOT}/registry"
KEYS_DIR="${WORK_ROOT}/keys"
MOCKBIN="${WORK_ROOT}/mockbin"
mkdir -p "${REG}/@openai" "${REG}/tarballs" "$KEYS_DIR" "$MOCKBIN"

openssl ecparam -name prime256v1 -genkey -noout -out "${KEYS_DIR}/test.key" 2>/dev/null
openssl ec -in "${KEYS_DIR}/test.key" -pubout -outform DER 2>/dev/null | base64 -w0 > "${KEYS_DIR}/test.pub.b64"
openssl ecparam -name prime256v1 -genkey -noout -out "${KEYS_DIR}/rogue.key" 2>/dev/null
cat > "${KEYS_DIR}/keys.json" <<EOF
{"keys":[{"expires":null,"keyid":"SHA256:test","keytype":"ecdsa-sha2-nistp256","scheme":"ecdsa-sha2-nistp256","key":"$(cat "${KEYS_DIR}/test.pub.b64")"}]}
EOF

# make_build VERSION KIND — KIND: good | badhandshake | symlink | layout
make_build() {
    local version="$1" kind="$2" root
    root="$(mktemp -d "${WORK_ROOT}/build.XXXXXX")"
    local v="${root}/package/vendor/${TARGET}"
    mkdir -p "${v}/bin" "${v}/codex-path" "${v}/codex-resources"
    printf '{"name":"@openai/codex","version":"%s-linux-x64","os":["linux"],"cpu":["x64"]}\n' "$version" > "${root}/package/package.json"
    printf '# codex\n' > "${root}/package/README.md"
    local layout=1
    [[ "$kind" == "layout" ]] && layout=99
    printf '{"layoutVersion":%s,"version":"%s","target":"%s","variant":"codex","entrypoint":"bin/codex","resourcesDir":"codex-resources","pathDir":"codex-path"}\n' \
        "$layout" "$version" "$TARGET" > "${v}/codex-package.json"
    printf '#!/bin/sh\necho rg\n' > "${v}/codex-path/rg"
    local reply='{"id":1,"result":{"userAgent":"codex_cli_rs/'"$version"'"}}'
    [[ "$kind" == "badhandshake" ]] && reply='{"id":1,"error":{"code":-32601,"message":"no initialize"}}'
    cat > "${v}/bin/codex" <<EOF
#!/usr/bin/env bash
case "\${1:-}" in
    --version) echo "codex-cli ${version}" ;;
    app-server)
        while IFS= read -r line; do
            case "\$line" in *'"method":"initialize"'*) echo '${reply}' ;; esac
        done ;;
esac
EOF
    chmod 755 "${v}/bin/codex" "${v}/codex-path/rg"
    [[ "$kind" == "symlink" ]] && ln -s /etc/passwd "${v}/codex-resources/escape"
    tar -czf "${REG}/tarballs/codex-${version}-linux-x64.tgz" -C "$root" package
    rm -rf "$root"
}

# Packument: VERSION:AGE_DAYS:KIND:SIGNER (SIGNER test|rogue|none; KIND nobuild skips the platform build)
build_registry() {
    local now spec version age kind signer
    now="$(date -u +%s)"
    {
        printf '{"name":"@openai/codex","versions":{'
        local first=true times=""
        for spec in "$@"; do
            IFS=: read -r version age kind signer <<<"$spec"
            local ts
            ts="$(date -u -d "@$((now - age * 86400))" +%Y-%m-%dT%H:%M:%S.000Z)"
            $first || printf ','
            first=false
            printf '"%s":{"version":"%s","dist":{"integrity":"sha512-x","tarball":"file://%s/none.tgz"}}' "$version" "$version" "$REG"
            times+="\"${version}\":\"${ts}\","
            if [[ "$kind" != "nobuild" ]]; then
                make_build "$version" "$kind"
                local tgz="${REG}/tarballs/codex-${version}-linux-x64.tgz" sri sig=""
                sri="sha512-$(openssl dgst -sha512 -binary "$tgz" | base64 -w0)"
                [[ "$kind" == "badintegrity" ]] && printf 'tampered' >> "$tgz"
                if [[ "$signer" != "none" ]]; then
                    sig="$(printf '%s' "@openai/codex@${version}-linux-x64:${sri}" \
                        | openssl dgst -sha256 -sign "${KEYS_DIR}/${signer}.key" | base64 -w0)"
                fi
                printf ',"%s-linux-x64":{"version":"%s-linux-x64","dist":{"integrity":"%s","tarball":"file://%s","signatures":[%s]}}' \
                    "$version" "$version" "$sri" "$tgz" \
                    "$([[ -n "$sig" ]] && printf '{"keyid":"SHA256:test","sig":"%s"}' "$sig")"
                times+="\"${version}-linux-x64\":\"${ts}\","
            fi
        done
        printf '},"time":{%s"created":"2020-01-01T00:00:00.000Z"}}' "$times"
    } > "${REG}/@openai/codex"
}

build_registry \
    "0.150.0:40:good:test" \
    "0.155.0:30:badhandshake:test" \
    "0.149.0:35:badintegrity:test" \
    "0.148.0:36:good:rogue" \
    "0.147.0:37:symlink:test" \
    "0.146.0:38:layout:test" \
    "0.160.1:10:good:test" \
    "0.161.0:8:nobuild:test" \
    "0.162.0:3:good:test" \
    "0.163.0-alpha.1:20:good:test"

# bwrap stand-in: runs whatever follows `--`, so the sandbox logic is tested
# without depending on this host's namespace policy.
cat > "${MOCKBIN}/bwrap" <<'EOF'
#!/usr/bin/env bash
while [[ $# -gt 0 && "$1" != "--" ]]; do shift; done
shift
[[ "${MOCK_BWRAP:-ok}" == "ok" ]] || { echo "bwrap: No permissions to create new namespace" >&2; exit 1; }
exec "$@"
EOF
chmod 755 "${MOCKBIN}/bwrap"

# make_install ROOT — a bundle-layout installation with a mock cheng-api.
make_install() {
    local root="$1"
    mkdir -p "${root}/bin" "${root}/hybrid" "${root}/lib" "${root}/cli" "${root}/workspace"
    cp "${DEPLOY_DIR}"/lib/*.sh "${DEPLOY_DIR}"/lib/*.py "${DEPLOY_DIR}"/lib/*.json "${root}/lib/"
    cp "${DEPLOY_DIR}"/cli/*.sh "${root}/cli/"
    cp "${DEPLOY_DIR}/chengos.sh" "${root}/chengos.sh"
    cp "${DEPLOY_DIR}"/hybrid/*.sh "${root}/hybrid/"
    cp "${DEPLOY_DIR}/generate-env.sh" "${DEPLOY_DIR}/.env.example" "${root}/"
    printf 'en\n' > "${root}/.chengos_lang"
    printf 'native\n' > "${root}/.chengos_install_mode"
    ( cd "$root" && bash generate-env.sh >/dev/null 2>&1 )
    cat > "${root}/bin/cheng-api" <<'EOF'
#!/usr/bin/env bash
if [[ "$1 $2" == "admin --help" ]]; then echo "  coding-agent-probe [--timeout-secs N]"; exit 0; fi
if [[ "$1 $2" == "admin coding-agent-probe" ]]; then
    printf 'executable:  %s\n' "${CHENG_CODING_AGENT_CODEX_BIN:-}"
    case "${MOCK_PROBE:-ok}" in
        ok)
            [[ "${CHENG_CODING_AGENT_ENABLED:-}" == "true" && -x "${CHENG_CODING_AGENT_CODEX_BIN:-/nonexistent}" \
               && -d "${CHENG_CODING_AGENT_STATE_DIR:-/nonexistent}" ]] \
                || { echo "result: failed stage=config"; exit 1; }
            echo "result: ok" ;;
        launch) echo "result: failed stage=launch"; exit 1 ;;
        handshake) echo "result: failed stage=handshake"; exit 1 ;;
    esac
    exit 0
fi
exit 1
EOF
    chmod 755 "${root}/bin/cheng-api"
}

export CHENGOS_NPM_TEST_INSECURE=1
export CHENGOS_CODEX_TEST_SCRIPT_BINARY=1
export CHENGOS_NPM_REGISTRY="file://${REG}"
export CHENGOS_NPM_REGISTRY_KEYS="${KEYS_DIR}/keys.json"
export PATH="${MOCKBIN}:${PATH}"

I="${WORK_ROOT}/install"
make_install "$I"
export CHENGOS_CLI_RUNTIME_HOME="${WORK_ROOT}/home"
mkdir -p "$CHENGOS_CLI_RUNTIME_HOME"
SETUP=(bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --non-interactive)
envsum() { sha256sum < "$(readlink -f "${I}/.env")"; }
run_setup() { "${SETUP[@]}" "$@" >"${WORK_ROOT}/out.log" 2>&1; }

# ── 4. Version resolution ────────────────────────────────────────────────────

section "Version resolution (lib/npm_registry.py)"

resolve() { python3 -I "${DEPLOY_DIR}/lib/npm_registry.py" resolve "${REG}/@openai/codex" linux-x64 7 "$(date -u +%s)" "$1"; }
assert_contains "version=0.160.1" "$(resolve stable)" \
    "stable = newest X.Y.Z >= 7 days with a platform build (skips build-less 0.161.0 and pre-releases)"
out="$(resolve 0.162.0)"
assert_contains "within_window=true" "$out" "an explicit version inside the window is allowed and flagged"
assert_false "a version without a platform build is refused" resolve 0.161.0 2>/dev/null
assert_false "a pre-release is never an exact candidate" resolve 0.163.0-alpha.1 2>/dev/null
assert_false "an unpublished version is refused" resolve 9.9.9 2>/dev/null

# ── 5. End-to-end setup ──────────────────────────────────────────────────────

section "Setup: install, verify, activate (native)"

secrets_before="$(grep -E '^(JWT_SECRET|POSTGRES_PASSWORD|CREDENTIAL_MASTER_KEY_1)=' "$(readlink -f "${I}/.env")")"
run_setup --version-policy stable
assert_eq "0" "$?" "stable policy installs and activates"
EF="$(readlink -f "${I}/.env")"
BIN="${I}/runtime/cli/codex/versions/0.160.1/${TARGET}/bin/codex"
assert_eq "true" "$(envf_get "$EF" CHENG_CODING_AGENT_ENABLED)" "enables the coding agent"
assert_eq "$BIN" "$(envf_get "$EF" CHENG_CODING_AGENT_CODEX_BIN)" "points at the deterministic version path"
assert_eq "${CHENGOS_CLI_RUNTIME_HOME}/.local/share/cheng/agent-state" "$(envf_get "$EF" CHENG_CODING_AGENT_STATE_DIR)" \
    "state lives in the runtime user's home, outside the installation"
assert_eq "700" "$(stat -c %a "${CHENGOS_CLI_RUNTIME_HOME}/.local/share/cheng/agent-state")" "state dir is 0700"
assert_eq "${I}/workspace/coding-agent" "$(envf_get "$EF" CHENG_CODING_AGENT_DEDICATED_ROOTS)" "working root under the workspace"
assert_eq "${I}/workspace/coding-agent" "$(envf_get "$EF" CHENG_CODING_AGENT_DEFAULT_ROOT)" "pins the default directory to the work root"
assert_false "never switches the web default scope on" envf_get "$EF" CHENG_CODING_AGENT_WEB_DEFAULT_SCOPE
assert_eq "true" "$(envf_get "$EF" CHENG_CREDENTIAL_AUTH_ENABLED)" "new setup enables device-code login"
host_id="$(envf_get "$EF" CHENG_CODING_AGENT_HOST_ID)"
if [[ -r /etc/machine-id && "$(tr -d '[:space:]' < /etc/machine-id)" =~ ^[0-9a-f]{32}$ ]]; then
    assert_eq "$(tr -d '[:space:]' < /etc/machine-id)" "$host_id" "native HOST_ID is the persisted machine-id"
else
    assert_contains "chengos-" "$host_id" "HOST_ID falls back to a generated identifier"
fi
assert_false "the tasks tier writes no resumable keys" envf_get "$EF" CHENG_CODING_AGENT_RESUMABLE_ENABLED
assert_eq "$secrets_before" "$(grep -E '^(JWT_SECRET|POSTGRES_PASSWORD|CREDENTIAL_MASTER_KEY_1)=' "$EF")" \
    "DB/JWT/master-key secrets stay verbatim"
assert_eq "active" "$(envf_get "${I}/runtime/cli/codex/records/0.160.1.rec" STATUS)" "records the version as active"
assert_eq "SHA256:test" "$(envf_get "${I}/runtime/cli/codex/records/0.160.1.rec" SIGNING_KEYID)" "records the signing key"
assert_eq "true" "$(envf_get "${I}/runtime/cli/codex/state" PENDING_RESTART)" "marks a pending restart"

sum1="$(envsum)"
run_setup --version-policy stable
assert_eq "0" "$?" "a repeated run succeeds"
assert_contains "already installed and verified" "$(cat "${WORK_ROOT}/out.log")" "reuses the verified version without downloading"
assert_eq "1" "$(grep -c '^CHENG_CODING_AGENT_ENABLED=' "$EF")" "no duplicate keys after a re-run"
assert_eq "$sum1" "$(envsum)" "an identical re-run leaves .env identical"

section "Setup: failures change nothing"

for case_ in "0.149.0:integrity mismatch" "0.148.0:signature check failed" "0.147.0:not a regular file" \
             "0.146.0:unknown vendor layoutVersion" "0.155.0:initialize failed"; do
    version="${case_%%:*}"
    expect="${case_#*:}"
    before="$(envsum)"
    run_setup --version "$version"
    rc=$?
    assert_eq "1" "$rc" "${version}: refused"
    assert_contains "$expect" "$(cat "${WORK_ROOT}/out.log")" "${version}: reports '${expect}'"
    assert_eq "$before" "$(envsum)" "${version}: .env unchanged"
done
assert_contains "different version may help" "$(cat "${WORK_ROOT}/out.log")" "a protocol failure suggests another version"
assert_false "an unsafe archive leaves no version directory" test -e "${I}/runtime/cli/codex/versions/0.147.0"
assert_eq "$BIN" "$(envf_get "$EF" CHENG_CODING_AGENT_CODEX_BIN)" "failures never touch the active version"

before="$(envsum)"
MOCK_PROBE=launch run_setup --version 0.162.0
assert_eq "1" "$?" "a backend sandbox probe failure refuses activation"
assert_contains "will not fix it" "$(cat "${WORK_ROOT}/out.log")" "an environment failure says a version change will not help"
assert_eq "$before" "$(envsum)" "a backend probe failure changes nothing"
assert_eq "probed" "$(envf_get "${I}/runtime/cli/codex/records/0.162.0.rec" STATUS)" \
    "the verified version stays recorded for a later activation"

before="$(envsum)"
MOCK_BWRAP=blocked run_setup --version 0.162.0
assert_eq "3" "$?" "a blocked native sandbox is an environment block (exit 3)"
assert_contains "This installer never changes sysctls" "$(cat "${WORK_ROOT}/out.log")" "prints remediation without applying it"
assert_eq "$before" "$(envsum)" "a blocked sandbox changes nothing"

before="$(envsum)"
bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode docker --non-interactive >"${WORK_ROOT}/out.log" 2>&1
assert_eq "3" "$?" "Docker mode is blocked by the feasibility gate"
assert_eq "$before" "$(envsum)" "Docker refusal changes nothing"

section "Setup: activation bookkeeping and fault injection"

before="$(envsum)"
CHENGOS_CLI_TEST_FAIL_AT=precommit run_setup --version 0.162.0
assert_eq "1" "$?" "a state write failure before the commit refuses activation"
assert_eq "$before" "$(envsum)" "and leaves .env unchanged"
if [[ "$(id -u)" -ne 0 ]]; then
    chmod a-w "${I}/runtime/cli/codex"
    run_setup --version 0.162.0
    rc=$?
    chmod u+w "${I}/runtime/cli/codex"
    assert_eq "1" "$rc" "a real permission error on the installer state refuses activation"
    assert_eq "$before" "$(envsum)" "and leaves .env unchanged"
fi

CHENGOS_CLI_TEST_FAIL_AT=bookkeeping run_setup --version 0.162.0
assert_eq "5" "$?" "a record failure after the commit is reported as status 5, not success"
assert_contains "IS configured" "$(cat "${WORK_ROOT}/out.log")" "the message says the configuration is committed"
assert_eq "0.162.0" "$(envf_get "$EF" CHENGOS_CODEX_VERSION)" ".env holds the committed version"
out="$(bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --check 2>&1)"
assert_eq "1" "$?" "--check flags the record/.env disagreement"
assert_contains "--repair" "$out" "--check gives the recovery command"
before="$(envsum)"
bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --repair >"${WORK_ROOT}/out.log" 2>&1
assert_eq "0" "$?" "--repair reconciles the records"
assert_eq "$before" "$(envsum)" "--repair never edits .env"
assert_eq "active" "$(envf_get "${I}/runtime/cli/codex/records/0.162.0.rec" STATUS)" "the configured version is active again"
assert_eq "previous" "$(envf_get "${I}/runtime/cli/codex/records/0.160.1.rec" STATUS)" "the replaced version is the rollback target"
out="$(bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --check 2>&1)"
assert_false "--check no longer reports a disagreement" grep -q "disagree" <<<"$out"

section "Setup: integrity manifest and same-version reinstall"

ACTIVE_DIR="${I}/runtime/cli/codex/versions/0.162.0/${TARGET}"
assert_true "a full-tree manifest is recorded" test -s "${I}/runtime/cli/codex/records/0.162.0.manifest"
echo "# tampered" >> "${ACTIVE_DIR}/codex-path/rg"
out="$(bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --check 2>&1)"
assert_eq "1" "$?" "--check detects a modified companion file (codex-path/rg)"
assert_contains "codex-path/rg" "$out" "--check names the changed file"
before="$(envsum)"
CHENGOS_CLI_TEST_FAIL_AT=localprobe run_setup --version 0.162.0
assert_eq "1" "$?" "a same-version reinstall whose new copy fails is refused"
assert_true "the configured binary still exists afterwards" test -x "${ACTIVE_DIR}/bin/codex"
assert_contains "# tampered" "$(cat "${ACTIVE_DIR}/codex-path/rg")" "the previous copy was put back, not deleted"
assert_eq "active" "$(envf_get "${I}/runtime/cli/codex/records/0.162.0.rec" STATUS)" "the in-use version is not demoted"
assert_eq "$before" "$(envsum)" "a failed reinstall changes nothing"
assert_false "no swap leftovers remain" compgen -G "${I}/runtime/cli/codex/versions/.replaced-*"
run_setup --version 0.162.0
assert_eq "0" "$?" "a same-version reinstall repairs the corrupted copy"
assert_false "the repaired copy is clean" grep -q "# tampered" "${ACTIVE_DIR}/codex-path/rg"
bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --check >/dev/null 2>&1
assert_false "--check reports no integrity failure after the repair" test "$?" -eq 1
echo "extra" > "${ACTIVE_DIR}/codex-resources/injected"
out="$(bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --check 2>&1)"
assert_contains "unexpected file: ./${TARGET}/codex-resources/injected" "$out" "--check detects an added file"
rm -f "${ACTIVE_DIR}/codex-resources/injected"

section "Setup: replacement backup lifetime"

# Corrupt the active copy, then make the BACKEND probe fail on the reinstall:
# the old tree must still be put back (activation never happened).
echo "# tampered-2" >> "${ACTIVE_DIR}/codex-path/rg"
before="$(envsum)"
MOCK_PROBE=launch run_setup --version 0.162.0
assert_eq "1" "$?" "a reinstall whose backend probe fails is refused"
assert_contains "# tampered-2" "$(cat "${ACTIVE_DIR}/codex-path/rg")" "the old tree is restored after a backend probe failure"
assert_false "no replacement backup is left after the restore" compgen -G "${I}/runtime/cli/codex/versions/.replaced-*"
assert_eq "$before" "$(envsum)" ".env unchanged"

# Exit 5 keeps both trees: the new one in place, the old one as a backup.
CHENGOS_CLI_TEST_FAIL_AT=bookkeeping run_setup --version 0.162.0
assert_eq "5" "$?" "a post-commit record failure during a reinstall exits 5"
assert_true "the replaced copy is kept for recovery" compgen -G "${I}/runtime/cli/codex/versions/.replaced-0.162.0.*"
assert_false "the new copy is in place" grep -q "# tampered-2" "${ACTIVE_DIR}/codex-path/rg"
out="$(bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --check 2>&1)"
assert_contains "replacement backup kept for recovery" "$out" "--check points at the kept backup"
bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --repair >/dev/null 2>&1
rm -rf "${I}"/runtime/cli/codex/versions/.replaced-0.162.0.*

# A record that cannot be backed up blocks the swap entirely.
echo "# tampered-3" >> "${ACTIVE_DIR}/codex-path/rg"
if [[ "$(id -u)" -ne 0 ]]; then
    chmod 000 "${I}/runtime/cli/codex/records/0.162.0.rec"
    run_setup --version 0.162.0
    rc=$?
    chmod 600 "${I}/runtime/cli/codex/records/0.162.0.rec"
    assert_eq "1" "$rc" "an unreadable record refuses the swap"
    assert_contains "# tampered-3" "$(cat "${ACTIVE_DIR}/codex-path/rg")" "the existing tree was not swapped out"
fi
run_setup --version 0.162.0 >/dev/null 2>&1

section "Repair: Codex disabled in .env with active records"

D2="${WORK_ROOT}/disabled"
make_install "$D2"
bash "${D2}/cli/setup.sh" codex --shared-dir "$D2" --mode native --non-interactive --version 0.150.0 >/dev/null 2>&1
bash "${D2}/cli/setup.sh" codex --shared-dir "$D2" --mode native --non-interactive --version 0.162.0 >/dev/null 2>&1
envf_set "$(readlink -f "${D2}/.env")" CHENG_CODING_AGENT_ENABLED=false
out="$(bash "${D2}/cli/setup.sh" codex --shared-dir "$D2" --mode native --check 2>&1)"
assert_eq "1" "$?" "--check flags active records while .env disables Codex"
bash "${D2}/cli/setup.sh" codex --shared-dir "$D2" --mode native --repair >"${WORK_ROOT}/out.log" 2>&1
assert_eq "0" "$?" "--repair handles the disabled configuration"
assert_eq "previous" "$(envf_get "${D2}/runtime/cli/codex/records/0.162.0.rec" STATUS)" \
    "the last active version becomes the protected rollback target"
assert_eq "retired" "$(envf_get "${D2}/runtime/cli/codex/records/0.150.0.rec" STATUS)" "an older rollback target retires"
assert_false "state no longer names a configured version" envf_get "${D2}/runtime/cli/codex/state" CONFIGURED_VERSION
out="$(bash "${D2}/cli/setup.sh" codex --shared-dir "$D2" --mode native --check 2>&1)"
assert_false "--check is consistent after the repair" grep -q "disagree" <<<"$out"

section "Setup: tiers, credentials, versions"

run_setup --version 0.162.0 --tier chat
assert_eq "0" "$?" "activates 0.162.0 with the chat tier"
assert_eq "true" "$(envf_get "$EF" CHENG_CODING_AGENT_RESUMABLE_ENABLED)" "chat tier: resumable sessions on"
assert_eq "single_host" "$(envf_get "$EF" CHENG_CODING_AGENT_DEPLOYMENT)" "chat tier: DEPLOYMENT=single_host"
assert_eq "true" "$(envf_get "$EF" CHENG_CODING_AGENT_CHAT_ENABLED)" "chat tier: chat on"
assert_eq "$host_id" "$(envf_get "$EF" CHENG_CODING_AGENT_HOST_ID)" "HOST_ID is preserved"
assert_eq "previous" "$(envf_get "${I}/runtime/cli/codex/records/0.160.1.rec" STATUS)" "the replaced version becomes the rollback target"
assert_eq "0.160.1" "$(envf_get "${I}/runtime/cli/codex/state" PREVIOUS_VERSION)" "state remembers the previous version"

run_setup --tier tasks --version 0.162.0
assert_false "tasks tier clears resumable sessions" envf_get "$EF" CHENG_CODING_AGENT_RESUMABLE_ENABLED
assert_false "tasks tier clears chat" envf_get "$EF" CHENG_CODING_AGENT_CHAT_ENABLED

run_setup --version 0.150.0
assert_eq "0" "$?" "manual rollback to an exact older version"
assert_eq "retired" "$(envf_get "${I}/runtime/cli/codex/records/0.160.1.rec" STATUS)" "only one rollback target is retained"

# Legacy profile deployment: credential auth stays off unless explicitly enabled.
L="${WORK_ROOT}/legacy"
make_install "$L"
LEF="$(readlink -f "${L}/.env")"
mkdir -p "${WORK_ROOT}/home/legacy-state"
envf_set "$LEF" CHENG_CODING_AGENT_ENABLED=true "CHENG_CODING_AGENT_STATE_DIR=${WORK_ROOT}/home/legacy-state"
bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --non-interactive --version 0.162.0 >"${WORK_ROOT}/out.log" 2>&1
assert_eq "0" "$?" "configures a legacy-profile deployment"
assert_false "keeps credential auth off without consent" envf_get "$LEF" CHENG_CREDENTIAL_AUTH_ENABLED
assert_eq "${WORK_ROOT}/home/legacy-state" "$(envf_get "$LEF" CHENG_CODING_AGENT_STATE_DIR)" "preserves the existing state directory"
bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --non-interactive --version 0.162.0 \
    --enable-credential-auth >"${WORK_ROOT}/out.log" 2>&1
assert_eq "true" "$(envf_get "$LEF" CHENG_CREDENTIAL_AUTH_ENABLED)" "--enable-credential-auth switches it explicitly"

# Web default scope: an operator's default directory survives a re-run, and
# --check reports the scope apart from login, warning about open signup.
mkdir -p "${L}/workspace/coding-agent/project-a"
envf_set "$LEF" "CHENG_CODING_AGENT_DEFAULT_ROOT=${L}/workspace/coding-agent/project-a"
bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --non-interactive --version 0.162.0 >"${WORK_ROOT}/out.log" 2>&1
assert_eq "${L}/workspace/coding-agent/project-a" "$(envf_get "$LEF" CHENG_CODING_AGENT_DEFAULT_ROOT)" \
    "preserves the operator's default directory"
out="$(bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --check 2>&1)"
assert_contains "web default scope: off" "$out" "--check reports the web default scope as off by default"
envf_set "$LEF" CHENG_CODING_AGENT_WEB_DEFAULT_SCOPE=on
out="$(bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --check 2>&1)"
assert_contains "a credential login is still required" "$out" "--check separates the scope from login"
assert_contains "CHENG_SIGNUP_MODE is open" "$out" "--check warns about open signup"
envf_set "$LEF" CHENG_SIGNUP_MODE=closed
out="$(bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --check 2>&1)"
assert_false "no signup warning once signup is closed" grep -q "CHENG_SIGNUP_MODE is open" <<<"$out"
envf_set "$LEF" -CHENG_CODING_AGENT_WEB_DEFAULT_SCOPE -CHENG_SIGNUP_MODE
mkdir -p "${WORK_ROOT}/elsewhere"
envf_set "$LEF" "CHENG_CODING_AGENT_DEFAULT_ROOT=${WORK_ROOT}/elsewhere" CHENG_CODING_AGENT_WEB_DEFAULT_SCOPE=on
out="$(bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --check 2>&1)"
assert_contains "is not inside CHENG_CODING_AGENT_DEDICATED_ROOTS" "$out" "--check flags a default directory outside the work roots"
mkdir -p "${L}/workspace/coding-agent2"
envf_set "$LEF" "CHENG_CODING_AGENT_DEFAULT_ROOT=${L}/workspace/coding-agent2"
out="$(bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --check 2>&1)"
assert_contains "is not inside CHENG_CODING_AGENT_DEDICATED_ROOTS" "$out" "--check compares whole path components (coding-agent2)"
envf_set "$LEF" "CHENG_CODING_AGENT_DEFAULT_ROOT=${L}/workspace/coding-agent/project-a" -CHENG_CODING_AGENT_WEB_DEFAULT_SCOPE

# The installer switches the web default scope only on request.
bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --non-interactive --version 0.162.0 \
    --enable-web-default-scope --close-signup >"${WORK_ROOT}/out.log" 2>&1
assert_eq "0" "$?" "--enable-web-default-scope activates"
assert_eq "on" "$(envf_get "$LEF" CHENG_CODING_AGENT_WEB_DEFAULT_SCOPE)" "writes the web default scope"
assert_eq "closed" "$(envf_get "$LEF" CHENG_SIGNUP_MODE)" "--close-signup closes registration"
bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --non-interactive --version 0.162.0 >"${WORK_ROOT}/out.log" 2>&1
assert_eq "on" "$(envf_get "$LEF" CHENG_CODING_AGENT_WEB_DEFAULT_SCOPE)" "a re-run without the flag keeps it"
bash "${L}/cli/setup.sh" codex --shared-dir "$L" --mode native --non-interactive --version 0.162.0 \
    --no-web-default-scope >"${WORK_ROOT}/out.log" 2>&1
assert_false "--no-web-default-scope switches it off" envf_get "$LEF" CHENG_CODING_AGENT_WEB_DEFAULT_SCOPE
envf_set "$LEF" -CHENG_SIGNUP_MODE

N="${WORK_ROOT}/no-managed"
make_install "$N"
NEF="$(readlink -f "${N}/.env")"
nbefore="$(sha256sum < "$NEF")"
bash "${N}/cli/setup.sh" codex --shared-dir "$N" --mode native --non-interactive --version 0.162.0 \
    --no-credential-auth --enable-web-default-scope >"${WORK_ROOT}/out.log" 2>&1
assert_eq "2" "$?" "refuses the web default scope without managed credentials"
assert_contains "needs device-code login" "$(cat "${WORK_ROOT}/out.log")" "names the missing requirement"
assert_eq "$nbefore" "$(sha256sum < "$NEF")" "a refused request writes nothing"

# --bin reuse of an existing native installation.
R="${WORK_ROOT}/reuse"
make_install "$R"
bash "${R}/cli/setup.sh" codex --shared-dir "$R" --mode native --non-interactive \
    --bin "${I}/runtime/cli/codex/versions/0.162.0/${TARGET}/bin/codex" >"${WORK_ROOT}/out.log" 2>&1
assert_eq "0" "$?" "--bin reuses an existing native binary"
assert_eq "bin" "$(envf_get "${R}/runtime/cli/codex/records/0.162.0.rec" SOURCE)" "records the reuse source and checksum"

section "Status, cleanup, manager integration"

out="$(bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --check 2>&1)"
rc=$?
assert_eq "3" "$rc" "--check warns while a restart is pending"
assert_contains "restart ChengOS to apply it" "$out" "--check reports the pending restart"
envf_set "${I}/runtime/cli/codex/state" PENDING_RESTART=false
bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --check >/dev/null 2>&1
assert_eq "0" "$?" "--check is healthy once applied"
cp "$EF" "${WORK_ROOT}/env.before-tamper"
echo "# tampered" >> "${I}/runtime/cli/codex/versions/0.150.0/${TARGET}/bin/codex"
out="$(bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --check 2>&1)"
assert_eq "1" "$?" "--check fails on a binary that changed after installation"
assert_contains "installed files changed after installation" "$out" "--check names the integrity failure"
assert_eq "$(sha256sum < "${WORK_ROOT}/env.before-tamper")" "$(envsum)" "--check is read-only"
sed -i '$d' "${I}/runtime/cli/codex/versions/0.150.0/${TARGET}/bin/codex"

out="$(bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --prune --non-interactive 2>&1)"
assert_contains "cleanup candidate: ${I}/runtime/cli/codex/versions/0.160.1" "$out" "previews the retired version"
assert_true "a preview deletes nothing" test -d "${I}/runtime/cli/codex/versions/0.160.1"
mkdir -p "${I}/runtime/cli/codex/versions/9.9.9"
bash "${I}/cli/setup.sh" codex --shared-dir "$I" --mode native --prune --yes --non-interactive >"${WORK_ROOT}/out.log" 2>&1
assert_false "--prune --yes removes the retired version" test -d "${I}/runtime/cli/codex/versions/0.160.1"
assert_true "keeps the active version" test -d "${I}/runtime/cli/codex/versions/0.150.0"
assert_true "keeps the previous version" test -d "${I}/runtime/cli/codex/versions/0.162.0"
assert_true "never deletes a directory without a record" test -d "${I}/runtime/cli/codex/versions/9.9.9"

M="${WORK_ROOT}/manager"
make_install "$M"
out="$(cd "$M" && bash ./chengos.sh setup-cli codex --non-interactive --version-policy stable 2>&1)"
assert_eq "0.160.1" "$(envf_get "$(readlink -f "${M}/.env")" CHENGOS_CODEX_VERSION)" "chengos.sh setup-cli routes to cli/setup.sh"
assert_contains "applies on the next restart" "$out" "non-interactive runs never restart, they report it"
out="$(cd "$M" && bash ./chengos.sh setup-cli codex --check --mode docker 2>&1)"
assert_contains "conflicts with the recorded installation mode" "$out" "an explicit mode conflicting with the record is refused"

# ensure_bubblewrap follows the same consent rule (no silent system installs).
fn="$(sed -n '/^ensure_bubblewrap() {/,/^}/p' "${DEPLOY_DIR}/chengos.sh")"
out="$(INSTALL_DEPS=false ASSUME_YES=true "$BASH" -c "PATH='${WORK_ROOT}/emptybin'; ${fn}; ensure_bubblewrap" 2>&1 </dev/null)"
assert_contains "without consent" "$out" "ensure_bubblewrap never installs without consent in a non-interactive run"

# ── Claude Code settings ─────────────────────────────────────────────────────

section "Claude Code settings (cli/claude.sh --reconfigure)"

for v in 'Bash(cargo:*)' 'Bash(git status:*) Edit' 'x*y' '{a}'; do
    r="$(envf_render_value "$v")"
    got="$(eval "K=$r"; printf '%s' "$K")"
    assert_eq "$v" "$got" "a value with shell metacharacters survives source: $v"
done

C="${WORK_ROOT}/claude-settings"
mkdir -p "${C}/bin"
printf '#!/bin/sh\n' > "${C}/bin/claude"
chmod +x "${C}/bin/claude"
cat > "${C}/.env" <<EOF
CHENG_CODING_AGENT_ENABLED=true
CHENG_CODING_AGENT_CLAUDE_ENABLED=true
CHENG_CODING_AGENT_CLAUDE_BIN=${C}/bin/claude
EOF
claude_cfg() {
    "$BASH" "${DEPLOY_DIR}/cli/claude.sh" --shared-dir "$C" --mode native --non-interactive \
        --skip-backend-probe --reconfigure "$@" </dev/null 2>&1
}
out="$(claude_cfg --allowed-tools 'Bash(git status:*) Bash(cargo test:*)' --models claude-sonnet-5-5)"
assert_eq "Bash(git status:*) Bash(cargo test:*)" \
    "$(envf_get "${C}/.env" CHENG_CODING_AGENT_CLAUDE_ALLOWED_TOOLS)" "--allowed-tools is written"
assert_true "the written .env still sources" "$BASH" -c "set -a; source '${C}/.env'"
assert_eq "false" "$(envf_get "${C}/.env" CHENG_CODING_AGENT_CLAUDE_MANAGED_AUTH_ENABLED)" \
    "managed login stays off without a flag or a yes"
assert_eq "true" "$(envf_get "${C}/runtime/cli/claude/state" PENDING_RESTART)" "a change asks for a restart"
out="$(claude_cfg --enable-managed-auth)"
assert_eq "true" "$(envf_get "${C}/.env" CHENG_CODING_AGENT_CLAUDE_MANAGED_AUTH_ENABLED)" \
    "--enable-managed-auth switches managed login on"
assert_contains "Consumer Terms" "$out" "turning managed login on shows the terms risk"
envf_set "${C}/runtime/cli/claude/state" PENDING_RESTART=false >/dev/null
out="$(claude_cfg)"
assert_contains "Nothing to change" "$out" "an unchanged reconfigure writes nothing"
assert_eq "false" "$(envf_get "${C}/runtime/cli/claude/state" PENDING_RESTART)" \
    "an unchanged reconfigure asks for no restart"
out="$(claude_cfg --allowed-tools '')"
assert_contains "no shell commands are allowed" "$out" "an empty allowlist is warned about"
assert_eq "" "$(envf_get "${C}/.env" CHENG_CODING_AGENT_CLAUDE_ALLOWED_TOOLS)" \
    "an explicit empty allowlist stays empty"
out="$(claude_cfg)"
assert_eq "" "$(envf_get "${C}/.env" CHENG_CODING_AGENT_CLAUDE_ALLOWED_TOOLS)" \
    "a later reconfigure does not refill a cleared allowlist"

D="${WORK_ROOT}/claude-default-tools"
mkdir -p "${D}/bin"
printf '#!/bin/sh\n' > "${D}/bin/claude"
chmod +x "${D}/bin/claude"
cat > "${D}/.env" <<EOF
CHENG_CODING_AGENT_ENABLED=true
CHENG_CODING_AGENT_CLAUDE_ENABLED=true
CHENG_CODING_AGENT_CLAUDE_BIN=${D}/bin/claude
EOF
out="$("$BASH" "${DEPLOY_DIR}/cli/claude.sh" --shared-dir "$D" --mode native --non-interactive \
    --skip-backend-probe --reconfigure </dev/null 2>&1)"
assert_eq "Bash(git status:*) Bash(git diff:*) Bash(git log:*) Bash(git show:*) Bash(cargo check:*) Bash(cargo test:*) Bash(pnpm test:*)" \
    "$(envf_get "${D}/.env" CHENG_CODING_AGENT_CLAUDE_ALLOWED_TOOLS)" \
    "a missing allowlist gets the read-only and test defaults"
assert_contains "default read-only and test commands" "$out" "the default allowlist is reported, not prompted"
assert_contains 'CLI_INSTALL_DEPS=true' "$(cat "${DEPLOY_DIR}/cli/claude.sh")" \
    "Claude installs required system packages without a second prompt"
out="$("$BASH" "${DEPLOY_DIR}/cli/claude.sh" --shared-dir "$C" --reconfigure --version 1.2.3 2>&1)"
assert_contains "keeps the installed binary" "$out" "--reconfigure refuses a version change"
out="$("$BASH" "${DEPLOY_DIR}/cli/claude.sh" --shared-dir "$C" --enable-managed-auth --disable-managed-auth 2>&1)"
assert_contains "conflict" "$out" "contradictory managed-login flags are refused"
out="$("$BASH" "${DEPLOY_DIR}/cli/claude.sh" --shared-dir "$C" --mode native --check </dev/null 2>&1)"
assert_contains "Claude-only host" "$out" "status reports a host without Codex"
assert_contains "update_one_script \"deploy/cli/claude.sh\"" "$(cat "${DEPLOY_DIR}/chengos.sh")" \
    "script refresh ships cli/claude.sh"

# shellcheck source=../lib/cli-common.sh
source "${DEPLOY_DIR}/lib/cli-common.sh"
assert_eq "gnupg" "$(cli_package_for gpg apt-get)" "Debian installs the gnupg metapackage, which depends on gpg-agent"
assert_eq "gnupg" "$(cli_package_for gpg apk)" "Alpine installs gnupg"
assert_eq "gnupg" "$(cli_package_for gpg pacman)" "Arch installs gnupg"
assert_eq "gnupg2" "$(cli_package_for gpg dnf)" "RHEL-family dnf installs gnupg2"
assert_eq "gnupg2" "$(cli_package_for gpg yum)" "RHEL-family yum installs gnupg2"
assert_eq "gpg2" "$(cli_package_for gpg zypper)" "openSUSE installs gpg2"
assert_eq "curl" "$(cli_package_for curl apt-get)" "other tools keep their own package name"
out="$("$BASH" "${DEPLOY_DIR}/cli/claude.sh" --install-deps --shared-dir /nonexistent 2>&1)"
assert_contains "no installation directory" "$out" "claude.sh accepts --install-deps"
assert_contains 'claude_args+=(--install-deps)' "$(cat "${DEPLOY_DIR}/chengos.sh")" \
    "chengos.sh install forwards --install-deps to Claude"

# ── Summary ──────────────────────────────────────────────────────────────────

printf '\n─────────────────────────────────────────\n'
printf 'passed: %d   failed: %d\n' "$PASS" "$FAIL"
if ((FAIL > 0)); then
    printf 'coding-agent setup smoke tests FAILED\n'
    exit 1
fi
printf 'coding-agent setup smoke tests passed\n'
