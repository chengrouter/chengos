const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.APP_PORT || 5055;
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:3000';
const APP_DIR = path.join(__dirname, '../app');

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
      port: backendParsed.port || (backendParsed.protocol === 'https:' ? 443 : 80),
      path: req.url,
      method: req.method,
      headers: req.headers,
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

  // Serve static files
  let filePath = path.join(APP_DIR, urlPath);
  
  // SPA routing: if requesting a directory, use index.html
  // Also, if requesting a route that doesn't have an extension, serve index.html
  const ext = path.extname(filePath);
  if (!ext) {
    filePath = path.join(APP_DIR, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA router
      filePath = path.join(APP_DIR, 'index.html');
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        }
      });
      return;
    }

    const contentType = MIME_TYPES[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': filePath.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    
    fs.createReadStream(filePath).pipe(res);
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
      headers: req.headers,
    };
    options.headers['host'] = backendParsed.host;

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

server.listen(PORT, () => {
  console.log(`App Server running at http://localhost:${PORT}`);
  console.log(`Proxying API & WebSocket to ${BACKEND_URL}`);
});
