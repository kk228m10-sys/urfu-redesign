// Институт: УралЭНИН. Argument: what this institute is for (head, with the sign in the institute's
// colours) → its four directions as one stacked poster, each a door into the catalogue → departments
// → partners → how to reach it. Real data from enin.urfu.ru and programs.edu.urfu.ru.
import { html, esc, readJSON, rub } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits } from '../components/media.mjs';
import { mark } from '../components/logo.mjs';
import { fit } from '../fit.mjs';
import { ROOMS } from '../rooms.mjs';
import { programHref } from '../site.mjs';

const { programs, subjects } = readJSON('src/data/programs.json');
const { institutes } = readJSON('src/data/institutes.json');
const P = readJSON('src/data/program-13-03-02.json');
const I = institutes.find((i) => i.id === 'uralenin');
const DIRS = [
  { code: '13.03.01', word: 'Теплоэнергетика' },
  { code: '13.03.02', word: 'Электроэнергетика', page: 'programma-13-03-02.html' },
  { code: '13.03.03', word: 'Энергомашиностроение' },
  { code: '14.05.02', word: 'Атомные станции' },
];
const EM = Math.max(...DIRS.map((d) => fit(d.word)));
const roomId = (code) => ROOMS.find((r) => code.startsWith(r.code + '-'))?.id;
const IMAGES = ['institute-turbine', 'program-hv-lab', 'guk-2022', 'program-panel-hands'];

export default function () {
  const body = html`
${pageHead({
  section: 'universitet',
  lines: ['УралЭНИН'],
  lead: `${I.name}: электро- и теплоэнергетика, энергомашиностроение и атомные станции. Бакалавриат, специалитет и базовое высшее образование.`,
  crumbs: [{ label: 'Институты', href: 'index.html#instituty' }, { label: 'УралЭНИН' }],
  cls: 'phead-inst',
  aside: html`<div class="inst-sign" aria-hidden="true">${mark({ cls: 'inst-mark' })}<p class="inst-sign-note small">Знак в цветах института: штрих — жёлтый, ножка — чёрная</p></div>`,
})}

<figure class="inst-hero shutter" data-reveal>${img('institute-turbine', { alt: 'Машинный зал электростанции с турбинами и фигурой инженера', sizes: '100vw', cls: 'cover', eager: true })}</figure>

<section class="dirs field-yellow" aria-labelledby="dirs-title">
  <h2 class="sr-only" id="dirs-title">Направления бакалавриата и специалитета</h2>
  <ul class="dirs-list" role="list" style="--fit:${EM.toFixed(3)}">
    ${DIRS.map((d, i) => {
      const p = programs.find((x) => x.code === d.code);
      const href = programHref(d.code);
      return html`<li class="dir" data-reveal style="--i:${i}">
        <a class="dir-link" href="${href}">
          <span class="dir-word display">${esc(d.word)}</span>
          <span class="dir-meta"><span class="nums">${d.code}</span> · ${esc(p ? p.name : '')} · ${p ? Object.keys(p.req).filter((k) => k !== 'rus').map((k) => subjects[k].toLowerCase()).join(', ') + ' + ' + Object.keys(p.choice).map((k) => subjects[k].toLowerCase()).join(' или ') : ''} · ${p && p.cost ? 'до ' + rub(p.cost) : 'цена уточняется'} ${icon.arrow}</span>
        </a>
      </li>`;
    })}
  </ul>
</section>

<section class="sec field-paper" aria-labelledby="kaf-title">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="sec-title" id="kaf-title">Кафедры</h2>
      <p class="sec-note">Четыре кафедры, которые ведут «Электроэнергетику и электротехнику». Код — это аудитория, по нему найдёте дверь.</p>
    </div>
    <ul class="kaf-list" role="list">
      ${P.departments.map((d, i) => html`<li class="kaf" data-reveal style="--i:${i}">
        <a class="kaf-room display" href="kampus.html${roomId(d.room) ? '?room=' + encodeURIComponent(d.room) + '#' + roomId(d.room) : ''}">${d.room}</a>
        <p class="kaf-name">${esc(d.name)}</p>
        <p class="kaf-phone"><a class="link" href="tel:${d.phone.replace(/[^\d+]/g, '')}">${d.phone}</a></p>
      </li>`)}
    </ul>
  </div>
</section>

<section class="inst-lab field-ink" aria-labelledby="lab-title">
  <figure class="inst-lab-photo" data-reveal>${img('program-hv-lab', { alt: 'Студент у высоковольтной установки в лаборатории', sizes: '(min-width: 48em) 55vw, 100vw', cls: 'cover' })}</figure>
  <div class="inst-lab-text">
    <h2 class="sec-title" id="lab-title">С кем работаете</h2>
    <p class="lead">${P.partners.join(' и ')} участвуют в программах института: дают проекты, места для практики и целевое обучение, берут выпускников на работу.</p>
  </div>
</section>

<section class="where field-paper" aria-labelledby="where-title">
  <div class="wrap">
    <h2 class="sec-title" id="where-title">Где учатся</h2>
    <div class="where-grid">
      <figure class="where-photo" data-reveal>${img('guk-2022', { alt: 'Главный корпус и Втузгородок с высоты', sizes: '(min-width: 48em) 58vw, 100vw', cls: 'cover' })}<figcaption class="small">Мира, 19: главный корпус, рядом корпуса Э и Т</figcaption></figure>
      <figure class="where-photo" data-reveal style="--i:1">${img('program-panel-hands', { alt: 'Руки собирают электрический щит управления', sizes: '(min-width: 48em) 38vw, 100vw', cls: 'cover' })}<figcaption class="small">Лабораторные — в корпусах института</figcaption></figure>
    </div>
  </div>
</section>

<section class="field-paper" aria-labelledby="inst-contacts">
  <div class="wrap callout">
    <h2 class="callout-title" id="inst-contacts">Как связаться</h2>
    <div class="callout-body">
      <a href="tel:${I.phone.replace(/[^\d+]/g, '')}">${I.phone}</a>
      <a href="mailto:enin@urfu.ru">enin@urfu.ru</a>
      <a href="kampus.html#e">${I.address}; корпуса Э и Т — Мира, 19</a>
    </div>
  </div>
</section>`;

  return {
    file: 'institut-uralenin.html',
    html: page({
      id: 'institut',
      title: 'Уральский энергетический институт — УралЭНИН УрФУ',
      description: 'Уральский энергетический институт УрФУ: направления, кафедры, партнёры и контакты.',
      section: 'universitet',
      body,
      styles: ['institut.css'],
      credits: credits(IMAGES),
    }),
  };
}
