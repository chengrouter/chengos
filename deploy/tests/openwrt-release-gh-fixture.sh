#!/usr/bin/env bash
# Offline gh fixture for openwrt-release-upload-smoke.sh; never contacts GitHub.
set -euo pipefail
printf '%s\n' "$*" >> "$MOCK_DIR/calls"
case "${1:-}" in
    auth)
        [[ "${GH_AUTH_FAIL:-0}" == 0 ]]
        exit ;;
    api)
        shift
        endpoint=""
        while [[ $# -gt 0 ]]; do
            case "$1" in
                --hostname|-H) shift 2 ;;
                *) endpoint=$1; shift ;;
            esac
        done
        case "$endpoint" in
            "repos/chengrouter/chengos/git/ref/tags/v9.9.9")
                printf '{"object":{"type":"tag","sha":"1111111111111111111111111111111111111111"}}\n' ;;
            repos/chengrouter/chengos/git/tags/*)
                sha="$MOCK_TAG_COMMIT"
                [[ "${GH_WRONG_TAG:-0}" == 0 ]] || sha="$(printf '%040d' 0)"
                printf '{"object":{"type":"commit","sha":"%s"}}\n' "$sha" ;;
            "repos/chengrouter/chengos/releases/tags/v9.9.9")
                [[ "${GH_MISSING_RELEASE:-0}" == 0 ]] || exit 1
                cat "$MOCK_DIR/release.json" ;;
            repos/chengrouter/chengos/releases/assets/*)
                id="${endpoint##*/}"
                name="$(jq -r --argjson id "$id" '.assets[] | select(.id == $id) | .name' "$MOCK_DIR/release.json")"
                [[ -n "$name" ]] || exit 1
                cat "$MOCK_DIR/assets/$name" ;;
            *) echo "unexpected API endpoint: $endpoint" >&2; exit 1 ;;
        esac
        ;;
    release)
        [[ "$2" == upload && "$3" == v9.9.9 && "$5" == --repo &&
           "$6" == github.com/chengrouter/chengos && $# == 6 ]] || exit 1
        file=$4 name="$(basename "$4")"
        if [[ "${GH_FAIL_ASSET:-}" == "$name" && ! -e "$MOCK_DIR/failed-once" ]]; then
            touch "$MOCK_DIR/failed-once"
            exit 1
        fi
        [[ "$(jq --arg n "$name" '[.assets[] | select(.name == $n)] | length' "$MOCK_DIR/release.json")" == 0 ]] \
            || { echo "refusing fixture overwrite" >&2; exit 1; }
        cp "$file" "$MOCK_DIR/assets/$name"
        size="$(stat -c %s "$file")"
        digest="sha256:$(sha256sum "$file" | cut -d' ' -f1)"
        [[ "${GH_CORRUPT_ASSET:-}" != "$name" ]] || digest="sha256:$(printf '%064d' 0)"
        jq --arg n "$name" --arg d "$digest" --argjson s "$size" '
            .assets += [{id:((.assets|length)+1), name:$n, size:$s, digest:$d, state:"uploaded"}]
        ' "$MOCK_DIR/release.json" > "$MOCK_DIR/new.json"
        mv "$MOCK_DIR/new.json" "$MOCK_DIR/release.json"
        printf '%s\n' "$name" >> "$MOCK_DIR/uploads"
        ;;
    *) echo "unexpected gh command" >&2; exit 1 ;;
esac
