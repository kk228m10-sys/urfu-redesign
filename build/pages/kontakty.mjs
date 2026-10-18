// Контакты. Argument: one number answers most questions (contact centre) → find the right service or
// institute by typing → copy the number in one tap → where to come. Numbers from urfu.ru.
import { html, esc, readJSON } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits } from '../components/media.mjs';

const { institutes } = readJSON('src/data/institutes.json');
const SERVICES = [
  { name: 'Контакт-центр', note: 'любой вопрос, звонок по России бесплатный', phone: '8 800 100-50-44', email: 'contact@urfu.ru' },
  { name: 'Приёмная комиссия', note: 'Мира, 19, ГУК-100', phone: '+7 343 375-44-74', email: 'priem@urfu.ru' },
  { name: 'Справочная в Екатеринбурге', note: 'городской номер университета', phone: '+7 343 375-44-44' },
  { name: 'Техническая поддержка', note: 'личный кабинет, почта, Wi-Fi', phone: '+7 343 227-20-70' },
  { name: 'Пресс-служба', note: 'для журналистов', phone: '+7 343 375-97-33' },
  { name: 'Ошибка на сайте', note: 'опечатки и неработающие ссылки', email: 'site@urfu.ru' },
];
const ALL = [...SERVICES.map((s) => ({ ...s, kind: 'Служба' })), ...institutes.map((i) => ({ name: i.name, note: `${i.short} · ${i.address}`, phone: i.phone, kind: 'Институт' }))];
const PLACES = [
  { title: 'Главный учебный корпус', text: 'Мира, 19 — ректорат, приёмная комиссия, институты экономики и открытого образования, энергетические корпуса Э и Т.', photo: 'guk-front', alt: 'Главный учебный корпус на улице Мира' },
  { title: 'Здание на Ленина, 51', text: 'Уральский гуманитарный институт в центре города.', photo: 'urgu-2022', alt: 'Главное здание на проспекте Ленина, 51' },
];
const tel = (p) => 'tel:' + p.replace(/[^\d+]/g, '').replace(/^8/, '+7');

export default function () {
  const body = html`
${pageHead({
  section: 'universitet',
  lines: ['Контакты'],
  lead: 'Если не знаете, кому звонить, звоните в контакт-центр. Остальные номера — в справочнике ниже: начните вводить, кого ищете.',
  crumbs: [{ label: 'Контакты' }],
  actions: html`<a class="btn btn-red" href="tel:+78001005044">8 800 100-50-44 ${icon.arrow}</a><a class="btn btn-paper" href="mailto:contact@urfu.ru">contact@urfu.ru</a>`,
})}

<section class="dir field-paper" aria-labelledby="dir-title" data-directory>
  <div class="wrap">
    <div class="dir-top">
      <h2 class="sec-title" id="dir-title">Справочник</h2>
      <label class="dir-search">${icon.search}<span class="sr-only">Кого ищете</span><input type="search" placeholder="Кого ищете: приёмная, ИРИТ, поддержка…" autocomplete="off" data-dir-q></label>
    </div>
    <table class="dir-table">
      <caption class="sr-only">Службы и институты УрФУ: телефоны и почта</caption>
      <thead class="sr-only"><tr><th scope="col">Кто</th><th scope="col">Телефон</th><th scope="col">Почта</th></tr></thead>
      <tbody>
        ${ALL.map((c) => html`<tr class="dir-row" data-reveal data-text="${esc((c.name + ' ' + c.note + ' ' + c.kind).toLowerCase())}">
          <th scope="row"><span class="dir-name">${esc(c.name)}</span><span class="dir-note">${esc(c.note)}</span></th>
          <td>${c.phone ? html`<span class="dir-val"><a class="link-quiet nums" href="${tel(c.phone)}">${c.phone}</a><button class="dir-copy" type="button" data-copy="${c.phone}" aria-label="Скопировать номер ${c.phone}">${icon.copy}</button></span>` : ''}</td>
          <td>${c.email ? html`<span class="dir-val"><a class="link-quiet" href="mailto:${c.email}">${c.email}</a><button class="dir-copy" type="button" data-copy="${c.email}" aria-label="Скопировать адрес ${c.email}">${icon.copy}</button></span>` : ''}</td>
        </tr>`)}
      </tbody>
    </table>
    <p class="dir-empty lead" data-dir-empty hidden>Никого не нашли. Попробуйте короче или позвоните в контакт-центр.</p>
    <p class="dir-toast" role="status" aria-live="polite" data-toast></p>
  </div>
</section>

<section class="come field-ink" aria-labelledby="come-title">
  <div class="wrap">
    <h2 class="sec-title" id="come-title">Куда приходить</h2>
    <div class="come-grid">
      ${PLACES.map((p, i) => html`<article class="come-place" data-reveal style="--i:${i}">
        <figure class="come-photo">${img(p.photo, { alt: p.alt, sizes: '(min-width: 48em) 46vw, 100vw', cls: 'cover' })}</figure>
        <h3 class="come-title">${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
      </article>`)}
    </div>
    <div class="come-more">
      <figure class="come-small">${img('guk-columns', { alt: 'Вход в главный корпус', sizes: '30vw', cls: 'cover' })}</figure>
      <figure class="come-small">${img('guk-2022', { alt: 'Втузгородок с высоты', sizes: '30vw', cls: 'cover' })}</figure>
      <p class="lead">Код аудитории из расписания расшифрует карта кампуса: корпус, этаж и номер.</p>
      <a class="btn btn-paper" href="kampus.html">Карта кампуса ${icon.arrow}</a>
    </div>
  </div>
</section>`;

  return {
    file: 'kontakty.html',
    html: page({
      id: 'kontakty',
      title: 'Контакты УрФУ: службы, институты, адреса',
      description: 'Телефоны и почта служб и институтов Уральского федерального университета, контакт-центр 8 800 100-50-44 и адреса корпусов.',
      section: 'universitet',
      body,
      styles: ['kontakty.css'],
      scripts: ['kontakty.js'],
      credits: credits(['guk-front', 'urgu-2022', 'guk-columns', 'guk-2022']),
    }),
  };
}
