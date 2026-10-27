#!/usr/bin/env bash
# Sourced by release-assets.sh. Only ASSET_NAMES may be uploaded.

ow_bundle_verify() {
    local dir=$1 version=$2 name archive expected actual manager key filename extra digest size
    local manifest="$dir/chengos-openwrt-manifest.json"
    [[ -d "$dir" ]] || ow_die "prepared directory not found: $dir"
    for name in chengos-openwrt-manifest.json chengos-openwrt-manifest.json.sig chengos-release.pub; do
        [[ -f "$dir/$name" && ! -L "$dir/$name" ]] || ow_die "missing or symlinked asset: $name"
    done
    "$SIGN" verify "$dir/chengos-release.pub" "$manifest" >&2
    jq -e --arg v "$version" --argjson now "$(date +%s)" '
        .schema == 1 and .version == $v and
        (.issued_epoch | type == "number") and (.expires_epoch | type == "number") and
        .issued_epoch <= $now and .expires_epoch > $now and
        .manager.asset == ("chengos-openwrt-manager-v" + $v + ".sh") and
        (.manager.sha256 | test("^[a-f0-9]{64}$")) and
        (.profiles | type == "array" and length > 0) and
        ([.profiles[].id] | length == (unique | length)) and
        all(.profiles[]; . as $p |
            (.id | test("^[a-z0-9][a-z0-9._-]*$")) and
            (.arch == "arm64" or .arch == "amd64") and
            .archive.asset == ("chengos-openwrt-" + .arch + "-v" + $v + ".tar.gz") and
            .postgres.asset == ("chengos-openwrt-pg-" + .id + "-v" + $v + ".tar.gz") and
            (.archive.sha256 | test("^[a-f0-9]{64}$")) and
            (.postgres.sha256 | test("^[a-f0-9]{64}$")) and
            (.archive.size | type == "number") and (.postgres.size | type == "number") and
            any(.postgres.packages[]; .name == "pgsql-server"))
    ' "$manifest" >/dev/null || ow_die "invalid release manifest for $TAG"
    manager="$(jq -r .manager.asset "$manifest")"
    mapfile -t ARCHIVE_NAMES < <(jq -r '[.profiles[].archive.asset] | unique[]' "$manifest")
    mapfile -t PG_NAMES < <(jq -r '[.profiles[].postgres.asset] | unique[]' "$manifest")
    ASSET_NAMES=()
    for name in "${ARCHIVE_NAMES[@]}"; do ASSET_NAMES+=("$name" "$name.sha256"); done
    # Payload first, bootstrap last: never advertise a fresh installer before its dependencies.
    ASSET_NAMES+=("${PG_NAMES[@]}" "$manager" chengos-release.pub
        chengos-openwrt-install.sh.sha256 chengos-openwrt-install.sh.sig
        chengos-openwrt-manifest.json chengos-openwrt-manifest.json.sig chengos-openwrt-install.sh)
    for name in "${ASSET_NAMES[@]}"; do
        [[ -s "$dir/$name" && ! -L "$dir/$name" ]] || ow_die "missing, empty or symlinked asset: $name"
    done
    "$SIGN" verify "$dir/chengos-release.pub" "$dir/chengos-openwrt-install.sh" >&2
    expected="$(jq -r .manager.sha256 "$manifest")"
    [[ "$(sha256sum "$dir/$manager" | cut -d' ' -f1)" == "$expected" ]] || ow_die "manager hash mismatch"
    key="$(sed -n '2p' "$dir/chengos-release.pub")"
    [[ "$key" =~ ^[A-Za-z0-9+/=]+$ ]] || ow_die "invalid release public key"
    for name in "$manager" chengos-openwrt-install.sh; do
        ! grep -q '@CHENGOS_' "$dir/$name" || ow_die "$name has unrendered placeholders"
        grep -Fq "RELEASE_PUBKEY='$key'" "$dir/$name" || ow_die "$name has a different release key"
        grep -Fxq "RELEASE_BASE_URL=\${CHENGOS_RELEASE_BASE_URL:-https://github.com/$RELEASE_REPO/releases}" "$dir/$name" \
            || ow_die "$name points at a different release repository"
        sh -n "$dir/$name"
    done
    while read -r name expected size; do
        actual="$(sha256sum "$dir/$name" | cut -d' ' -f1)"
        [[ "$actual" == "$expected" && "$(stat -c %s "$dir/$name")" == "$size" ]] \
            || ow_die "manifest hash/size mismatch: $name"
    done < <(jq -r '.profiles[] | (.archive, .postgres) | "\(.asset) \(.sha256) \(.size)"' "$manifest")
    for archive in "${ARCHIVE_NAMES[@]}"; do
        actual="$(tar -xzOf "$dir/$archive" chengos-openwrt/VERSION | tr -d '[:space:]')"
        [[ "$actual" == "$version" ]] || ow_die "archive VERSION mismatch: $archive"
        actual="$(tar -xzOf "$dir/$archive" chengos-openwrt/ARCH | tr -d '[:space:]')"
        [[ "$archive" == "chengos-openwrt-${actual}-v${version}.tar.gz" ]] || ow_die "archive ARCH mismatch"
        tar -xzOf "$dir/$archive" chengos-openwrt/chengos-openwrt.sh > "$WORK/archive-manager"
        cmp -s "$WORK/archive-manager" "$dir/$manager" || ow_die "archive manager mismatch: $archive"
    done
    for name in "${ARCHIVE_NAMES[@]}" chengos-openwrt-install.sh; do
        read -r digest filename extra < "$dir/$name.sha256" || ow_die "invalid checksum sidecar: $name"
        [[ -z "$extra" && "${filename#\*}" == "$name" &&
           "$digest" == "$(sha256sum "$dir/$name" | cut -d' ' -f1)" ]] \
            || ow_die "invalid checksum sidecar: $name"
    done
}

ow_bundle_inventory() {
    local dir=$1 name rows='[]' digest size
    for name in "${ASSET_NAMES[@]}"; do
        digest="$(sha256sum "$dir/$name" | cut -d' ' -f1)"
        size="$(stat -c %s "$dir/$name")"
        rows="$(jq --arg n "$name" --arg d "$digest" --argjson s "$size" \
            '. + [{name:$n, sha256:$d, size:$s}]' <<< "$rows")"
    done
    jq -n --arg repo "$RELEASE_REPO" --arg tag "$TAG" --argjson assets "$rows" \
        --argjson sources "$SOURCES" \
        '{schema:1, repo:$repo, tag:$tag, sources:$sources, assets:$assets}' > "$dir/release-assets.json"
}

ow_bundle_verify_inventory() {
    local dir=$1 name expected digest size index="$1/release-assets.json"
    [[ -f "$index" && ! -L "$index" ]] || ow_die "release-assets.json is missing or symlinked; prepare the bundle first"
    jq -e --arg repo "$RELEASE_REPO" --arg tag "$TAG" --argjson count "${#ASSET_NAMES[@]}" '
        .schema == 1 and .repo == $repo and .tag == $tag and
        (.sources | type == "object" and length == 4) and
        all(.sources[]; test("^([a-f0-9]{40}|[a-f0-9]{64})$")) and
        (.assets | length == $count) and
        ([.assets[].name] | length == (unique | length))
    ' "$index" >/dev/null || ow_die "invalid inventory or repo/tag mismatch"
    for name in "${ASSET_NAMES[@]}"; do
        expected="$(jq -r --arg n "$name" '.assets[] | select(.name == $n) | "\(.sha256) \(.size)"' "$index")"
        digest="$(sha256sum "$dir/$name" | cut -d' ' -f1)"
        size="$(stat -c %s "$dir/$name")"
        [[ "$expected" == "$digest $size" ]] || ow_die "frozen bundle changed: $name"
    done
}
