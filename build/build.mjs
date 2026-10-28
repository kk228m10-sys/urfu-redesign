// Static site build: assembles CSS, copies scripts, vendor files, fonts and images, renders every page
// in build/pages/*.mjs. Plain HTML/CSS/classic scripts, so dist/ also opens from a USB stick.
// Everything is built into .dist-next/ first and then synced into dist/, so dist/ is never empty
// while the dev server or the inspector is reading it.
import { rmSync, mkdirSync, cpSync, writeFileSync, readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, MOTION } from './lib.mjs';
import { markFile } from './components/logo.mjs';
import { searchIndex } from './search-index.mjs';
import { flushMissing } from './fit.mjs';

const dist = join(ROOT, MOTION ? 'dist-motion' : 'dist');
// Each build stages in its own folder; syncs into dist/ are serialised with a lock directory,
// so a manual build and the dev server's rebuild can never mix their files.
const stage = join(ROOT, `.dist-next-${process.pid}`);
const LOCK = join(ROOT, MOTION ? '.dist-motion-lock' : '.dist-lock');
const nm = (p) => join(ROOT, 'node_modules', p);

// Fonts are inlined as base64 so they load from file:// too (Chrome blocks file:// font requests).
function fontFaces() {
  const faces = [
    ['Unbounded Variable', '@fontsource-variable/unbounded/files/unbounded', '200 900'],
    ['Onest Variable', '@fontsource-variable/onest/files/onest', '100 900'],
  ];
  const ranges = {
    cyrillic: 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
    latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD, U+20BD',
  };
  let css = '';
  for (const [family, base, weight] of faces) {
    for (const [subset, range] of Object.entries(ranges)) {
      const b64 = readFileSync(nm(`${base}-${subset}-wght-normal.woff2`)).toString('base64');
      css += `@font-face{font-family:'${family}';font-style:normal;font-display:swap;font-weight:${weight};src:url(data:font/woff2;base64,${b64}) format('woff2');unicode-range:${range};}\n`;
    }
  }
  return css;
}

const walk = (dir) => (existsSync(dir) ? readdirSync(dir) : []).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

async function sync() {
  for (let i = 0; ; i++) {
    try { mkdirSync(LOCK); break; } catch {
      // a lock older than 20 s belongs to a build that died; take it over
      try { if (Date.now() - statSync(LOCK).mtimeMs > 20000) { rmSync(LOCK, { recursive: true, force: true }); continue; } } catch {}
      if (i > 400) throw new Error('dist/ is locked by another build');
      await new Promise((r) => setTimeout(r, 50));
    }
  }
  try {
    mkdirSync(dist, { recursive: true });
    cpSync(stage, dist, { recursive: true, force: true });
    const fresh = new Set(walk(stage).map((p) => relative(stage, p)));
    for (const p of walk(dist)) if (!fresh.has(relative(dist, p))) rmSync(p, { force: true });
  } finally {
    rmSync(LOCK, { recursive: true, force: true });
    rmSync(stage, { recursive: true, force: true });
  }
}

export async function build() {
  const started = Date.now();
  rmSync(stage, { recursive: true, force: true });
  mkdirSync(join(stage, 'css'), { recursive: true });

  // one stylesheet for the shared system, one per page for the rest
  const shared = ['tokens.css', 'base.css', 'layout.css', 'components.css', 'inner.css']
    .map((f) => readFileSync(join(ROOT, 'src/styles', f), 'utf8'))
    .join('\n');
  writeFileSync(join(stage, 'css/site.css'), fontFaces() + shared);
  if (existsSync(join(ROOT, 'src/styles/pages'))) cpSync(join(ROOT, 'src/styles/pages'), join(stage, 'css'), { recursive: true });

  cpSync(join(ROOT, 'src/scripts'), join(stage, 'js'), { recursive: true });
  writeFileSync(join(stage, 'js/search-index.js'), `window.SEARCH_INDEX=${JSON.stringify(searchIndex())};`);

  mkdirSync(join(stage, 'vendor'), { recursive: true });
  for (const f of ['gsap.min.js', 'ScrollTrigger.min.js', 'Flip.min.js', 'SplitText.min.js', 'DrawSVGPlugin.min.js', 'Draggable.min.js']) {
    cpSync(nm(`gsap/dist/${f}`), join(stage, 'vendor', f));
  }

  mkdirSync(join(stage, 'img'), { recursive: true });
  if (existsSync(join(ROOT, 'assets/img'))) cpSync(join(ROOT, 'assets/img'), join(stage, 'img'), { recursive: true });
  if (existsSync(join(ROOT, 'assets/video'))) cpSync(join(ROOT, 'assets/video'), join(stage, 'video'), { recursive: true });
  if (MOTION) {
    // the motion edition alone carries WebGL, inertia and the frames of the scrubbed film
    cpSync(nm('three/build/three.min.js'), join(stage, 'vendor/three.min.js'));
    cpSync(nm('gsap/dist/InertiaPlugin.min.js'), join(stage, 'vendor/InertiaPlugin.min.js'));
    if (existsSync(join(ROOT, 'assets/frames'))) cpSync(join(ROOT, 'assets/frames'), join(stage, 'frames'), { recursive: true });
  }
  writeFileSync(join(stage, 'img/favicon.svg'), markFile('#ffffff', '#e50046'));
  writeFileSync(join(stage, 'img/mark-red.svg'), markFile('#e50046'));
  writeFileSync(join(stage, 'img/mark-ink.svg'), markFile('#1d1d1b'));

  const pagesDir = join(ROOT, 'build/pages');
  let count = 0;
  for (const f of readdirSync(pagesDir).filter((f) => f.endsWith('.mjs'))) {
    const mod = await import(pathToFileURL(join(pagesDir, f)).href);
    for (const { file, html } of [].concat(await mod.default())) {
      writeFileSync(join(stage, file), html);
      count++;
    }
  }
  await sync();
  const misses = flushMissing();
  console.log(`built ${count} page(s) in ${Date.now() - started}ms${misses ? ` · ${misses} display string(s) estimated, run: node tools/measure.mjs` : ''}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  build().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
