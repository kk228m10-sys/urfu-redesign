// Страница программы 13.03.02. Argument: what this programme is and how to get in (head and facts) →
// the eight things graduates work on (index with preview) → the four departments, each one a room you
// can find on the map → who hires and trains you → who leads it → one verb.
import { html, esc, num, readJSON } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits } from '../components/media.mjs';
import { ROOMS } from '../rooms.mjs';

const P = readJSON('src/data/program-13-03-02.json');
const { programs, subjects } = readJSON('src/data/programs.json');
const calc = programs.find((p) => p.code === P.code);
const roomId = (code) => ROOMS.find((r) => code.startsWith(r.code + '-'))?.id;

const PHOTOS = [...new Set(P.areas.map((a) => a.photo))];
const IMAGES = ['program-powerlines', ...PHOTOS];

export default function () {
  const body = html`
${pageHead({
  section: 'postupit',
  lines: ['Электроэнергетика', 'и электротехника'],
  lead: `Бакалавриат Уральского энергетического института: сети, подстанции, приводы, машины и возобновляемая энергетика. Код ${P.code}.`,
  actions: html`<a class="btn btn-ink" href="postupit.html#podat">Подать документы ${icon.arrow}</a><a class="btn btn-paper" href="programmy.html#p-${P.code}">Все программы</a>`,
  crumbs: [{ label: 'Поступление', href: 'postupit.html' }, { label: 'Программы', href: 'programmy.html' }, { label: P.code }],
  aside: html`<figure class="phead-photo" data-rise style="--i:2">${img('program-powerlines', { alt: 'Опора высоковольтной линии на заснеженных холмах', sizes: '(min-width: 48em) 30vw, 70vw', cls: 'cover', eager: true })}</figure>`,
})}

<section class="facts" aria-label="Коротко о программе">
  <p class="fact field-yellow" data-reveal><span class="fact-big display">4 года</span><span class="fact-note">очно, по стандарту бакалавриата</span></p>
  <p class="fact field-ink" data-reveal style="--i:1"><span class="fact-big display">5 лет</span><span class="fact-note">заочно, до ${num(calc.cost)} ₽ в год</span></p>
  <p class="fact field-green" data-reveal style="--i:2"><span class="fact-big display">41</span><span class="fact-note">минимум по физике, она обязательна</span></p>
  <p class="fact field-paper" data-reveal style="--i:3"><span class="fact-big display">${P.areas.length}</span><span class="fact-note">областей, где работают выпускники</span></p>
</section>

<section class="sec field-paper areas" aria-labelledby="areas-title" data-index>
  <div class="wrap">
    <div class="sec-head">
      <h2 class="sec-title" id="areas-title">Чем займётесь</h2>
      <p class="sec-note">Восемь областей, в которых работают выпускники. Наведите на строку — покажем, как это выглядит.</p>
    </div>
    <div class="index">
      <ol class="index-list" role="list">
        ${P.areas.map((a, i) => html`<li class="index-row" data-photo="${i}" data-reveal style="--i:${i % 4}">
          <figure class="index-inline">${img(a.photo, { alt: a.title, sizes: '100vw', cls: 'cover' })}</figure>
          <span class="index-title">${esc(a.title)}</span>
        </li>`)}
      </ol>
      <div class="index-frame" aria-hidden="true">
        ${P.areas.map((a, i) => html`<figure class="index-pic${i === 0 ? ' is-on' : ''}" data-pic="${i}">${img(a.photo, { alt: '', sizes: '34vw', cls: 'cover' })}</figure>`)}
      </div>
    </div>
  </div>
</section>

<section class="depts" aria-labelledby="depts-title">
  <h2 class="sr-only" id="depts-title">Кафедры</h2>
  <div class="depts-grid">
    ${P.departments.map((d, i) => html`<article class="dept field-${['red', 'ink', 'yellow', 'green'][i]}" data-reveal style="--i:${i}">
      <h3 class="dept-name">Кафедра «${esc(d.name)}»</h3>
      <a class="dept-room display" href="kampus.html${roomId(d.room) ? '#' + roomId(d.room) : ''}" aria-label="Аудитория ${d.room} — показать на карте">${d.room}</a>
      <p class="dept-contacts"><a class="link" href="tel:${d.phone.replace(/[^\d+]/g, '')}">${d.phone}</a>${d.email ? html`<br><a class="link" href="mailto:${d.email}">${d.email}</a>` : ''}</p>
    </article>`)}
  </div>
</section>

<section class="sec field-paper partners" aria-labelledby="partners-title">
  <div class="wrap partners-grid">
    <h2 class="sec-title" id="partners-title">Кто вас ждёт</h2>
    <div class="partners-names">
      ${P.partners.map((p) => html`<p class="partner" data-reveal>${esc(p)}</p>`)}
    </div>
    <div class="partners-how">
      <p class="lead">Партнёры программы:</p>
      <ul class="partners-list" role="list">${P.cooperation.map((c) => html`<li>${esc(c)}</li>`)}</ul>
    </div>
  </div>
</section>

<section class="sec field-yellow exams" aria-labelledby="exams-title">
  <div class="wrap exams-grid">
    <h2 class="sec-title" id="exams-title">Экзамены</h2>
    <dl class="exams-list">
      ${Object.entries(calc.req).map(([k, v]) => html`<div class="exam"><dt>${subjects[k]}</dt><dd class="display">${v}</dd><dd class="exam-note">обязательно</dd></div>`)}
      ${Object.entries(calc.choice).map(([k, v]) => html`<div class="exam"><dt>${subjects[k]}</dt><dd class="display">${v}</dd><dd class="exam-note">или другой предмет на выбор</dd></div>`)}
    </dl>
    <p class="exams-more">Есть и программы базового высшего образования: ${P.basic.map((b) => `«${b}»`).join(' и ')}.</p>
  </div>
</section>

<section class="field-ink" aria-labelledby="head-title">
  <div class="wrap callout">
    <h2 class="callout-title" id="head-title">Руководитель программы</h2>
    <div class="callout-body">
      <span>${P.head.name}, ${P.head.title}</span>
      <a href="kampus.html#e">Аудитория ${P.head.room}, ${P.head.address}</a>
    </div>
  </div>
</section>

<a class="band field-red" href="postupit.html#podat">
  <span class="band-note">Подать документы на «${P.name}» можно онлайн через Госуслуги или в ГУК-100.</span>
  <span class="band-arrow" aria-hidden="true">${icon.arrow}</span>
  <span class="band-word giant">Подать</span>
</a>`;

  return {
    file: 'programma-13-03-02.html',
    html: page({
      id: 'programma',
      title: `${P.code} ${P.name} — бакалавриат УрФУ`,
      description: `${P.name} в Уральском энергетическом институте УрФУ: чему учат, кафедры, партнёры, экзамены и стоимость.`,
      section: 'postupit',
      body,
      styles: ['programma.css'],
      scripts: ['programma.js'],
      credits: credits(IMAGES),
    }),
  };
}
