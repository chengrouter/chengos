const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.UI_PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:19225';
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

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Match proxy rules: /api, /features, /mcp, /ready, /health
  if (
    urlPath.startsWith('/api/') ||
    urlPath.startsWith('/features/') ||
    urlPath.startsWith('/mcp/') ||
    urlPath === '/ready' ||
    urlPath === '/health'
  ) {
    const options = {
      hostname: backendParsed.hostname,
      port: BACKEND_PORT,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: backendParsed.host },
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

  // Serve static files
  let filePath = path.join(UI_DIR, decodeURIComponent(urlPath));

  // Refuse anything that escapes the UI directory (raw or encoded "..").
  if (filePath !== UI_DIR && !filePath.startsWith(UI_DIR + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
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
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
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

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Content-Disposition': `attachment; filename="${safeName}"`,
        // Release artifacts are replaced in place on upgrade, so they must not be
        // cached with the immutable policy used for hashed assets.
        'Cache-Control': 'public, max-age=300',
      });

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

  const indexPath = path.join(UI_DIR, 'index.html');

  // SPA routing: a path with no file extension is an app route, not an asset.
  if (!path.extname(filePath)) {
    filePath = indexPath;
  }

  fs.stat(filePath, (err, stats) => {
    const target = err || !stats.isFile() ? indexPath : filePath;
    const isFallback = target === indexPath && target !== filePath;

    const contentType = isFallback
      ? 'text/html; charset=utf-8'
      : MIME_TYPES[path.extname(target)] || 'application/octet-stream';

    if (res.destroyed || res.writableEnded) return;

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': target.includes(`${path.sep}assets${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
    });

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
    headers: { ...req.headers, host: backendParsed.host },
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
