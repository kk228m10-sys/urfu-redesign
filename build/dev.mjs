// Dev server: rebuilds on change (in a fresh process, so templates are never cached) and reloads the
// browser. Serves dist/ with byte ranges, so video scrubbing works too.  npm run dev → http://localhost:4321
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { watch, statSync, createReadStream, existsSync } from 'node:fs';
import { join, extname, resolve, sep } from 'node:path';
import { ROOT } from './lib.mjs';

const PORT = Number(process.env.PORT) || 4321;
const dist = join(ROOT, 'dist');
const clients = new Set();
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
};
const RELOAD = `<script>(()=>{const s=new EventSource('/__reload');s.onmessage=()=>location.reload();})()</script>`;

let building = false, queued = false;
function rebuild() {
  if (building) { queued = true; return; }
  building = true;
  const p = spawn(process.execPath, [join(ROOT, 'build/build.mjs')], { stdio: 'inherit' });
  p.on('exit', (code) => {
    building = false;
    if (code === 0) for (const c of clients) c.write('data: reload\n\n');
    if (queued) { queued = false; rebuild(); }
  });
}

let timer = null;
for (const dir of ['src', 'build', 'assets/img', 'assets/video']) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) continue;
  watch(full, { recursive: true }, (_, name) => {
    if (name && /fit-missing\.json$/.test(name)) return;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 120);
  });
}

// While a build is wiping and refilling dist/, requests wait for it instead of hitting missing files.
const settled = () => new Promise((resolve) => {
  const check = () => (building ? setTimeout(check, 40) : resolve());
  check();
});

createServer(async (req, res) => {
  await settled();
  res.on('error', () => {});
  const fail = () => { if (!res.headersSent) res.writeHead(404); res.end(); };
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/__reload') {
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
    res.write('retry: 500\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  let file = resolve(join(dist, decodeURIComponent(url.pathname)));
  if (file !== dist && !file.startsWith(dist + sep)) { res.writeHead(403); return res.end(); }
  try {
    if (statSync(file).isDirectory()) file = join(file, 'index.html');
  } catch {
    file = join(dist, '404.html');
    if (!existsSync(file)) { res.writeHead(404); return res.end('not found'); }
  }
  const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
  let size;
  try { size = statSync(file).size; } catch { return fail(); }
  if (type.startsWith('text/html')) {
    const chunks = [];
    createReadStream(file).on('error', fail).on('data', (c) => chunks.push(c)).on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8').replace('</body>', RELOAD + '</body>');
      res.writeHead(file.endsWith('404.html') && !url.pathname.endsWith('404.html') ? 404 : 200, { 'content-type': type, 'cache-control': 'no-store' });
      res.end(body);
    });
    return;
  }
  const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, { 'content-type': type, 'content-range': `bytes ${start}-${end}/${size}`, 'accept-ranges': 'bytes', 'content-length': end - start + 1, 'cache-control': 'no-store' });
    return createReadStream(file, { start, end }).on('error', fail).pipe(res);
  }
  res.writeHead(200, { 'content-type': type, 'content-length': size, 'accept-ranges': 'bytes', 'cache-control': 'no-store' });
  createReadStream(file).on('error', fail).pipe(res);
}).listen(PORT, () => console.log(`dev server: http://localhost:${PORT}`));

rebuild();
