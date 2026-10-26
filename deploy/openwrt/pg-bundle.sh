#!/usr/bin/env bash
#
# Builds a profile's PostgreSQL bundle, a release asset:
#   dist/chengos-openwrt-pg-<profile>-v<version>.tar.gz
#
# The bundle carries the exact .ipk files qualified for that firmware profile
# (pgsql-server, pgsql-cli, libpq and whatever else the library check on the
# device needed) unchanged, plus chengos-pg/PACKAGES with one line per
# package: "NAME VERSION SHA256 FILE". The device checks the bundle against the
# signed manifest and every package against PACKAGES, so installs no longer
# depend on what a (possibly snapshot, unsigned) firmware feed serves today.
#
# Usage:
#   deploy/openwrt/pg-bundle.sh --profile ID --ipk-dir DIR [--version X.Y.Z] [--out DIR]
set -euo pipefail

OPENWRT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${OPENWRT_DIR}/../.." && pwd)"
# shellcheck source=lib/common.sh
source "${OPENWRT_DIR}/lib/common.sh"

usage() { sed -n '2,14p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

PROFILE="" IPK_DIR="" OUT="${REPO_ROOT}/dist"
VERSION="$(tr -d '[:space:]' < "${REPO_ROOT}/VERSION")"
while [[ $# -gt 0 ]]; do
    case "$1" in
        --profile) PROFILE="${2:-}"; shift 2 ;;
        --ipk-dir) IPK_DIR="${2:-}"; shift 2 ;;
        --version) VERSION="${2:-}"; shift 2 ;;
        --out) OUT="${2:-}"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        *) ow_error "unknown option: $1"; usage >&2; exit 2 ;;
    esac
done
[[ "$PROFILE" =~ ^[a-z0-9][a-z0-9._-]*$ ]] || ow_die "--profile must be a lowercase profile id"
[[ -d "$IPK_DIR" ]] || ow_die "--ipk-dir must be a directory of .ipk files"
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || ow_die "version '${VERSION}' is not MAJOR.MINOR.PATCH"

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "${STAGE}/chengos-pg"

# read_control IPK: unpack the package's control file into $STAGE/ctl and
# check it has data. Member names come with or without "./" depending on the
# build tool, so the archives are unpacked rather than read by member name.
read_control() {
    rm -rf "${STAGE:?}/ctl" && mkdir -p "${STAGE}/ctl/outer"
    tar -xzf "$1" -C "${STAGE}/ctl/outer" || return 1
    [[ -f "${STAGE}/ctl/outer/control.tar.gz" && -f "${STAGE}/ctl/outer/data.tar.gz" ]] || return 1
    tar -xzf "${STAGE}/ctl/outer/control.tar.gz" -C "${STAGE}/ctl" || return 1
    [[ -f "${STAGE}/ctl/control" ]]
}
control_field() { sed -n "s/^$1: //p" "${STAGE}/ctl/control" | head -n 1; }

shopt -s nullglob
ipks=("${IPK_DIR}"/*.ipk)
[[ ${#ipks[@]} -gt 0 ]] || ow_die "no .ipk files in ${IPK_DIR}"
: > "${STAGE}/chengos-pg/PACKAGES"
for ipk in "${ipks[@]}"; do
    file="$(basename "$ipk")"
    [[ "$file" =~ ^[A-Za-z0-9][A-Za-z0-9._+-]*\.ipk$ ]] || ow_die "unexpected file name: ${file}"
    read_control "$ipk" || ow_die "${file} is not an ipk (control.tar.gz + data.tar.gz)"
    name="$(control_field Package)"
    version="$(control_field Version)"
    [[ -n "$name" && -n "$version" ]] || ow_die "${file} has no Package/Version in its control file"
    cp "$ipk" "${STAGE}/chengos-pg/${file}"
    printf '%s %s %s %s\n' "$name" "$version" "$(sha256sum "$ipk" | cut -d' ' -f1)" "$file" \
        >> "${STAGE}/chengos-pg/PACKAGES"
done
rm -rf "${STAGE:?}/ctl"
LC_ALL=C sort -o "${STAGE}/chengos-pg/PACKAGES" "${STAGE}/chengos-pg/PACKAGES"
grep -q '^pgsql-server ' "${STAGE}/chengos-pg/PACKAGES" || ow_die "the bundle needs a pgsql-server package"
for required in pgsql-cli libpq; do
    grep -q "^${required} " "${STAGE}/chengos-pg/PACKAGES" || ow_warn "no ${required} package; the device's library check decides"
done

mkdir -p "$OUT"
BUNDLE="${OUT}/chengos-openwrt-pg-${PROFILE}-v${VERSION}.tar.gz"
# Reproducible: fixed order, owner and times, no gzip timestamp.
tar -C "$STAGE" --sort=name --owner=0 --group=0 --numeric-owner --mtime=@0 -cf - chengos-pg \
    | gzip -n -9 > "$BUNDLE"
ow_log "PostgreSQL bundle ${BUNDLE}:"
sed 's/^/  /' "${STAGE}/chengos-pg/PACKAGES" >&2
printf '%s\n' "$BUNDLE"
