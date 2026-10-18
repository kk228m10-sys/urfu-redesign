// One index for the command palette: pages, programmes, institutes and room codes.
import { readJSON } from './lib.mjs';
import { SECTIONS, hrefOf, programHref } from './site.mjs';
import { RAZDELY } from './pages/razdely.mjs';
import { ROOMS } from './rooms.mjs';

export function searchIndex() {
  const items = [];
  const seen = new Set();
  for (const s of SECTIONS) {
    items.push({ t: s.label, s: 'Раздел', u: s.href, k: s.lead });
    for (const l of s.links) {
      const u = hrefOf(l);
      if (seen.has(l.label)) continue;
      seen.add(l.label);
      items.push({ t: l.label, s: s.label, u });
    }
  }
  const { programs } = readJSON('src/data/programs.json');
  for (const p of programs) items.push({ t: p.name, s: `Программа ${p.code}`, u: programHref(p.code), k: p.code });
  const { institutes } = readJSON('src/data/institutes.json');
  for (const i of institutes) items.push({ t: i.name, s: `Институт · ${i.short}`, u: `institut-${i.id}.html`, k: `${i.short} ${i.fields} ${i.address}` });
  for (const r of RAZDELY) if (!seen.has(r.title)) items.push({ t: r.title, s: 'Раздел', u: `razdel-${r.slug}.html`, k: r.lead });
  for (const r of ROOMS) items.push({ t: `Корпус «${r.code}»: ${r.name}`, s: `Аудитории ${r.code}-…`, u: `kampus.html#${r.id}`, k: `${r.code} ${r.address || r.where}`, room: r.code });
  return items;
}
