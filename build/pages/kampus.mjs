// Карта кампуса. Argument: the code in the timetable is an address → type it and see where to go, on
// the real plan of Втузгородок (the live thing) → how to read any code (the code taken apart in giant
// type) → every building with its photograph, its letter, where it stands and who is in it, each with
// its own locator → the new campus. The plan is traced from the campus map the author sent
// (build/campus-plan.mjs); every building is painted in its own Ural gem, as on that map.
import { html, esc, jsonScript, inkOn } from '../lib.mjs';
import { paint, ground, locator } from '../components/plan.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits, isAi } from '../components/media.mjs';
import { ROOMS } from '../rooms.mjs';
import { VIEW, LANDMARKS, NAMES, BUILDINGS } from '../campus-plan.mjs';

const IMAGES = ['guk-front', 'guk-night', 'urgu', 'campus-new', ...ROOMS.filter((r) => r.photo).map((r) => r.photo)];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const code = (r) => {
  const { x, y, size, out, anchor } = BUILDINGS[r.id].label;
  return `<text class="plan-code${size < 22 ? ' is-small' : ''}" x="${x}" y="${y}" dy="0.36em" style="--s:${size}" text-anchor="${anchor || (out ? 'start' : 'middle')}">${r.code}</text>`;
};

const map = () => html`
<svg class="plan" viewBox="${VIEW.join(' ')}" role="group" aria-labelledby="map-title map-desc" data-map>
  <title id="map-title">План Втузгородка</title>
  <desc id="map-desc">Север сверху. Улица Мира идёт с севера на юг через площадь Кирова; главный учебный корпус стоит на её восточной стороне, фасадом к площади. Каждый корпус своего цвета и подписан буквой, как в расписании; розовые линии — переходы между корпусами.</desc>
  ${ground(VIEW)}
  ${NAMES.map((n) => `<text class="plan-name${n.minor ? ' is-minor' : ''}" x="${n.x}" y="${n.y}" text-anchor="${n.anchor || 'middle'}"${n.rotate ? ` transform="rotate(${n.rotate} ${n.x} ${n.y})"` : ''}>${n.text}</text>`)}
  ${LANDMARKS.map((l) => `<text class="plan-name" x="${l.label[0]}" y="${l.label[1]}" text-anchor="middle">${l.name.split(' ').map((w, i) => `<tspan x="${l.label[0]}" dy="${i ? '1.15em' : 0}">${w}</tspan>`).join('')}</text>`)}
  ${ROOMS.map((r, i) => html`<g class="plan-b" data-b="${r.id}" tabindex="0" role="button" aria-label="${esc(r.code)}: ${esc(r.name)}" style="--i:${i};${paint(r)}"><path d="${BUILDINGS[r.id].d}"/>${code(r)}</g>`)}
</svg>`;

const photo = (r, sizes) => (r.photo ? img(r.photo, { alt: r.alt, sizes, cls: 'cover' }) : '');

export default function () {
  const body = html`
${pageHead({
  section: 'uchitsya',
  lines: ['Где аудитория'],
  lead: 'Буква в коде аудитории — это корпус, первая цифра — этаж. Введите код из расписания, и мы покажем корпус на плане Втузгородка.',
  crumbs: [{ label: 'Карта кампуса' }],
})}

<section class="finder-room field-paper" aria-labelledby="room-title" data-rooms>
  <div class="wrap room-grid">
    <div class="room-side">
      <h2 class="sec-title" id="room-title">Код из расписания</h2>
      <form class="room-form" data-room-form onsubmit="return false">
        <label class="room-field">
          <span class="sr-only">Код аудитории</span>
          <input type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="Р-237" maxlength="9" data-room-input>
        </label>
        <p class="room-try small">Например: <button class="link" type="button" data-try="Р-237">Р-237</button>, <button class="link" type="button" data-try="ГУК-100">ГУК-100</button>, <button class="link" type="button" data-try="Э-205">Э-205</button></p>
      </form>
      <div class="room-result" aria-live="polite" data-room-result>
        <p class="room-hint">Начните вводить код — корпус загорится на плане. Или нажмите на корпус.</p>
      </div>
    </div>
    <figure class="map" data-reveal>
      ${map()}
      <figcaption class="map-note small">
        <span class="map-key"><svg viewBox="0 0 40 12" aria-hidden="true">${ROOMS.slice(0, 5).map((r, i) => `<rect x="${i * 8}" width="8" height="12" style="fill:${r.color}"/>`).join('')}</svg>корпуса УрФУ, у каждого свой цвет</span>
        <span class="map-key"><svg viewBox="0 0 20 12" aria-hidden="true"><rect y="2" width="20" height="8" class="map-key-case"/><rect y="4" width="20" height="4" class="map-key-link"/></svg>переход между корпусами</span>
        <span>Север сверху. Контуры корпусов сняты со схемы Втузгородка.</span>
      </figcaption>
    </figure>
  </div>
</section>

<section class="anatomy field-ink" aria-labelledby="anatomy-title">
  <div class="wrap">
    <h2 class="sr-only" id="anatomy-title">Как читать код аудитории</h2>
    <p class="anatomy-code display" aria-hidden="true"><span data-part="0">Р</span><span class="anatomy-dash">-</span><span data-part="1">2</span><span data-part="2">37</span></p>
    <ol class="anatomy-parts" role="list">
      <li data-reveal><span class="anatomy-key">Р</span> корпус — здесь радиофак на Мира, 32</li>
      <li data-reveal style="--i:1"><span class="anatomy-key">2</span> этаж — второй</li>
      <li data-reveal style="--i:2"><span class="anatomy-key">37</span> номер аудитории на этаже</li>
    </ol>
  </div>
</section>

<section class="sec field-paper" aria-labelledby="blocks-title">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="sec-title" id="blocks-title">Корпуса</h2>
      <p class="sec-note">Буквы — как в расписании и на схеме корпусов.</p>
    </div>
    <div class="blocks-lead">
      <p class="blocks-intro">Втузгородок вырос вокруг главного корпуса Уральского политехнического института. Учебные корпуса стоят на улице Мира и вокруг площади Кирова. ГУК, Э, М и И стоят вплотную друг к другу, а переходы ведут из С через СП в Э, из И — в Т и Ф, из Ф — на другую сторону Мира, в Мт. Каждый корпус на плане окрашен в свой уральский самоцвет: ГУК — рубин, Т — малахит, Р — аметист; по цвету его легко найти и в карточке ниже.</p>
      <div class="blocks-photos">
        <figure class="blocks-photo" data-reveal>${img('guk-front', { alt: 'Главный учебный корпус: колоннада со стороны площади Кирова', sizes: '(min-width: 48em) 26vw, 70vw', cls: 'cover' })}</figure>
        <figure class="blocks-photo" data-reveal style="--i:1">${img('guk-night', { alt: 'Главный учебный корпус вечером', sizes: '(min-width: 48em) 20vw, 55vw', cls: 'cover' })}</figure>
      </div>
    </div>
    <ul class="blocks" role="list">
      ${ROOMS.map((r, i) => html`<li class="block" id="${r.id}" data-reveal style="--i:${i % 3};${paint(r)}">
        <figure class="block-pic${r.photo ? ' has-photo' : ''}">${photo(r, '(min-width: 48em) 30vw, 100vw')}<span class="block-loc">${locator(r.id)}</span></figure>
        <p class="block-code"><span class="block-chip display">${r.code}</span><span class="block-gem">${r.gem}</span></p>
        <h3 class="block-name">${esc(r.name)}</h3>
        ${r.address || r.who ? html`<p class="block-meta">${esc([r.address, r.who].filter(Boolean).join(' · '))}</p>` : ''}
        <p class="block-where">${esc(cap(r.where))}.</p>
        <button class="link block-show" type="button" data-show="${r.id}">Показать на плане ${icon.arrow}</button>
      </li>`)}
      <li class="block block-far" data-reveal>
        <figure class="block-pic has-photo">${img('urgu', { alt: 'Здание на проспекте Ленина, 51', sizes: '(min-width: 48em) 30vw, 100vw', cls: 'cover' })}</figure>
        <p class="block-code"><span class="block-chip block-chip-far display">Ленина, 51</span></p>
        <h3 class="block-name">Уральский гуманитарный институт</h3>
        <p class="block-where">В центре города, отдельно от Втузгородка.</p>
      </li>
    </ul>
  </div>
</section>

<section class="newcampus field-yellow" aria-labelledby="new-title">
  <figure class="newcampus-photo">${img('campus-new', { alt: 'Новые корпуса из стекла и бетона, вечер', sizes: '(min-width: 48em) 58vw, 100vw', cls: 'cover' })}${isAi('campus-new') ? html`<figcaption class="photo-note">Иллюстрация</figcaption>` : ''}</figure>
  <div class="newcampus-text">
    <h2 class="sec-title" id="new-title">Новый кампус</h2>
    <p class="lead">В Новокольцовском строится новый кампус УрФУ: учебные корпуса, общежития и поликлиника на одной территории. Первые корпуса уже открыты.</p>
    <a class="btn btn-ink" href="novost-kampus.html">Как там живут ${icon.arrow}</a>
  </div>
</section>`;

  return {
    file: 'kampus.html',
    html: page({
      id: 'kampus',
      title: 'Где аудитория — карта кампуса УрФУ',
      description: 'Расшифровка кодов аудиторий УрФУ: корпус, этаж и номер. План Втузгородка с корпусами и переходами, фотографии корпусов, адреса и институты.',
      section: 'uchitsya',
      body,
      styles: ['plan.css', 'kampus.css'],
      scripts: ['kampus.js'],
      data: jsonScript('rooms-data', ROOMS.map(({ id, code, name, address, who, where, color, ...r }) => ({ id, code, name, address, who, where, color, ink: inkOn(color), photo: photo(r, '(min-width: 48em) 30vw, 100vw') }))),
      credits: credits(IMAGES),
    }),
  };
}
