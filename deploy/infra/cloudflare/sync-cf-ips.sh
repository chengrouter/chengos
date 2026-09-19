#!/usr/bin/env bash
#
# Regenerate the nginx trusted-proxy list from Cloudflare's published ranges.
#
# Behind Cloudflare, every connection reaches the origin from a Cloudflare
# address, so $remote_addr is useless for rate limiting and CF-Connecting-IP
# carries the truth. That header is only trustworthy when the peer really is
# Cloudflare, which is what this list pins down.
#
# Cloudflare changes these ranges rarely but does change them. Re-run this after
# a Cloudflare announcement, or on a schedule, and rebuild the frontend images.
#
#   ./sync-cf-ips.sh              # fetch, verify, write both frontends
#   ./sync-cf-ips.sh --check      # fail if the committed files are stale
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TARGETS=(
  "${REPO_ROOT}/chengflow-ui/nginx/realip-cloudflare.conf"
  "${REPO_ROOT}/chengflow-sdk/nginx/realip-cloudflare.conf"
)

CHECK_ONLY=false
[[ "${1:-}" == "--check" ]] && CHECK_ONLY=true

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

fetch() {
  curl -fsS --max-time 20 --retry 2 "$1"
}

echo "Fetching Cloudflare ranges..." >&2
fetch https://www.cloudflare.com/ips-v4 > "$tmp/v4"
fetch https://www.cloudflare.com/ips-v6 > "$tmp/v6"

# A truncated or hijacked response must not silently shrink the trust list:
# too few entries here would leave real client IPs unrecoverable, and a bogus
# entry would hand an outsider the right to set CF-Connecting-IP.
v4_count=$(grep -cE '^[0-9]+(\.[0-9]+){3}/[0-9]+$' "$tmp/v4" || true)
v6_count=$(grep -cE '^[0-9a-fA-F:]+/[0-9]+$' "$tmp/v6" || true)
if (( v4_count < 10 || v6_count < 4 )); then
  echo "Refusing to write: got ${v4_count} IPv4 and ${v6_count} IPv6 ranges, expected more." >&2
  echo "Cloudflare's endpoint may be blocked or returning an error page." >&2
  exit 1
fi

{
  echo "# Cloudflare trusted-proxy list — GENERATED, do not edit by hand."
  echo "#"
  echo "# Regenerate with deploy/infra/cloudflare/sync-cf-ips.sh."
  echo "# Source: https://www.cloudflare.com/ips-v4 and .../ips-v6"
  echo "# Fetched: $(date -u +%Y-%m-%d)"
  echo "#"
  echo "# Activated by TRUST_CLOUDFLARE=true, which makes the entrypoint install"
  echo "# this file as /etc/nginx/chengos/realip.conf. Pair it with an origin"
  echo "# firewall that accepts nothing but Cloudflare, or the whole edge can be"
  echo "# bypassed by connecting to the origin IP directly."
  echo "#"
  echo "# The private ranges come first and are NOT optional. In the standard"
  echo "# Compose deployment the container binds to 127.0.0.1 and a host reverse"
  echo "# proxy faces the internet, so this nginx never sees a Cloudflare address"
  echo "# as its peer — it sees the Docker bridge. Trusting only Cloudflare here"
  echo "# would silently disable real_ip and collapse every visitor into one"
  echo "# rate-limit bucket. The Cloudflare ranges below cover the other topology,"
  echo "# where Cloudflare reaches this container directly."
  echo "#"
  echo "# Trusting private peers is safe precisely because the port is not public:"
  echo "# a direct caller from the internet is in neither list, so its forged"
  echo "# CF-Connecting-IP is ignored and it is keyed on its real address."
  echo
  echo "set_real_ip_from 127.0.0.0/8;"
  echo "set_real_ip_from 10.0.0.0/8;"
  echo "set_real_ip_from 172.16.0.0/12;"
  echo "set_real_ip_from 192.168.0.0/16;"
  echo
  # `|| [[ -n "$cidr" ]]` matters: Cloudflare serves these lists without a
  # trailing newline, and a plain `while read` silently drops the last range.
  while read -r cidr || [[ -n "$cidr" ]]; do
    [[ -z "${cidr//[[:space:]]/}" ]] && continue
    echo "set_real_ip_from ${cidr//[[:space:]]/};"
  done < "$tmp/v4"
  echo
  while read -r cidr || [[ -n "$cidr" ]]; do
    [[ -z "${cidr//[[:space:]]/}" ]] && continue
    echo "set_real_ip_from ${cidr//[[:space:]]/};"
  done < "$tmp/v6"
  echo
  echo "# CF-Connecting-IP is a single address written by Cloudflare itself, and"
  echo "# it replaces whatever the client sent. X-Forwarded-For is not used here:"
  echo "# Cloudflare appends to the client's value rather than replacing it."
  echo "real_ip_header CF-Connecting-IP;"
} > "$tmp/out.conf"

# Every range that survived validation must have reached the output. This
# catches a silently dropped entry, which would leave some Cloudflare edge
# nodes untrusted and their visitors' IPs unrecoverable.
# +4 for the private ranges emitted above, which are not part of the fetched
# lists but are required for the proxied-container topology.
written=$(grep -c '^set_real_ip_from' "$tmp/out.conf" || true)
if (( written != v4_count + v6_count + 4 )); then
  echo "Refusing to write: emitted ${written} ranges but expected $((v4_count + v6_count + 4))." >&2
  exit 1
fi

status=0
for target in "${TARGETS[@]}"; do
  if $CHECK_ONLY; then
    if ! diff -q <(grep -v '^# Fetched:' "$target" 2>/dev/null) \
                 <(grep -v '^# Fetched:' "$tmp/out.conf") >/dev/null 2>&1; then
      echo "STALE: $target" >&2
      status=1
    else
      echo "up to date: $target" >&2
    fi
  else
    mkdir -p "$(dirname "$target")"
    cp "$tmp/out.conf" "$target"
    echo "wrote: $target (${v4_count} IPv4, ${v6_count} IPv6)" >&2
  fi
done
exit $status
