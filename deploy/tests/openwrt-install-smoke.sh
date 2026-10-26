#!/usr/bin/env bash
#
# Smoke tests for the OpenWrt self-service install path, run under BusyBox
# ash with fixtures: release signing (release-sign.sh), the PostgreSQL bundle
# (pg-bundle.sh), the signed manifest (release-manifest.sh), and the on-device
# bootstrap (install.sh) and manager (chengos-openwrt.sh): trust checks,
# profile matching, lock, bundle install, staging, preflight, purge guard.
# usign is played by OpenSSL (release-sign.sh verify) and jsonfilter by jq;
# uci/ubus/block read fixture files. No router needed.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OW="${REPO_ROOT}/deploy/openwrt"
SCRIPT="${OW}/appliance/chengos-openwrt.sh"
for tool in busybox jq openssl; do
    command -v "$tool" >/dev/null 2>&1 || { echo "SKIP: $tool not installed"; exit 0; }
done

# Outside /tmp and /var: the storage gate rightly refuses anything under them.
T="$(mktemp -d "${XDG_RUNTIME_DIR:-$HOME}/.chengos-install-smoke.XXXXXX")"
trap 'rm -rf "$T"' EXIT
pass=0 fail=0
ok()  { pass=$((pass + 1)); printf '  ok    %s\n' "$1"; }
bad() { fail=$((fail + 1)); printf '  FAIL  %s\n' "$1"; }

# ── fixture tools ────────────────────────────────────────────────────────────
mkdir -p "$T/bin"
cat > "$T/bin/usign" <<EOF
#!/usr/bin/env bash
# usign -V -q -m FILE -p PUB -x SIG, verified with OpenSSL.
m="" p="" x=""
while [[ \$# -gt 0 ]]; do
    case "\$1" in -m) m=\$2; shift 2 ;; -p) p=\$2; shift 2 ;; -x) x=\$2; shift 2 ;; *) shift ;; esac
done
RELEASE_SIGN_NO_USIGN=1 exec "${OW}/release-sign.sh" verify "\$p" "\$m" "\${x:-\$m.sig}"
EOF
cat > "$T/bin/jsonfilter" <<'EOF'
#!/usr/bin/env bash
# jsonfilter [-i FILE] -e EXPR, for the expressions the scripts use.
in=/dev/stdin expr=""
while [[ $# -gt 0 ]]; do
    case "$1" in -i) in=$2; shift 2 ;; -e) expr=$2; shift 2 ;; *) shift ;; esac
done
expr=${expr#@}
[[ "$expr" == \[* ]] && expr=".$expr"
exec jq -er "$expr | select(. != null) | if type == \"string\" or type == \"number\" or type == \"boolean\" then . else tojson end" "$in" 2>/dev/null
EOF
cat > "$T/bin/uci" <<'EOF'
#!/bin/sh
# uci [-q] get KEY from $UCI_FIXTURE ("key=value" lines); changes/show: none.
[ "$1" = -q ] && shift
case "$1" in
    get) v=$(sed -n "s/^$(printf '%s' "$2" | sed 's/[][\.*^$/]/\\&/g')=//p" "$UCI_FIXTURE" 2>/dev/null | head -n 1)
         [ -n "$v" ] && printf '%s\n' "$v" ;;
    changes|show) exit 0 ;;
    *) exit 1 ;;
esac
EOF
cat > "$T/bin/block" <<'EOF'
#!/bin/sh
grep "^$2:" "$BLOCK_FIXTURE"
EOF
cat > "$T/bin/ubus" <<'EOF'
#!/bin/sh
case "$2" in
    network.interface.lan) echo '{"ipv4-address":[{"address":"192.168.1.1","mask":24}]}' ;;
    *) echo '{}' ;;
esac
EOF
printf '#!/bin/sh\n[ "$1" = -u ] && { echo 0; exit 0; }\nexec /usr/bin/id "$@"\n' > "$T/bin/id"
printf '#!/bin/sh\nexit 0\n' > "$T/bin/start-stop-daemon"
printf '#!/bin/sh\nexit 0\n' > "$T/musl-loader"
chmod +x "$T/bin"/* "$T/musl-loader"

# Device fixture: one durable ext4 disk recorded in fstab by UUID, LAN up.
mkdir -p "$T/data" "$T/data2" "$T/ram" "$T/lock" "$T/net"
cat > "$T/mounts" <<EOF
/dev/root / ext4 rw 0 0
tmpfs $T/ram tmpfs rw 0 0
/dev/sda1 $T/data ext4 rw,noatime 0 0
EOF
printf '/dev/sda1: UUID="U-DATA" TYPE="ext4"\n/dev/sdb1: UUID="U-TWO" TYPE="ext4"\n' > "$T/block"
printf 'fstab.@mount[0]=mount\nfstab.@mount[0].uuid=U-DATA\nfstab.@mount[0].target=%s\nfstab.@mount[0].enabled=1\n' "$T/data" > "$T/uci"
cat > "$T/openwrt_release" <<'EOF'
DISTRIB_ID='OpenWrt'
DISTRIB_RELEASE='24.10.4'
DISTRIB_REVISION='r28959-29397011cc'
DISTRIB_TARGET='armsr/armv8'
EOF
echo test,board > "$T/board_name"
printf 'MemTotal:        2048000 kB\n' > "$T/meminfo"
printf '  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode\n' > "$T/net/tcp"
: > "$T/config.md5"

export PATH="$T/bin:$PATH"
export UCI_FIXTURE="$T/uci" BLOCK_FIXTURE="$T/block"
export CHENGOS_PROC_MOUNTS="$T/mounts" CHENGOS_OPENWRT_RELEASE="$T/openwrt_release"
export CHENGOS_BOARD_NAME_FILE="$T/board_name" CHENGOS_MEMINFO="$T/meminfo" CHENGOS_PROC_NET="$T/net"
export CHENGOS_LOCK_DIR="$T/lock/chengos.lock" CHENGOS_MUSL_LOADER="$T/musl-loader"
export CHENGOS_CONFIG_MD5="$T/config.md5"

# run_lib SNIPPET [SCRIPT]: source the manager as a library under BusyBox ash.
run_lib() { CHENGOS_LIB_ONLY=1 busybox ash -c ". '${2:-$SCRIPT}'; $1" 2>&1; }
expect_ok()   { if out=$(run_lib "$2" "${3:-}"); then ok "$1"; else bad "$1: $out"; fi; }
expect_fail() {
    if out=$(run_lib "$2"); then bad "$1: unexpectedly passed: $out"
    elif [[ -n "${3:-}" && "$out" != *"$3"* ]]; then bad "$1: wrong reason: $out"
    else ok "$1"; fi
}
# expect_cmd NAME WANT_STATUS(0|1) TEXT CMD...: run a command, check status and output.
expect_cmd() {
    local name=$1 want=$2 text=$3 status=0
    shift 3
    out=$("$@" 2>&1) || status=$?
    if [[ "$want" -eq 0 && "$status" -ne 0 ]]; then bad "$name: exit $status: $out"
    elif [[ "$want" -ne 0 && "$status" -eq 0 ]]; then bad "$name: unexpectedly passed: $out"
    elif [[ -n "$text" && "$out" != *"$text"* ]]; then bad "$name: missing '$text' in: $out"
    else ok "$name"; fi
}

echo "== release signing (usign format via OpenSSL)"
K="$T/keys"; mkdir -p "$K"
"${OW}/release-sign.sh" keygen "$K/release.pem" "$K/release.pub" 2>/dev/null
"${OW}/release-sign.sh" keygen "$K/other.pem" "$K/other.pub" 2>/dev/null
[[ "$(sed -n 2p "$K/release.pub" | base64 -d | wc -c)" -eq 42 && "$(sed -n 2p "$K/release.pub" | base64 -d | head -c 2)" == Ed ]] \
    && ok "public key is usign's Ed|fingerprint|key layout" || bad "public key layout"
echo payload > "$T/msg"
"${OW}/release-sign.sh" sign "$K/release.pem" "$T/msg"
[[ "$(sed -n 2p "$T/msg.sig" | base64 -d | wc -c)" -eq 74 ]] && ok "signature is usign's Ed|fingerprint|sig layout" || bad "signature layout"
expect_cmd "a signed file verifies" 0 "" env RELEASE_SIGN_NO_USIGN=1 "${OW}/release-sign.sh" verify "$K/release.pub" "$T/msg"
echo tampered >> "$T/msg"
expect_cmd "a modified file is refused" 1 "" env RELEASE_SIGN_NO_USIGN=1 "${OW}/release-sign.sh" verify "$K/release.pub" "$T/msg"
echo payload > "$T/msg"
expect_cmd "another key is refused" 1 "" env RELEASE_SIGN_NO_USIGN=1 "${OW}/release-sign.sh" verify "$K/other.pub" "$T/msg"
expect_cmd "keygen never overwrites a key" 1 "refusing" "${OW}/release-sign.sh" keygen "$K/release.pem" "$K/x.pub"

echo "== manager trust anchor"
cp "$SCRIPT" "$T/manager-rendered.sh"
"${OW}/release-sign.sh" render "$K/release.pub" "$T/manager-rendered.sh"
grep -q '@CHENGOS_RELEASE_PUBKEY@' "$T/manager-rendered.sh" && bad "render left the placeholder" || ok "render embeds the key"
expect_ok   "the embedded key verifies a signed file" "verify_signature '$T/msg' '$T/msg.sig'" "$T/manager-rendered.sh"
expect_fail "a development build refuses without a key" "verify_signature '$T/msg' '$T/msg.sig'" "development build"
expect_ok   "a key override verifies" "CHENGOS_RELEASE_PUBKEY_FILE='$K/release.pub'; verify_signature '$T/msg' '$T/msg.sig'"
expect_fail "a wrong key is refused" "CHENGOS_RELEASE_PUBKEY_FILE='$K/other.pub'; verify_signature '$T/msg' '$T/msg.sig'" "not signed by the ChengOS release key"

echo "== version helpers"
expect_ok "version order is numeric" "version_lt 0.9.0 0.10.0 && version_lt 1.2.3 1.2.4 && ! version_lt 1.2.3 1.2.3 && ! version_lt 2.0.0 1.99.99"
expect_ok "semver shape is enforced" "is_semver 1.2.3 && ! is_semver 1.2 && ! is_semver 1.2.3.4 && ! is_semver v1.2.3 && ! is_semver 1..3"
expect_ok "headroom has a floor and counts two snapshots" \
    "[ \$(required_free_mb 100 50 0) -eq \$((100 + 100 + HEADROOM_MARGIN_MB)) ] && [ \$(required_free_mb 1 0 4096) -eq 4096 ]"

echo "== PostgreSQL bundle"
# mk_ipk DIR NAME VERSION FILE...: a minimal .ipk whose data holds FILEs.
mk_ipk() {
    local dir=$1 name=$2 version=$3 w
    shift 3
    w="$(mktemp -d "$T/ipk.XXXXXX")"
    mkdir -p "$w/data" "$w/ctl" "$w/outer"
    for f in "$@"; do mkdir -p "$w/data/$(dirname "$f")"; printf '#!/bin/sh\necho %s\n' "$f" > "$w/data/$f"; chmod +x "$w/data/$f"; done
    printf 'Package: %s\nVersion: %s\nArchitecture: aarch64_generic\n' "$name" "$version" > "$w/ctl/control"
    tar -C "$w/data" -czf "$w/outer/data.tar.gz" .
    tar -C "$w/ctl" -czf "$w/outer/control.tar.gz" ./control
    echo 2.0 > "$w/outer/debian-binary"
    tar -C "$w/outer" -czf "$dir/${name}_${version}_aarch64_generic.ipk" ./debian-binary ./data.tar.gz ./control.tar.gz
    rm -rf "$w"
}
IPK="$T/ipks"; mkdir -p "$IPK"
mk_ipk "$IPK" pgsql-server 17.5-r3 usr/bin/postgres usr/bin/initdb usr/bin/pg_ctl
mk_ipk "$IPK" pgsql-cli 17.5-r3 usr/bin/psql
mk_ipk "$IPK" libpq 17.5-r3 usr/lib/libpq.so.5
DIST="$T/dist"; mkdir -p "$DIST"
BUNDLE="$("${OW}/pg-bundle.sh" --profile test-profile --ipk-dir "$IPK" --version 9.9.9 --out "$DIST" 2>/dev/null)"
[[ -f "$BUNDLE" ]] && ok "bundle built" || bad "bundle not built"
listing="$(tar -xzOf "$BUNDLE" chengos-pg/PACKAGES)"
[[ "$listing" == *"pgsql-server 17.5-r3 "* && "$(wc -l <<< "$listing")" -eq 3 ]] && ok "PACKAGES lists every package" || bad "PACKAGES: $listing"
first="$(sha256sum "$BUNDLE" | cut -d' ' -f1)"
"${OW}/pg-bundle.sh" --profile test-profile --ipk-dir "$IPK" --version 9.9.9 --out "$DIST" >/dev/null 2>&1
[[ "$(sha256sum "$BUNDLE" | cut -d' ' -f1)" == "$first" ]] && ok "bundle is reproducible" || bad "bundle hash changed between builds"
mkdir -p "$T/noserver"; cp "$IPK"/libpq_* "$T/noserver/"
expect_cmd "a bundle without pgsql-server is refused" 1 "pgsql-server" "${OW}/pg-bundle.sh" --profile x --ipk-dir "$T/noserver" --out "$T/junk"

PGSHA="$first"
D="$T/data/inst"
mkdir -p "$D/pg"
expect_ok "bundle installs, marks the tree with its hash" \
    "install_postgres_bundle '$D/pg/root' '$BUNDLE' $PGSHA '$D/pgdata' && [ -x '$D/pg/root/usr/bin/postgres' ] && [ \"\$(cat '$D/pg/root/.chengos-complete')\" = $PGSHA ]"
expect_ok "the same bundle is not unpacked again" \
    "rm '$D/pg/root/usr/bin/psql'; install_postgres_bundle '$D/pg/root' '$BUNDLE' $PGSHA '$D/pgdata' && [ ! -e '$D/pg/root/usr/bin/psql' ]"
expect_fail "a bundle not matching the manifest hash is refused" \
    "install_postgres_bundle '$D/pg/root2' '$BUNDLE' 0000 '$D/pgdata'" "does not match the SHA-256 in the signed manifest"
# A package swapped inside a bundle whose own hash is (re)trusted.
w="$T/evil"; mkdir -p "$w"; tar -xzf "$BUNDLE" -C "$w"
mkdir -p "$T/evil-ipk"
mk_ipk "$T/evil-ipk" pgsql-cli 17.5-r3 usr/bin/psql usr/bin/extra
cp "$T/evil-ipk"/pgsql-cli_* "$w/chengos-pg/"
tar -C "$w" -czf "$T/evil.tar.gz" chengos-pg
EVILSHA="$(sha256sum "$T/evil.tar.gz" | cut -d' ' -f1)"
expect_fail "a package not matching the bundle's list is refused" \
    "install_postgres_bundle '$D/pg/root3' '$T/evil.tar.gz' $EVILSHA '$D/pgdata'" "does not match the SHA-256 in the bundle's list"
mkdir -p "$D/pgdata"; echo 16 > "$D/pgdata/PG_VERSION"
expect_fail "a different PostgreSQL major than the cluster is refused" \
    "install_postgres_bundle '$D/pg/root4' '$BUNDLE' $PGSHA '$D/pgdata'" "major upgrade is not supported"
echo 17 > "$D/pgdata/PG_VERSION"
expect_ok "a new bundle replaces the tree and keeps the old one as .prev" \
    "echo stale > '$D/pg/root/.chengos-complete'; install_postgres_bundle '$D/pg/root' '$BUNDLE' $PGSHA '$D/pgdata' && [ -d '$D/pg/root.prev' ] && [ -x '$D/pg/root/usr/bin/psql' ]"
expect_fail "missing PostgreSQL libraries are refused" \
    "rm -rf '$D/pg/root5'; printf '#!/bin/sh\necho \"libssl.so.3 => not found\"\n' > '$T/bad-loader'; chmod +x '$T/bad-loader'; MUSL_LOADER='$T/bad-loader'; install_postgres_bundle '$D/pg/root5' '$BUNDLE' $PGSHA '$D/pgdata'" "cannot resolve its libraries"

echo "== release manifest"
# A fake release archive with a runnable cheng-api and a rendered manager.
R="$T/stage/chengos-openwrt"; mkdir -p "$R/bin"
printf '#!/bin/sh\necho cheng-api 9.9.9\n' > "$R/bin/cheng-api"; chmod +x "$R/bin/cheng-api"
echo 9.9.9 > "$R/VERSION"; echo arm64 > "$R/ARCH"
cp "$T/manager-rendered.sh" "$R/chengos-openwrt.sh"
(cd "$R" && find . -type f ! -name SHA256SUMS | sed 's#^\./##' | sort | xargs sha256sum > SHA256SUMS)
tar -C "$T/stage" -czf "$DIST/chengos-openwrt-arm64-v9.9.9.tar.gz" chengos-openwrt
cp "$T/manager-rendered.sh" "$DIST/chengos-openwrt-manager-v9.9.9.sh"
cp "$BUNDLE" "$DIST/chengos-openwrt-pg-test-experimental-v9.9.9.tar.gz"
cat > "$T/profiles.json" <<'EOF'
{"schema": 1, "profiles": [
  {"id": "test-profile", "status": "supported", "arch": "arm64",
   "match": {"board": "test,board", "machine": "MACHINE", "distrib_release": "24.10.4", "distrib_target": "armsr/armv8"},
   "min_ram_mb": 512, "min_free_mb": 1, "min_free_inodes": 1},
  {"id": "test-experimental", "status": "experimental", "arch": "arm64",
   "match": {"board": "test,experimental", "machine": "MACHINE", "distrib_release": "24.10.4"},
   "min_ram_mb": 512, "min_free_mb": 1, "min_free_inodes": 1},
  {"id": "test-retired", "status": "retired", "arch": "arm64",
   "match": {"board": "test,retired", "machine": "MACHINE", "distrib_release": "24.10.4"},
   "min_ram_mb": 512, "min_free_mb": 1, "min_free_inodes": 1}
]}
EOF
sed -i "s/MACHINE/$(uname -m)/" "$T/profiles.json"
M="$("${OW}/release-manifest.sh" --key "$K/release.pem" --dist "$DIST" --profiles "$T/profiles.json" --version 9.9.9 2>/dev/null | tail -n 1)"
[[ -f "$M" && -f "$M.sig" ]] && ok "manifest written and signed" || bad "no manifest"
[[ "$(jq -r '.profiles | map(.id) | join(",")' "$M")" == "test-profile,test-experimental" ]] \
    && ok "retired profiles are not advertised" || bad "advertised: $(jq -c '.profiles | map(.id)' "$M")"
[[ "$(jq -r '.profiles[0].postgres.packages | length' "$M")" -eq 3 && "$(jq -r '.manager.sha256' "$M")" == "$(sha256sum "$DIST/chengos-openwrt-manager-v9.9.9.sh" | cut -d' ' -f1)" ]] \
    && ok "manifest records packages and the manager hash" || bad "manifest content"
cp "$T/manager-rendered.sh" "$DIST/chengos-openwrt-manager-v9.9.8.sh"
expect_cmd "a missing advertised asset fails the release" 1 "missing release asset" \
    "${OW}/release-manifest.sh" --key "$K/release.pem" --dist "$DIST" --profiles "$T/profiles.json" --version 9.9.8
rm -f "$DIST/chengos-openwrt-manager-v9.9.8.sh"
mkdir -p "$T/devdist"; cp "$SCRIPT" "$T/devdist/chengos-openwrt-manager-v9.9.9.sh"
expect_cmd "a manager without a rendered key fails the release" 1 "no release key" \
    "${OW}/release-manifest.sh" --key "$K/release.pem" --dist "$T/devdist" --profiles "$T/profiles.json" --version 9.9.9

# sign_json FILE JQ: a modified, re-signed copy of the manifest.
sign_json() { jq "$2" "$M" > "$1"; "${OW}/release-sign.sh" sign "$K/release.pem" "$1"; }
sign_json "$T/expired.json" '.expires_epoch = 1000'
sign_json "$T/future.json" '.issued_epoch = 99999999999 | .expires_epoch = 99999999999'
sign_json "$T/schema.json" '.schema = 2'
cp "$M" "$T/tampered.json"; cp "$M.sig" "$T/tampered.json.sig"; sed -i 's/"9.9.9"/"9.9.10"/' "$T/tampered.json"
printf '<html>404</html>' > "$T/html.json"; cp "$M.sig" "$T/html.json.sig"

export CHENGOS_RELEASE_PUBKEY_FILE="$K/release.pub"
expect_ok   "a signed manifest loads" "load_manifest '$M' '$M.sig' && [ \"\$M_VERSION\" = 9.9.9 ]"
expect_fail "a tampered manifest is refused" "load_manifest '$T/tampered.json' '$T/tampered.json.sig'" "not signed"
expect_fail "an error page instead of a manifest is refused" "load_manifest '$T/html.json' '$T/html.json.sig'" "not a release manifest"
expect_fail "an expired manifest is refused" "load_manifest '$T/expired.json' '$T/expired.json.sig'" "expired"
expect_fail "a clock before the release is reported as a clock problem" "load_manifest '$T/future.json' '$T/future.json.sig'" "system clock"
expect_fail "an unknown schema is refused" "load_manifest '$T/schema.json' '$T/schema.json.sig'" "schema"

echo "== profile matching"
expect_ok   "the device matches its supported profile" "load_manifest '$M' '$M.sig'; require_profile 0; [ \"\$P_ID\" = test-profile ]"
echo test,experimental > "$T/board_name"
expect_fail "an experimental profile needs explicit acceptance" "load_manifest '$M' '$M.sig'; require_profile 0" "--accept-experimental"
expect_ok   "an accepted experimental profile passes" "load_manifest '$M' '$M.sig'; require_profile 1; [ \"\$P_ID\" = test-experimental ]"
echo test,retired > "$T/board_name"
expect_fail "a profile not in the manifest is unsupported" "load_manifest '$M' '$M.sig'; require_profile 1" "not a supported ChengOS profile"
echo test,board > "$T/board_name"
sed -i "s/24.10.4/23.05.5/" "$T/openwrt_release"
expect_fail "another firmware release does not match" "load_manifest '$M' '$M.sig'; require_profile 1" "not a supported ChengOS profile"
sed -i "s/23.05.5/24.10.4/" "$T/openwrt_release"

echo "== lock"
expect_ok   "the lock is taken and released" "acquire_lock test && [ -d '$CHENGOS_LOCK_DIR' ] && release_lock && [ ! -d '$CHENGOS_LOCK_DIR' ]"
expect_ok   "the same process may take it again (exec hand-over)" "acquire_lock a && acquire_lock b"
sleep 30 & holder=$!
mkdir -p "$CHENGOS_LOCK_DIR"; echo "$holder" > "$CHENGOS_LOCK_DIR/pid"; echo update > "$CHENGOS_LOCK_DIR/what"
expect_fail "a running holder blocks a second operation" "acquire_lock install" "another ChengOS operation is running (update"
kill "$holder" 2>/dev/null; wait "$holder" 2>/dev/null || true
expect_ok   "a dead holder's lock is reclaimed" "acquire_lock install && [ \"\$(cat '$CHENGOS_LOCK_DIR/what')\" = install ]"
rm -rf "${CHENGOS_LOCK_DIR:?}"

echo "== staging from the manifest (offline asset dir)"
expect_ok "assets are fetched, verified and the archive checked" \
    "load_manifest '$M' '$M.sig'; require_profile 0; ASSET_DIR='$DIST'; stage_from_manifest '$T/data/stage1' \
     && [ -x \"\$STAGED_RELEASE/bin/cheng-api\" ] && [ -f \"\$STAGED_PG\" ] && [ \"\$STAGED_PG_SHA\" = $PGSHA ]"
cp -r "$DIST" "$T/baddist"
printf 'x' >> "$T/baddist/chengos-openwrt-arm64-v9.9.9.tar.gz"
expect_fail "an asset not matching the manifest is refused" \
    "load_manifest '$M' '$M.sig'; require_profile 0; ASSET_DIR='$T/baddist'; stage_from_manifest '$T/data/stage2'" "does not match the SHA-256 in the signed manifest"
expect_ok "no partial download is left behind" "[ ! -e '$T/data/stage2/staging/chengos-openwrt-arm64-v9.9.9.tar.gz' ]"
expect_fail "a missing offline asset is a clear error" \
    "load_manifest '$M' '$M.sig'; require_profile 0; ASSET_DIR='$T/nothing'; stage_from_manifest '$T/data/stage3'" "not found (offline install)"

echo "== preflight"
# pre SNIPPET: preflight with the device fixture, report in $T/pf.
pre() { run_lib "load_manifest '$M' '$M.sig'; parse_guided_args --manifest '$M' --signature '$M.sig' $1; PF_REPORT='$T/pf'; preflight_run; $2"; }
if out=$(pre "" 'echo "issues=$PF_ISSUES data=$PF_DATA"') && [[ "$out" == *"issues=0 data=$T/data/chengos"* ]]; then
    ok "the one eligible disk is proposed and every gate passes"
else bad "single disk: $out $(cat "$T/pf" 2>/dev/null)"; fi
grep -q "^url=http://192.168.1.1:19225/" "$T/pf" && ok "the LAN URL is reported" || bad "no URL in report"
printf '   0: 00000000:4B19 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 12345\n' >> "$T/net/tcp"
out=$(pre "" 'echo "issues=$PF_ISSUES"'); grep -q '^issue=\[port\] TCP port 19225' "$T/pf" && ok "an occupied port is a problem" || bad "port: $(cat "$T/pf")"
out=$(pre "--port 19226" 'echo "issues=$PF_ISSUES"'); [[ "$out" == *"issues=0"* ]] && ok "another port passes" || bad "--port: $out"
sed -i '2d' "$T/net/tcp"
printf '/dev/sdb1 %s ext4 rw 0 0\n' "$T/data2" >> "$T/mounts"
out=$(pre "" 'echo "issues=$PF_ISSUES candidates=$PF_CANDIDATES data=$PF_DATA"')
[[ "$out" == *"candidates=1"* ]] && grep -q "^unrecorded_mount=$T/data2" "$T/pf" \
    && ok "a disk not mounted by UUID is listed with its fix, not used" || bad "unrecorded: $out $(cat "$T/pf")"
printf 'fstab.@mount[1]=mount\nfstab.@mount[1].uuid=U-TWO\nfstab.@mount[1].target=%s\nfstab.@mount[1].enabled=1\n' "$T/data2" >> "$T/uci"
out=$(pre "" 'echo "issues=$PF_ISSUES candidates=$PF_CANDIDATES data=$PF_DATA"')
[[ "$out" == *"issues=0 candidates=2 data=" ]] \
    && ok "with two disks nothing is chosen for the user" || bad "two disks: $out"
out=$(pre "--data-dir $T/data2/chengos" 'echo "issues=$PF_ISSUES data=$PF_DATA"')
[[ "$out" == *"issues=0 data=$T/data2/chengos"* ]] && ok "an explicit --data-dir is honoured" || bad "explicit: $out"
out=$(pre "--data-dir $T/ram/chengos" 'echo "issues=$PF_ISSUES"')
grep -q '^issue=\[storage\].*tmpfs' "$T/pf" && ok "a tmpfs data dir is refused" || bad "tmpfs: $(cat "$T/pf")"
head -n 3 "$T/mounts" > "$T/mounts.1"; grep -v '^/dev/sda1' "$T/mounts.1" > "$T/mounts"
out=$(pre "" 'echo "issues=$PF_ISSUES"')
grep -q '^issue=\[storage\] no eligible data disk' "$T/pf" && ok "no disk gives a concrete next step" || bad "no disk: $(cat "$T/pf")"
cp "$T/mounts.1" "$T/mounts"
printf 'MemTotal:         262144 kB\n' > "$T/meminfo"
out=$(pre "" 'echo "issues=$PF_ISSUES"')
grep -q '^issue=\[firmware\] 256 MB RAM' "$T/pf" && ok "too little RAM is a problem" || bad "ram: $(cat "$T/pf")"
printf 'MemTotal:        2048000 kB\n' > "$T/meminfo"
out=$(run_lib "load_manifest '$M' '$M.sig'; parse_guided_args --manifest '$M' --signature '$M.sig' --machine; PF_REPORT='$T/pf'; preflight_run; print_preflight")
[[ "$out" == *"ok=1"* && "$out" == *"profile=test-profile (supported)"* ]] && ok "machine output is key=value" || bad "machine: $out"

echo "== bootstrap (install.sh) end to end, --check"
cp "$OW/install.sh" "$T/install.sh"
mkdir -p "$T/offline"
cp "$DIST"/* "$T/offline/"
boot() { busybox ash "$T/install.sh" "$@"; }
expect_cmd "the bootstrap verifies, fetches the manager and runs preflight" 0 "All checks passed" boot --check --archive "$T/offline"
expect_cmd "the bootstrap reports the profile" 0 "test-profile (supported)" boot --check --archive "$T/offline"
cp "$T/tampered.json" "$T/offline/chengos-openwrt-manifest.json"
expect_cmd "the bootstrap refuses an unsigned manifest" 1 "not signed by the ChengOS release key" boot --check --archive "$T/offline"
cp "$M" "$T/offline/"
printf '\n# modified\n' >> "$T/offline/chengos-openwrt-manager-v9.9.9.sh"
expect_cmd "the bootstrap refuses a manager not matching the manifest" 1 "does not match the signed manifest" boot --check --archive "$T/offline"
cp "$DIST/chengos-openwrt-manager-v9.9.9.sh" "$T/offline/"
expect_cmd "the bootstrap without a release key refuses" 1 "not built by the release job" \
    env -u CHENGOS_RELEASE_PUBKEY_FILE busybox ash "$T/install.sh" --check --archive "$T/offline"
expect_cmd "unattended install without a data dir is refused" 1 "explicit --data-dir" \
    busybox ash "$T/install.sh" --archive "$T/offline" --yes </dev/null
echo test,unknown > "$T/board_name"
expect_cmd "an unsupported device stops before any change" 1 "not a supported ChengOS profile" boot --check --archive "$T/offline"
echo test,board > "$T/board_name"
printf 'chengos.main.data_dir=%s\n' "$T/data/chengos" >> "$T/uci"
expect_cmd "an installed ChengOS is handed to its command" 0 "opening its manager" \
    env CHENGOS_COMMAND_FILE=/bin/true busybox ash "$T/install.sh" --archive "$T/offline"
sed -i '/^chengos\.main\.data_dir=/d' "$T/uci"

echo "== guided install hand-over and upgrade decisions"
# Past the confirmation the staged release's own installer takes over (same
# pid, so the lock carries over); on this host it stops at OpenWrt's
# /lib/functions.sh, after the hand-over this test is about.
out=$(busybox ash "$T/install.sh" --archive "$T/offline" --yes --data-dir "$T/data/chengos" </dev/null 2>&1 || true)
if [[ "$out" == *"functions.sh"* && "$out" != *"another ChengOS operation"* && -x "$T/data/chengos/staging/chengos-openwrt/bin/cheng-api" ]]; then
    ok "an unattended install stages the verified release and hands over under the same lock"
else bad "hand-over: $out"; fi
rm -rf "${T:?}/data/chengos" "${CHENGOS_LOCK_DIR:?}"
I="$T/data/inst2"; mkdir -p "$I/releases/9.9.9" "$I/pgdata"
cp -a "$R/." "$I/releases/9.9.9/"; ln -s releases/9.9.9 "$I/current"
printf 'chengos.main.data_dir=%s\n' "$I" >> "$T/uci"
expect_ok   "upgrade to the installed version is a no-op" \
    "cmd_upgrade --manifest '$M' --signature '$M.sig' --asset-dir '$DIST' 2>&1 | grep -q 'is up to date'"
echo 10.0.0 > "$I/releases/9.9.9/VERSION"
expect_fail "an older release is refused" \
    "cmd_upgrade --manifest '$M' --signature '$M.sig' --asset-dir '$DIST'" "downgrades are refused"
echo 9.9.0 > "$I/releases/9.9.9/VERSION"
expect_fail "an unattended upgrade needs --yes" \
    "cmd_upgrade --manifest '$M' --signature '$M.sig' --asset-dir '$DIST' </dev/null" "pass --yes"
printf 'chengos.main.install_state=incomplete\n' >> "$T/uci"
expect_fail "an unfinished install must be repaired before an update" \
    "cmd_upgrade --manifest '$M' --signature '$M.sig' --asset-dir '$DIST'" "run chengos repair first"
sed -i '/^chengos\.main\./d' "$T/uci"

echo "== secrets, purge guard, menu table"
expect_ok "new secrets include a setup token" \
    "ensure_secrets '$T/env1' 15432 2>/dev/null || true; t=\$(env_value CHENG_SETUP_TOKEN '$T/env1'); [ \${#t} -eq 32 ]"
expect_ok "an old secrets file gets a token once" \
    "printf 'JWT_SECRET=x\n' > '$T/env2'; ensure_setup_token '$T/env2'; ensure_setup_token '$T/env2'; [ \$(grep -c CHENG_SETUP_TOKEN '$T/env2') -eq 1 ]"
mkdir -p "$T/data/chengos/pgdata"
printf 'chengos.main.data_dir=%s\n' "$T/data/chengos" >> "$T/uci"
expect_fail "purge refuses a confirmation that does not match" \
    "cmd_uninstall --purge-data --confirm-purge /mnt/wrong" "did not match"
[[ -d "$T/data/chengos/pgdata" ]] && ok "nothing was deleted on a mismatch" || bad "data deleted"
expect_fail "purge without a terminal needs --confirm-purge" "cmd_uninstall --purge-data </dev/null" "--confirm-purge"
sed -i '/^chengos\.main\.data_dir=/d' "$T/uci"
expect_ok "every menu entry has text" \
    "for k in title status logs check update repair access rollback uninstall quit choose rollback_warn purge_ask uninstall_ask not_installed; do [ -n \"\$(msg \$k)\" ] || exit 1; done"
expect_fail "the installed command explains a missing data mount" \
    "CHENGOS_DATA_DIR='$T/data/gone'; require_data_mount" "is not available"

echo "== static checks"
for f in "$SCRIPT" "$OW/install.sh"; do
    busybox ash -n "$f" && ok "$(basename "$f") parses under BusyBox ash" || bad "$(basename "$f") syntax"
done

echo
echo "openwrt install smoke: ${pass} passed, ${fail} failed"
[[ "$fail" -eq 0 ]]
