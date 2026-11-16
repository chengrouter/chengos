#!/usr/bin/env bash
# Sourced by the OpenWrt smoke tests: a frozen .ipk input directory for
# pg-bundle.sh, with stand-in PostgreSQL programs that answer -V and whose
# initdb writes PG_VERSION. Environment at run time:
#   PG_FIXTURE_VERSION      what postgres -V reports (default 17.5)
#   PG_FIXTURE_INITDB_FAIL  non-empty: initdb fails

# pg_fixture_ipk DIR NAME VERSION [ARCH] -- PATH...: a minimal .ipk holding
# PATHs: usr/bin/postgres and usr/bin/initdb get their stand-ins, NAME->TARGET
# becomes a symlink, anything else a small script.
pg_fixture_ipk() {
    local dir=$1 name=$2 version=$3 arch=aarch64_generic w f
    shift 3
    if [[ "$1" != -- ]]; then arch=$1; shift; fi
    shift
    w="$(mktemp -d)"
    mkdir -p "$w/data" "$w/ctl" "$w/outer"
    for f in "$@"; do
        if [[ "$f" == *"->"* ]]; then
            mkdir -p "$w/data/$(dirname "${f%%->*}")"
            ln -s "${f#*->}" "$w/data/${f%%->*}"
            continue
        fi
        mkdir -p "$w/data/$(dirname "$f")"
        case "$f" in
            usr/bin/postgres)
                printf '#!/bin/sh\n[ "$1" = -V ] && echo "postgres (PostgreSQL) ${PG_FIXTURE_VERSION:-17.5}"\nexit 0\n' > "$w/data/$f" ;;
            usr/bin/initdb)
                printf '#!/bin/sh\nwhile [ $# -gt 0 ]; do case "$1" in -D) d=$2; shift 2 ;; *) shift ;; esac; done\n[ -z "${PG_FIXTURE_INITDB_FAIL:-}" ] || { echo "initdb: fixture failure" >&2; exit 1; }\nmkdir -p "$d" && echo 17 > "$d/PG_VERSION"\n' > "$w/data/$f" ;;
            *) printf '#!/bin/sh\necho %s\n' "$f" > "$w/data/$f" ;;
        esac
        chmod +x "$w/data/$f"
    done
    printf 'Package: %s\nVersion: %s\nArchitecture: %s\n' "$name" "$version" "$arch" > "$w/ctl/control"
    tar -C "$w/data" -czf "$w/outer/data.tar.gz" .
    tar -C "$w/ctl" -czf "$w/outer/control.tar.gz" ./control
    echo 2.0 > "$w/outer/debian-binary"
    tar -C "$w/outer" -czf "$dir/${name}_${version}_${arch}.ipk" ./debian-binary ./data.tar.gz ./control.tar.gz
    rm -rf "$w"
}

# pg_fixture_index DIR: (re)write DIR/feeds/test/Packages for DIR's .ipks.
pg_fixture_index() {
    local dir=$1 f
    mkdir -p "$dir/feeds/test"
    : > "$dir/feeds/test/Packages"
    for f in "$dir"/*.ipk; do
        [[ -e "$f" ]] || continue
        printf 'Package: %s\nFilename: %s\nSHA256sum: %s\n\n' "$(basename "$f" | cut -d_ -f1)" \
            "$(basename "$f")" "$(sha256sum "$f" | cut -d' ' -f1)" >> "$dir/feeds/test/Packages"
    done
}

# pg_fixture_dir DIR: the complete frozen input of an ipk profile.
pg_fixture_dir() {
    local dir=$1 name
    mkdir -p "$dir/licenses"
    pg_fixture_ipk "$dir" pgsql-server 17.5-r3 -- usr/bin/postgres usr/bin/initdb usr/bin/pg_ctl \
        usr/share/postgresql/postgres.bki etc/init.d/postgresql "usr/bin/postmaster->postgres"
    pg_fixture_ipk "$dir" pgsql-cli 17.5-r3 -- usr/bin/psql
    pg_fixture_ipk "$dir" libpq 17.5-r3 -- usr/lib/libpq.so.5.17 "usr/lib/libpq.so.5->libpq.so.5.17"
    pg_fixture_index "$dir"
    printf 'libc.so\nlibgcc_s.so.1\nlibz.so.1\n' > "$dir/base-libs.txt"
    for name in pgsql-server pgsql-cli libpq; do echo "PostgreSQL License" > "$dir/licenses/$name"; done
}
