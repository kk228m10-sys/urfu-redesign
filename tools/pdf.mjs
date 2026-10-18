// Prints the concept page to an A4 PDF for the jury:  node tools/pdf.mjs  →  docs/urfu-koncepciya.pdf
// Needs the dev server (npm run dev).
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://localhost:4321';
const cdp = await import(pathToFileURL(join(homedir(), '.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs')).href);
const browser = await cdp.Browser.launch();
try {
  const page = await browser.newPage({ width: 1240, height: 1754, dsf: 1 });
  await page.goto(`${BASE}/koncepciya.html`, { timeoutMs: 30000, settleMs: 800 });
  await page.eval('document.fonts.ready.then(() => true)').catch(() => {});
  // load every lazy image before printing
  await page.eval(`(async () => { for (const img of document.images) { img.loading = 'eager'; } window.scrollTo(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 1200)); window.scrollTo(0, 0); return Promise.all([...document.images].map(i => i.decode().catch(() => {}))); })()`).catch(() => {});
  await page.send('Emulation.setEmulatedMedia', { media: 'print' });
  const { data } = await page.send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
  const out = join(ROOT, 'docs/urfu-koncepciya.pdf');
  writeFileSync(out, Buffer.from(data, 'base64'));
  console.log('pdf written:', out);
} finally {
  await browser.close();
}
