// Афиша. Argument: what to sign up for and by when → the nearest date with a countdown → a wall of
// posters, one per event, the date as the headline → each goes into the phone's calendar in one tap.
import { html, esc, readJSON, jsonScript } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits } from '../components/media.mjs';

const { who: AUDIENCES, items } = readJSON('src/data/events.json');
// only the audiences that have events this month get a filter, so no chip leads to an empty wall
const who = AUDIENCES.filter((w) => items.some((e) => e.who === w));
const MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const parts = (iso) => { const [y, m, d] = iso.split('-').map(Number); return { y, m, d, month: MONTH[m - 1] }; };
const range = (e) => { const a = parts(e.from); if (!e.to) return `${a.d} ${a.month}`; const b = parts(e.to); return a.m === b.m ? `${a.d}–${b.d} ${b.month}` : `${a.d} ${a.month} — ${b.d} ${b.month}`; };
// Posters sort by the date that matters to the visitor: the end of what is already running, else the start.
const key = (e) => (e.to && e.from < '2026-10-18' ? e.to : e.from);
const sorted = [...items].sort((a, b) => key(a).localeCompare(key(b)));
const FIELDS = ['red', 'yellow', 'green', 'ink', 'paper'];
const PHOTOS = ['life-stage', 'news-datacenter', 'life-robotics', 'international', 'library'];

export default function () {
  const body = html`
${pageHead({
  section: 'zhizn',
  lines: ['Афиша'],
  lead: 'Конкурсы, конференции и наборы, на которые ещё можно успеть. Каждое событие — в календарь телефона одной кнопкой.',
  crumbs: [{ label: 'Афиша' }],
  actions: html`<div class="chips poster-filter" role="group" aria-label="Для кого" data-poster-filter>
    <button class="chip" type="button" data-who="all" aria-pressed="true">Всем</button>
    ${who.map((w) => html`<button class="chip" type="button" data-who="${w}" aria-pressed="false">${w}</button>`)}
  </div>`,
})}

<section class="posters field-ink" aria-label="События" data-posters>
  <ul class="poster-wall" role="list">
    ${sorted.map((e, i) => {
      const a = parts(key(e));
      const photo = i % 3 === 1 ? PHOTOS[Math.floor(i / 3) % PHOTOS.length] : null;
      return html`<li class="poster field-${FIELDS[i % FIELDS.length]}${photo ? ' poster-has-photo' : ''}" data-who="${e.who}" data-from="${e.from}" data-to="${e.to || ''}" data-title="${esc(e.title)}" data-reveal style="--i:${i % 4}">
        ${photo ? html`<figure class="poster-photo">${img(photo, { alt: '', sizes: '(min-width: 48em) 33vw, 100vw', cls: 'cover' })}</figure>` : ''}
        <p class="poster-date"><span class="display">${a.d}</span><span class="poster-month">${a.month}${e.to && e.from < '2026-10-18' ? ', последний день' : ''}</span></p>
        <h2 class="poster-title">${esc(e.title)}</h2>
        <p class="poster-kind">${esc(e.kind)} · ${range(e)}</p>
        <p class="poster-left small" data-left></p>
        <div class="poster-actions">
          <button class="btn poster-ics" type="button" data-ics>В календарь ${icon.calendar}</button>
          <a class="link poster-more" href="${e.url}" target="_blank" rel="noopener">Подробнее</a>
        </div>
      </li>`;
    })}
  </ul>
  <p class="posters-empty wrap lead" data-posters-empty hidden>Для этой аудитории событий пока нет.</p>
</section>`;

  return {
    file: 'afisha.html',
    html: page({
      id: 'afisha',
      title: 'Афиша УрФУ: конкурсы, конференции, наборы',
      description: 'Ближайшие события Уральского федерального университета с датами, сроками заявок и добавлением в календарь.',
      section: 'zhizn',
      body,
      styles: ['afisha.css'],
      scripts: ['afisha.js'],
      vendor: ['gsap.min.js', 'Flip.min.js'],
      credits: credits(PHOTOS),
    }),
  };
}
