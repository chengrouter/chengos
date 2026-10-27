#!/usr/bin/env bash
# Real local signing/packaging, fake builds and GitHub. No router or network.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
for tool in jq openssl git sha256sum tar gzip; do
    command -v "$tool" >/dev/null || { echo "SKIP: missing $tool"; exit 0; }
done
T="$(mktemp -d)"
trap 'rm -rf "${T:?}"' EXIT
ROOT="$T/root" OW="$T/root/deploy/openwrt"
mkdir -p "$OW/lib" "$OW/appliance" "$T/bin" "$T/ipks"
cp -p "$REPO_ROOT"/deploy/openwrt/{release-assets,release-manifest,release-sign,pg-bundle}.sh "$OW/"
cp "$REPO_ROOT"/deploy/openwrt/lib/{common,release-bundle,release-upload}.sh "$OW/lib/"
cp "$REPO_ROOT/deploy/openwrt/install.sh" "$OW/install.sh"
cp "$REPO_ROOT/deploy/tests/openwrt-release-gh-fixture.sh" "$T/bin/gh"
chmod +x "$T/bin/gh"
printf '#!/bin/sh\nprintf "%%s\\n" "$PWD $*" >> "$UI_BUILD_LOG"\n' > "$T/bin/pnpm"
chmod +x "$T/bin/pnpm"
export PATH="$T/bin:$PATH" BUILD_LOG="$T/builds" UI_BUILD_LOG="$T/ui-builds"
printf '9.9.9\n' > "$ROOT/VERSION"
printf 'dist/\nchengflow/\nchengflow-ui/\nchengflow-sdk/\n' > "$ROOT/.gitignore"
cat > "$OW/profiles.json" <<'EOF'
{"schema":1,"profiles":[{"id":"test-router","status":"experimental","arch":"arm64",
"match":{"board":"test","machine":"aarch64","distrib_release":"test"},
"min_ram_mb":1024,"min_free_mb":2048,"min_free_inodes":100000}]}
EOF
cat > "$OW/appliance/chengos-openwrt.sh" <<'EOF'
#!/bin/sh
RELEASE_PUBKEY='@CHENGOS_RELEASE_PUBKEY@'
RELEASE_BASE_URL=${CHENGOS_RELEASE_BASE_URL:-https://github.com/chengrouter/chengos/releases}
exit 0
EOF
cat > "$OW/package.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
echo package >> "$BUILD_LOG"
[[ "${BUILD_FAIL:-0}" == 0 ]] || exit 1
out=""
while [[ $# -gt 0 ]]; do
    case "$1" in --out) out=$2; shift 2 ;; --skip-build) shift ;; *) shift 2 ;; esac
done
[[ -n "$out" ]] || exit 1
stage="$(mktemp -d)"; trap 'rm -rf "$stage"' EXIT
mkdir -p "$stage/chengos-openwrt"
cp "$HERE/appliance/chengos-openwrt.sh" "$stage/chengos-openwrt/chengos-openwrt.sh"
"$HERE/release-sign.sh" render "$CHENGOS_RELEASE_PUBKEY_FILE" "$stage/chengos-openwrt/chengos-openwrt.sh"
echo 9.9.9 > "$stage/chengos-openwrt/VERSION"; echo arm64 > "$stage/chengos-openwrt/ARCH"
archive="$out/chengos-openwrt-arm64-v9.9.9.tar.gz"
mkdir -p "$out"
tar -czf "$archive" -C "$stage" chengos-openwrt
(cd "$out" && sha256sum "$(basename "$archive")" > "$(basename "$archive").sha256")
echo "$archive"
EOF
chmod +x "$OW/package.sh"
mk_ipk() {
    local name=$1 dir="$T/ipk-work-$1"
    mkdir -p "$dir/outer" "$dir/control" "$dir/data"
    printf 'Package: %s\nVersion: 1.0-r1\n' "$name" > "$dir/control/control"
    echo payload > "$dir/data/payload"
    tar -czf "$dir/outer/control.tar.gz" -C "$dir/control" .
    tar -czf "$dir/outer/data.tar.gz" -C "$dir/data" .
    tar -czf "$T/ipks/${name}_1.0-r1_arm64.ipk" -C "$dir/outer" .
}
for name in pgsql-server pgsql-cli libpq; do mk_ipk "$name"; done
for part in root chengflow chengflow-ui chengflow-sdk; do
    dir="$ROOT"; [[ "$part" == root ]] || dir="$ROOT/$part"
    mkdir -p "$dir"
    echo "$part" > "$dir/source"
    if [[ "$part" != root ]]; then printf 'dist/\nnode_modules/\n' > "$dir/.gitignore"; fi
    git -C "$dir" init -q
    git -C "$dir" config user.email test@example.invalid
    git -C "$dir" config user.name test
    git -C "$dir" add .
    git -C "$dir" commit -qm fixture
    git -C "$dir" tag v9.9.9
done
export MOCK_TAG_COMMIT
MOCK_TAG_COMMIT="$(git -C "$ROOT" rev-parse HEAD)"
mkdir -p "$ROOT/chengflow-ui/dist" "$ROOT/chengflow-ui/node_modules" "$ROOT/chengflow-sdk/node_modules"
echo ui > "$ROOT/chengflow-ui/dist/index.html"
"$OW/release-sign.sh" keygen "$T/key.pem" "$T/key.pub" >/dev/null 2>&1
export MOCK_DIR="$T/github"
mkdir -p "$MOCK_DIR/assets"
reset_remote() {
    printf '{"id":1,"tag_name":"v9.9.9","draft":true,"assets":[]}\n' > "$MOCK_DIR/release.json"
    : > "$MOCK_DIR/calls"; : > "$MOCK_DIR/uploads"
}
reset_remote
SCRIPT="$OW/release-assets.sh"
BUNDLE="$ROOT/dist/openwrt/v9.9.9"
prepare=(--key "$T/key.pem" --pg-ipks "test-router=$T/ipks" --skip-build)
retry=(--upload-only --publish --out "$BUNDLE")
pass=0
ok() { pass=$((pass + 1)); echo "  ok $*"; }
expect_fail() {
    local match=$1; shift
    if "$@" > "$T/last.log" 2>&1; then cat "$T/last.log"; echo "unexpected success" >&2; exit 1; fi
    grep -q "$match" "$T/last.log" || { cat "$T/last.log"; echo "wrong failure: $match" >&2; exit 1; }
}

expect_fail 'requires a value' bash "$SCRIPT" --key
expect_fail 'unknown option: --tag' bash "$SCRIPT" --tag v9.9.8
expect_fail 'signing key not found' env -u CHENGOS_RELEASE_KEY HOME="$T/empty-home" bash "$SCRIPT" --pg-ipks "test-router=$T/ipks" --skip-build --out "$T/no-key"
[[ ! -e "$BUILD_LOG" && ! -e "$T/no-key" ]]
expect_fail 'gh auth login' env GH_AUTH_FAIL=1 bash "$SCRIPT" "${prepare[@]}" --publish
[[ ! -e "$BUILD_LOG" && ! -e "$BUNDLE" ]]
ok "argument/version/auth failures happen before builds or output"
expect_fail 'must already exist' env GH_MISSING_RELEASE=1 bash "$SCRIPT" "${prepare[@]}" --publish
[[ ! -e "$BUILD_LOG" ]]
ok "missing GitHub Release is caught before build"
expect_fail 'remote tag commit differs' env GH_WRONG_TAG=1 bash "$SCRIPT" "${prepare[@]}" --publish
[[ ! -e "$BUILD_LOG" ]]
ok "annotated remote tag must resolve to the prepared source commit"
bash "$SCRIPT" "${prepare[@]}" --dry-run --publish > "$T/dry.log" 2>&1
[[ ! -e "$BUILD_LOG" && ! -e "$ROOT/dist" && ! -s "$MOCK_DIR/uploads" ]]
ok "dry run performs no build, output or upload"
mkdir -p "$ROOT/dist"
echo preserve > "$ROOT/dist/chengos-openwrt-existing-v9.9.9.tar.gz"
expect_fail 'package build failed' env BUILD_FAIL=1 bash "$SCRIPT" "${prepare[@]}"
[[ ! -e "$BUNDLE" && ! -e "$BUNDLE.lock" ]]
[[ "$(cat "$ROOT/dist/chengos-openwrt-existing-v9.9.9.tar.gz")" == preserve ]]
ok "failed preparation cleans only its own stage and preserves existing dist assets"
bash "$SCRIPT" "${prepare[@]}" > "$T/prepared.log" 2>&1 || { cat "$T/prepared.log"; exit 1; }
[[ -f "$BUNDLE/release-assets.json" ]]
[[ "$(jq '.assets|length' "$BUNDLE/release-assets.json")" == 10 ]]
before="$(sha256sum "$BUNDLE/release-assets.json")"
expect_fail 'output already exists' bash "$SCRIPT" "${prepare[@]}"
[[ "$(sha256sum "$BUNDLE/release-assets.json")" == "$before" ]]
ok "signed bundle is frozen and cannot be silently rebuilt"
cp "$T/key.pem" "$BUNDLE/private.pem"
bash "$SCRIPT" "${retry[@]}" --dry-run > "$T/planned.log" 2>&1
[[ ! -s "$MOCK_DIR/uploads" ]]
ok "prepared dry run only reports missing assets"
cp -a "$BUNDLE" "$T/tampered"
printf x >> "$T/tampered/chengos-openwrt-manager-v9.9.9.sh"
expect_fail 'manager hash mismatch' bash "$SCRIPT" --upload-only --publish --out "$T/tampered"
[[ ! -s "$MOCK_DIR/uploads" ]]
ok "tampering is refused before any upload"

first="$(jq -r '.assets[0].name' "$BUNDLE/release-assets.json")"
first_size="$(stat -c %s "$BUNDLE/$first")"
jq -n --arg n "$first" --argjson s "$first_size" --arg d "sha256:$(printf '%064d' 0)" \
    '{id:1, tag_name:"v9.9.9", assets:[{id:1,name:$n,size:$s,digest:$d,state:"uploaded"}]}' > "$MOCK_DIR/release.json"
expect_fail 'remote asset differs' bash "$SCRIPT" "${retry[@]}"
[[ ! -s "$MOCK_DIR/uploads" ]]
ok "same-size conflicting remote asset aborts the whole plan"
reset_remote
expect_fail 'upload stopped' env GH_FAIL_ASSET=chengos-openwrt-manager-v9.9.9.sh bash "$SCRIPT" "${retry[@]}"
[[ -s "$MOCK_DIR/uploads" && ! -e "$MOCK_DIR/assets/chengos-openwrt-install.sh" ]]
ok "interruption preserves completed assets; bootstrap is not uploaded early"
bash "$SCRIPT" "${retry[@]}" > "$T/resumed.log" 2>&1 || { cat "$T/resumed.log"; exit 1; }
[[ "$(jq '.assets|length' "$MOCK_DIR/release.json")" == 10 ]]
[[ "$(tail -n1 "$MOCK_DIR/uploads")" == chengos-openwrt-install.sh ]]
[[ ! -e "$MOCK_DIR/assets/private.pem" ]]
[[ "$(jq -r .draft "$MOCK_DIR/release.json")" == true ]]
ok "retry uploads only missing whitelisted files, bootstrap last; draft stays draft"
count="$(wc -l < "$MOCK_DIR/uploads")"
(cd "$T" && bash "$SCRIPT" "${retry[@]}") > "$T/retry.log" 2>&1
[[ "$(wc -l < "$MOCK_DIR/uploads")" == "$count" ]]
[[ "$(grep -c '^package$' "$BUILD_LOG")" == 2 ]]
[[ "$(wc -l < "$UI_BUILD_LOG")" == 2 ]]
ok "identical assets are skipped from any working directory without rebuilding Rust or UI"
jq '.assets[0].digest = null' "$MOCK_DIR/release.json" > "$T/remote.json"
cp "$T/remote.json" "$MOCK_DIR/release.json"
bash "$SCRIPT" "${retry[@]}" > "$T/fallback.log" 2>&1
grep -q 'application/octet-stream' "$MOCK_DIR/calls"
[[ "$(wc -l < "$MOCK_DIR/uploads")" == "$count" ]]
ok "older GitHub assets without a digest are compared by downloaded bytes"
printf x | dd of="$MOCK_DIR/assets/$first" bs=1 count=1 conv=notrunc status=none
expect_fail 'remote asset differs' bash "$SCRIPT" "${retry[@]}"
ok "a missing API digest never turns a corrupted remote file into an identical asset"
jq '.assets[0].state = "starter"' "$MOCK_DIR/release.json" > "$T/remote.json"
cp "$T/remote.json" "$MOCK_DIR/release.json"
expect_fail 'is incomplete' bash "$SCRIPT" "${retry[@]}"
ok "incomplete remote assets are never silently deleted"
reset_remote
expect_fail 'remote asset differs' env GH_CORRUPT_ASSET="$first" bash "$SCRIPT" "${retry[@]}"
ok "post-upload verification catches a wrong remote digest"
reset_remote
bash "$SCRIPT" "${prepare[@]}" --publish --out "$T/one-command" > "$T/one-command.log" 2>&1 \
    || { cat "$T/one-command.log"; exit 1; }
[[ -f "$T/one-command/release-assets.json" && "$(jq '.assets|length' "$MOCK_DIR/release.json")" == 10 ]]
ok "one invocation prepares, signs, uploads and verifies the complete release"
reset_remote
FAKE_HOME="$T/home"
FIXED="$FAKE_HOME/.config/chengos/release"
mkdir -p "$FIXED/openwrt-pg-ipks/test-router"
cp "$T/key.pem" "$FIXED/release-key.pem"
cp "$T"/ipks/*.ipk "$FIXED/openwrt-pg-ipks/test-router/"
env -u CHENGOS_RELEASE_KEY -u CHENGOS_OPENWRT_PG_IPKS_ROOT HOME="$FAKE_HOME" \
    bash "$SCRIPT" --skip-build --out "$T/defaults" > "$T/defaults.log" 2>&1 \
    || { cat "$T/defaults.log"; exit 1; }
[[ -f "$T/defaults/release-assets.json" ]]
ok "signing key and PostgreSQL .ipk directory come from fixed defaults without --key or --pg-ipks"
reset_remote
echo changed >> "$ROOT/chengflow/source"
expect_fail 'uncommitted changes' bash "$SCRIPT" "${prepare[@]}" --out "$T/dirty-output"
[[ ! -e "$T/dirty-output" ]]
ok "publishing preparations reject dirty source trees"
printf '9.9.10\n' > "$ROOT/VERSION"
expect_fail 'prepared directory not found' bash "$SCRIPT" --upload-only --publish
expect_fail 'invalid release manifest' bash "$SCRIPT" "${retry[@]}"
ok "after a version bump, upload-only never reuses an older frozen bundle"
echo 9.9.9 > "$ROOT/VERSION"
echo chengflow > "$ROOT/chengflow/source"
echo new >> "$ROOT/source"
git -C "$ROOT" add source
git -C "$ROOT" commit -qm untagged
expect_fail 'HEAD does not match' bash "$SCRIPT" "${prepare[@]}" --out "$T/untagged-output"
ok "clean but untagged source commits cannot be packaged as an existing release"
if grep -Eq -- '--clobber|release (delete|create|edit)' "$MOCK_DIR/calls"; then
    echo "unsafe GitHub command was invoked" >&2
    exit 1
fi
ok "no overwrite, deletion, tag creation or Release publishing commands"
echo "PASS: $pass OpenWrt release upload checks (mock GitHub only)"
