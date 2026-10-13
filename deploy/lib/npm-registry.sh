# shellcheck shell=bash
#
# Direct npm registry provisioning without Node/npm (deployment plan §6.2).
#
# Sourced, never executed. Fetches registry metadata and one platform tarball
# over HTTPS, verifies the tarball's SHA-512 `dist.integrity` and the registry's
# ECDSA signature against keys PINNED in npm-registry-keys.json (never keys
# fetched at install time), validates the archive before extracting it, and
# never runs anything from the package.
#
# Test hook: CHENGOS_NPM_TEST_INSECURE=1 additionally allows a file:// registry
# (CHENGOS_NPM_REGISTRY) and a replacement key file (CHENGOS_NPM_REGISTRY_KEYS).
# Neither is honoured otherwise.

# shellcheck disable=SC2034  # NPMR_* results are read by the provider adapters
NPMR_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
: "${CHENGOS_NPM_REGISTRY:=https://registry.npmjs.org}"
NPMR_REGISTRY="${CHENGOS_NPM_REGISTRY%/}"
NPMR_KEYS="${NPMR_LIB_DIR}/npm-registry-keys.json"
if [[ "${CHENGOS_NPM_TEST_INSECURE:-0}" == "1" && -n "${CHENGOS_NPM_REGISTRY_KEYS:-}" ]]; then
    NPMR_KEYS="$CHENGOS_NPM_REGISTRY_KEYS"
fi

npmr_err() { printf 'ERROR: %s\n' "$*" >&2; }

# Bootstrap tools this module needs. Prints the missing ones, one per line.
npmr_missing_tools() {
    local tool
    for tool in curl tar gzip openssl base64 sha256sum python3; do
        command -v "$tool" >/dev/null 2>&1 || printf '%s\n' "$tool"
    done
}

npmr_py() {
    python3 -I "${NPMR_LIB_DIR}/npm_registry.py" "$@"
}

_npmr_registry_host() {
    local url="$1"
    url="${url#*://}"
    printf '%s' "${url%%/*}"
}

# _npmr_check_url URL — HTTPS on the configured registry host, or (test hook
# only) a file:// URL.
_npmr_check_url() {
    local url="$1"
    case "$url" in
        https://*)
            if [[ "$NPMR_REGISTRY" != https://* ]]; then
                npmr_err "registry ${NPMR_REGISTRY} is not HTTPS"
                return 1
            fi
            if [[ "$(_npmr_registry_host "$url")" != "$(_npmr_registry_host "$NPMR_REGISTRY")" ]]; then
                npmr_err "refusing ${url}: not on the configured registry host"
                return 1
            fi
            ;;
        file://*)
            if [[ "${CHENGOS_NPM_TEST_INSECURE:-0}" != "1" ]]; then
                npmr_err "refusing non-HTTPS URL ${url}"
                return 1
            fi
            ;;
        *)
            npmr_err "refusing non-HTTPS URL ${url}"
            return 1
            ;;
    esac
}

# npmr_fetch URL OUT — no redirects are followed; anything but a direct 200 is
# a failure (a redirect to another host must never be trusted silently).
npmr_fetch() {
    local url="$1" out="$2" code
    _npmr_check_url "$url" || return 1
    if [[ "$url" == file://* ]]; then
        curl -fsS "$url" -o "$out" || { npmr_err "cannot read ${url}"; return 1; }
        return 0
    fi
    code="$(curl -sS --proto '=https' --tlsv1.2 --max-time "${CHENGOS_NPM_TIMEOUT:-600}" \
        -w '%{http_code}' -o "$out" "$url")" || { npmr_err "download failed: ${url}"; return 1; }
    if [[ "$code" != "200" ]]; then
        npmr_err "unexpected HTTP ${code} for ${url} (redirects are not followed)"
        return 1
    fi
}

# npmr_fetch_packument NAME OUT
npmr_fetch_packument() {
    local name="$1" out="$2"
    npmr_fetch "${NPMR_REGISTRY}/${name//\//%2f}" "$out"
}

# npmr_resolve PACKUMENT PLATFORM MIN_AGE_DAYS SELECTOR
# Sets NPMR_VERSION, NPMR_PLATFORM_VERSION, NPMR_PUBLISHED, NPMR_AGE_DAYS,
# NPMR_WITHIN_WINDOW, NPMR_TARBALL, NPMR_INTEGRITY, NPMR_ATTESTATIONS and the
# array NPMR_SIGS ("keyid sig" entries).
npmr_resolve() {
    local packument="$1" platform="$2" min_age="$3" selector="$4"
    local output line key value
    output="$(npmr_py resolve "$packument" "$platform" "$min_age" "$(date -u +%s)" "$selector")" || return 1
    NPMR_VERSION="" NPMR_PLATFORM_VERSION="" NPMR_PUBLISHED="" NPMR_AGE_DAYS=""
    NPMR_WITHIN_WINDOW="" NPMR_TARBALL="" NPMR_INTEGRITY="" NPMR_ATTESTATIONS=""
    NPMR_SIGS=()
    while IFS= read -r line; do
        key="${line%%=*}"
        value="${line#*=}"
        case "$key" in
            version) NPMR_VERSION="$value" ;;
            platform_version) NPMR_PLATFORM_VERSION="$value" ;;
            published) NPMR_PUBLISHED="$value" ;;
            age_days) NPMR_AGE_DAYS="$value" ;;
            within_window) NPMR_WITHIN_WINDOW="$value" ;;
            tarball) NPMR_TARBALL="$value" ;;
            integrity) NPMR_INTEGRITY="$value" ;;
            attestations) NPMR_ATTESTATIONS="$value" ;;
            sig) NPMR_SIGS+=("$value") ;;
        esac
    done <<< "$output"
    [[ -n "$NPMR_VERSION" && -n "$NPMR_TARBALL" && -n "$NPMR_INTEGRITY" ]]
}

# npmr_verify_integrity FILE SRI — SRI is "sha512-<base64>".
npmr_verify_integrity() {
    local file="$1" sri="$2" actual
    actual="sha512-$(openssl dgst -sha512 -binary "$file" | base64 -w0)"
    if [[ "$actual" != "$sri" ]]; then
        npmr_err "integrity mismatch for $(basename "$file")"
        return 1
    fi
}

# npmr_verify_signature NAME PLATFORM_VERSION SRI PUBLISHED
# Succeeds when at least one registry signature over
# "<name>@<version>:<integrity>" verifies against a pinned key that was valid
# at publication. Sets NPMR_SIGNING_KEYID.
npmr_verify_signature() {
    local name="$1" version="$2" sri="$3" published="$4"
    local work entry keyid sig reasons=""
    NPMR_SIGNING_KEYID=""
    if [[ ${#NPMR_SIGS[@]} -eq 0 ]]; then
        npmr_err "the registry metadata carries no signature for ${name}@${version}"
        return 1
    fi
    work="$(mktemp -d)" || return 1
    printf '%s@%s:%s' "$name" "$version" "$sri" > "${work}/message"
    for entry in "${NPMR_SIGS[@]}"; do
        keyid="${entry%% *}"
        sig="${entry#* }"
        if ! npmr_py key-pem "$NPMR_KEYS" "$keyid" "$published" > "${work}/key.pem" 2> "${work}/why"; then
            reasons+="$(cat "${work}/why"); "
            continue
        fi
        if ! printf '%s' "$sig" | base64 -d > "${work}/sig" 2>/dev/null; then
            reasons+="undecodable signature from ${keyid}; "
            continue
        fi
        if openssl dgst -sha256 -verify "${work}/key.pem" -signature "${work}/sig" "${work}/message" >/dev/null 2>&1; then
            NPMR_SIGNING_KEYID="$keyid"
            rm -rf "$work"
            return 0
        fi
        reasons+="signature by ${keyid} does not verify; "
    done
    rm -rf "$work"
    npmr_err "registry signature check failed for ${name}@${version}: ${reasons%; }"
    return 1
}

# npmr_extract TGZ TARGET STAGING — validates every entry first, then extracts
# into STAGING (which must be empty) without preserving archive ownership.
npmr_extract() {
    local tgz="$1" target="$2" staging="$3"
    npmr_py check-archive "$tgz" "$target" >/dev/null || return 1
    tar -xzf "$tgz" -C "$staging" --no-same-owner --no-same-permissions \
        || { npmr_err "extraction failed"; return 1; }
}
