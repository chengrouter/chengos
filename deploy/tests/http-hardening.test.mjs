/**
 * Unit tests for deploy/bin/lib/http-hardening.js.
 *
 * The trusted-proxy rules get their own file because their failure mode is
 * silent. A proxy that is not trusted does not error: it makes every visitor
 * look like the proxy, so one rate-limit bucket serves the whole internet and
 * nothing in the logs says so.
 *
 * Run with:  node --test deploy/tests/http-hardening.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const H = require(join(dirname(fileURLToPath(import.meta.url)), "..", "bin", "lib", "http-hardening.js"));

const req = (peer, headers = {}) => ({ socket: { remoteAddress: peer }, headers });
const quiet = () => {};

test("a proxy on this host or private network is trusted without configuration", () => {
  for (const peer of ["127.0.0.1", "::1", "::ffff:127.0.0.1", "10.0.0.5", "172.17.0.1", "192.168.1.9"]) {
    assert.equal(
      H.clientIp(req(peer, { "x-forwarded-for": "203.0.113.9" })),
      "203.0.113.9",
      `${peer} should have been trusted`
    );
  }
});

test("an untrusted peer's forwarding header is ignored", () => {
  // Straight off the internet: whatever it claims, it is keyed on its own
  // address, so forging the header cannot mint extra buckets.
  const ip = H.clientIp(req("45.77.9.9", { "x-forwarded-for": "203.0.113.9" }));
  assert.equal(ip, "45.77.9.9");
});

test("a proxy on a separate VPS is trusted once listed", () => {
  const trustedProxies = H.parseTrustedProxies("45.77.1.2", quiet);
  assert.equal(
    H.clientIp(req("45.77.1.2", { "x-forwarded-for": "203.0.113.9" }), { trustedProxies }),
    "203.0.113.9"
  );
  // A neighbour on the same provider is not the same host.
  assert.equal(
    H.clientIp(req("45.77.1.3", { "x-forwarded-for": "203.0.113.9" }), { trustedProxies }),
    "45.77.1.3"
  );
});

test("CIDR blocks match, in both address families", () => {
  // Public ranges on purpose: an RFC1918 block would pass through the implicit
  // private-peer rule and the CIDR arithmetic would never be exercised.
  // 100.64.0.0/10 is the CGNAT space Tailscale hands out — not RFC1918, so a
  // mesh-VPN proxy genuinely has to be listed.
  const trustedProxies = H.parseTrustedProxies("100.64.0.0/10, 2001:db8::/32", quiet);
  assert.ok(H.isTrustedPeer("100.100.1.5", trustedProxies));
  assert.ok(!H.isTrustedPeer("45.77.9.9", trustedProxies));
  assert.ok(H.isTrustedPeer("2001:db8::5", trustedProxies));
  assert.ok(!H.isTrustedPeer("2001:dead::5", trustedProxies));
  // An IPv4 address must never match an IPv6 block just because the integers
  // happen to line up.
  assert.ok(!H.isTrustedPeer("45.77.1.2", H.parseTrustedProxies("::/0", quiet)));
});

test("an unparseable entry is dropped, never widened into a match-all", () => {
  const warnings = [];
  const trustedProxies = H.parseTrustedProxies("garbage, 1.2.3.4/99, 45.77.1.2", (m) => warnings.push(m));
  assert.equal(trustedProxies.length, 1);
  assert.equal(warnings.length, 2);
  assert.ok(!H.isTrustedPeer("8.8.8.8", trustedProxies));
});

test("the last x-forwarded-for entry wins, so a forged prefix is inert", () => {
  // The proxy appends, so only the tail is written by something we trust.
  const a = H.clientIp(req("10.0.0.5", { "x-forwarded-for": "1.2.3.4, 203.0.113.9" }));
  const b = H.clientIp(req("10.0.0.5", { "x-forwarded-for": "9.9.9.9, 203.0.113.9" }));
  assert.equal(a, "203.0.113.9");
  assert.equal(a, b);
});

test("CF-Connecting-IP is read only when Cloudflare is trusted", () => {
  const headers = { "cf-connecting-ip": "203.0.113.9", "x-forwarded-for": "1.2.3.4, 172.70.1.1" };
  assert.equal(H.clientIp(req("10.0.0.5", headers)), "172.70.1.1");
  assert.equal(H.clientIp(req("10.0.0.5", headers), { trustCloudflare: true }), "203.0.113.9");
});

test("proxyHeaders overwrites X-Real-IP and appends to X-Forwarded-For", () => {
  const h = H.proxyHeaders(req("10.0.0.5", { "x-forwarded-for": "1.2.3.4" }), "203.0.113.9", "api:3000");
  assert.equal(h["x-real-ip"], "203.0.113.9");
  assert.equal(h["x-forwarded-for"], "1.2.3.4, 203.0.113.9");
  assert.equal(h.host, "api:3000");
});

test("a `..` segment is refused rather than normalised away", () => {
  // Normalising keeps the read inside the root but reports 404, which hides the
  // attempt. Callers rely on a refusal here.
  assert.equal(H.resolveWithinRoot("/srv/app", "/../../etc/passwd"), null);
  assert.equal(H.resolveWithinRoot("/srv/app", "/..%2f..%2fetc%2fpasswd"), null);
  assert.equal(H.resolveWithinRoot("/srv/app", "/a/../../etc"), null);
  assert.equal(H.resolveWithinRoot("/srv/app", "/assets/app.js"), "/srv/app/assets/app.js");
});

test("the rate limiter releases after its window and bounds its key set", () => {
  const limiter = new H.RateLimiter({ limit: 3, windowMs: 1000 });
  const t0 = 1_000_000;
  assert.equal(limiter.check("a", t0), 0);
  assert.equal(limiter.check("a", t0), 0);
  assert.equal(limiter.check("a", t0), 0);
  assert.ok(limiter.check("a", t0) > 0, "fourth request in the window must be refused");
  assert.equal(limiter.check("b", t0), 0, "a different caller has its own budget");
  assert.equal(limiter.check("a", t0 + 1001), 0, "the window must release");

  // An unbounded map is a memory-exhaustion primitive for anyone who can vary
  // the key, which an untrusted-peer deployment absolutely can.
  const small = new H.RateLimiter({ limit: 1, windowMs: 1000, maxKeys: 50 });
  for (let i = 0; i < 500; i++) small.check(`k${i}`, t0);
  assert.ok(small.hits.size <= 50, `key set grew to ${small.hits.size}`);
});

test("only the credential endpoints are throttled", () => {
  assert.ok(H.isAuthPath("/api/v1/auth/login"));
  assert.ok(H.isAuthPath("/api/v1/auth/register"));
  assert.ok(H.isAuthPath("/api/v1/auth/reset-password"));
  // Device flow is polled on a timer during a normal login; throttling it
  // would break the login it is part of.
  assert.ok(!H.isAuthPath("/api/v1/auth/device/token"));
  assert.ok(!H.isAuthPath("/api/v1/workflows"));
});
