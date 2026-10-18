// Display type is fitted to its measure, not guessed: fit(text) returns the width of the text in em
// for Unbounded 800 in capitals at -0.03em, measured in Chrome by tools/measure.mjs and cached in
// build/fit-cache.json. A miss falls back to a per-character estimate and is recorded, so the next
// `node tools/measure.mjs` run measures it.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib.mjs';

const CACHE = join(ROOT, 'build/fit-cache.json');
const MISSING = join(ROOT, 'build/fit-missing.json');
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const missing = new Set();

const estimate = (t) =>
  [...t].reduce((w, c) => w + (c === ' ' || c === ' ' || c === ' ' ? 0.32 : /\d/.test(c) ? 0.76 : /[.,:;!—–-]/.test(c) ? 0.45 : 0.97), 0);

export function fit(text) {
  const key = text.toUpperCase();
  if (cache[key]) return cache[key];
  missing.add(key);
  return +estimate(key).toFixed(3);
}

// font-size that makes `text` fill `measure` (a CSS length): calc(measure / em)
export const fitSize = (text, measure = '(100vw - 2 * var(--margin))') => `calc(${measure} / ${(fit(text) * 1.02).toFixed(3)})`;

export function flushMissing() {
  const list = [...missing].sort();
  const next = JSON.stringify(list, null, 1);
  const prev = existsSync(MISSING) ? readFileSync(MISSING, 'utf8') : '';
  if (next !== prev) writeFileSync(MISSING, next);
  return list.length;
}
