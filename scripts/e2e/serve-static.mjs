import { promises as fs } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

const args = process.argv.slice(2);
const rootArg = args.find((arg) => !arg.startsWith('--')) ?? 'out';
const portArg = args.find((arg) => arg.startsWith('--port='));
const port = Number(portArg?.split('=')[1] ?? process.env.PORT ?? 3000);
const hostname = process.env.HOST ?? '127.0.0.1';
const root = await fs.realpath(path.resolve(process.cwd(), rootArg));

async function serve(request, response) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.includes('\0')) throw new URIError();
  } catch {
    response.writeHead(400).end();
    return;
  }

  const base = path.resolve(root, `.${pathname}`);
  const notFound = path.join(root, '404.html');
  const candidates = [
    [base, 200],
    [path.join(base, 'index.html'), 200],
    [`${base}.html`, 200],
    [notFound, 404],
  ];
  for (const [candidate, status] of candidates) {
    let handle;
    try {
      const file = await fs.realpath(candidate);
      if (!file.startsWith(root + path.sep)) continue;
      if (!(await fs.stat(file)).isFile()) continue;
      handle = await fs.open(file);
      if (!(await handle.stat()).isFile()) continue;
      response.writeHead(status, {
        'Cache-Control': 'no-store',
        'Content-Type': contentTypes.get(path.extname(file)) ?? 'application/octet-stream',
      });
      if (request.method === 'HEAD') response.end();
      else await pipeline(handle.createReadStream(), response);
      return;
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
    } finally {
      await handle?.close();
    }
  }
  response.writeHead(404).end('Not found');
}

const server = http.createServer((request, response) => {
  serve(request, response).catch(() => {
    if (response.headersSent) response.destroy();
    else response.writeHead(500).end();
  });
});

server.listen(port, hostname, () => {
  const scriptPath = fileURLToPath(import.meta.url);
  console.log(`${path.basename(scriptPath)} serving ${root} at http://${hostname}:${port}`);
});
