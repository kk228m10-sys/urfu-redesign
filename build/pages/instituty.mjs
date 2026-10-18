// Страницы институтов: the twelve institutes beside УралЭНИН (that one is drawn by hand). Argument:
// the institute and what it teaches (head, with its sign in its own pair of colours) → its building
// (a photograph, where one exists) → what it teaches, word by word → where it is: address, phone and
// the plan → one verb. Data: src/data/institutes.json (urfu.ru/ru/instituty), the plan of Втузгородок.
import { html, esc, readJSON } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits } from '../components/media.mjs';
import { ARM, STEM } from '../components/logo.mjs';
import { locator, paint } from '../components/plan.mjs';
import { ROOMS } from '../rooms.mjs';
import { INST_COLORS, COLOR_NAMES, COLOR_FIELD, INST_PLACE } from '../institutes.mjs';
import { fit } from '../fit.mjs';

const { institutes } = readJSON('src/data/institutes.json');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const sign = (arm, stem) => `<svg class="inst-mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path fill="${arm}" d="${ARM}"/><path fill="${stem}" d="${STEM}"/></svg>`;
const signNote = (arm, stem) => (arm === stem
  ? `Знак в цветах института: штрих и ножка ${COLOR_NAMES[arm][2]}`
  : `Знак в цветах института: штрих — ${COLOR_NAMES[arm][0]}, ножка — ${COLOR_NAMES[stem][1]}`);

function institutePage(i) {
  const [arm, stem] = INST_COLORS[i.id];
  const place = INST_PLACE[i.id] || {};
  const room = place.room ? ROOMS.find((r) => r.id === place.room) : null;
  const words = i.fields.split(',').map((w) => w.trim()).filter(Boolean);
  const em = Math.max(...words.map((w) => fit(cap(w))));
  const field = COLOR_FIELD[arm];
  const body = html`
${pageHead({
  section: 'universitet',
  lines: [i.short],
  lead: `${esc(i.name)}: ${esc(i.fields)}.`,
  crumbs: [{ label: 'Институты', href: 'index.html#instituty' }, { label: i.short }],
  cls: 'phead-inst',
  actions: html`<a class="btn btn-ink" href="programmy.html">Программы в каталоге ${icon.arrow}</a><a class="btn btn-paper" href="postupit.html">Как поступить</a>`,
  aside: html`<div class="inst-sign" aria-hidden="true">${sign(arm, stem)}<p class="inst-sign-note small">${signNote(arm, stem)}</p></div>`,
})}

${place.photo ? html`<figure class="inst-hero shutter" data-reveal>${img(place.photo, { alt: place.alt, sizes: '100vw', cls: 'cover', eager: true })}</figure>` : ''}

<section class="dirs field-${field}" aria-labelledby="fields-title">
  <h2 class="sr-only" id="fields-title">Чему учат в ${esc(i.short)}</h2>
  <ul class="dirs-list" role="list" style="--fit:${em.toFixed(3)}">
    ${words.map((w, n) => html`<li class="dir" data-reveal style="--i:${n}"><span class="dir-line"><span class="dir-word display">${esc(cap(w))}</span></span></li>`)}
  </ul>
  <p class="ii-more wrap" data-reveal>Направления и программы института — в <a class="link" href="programmy.html">каталоге</a>, а подобрать их под свои экзамены можно в <a class="link" href="index.html#podbor">подборе по ЕГЭ</a>.</p>
</section>

<section class="sec field-paper ii-place" aria-labelledby="place-title">
  <div class="wrap ii-place-grid">
    <div class="ii-place-text">
      <h2 class="sec-title" id="place-title">Где находится</h2>
      <p class="ii-address display" data-reveal>${esc(i.address)}</p>
      ${room ? html`<p class="lead" data-reveal style="--i:1">Корпус ${room.code}: ${esc(room.where)}.</p>` : ''}
      <p class="ii-phone" data-reveal style="--i:2">${i.phone ? html`<a class="link" href="tel:${i.phone.replace(/[^\d+]/g, '')}">${esc(i.phone)}</a>` : 'Телефон — в справочнике служб'}</p>
      <div class="phead-actions" data-reveal style="--i:3">${room ? html`<a class="btn btn-ink" href="kampus.html#${room.id}">Показать на плане ${icon.arrow}</a>` : ''}<a class="btn btn-paper" href="kontakty.html">Все контакты</a></div>
    </div>
    ${room ? html`<figure class="ii-plan" data-reveal style="${paint(room)};--i:1">${locator(room.id)}<figcaption class="small">Корпус ${room.code} на плане Втузгородка</figcaption></figure>` : ''}
  </div>
</section>

<a class="band field-red" href="postupit.html">
  <span class="band-note">Поступление в ${esc(i.short)}: сроки 2026 года, документы и подбор направления по ЕГЭ.</span>
  <span class="band-arrow" aria-hidden="true">${icon.arrow}</span>
  <span class="band-word giant" style="--fit:${fit('Поступить').toFixed(3)}">Поступить</span>
</a>`;

  return {
    file: `institut-${i.id}.html`,
    html: page({
      id: 'institut',
      title: `${i.name} — ${i.short} УрФУ`,
      description: `${i.name} УрФУ: чему учат, адрес, телефон и как найти корпус.`,
      section: 'universitet',
      body,
      styles: ['institut.css', 'plan.css', 'instituty.css'],
      credits: credits(place.photo ? [place.photo] : []),
    }),
  };
}

export default () => institutes.filter((i) => i.id !== 'uralenin').map(institutePage);
