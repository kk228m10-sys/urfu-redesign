// Главная. Argument: you can get in (hero) → 9 855 free places (figure) → 13 institutes and where they
// are (list) → which programmes your exams open (the live finder) → life after classes (tiles) →
// four steps with the real 2026 dates (stairs) → one verb (band) → the phone number (footer).
import { html, esc, readJSON, num, rub, jsonScript, plural, MOTION } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { img, credits } from '../components/media.mjs';
import { icon } from '../components/icons.mjs';
import { STEPS } from '../admission.mjs';
import { programHref } from '../site.mjs';
import { motionHome } from '../motion/home.mjs';
import { campus3dData } from '../components/campus3d.mjs';

const { subjects, programs } = readJSON('src/data/programs.json');
const { institutes } = readJSON('src/data/institutes.json');
const { items: NEWS } = readJSON('src/data/news.json');
const { items: EVENTS } = readJSON('src/data/events.json');
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const dm = (iso) => { const [, m, d] = iso.split('-').map(Number); return { d, m: MONTHS[m - 1] }; };
const SOON = EVENTS.filter((e) => e.from >= '2026-10-18').sort((a, b) => a.from.localeCompare(b.from)).slice(0, 3);

// Lower-case subject names for running text: «математика от 40».
const lower = (k) => subjects[k].toLowerCase();
const req = (p) => Object.entries(p.req).map(([k, v]) => `${lower(k)} от ${v}`).join(', ');
const choice = (p) => Object.entries(p.choice).map(([k, v]) => `${lower(k)} от ${v}`).join(' или ');

// The finder starts with a real, common set so the slips are full on the first visit.
const START = ['rus', 'math', 'inf'];
const fits = (p, set) => Object.keys(p.req).every((k) => set.includes(k)) && Object.keys(p.choice).some((k) => set.includes(k));
const startList = programs.filter((p) => fits(p, START));

export const slip = (p, i) => html`
<li class="slip${i % 3 === 1 ? ' slip-tilt-l' : i % 3 === 2 && i > 2 ? ' slip-tilt-r' : ''}" style="--h:${[34, 42, 30, 44, 27, 38][i % 6]}">
  <a class="slip-body" href="${programHref(p.code)}">
    <span class="slip-name">${esc(p.name)}</span>
    <span class="slip-cut" aria-hidden="true">- - - - - - - - - - - - - - - - - - - - - -</span>
    <span>Код ${p.code}</span>
    <span>Обязательно: ${req(p)}</span>
    <span>На выбор: ${choice(p)}</span>
    <span>Платно: ${p.cost ? 'до ' + rub(p.cost) + ' в год' : 'стоимость уточняется'}</span>
  </a>
</li>`;

const GROUPS = [
  { title: 'Улица Мира', ids: ['isa', 'ineu', 'itoo', 'fti', 'inmit', 'hti', 'irit'] },
  { title: 'Софьи Ковалевской', ids: ['info', 'uralenin', 'upish'] },
  { title: 'Центр города', ids: ['ienim', 'ugi', 'ifksmp'] },
];
const inst = Object.fromEntries(institutes.map((i) => [i.id, i]));

const TILES = [
  { word: 'Жизнь', cap: 'после пар', head: true },
  { word: '18', cap: 'общежитий', href: 'zhizn.html#obshchezhitiya' },
  { photo: 'life-sport', alt: 'Студентка в прыжке над сеткой на волейбольной тренировке' },
  { word: '33', cap: 'спортивные секции', href: 'zhizn.html#sport' },
  { word: '20', cap: 'творческих коллективов', href: 'zhizn.html#tvorchestvo' },
  { photo: 'life-stage', alt: 'Студенческий спектакль: танцовщица в луче прожектора' },
  { word: '72', cap: 'страны вузов-партнёров' },
  { word: '164', cap: 'лаборатории', href: 'nauka.html#laboratorii' },
  { photo: 'life-dorm', alt: 'Студенты вместе готовят ужин на кухне общежития' },
  { word: num(5200), cap: 'иностранных студентов' },
  { word: 'Мира', cap: 'улица институтов', href: 'kampus.html' },
  { video: 'loop-snow', alt: 'Студенты идут вдоль колоннады под снегом' },
  { word: '3 млн', cap: 'книг в библиотеке' },
  { photo: 'life-robotics', alt: 'Двое студентов собирают робота в мастерской' },
  { word: num(13800), cap: 'мест в общежитиях', href: 'zhizn.html#obshchezhitiya' },
  { word: '1920', cap: 'год основания', href: 'istoriya.html' },
];
const PAIRS = ['red', 'yellow', 'green', 'paper'];


const IMAGES = ['hero-stairs', 'showcase-hall', 'cutout-applicant', ...TILES.filter((t) => t.photo).map((t) => t.photo)];

export default function () {
  let photoIndex = 0;
  const hero = html`
<section class="hero field-paper" aria-labelledby="hero-title">
  <div class="hero-grid wrap">
    <div class="hero-talk">
      <p class="hero-sentence" data-rise style="--i:0">358 программ и ${num(9855)} бюджетных мест. Подберём твою по ЕГЭ за минуту.</p>
      <a class="btn btn-ink hero-action" href="#podbor" data-rise style="--i:1">Подобрать программу ${icon.arrowDown}</a>
    </div>
    <h1 class="hero-title display lines" id="hero-title">
      <span class="line"><span data-line style="--i:0">У тебя</span></span>
      <span class="line"><span data-line style="--i:1">получится</span></span>
    </h1>
    <figure class="hero-photo">
      <div class="hero-photo-frame" data-parallax>
        ${img('hero-stairs', { alt: 'Трое студентов поднимаются по широкой каменной лестнице к корпусу с колоннами', sizes: '(min-width: 48em) 66vw, 100vw', eager: true, cls: 'cover', pos: '50% 38%' })}
      </div>
      <div class="hero-badge field-red" data-rise style="--i:2">
        <p class="hero-badge-num">106</p>
        <p>лет назад, 19 октября 1920 года, подписан декрет об основании университета.</p>
      </div>
    </figure>
  </div>
</section>

`;

  const figure = html`
<section class="figure-screen field-green" aria-labelledby="budget-title">
  <div class="wrap figure-wrap">
    <h2 class="figure-claim" id="budget-title" data-reveal>У нас бюджетных мест</h2>
    <div class="figure-bottom">
      <p class="giant nums figure-num" data-count="9855" aria-label="9 855">${num(9855)}</p>
      <p class="figure-caption" data-reveal>Столько мест в 2026 году оплачивает государство: на них учатся бесплатно. Как они делятся по направлениям, написано в плане приёма.</p>
    </div>
    <p class="figure-source small">Источник: urfu.ru, «Об УрФУ в цифрах», сентябрь 2026</p>
  </div>
</section>`;

  const lineup = html`
<section class="lineup field-paper" id="instituty" aria-labelledby="inst-title">
  <h2 class="sr-only" id="inst-title">Институты и их адреса</h2>
  <div class="wrap">
    <table class="lineup-table">
      <caption class="sr-only">Тринадцать институтов УрФУ: чему учат, где находятся и как позвонить</caption>
      <thead class="sr-only"><tr><th scope="col">Институт</th><th scope="col">Чему учат</th><th scope="col">Адрес</th><th scope="col">Телефон</th></tr></thead>
      ${GROUPS.map(
        (g) => html`
      <tbody>
        <tr class="lineup-group"><th colspan="4" scope="colgroup"><span>${g.title}</span></th></tr>
        ${g.ids.map((id, r) => {
          const i = inst[id];
          return html`<tr class="lineup-row" data-reveal style="--i:${r}">
          <th scope="row"><a class="link-quiet" href="institut-${id}.html"><abbr title="${esc(i.name)}">${esc(i.short)}</abbr></a></th>
          <td>${esc(i.fields)}</td>
          <td>${esc(i.address)}</td>
          <td class="nums">${i.phone ? html`<a class="link-quiet" href="tel:${i.phone.replace(/[^\d+]/g, '')}">${esc(i.phone)}</a>` : '—'}</td>
        </tr>`;
        })}
      </tbody>`,
      )}
    </table>
  </div>
</section>`;

  const showcase = html`
<section class="showcase" id="podbor" aria-labelledby="finder-title" data-finder>
  <div class="showcase-photo">${img('showcase-hall', { alt: 'Читальный зал: студенты за длинными столами в полосах света из окон', sizes: '100vw', cls: 'cover', pos: '50% 30%' })}</div>
  <div class="showcase-talk wrap">
    <div class="showcase-column">
      <p class="showcase-text" data-reveal><strong id="finder-title">Подбор по ЕГЭ.</strong> Отметь предметы, которые сдаёшь, и внизу выедут направления, куда с ними берут.</p>
      <fieldset class="chips" data-reveal style="--i:1">
        <legend class="sr-only">Предметы ЕГЭ</legend>
        ${Object.entries(subjects).map(
          ([k, label]) => html`<button class="chip" type="button" data-subject="${k}" aria-pressed="${START.includes(k)}"${k === 'rus' ? ' disabled title="Русский язык нужен везде"' : ''}>${label}</button>`,
        )}
      </fieldset>
      <p class="showcase-count" aria-live="polite" data-reveal style="--i:2"><span data-finder-count>Подходит ${startList.length} ${plural(startList.length, ['направление', 'направления', 'направлений'])}</span>. <a class="link" href="programmy.html" data-finder-all>Все в каталоге</a></p>
    </div>
  </div>
  <ul class="slips" role="list" data-finder-slips aria-label="Подходящие направления">
    ${startList.slice(0, 6).map(slip)}
  </ul>
</section>`;

  const tiles = html`
<section class="tiles field-ink" aria-labelledby="life-title">
  <ul class="tiles-grid" role="list">
    ${TILES.map((t, i) => {
      if (t.video) {
        photoIndex++;
        return html`<li class="tile tile-photo" data-reveal style="--i:${i % 4}"><video class="cover" muted loop playsinline preload="none" poster="video/${t.video}.webp" aria-label="${t.alt}" data-loop><source src="video/${t.video}.mp4" type="video/mp4"></video></li>`;
      }
      if (t.photo) {
        photoIndex++;
        return html`<li class="tile tile-photo" data-reveal style="--i:${i % 4}">${img(t.photo, { alt: t.alt, sizes: '(min-width: 48em) 25vw, 50vw', cls: 'cover' })}</li>`;
      }
      const pair = PAIRS[(i - photoIndex) % PAIRS.length];
      const inner = html`<span class="tile-word display">${t.head ? html`<span id="life-title">${t.word}</span>` : t.word}</span><span class="tile-cap">${t.cap}</span>`;
      const Tag = t.head ? 'h2' : 'p';
      return html`<li class="tile field-${pair}" data-reveal style="--i:${i % 4}">${t.href ? html`<a class="tile-link" href="${t.href}">${inner}</a>` : html`<${Tag} class="tile-inner">${inner}</${Tag}>`}</li>`;
    })}
  </ul>
</section>`;

  const board = html`
<section class="week-board field-paper" aria-labelledby="board-title">
  <div class="wrap board-grid">
    <h2 class="sec-title board-title" id="board-title">У нас на неделе</h2>
    <ul class="board-news" role="list">
      ${NEWS.slice(0, 3).map((n, i) => { const t = dm(n.date); return html`<li class="board-item" data-reveal style="--i:${i}"><a class="board-link" href="${n.url}" target="_blank" rel="noopener"><span class="board-date">${t.d} ${t.m} · ${n.tag}</span><span class="board-text">${esc(n.title)}</span></a></li>`; })}
      <li><a class="link board-all" href="novosti.html">Все новости ${icon.arrow}</a></li>
    </ul>
    <ul class="board-events" role="list">
      ${SOON.map((e, i) => { const t = dm(e.from); return html`<li class="board-event field-${['yellow', 'red', 'ink'][i]}" data-reveal style="--i:${i}"><a class="board-event-link" href="afisha.html"><span class="board-day display">${t.d}</span><span class="board-month">${t.m}</span><span class="board-text">${esc(e.title)}</span><span class="board-kind">${esc(e.kind)}</span></a></li>`; })}
    </ul>
  </div>
</section>`;

  const stairs = html`
<section class="stairs field-green" aria-labelledby="steps-title">
  <h2 class="sr-only" id="steps-title">Как поступить</h2>
  <figure class="stairs-figure" data-reveal style="--i:2">${img('cutout-applicant', { alt: 'Выпускник в прыжке от радости, в руке телефон', sizes: '(min-width: 48em) 24vw, 60vw', cls: 'stairs-cut' })}</figure>
  <ol class="stairs-list wrap" role="list">
    ${STEPS.map(
      (s, i) => html`<li class="stair" style="--step:${i}">
      <p class="stair-line display">${s.line}</p>
      <p class="stair-text" data-reveal style="--i:1">${s.text}</p>
    </li>`,
    )}
  </ol>
</section>`;

  const band = html`
<a class="band field-red" href="postupit.html#podat">
  <span class="band-note">Документы принимают с 20 июня — онлайн через Госуслуги или в ГУК-100.</span>
  <span class="band-arrow" aria-hidden="true">${icon.arrow}</span>
  <span class="band-word giant">Подать</span>
</a>`;

  // the motion edition rebuilds the home page around the same working parts (finder, board, band)
  const body = MOTION ? motionHome({ figure, showcase, tiles, board, band }) : html`${hero}${figure}${lineup}${showcase}${tiles}${board}${stairs}${band}`;

  return {
    file: 'index.html',
    html: page({
      id: 'home',
      title: 'Уральский федеральный университет — УрФУ',
      description: '358 программ, 13 институтов и 9 855 бюджетных мест. Подбор направления по ЕГЭ, сроки приёма 2026, общежития и жизнь в УрФУ.',
      body,
      styles: MOTION ? ['home.css', 'motion-home.css'] : ['home.css'],
      scripts: MOTION ? ['finder.js', 'campus3d.js', 'mh.js'] : ['finder.js', 'home.js'],
      vendor: MOTION ? ['gsap.min.js', 'ScrollTrigger.min.js', 'three.min.js'] : ['gsap.min.js', 'ScrollTrigger.min.js'],
      data: jsonScript('finder-data', { subjects, programs, start: START }) + (MOTION ? campus3dData() : ''),
      credits: [...credits(IMAGES), 'видео со снегом в блоке «Жизнь» сгенерировано нейросетью'],
    }),
  };
}
