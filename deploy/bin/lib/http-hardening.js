'use strict';
//
// Shared hardening for the native deployment's two static servers.
//
// The Docker deployment puts nginx in front of the built frontends and gets
// all of this from chengflow-ui/nginx.conf.template. Native and hybrid
// installs serve the same bundles from ui-server.js / app-server.js instead,
// so without this module they answer a secret scan with 200 + index.html and
// ship no security headers at all. Both paths must behave the same, so the
// rules live here once rather than being copied into each server.
//
// No dependencies on purpose: these files are shipped as a release bundle and
// run with a bare `node`, with no install step.

const crypto = require('crypto');
const path = require('path');

// ── Scanner paths ────────────────────────────────────────────────────────────
//
// Answered with 404 before any SPA fallback can turn them into a 200. 404
// rather than 403 so a probe cannot tell a blocked path from an absent one.
// Kept in step with the four `location` blocks in chengflow-ui's nginx config.

const BLOCKED = [
  // Any dot-segment except the ACME / well-known namespace.
  /(^|\/)\.(?!well-known\/)/,
  // Extensions that only ever name a secret, a backup, or a language this
  // stack does not serve. `.map` is here to keep source maps off the wire.
  /\.(?:env|bak|old|swp|sql|sqlite3?|db|log|pem|key|crt|p12|pfx|tfstate|ini|sh|php|phtml|asp|aspx|jsp|cgi|pl|rb|map)$/i,
  // Names a config probe looks for, wherever they appear in the path.
  /(?:^|\/)(?:credentials|secrets?|docker-compose|kubernetes|terraform|id_rsa|xmlrpc|wp-login|wp-config)[.\-]/i,
  // CMS trees this app does not have.
  /^\/(?:wp-admin|wp-includes|wp-content|wordpress|wp|vendor|storage)(?:\/|$)/i,
];

function isBlockedPath(urlPath) {
  return BLOCKED.some((re) => re.test(urlPath));
}

// ── Client address ───────────────────────────────────────────────────────────

const PRIVATE_PEER =
  /^(?:127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|::1$|::ffff:127\.|::ffff:10\.|::ffff:192\.168\.|fc|fd)/i;

/**
 * The address to attribute a request to.
 *
 * A forwarding header is only evidence when the peer that sent it is one we
 * put there. Behind a reverse proxy the peer is loopback or a private address;
 * a request straight off the internet is neither, and its headers are ignored.
 *
 * With TRUST_CLOUDFLARE=true the proxy is expected to pass CF-Connecting-IP
 * through — nginx forwards unknown request headers to its upstream unchanged,
 * so this needs no extra configuration on the host proxy.
 *
 * X-Forwarded-For is read from the END: a proxy appends, so the last entry is
 * the one written by the nearest trusted hop and the only one a remote caller
 * cannot choose. This matches cheng-api's own client_key().
 */
function clientIp(req, { trustCloudflare = false } = {}) {
  const peer = req.socket.remoteAddress || '';
  if (!PRIVATE_PEER.test(peer)) return peer;

  if (trustCloudflare) {
    const cf = String(req.headers['cf-connecting-ip'] || '').trim();
    if (cf) return cf;
  }
  const xff = String(req.headers['x-forwarded-for'] || '');
  if (xff) {
    const last = xff.split(',').pop().trim();
    if (last) return last;
  }
  return peer;
}

/**
 * Headers to send upstream.
 *
 * The previous implementation forwarded the client's headers verbatim, so a
 * caller could invent its own X-Forwarded-For and the backend's per-IP login
 * throttle would hand it a fresh bucket on every request. Overwriting X-Real-IP
 * and appending to X-Forwarded-For — exactly what nginx does — closes that.
 */
function proxyHeaders(req, ip, backendHost) {
  const headers = { ...req.headers, host: backendHost };
  const priorXff = String(req.headers['x-forwarded-for'] || '').trim();
  headers['x-real-ip'] = ip;
  headers['x-forwarded-for'] = priorXff ? `${priorXff}, ${ip}` : ip;
  if (!headers['x-forwarded-proto']) {
    headers['x-forwarded-proto'] = req.socket.encrypted ? 'https' : 'http';
  }
  return headers;
}

// ── Response headers ─────────────────────────────────────────────────────────

function makeNonce() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * @param {object} opts
 * @param {string|null} opts.nonce        set on an HTML response; null elsewhere
 * @param {boolean} opts.allowInlineScript degraded mode for a bundle built
 *        before the nonce placeholder existed — see loadShell()
 * @param {boolean} opts.embeddable        app gateway: host pages may frame it
 * @param {string}  opts.connectSrc        CSP connect-src source list
 * @param {boolean} opts.https             request arrived over TLS
 */
function securityHeaders(opts = {}) {
  const {
    nonce = null,
    allowInlineScript = false,
    embeddable = false,
    connectSrc = "'self'",
    https = false,
    webfonts = false,
  } = opts;

  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  };

  if (!embeddable) {
    headers['X-Frame-Options'] = 'SAMEORIGIN';
    headers['Cross-Origin-Opener-Policy'] = 'same-origin';
  }

  // Only meaningful once TLS is actually in front; asserting it over plain http
  // would strand a LAN deployment on a scheme it cannot serve.
  if (https) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }

  // A nonce and 'unsafe-inline' are mutually exclusive in practice: a browser
  // that understands nonces ignores 'unsafe-inline' whenever one is present, so
  // listing both would silently give back everything the nonce buys.
  let scriptSrc = "'self' blob:";
  if (nonce) scriptSrc += ` 'nonce-${nonce}'`;
  else if (allowInlineScript) scriptSrc += " 'unsafe-inline'";

  // style-src cannot drop 'unsafe-inline': Radix UI and React Flow position
  // elements by writing style attributes at runtime, which no nonce covers.
  const styleSrc = webfonts
    ? "'self' 'unsafe-inline' https://fonts.googleapis.com"
    : "'self' 'unsafe-inline'";
  const fontSrc = webfonts ? "'self' data: https://fonts.gstatic.com" : "'self' data:";

  headers['Content-Security-Policy'] = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    "img-src 'self' data: blob: https:",
    `font-src ${fontSrc}`,
    `connect-src ${connectSrc}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(embeddable ? [] : ["frame-ancestors 'self'"]),
  ].join('; ');

  return headers;
}

/**
 * connect-src for a same-origin native deployment.
 *
 * Everything is proxied through this server, so 'self' is the whole answer and
 * a blanket `https:` would let injected code post whatever it read to any host
 * on the internet. CSP_CONNECT_SRC_EXTRA is the escape hatch.
 */
function connectSrcFromEnv(env = process.env) {
  const extra = String(env.CSP_CONNECT_SRC_EXTRA || '').trim();
  return extra ? `'self' ${extra}` : "'self'";
}

// ── SPA shell ────────────────────────────────────────────────────────────────

const NONCE_PLACEHOLDER = '__CSP_NONCE__';
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>/i;

/**
 * Load index.html and decide how its inline scripts can be allowed.
 *
 * A bundle built before the nonce placeholder existed still carries a bare
 * inline <script> (the anti-FOUC theme probe). Serving it under a nonce-only
 * policy would block that script on every page load. Rather than fail closed on
 * an old bundle, fall back to 'unsafe-inline' for it and say so loudly — the
 * policy tightens by itself the next time the frontend is rebuilt.
 */
function loadShell(shellPath, fsMod = require('fs')) {
  const html = fsMod.readFileSync(shellPath, 'utf8');
  const hasPlaceholder = html.includes(NONCE_PLACEHOLDER);
  const hasBareInline = !hasPlaceholder && INLINE_SCRIPT.test(html);
  return {
    html,
    hasPlaceholder,
    // Degrade only when there is actually a bare inline script to protect.
    allowInlineScript: hasBareInline,
    render(nonce) {
      return hasPlaceholder ? html.split(NONCE_PLACEHOLDER).join(nonce) : html;
    },
  };
}

// ── Rate limiting ────────────────────────────────────────────────────────────

/**
 * Fixed-window counter, keyed by client address.
 *
 * Deliberately small and dependency-free. It is not a substitute for the
 * backend's own limiter; it is the outer wall that keeps a stuffing run from
 * reaching the backend at all in a native deployment, where there is no nginx
 * doing it instead.
 */
class RateLimiter {
  constructor({ limit, windowMs, maxKeys = 20000 }) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.maxKeys = maxKeys;
    this.hits = new Map();
  }

  /** @returns {number} seconds to wait, or 0 when the request may proceed. */
  check(key, now = Date.now()) {
    let entry = this.hits.get(key);
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + this.windowMs };
      // An unbounded map is a memory-exhaustion primitive for anyone who can
      // vary the key. Evict oldest-inserted entries once it grows too large.
      if (this.hits.size >= this.maxKeys) {
        for (const k of this.hits.keys()) {
          this.hits.delete(k);
          if (this.hits.size < this.maxKeys * 0.9) break;
        }
      }
      this.hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > this.limit) {
      return Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    }
    return 0;
  }
}

// Credential endpoints only. The device-flow endpoint is excluded on purpose:
// it is polled on a timer during a normal login and would trip any sane limit.
const AUTH_PATHS = /^\/api\/v1\/auth\/(?:login|register|forgot-password|reset-password)\b/;

function isAuthPath(urlPath) {
  return AUTH_PATHS.test(urlPath);
}

// ── Path safety ──────────────────────────────────────────────────────────────

/**
 * Resolve a request path inside a root directory, or null if it escapes.
 *
 * path.join() normalises `..` away silently, so joining an unvalidated request
 * target to a root is a directory traversal: path.join('/srv/app',
 * '/../../etc/passwd') is '/etc/passwd'. decodeURIComponent runs first, so a
 * percent-encoded traversal is caught by the same check.
 *
 * A `..` segment is REJECTED rather than normalised away. Normalising would
 * keep the read inside the root and merely 404, but a request that tried to
 * climb out is not a typo — answering it with the same status as a missing file
 * would hide the attempt, and callers rely on a refusal here.
 */
function resolveWithinRoot(root, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null; // malformed percent-encoding
  }
  if (decoded.includes('\0')) return null;
  // Both separators: a Windows-style backslash is a segment break on some
  // filesystems and would otherwise sneak a `..` past a slash-only split.
  if (decoded.split(/[/\\]/).some((segment) => segment === '..')) return null;
  const resolved = path.resolve(root, '.' + path.posix.normalize('/' + decoded));
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null;
  return resolved;
}

module.exports = {
  isBlockedPath,
  clientIp,
  proxyHeaders,
  makeNonce,
  securityHeaders,
  connectSrcFromEnv,
  loadShell,
  RateLimiter,
  isAuthPath,
  resolveWithinRoot,
  NONCE_PLACEHOLDER,
};
