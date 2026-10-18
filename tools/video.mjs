// The moving pictures: each clip in assets/images.json "videos" is cropped, toned like the photographs
// (black and white, same curve), looped by dissolving its last second into its first, and saved without
// sound as H.264 next to a WebP poster of its first frame.
//   node tools/video.mjs
import { readFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets/video');
const { videos = [] } = JSON.parse(readFileSync(join(ROOT, 'assets/images.json'), 'utf8'));
mkdirSync(OUT, { recursive: true });

const seconds = (file) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).trim());

for (const v of videos) {
  const src = join(ROOT, 'assets', v.src);
  if (!existsSync(src)) { console.log(`skip ${v.id}: no source yet (${v.src})`); continue; }
  const mp4 = join(OUT, `${v.id}.mp4`);
  const poster = join(OUT, `${v.id}.webp`);
  if (existsSync(mp4) && statSync(mp4).size > 0 && statSync(mp4).mtimeMs > statSync(src).mtimeMs && !process.argv.includes('--force')) { console.log(`${v.id}: up to date`); continue; }
  const fade = v.fade ?? 1;
  const length = Math.floor(seconds(src) * 100) / 100;
  const tone = `format=gray,eq=contrast=${v.contrast ?? 1.1}:brightness=${v.brightness ?? 0},format=yuv420p`;
  // [a] = everything after the first second, [b] = the first second; [a]'s end dissolves into [b],
  // so the last frame of the loop leads straight into its first.
  const graph = [
    `[0:v]${v.crop ? `crop=${v.crop},` : ''}${v.scale ? `scale=${v.scale}:flags=lanczos,` : ''}${tone},split[x][y]`,
    `[x]trim=${fade}:${length},setpts=PTS-STARTPTS[a]`,
    `[y]trim=0:${fade},setpts=PTS-STARTPTS[b]`,
    `[a][b]xfade=transition=fade:duration=${fade}:offset=${(length - 2 * fade).toFixed(2)},format=yuv420p[v]`,
  ].join(';');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-filter_complex', graph, '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(v.crf ?? 27), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '72', poster]);
  console.log(`made ${v.id}.mp4 (${(statSync(mp4).size / 1e6).toFixed(1)} MB, ${seconds(mp4).toFixed(1)} s) and ${v.id}.webp`);
}
