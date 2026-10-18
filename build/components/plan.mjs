// The plan of Втузгородок, shared by the campus page and the institute pages: the ground (square,
// lawns, streets, landmark, passages) and a small locator with one building in its gem colour.
import { inkOn } from '../lib.mjs';
import { ROOMS } from '../rooms.mjs';
import { VIEW, STREETS, SQUARE, LAWNS, LINKS, LANDMARKS, BUILDINGS } from '../campus-plan.mjs';

export const paint = (r) => `--b:${r.color};--b-ink:${inkOn(r.color)}`;
const rect = ([x, y, w, h], cls) => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
export const meets = ([x, y, w, h], [vx, vy, vw, vh]) => x < vx + vw && x + w > vx && y < vy + vh && y + h > vy;

export const ground = (view) => [
  ...SQUARE.map((r) => rect(r, 'plan-square')),
  ...LAWNS.map((r) => rect(r, 'plan-lawn')),
  ...STREETS.filter((r) => meets(r, view)).map((r) => rect(r, 'plan-street')),
  ...LANDMARKS.map((l) => `<path class="plan-landmark" d="${l.d}"/>`),
  ...LINKS.map(([x1, y1, x2, y2]) => `<line class="plan-link-case" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><line class="plan-link" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`),
].join('');

// A small plan around one building: the same ground, this building in its colour, the rest quiet.
export const locator = (id) => {
  const [x, y, w, h] = BUILDINGS[id].box;
  const vw = Math.min(VIEW[2], Math.max(300, w * 2.4, (h * 2.4) / 0.75));
  const vh = vw * 0.75;
  const vx = Math.min(Math.max(x + w / 2 - vw / 2, VIEW[0]), VIEW[0] + VIEW[2] - vw);
  const vy = Math.min(Math.max(y + h / 2 - vh / 2, VIEW[1]), VIEW[1] + VIEW[3] - vh);
  const view = [vx, vy, vw, vh].map(Math.round);
  const near = ROOMS.filter((r) => meets(BUILDINGS[r.id].box, view));
  return `<svg class="plan plan-mini" viewBox="${view.join(' ')}" aria-hidden="true" focusable="false">${ground(view)}${near.map((r) => `<path class="plan-other${r.id === id ? ' is-on' : ''}" d="${BUILDINGS[r.id].d}"/>`).join('')}</svg>`;
};
