// Жизнь. Argument: where you will live (dorms: the numbers and the real 2026 schedule) → where you
// will move (sport) → where you will make things (creative collectives) → whom you will do it with
// (student organisations) → what is on (the events). Numbers: urfu.ru «Об УрФУ в цифрах», urfu.ru/ru/pereezd.
import { html, esc, num } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits } from '../components/media.mjs';

const ORGS = [
  ['Союз студентов УрФУ', 'студенческое самоуправление и проекты'],
  ['Объединённый совет обучающихся', 'голос студентов в решениях университета'],
  ['«Точка кипения» УрФУ', 'площадка для встреч, лекций и командной работы'],
  ['Волонтёрство', 'донорские акции, городские и экологические проекты'],
  ['Студенческий центр', 'клубы, творчество и досуг'],
  ['Премия «Студент года»', 'ежегодный конкурс для лучших студентов вуза'],
];
const IMAGES = ['life-dorm', 'campus-room', 'life-sport', 'life-stage', 'life-winter'];

export default function () {
  const body = html`
${pageHead({
  section: 'zhizn',
  lines: ['После пар'],
  lead: 'Общежития, спорт, сцена и люди, с которыми интересно. Всё, что делает пять лет на Урале временем, которое вспоминают.',
  crumbs: [{ label: 'Студенческая жизнь' }],
  aside: html`<figure class="phead-photo" data-rise style="--i:2">${img('life-winter', { alt: 'Студенты идут через заснеженную площадь', sizes: '(min-width: 48em) 30vw, 70vw', cls: 'cover', eager: true })}</figure>`,
})}

<section class="dorm field-paper" id="obshchezhitiya" aria-labelledby="dorm-title">
  <div class="wrap dorm-grid">
    <h2 class="sec-title dorm-title" id="dorm-title">Общежития</h2>
    <p class="dorm-num" aria-label="больше 13 800 мест"><span class="giant nums">${num(13800)}</span><span class="lead">мест для иногородних студентов в 18 общежитиях</span></p>
    <figure class="dorm-photo" data-reveal>${img('life-dorm', { alt: 'Студенты вместе готовят ужин на кухне общежития', sizes: '(min-width: 48em) 40vw, 100vw', cls: 'cover' })}</figure>
    <div class="dorm-text">
      <p>Места распределяют после зачисления. Осенью 2026 года первокурсников селили в два этапа: с 12 по 23 октября — на места, не занятые старшими курсами, с 26 октября по 6 ноября — на оставшиеся.</p>
      <p>Самые новые корпуса — в кампусе в Новокольцовском, там около 8 500 мест по проекту.</p>
      <div class="dorm-actions"><a class="btn btn-ink" href="novost-kampus.html">Про новый кампус ${icon.arrow}</a><a class="btn btn-paper" href="razdel-poselenie.html">Как подать заявку</a></div>
    </div>
  </div>
</section>

<section class="split field-red" id="sport" aria-labelledby="sport-title">
  <figure class="split-photo shutter" data-reveal>${img('life-sport', { alt: 'Студентка в прыжке над волейбольной сеткой', sizes: '(min-width: 48em) 60vw, 100vw', cls: 'cover' })}</figure>
  <div class="split-text">
    <h2 class="sec-title" id="sport-title">Спорт</h2>
    <p class="split-figure" data-reveal><span class="display nums">33</span> секции и команды</p>
    <p class="split-figure" data-reveal style="--i:1"><span class="display nums">20</span> спортивных объектов</p>
    <p>От волейбола до лёгкой атлетики — и сборные, которые выступают за университет.</p>
  </div>
</section>

<section class="split split-flip field-ink" id="tvorchestvo" aria-labelledby="art-title">
  <figure class="split-photo shutter" data-reveal>${img('life-stage', { alt: 'Студенческий спектакль в луче прожектора', sizes: '(min-width: 48em) 60vw, 100vw', cls: 'cover' })}</figure>
  <div class="split-text">
    <h2 class="sec-title" id="art-title">Сцена</h2>
    <p class="split-figure" data-reveal><span class="display nums">20</span> творческих коллективов</p>
    <p>Театр, танец, вокал и всё, что выходит на сцену актового зала главного корпуса.</p>
  </div>
</section>

<section class="sec field-yellow" aria-labelledby="orgs-title">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="sec-title" id="orgs-title">С кем</h2>
      <p class="sec-note">Объединения и проекты, куда можно прийти с первого курса.</p>
    </div>
    <ul class="orgs" role="list">
      ${ORGS.map(([t, d], i) => html`<li class="org" data-reveal style="--i:${i % 3}"><span class="org-name">${esc(t)}</span><span class="org-note">${esc(d)}</span></li>`)}
    </ul>
  </div>
</section>

<a class="band field-green" href="afisha.html">
  <span class="band-note">Конкурсы, фестивали и наборы этой осени — в афише.</span>
  <span class="band-arrow" aria-hidden="true">${icon.arrow}</span>
  <span class="band-word giant">Афиша</span>
</a>`;

  return {
    file: 'zhizn.html',
    html: page({
      id: 'zhizn',
      title: 'Студенческая жизнь УрФУ: общежития, спорт, творчество',
      description: '18 общежитий на 13 800 мест, 33 спортивные секции, 20 творческих коллективов и студенческие объединения УрФУ.',
      section: 'zhizn',
      body,
      styles: ['zhizn.css'],
      credits: credits(IMAGES),
    }),
  };
}
