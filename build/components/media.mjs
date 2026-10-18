// <img> with srcset from the processed widths, and the credit line for every picture a page uses.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readJSON, esc, ROOT } from '../lib.mjs';

const manifest = readJSON('assets/images.json').images;
const sizes = existsSync(join(ROOT, 'assets/img/sizes.json')) ? readJSON('assets/img/sizes.json') : {};
const byId = Object.fromEntries(manifest.map((m) => [m.id, m]));

// Until a generated picture arrives, its slot shows a stand-in from the photos that exist.
const STAND_IN = {
  'hero-stairs': 'guk-front',
  'showcase-hall': 'guk-night',
  'life-sport': 'guk-columns',
  'life-stage': 'plaque',
  'life-dorm': 'guk-winter',
  'life-winter': 'guk-night',
  'life-robotics': 'urgu',
  'cutout-applicant': null,
};

export const has = (id) => Boolean(sizes[id]);
// True when the picture shown in this slot was generated for the concept (to mark it «иллюстрация»).
export const isAi = (id) => Boolean(byId[resolve(id)]?.ai);

// Slots without an explicit stand-in borrow one of the real photographs, picked by the slot's name,
// so two pending slots on one page rarely show the same picture.
const REAL = manifest.filter((m) => !m.ai && sizes[m.id]).map((m) => m.id);
const pick = (id) => REAL.length ? REAL[[...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % REAL.length] : null;

export const resolve = (id) => {
  if (has(id)) return id;
  if (id in STAND_IN) return STAND_IN[id] && has(STAND_IN[id]) ? STAND_IN[id] : null;
  return byId[id]?.ai ? pick(id) : null;
};

export function img(id, { alt, sizes: sz = '100vw', cls = '', eager = false, pos = '', attrs = '' } = {}) {
  const real = resolve(id);
  if (!real) return `<div class="img-missing ${cls}" role="img" aria-label="${esc(alt)}"></div>`;
  const s = sizes[real];
  const widths = [...s.widths].sort((a, b) => a - b);
  const largest = widths.at(-1);
  const h = Math.round(largest / s.ratio);
  const srcset = widths.map((w) => `img/${real}-${w}.webp ${w}w`).join(', ');
  return `<img class="${cls}${s.alpha ? ' is-cut' : ''}" src="img/${real}-${widths[Math.min(1, widths.length - 1)]}.webp" srcset="${srcset}" sizes="${sz}" width="${largest}" height="${h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${pos ? ` style="object-position:${pos}"` : ''}${attrs ? ' ' + attrs : ''}>`;
}

export function credits(ids) {
  const lines = new Set();
  let ai = false;
  for (const id of ids) {
    const real = resolve(id);
    if (!real) continue;
    const m = byId[real];
    if (m.ai) ai = true;
    else if (m.credit) lines.add(m.credit);
  }
  const out = [...lines];
  if (ai) out.push('часть иллюстраций сгенерирована нейросетью для концепта');
  return out;
}
