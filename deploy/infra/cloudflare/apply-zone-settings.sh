#!/usr/bin/env bash
#
# Push the ChengOS edge policy to a Cloudflare zone. Everything here fits the
# free plan.
#
# What it does, and why each piece is worth a request:
#
#   TLS + HSTS          Cloudflare terminates TLS, so the origin's HSTS header
#                       never reaches a first-time visitor on http. Set it here.
#   Bot Fight Mode      Challenges the automated traffic before it costs you
#                       bandwidth or an origin round trip.
#   WAF custom rules    Blocks the exact probe shapes in the access log at the
#                       edge, so the origin never sees them.
#   Rate limiting       One free rule, aimed at the login endpoint.
#
# Requires an API token (My Profile > API Tokens > Create Token) with, for the
# target zone: Zone:Read, Zone Settings:Edit, Zone WAF:Edit, and — for Bot
# Fight Mode — Bot Management:Edit. A missing scope fails only that step.
#
# Usage:
#   export CLOUDFLARE_API_TOKEN=...
#   ./apply-zone-settings.sh --zone chengos.example.com
#   ./apply-zone-settings.sh --zone chengos.example.com --dry-run
#
# Nothing here is destructive to DNS or to your records. The WAF and rate-limit
# steps DO replace the zone's custom-rule sets wholesale, which is how
# Cloudflare's entrypoint-ruleset API works — run --dry-run first if you have
# rules you added by hand.
#
set -uo pipefail

API="https://api.cloudflare.com/client/v4"
ZONE_NAME=""
DRY_RUN=false
RL_PERIOD=10
RL_REQUESTS=5
SKIP_WAF=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --zone)         ZONE_NAME="$2"; shift 2 ;;
    --dry-run)      DRY_RUN=true; shift ;;
    --skip-waf)     SKIP_WAF=true; shift ;;
    --rl-period)    RL_PERIOD="$2"; shift 2 ;;
    --rl-requests)  RL_REQUESTS="$2"; shift 2 ;;
    -h|--help)      sed -n '2,40p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

[[ -n "$ZONE_NAME" ]] || { echo "--zone <domain> is required" >&2; exit 2; }
[[ -n "${CLOUDFLARE_API_TOKEN:-}" ]] || { echo "CLOUDFLARE_API_TOKEN is not set" >&2; exit 2; }
command -v jq >/dev/null || { echo "jq is required" >&2; exit 2; }

ok=0
failed=0

# Call the API and report per-step rather than aborting: a token missing one
# scope should still get you every other setting applied, and the Cloudflare
# error text is far more useful than a generic non-zero exit.
cf() {
  local method="$1" path="$2" body="${3:-}"
  if $DRY_RUN; then
    echo "    DRY RUN ${method} ${path}"
    [[ -n "$body" ]] && echo "$body" | jq -c . | sed 's/^/            /'
    return 0
  fi
  local args=(-sS -X "$method" "${API}${path}"
              -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
              -H "Content-Type: application/json")
  [[ -n "$body" ]] && args+=(--data "$body")
  curl "${args[@]}"
}

step() {
  local label="$1" method="$2" path="$3" body="${4:-}"
  printf '  %-42s ' "$label"
  # Not captured on a dry run: the point of --dry-run is to read the request.
  if $DRY_RUN; then
    echo
    cf "$method" "$path" "$body"
    return 0
  fi
  local out
  out="$(cf "$method" "$path" "$body")"
  if [[ "$(echo "$out" | jq -r '.success // false')" == "true" ]]; then
    echo "ok"; ok=$((ok + 1))
  else
    echo "FAILED"
    echo "$out" | jq -r '.errors[]? | "      \(.code): \(.message)"' 2>/dev/null \
      || echo "      $out"
    failed=$((failed + 1))
  fi
}

echo "Resolving zone ${ZONE_NAME}..."
zone_json="$(cf GET "/zones?name=${ZONE_NAME}")"
if $DRY_RUN; then
  ZONE_ID="<zone-id>"
else
  ZONE_ID="$(echo "$zone_json" | jq -r '.result[0].id // empty')"
  if [[ -z "$ZONE_ID" ]]; then
    echo "Could not resolve zone. API said:" >&2
    echo "$zone_json" | jq -r '.errors[]? | "  \(.code): \(.message)"' 2>/dev/null || echo "$zone_json" >&2
    exit 1
  fi
  PLAN="$(echo "$zone_json" | jq -r '.result[0].plan.name // "unknown"')"
  echo "  zone ${ZONE_ID} (plan: ${PLAN})"
fi

echo
echo "TLS and transport"
step "SSL mode: full (strict)"      PATCH "/zones/${ZONE_ID}/settings/ssl"                    '{"value":"strict"}'
step "Always Use HTTPS"             PATCH "/zones/${ZONE_ID}/settings/always_use_https"       '{"value":"on"}'
step "Automatic HTTPS Rewrites"     PATCH "/zones/${ZONE_ID}/settings/automatic_https_rewrites" '{"value":"on"}'
step "Minimum TLS version 1.2"      PATCH "/zones/${ZONE_ID}/settings/min_tls_version"        '{"value":"1.2"}'
step "TLS 1.3"                      PATCH "/zones/${ZONE_ID}/settings/tls_1_3"                '{"value":"on"}'
# Cloudflare answers the first request on a new connection, so the origin's own
# HSTS header is invisible to a visitor arriving over http. This is the copy
# that actually reaches them.
step "HSTS (1 year, includeSubDomains)" PATCH "/zones/${ZONE_ID}/settings/security_header" \
  '{"value":{"strict_transport_security":{"enabled":true,"max_age":31536000,"include_subdomains":true,"nosniff":true}}}'

echo
echo "Bot and threat posture"
step "Bot Fight Mode"               PUT   "/zones/${ZONE_ID}/bot_management"                  '{"fight_mode":true}'
step "Browser Integrity Check"      PATCH "/zones/${ZONE_ID}/settings/browser_check"          '{"value":"on"}'
step "Security level: medium"       PATCH "/zones/${ZONE_ID}/settings/security_level"         '{"value":"medium"}'

if ! $SKIP_WAF; then
echo
echo "WAF custom rules (replaces the zone's custom ruleset)"
# The free plan has no regex operator, so these are `contains` / `ends_with`
# chains rather than one pattern.
waf_rules="$(jq -n '{
  rules: [
    {
      description: "ChengOS: block secret and infrastructure file probes",
      action: "block",
      expression: (
        "(http.request.uri.path contains \".env\") or " +
        "(http.request.uri.path contains \".git/\") or " +
        "(http.request.uri.path contains \".svn/\") or " +
        "(http.request.uri.path contains \".aws/\") or " +
        "(http.request.uri.path contains \".ssh/\") or " +
        "(http.request.uri.path contains \"credentials\") or " +
        "(http.request.uri.path contains \"/secrets\") or " +
        "(http.request.uri.path contains \".tfstate\") or " +
        "(http.request.uri.path contains \"docker-compose\") or " +
        "(http.request.uri.path contains \"id_rsa\")"
      )
    },
    {
      description: "ChengOS: block CMS and server-language probes",
      action: "block",
      expression: (
        "(http.request.uri.path contains \"wp-\") or " +
        "(http.request.uri.path contains \"wordpress\") or " +
        "(http.request.uri.path contains \"xmlrpc\") or " +
        "(http.request.uri.path ends_with \".php\") or " +
        "(http.request.uri.path ends_with \".asp\") or " +
        "(http.request.uri.path ends_with \".aspx\") or " +
        "(http.request.uri.path ends_with \".jsp\") or " +
        "(http.request.uri.path ends_with \".cgi\") or " +
        "(http.request.uri.path ends_with \".map\")"
      )
    },
    {
      description: "ChengOS: block crawler impersonation",
      action: "block",
      # cf.client.bot is true only for bots Cloudflare has verified by reverse
      # DNS. The scan in the access log wore GPTBot, ClaudeBot, Applebot and
      # Amazonbot user agents from a single unrelated address, so this blocks
      # the impersonators while the genuine crawlers pass untouched.
      expression: (
        "(not cf.client.bot) and (" +
        "(http.user_agent contains \"GPTBot\") or " +
        "(http.user_agent contains \"ClaudeBot\") or " +
        "(http.user_agent contains \"Claude-SearchBot\") or " +
        "(http.user_agent contains \"Claude-User\") or " +
        "(http.user_agent contains \"Amazonbot\") or " +
        "(http.user_agent contains \"Applebot\") or " +
        "(http.user_agent contains \"Google-Extended\") or " +
        "(http.user_agent contains \"Perplexity\") or " +
        "(http.user_agent contains \"LinkedInBot\") or " +
        "(http.user_agent contains \"TelegramBot\")" +
        ")"
      )
    }
  ]
}')"
step "custom firewall ruleset" PUT \
  "/zones/${ZONE_ID}/rulesets/phases/http_request_firewall_custom/entrypoint" "$waf_rules"

echo
echo "Rate limiting (free plan allows one rule)"
rl_rules="$(jq -n --argjson period "$RL_PERIOD" --argjson requests "$RL_REQUESTS" '{
  rules: [
    {
      description: "ChengOS: throttle credential endpoints",
      action: "block",
      # Deliberately not the whole /api/v1/auth/ prefix: the device-flow
      # endpoint is polled on a timer during a normal login and would trip it.
      expression: (
        "(http.request.uri.path eq \"/api/v1/auth/login\") or " +
        "(http.request.uri.path eq \"/api/v1/auth/register\")"
      ),
      ratelimit: {
        characteristics: ["ip.src", "cf.colo.id"],
        period: $period,
        requests_per_period: $requests,
        mitigation_timeout: $period
      }
    }
  ]
}')"
step "rate limit ruleset" PUT \
  "/zones/${ZONE_ID}/rulesets/phases/http_ratelimit/entrypoint" "$rl_rules"
fi

echo
if $DRY_RUN; then
  echo "Dry run complete — nothing was sent."
  exit 0
fi
echo "Applied ${ok} settings, ${failed} failed."
echo
echo "Two things this script cannot do for you:"
echo "  1. Set the DNS records for ${ZONE_NAME} to Proxied (orange cloud)."
echo "     Grey-clouded records bypass every rule above."
echo "  2. Close the origin to everything but Cloudflare. Until you do, the"
echo "     origin IP still answers direct scans. Run ./origin-firewall.sh."
[[ $failed -eq 0 ]]
