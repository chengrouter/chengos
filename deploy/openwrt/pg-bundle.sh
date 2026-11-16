#!/usr/bin/env bash
#
# Builds a profile's PostgreSQL bundle, a release asset:
#   dist/chengos-openwrt-pg-<profile>-v<version>.tar.gz
#
# The input directory holds the frozen upstream packages qualified for the
# profile (.ipk or OpenWrt apk-tools v3 .apk, as profiles.json declares) and
# what proves where they came from. They are verified against the frozen feed
# index, extracted on this host and normalized into one payload the router
# unpacks with BusyBox tar alone (FORMAT rootfs-v1):
#   chengos-pg/FORMAT      rootfs-v1
#   chengos-pg/PACKAGES    NAME VERSION SHA256 FILE of each upstream package
#   chengos-pg/FILES       f SHA256 PATH / l TARGET PATH for every entry of root/
#   chengos-pg/BASE-LIBS   libraries the payload needs from the firmware; the
#                          router checks each is present before installing
#   chengos-pg/PROVENANCE  feed, key, tool and input digests; dropped paths
#   chengos-pg/licenses/   one entry per bundled package
#   chengos-pg/root/       usr/bin, usr/lib, usr/share/postgresql only
#
# Input directory (see pg-freeze.sh for apk-v3-adb profiles):
#   *.apk | *.ipk              the packages (one format, the profile's)
#   feeds/<name>/packages.adb  signed apk v3 feed indexes   (apk-v3-adb)
#   feeds/<name>/Packages[.gz] feed indexes with SHA256sum  (ipk)
#   keys/*.pem                 feed signing keys, pinned by profiles.json (apk-v3-adb)
#   base-libs.txt              library file names on the qualified image
#   base-packages.txt          optional: the image's installed packages
#   firmware.txt               optional: the image's identity facts
#   licenses/<package>         license text (file or directory) per package
#
# Usage:
#   deploy/openwrt/pg-bundle.sh --profile ID --pkg-dir DIR [--profiles FILE]
#       [--apk PATH] [--version X.Y.Z] [--out DIR]
#   (--ipk-dir is an alias of --pkg-dir; --apk defaults to $CHENGOS_OPENWRT_APK
#    or apk on PATH, and must be apk-tools 3.x, e.g. an OpenWrt ImageBuilder's
#    staging_dir/host/bin/apk)
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${OPENWRT_DIR}/../.." && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"

usage() { sed -n '2,36p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

PG_FORMAT=rootfs-v1
PROFILE="" PKG_DIR="" OUT="${REPO_ROOT}/dist" PROFILES="${OPENWRT_DIR}/profiles.json"
APK="${CHENGOS_OPENWRT_APK:-}"
VERSION="$(tr -d '[:space:]' < "${REPO_ROOT}/VERSION")"
while [[ $# -gt 0 ]]; do
    case "$1" in
        --profile) PROFILE="${2:-}"; shift 2 ;;
        --pkg-dir|--ipk-dir) PKG_DIR="${2:-}"; shift 2 ;;
        --profiles) PROFILES="${2:-}"; shift 2 ;;
        --apk) APK="${2:-}"; shift 2 ;;
        --version) VERSION="${2:-}"; shift 2 ;;
        --out) OUT="${2:-}"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        *) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
    esac
done
[[ "$PROFILE" =~ ^[a-z0-9][a-z0-9._-]*$ ]] || ow_die "--profile must be a lowercase profile id"
[[ -d "$PKG_DIR" ]] || ow_die "--pkg-dir must be the profile's frozen package directory"
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || ow_die "version '${VERSION}' is not MAJOR.MINOR.PATCH"
command -v jq >/dev/null 2>&1 || ow_die "jq is required"
command -v readelf >/dev/null 2>&1 || ow_die "readelf is required for the library closure check"
PKG_DIR="$(realpath "$PKG_DIR")"

# ── profile ──────────────────────────────────────────────────────────────────
[[ -f "$PROFILES" ]] || ow_die "profiles file not found: $PROFILES"
P="$(jq -c --arg id "$PROFILE" '.profiles[] | select(.id == $id)' "$PROFILES")"
[[ -n "$P" ]] || ow_die "profile ${PROFILE} is not in ${PROFILES}"
FORMAT_IN="$(jq -r '.package_format // empty' <<< "$P")"
PKG_ARCH="$(jq -r '.package_arch // empty' <<< "$P")"
ARCH="$(jq -r '.arch // empty' <<< "$P")"
case "$FORMAT_IN" in
    ipk) EXT=ipk ;;
    apk-v3-adb) EXT=apk ;;
    *) ow_die "profile ${PROFILE}: package_format must be ipk or apk-v3-adb (got '${FORMAT_IN}')" ;;
esac
[[ -n "$PKG_ARCH" ]] || ow_die "profile ${PROFILE}: package_arch is required"
ELF_MACHINE="$(ow_elf_machine_for_arch "$ARCH")" || ow_die "profile ${PROFILE}: arch '${ARCH}' is invalid"

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
PG="${STAGE}/chengos-pg"
ROOT="${PG}/root"
mkdir -p "$ROOT" "${STAGE}/pkg"
PROV="${STAGE}/provenance"
: > "$PROV"
prov() { printf '%s\n' "$*" >> "$PROV"; }

# ── inputs ───────────────────────────────────────────────────────────────────
shopt -s nullglob
pkgs=("${PKG_DIR}"/*."${EXT}")
other=("${PKG_DIR}"/*.ipk "${PKG_DIR}"/*.apk)
[[ ${#pkgs[@]} -gt 0 ]] || ow_die "no .${EXT} packages in ${PKG_DIR} (profile ${PROFILE} is ${FORMAT_IN})"
[[ ${#other[@]} -eq ${#pkgs[@]} ]] \
    || ow_die "${PKG_DIR} mixes package formats; profile ${PROFILE} takes .${EXT} only"
for f in "${pkgs[@]}"; do
    [[ "$(basename "$f")" =~ ^[A-Za-z0-9][A-Za-z0-9._+-]*\.${EXT}$ ]] || ow_die "unexpected file name: $(basename "$f")"
done
feeds=("${PKG_DIR}"/feeds/*/)
[[ ${#feeds[@]} -gt 0 ]] || ow_die "no frozen feed indexes in ${PKG_DIR}/feeds/<name>/"
BASE_LIBS="${PKG_DIR}/base-libs.txt"
[[ -s "$BASE_LIBS" ]] || ow_die "${BASE_LIBS} is missing: list the qualified image's library file names (pg-freeze.sh --device)"
grep -qx 'libc.so' "$BASE_LIBS" || ow_die "${BASE_LIBS} does not list libc.so; it is not a capture of an OpenWrt image"

prov "format=${PG_FORMAT}"
prov "profile=${PROFILE}"
prov "package_format=${FORMAT_IN}"
prov "package_arch=${PKG_ARCH}"
prov "arch=${ARCH}"
while IFS= read -r url; do prov "feed_url=${url}"; done < <(jq -r '.feed.urls // [] | .[]' <<< "$P")
prov "base_libs_sha256=$(sha256sum "$BASE_LIBS" | cut -d' ' -f1)"
[[ ! -f "${PKG_DIR}/base-packages.txt" ]] || prov "base_packages_sha256=$(sha256sum "${PKG_DIR}/base-packages.txt" | cut -d' ' -f1)"
if [[ -f "${PKG_DIR}/firmware.txt" ]]; then
    while IFS= read -r line; do [[ -z "$line" ]] || prov "firmware ${line}"; done < "${PKG_DIR}/firmware.txt"
fi

# ── verify and extract ───────────────────────────────────────────────────────
# Each package lands in $STAGE/pkg/<name>; PACKAGES gets one line per package.
: > "${PG}/PACKAGES"
add_package() { # NAME VERSION ARCH FILE
    [[ "$1" =~ ^[A-Za-z0-9][A-Za-z0-9._+-]*$ && -n "$2" ]] || ow_die "$(basename "$4") has an invalid name/version"
    [[ "$3" == "$PKG_ARCH" || "$3" == all || "$3" == noarch ]] \
        || ow_die "$(basename "$4") is for ${3}, profile ${PROFILE} needs ${PKG_ARCH}"
    [[ ! -e "${STAGE}/pkg/$1" ]] || ow_die "package $1 is given twice"
    printf '%s %s %s %s\n' "$1" "$2" "$(sha256sum "$4" | cut -d' ' -f1)" "$(basename "$4")" >> "${PG}/PACKAGES"
    prov "package $1 $2 $(sha256sum "$4" | cut -d' ' -f1) $(basename "$4")"
}

verify_extract_apk() {
    [[ -n "$APK" ]] || APK="$(command -v apk || true)"
    [[ -n "$APK" && -x "$APK" ]] || ow_die "apk-tools 3.x is required for ${FORMAT_IN} (pass --apk or set CHENGOS_OPENWRT_APK)"
    local apk_version
    apk_version="$("$APK" --version 2>/dev/null | head -n 1)"
    [[ "$apk_version" =~ ^apk-tools\ 3\. ]] || ow_die "${APK} is '${apk_version}', not apk-tools 3.x"
    prov "tool=${apk_version%%,*} sha256=$(sha256sum "$(realpath "$APK")" | cut -d' ' -f1)"

    # Trust: only the keys profiles.json pins, copied out of the input.
    local keys="${STAGE}/keys" key sum
    mkdir -p "$keys"
    local pinned
    pinned="$(jq -r '.feed.key_sha256 // [] | .[]' <<< "$P")"
    [[ -n "$pinned" ]] || ow_die "profile ${PROFILE}: feed.key_sha256 must pin the feed signing key(s)"
    local found=0
    for key in "${PKG_DIR}"/keys/*.pem; do
        sum="$(sha256sum "$key" | cut -d' ' -f1)"
        grep -qx "$sum" <<< "$pinned" || ow_die "$(basename "$key") (sha256 ${sum}) is not a key profile ${PROFILE} pins"
        cp "$key" "$keys/"
        prov "feed_key $(basename "$key") ${sum}"
        found=1
    done
    [[ "$found" == 1 ]] || ow_die "no feed signing key in ${PKG_DIR}/keys/"

    # A local mirror per feed: the signed index plus every input package.
    # apk fetch then checks the index signature and each package against it.
    local repos=() feed name f
    for feed in "${feeds[@]}"; do
        name="$(basename "$feed")"
        [[ -f "${feed}packages.adb" ]] || ow_die "feeds/${name} has no packages.adb"
        "$APK" verify --keys-dir "$keys" "${feed}packages.adb" >/dev/null 2>&1 \
            || ow_die "feeds/${name}/packages.adb is not signed by a pinned key"
        mkdir -p "${STAGE}/mirror/${name}"
        cp "${feed}packages.adb" "${STAGE}/mirror/${name}/"
        for f in "${pkgs[@]}"; do ln -s "$f" "${STAGE}/mirror/${name}/"; done
        repos+=(--repository "${STAGE}/mirror/${name}/packages.adb")
        prov "feed_index ${name} $(sha256sum "${feed}packages.adb" | cut -d' ' -f1)"
        # NAME VERSION FILE-SIZE: apk ignores bytes appended to a package, the size catches them.
        "$APK" adbdump "${feed}packages.adb" 2>/dev/null \
            | awk '/^  - name: /{n=$3} /^    version: /{v=$2} /^    file-size: /{print n, v, $2}' >> "${STAGE}/sizes"
    done
    local apk_base=("$APK" --root "${STAGE}/aroot" --keys-dir "$keys" --repositories-file /dev/null
        "${repos[@]}" --arch "$PKG_ARCH" --no-cache --no-interactive --quiet)
    mkdir -p "${STAGE}/aroot" "${STAGE}/fetched"

    local info pname pversion parch
    for f in "${pkgs[@]}"; do
        info="$("$APK" adbdump "$f" 2>/dev/null | sed -n '/^info:/,/^[a-z]/p')" || true
        pname="$(sed -n 's/^  name: //p' <<< "$info" | head -n 1)"
        pversion="$(sed -n 's/^  version: //p' <<< "$info" | head -n 1)"
        parch="$(sed -n 's/^  arch: //p' <<< "$info" | head -n 1)"
        [[ -n "$pname" ]] || ow_die "$(basename "$f") is not an apk v3 package"
        "${apk_base[@]}" fetch -o "${STAGE}/fetched" "$pname" >/dev/null 2>"${STAGE}/fetch.err" \
            || ow_die "$(basename "$f") does not verify against the frozen feed indexes: $(tr '\n' ' ' < "${STAGE}/fetch.err")"
        cmp -s "$f" "${STAGE}/fetched/${pname}-${pversion}.apk" \
            && grep -qxF "${pname} ${pversion} $(stat -c %s "$f")" "${STAGE}/sizes" \
            || ow_die "$(basename "$f") is not the ${pname} the frozen feed index lists"
        add_package "$pname" "$pversion" "$parch" "$f"
        mkdir -p "${STAGE}/pkg/${pname}"
        "$APK" --allow-untrusted extract --destination "${STAGE}/pkg/${pname}" "$f" >/dev/null 2>&1 \
            || ow_die "cannot extract $(basename "$f")"
    done
}

verify_extract_ipk() {
    prov "tool=$(tar --version | head -n 1)"
    # FILENAME SHA256 from every frozen Packages index.
    local index="${STAGE}/ipk-index" feed name list
    : > "$index"
    for feed in "${feeds[@]}"; do
        name="$(basename "$feed")"
        if [[ -f "${feed}Packages.gz" ]]; then list="$(gzip -dc "${feed}Packages.gz")"
        elif [[ -f "${feed}Packages" ]]; then list="$(cat "${feed}Packages")"
        else ow_die "feeds/${name} has no Packages or Packages.gz"; fi
        awk '/^Filename: /{f=$2} /^SHA256sum: /{s=$2} /^$/{if(f&&s)print f" "s; f=s=""} END{if(f&&s)print f" "s}' \
            <<< "$list" >> "$index"
        prov "feed_index ${name} $(sha256sum "${feed}"Packages* | head -n 1 | cut -d' ' -f1)"
    done
    local f file sum ctl
    for f in "${pkgs[@]}"; do
        file="$(basename "$f")"
        sum="$(sha256sum "$f" | cut -d' ' -f1)"
        awk -v f="$file" -v s="$sum" '$1 == f && $2 == s {found=1} END{exit !found}' "$index" \
            || ow_die "${file} does not match the frozen feed indexes"
        ctl="${STAGE}/ctl"
        rm -rf "$ctl" && mkdir -p "$ctl/outer"
        tar -xzf "$f" -C "$ctl/outer" 2>/dev/null \
            && [[ -f "$ctl/outer/control.tar.gz" && -f "$ctl/outer/data.tar.gz" ]] \
            && tar -xzf "$ctl/outer/control.tar.gz" -C "$ctl" && [[ -f "$ctl/control" ]] \
            || ow_die "${file} is not an ipk (control.tar.gz + data.tar.gz)"
        field() { sed -n "s/^$1: //p" "$ctl/control" | head -n 1; }
        add_package "$(field Package)" "$(field Version)" "$(field Architecture)" "$f"
        mkdir -p "${STAGE}/pkg/$(field Package)"
        tar -xzf "$ctl/outer/data.tar.gz" -C "${STAGE}/pkg/$(field Package)" || ow_die "cannot unpack ${file}"
    done
    rm -rf "${STAGE:?}/ctl"
}

case "$FORMAT_IN" in
    apk-v3-adb) verify_extract_apk ;;
    ipk) verify_extract_ipk ;;
esac
LC_ALL=C sort -o "${PG}/PACKAGES" "${PG}/PACKAGES"
grep -q '^pgsql-server ' "${PG}/PACKAGES" || ow_die "the bundle needs a pgsql-server package"

# ── normalize ────────────────────────────────────────────────────────────────
# Only usr/bin, usr/lib (not opkg metadata) and usr/share/postgresql ship.
# Package scripts, init scripts, UCI config and package-manager metadata are
# dropped, so nothing of the firmware's PostgreSQL service is ever run.
whitelisted() {
    case "$1" in
        usr/lib/opkg/*) return 1 ;;
        usr/bin/*|usr/lib/*|usr/share/postgresql/*) return 0 ;;
        *) return 1 ;;
    esac
}
while read -r name _; do
    dir="${STAGE}/pkg/${name}"
    list="${STAGE}/keep-${name}"
    : > "$list"
    while IFS= read -r path; do
        path="${path#./}"
        [[ "$path" =~ ^[A-Za-z0-9._+/@-]+$ ]] || ow_die "${name}: unsupported path name '${path}'"
        if whitelisted "$path"; then
            [[ ! -e "${ROOT}/${path}" && ! -L "${ROOT}/${path}" ]] || ow_die "${name} and another package both ship ${path}"
            printf '%s\n' "$path" >> "$list"
        else
            prov "dropped ${name} ${path}"
        fi
    done < <(cd "$dir" && find . ! -type d | LC_ALL=C sort)
    [[ -s "$list" ]] || continue
    # Hard links become independent files; symlinks stay symlinks.
    tar -C "$dir" --hard-dereference -cf - -T "$list" | tar -C "$ROOT" -xf -
done < "${PG}/PACKAGES"

# Entries must be plain files, directories or symlinks staying in the tree.
odd="$(find "$ROOT" ! -type f ! -type d ! -type l)"
[[ -z "$odd" ]] || ow_die "unsupported file types in the payload: ${odd}"
setid="$(find "$ROOT" -type f -perm /6000)"
[[ -z "$setid" ]] || ow_die "setuid/setgid files in the payload: ${setid}"
while IFS= read -r link; do
    target="$(readlink "$link")"
    rel="${link#"${ROOT}/"}"
    [[ "$target" != /* ]] || ow_die "absolute symlink ${rel} -> ${target}"
    resolved="$(realpath -m "$(dirname "$link")/${target}")"
    [[ "$resolved" == "${ROOT}/"* ]] || ow_die "symlink ${rel} -> ${target} leaves the payload"
    [[ -e "$link" ]] || ow_die "dangling symlink ${rel} -> ${target}"
done < <(find "$ROOT" -type l)
musl="$(find "$ROOT" \( -name 'ld-musl-*' -o -name 'libc.so' -o -name 'libc.musl-*' \))"
[[ -z "$musl" ]] || ow_die "the payload must never carry the C library or loader: ${musl}"
for bin in postgres initdb pg_ctl psql; do
    [[ -f "${ROOT}/usr/bin/${bin}" && -x "${ROOT}/usr/bin/${bin}" ]] || ow_die "the package set has no usr/bin/${bin}"
done
find "$ROOT" -type d -exec chmod 0755 {} +
find "$ROOT" -type f -perm /111 -exec chmod 0755 {} +
find "$ROOT" -type f ! -perm /111 -exec chmod 0644 {} +

# ── library closure ──────────────────────────────────────────────────────────
# Every DT_NEEDED of every ELF file must resolve to a library the payload
# ships in usr/lib (the runtime LD_LIBRARY_PATH) or one the qualified image
# has. A payload library the image also has shadows it for PostgreSQL only.
payload_libs="$(find "${ROOT}/usr/lib" -maxdepth 1 \( -type f -o -type l \) -printf '%f\n' 2>/dev/null | LC_ALL=C sort -u)"
missing=""
: > "${STAGE}/base-needed"
while IFS= read -r file; do
    machine="$(ow_elf_machine_of "$file")" || continue
    rel="${file#"${ROOT}/"}"
    [[ "$machine" == "$ELF_MACHINE" ]] || ow_die "${rel} is built for ELF machine ${machine}, profile ${PROFILE} is ${ARCH}"
    while IFS= read -r need; do
        grep -qxF "$need" <<< "$payload_libs" && continue
        if grep -qxF "$need" "$BASE_LIBS"; then printf '%s\n' "$need" >> "${STAGE}/base-needed"; continue; fi
        missing+="  ${rel} needs ${need}"$'\n'
    done < <(readelf -d "$file" 2>/dev/null | sed -n 's/.*(NEEDED).*\[\(.*\)\]/\1/p')
done < <(LC_ALL=C grep -rlaP '^\x7fELF' "$ROOT" | LC_ALL=C sort)
[[ -z "$missing" ]] || ow_die "libraries neither in the payload nor on the qualified image (add the packages that ship them):"$'\n'"${missing}"
LC_ALL=C sort -u "${STAGE}/base-needed" > "${PG}/BASE-LIBS"
while IFS= read -r lib; do
    [[ -n "$lib" ]] || continue
    if grep -qxF "$lib" "$BASE_LIBS"; then
        ow_warn "${lib} is also on the image; PostgreSQL uses the bundled copy"
        prov "shadow ${lib}"
    fi
done <<< "$payload_libs"

# ── licenses ─────────────────────────────────────────────────────────────────
mkdir -p "${PG}/licenses"
while read -r name _; do
    src="${PKG_DIR}/licenses/${name}"
    [[ ( -f "$src" && -s "$src" ) || ( -d "$src" && -n "$(ls -A "$src")" ) ]] \
        || ow_die "no license for ${name}: put its license text in ${src} (file or directory)"
    cp -rL "$src" "${PG}/licenses/${name}"
done < "${PG}/PACKAGES"
find "${PG}/licenses" -type d -exec chmod 0755 {} +
find "${PG}/licenses" -type f -exec chmod 0644 {} +

# ── metadata and archive ─────────────────────────────────────────────────────
printf '%s\n' "$PG_FORMAT" > "${PG}/FORMAT"
(
    cd "$ROOT"
    find . ! -type d | sed 's#^\./##' | LC_ALL=C sort | while IFS= read -r path; do
        if [[ -L "$path" ]]; then printf 'l %s %s\n' "$(readlink "$path")" "$path"
        else printf 'f %s %s\n' "$(sha256sum "$path" | cut -d' ' -f1)" "$path"; fi
    done
) > "${PG}/FILES"
prov "files_sha256=$(sha256sum "${PG}/FILES" | cut -d' ' -f1)"
LC_ALL=C sort -o "${PG}/PROVENANCE" "$PROV"

mkdir -p "$OUT"
BUNDLE="${OUT}/chengos-openwrt-pg-${PROFILE}-v${VERSION}.tar.gz"
# Reproducible: fixed order, owner and times, no gzip timestamp.
tar -C "$STAGE" --sort=name --owner=0 --group=0 --numeric-owner --mtime=@0 -cf - chengos-pg \
    | gzip -n -9 > "$BUNDLE"
ow_log "PostgreSQL bundle ${BUNDLE} (${PG_FORMAT}, $(wc -l < "${PG}/FILES") files):"
sed 's/^/  /' "${PG}/PACKAGES" >&2
printf '%s\n' "$BUNDLE"
