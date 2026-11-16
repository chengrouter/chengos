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
for tool in busybox jq openssl readelf; do
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
# start-stop-daemon -S ... -x PROG -- ARGS: runs PROG ARGS as the caller;
# chown: the tests run unprivileged and there is no chengos user.
cat > "$T/bin/start-stop-daemon" <<'EOF'
#!/bin/sh
x=""
while [ $# -gt 0 ]; do case "$1" in -x) x=$2; shift 2 ;; --) shift; break ;; *) shift ;; esac; done
[ -n "$x" ] && exec "$x" "$@"
exit 0
EOF
printf '#!/bin/sh\nexit 0\n' > "$T/bin/chown"
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
# shellcheck source=openwrt-pg-fixture.sh
source "${REPO_ROOT}/deploy/tests/openwrt-pg-fixture.sh"
HOST_ARCH="$(source "${OW}/lib/common.sh"; ow_release_arch_for_uname "$(uname -m)")"
OTHER_ARCH=arm64; [[ "$HOST_ARCH" != arm64 ]] || OTHER_ARCH=amd64
jq -n --arg host "$HOST_ARCH" --arg other "$OTHER_ARCH" '{schema: 1, profiles: [
  {id: "test-profile", status: "supported", arch: "arm64", package_arch: "aarch64_generic", package_format: "ipk", match: {}},
  {id: "test-apk", status: "supported", arch: "arm64", package_arch: "aarch64_generic", package_format: "apk-v3-adb", match: {}},
  {id: "test-host", status: "supported", arch: $host, package_arch: "aarch64_generic", package_format: "ipk", match: {}},
  {id: "test-other", status: "supported", arch: $other, package_arch: "aarch64_generic", package_format: "ipk", match: {}}
]}' > "$T/pg-profiles.json"
IPK="$T/ipks"; mkdir -p "$IPK"
pg_fixture_dir "$IPK"
DIST="$T/dist"; mkdir -p "$DIST"
# bundle PROFILE DIR [OUT]: build a bundle, print its path.
bundle() { "${OW}/pg-bundle.sh" --profile "$1" --pkg-dir "$2" --profiles "$T/pg-profiles.json" --version 9.9.9 --out "${3:-$T/junk}"; }
# variant NAME: a copy of the fixture input to break.
variant() { rm -rf "$T/v-$1"; cp -a "$IPK" "$T/v-$1"; printf '%s' "$T/v-$1"; }
BUNDLE="$(bundle test-profile "$IPK" "$DIST" 2>/dev/null)"
[[ -f "$BUNDLE" ]] && ok "bundle built" || bad "bundle not built"
listing="$(tar -xzOf "$BUNDLE" chengos-pg/PACKAGES)"
[[ "$listing" == *"pgsql-server 17.5-r3 "* && "$(wc -l <<< "$listing")" -eq 3 ]] && ok "PACKAGES lists every package" || bad "PACKAGES: $listing"
[[ "$(tar -xzOf "$BUNDLE" chengos-pg/FORMAT)" == rootfs-v1 ]] && ok "the bundle declares FORMAT rootfs-v1" || bad "FORMAT"
members="$(tar -tzf "$BUNDLE")"
files="$(tar -xzOf "$BUNDLE" chengos-pg/FILES)"
[[ "$members" == *"chengos-pg/root/usr/bin/postgres"* && "$members" != *"etc/init.d"* && "$members" != *".ipk"* ]] \
    && ok "the payload is a normalized tree without init scripts or packages" || bad "members: $members"
grep -q '^dropped pgsql-server etc/init.d/postgresql$' <(tar -xzOf "$BUNDLE" chengos-pg/PROVENANCE) \
    && ok "dropped paths are recorded in PROVENANCE" || bad "PROVENANCE: $(tar -xzOf "$BUNDLE" chengos-pg/PROVENANCE)"
[[ "$files" == *"l postgres usr/bin/postmaster"* && "$files" == *"l libpq.so.5.17 usr/lib/libpq.so.5"* \
   && "$(grep -c '^f ' <<< "$files")" -eq 6 ]] && ok "FILES lists every file and symlink" || bad "FILES: $files"
[[ "$members" == *"chengos-pg/licenses/libpq"* ]] && ok "licenses ship per package" || bad "no licenses"
first="$(sha256sum "$BUNDLE" | cut -d' ' -f1)"
bundle test-profile "$IPK" "$DIST" >/dev/null 2>&1
[[ "$(sha256sum "$BUNDLE" | cut -d' ' -f1)" == "$first" ]] && ok "bundle is reproducible" || bad "bundle hash changed between builds"
expect_cmd "the --ipk-dir alias still works" 0 "" "${OW}/pg-bundle.sh" --profile test-profile --ipk-dir "$IPK" --profiles "$T/pg-profiles.json" --version 9.9.9 --out "$T/junk"

echo "== PostgreSQL bundle: publisher refusals"
v="$(variant noserver)"; rm "$v"/pgsql-server_*; pg_fixture_index "$v"
expect_cmd "a bundle without pgsql-server is refused" 1 "pgsql-server" bundle test-profile "$v"
v="$(variant unindexed)"; pg_fixture_ipk "$v" pgsql-cli 17.5-r3 -- usr/bin/psql usr/bin/extra
expect_cmd "a package not in the frozen feed index is refused" 1 "does not match the frozen feed indexes" bundle test-profile "$v"
v="$(variant noindex)"; rm -rf "$v/feeds"
expect_cmd "a package set without feed indexes is refused" 1 "no frozen feed indexes" bundle test-profile "$v"
v="$(variant mixed)"; echo x > "$v/libpq-17.5-r3.apk"
expect_cmd "mixed package formats are refused" 1 "mixes package formats" bundle test-profile "$v"
expect_cmd "an ipk set is refused for an apk-v3-adb profile" 1 "no .apk packages" bundle test-apk "$IPK"
v="$(variant arch)"; rm "$v"/pgsql-cli_*; pg_fixture_ipk "$v" pgsql-cli 17.5-r3 x86_64 -- usr/bin/psql; pg_fixture_index "$v"
expect_cmd "a package for another package arch is refused" 1 "needs aarch64_generic" bundle test-profile "$v"
v="$(variant license)"; rm "$v/licenses/libpq"
expect_cmd "a package without a license is refused" 1 "no license for libpq" bundle test-profile "$v"
v="$(variant nobase)"; rm "$v/base-libs.txt"
expect_cmd "a bundle without the image's library list is refused" 1 "base-libs.txt is missing" bundle test-profile "$v"
v="$(variant abslink)"; pg_fixture_ipk "$v" extra 1 -- "usr/lib/libx.so->/etc/shadow"; pg_fixture_index "$v"; echo L > "$v/licenses/extra"
expect_cmd "an absolute symlink is refused" 1 "absolute symlink" bundle test-profile "$v"
v="$(variant escape)"; pg_fixture_ipk "$v" extra 1 -- "usr/lib/libx.so->../../../etc/shadow"; pg_fixture_index "$v"; echo L > "$v/licenses/extra"
expect_cmd "a symlink leaving the payload is refused" 1 "leaves the payload" bundle test-profile "$v"
v="$(variant libc)"; pg_fixture_ipk "$v" extra 1 -- usr/lib/libc.so; pg_fixture_index "$v"; echo L > "$v/licenses/extra"
expect_cmd "the C library is never bundled" 1 "never carry the C library" bundle test-profile "$v"
v="$(variant clash)"; pg_fixture_ipk "$v" extra 1 -- usr/bin/psql; pg_fixture_index "$v"; echo L > "$v/licenses/extra"
expect_cmd "two packages shipping one path are refused" 1 "both ship usr/bin/psql" bundle test-profile "$v"
# A real host ELF: its libraries must come from the payload or the image.
v="$(variant elf)"; echo L > "$v/licenses/extra"
w="$T/elf-x"; rm -rf "$w"; mkdir -p "$w/o" "$w/d/usr/bin" "$w/c"
cp "$(type -P true)" "$w/d/usr/bin/tool"
printf 'Package: extra\nVersion: 1\nArchitecture: aarch64_generic\n' > "$w/c/control"
tar -C "$w/d" -czf "$w/o/data.tar.gz" . && tar -C "$w/c" -czf "$w/o/control.tar.gz" ./control && echo 2.0 > "$w/o/debian-binary"
tar -C "$w/o" -czf "$v/extra_1_aarch64_generic.ipk" ./debian-binary ./data.tar.gz ./control.tar.gz; pg_fixture_index "$v"
expect_cmd "an unresolved library is refused" 1 "usr/bin/tool needs" bundle test-host "$v"
readelf -d "$(type -P true)" | sed -n 's/.*(NEEDED).*\[\(.*\)\]/\1/p' >> "$v/base-libs.txt"
elf_bundle="$(bundle test-host "$v" 2>/dev/null)"
[[ -f "$elf_bundle" ]] && ok "libraries the image has resolve" || bad "libraries the image has resolve: $(bundle test-host "$v" 2>&1)"
[[ "$(tar -xzOf "$elf_bundle" chengos-pg/BASE-LIBS)" == "$(readelf -d "$(type -P true)" | sed -n 's/.*(NEEDED).*\[\(.*\)\]/\1/p' | LC_ALL=C sort -u)" ]] \
    && ok "BASE-LIBS lists exactly what the payload needs from the image" || bad "BASE-LIBS: $(tar -xzOf "$elf_bundle" chengos-pg/BASE-LIBS)"
expect_cmd "an ELF for another architecture is refused" 1 "built for ELF machine" bundle test-other "$v"

echo "== PostgreSQL bundle: apk-v3-adb input"
# Needs apk-tools 3.x (e.g. an OpenWrt ImageBuilder's staging_dir/host/bin/apk).
TEST_APK="${CHENGOS_TEST_APK:-$(command -v apk || true)}"
if [[ -n "$TEST_APK" ]] && "$TEST_APK" --version 2>/dev/null | grep -q '^apk-tools 3\.'; then
    A="$T/apk"; mkdir -p "$A/keys" "$A/in/keys" "$A/in/feeds/packages" "$A/in/licenses" "$A/other"
    openssl ecparam -name prime256v1 -genkey -noout -out "$A/keys/feed.key" 2>/dev/null
    openssl ec -in "$A/keys/feed.key" -pubout -out "$A/in/keys/feed.pem" 2>/dev/null
    openssl ecparam -name prime256v1 -genkey -noout -out "$A/keys/other.key" 2>/dev/null
    openssl ec -in "$A/keys/other.key" -pubout -out "$A/keys/other.pem" 2>/dev/null
    # mk_apk DIR NAME PATH...: an apk v3 package in DIR, files as in pg_fixture_ipk.
    mk_apk() {
        local out=$1 name=$2 x="$A/x-$2"; shift 2
        rm -rf "$x"; mkdir -p "$x"
        pg_fixture_ipk "$x" "$name" 17.5-r3 -- "$@"
        mkdir -p "$x/o" "$x/root" && tar -xzf "$x"/*.ipk -C "$x/o" && tar -xzf "$x/o/data.tar.gz" -C "$x/root"
        "$TEST_APK" mkpkg -I "name:$name" -I version:17.5-r3 -I arch:aarch64_generic -I license:PostgreSQL \
            -F "$x/root" -o "$out/$name-17.5-r3.apk" >/dev/null
    }
    mk_apk "$A/in" pgsql-server usr/bin/postgres usr/bin/initdb usr/bin/pg_ctl etc/init.d/postgresql "usr/bin/postmaster->postgres"
    mk_apk "$A/in" pgsql-cli usr/bin/psql
    mk_apk "$A/in" libpq usr/lib/libpq.so.5.17 "usr/lib/libpq.so.5->libpq.so.5.17"
    # apk_index DIR KEY: sign an index of DIR's packages into DIR/feeds/packages.
    apk_index() {
        "$TEST_APK" --allow-untrusted mkndx --sign-key "$2" -o "$1/feeds/packages/packages.adb" "$1"/*.apk >/dev/null
    }
    apk_index "$A/in" "$A/keys/feed.key"
    printf 'libc.so\n' > "$A/in/base-libs.txt"
    for n in pgsql-server pgsql-cli libpq; do echo "PostgreSQL License" > "$A/in/licenses/$n"; done
    jq -n --arg key "$(sha256sum "$A/in/keys/feed.pem" | cut -d' ' -f1)" '{schema: 1, profiles: [
      {id: "test-apk", status: "supported", arch: "arm64", package_arch: "aarch64_generic",
       package_format: "apk-v3-adb", feed: {urls: ["https://example.invalid/packages"], key_sha256: [$key]}, match: {}}]}' \
        > "$A/profiles.json"
    abundle() { "${OW}/pg-bundle.sh" --profile test-apk --pkg-dir "$1" --profiles "$A/profiles.json" --apk "$TEST_APK" --version 9.9.9 --out "$A/dist"; }
    avariant() { rm -rf "$A/v-$1"; cp -a "$A/in" "$A/v-$1"; printf '%s' "$A/v-$1"; }
    APK_BUNDLE="$(abundle "$A/in" 2>/dev/null)"
    [[ -f "$APK_BUNDLE" && "$(tar -xzOf "$APK_BUNDLE" chengos-pg/FORMAT)" == rootfs-v1 ]] \
        && ok "an apk v3 package set verifies and normalizes to rootfs-v1" || bad "apk bundle not built: $(abundle "$A/in" 2>&1)"
    [[ "$(tar -xzOf "$APK_BUNDLE" chengos-pg/PACKAGES | cut -d' ' -f1,2 | tr '\n' ,)" == "libpq 17.5-r3,pgsql-cli 17.5-r3,pgsql-server 17.5-r3," ]] \
        && ok "names and versions come from the ADB metadata" || bad "PACKAGES: $(tar -xzOf "$APK_BUNDLE" chengos-pg/PACKAGES)"
    members="$(tar -tzf "$APK_BUNDLE")"
    [[ "$members" == *"chengos-pg/root/usr/bin/postgres"* && "$members" != *"etc/init.d"* && "$members" != *"lib/apk"* ]] \
        && ok "apk metadata and init scripts are dropped" || bad "members: $members"
    v="$(avariant unpinned)"; cp "$A/keys/other.pem" "$v/keys/"
    expect_cmd "a feed key the profile does not pin is refused" 1 "is not a key profile test-apk pins" abundle "$v"
    v="$(avariant othersig)"; apk_index "$v" "$A/keys/other.key"
    expect_cmd "an index signed by another key is refused" 1 "not signed by a pinned key" abundle "$v"
    v="$(avariant tamper)"; printf 'x' >> "$v/pgsql-cli-17.5-r3.apk"
    expect_cmd "a package with bytes appended is refused" 1 "is not the pgsql-cli the frozen feed index lists" abundle "$v"
    v="$(avariant flip)"; f="$v/pgsql-cli-17.5-r3.apk"; size=$(stat -c %s "$f")
    printf '\377' | dd of="$f" bs=1 seek=$((size - 20)) conv=notrunc status=none
    expect_cmd "a package with a modified byte is refused" 1 "pgsql-cli-17.5-r3.apk" abundle "$v"
    v="$(avariant swapped)"; mk_apk "$v" pgsql-cli usr/bin/psql usr/bin/extra
    expect_cmd "a rebuilt package the frozen index does not list is refused" 1 "does not verify against the frozen feed indexes" abundle "$v"
    APK_SHA="$(sha256sum "$APK_BUNDLE" | cut -d' ' -f1)"
    expect_ok "the apk-built bundle installs with the same device code" \
        "install_postgres_bundle '$T/data/apk/pg/root' '$APK_BUNDLE' $APK_SHA '$T/data/apk/pgdata' && [ -x '$T/data/apk/pg/root/usr/bin/psql' ] && [ -L '$T/data/apk/pg/root/usr/lib/libpq.so.5' ]"
else
    echo "  skip  no apk-tools 3.x (set CHENGOS_TEST_APK to an OpenWrt ImageBuilder's staging_dir/host/bin/apk)"
fi

echo "== PostgreSQL bundle: device install"
PGSHA="$first"
D="$T/data/inst"
mkdir -p "$D/pg"
# rebundle NAME SNIPPET: unpack the good bundle, run SNIPPET in its chengos-pg/, repack, print the hash.
rebundle() {
    local w="$T/re-$1"; rm -rf "$w"; mkdir -p "$w"; tar -xzf "$BUNDLE" -C "$w"
    (cd "$w/chengos-pg" && eval "$2")
    tar -C "$w" -czf "$T/$1.tar.gz" chengos-pg
    sha256sum "$T/$1.tar.gz" | cut -d' ' -f1
}
expect_ok "bundle installs, marks the tree with its hash" \
    "install_postgres_bundle '$D/pg/root' '$BUNDLE' $PGSHA '$D/pgdata' && [ -x '$D/pg/root/usr/bin/postgres' ] && [ -L '$D/pg/root/usr/bin/postmaster' ] \
     && [ \"\$(cat '$D/pg/root/.chengos-complete')\" = $PGSHA ] && [ ! -e '$D/pg/root/etc' ] && [ ! -e '$D/pg/initdb-check' ] && [ ! -e '$D/pg/bundle-x' ]"
expect_ok "the file list is kept with the installed tree" "[ -s '$D/pg/root/.chengos-files' ]"
expect_ok "an intact tree from the same bundle is not unpacked again" \
    "out=\$(install_postgres_bundle '$D/pg/root' '$BUNDLE' $PGSHA '$D/pgdata' 2>&1) && case \"\$out\" in *unpacked*) false ;; esac && [ ! -e '$D/pg/root.prev' ]"
expect_ok "a damaged tree from the same bundle is reinstalled from it (repair)" \
    "rm '$D/pg/root/usr/bin/psql'; echo x >> '$D/pg/root/usr/bin/pg_ctl'; install_postgres_bundle '$D/pg/root' '$BUNDLE' $PGSHA '$D/pgdata' \
     && [ -x '$D/pg/root/usr/bin/psql' ] && pg_tree_matches '$D/pg/root' '$D/pg/root/.chengos-files'"
expect_fail "a damaged tree without its bundle fails explicitly" \
    "rm '$D/pg/root/usr/bin/psql'; install_postgres_bundle '$D/pg/root' '$T/no-such-bundle.tar.gz' $PGSHA '$D/pgdata'" "bundle $T/no-such-bundle.tar.gz is missing"
expect_ok "a tree without a file list (older install) is reinstalled" \
    "rm -rf '$D/pg/root.prev'; rm '$D/pg/root/.chengos-files'; install_postgres_bundle '$D/pg/root' '$BUNDLE' $PGSHA '$D/pgdata' && [ -s '$D/pg/root/.chengos-files' ] && [ -x '$D/pg/root/usr/bin/psql' ]"
expect_fail "a bundle not matching the manifest hash is refused" \
    "install_postgres_bundle '$D/pg/root2' '$BUNDLE' 0000 '$D/pgdata'" "does not match the SHA-256 in the signed manifest"
sha="$(rebundle tampered 'echo evil >> root/usr/bin/psql')"
expect_fail "a file not matching the bundle's list is refused" \
    "install_postgres_bundle '$D/pg/root3' '$T/tampered.tar.gz' $sha '$D/pgdata'" "do not match the SHA-256 in its file list"
sha="$(rebundle extra 'echo x > root/usr/bin/extra')"
expect_fail "a file not in the bundle's list is refused" \
    "install_postgres_bundle '$D/pg/root3' '$T/extra.tar.gz' $sha '$D/pgdata'" "not in its file list"
sha="$(rebundle relink 'ln -sfn initdb root/usr/bin/postmaster')"
expect_fail "a symlink not matching the bundle's list is refused" \
    "install_postgres_bundle '$D/pg/root3' '$T/relink.tar.gz' $sha '$D/pgdata'" "does not match its file list"
sha="$(rebundle format 'echo rootfs-v2 > FORMAT')"
expect_fail "an unknown bundle format is refused" \
    "install_postgres_bundle '$D/pg/root3' '$T/format.tar.gz' $sha '$D/pgdata'" "has format 'rootfs-v2'"
sha="$(rebundle nobase 'rm BASE-LIBS')"
expect_fail "a bundle without BASE-LIBS is refused" \
    "install_postgres_bundle '$D/pg/root3' '$T/nobase.tar.gz' $sha '$D/pgdata'" "incomplete"
mkdir -p "$T/syslib/lib" "$T/syslib/usr/lib"; : > "$T/syslib/lib/libc.so"; : > "$T/syslib/usr/lib/libz.so.1"
sha="$(rebundle baselibs 'printf "libc.so\nlibz.so.1\n" > BASE-LIBS')"
expect_ok "firmware libraries in /lib and /usr/lib satisfy BASE-LIBS" \
    "PG_SYSTEM_LIB_DIR='$T/syslib/lib'; PG_SYSTEM_USRLIB_DIR='$T/syslib/usr/lib'; install_postgres_bundle '$D/pg/rootb' '$T/baselibs.tar.gz' $sha '$D/pgdata'"
sha="$(rebundle lacklib 'printf "libc.so\nlibreadline.so.8\n" > BASE-LIBS')"
expect_fail "a firmware lacking a needed library is refused" \
    "PG_SYSTEM_LIB_DIR='$T/syslib/lib'; PG_SYSTEM_USRLIB_DIR='$T/syslib/usr/lib'; install_postgres_bundle '$D/pg/rootc' '$T/lacklib.tar.gz' $sha '$D/pgdata'" "lacks libraries the PostgreSQL bundle needs: libreadline.so.8"
sha="$(rebundle dotdot 'echo "f 00 ../../escape" >> FILES')"
expect_fail "a file list path leaving the tree is refused" \
    "install_postgres_bundle '$D/pg/root3' '$T/dotdot.tar.gz' $sha '$D/pgdata'" "invalid path"
mkdir -p "$D/pgdata"; echo 16 > "$D/pgdata/PG_VERSION"
expect_fail "a different PostgreSQL major than the cluster is refused" \
    "install_postgres_bundle '$D/pg/root4' '$BUNDLE' $PGSHA '$D/pgdata'" "major upgrade is not supported"
echo 17 > "$D/pgdata/PG_VERSION"
expect_ok "a new bundle replaces the tree and keeps the old one as .prev" \
    "echo stale > '$D/pg/root/.chengos-complete'; install_postgres_bundle '$D/pg/root' '$BUNDLE' $PGSHA '$D/pgdata' && [ -d '$D/pg/root.prev' ] && [ -x '$D/pg/root/usr/bin/psql' ]"
expect_fail "missing PostgreSQL libraries are refused" \
    "rm -rf '$D/pg/root5'; printf '#!/bin/sh\necho \"libssl.so.3 => not found\"\n' > '$T/bad-loader'; chmod +x '$T/bad-loader'; MUSL_LOADER='$T/bad-loader'; install_postgres_bundle '$D/pg/root5' '$BUNDLE' $PGSHA '$D/pgdata'" "cannot resolve its libraries"
expect_fail "a postgres reporting another version is refused before the swap" \
    "echo stale > '$D/pg/root/.chengos-complete'; PG_FIXTURE_VERSION=17.4; export PG_FIXTURE_VERSION; install_postgres_bundle '$D/pg/root' '$BUNDLE' $PGSHA '$D/pgdata'" "reports 'postgres (PostgreSQL) 17.4'"
expect_fail "a PostgreSQL that cannot initdb is refused before the swap" \
    "PG_FIXTURE_INITDB_FAIL=1; export PG_FIXTURE_INITDB_FAIL; install_postgres_bundle '$D/pg/root' '$BUNDLE' $PGSHA '$D/pgdata'" "cannot initialize a cluster"
expect_ok "a refused new tree leaves the installed one in place" \
    "[ -x '$D/pg/root/usr/bin/psql' ] && [ \"\$(cat '$D/pg/root/.chengos-complete')\" = stale ] && [ ! -e '$D/pg/initdb-check' ]"

echo "== update: failures before the release switch"
# abort_update_before_switch with the services stubbed: the swapped
# PostgreSQL tree and the release link must both be the old ones again.
U="$T/data/upd"
prep_update() {
    rm -rf "$U"; mkdir -p "$U/pg/root" "$U/pg/root.prev" "$U/releases/1.0.0" "$U/releases/2.0.0"
    echo new > "$U/pg/root/which"; echo old > "$U/pg/root.prev/which"
    ln -sfn releases/2.0.0 "$U/current"
}
prep_update
expect_fail "a failure after the PostgreSQL swap restores the old tree and release" \
    "start_services() { :; }; data='$U' old=1.0.0; abort_update_before_switch storage 'could not copy the Skill files'" "could not copy the Skill files"
[[ "$(cat "$U/pg/root/which")" == old && ! -e "$U/pg/root.prev" && "$(readlink "$U/current")" == releases/1.0.0 ]] \
    && ok "the old PostgreSQL tree and release link are back" || bad "after abort: $(cat "$U/pg/root/which" 2>&1) $(readlink "$U/current")"
prep_update; rm -rf "$U/pg/root"
expect_fail "a swap interrupted between the two moves is undone too" \
    "start_services() { :; }; data='$U' old=1.0.0; abort_update_before_switch database 'x'" "x"
[[ "$(cat "$U/pg/root/which")" == old ]] && ok "the old tree is back after an interrupted swap" || bad "interrupted swap not undone"
prep_update; rm -rf "$U/pg/root.prev"
expect_fail "without a swap the installed tree is left alone" \
    "start_services() { :; }; data='$U' old=1.0.0; abort_update_before_switch database 'x'" "x"
[[ "$(cat "$U/pg/root/which")" == new ]] && ok "an unswapped tree is not touched" || bad "unswapped tree changed"

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
  {"id": "test-profile", "status": "supported", "arch": "arm64", "package_arch": "aarch64_generic", "package_format": "ipk",
   "match": {"board": "test,board", "machine": "MACHINE", "distrib_release": "24.10.4", "distrib_target": "armsr/armv8"},
   "min_ram_mb": 512, "min_free_mb": 1, "min_free_inodes": 1},
  {"id": "test-experimental", "status": "experimental", "arch": "arm64", "package_arch": "aarch64_generic", "package_format": "ipk",
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
