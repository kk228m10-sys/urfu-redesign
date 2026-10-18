// Turns the traced plan.json into build/campus-plan.mjs (run once; the map picture stays outside the repo).
import { readFileSync, writeFileSync } from 'node:fs';
const [, , planPath, outPath] = process.argv;
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const r = (n) => Math.round(n);
const pathOf = (polys) => polys.map((p) => 'M' + p.map(([x, y]) => `${r(x)} ${r(y)}`).join('L') + 'Z').join('');
const boxOf = (polys) => {
  const xs = polys.flat().map((q) => q[0]), ys = polys.flat().map((q) => q[1]);
  const x = r(Math.min(...xs)), y = r(Math.min(...ys));
  return [x, y, r(Math.max(...xs)) - x, r(Math.max(...ys)) - y];
};
// Where each letter sits and how big it is; out: the building is too narrow, the letter stands beside it
// in ink (anchored at its start unless told otherwise).
const LABEL = {
  guk: [762, 380, 30], e: [645, 211, 28], m: [780, 233, 17], sp: [598, 141, 18, 1], s: [465, 152, 25],
  i: [648, 498, 21], t: [828, 640, 30], f: [484, 652, 28], h: [116, 601, 26], mt: [287, 636, 22, 1, 'middle'], r: [321, 852, 30],
};
const B = {};
for (const [id, b] of Object.entries(plan.buildings)) {
  if (id === 'suv') continue;
  const [x, y, size, out, anchor] = LABEL[id];
  B[id] = { d: pathOf(b.polys), box: boxOf(b.polys), label: { x, y, size, ...(out ? { out: true } : {}), ...(anchor ? { anchor } : {}) } };
}
const rects = (list) => list.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h${-w}Z`).join('');
const SUV = rects([[84, 70, 24, 115], [84, 141, 106, 19], [154, 44, 34, 124], [154, 44, 117, 16], [237, 44, 34, 124], [154, 145, 117, 23], [268, 137, 72, 21], [315, 65, 25, 118]]);
const lawns = [...plan.park].map(([x0, y0, x1, y1]) => [x0, y0, x1 - x0, y1 - y0]);
const links = plan.links.map(([x1, y1, x2, y2]) => [r(x1), r(y1), r(x2), r(y2)]);
links[1] = [577, 178, 577, 194]; // СП–Э: the blob is short, its axis came out slanted

const out = `// Втузгородок as a plan, traced on 2026-10-18 from the campus map the author sent: the outlines of the
// buildings, their letters and the passages between them. Units are pixels of that map; north is up.
// Regenerate only from a newer map (tools/trace-plan.py, then tools/gen-plan.mjs).
export const VIEW = [40, 8, 860, 924];
export const STREETS = ${JSON.stringify([[364, 8, 52, 924], [866, 8, 24, 924], [40, 210, 324, 16], [40, 506, 324, 14], [66, 210, 14, 310], [40, 343, 40, 19]])};
export const SQUARE = ${JSON.stringify([[80, 226, 284, 280], [416, 226, 292, 276]])};
export const LAWNS = ${JSON.stringify(lawns)};
export const LINKS = ${JSON.stringify(links)};
export const LANDMARKS = [{ name: 'Суворовское училище', d: '${SUV}', label: [212, 104] }];
export const NAMES = [
  { text: 'улица Мира', x: 390, y: 780, rotate: -90 },
  { text: 'Софьи Ковалевской', x: 878, y: 700, rotate: -90 },
  { text: 'площадь Кирова', x: 222, y: 370 },
  { text: 'пр. Ленина', x: 44, y: 336, anchor: 'start', minor: true },
];
export const BUILDINGS = ${JSON.stringify(B, null, 1)};
`;
writeFileSync(outPath, out);
console.log('written', outPath, (out.length / 1024).toFixed(1) + ' KB');
