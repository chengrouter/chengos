#!/usr/bin/env bash
# Docker coding-agent sandbox feasibility gate (deployment plan §7.4).
#
# Builds a DISPOSABLE image from the selected API image with bubblewrap added
# at build time, then runs it as the image's own non-root user under the
# UNCHANGED Docker security baseline (default seccomp/AppArmor, no added
# capabilities, no privileged mode) and records whether ChengFlow's launcher
# can create its sandbox there.
#
# It never touches real credentials, running services, or host security
# settings. Every directory it uses is a throwaway temp directory.
#
# Usage:
#   bash deploy/tests/docker-bwrap-poc.sh [--image IMAGE] [--codex-dir DIR] [--keep]
#
#   --image IMAGE    API image to base the probe on (default chengos/chengos:latest)
#   --codex-dir DIR  Native Codex vendor target directory (…/<target>/ with
#                    bin/codex). Adds the token-free app-server handshake inside
#                    the sandbox; no login, no model call.
#   --keep           Keep the disposable image afterwards
#
# Exit status: 0 baseline viable, 2 blocked (report says which probe), 1 usage
# or setup error.
set -euo pipefail

IMAGE="chengos/chengos:latest"
CODEX_DIR=""
KEEP=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --image) IMAGE="${2:?--image needs a value}"; shift 2 ;;
        --codex-dir) CODEX_DIR="${2:?--codex-dir needs a value}"; shift 2 ;;
        --keep) KEEP=true; shift ;;
        -h|--help) sed -n '2,25p' "$0"; exit 0 ;;
        *) echo "Unknown argument: $1" >&2; exit 1 ;;
    esac
done

command -v docker >/dev/null 2>&1 || { echo "docker is required" >&2; exit 1; }
docker image inspect "$IMAGE" >/dev/null 2>&1 || { echo "image not found locally: $IMAGE" >&2; exit 1; }
if [[ -n "$CODEX_DIR" ]]; then
    CODEX_DIR="$(cd "$CODEX_DIR" && pwd -P)"
    [[ -x "${CODEX_DIR}/bin/codex" ]] || { echo "no executable bin/codex under $CODEX_DIR" >&2; exit 1; }
fi

WORK="$(mktemp -d)"
POC_TAG="chengos-bwrap-poc:$$"
cleanup() {
    rm -rf "$WORK"
    [[ "$KEEP" == true ]] || docker image rm -f "$POC_TAG" >/dev/null 2>&1 || true
}
trap cleanup EXIT

report() { printf '%-28s %s\n' "$1" "$2"; }

# ── Environment record ───────────────────────────────────────────────────────
image_user="$(docker image inspect -f '{{.Config.User}}' "$IMAGE")"
[[ -n "$image_user" ]] || image_user="root"
report "base_image" "$IMAGE"
report "base_image_id" "$(docker image inspect -f '{{.Id}}' "$IMAGE")"
report "base_image_digest" "$(docker image inspect -f '{{join .RepoDigests ","}}' "$IMAGE" 2>/dev/null || true)"
report "image_user" "$image_user"
report "docker_server" "$(docker version -f '{{.Server.Version}}' 2>/dev/null || echo unknown)"
report "default_runtime" "$(docker info -f '{{.DefaultRuntime}}' 2>/dev/null || echo unknown)"
report "security_options" "$(docker info -f '{{join .SecurityOptions ","}}' 2>/dev/null || echo unknown)"
report "host_kernel" "$(uname -r)"
for f in kernel/apparmor_restrict_unprivileged_userns kernel/unprivileged_userns_clone user/max_user_namespaces; do
    report "host_${f//\//.}" "$(cat "/proc/sys/$f" 2>/dev/null || echo absent)"
done

# ── Disposable image: bubblewrap installed at BUILD time ────────────────────
cat > "${WORK}/Dockerfile" <<EOF
FROM ${IMAGE}
USER root
RUN apt-get update && apt-get install -y --no-install-recommends bubblewrap \
    && rm -rf /var/lib/apt/lists/*
USER ${image_user}
EOF
if ! docker build -q -t "$POC_TAG" "$WORK" >/dev/null 2>"${WORK}/build.log"; then
    echo "disposable image build failed:" >&2
    tail -20 "${WORK}/build.log" >&2
    exit 1
fi
report "probe_image" "$POC_TAG"

# ── Probe script, executed inside the container as the image user ───────────
cat > "${WORK}/probe.sh" <<'PROBE'
#!/bin/sh
set -u
pass=0
fail=0
out() { printf '%-28s %s\n' "$1" "$2"; }
check() {
    name="$1"; shift
    if err="$("$@" 2>&1)"; then
        out "$name" "PASS"
        pass=$((pass + 1))
        return 0
    fi
    out "$name" "FAIL: $(printf '%s' "$err" | tr '\n' ' ' | cut -c1-160)"
    fail=$((fail + 1))
    return 1
}
expect_fail() {
    name="$1"; shift
    # A denial only means something when the sandbox itself starts.
    if [ "$baseline_ok" != true ]; then
        out "$name" "N/A (sandbox did not start)"
        return
    fi
    if "$@" >/dev/null 2>&1; then
        out "$name" "FAIL: access that must be denied succeeded"
        fail=$((fail + 1))
    else
        out "$name" "PASS (denied)"
        pass=$((pass + 1))
    fi
}

out "container_uid" "$(id -u):$(id -g)"
out "bwrap_version" "$(bwrap --version 2>&1)"
out "bwrap_mode" "$(stat -c %A "$(command -v bwrap)")"
out "effective_caps" "$(grep CapEff /proc/self/status | awk '{print $2}')"

# Support mounts in the shape of ChengFlow's Shell profile: system dirs
# read-only, never the whole root.
support=""
for d in /usr /etc; do support="$support --ro-bind $d $d"; done
for d in /bin /sbin /lib /lib64; do
    if [ -L "$d" ]; then
        support="$support --symlink $(readlink "$d") $d"
    elif [ -d "$d" ]; then
        support="$support --ro-bind $d $d"
    fi
done

work="$(mktemp -d)"
mkdir -p "$work/root" "$work/ro" "$work/home"
echo ro > "$work/ro/file"

# The launcher's namespace set: pid, ipc, uts, new session, die-with-parent.
ns="--unshare-pid --unshare-ipc --unshare-uts --new-session --die-with-parent"
base="$ns $support --proc /proc --dev /dev --tmpfs /tmp"

baseline_ok=false
# shellcheck disable=SC2086
check "ns_minimal"        bwrap $base -- /bin/true && baseline_ok=true
# shellcheck disable=SC2086
check "ns_no_network"     bwrap --unshare-net $base -- /bin/true
# shellcheck disable=SC2086
check "root_writable"     bwrap $base --bind "$work/root" "$work/root" --chdir "$work/root" -- /bin/sh -c 'echo ok > probe && cat probe'
# shellcheck disable=SC2086
expect_fail "ro_denied"   bwrap $base --ro-bind "$work/ro" "$work/ro" -- /bin/sh -c "echo x > $work/ro/file"
# shellcheck disable=SC2086
expect_fail "unmounted_denied" bwrap $base -- /bin/sh -c "cat /app/ChengOS >/dev/null"
# shellcheck disable=SC2086
check "pid_isolated"      bwrap $base -- /bin/sh -c 'test "$(ls /proc | grep -c "^[0-9]")" -le 3'

if [ -x /opt/cheng-cli/codex/bin/codex ]; then
    # Token-free app-server handshake inside the sandbox: initialize only.
    req='{"id":1,"method":"initialize","params":{"clientInfo":{"name":"chengos-poc","version":"0"},"capabilities":{"experimentalApi":true}}}'
    # shellcheck disable=SC2086
    resp="$( { printf '%s\n' "$req"; sleep 5; } | timeout 30 bwrap $base \
        --ro-bind /opt/cheng-cli/codex /opt/cheng-cli/codex \
        --bind "$work/home" "$work/home" --bind "$work/root" "$work/root" --chdir "$work/root" \
        --setenv CODEX_HOME "$work/home" \
        --setenv PATH "/opt/cheng-cli/codex/codex-path:/usr/local/bin:/usr/bin:/bin" \
        -- /opt/cheng-cli/codex/bin/codex app-server -c 'cli_auth_credentials_store="file"' 2>/dev/null | head -n 1)"
    case "$resp" in
        *'"id":1'*'"result"'*) out "codex_handshake" "PASS"; pass=$((pass + 1)) ;;
        *) out "codex_handshake" "FAIL: $(printf '%s' "$resp" | cut -c1-160)"; fail=$((fail + 1)) ;;
    esac
else
    out "codex_handshake" "SKIPPED (no --codex-dir)"
fi

rm -rf "$work"
out "summary" "pass=$pass fail=$fail"
[ "$fail" -eq 0 ]
PROBE
chmod 755 "${WORK}/probe.sh"

run_args=(--rm --network none -v "${WORK}/probe.sh:/poc/probe.sh:ro" --entrypoint /bin/sh)
[[ -n "$CODEX_DIR" ]] && run_args+=(-v "${CODEX_DIR}:/opt/cheng-cli/codex:ro")

echo "--- unchanged security baseline ---"
if docker run "${run_args[@]}" "$POC_TAG" /poc/probe.sh; then
    report "gate" "VIABLE: baseline Docker policy runs the sandbox"
    exit 0
fi
report "gate" "BLOCKED under the default policy; Docker coding-agent support stays disabled here"
echo "Do not widen container privileges from this result; a least-privilege policy" >&2
echo "change needs its own review and approval (plan §7.4)." >&2
exit 2
