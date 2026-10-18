// Small helpers shared by the page templates. Pages are plain functions that return HTML strings.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

// Joins arrays and drops null/false so templates can use conditionals and .map() inline.
export const html = (strings, ...values) =>
  strings.reduce((out, s, i) => {
    const v = values[i - 1];
    const part = Array.isArray(v) ? v.flat(Infinity).filter((x) => x != null && x !== false).join('') : v == null || v === false ? '' : v;
    return out + part + s;
  });

export const readJSON = (rel) => JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));

// Russian plural: plural(5, ['программа', 'программы', 'программ'])
export const plural = (n, [one, few, many]) => {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
};

// 9855 -> "9 855" with a no-break thin space, as Russian typography wants.
export const num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');

export const rub = (n) => (n ? `${num(n)}\u00a0₽` : 'уточняется');

// Data embedded into a page for its scripts; works from file:// where fetch() does not.
// Text colour for a fill: white or ink, whichever contrasts more (WCAG relative luminance).
const luminance = (hex) => hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255)
  .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
export const inkOn = (hex) => (ratio(hex, '#ffffff') >= ratio(hex, '#1d1d1b') ? '#ffffff' : '#1d1d1b');

export const jsonScript = (id, data) =>
  `<script type="application/json" id="${id}">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
