// One photographic treatment for every picture on the site, found or generated: black and white,
// a firmer contrast curve and a fine grain, exported as WebP at several widths for srcset.
//   node tools/images.mjs            process everything in assets/images.json that is missing or changed
//   node tools/images.mjs --force    redo all
// A file dropped into assets/incoming is found by the id in its name, so "### hero-stairs.jpg — 32.png"
// serves hero-stairs. Cut-outs (cutout: { light }) arrive on a white or checker background: the figure
// is cut out first by tools/cutout.py (Python with Pillow, numpy, scipy) and keeps its alpha channel.
import { readFileSync, existsSync, mkdirSync, statSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets/img');
const INCOMING = join(ROOT, 'assets/incoming');
const CUT = join(INCOMING, '_cut');
const force = process.argv.includes('--force');
const manifest = JSON.parse(readFileSync(join(ROOT, 'assets/images.json'), 'utf8'));
mkdirSync(OUT, { recursive: true });

const probe = (file) => {
  const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,pix_fmt', '-of', 'csv=p=0', file], { encoding: 'utf8' }).trim();
  const [w, h, fmt] = out.split(',');
  return { w: Number(w), h: Number(h), alpha: /a/.test(fmt || '') && !/^gray$/.test(fmt) };
};

const incoming = existsSync(INCOMING) ? readdirSync(INCOMING) : [];
const findSource = (item) => {
  const exact = join(ROOT, 'assets', item.src);
  if (existsSync(exact)) return exact;
  const re = new RegExp(`(^|[^a-z0-9-])${item.id}\\.(jpe?g|png|webp)`, 'i');
  const hit = incoming.find((f) => re.test(f) && /\.(jpe?g|png|webp)$/i.test(f));
  return hit ? join(INCOMING, hit) : null;
};
const newer = (a, b) => existsSync(a) && statSync(a).size > 0 && statSync(a).mtimeMs > statSync(b).mtimeMs;

const sizes = {};
for (const item of manifest.images) {
  let src = findSource(item);
  if (!src) { console.log(`skip ${item.id}: no source yet (${item.src})`); continue; }
  if (item.cutout && !probe(src).alpha) {
    mkdirSync(CUT, { recursive: true });
    const cut = join(CUT, `${item.id}.png`);
    if (force || !newer(cut, src)) execFileSync('python', ['-E', '-P', join(ROOT, 'tools/cutout.py'), src, cut, String(item.cutout.light ?? 215)], { stdio: 'inherit' });
    src = cut;
  }
  const info = probe(src);
  const crop = item.crop ? `crop=${item.crop},` : '';
  // Generated pictures come in already contrasty; found photographs need the firmer curve.
  const [c0, b0, g0] = item.ai ? [1.1, 0, 1] : [1.25, -0.01, 0.97];
  const tone = item.color ? '' : `format=gray,eq=contrast=${item.contrast ?? c0}:brightness=${item.brightness ?? b0}:gamma=${item.gamma ?? g0},noise=alls=${item.grain ?? 7}:allf=u,`;
  // Never upscale: widths above the source collapse into one file at the source's own width.
  const asked = item.widths ?? [1920, 1280, 768];
  const native = item.crop ? Number(item.crop.split(':')[0]) : info.w;
  const widths = [...new Set(asked.map((w) => Math.min(w, native)))].sort((a, b) => b - a);
  sizes[item.id] = { widths: [], alpha: info.alpha };
  for (const w of widths) {
    const out = join(OUT, `${item.id}-${w}.webp`);
    sizes[item.id].widths.push(w);
    if (!force && newer(out, src)) continue;
    const scale = `scale='min(${w},iw)':-2:flags=lanczos`;
    const filter = info.alpha
      ? `[0]${crop}${scale},format=rgba,split[c][a];[c]${tone}format=yuv420p[g];[a]alphaextract[m];[g][m]alphamerge,format=yuva420p`
      : `${crop}${scale},${tone}format=yuv420p`;
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, ...(info.alpha ? ['-filter_complex', filter] : ['-vf', filter]), '-frames:v', '1', '-c:v', 'libwebp', '-quality', String(item.quality ?? 76), '-compression_level', '6', out]);
    console.log(`made ${item.id}-${w}.webp`);
  }
  const dims = probe(join(OUT, `${item.id}-${widths[0]}.webp`));
  sizes[item.id].ratio = +(dims.w / dims.h).toFixed(4);
}
writeFileSync(join(ROOT, 'assets/img/sizes.json'), JSON.stringify(sizes, null, 1));
console.log('sizes written to assets/img/sizes.json');
