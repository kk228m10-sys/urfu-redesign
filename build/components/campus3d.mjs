// Data for the 3D campus (motion edition): the traced plan of Втузгородок, each building with its gem
// colour and a height, so src/scripts/campus3d.js can raise the plan into blocks with WebGL.
import { jsonScript } from '../lib.mjs';
import { ROOMS } from '../rooms.mjs';
import { VIEW, STREETS, SQUARE, LAWNS, LINKS, LANDMARKS, BUILDINGS } from '../campus-plan.mjs';

// storeys read as relative heights, not a survey: the main building and the tall heat-power block lead
const HEIGHT = { guk: 7.5, e: 5, m: 4, sp: 3, s: 5, i: 5, t: 11, f: 6, h: 5.5, mt: 5.5, r: 6.5 };

export const campus3dData = () =>
  jsonScript('campus3d-data', {
    view: VIEW,
    streets: STREETS,
    square: SQUARE,
    lawns: LAWNS,
    links: LINKS,
    landmarks: LANDMARKS.map((l) => ({ d: l.d, name: l.name })),
    rooms: ROOMS.map(({ id, code, name, address, who, where, color }) => ({ id, code, name, address, who, where, color, d: BUILDINGS[id].d, box: BUILDINGS[id].box, h: HEIGHT[id] || 5 })),
  });
