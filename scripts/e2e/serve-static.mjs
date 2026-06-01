import { createReadStream, promises as fs } from 'node:fs';
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
const root = path.resolve(process.cwd(), rootArg);

const fileExists = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
};

const resolveFilePath = async (pathname) => {
  const decodedPathname = decodeURIComponent(pathname);
  const normalizedPathname = decodedPathname === '/' ? '/index.html' : decodedPathname;
  const basePath = path.resolve(root, `.${normalizedPathname}`);

  if (basePath !== root && !basePath.startsWith(`${root}${path.sep}`)) {
    return null;
  }

  const candidates = path.extname(basePath)
    ? [basePath]
    : [path.join(basePath, 'index.html'), `${basePath}.html`];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return { filePath: candidate, statusCode: 200 };
    }
  }

  const notFoundPath = path.join(root, '404.html');
  if (await fileExists(notFoundPath)) {
    return { filePath: notFoundPath, statusCode: 404 };
  }

  return null;
};

const server = http.createServer(async (request, response) => {
  if (!request.url || !['GET', 'HEAD'].includes(request.method ?? '')) {
    response.writeHead(405).end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host ?? `${hostname}:${port}`}`);
  const resolved = await resolveFilePath(url.pathname);

  if (!resolved) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }

  const extension = path.extname(resolved.filePath);
  response.writeHead(resolved.statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': contentTypes.get(extension) ?? 'application/octet-stream',
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(resolved.filePath).pipe(response);
});

server.listen(port, hostname, () => {
  const scriptPath = fileURLToPath(import.meta.url);
  console.log(`${path.basename(scriptPath)} serving ${root} at http://${hostname}:${port}`);
});
