// Measures display strings in a real browser and stores their width in em (see build/fit.mjs).
//   node tools/measure.mjs            measure what the last build could not find in the cache
//   node tools/measure.mjs "СЛОВО"    measure given strings too
// Uses the headless Chrome driver that ships with the design-taste-frontend skill.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, 'build/fit-cache.json');
const MISSING = join(ROOT, 'build/fit-missing.json');
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const todo = new Set([...(existsSync(MISSING) ? JSON.parse(readFileSync(MISSING, 'utf8')) : []), ...process.argv.slice(2).map((s) => s.toUpperCase())]);
for (const k of Object.keys(cache)) todo.delete(k);
if (!todo.size) { console.log('nothing to measure'); process.exit(0); }

const cdp = await import(pathToFileURL(join(homedir(), '.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs')).href);
const font = (f) => readFileSync(join(ROOT, 'node_modules/@fontsource-variable/unbounded/files', f)).toString('base64');
const css = `@font-face{font-family:U;src:url(data:font/woff2;base64,${font('unbounded-cyrillic-wght-normal.woff2')}) format('woff2');unicode-range:U+0400-045F,U+2116}
@font-face{font-family:U;src:url(data:font/woff2;base64,${font('unbounded-latin-wght-normal.woff2')}) format('woff2');unicode-range:U+0000-00FF,U+2000-206F,U+20BD}`;

const browser = await cdp.Browser.launch();
const page = await browser.newPage({ width: 1200, height: 800 });
await page.goto('data:text/html,<html><body></body></html>');
const result = await page.eval(async (a) => {
  const st = document.createElement('style'); st.textContent = a.css; document.head.appendChild(st);
  await document.fonts.load('800 100px U', 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789');
  const out = {};
  for (const w of a.words) {
    const s = document.createElement('span');
    s.textContent = w;
    s.style.cssText = "font:800 100px U;letter-spacing:-0.03em;white-space:nowrap;position:absolute;font-variation-settings:'wght' 800";
    document.body.appendChild(s);
    out[w] = +(s.getBoundingClientRect().width / 100).toFixed(3);
    s.remove();
  }
  return out;
}, { css, words: [...todo] });
await browser.close();
Object.assign(cache, result);
writeFileSync(CACHE, JSON.stringify(Object.fromEntries(Object.entries(cache).sort()), null, 1));
writeFileSync(MISSING, '[]');
console.log(`measured ${Object.keys(result).length}:`, Object.entries(result).map(([k, v]) => `${k} ${v}`).join(' · '));
