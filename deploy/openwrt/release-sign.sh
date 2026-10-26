#!/usr/bin/env bash
#
# usign-compatible release signing for the OpenWrt assets, with OpenSSL only
# (usign itself is rarely installed on a workstation or CI runner).
#
# usign/signify files are a comment line plus one base64 line:
#   public key: "Ed" | fingerprint[8] | ed25519 public key[32]
#   signature:  "Ed" | fingerprint[8] | ed25519 signature[64]
# The private key stays an OpenSSL Ed25519 PEM; the fingerprint is the first
# 8 bytes of SHA-512 over the public key, so it is derived, never stored.
#
# Usage:
#   release-sign.sh keygen KEY.pem PUB      new private key + its usign public key
#   release-sign.sh pubkey KEY.pem          print the usign public key file
#   release-sign.sh sign KEY.pem FILE [SIG] write FILE's signature (default FILE.sig)
#   release-sign.sh verify PUB FILE [SIG]   check FILE (usign when installed)
#   release-sign.sh render PUB FILE...      put the key into @CHENGOS_RELEASE_PUBKEY@
set -euo pipefail

die() { printf '[release-sign] ERROR: %s\n' "$*" >&2; exit 1; }
usage() { sed -n '2,18p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

raw_pubkey() { openssl pkey -in "$1" -pubout -outform DER | tail -c 32; }
fingerprint() { openssl dgst -sha512 -binary | head -c 8; }
hex() { od -An -tx1 -v | tr -d ' \n'; }

# b64_line FILE: the payload line of a usign file, decoded.
b64_payload() { sed -n '2p' "$1" | base64 -d; }

cmd_pubkey() {
    local key=$1
    [[ -f "$key" ]] || die "no key $key"
    raw_pubkey "$key" > "$TMP/pub.raw"
    [[ "$(wc -c < "$TMP/pub.raw")" -eq 32 ]] || die "$key is not an Ed25519 key"
    fingerprint < "$TMP/pub.raw" > "$TMP/fp"
    printf 'untrusted comment: ChengOS release key %s\n' "$(hex < "$TMP/fp")"
    { printf 'Ed'; cat "$TMP/fp" "$TMP/pub.raw"; } | base64 -w0
    printf '\n'
}

cmd_keygen() {
    local key=$1 pub=$2
    [[ ! -e "$key" ]] || die "$key exists; refusing to overwrite a signing key"
    (umask 077 && openssl genpkey -algorithm ed25519 -out "$key")
    cmd_pubkey "$key" > "$pub"
    printf 'private key: %s (keep offline)\npublic key:  %s\n' "$key" "$pub" >&2
}

cmd_sign() {
    local key=$1 file=$2 sig=${3:-$2.sig}
    [[ -f "$file" ]] || die "no file $file"
    raw_pubkey "$key" | fingerprint > "$TMP/fp"
    openssl pkeyutl -sign -inkey "$key" -rawin -in "$file" -out "$TMP/sig.raw"
    [[ "$(wc -c < "$TMP/sig.raw")" -eq 64 ]] || die "unexpected signature size"
    {
        printf 'untrusted comment: signed by ChengOS release key %s\n' "$(hex < "$TMP/fp")"
        { printf 'Ed'; cat "$TMP/fp" "$TMP/sig.raw"; } | base64 -w0
        printf '\n'
    } > "$sig"
}

cmd_verify() {
    local pub=$1 file=$2 sig=${3:-$2.sig}
    [[ -f "$file" && -f "$sig" && -f "$pub" ]] || die "verify needs PUB, FILE and SIG"
    if [[ "${RELEASE_SIGN_NO_USIGN:-0}" != 1 ]] && command -v usign >/dev/null 2>&1; then
        usign -V -q -m "$file" -p "$pub" -x "$sig"
        return
    fi
    b64_payload "$pub" > "$TMP/pub.bin" 2>/dev/null || return 1
    b64_payload "$sig" > "$TMP/sig.bin" 2>/dev/null || return 1
    [[ "$(wc -c < "$TMP/pub.bin")" -eq 42 && "$(head -c 2 "$TMP/pub.bin")" == Ed ]] || return 1
    [[ "$(wc -c < "$TMP/sig.bin")" -eq 74 && "$(head -c 2 "$TMP/sig.bin")" == Ed ]] || return 1
    # Same key as signed it.
    [[ "$(head -c 10 "$TMP/pub.bin" | tail -c 8 | hex)" == "$(head -c 10 "$TMP/sig.bin" | tail -c 8 | hex)" ]] || return 1
    { printf '\x30\x2a\x30\x05\x06\x03\x2b\x65\x70\x03\x21\x00'; tail -c 32 "$TMP/pub.bin"; } > "$TMP/pub.der"
    tail -c 64 "$TMP/sig.bin" > "$TMP/sig.raw"
    openssl pkeyutl -verify -pubin -inkey "$TMP/pub.der" -keyform DER -rawin \
        -in "$file" -sigfile "$TMP/sig.raw" >/dev/null 2>&1
}

cmd_render() {
    local pub=$1; shift
    local line
    line="$(sed -n '2p' "$pub")"
    [[ "$line" =~ ^[A-Za-z0-9+/=]+$ ]] || die "$pub is not a usign public key"
    for f in "$@"; do
        grep -q '@CHENGOS_RELEASE_PUBKEY@' "$f" || die "$f has no key placeholder"
        sed -i "s#@CHENGOS_RELEASE_PUBKEY@#${line}#" "$f"
    done
}

case "${1:-}" in
    keygen) [[ $# -eq 3 ]] || { usage >&2; exit 2; }; cmd_keygen "$2" "$3" ;;
    pubkey) [[ $# -eq 2 ]] || { usage >&2; exit 2; }; cmd_pubkey "$2" ;;
    sign)   [[ $# -ge 3 ]] || { usage >&2; exit 2; }; cmd_sign "$2" "$3" "${4:-$3.sig}" ;;
    verify) [[ $# -ge 3 ]] || { usage >&2; exit 2; }; cmd_verify "$2" "$3" "${4:-$3.sig}" ;;
    render) [[ $# -ge 3 ]] || { usage >&2; exit 2; }; cmd_render "${@:2}" ;;
    -h|--help) usage ;;
    *) usage >&2; exit 2 ;;
esac
