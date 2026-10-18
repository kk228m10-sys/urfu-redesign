// Opens every built page in headless Chrome (through the dev server), scrolls it, and reports console
// errors and uncaught exceptions. Run with the dev server up:  node tools/check-js.mjs
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://localhost:4321';
const cdp = await import(pathToFileURL(join(homedir(), '.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs')).href);
const pages = readdirSync(join(ROOT, 'dist')).filter((f) => f.endsWith('.html'));
const browser = await cdp.Browser.launch();
let bad = 0;
try {
  for (const file of pages) {
    const page = await browser.newPage({ width: 1440, height: 900 });
    await page.goto(`${BASE}/${file}`, { timeoutMs: 30000, settleMs: 500 });
    for (let i = 1; i <= 6; i++) { await page.eval(`window.scrollTo(0, ${i} * innerHeight)`).catch(() => {}); await cdp.sleep(120); }
    const errors = page.consoleErrors || [];
    if (errors.length) { bad++; console.log(`✗ ${file}\n  ${errors.slice(0, 5).join('\n  ')}`); }
    else console.log(`✓ ${file}`);
    await page.close();
  }
} finally {
  await browser.close();
}
process.exit(bad ? 1 : 0);
