const http = require('http');
const fs = require('fs');
const path = require('path');

/*
  A tiny HTTP server for the CarlyCompare site.
  This implementation uses Node's built‑in modules (http, fs and path) so
  that the project does not depend on any third‑party packages. When the
  server receives a request it attempts to locate a file under the
  `public` directory that matches the request URL. If the file exists
  it is served with an appropriate content type; otherwise a 404
  response is returned. The root path `/` falls back to serving
  `index.html`.
*/

const publicDir = path.join(__dirname, 'public');
const port = process.env.PORT || 3000;

// Map file extensions to content types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  // Normalise URL by removing querystring and decoding
  const requestPath = decodeURI(req.url.split('?')[0]);

  // Determine file path; default to index.html for root
  let filePath = path.join(publicDir, requestPath);
  if (requestPath === '/' || requestPath === '') {
    filePath = path.join(publicDir, 'index.html');
  }

  // Resolve to avoid directory traversal attacks
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(publicDir)) {
    res.statusCode = 403;
    res.end('Access denied');
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      // File not found or not a regular file
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('404 Not Found');
      return;
    }

    // Determine content type based on extension
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);

    const readStream = fs.createReadStream(resolvedPath);
    readStream.pipe(res);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});