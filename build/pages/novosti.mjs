// Новости. Argument: what happened this week, by day, like a newspaper spread → the lead story large
// → four days side by side, filterable by topic → the longread of the week. Real UrFU headlines.
import { html, esc, readJSON } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits, isAi } from '../components/media.mjs';

const { tags, items } = readJSON('src/data/news.json');
const MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const WEEKDAY = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const fmt = (iso) => { const d = new Date(iso + 'T12:00:00Z'); return { day: d.getUTCDate(), month: MONTH[d.getUTCMonth()], weekday: WEEKDAY[d.getUTCDay()] }; };
const [lead, ...rest] = items;
const days = [...new Set(rest.map((i) => i.date))].sort().reverse();
const IMAGES = ['campus-new', ...items.filter((i) => i.photo).map((i) => i.photo)];

const item = (n, i) => html`<li class="news" data-tag="${n.tag}" data-reveal style="--i:${i}">
  ${n.photo ? html`<figure class="news-photo">${img(n.photo, { alt: '', sizes: '(min-width: 64em) 24vw, 100vw', cls: 'cover' })}</figure>` : ''}
  <h3 class="news-title"><a class="link-quiet" href="${n.url}" target="_blank" rel="noopener">${esc(n.title)}</a></h3>
  <p class="news-lead">${esc(n.lead)}</p>
  <p class="news-tag small">${n.tag} · на urfu.ru ${icon.arrow}</p>
</li>`;

export default function () {
  const L = fmt(lead.date);
  const body = html`
${pageHead({
  section: 'universitet',
  lines: ['Новости'],
  lead: 'Что происходит в УрФУ: наука, студенты, поступление. Каждая заметка открывает полную версию на urfu.ru.',
  crumbs: [{ label: 'Новости' }],
  actions: html`<div class="chips news-filter" role="group" aria-label="Темы" data-news-filter>
    <button class="chip" type="button" data-topic="all" aria-pressed="true">Все темы</button>
    ${tags.map((t) => html`<button class="chip" type="button" data-topic="${t}" aria-pressed="false">${t}</button>`)}
  </div>`,
})}

<section class="lead-story field-ink" aria-labelledby="lead-title" data-tag-block="${lead.tag}">
  <figure class="lead-photo shutter" data-reveal>${img(lead.photo, { alt: 'Абитуриентка задаёт вопрос голосовому помощнику в телефоне', sizes: '(min-width: 48em) 58vw, 100vw', cls: 'cover', eager: true })}</figure>
  <div class="lead-text">
    <p class="lead-date">${L.day} ${L.month}, ${L.weekday} · ${lead.tag}</p>
    <h2 class="lead-title" id="lead-title">${esc(lead.title)}</h2>
    <p class="lead">${esc(lead.lead)}.</p>
    <a class="btn btn-red" href="${lead.url}" target="_blank" rel="noopener">Читать на urfu.ru ${icon.arrow}</a>
  </div>
</section>

<section class="days field-paper" aria-label="Новости по дням" data-news>
  <div class="days-grid wrap">
    ${days.map((d) => { const f = fmt(d); return html`<section class="day-col" data-day-col aria-labelledby="d-${d}">
      <h2 class="day-head" id="d-${d}" data-reveal><span class="day-num display">${f.day}</span><span class="day-month">${f.month}, ${f.weekday}</span></h2>
      <ul class="day-news" role="list">${rest.filter((i) => i.date === d).map(item)}</ul>
    </section>`; })}
  </div>
  <p class="days-empty wrap lead" data-news-empty hidden>По этой теме на неделе новостей не было.</p>
</section>

<a class="longread field-yellow" href="novost-kampus.html">
  <figure class="longread-photo">${img('campus-new', { alt: 'Новые корпуса из стекла и бетона', sizes: '(min-width: 48em) 50vw, 100vw', cls: 'cover' })}${isAi('campus-new') ? html`<span class="photo-note">Иллюстрация</span>` : ''}</figure>
  <span class="longread-text">
    <span class="longread-title sec-title">Новый кампус</span>
    <span class="longread-sub lead">Что уже построено в Новокольцовском и сколько там мест.</span>
    <span class="longread-more">Читать ${icon.arrow}</span>
  </span>
</a>`;

  return {
    file: 'novosti.html',
    html: page({
      id: 'novosti',
      title: 'Новости УрФУ',
      description: 'Новости Уральского федерального университета за неделю: наука, студенты, поступление, партнёры.',
      section: 'universitet',
      body,
      styles: ['novosti.css'],
      scripts: ['novosti.js'],
      vendor: ['gsap.min.js', 'Flip.min.js'],
      credits: credits(IMAGES),
    }),
  };
}
