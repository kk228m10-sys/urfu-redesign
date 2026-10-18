// First-screen screenshots of every prototype page (1440×900) for the concept page and the PDF.
// Needs the dev server:  npm run dev  →  node tools/shots.mjs
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://localhost:4321';
const OUT = join(ROOT, 'assets/img/shots');
mkdirSync(OUT, { recursive: true });
const cdp = await import(pathToFileURL(join(homedir(), '.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs')).href);
const { BUILT } = await import(pathToFileURL(join(ROOT, 'build/pages/skoro.mjs')).href);

const browser = await cdp.Browser.launch();
try {
  for (const [file] of BUILT) {
    const page = await browser.newPage({ width: 1440, height: 900, dsf: 1 });
    await page.goto(`${BASE}/${file}`, { timeoutMs: 30000, settleMs: 600 });
    await page.eval('document.fonts.ready.then(() => true)').catch(() => {});
    await cdp.sleep(1800); // let the entrance choreography finish
    await page.screenshot({ path: join(OUT, file.replace('.html', '.jpg')), quality: 72 });
    console.log('shot', file);
    await page.close();
  }
} finally {
  await browser.close();
}
