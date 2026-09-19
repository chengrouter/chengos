const http = require('http');
const fs = require('fs');
const path = require('path');

const H = require('./lib/http-hardening');

const PORT = process.env.UI_PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:19225';

// Mirrors the Docker deployment's TRUST_CLOUDFLARE switch. Off by default:
// trusting the wrong party lets a caller forge its own address and mint an
// unlimited number of rate-limit buckets.
const TRUST_CLOUDFLARE = /^(1|true|yes|on)$/i.test(process.env.TRUST_CLOUDFLARE || '');
const CONNECT_SRC = H.connectSrcFromEnv();

// Native installs have no nginx in front, so the outer wall is here.
const authLimiter = new H.RateLimiter({ limit: 20, windowMs: 60000 });
// Overridable so the server can be pointed at a build output other than the
// bundled one — and so tests can run it against a fixture directory.
const UI_DIR = path.resolve(process.env.UI_DIR || path.join(__dirname, '../ui'));

// Keep the process alive when an individual request handler throws — without
// these, a single bad WebSocket upgrade or a client disconnecting mid-pipe
// kills the entire server with no log entry.
process.on('uncaughtException', (err) => {
  console.error('[FATAL] uncaughtException:', err.stack || err.message || err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] unhandledRejection:', reason);
});

// The process previously died with nothing in the log, which means a signal
// (OOM killer / session teardown) rather than a JS throw. Record it.
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    console.error(`[EXIT] received ${sig}, shutting down`);
    process.exit(0);
  });
}

// SIGHUP must NOT be fatal. start.sh launches us under nohup, which sets the
// signal to ignored so the server survives the launching terminal/ssh session
// closing. Installing any JS listener replaces that ignore-disposition with
// Node's default "terminate on SIGHUP" behaviour, so simply observing the
// signal here is enough to kill a server that would otherwise have kept
// running. Log it and stay up.
process.on('SIGHUP', () => {
  console.error('[SIGNAL] received SIGHUP, ignoring (controlling terminal closed)');
});

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
  '.zip': 'application/zip',
  '.gz': 'application/gzip',
  '.sig': 'application/pgp-signature',
  '.txt': 'text/plain; charset=utf-8',
};

// Paths served as real downloads rather than as application routes. See the
// DOWNLOADS branch below for why this needs its own handling.
const DOWNLOAD_PREFIX = '/downloads/';

const backendParsed = new URL(BACKEND_URL);
const BACKEND_PORT = backendParsed.port || (backendParsed.protocol === 'https:' ? 443 : 80);

// Default globalAgent opens a fresh TCP connection per proxied request and
// never bounds them. Reuse connections and cap concurrency instead.
const proxyAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 256,
  maxFreeSockets: 32,
  timeout: 60000,
});

// Periodic resource report: makes the next incident diagnosable instead of silent.
setInterval(() => {
  const mem = process.memoryUsage();
  const mb = (n) => Math.round(n / 1048576);
  console.log(
    `[STATS] rss=${mb(mem.rss)}MB heap=${mb(mem.heapUsed)}/${mb(mem.heapTotal)}MB ` +
      `external=${mb(mem.external)}MB handles=${process._getActiveHandles().length} ` +
      `ws=${wsConnections} uptime=${Math.round(process.uptime())}s`
  );
}, 300000).unref();

let wsConnections = 0;

// index.html is re-read when it changes on disk, so an in-place upgrade does
// not require a restart to pick up a rebuilt shell (and its nonce placeholder).
let shellCache = null;
function shell() {
  const shellPath = path.join(UI_DIR, 'index.html');
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
      webfonts: true,
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

// Serve the SPA shell with a fresh CSP nonce. The body differs per response, so
// it must never be cached: a stored copy would pair an old nonce with a new
// header and the inline script would be blocked.
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

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const ip = H.clientIp(req, { trustCloudflare: TRUST_CLOUDFLARE });

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
      port: BACKEND_PORT,
      path: req.url,
      method: req.method,
      // Not the client's headers verbatim: X-Real-IP is overwritten and
      // X-Forwarded-For appended, so the backend's per-IP login throttle keys
      // on an address the caller cannot choose.
      headers: H.proxyHeaders(req, ip, backendParsed.host),
      agent: proxyAgent,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      if (res.writableEnded || res.destroyed) {
        proxyRes.destroy();
        return;
      }
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
      // Client hung up mid-response: tear the upstream side down too, or the
      // backend keeps streaming into a dead socket and the pair leaks.
      proxyRes.on('error', () => res.destroy());
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err.message);
      if (res.headersSent) {
        // Writing a status here throws ERR_HTTP_HEADERS_SENT and strands the
        // response object forever. Just kill the socket.
        res.destroy();
      } else {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway');
      }
    });

    // Never let a half-finished proxy pair outlive its client.
    res.on('close', () => proxyReq.destroy());
    req.on('error', (err) => {
      console.error('Client request error:', err.message);
      proxyReq.destroy();
    });
    proxyReq.setTimeout(120000, () => {
      console.error('Proxy request timeout:', req.url);
      proxyReq.destroy();
    });

    req.pipe(proxyReq, { end: true });
    return;
  }

  // Traversal is checked first, and it must stay first: a `..` segment also
  // matches the dot-segment rule in the blocklist below, so the other order
  // would answer an escape attempt with a 404 and hide it among the noise.
  let filePath = H.resolveWithinRoot(UI_DIR, urlPath);
  if (filePath === null) {
    res.writeHead(403, headersFor(req, { 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('Forbidden');
    return;
  }

  // Secret and CMS probes are answered before any fallback can turn them into
  // a 200. This is the whole reason a scan of this host used to report every
  // .env path as "found": the shell was served for all of them.
  if (H.isBlockedPath(urlPath)) {
    return notFound(req, res);
  }

  // Downloads must never fall through to the SPA.
  //
  // The static handler below answers a missing file with 200 + index.html, which
  // is right for an app route and badly wrong for a download: a user who clicks
  // "download the extension" when the release forgot to build it receives an HTML
  // page saved as cheng-translate.zip, and the server reports success. The
  // failure is invisible to both sides — a "does it download?" check passes.
  if (urlPath.startsWith(DOWNLOAD_PREFIX)) {
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, headersFor(req, { 'Content-Type': 'application/json; charset=utf-8' }));
        res.end(JSON.stringify({ error: 'Not found', path: urlPath }));
        return;
      }

      // Look the type up rather than hardcoding application/zip: this directory
      // also carries checksums and signatures, and will carry other archive
      // formats.
      const ext = path.extname(filePath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // filePath derives from decodeURIComponent(req.url), so the basename is
      // attacker-controlled. An unescaped quote or CRLF here is a response-header
      // injection, so allow only characters that can appear in a release artifact.
      const safeName = path.basename(filePath).replace(/[^A-Za-z0-9._-]/g, '_');

      res.writeHead(200, headersFor(req, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Content-Disposition': `attachment; filename="${safeName}"`,
        // Release artifacts are replaced in place on upgrade, so they must not be
        // cached with the immutable policy used for hashed assets.
        'Cache-Control': 'public, max-age=300',
      }));

      const stream = fs.createReadStream(filePath);
      stream.on('error', (streamErr) => {
        console.error('Download read error:', filePath, streamErr.message);
        res.destroy();
      });
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    });
    return;
  }

  // The site root is always the shell, whatever the client asked for: it is
  // not a scanner signal, and health checks (hybrid/status.sh) probe it with
  // curl, which sends Accept: */*.
  if (urlPath === '/' || urlPath === '/index.html') {
    return sendShell(req, res);
  }

  // Past the root, a browser navigating to a client-side route sends
  // Accept: text/html while a wordlist scanner asks for */*. That distinction is what keeps the shell
  // from being handed out as a 200 for every path that does not exist.
  const wantsHtml = String(req.headers.accept || '').toLowerCase().includes('text/html');

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Only an extensionless path can be an app route; anything that looks
      // like an asset is simply missing, and saying 200 about it hides real
      // broken links as well as rewarding scans.
      if (wantsHtml && !path.extname(filePath)) return sendShell(req, res);
      return notFound(req, res);
    }

    if (res.destroyed || res.writableEnded) return;

    if (filePath === path.join(UI_DIR, 'index.html')) return sendShell(req, res);

    const target = filePath;
    const contentType = MIME_TYPES[path.extname(target)] || 'application/octet-stream';

    res.writeHead(200, headersFor(req, {
      'Content-Type': contentType,
      'Cache-Control': target.includes(`${path.sep}assets${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
    }));

    const stream = fs.createReadStream(target);
    stream.on('error', (streamErr) => {
      console.error('File read error:', target, streamErr.message);
      res.destroy();
    });
    // pipe() does NOT close the source when the destination dies. Without this
    // every aborted download leaks an open file descriptor until EMFILE.
    res.on('close', () => stream.destroy());
    res.on('error', (resErr) => {
      console.error('Response error:', resErr.message);
      stream.destroy();
    });
    stream.pipe(res);
  });
});

// Bound how long a connection may sit idle or half-open. On a public VPS,
// scanners and NAT-dropped clients otherwise pin sockets open forever.
server.keepAliveTimeout = 65000;
server.headersTimeout = 70000;
server.requestTimeout = 300000;
server.timeout = 0;
server.maxRequestsPerSocket = 0;
server.on('clientError', (err, socket) => {
  console.error('Client error:', err.message);
  if (!socket.destroyed) socket.destroy();
});

// Proxy WebSocket requests
server.on('upgrade', (req, socket, head) => {
  // A client disconnecting abruptly during upgrade emits 'error' on socket.
  // Without a listener that becomes an uncaughtException and kills the server.
  socket.on('error', (err) => {
    console.error('WS client socket error:', err.message);
    socket.destroy();
  });

  if (!req.url.startsWith('/ws')) {
    socket.destroy();
    return;
  }

  const options = {
    hostname: backendParsed.hostname,
    port: BACKEND_PORT,
    path: req.url,
    method: req.method,
    // Same forwarding rules as the HTTP path: the backend attributes a
    // WebSocket to an address the client cannot forge.
    headers: H.proxyHeaders(req, H.clientIp(req, { trustCloudflare: TRUST_CLOUDFLARE }), backendParsed.host),
    // Upgraded sockets must not go through the keep-alive pool.
    agent: false,
  };

  const proxyReq = http.request(options);

  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
    // The upgrade succeeded — clear the 30s upgrade timeout so it cannot
    // fire on an idle but healthy WebSocket and kill the connection.
    proxyReq.setTimeout(0);
    wsConnections++;
    let closed = false;
    // Either half dying must take the other with it — otherwise the surviving
    // socket (and its backend connection) leaks for the life of the process.
    const teardown = () => {
      if (closed) return;
      closed = true;
      wsConnections--;
      socket.destroy();
      proxySocket.destroy();
    };

    proxySocket.on('error', (err) => {
      console.error('WS backend socket error:', err.message);
      teardown();
    });
    proxySocket.on('close', teardown);
    proxySocket.on('end', teardown);
    socket.on('close', teardown);
    socket.on('end', teardown);

    // Detect peers that vanished without a FIN (NAT timeout, dropped mobile
    // connection). Without keepalive these sit in the handle table forever.
    socket.setNoDelay(true);
    proxySocket.setNoDelay(true);
    socket.setKeepAlive(true, 30000);
    proxySocket.setKeepAlive(true, 30000);

    socket.write(`HTTP/1.1 101 Switching Protocols\r\n`);
    for (const [key, value] of Object.entries(proxyRes.headers)) {
      socket.write(`${key}: ${value}\r\n`);
    }
    socket.write('\r\n');

    if (proxyHead && proxyHead.length) proxySocket.unshift(proxyHead);
    if (head && head.length) socket.unshift(head);

    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyReq.on('error', (err) => {
    console.error('WS Proxy error:', err.message);
    socket.destroy();
  });

  // The backend never answered the upgrade: don't hold the client socket open.
  proxyReq.setTimeout(30000, () => {
    console.error('WS upgrade timeout:', req.url);
    proxyReq.destroy();
    socket.destroy();
  });

  proxyReq.end();
});

server.listen(PORT, () => {
  console.log(`UI Server running at http://localhost:${PORT}`);
  console.log(`Proxying API & WebSocket to ${BACKEND_URL}`);
});
