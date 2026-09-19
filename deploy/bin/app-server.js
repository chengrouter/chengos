const http = require('http');
const fs = require('fs');
const path = require('path');

const H = require('./lib/http-hardening');

const PORT = process.env.APP_PORT || 5055;
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:19225';
const APP_DIR = path.resolve(path.join(__dirname, '../app'));

// Mirrors the Docker deployment's TRUST_CLOUDFLARE switch.
const TRUST_CLOUDFLARE = /^(1|true|yes|on)$/i.test(process.env.TRUST_CLOUDFLARE || '');
const CONNECT_SRC = H.connectSrcFromEnv();

// Which interface to accept connections on. The default keeps every address,
// which is what this server has always done; set it to 127.0.0.1 when a proxy
// on this same host is the only thing that should reach it, or to a private /
// VPN address when the proxy lives on another machine.
//
// This is NOT access control: it selects a local interface, and an address
// belonging to some other host fails to bind at all (EADDRNOTAVAIL). Deciding
// who may connect is the firewall's job.
const BIND = process.env.APP_BIND || '0.0.0.0';

// Reverse proxies that may report a visitor's real address. Loopback and
// RFC1918 peers are trusted implicitly; a proxy on a separate machine arrives
// from a public address and has to be named here, or every visitor is
// attributed to it and shares one rate-limit bucket.
const TRUSTED_PROXIES = H.parseTrustedProxies(process.env.TRUSTED_PROXY_IPS);

// Native installs have no nginx in front, so the outer wall is here.
const authLimiter = new H.RateLimiter({ limit: 20, windowMs: 60000 });

// This app is a channel gateway that host applications may legitimately embed,
// so it sets no frame-ancestors / X-Frame-Options. Pin those to the embedding
// origins once they are known.
const EMBEDDABLE = true;

let shellCache = null;
function shell() {
  const shellPath = path.join(APP_DIR, 'index.html');
  let mtime = 0;
  try {
    mtime = fs.statSync(shellPath).mtimeMs;
  } catch {
    return null;
  }
  if (!shellCache || shellCache.mtime !== mtime) {
    const loaded = H.loadShell(shellPath, fs);
    shellCache = { mtime, loaded };
    if (loaded.allowInlineScript) {
      console.warn(
        '[SECURITY] index.html has an inline <script> but no __CSP_NONCE__ placeholder. ' +
          "Falling back to script-src 'unsafe-inline'. Rebuild the frontend to remove it."
      );
    }
  }
  return shellCache.loaded;
}

function isHttps(req) {
  return String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https';
}

function headersFor(req, extra, nonceOpts) {
  return {
    ...H.securityHeaders({
      https: isHttps(req),
      connectSrc: CONNECT_SRC,
      embeddable: EMBEDDABLE,
      ...nonceOpts,
    }),
    ...extra,
  };
}

function notFound(req, res) {
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(404, headersFor(req, { 'Content-Type': 'text/plain; charset=utf-8' }));
  res.end('Not Found');
}

// The body differs per response because of the CSP nonce, so it must never be
// cached: a stored copy would pair an old nonce with a new header.
function sendShell(req, res) {
  const loaded = shell();
  if (!loaded) return notFound(req, res);
  const nonce = loaded.hasPlaceholder ? H.makeNonce() : null;
  const body = loaded.render(nonce);
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(
    200,
    headersFor(
      req,
      {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Content-Length': Buffer.byteLength(body),
      },
      { nonce, allowInlineScript: loaded.allowInlineScript }
    )
  );
  res.end(body);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const backendParsed = new URL(BACKEND_URL);

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const ip = H.clientIp(req, { trustCloudflare: TRUST_CLOUDFLARE, trustedProxies: TRUSTED_PROXIES });

  // Match proxy rules: /api, /features, /mcp, /ready, /health
  if (
    urlPath.startsWith('/api/') || 
    urlPath.startsWith('/features/') || 
    urlPath.startsWith('/mcp/') || 
    urlPath === '/ready' || 
    urlPath === '/health'
  ) {
    if (H.isAuthPath(urlPath)) {
      const retryAfter = authLimiter.check(ip);
      if (retryAfter) {
        res.writeHead(429, headersFor(req, {
          'Content-Type': 'application/json; charset=utf-8',
          'Retry-After': String(retryAfter),
        }));
        res.end(JSON.stringify({ error: 'Too many attempts', retry_after: retryAfter }));
        return;
      }
    }

    const options = {
      hostname: backendParsed.hostname,
      port: backendParsed.port || (backendParsed.protocol === 'https:' ? 443 : 80),
      path: req.url,
      method: req.method,
      // Not the client's headers verbatim: X-Real-IP is overwritten and
      // X-Forwarded-For appended, so the backend's per-IP login throttle keys
      // on an address the caller cannot choose.
      headers: H.proxyHeaders(req, ip, backendParsed.host),
    };
    
    options.headers['host'] = backendParsed.host;

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err.message);
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('Bad Gateway');
    });

    req.pipe(proxyReq, { end: true });
    return;
  }

  // Serve static files.
  //
  // path.join() silently normalises `..` away, so joining an unvalidated
  // request target to APP_DIR was a directory traversal: path.join('/srv/app',
  // '/../../etc/passwd') is '/etc/passwd'. resolveWithinRoot decodes first and
  // refuses anything that leaves the root.
  //
  // This must stay ahead of the blocklist: a `..` segment also matches the
  // dot-segment rule there, so the other order would answer an escape attempt
  // with a 404 and hide it among the noise.
  const filePath = H.resolveWithinRoot(APP_DIR, urlPath);
  if (filePath === null) {
    res.writeHead(403, headersFor(req, { 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('Forbidden');
    return;
  }

  // Secret and CMS probes are answered before any fallback can turn them into
  // a 200 — the behaviour that made a scan of this host report every .env path
  // as "found".
  if (H.isBlockedPath(urlPath)) {
    return notFound(req, res);
  }

  // The site root is always the shell, whatever the client asked for: it is
  // not a scanner signal, and health checks (hybrid/status.sh) probe it with
  // curl, which sends Accept: */*.
  if (urlPath === '/' || urlPath === '/index.html') {
    return sendShell(req, res);
  }

  // Past the root, a browser navigating to a client-side route sends
  // Accept: text/html while a wordlist scanner asks for */*.
  const wantsHtml = String(req.headers.accept || '').toLowerCase().includes('text/html');

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (wantsHtml && !path.extname(filePath)) return sendShell(req, res);
      return notFound(req, res);
    }

    if (res.destroyed || res.writableEnded) return;

    if (filePath === path.join(APP_DIR, 'index.html')) return sendShell(req, res);

    const contentType = MIME_TYPES[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, headersFor(req, {
      'Content-Type': contentType,
      'Cache-Control': filePath.includes(`${path.sep}assets${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
    }));

    const stream = fs.createReadStream(filePath);
    stream.on('error', (streamErr) => {
      console.error('File read error:', filePath, streamErr.message);
      res.destroy();
    });
    res.on('close', () => stream.destroy());
    stream.pipe(res);
  });
});

// Proxy WebSocket requests
server.on('upgrade', (req, socket, head) => {
  if (req.url.startsWith('/ws')) {
    const options = {
      hostname: backendParsed.hostname,
      port: backendParsed.port || (backendParsed.protocol === 'https:' ? 443 : 80),
      path: req.url,
      method: req.method,
      // Same forwarding rules as the HTTP path: the backend attributes a
      // WebSocket to an address the client cannot forge.
      headers: H.proxyHeaders(req, H.clientIp(req, { trustCloudflare: TRUST_CLOUDFLARE, trustedProxies: TRUSTED_PROXIES }), backendParsed.host),
    };

    const proxyReq = http.request(options);
    proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
      socket.write(`HTTP/1.1 101 Switching Protocols\r\n`);
      for (const [key, value] of Object.entries(proxyRes.headers)) {
        socket.write(`${key}: ${value}\r\n`);
      }
      socket.write('\r\n');

      proxySocket.write(proxyHead);
      proxySocket.pipe(socket);
      socket.pipe(proxySocket);
    });

    proxyReq.on('error', (err) => {
      console.error('WS Proxy error:', err.message);
      socket.end();
    });

    proxyReq.end();
  } else {
    socket.end();
  }
});

// Say out loud what the process will actually trust. The dangerous outcome of
// a proxy misconfiguration is not a crash: it is every visitor silently sharing
// one rate-limit bucket, which looks like nothing at all until a login is being
// brute-forced through the proxy.
function logTrustPosture() {
  const proxies = TRUSTED_PROXIES.map((p) => p.text).join(', ');
  console.log(
    `Trusted proxies: loopback + RFC1918${proxies ? ` + ${proxies}` : ''}` +
      `${TRUST_CLOUDFLARE ? ' + Cloudflare (CF-Connecting-IP)' : ''}`
  );
  if (BIND !== '127.0.0.1' && BIND !== '::1' && !proxies) {
    console.warn(
      `[SECURITY] Listening on ${BIND} with no TRUSTED_PROXY_IPS. If a reverse proxy ` +
        'on another host fronts this server, set TRUSTED_PROXY_IPS to its address or ' +
        'every visitor will be attributed to that proxy and share one rate-limit bucket.'
    );
  }
}

server.listen(PORT, BIND, () => {
  console.log(`App Server listening on ${BIND}:${PORT}`);
  console.log(`Proxying API & WebSocket to ${BACKEND_URL}`);
  logTrustPosture();
});
