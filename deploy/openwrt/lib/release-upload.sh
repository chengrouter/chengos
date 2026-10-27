#!/usr/bin/env bash
# GitHub Release assets are flat. These helpers never create/publish a Release,
# change tags, delete assets, or use --clobber.

ow_upload_load_remote() {
    command -v gh >/dev/null 2>&1 || ow_die "gh is required for --publish"
    gh auth status --hostname github.com >/dev/null 2>&1 || ow_die "run gh auth login for github.com first"
    gh api --hostname github.com "repos/$RELEASE_REPO/releases/tags/$TAG" > "$WORK/remote.json" \
        || ow_die "GitHub Release $RELEASE_REPO $TAG must already exist (a Git tag alone is not a Release)"
    jq -e --arg tag "$TAG" '
        .tag_name == $tag and (.assets | type == "array") and
        (.immutable != true)
    ' "$WORK/remote.json" >/dev/null || ow_die "remote release tag is wrong or the Release is immutable"
    local object type sha depth=0
    object="$(gh api --hostname github.com "repos/$RELEASE_REPO/git/ref/tags/$TAG" | jq -c .object)" \
        || ow_die "cannot resolve the remote source tag"
    while :; do
        type="$(jq -r .type <<< "$object")"; sha="$(jq -r .sha <<< "$object")"
        [[ "$sha" =~ ^([a-f0-9]{40}|[a-f0-9]{64})$ ]] || ow_die "invalid remote tag object"
        [[ "$type" != commit ]] || break
        [[ "$type" == tag && "$depth" -lt 10 ]] || ow_die "remote tag does not resolve to a commit"
        object="$(gh api --hostname github.com "repos/$RELEASE_REPO/git/tags/$sha" | jq -c .object)" \
            || ow_die "cannot resolve the annotated remote tag"
        depth=$((depth + 1))
    done
    [[ "$sha" == "$EXPECTED_ROOT_COMMIT" ]] || ow_die "remote tag commit differs from the frozen source"
}

ow_upload_remote_hash() {
    local record=$1 id digest
    digest="$(jq -r '.digest // ""' <<< "$record")"
    if [[ "$digest" =~ ^sha256:([a-fA-F0-9]{64})$ ]]; then
        printf '%s\n' "${BASH_REMATCH[1],,}"
        return
    fi
    id="$(jq -r .id <<< "$record")"
    [[ "$id" =~ ^[0-9]+$ ]] || ow_die "remote asset has no valid id"
    # Older assets have no API digest. Compare actual bytes, not a mutable
    # filename or a separately uploaded checksum sidecar.
    gh api --hostname github.com -H 'Accept: application/octet-stream' \
        "repos/$RELEASE_REPO/releases/assets/$id" > "$WORK/remote-asset-$id" \
        || ow_die "cannot download remote asset $id to compare its hash"
    sha256sum "$WORK/remote-asset-$id" | cut -d' ' -f1
}

ow_upload_plan() {
    local name records count record digest remote_digest size
    UPLOAD_NAMES=()
    for name in "${ASSET_NAMES[@]}"; do
        records="$(jq -c --arg n "$name" '[.assets[] | select(.name == $n)]' "$WORK/remote.json")"
        count="$(jq length <<< "$records")"
        [[ "$count" -le 1 ]] || ow_die "duplicate remote asset names: $name"
        if [[ "$count" == 0 ]]; then
            UPLOAD_NAMES+=("$name")
            ow_log "UPLOAD $name"
            continue
        fi
        record="$(jq -c '.[0]' <<< "$records")"
        [[ "$(jq -r .state <<< "$record")" == uploaded ]] \
            || ow_die "remote asset $name is incomplete; inspect it manually (nothing will be deleted)"
        size="$(stat -c %s "$DIST/$name")"
        [[ "$(jq -r .size <<< "$record")" == "$size" ]] \
            || ow_die "remote asset differs: $name; refusing overwrite, use a new release version"
        digest="$(sha256sum "$DIST/$name" | cut -d' ' -f1)"
        remote_digest="$(ow_upload_remote_hash "$record")"
        [[ "$digest" == "$remote_digest" ]] \
            || ow_die "remote asset differs: $name; refusing overwrite, use a new release version"
        ow_log "SKIP   $name (identical SHA-256)"
    done
}

ow_upload_execute() {
    local name
    # Preparation can take hours. Refresh the early preflight snapshot before
    # deciding what may be skipped or uploaded.
    ow_upload_load_remote
    # Plan the entire upload before the first write, so an existing conflict
    # cannot be discovered only after some new assets were already uploaded.
    ow_upload_plan
    if [[ "$DRY_RUN" == 1 ]]; then
        ow_log "Dry run: ${#UPLOAD_NAMES[@]} missing assets; nothing uploaded"
        return
    fi
    for name in "${UPLOAD_NAMES[@]}"; do
        gh release upload "$TAG" "$DIST/$name" --repo "github.com/$RELEASE_REPO" \
            || ow_die "upload stopped at $name; retry this frozen directory with --upload-only --publish"
    done
    ow_upload_load_remote
    ow_upload_plan
    [[ ${#UPLOAD_NAMES[@]} == 0 ]] || ow_die "post-upload verification found missing assets"
    ow_log "Verified all ${#ASSET_NAMES[@]} remote assets for $RELEASE_REPO $TAG"
    if [[ "$(jq -r .draft "$WORK/remote.json")" == true ]]; then
        ow_log "Release is still a draft; this script does not publish it"
    fi
}
