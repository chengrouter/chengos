#!/usr/bin/env bash
#
# Close the origin's HTTP ports to everything except Cloudflare.
#
# Without this, the edge policy is advisory: anyone who learns the origin IP
# (old DNS records, certificate transparency logs, a leaked header) can skip
# Cloudflare entirely and scan you directly, which is exactly what the traffic
# in the access log was doing. This is the step that makes the bandwidth saving
# real rather than nominal.
#
# Prints the rules by default. Applying them is opt-in, because a firewall
# change on a remote host is the kind of mistake you cannot fix remotely.
#
#   ./origin-firewall.sh                     # show the rules
#   ./origin-firewall.sh --backend nft       # show nftables form
#   ./origin-firewall.sh --apply             # actually apply (asks first)
#
# SSH is never touched. Only the ports named by --ports are affected.
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
CF_CONF="${REPO_ROOT}/chengflow-ui/nginx/realip-cloudflare.conf"

BACKEND="ufw"
PORTS="80,443"
APPLY=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --backend) BACKEND="$2"; shift 2 ;;
    --ports)   PORTS="$2"; shift 2 ;;
    --apply)   APPLY=true; shift ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

if [[ ! -f "$CF_CONF" ]]; then
  echo "Missing ${CF_CONF}. Run ./sync-cf-ips.sh first." >&2
  exit 1
fi

# realip-cloudflare.conf also lists RFC1918 ranges, because inside the
# container the trusted peer is the Docker bridge rather than Cloudflare. A
# firewall has no use for them: this rule set guards the host's public ports, so
# it allows Cloudflare and loopback and nothing else.
mapfile -t CIDRS < <(sed -n 's/^set_real_ip_from \(.*\);$/\1/p' "$CF_CONF" \
  | grep -vE '^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)')
if (( ${#CIDRS[@]} < 20 )); then
  echo "Only ${#CIDRS[@]} ranges parsed from ${CF_CONF} — refusing to build a" >&2
  echo "firewall from an incomplete list. Re-run ./sync-cf-ips.sh." >&2
  exit 1
fi

gen_ufw() {
  echo "# Allow Cloudflare to reach ${PORTS}, deny everyone else."
  for cidr in "${CIDRS[@]}"; do
    echo "ufw allow proto tcp from ${cidr} to any port ${PORTS} comment 'cloudflare'"
  done
  echo "ufw deny proto tcp from any to any port ${PORTS}"
}

gen_nft() {
  cat <<EOF
# nftables: add to /etc/nftables.conf inside your inet filter table.
table inet cloudflare_origin {
  set cf_v4 {
    type ipv4_addr
    flags interval
    elements = { $(printf '%s, ' "${CIDRS[@]}" | tr ' ' '\n' | grep -v ':' | tr -d '\n' | sed 's/,$//') }
  }
  set cf_v6 {
    type ipv6_addr
    flags interval
    elements = { $(printf '%s, ' "${CIDRS[@]}" | tr ' ' '\n' | grep ':' | tr -d '\n' | sed 's/,$//') }
  }
  chain input {
    type filter hook input priority 0; policy accept;
    tcp dport { ${PORTS//,/, } } ip  saddr @cf_v4 accept
    tcp dport { ${PORTS//,/, } } ip6 saddr @cf_v6 accept
    tcp dport { ${PORTS//,/, } } drop
  }
}
EOF
}

case "$BACKEND" in
  ufw) RULES="$(gen_ufw)" ;;
  nft) RULES="$(gen_nft)" ;;
  *)   echo "--backend must be ufw or nft" >&2; exit 2 ;;
esac

echo "$RULES"

$APPLY || {
  echo
  echo "# ${#CIDRS[@]} Cloudflare ranges. Nothing was applied — re-run with --apply."
  exit 0
}

if [[ "$BACKEND" != "ufw" ]]; then
  echo >&2
  echo "--apply only automates the ufw backend. Merge the nftables rules above" >&2
  echo "into /etc/nftables.conf yourself and reload." >&2
  exit 2
fi

cat >&2 <<EOF

About to close ports ${PORTS} to everything but Cloudflare on THIS host.
If your DNS records are not Proxied (orange cloud), this takes the site offline.
SSH is not affected.
EOF
read -r -p "Type the ports to confirm (${PORTS}): " confirm
[[ "$confirm" == "$PORTS" ]] || { echo "Aborted." >&2; exit 1; }

command -v ufw >/dev/null || { echo "ufw is not installed." >&2; exit 1; }
echo "$RULES" | grep -v '^#' | while read -r rule; do
  [[ -z "$rule" ]] && continue
  echo "+ $rule"
  eval "$rule"
done
echo "Done. Verify from outside with: curl -sv --max-time 5 http://<origin-ip>/"
