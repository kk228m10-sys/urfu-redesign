// Поступление. Argument: everything for admission on one page, without PDFs → the summer calendar of
// 2026 (budget and paid, real dates from urfu.ru) → a checklist that remembers → two ways to apply →
// what it costs (range from the EGE calculator) → plain answers → who to call.
import { html, esc, num, readJSON } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { CONTACT } from '../site.mjs';
import { fit } from '../fit.mjs';
import { img, credits } from '../components/media.mjs';

const IMAGES = ['guk-night', 'guk-columns', 'urgu', 'plaque'];
const WAY_EM = Math.max(fit('ОНЛАЙН'), fit('ЛИЧНО'));

const { programs } = readJSON('src/data/programs.json');
const costs = programs.map((p) => p.cost).filter(Boolean);
const cheapest = programs.filter((p) => p.cost === Math.min(...costs));

// Source: urfu.ru/ru/applicant/docs-abiturient/kalendar-priema, bachelor and specialist, 2026.
const EVENTS = {
  budget: [
    { d: '2026-06-20', t: 'start', label: 'Начало приёма документов' },
    { d: '2026-07-15', t: 'deadline', time: '17:00', label: 'Конец приёма для экзаменов УрФУ и творческих испытаний' },
    { d: '2026-07-25', t: 'deadline', time: '17:00', label: 'Конец приёма по результатам ЕГЭ' },
    { d: '2026-08-01', t: 'consent', time: '14:00', label: 'Согласие на зачисление: приоритетный этап' },
    { d: '2026-08-03', t: 'order', label: 'Приказ: приоритетный этап (без экзаменов, квоты)' },
    { d: '2026-08-05', t: 'consent', time: '14:00', label: 'Согласие на зачисление: основной этап' },
    { d: '2026-08-07', t: 'order', label: 'Приказ: основной этап' },
    { d: '2026-08-09', t: 'consent', time: '14:00', label: 'Согласие на зачисление: дополнительный этап' },
    { d: '2026-08-11', t: 'order', label: 'Приказ: дополнительный этап' },
  ],
  paid: [
    { d: '2026-06-20', t: 'start', label: 'Начало приёма документов' },
    { d: '2026-07-23', t: 'deadline', time: '17:00', label: 'Конец приёма для экзаменов УрФУ' },
    { d: '2026-08-08', t: 'contract', label: 'Начало заключения договоров' },
    { d: '2026-08-19', t: 'contract', time: '17:00', label: 'Последний день заключения договоров' },
    { d: '2026-08-20', t: 'deadline', time: '17:00', label: 'Конец приёма по результатам ЕГЭ' },
  ],
};
const KIND = { start: 'Старт', deadline: 'Документы', consent: 'Согласие', order: 'Приказ', contract: 'Договор' };
const MONTHS = [['Июнь', 5], ['Июль', 6], ['Август', 7]];
const MONTH_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const day = (iso) => { const [, m, d] = iso.split('-').map(Number); return `${d} ${MONTH_GEN[m - 1]}`; };

function month([name, m]) {
  const first = new Date(Date.UTC(2026, m, 1));
  const days = new Date(Date.UTC(2026, m + 1, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // Monday first
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  const iso = (d) => `2026-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const ev = (set, d) => EVENTS[set].find((e) => e.d === iso(d));
  return html`
  <div class="cal-month" data-reveal>
    <p class="cal-name display">${name}</p>
    <table class="cal-grid">
      <caption class="sr-only">${name} 2026</caption>
      <thead><tr>${['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((w) => html`<th scope="col">${w}</th>`)}</tr></thead>
      <tbody>${rows.map((r) => html`<tr>${r.map((d) => {
        if (!d) return '<td></td>';
        const b = ev('budget', d), p = ev('paid', d);
        return html`<td><span class="cal-day" data-date="${iso(d)}"${b ? ` data-budget="${b.t}"` : ''}${p ? ` data-paid="${p.t}"` : ''}${b || p ? ` title="${esc((b || p).label)}"` : ''}>${d}</span></td>`;
      })}</tr>`)}</tbody>
    </table>
  </div>`;
}

const eventList = (set) => html`
<ol class="cal-list" role="list" data-cal-list="${set}"${set === 'paid' ? ' hidden' : ''}>
  ${EVENTS[set].map((e) => html`<li class="cal-event" data-date="${e.d}" data-kind="${e.t}">
    <span class="cal-event-date">${day(e.d)}${e.time ? html`<span class="cal-event-time">, ${e.time}</span>` : ''}</span>
    <span class="cal-event-kind">${KIND[e.t]}</span>
    <span class="cal-event-label">${e.label}</span>
  </li>`)}
</ol>`;

const STEPS = [
  ['Сдать ЕГЭ', 'Русский от 40 баллов и два предмета направления. Минимумы видно в подборе на главной.'],
  ['Выбрать направления', 'До пяти направлений в УрФУ и порядок приоритетов между ними.'],
  ['Собрать документы', 'Паспорт, аттестат или диплом колледжа, СНИЛС, документы о достижениях и льготах.'],
  ['Подать заявление', 'Через Госуслуги или лично в ГУК-100, с 20 июня.'],
  ['Следить за списками', 'Конкурсные списки обновляются на сайте во время приёма.'],
  ['Подать согласие', 'До 14:00 в день из календаря: 1, 5 или 9 августа, смотря по этапу.'],
  ['Заселиться', 'После приказа о зачислении — заявка на место в общежитии.'],
];

const FAQ = [
  ['Сколько направлений можно выбрать?', 'До пяти направлений подготовки в одном вузе. Внутри каждого можно указать несколько программ и расставить их по приоритету.'],
  ['Можно поступить без ЕГЭ?', 'Выпускники колледжей и иностранные граждане могут сдавать вступительные испытания УрФУ. Документы для этого принимают до 15 июля, 17:00.'],
  ['Что такое приоритеты?', 'Это порядок, в котором вы хотите учиться на выбранных программах. При зачислении проходите на ту, что выше в списке и куда хватает баллов.'],
  ['Где смотреть свои шансы?', 'В конкурсных списках на сайте во время приёма. До старта приёма ориентируйтесь на минимальные баллы в подборе и каталоге.'],
  ['Сколько стоит платное обучение?', `От ${num(Math.min(...costs))} до ${num(Math.max(...costs))} ₽ в год, смотря по направлению. Точная цена — в приказе о стоимости обучения.`],
  ['Дадут ли общежитие?', 'В УрФУ 18 общежитий, больше 13 800 мест для иногородних студентов. Заявку на заселение подают после зачисления.'],
  ['Что если я не успел подать согласие?', 'Тогда вы не зачислены на этом этапе. Следующий этап — в календаре выше: согласие можно подать до 14:00 в его день.'],
];

export default function () {
  const body = html`
${pageHead({
  section: 'postupit',
  lines: ['Поступление'],
  lead: 'Бакалавриат и специалитет: сроки, шаги, документы и деньги. Всё на одной странице, без PDF.',
  actions: html`<a class="btn btn-ink" href="index.html#podbor">Подобрать программу ${icon.arrow}</a><a class="btn btn-paper" href="programmy.html">Каталог программ</a>`,
  crumbs: [{ label: 'Поступление' }],
  aside: html`<figure class="phead-photo" data-rise style="--i:2">${img('guk-night', { alt: 'Главный учебный корпус зимним вечером', sizes: '(min-width: 48em) 30vw, 70vw', cls: 'cover', eager: true })}</figure>`,
})}

<section class="sec cal field-paper" id="sroki" aria-labelledby="cal-title">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="sec-title" id="cal-title">Сроки 2026</h2>
      <p class="sec-note">Приём 2026 года завершён. Сроки 2027 года появятся вместе с правилами приёма, а пока — как это было этим летом.</p>
    </div>
    <div class="cal-switch" role="group" aria-label="Чьи сроки показать">
      <button class="chip" type="button" data-cal-set="budget" aria-pressed="true">Бюджет</button>
      <button class="chip" type="button" data-cal-set="paid" aria-pressed="false">Платно</button>
    </div>
    <div class="cal-months" data-cal data-set="budget">${MONTHS.map(month)}</div>
    <ul class="cal-legend small" role="list">
      ${Object.entries(KIND).map(([k, v]) => html`<li><span class="cal-swatch" data-kind="${k}"></span>${v}</li>`)}
    </ul>
    <div class="cal-lists">${eventList('budget')}${eventList('paid')}</div>
  </div>
</section>

<section class="sec field-yellow" id="shagi" aria-labelledby="steps-title" data-checklist>
  <div class="wrap steps-grid">
    <div class="steps-side">
      <h2 class="sec-title" id="steps-title">Чек-лист</h2>
      <p class="steps-note">Отмечайте, что уже сделано. Отметки остаются в этом браузере — можно вернуться завтра.</p>
      <div class="meter" role="progressbar" aria-label="Сделано шагов" aria-valuemin="0" aria-valuemax="${STEPS.length}" aria-valuenow="0" data-meter><div class="meter-fill"></div></div>
      <p class="steps-count" data-count aria-live="polite">Сделано 0 из ${STEPS.length}</p>
      <figure class="steps-photo">${img('urgu', { alt: 'Здание Уральского гуманитарного института на проспекте Ленина, 51', sizes: '(min-width: 48em) 30vw, 100vw', cls: 'cover' })}</figure>
    </div>
    <ul class="check steps-list" role="list">
      ${STEPS.map(([t, d], i) => html`<li><label class="check-item" data-reveal style="--i:${i % 4}">
        <input type="checkbox" name="step-${i}" data-step="${i}">
        <span class="check-box" aria-hidden="true">${icon.check}</span>
        <span class="check-title">${t}</span>
        <span class="check-text">${d}</span>
      </label></li>`)}
    </ul>
  </div>
</section>

<section class="ways field-ink" id="podat" aria-labelledby="ways-title">
  <h2 class="sr-only" id="ways-title">Как подать документы</h2>
  <div class="ways-grid">
    <article class="way">
      <p class="way-word display" style="--fit:${WAY_EM}">Онлайн</p>
      <p class="way-text">Через Госуслуги, без поездки. Заявление, документы и согласие на зачисление — в личном кабинете.</p>
      <a class="btn btn-red" href="https://www.gosuslugi.ru/vuzonline" rel="noopener" target="_blank">Поступление онлайн на Госуслугах ${icon.arrow}</a>
    </article>
    <article class="way">
      <p class="way-word display" style="--fit:${WAY_EM}">Лично</p>
      <p class="way-text">Екатеринбург, Мира, 19, главный учебный корпус, аудитория ГУК-100. С собой — паспорт и документ об образовании.</p>
      <a class="btn btn-paper" href="kampus.html#guk">Как найти ГУК-100 ${icon.arrow}</a>
      <figure class="way-photo">${img('guk-columns', { alt: 'Вход в главный учебный корпус под надписью «Уральский федеральный университет»', sizes: '(min-width: 48em) 46vw, 100vw', cls: 'cover' })}</figure>
    </article>
  </div>
</section>

<section class="price field-green" id="stoimost" aria-labelledby="price-title">
  <div class="wrap price-wrap">
    <h2 class="price-title sec-title" id="price-title" data-reveal>Если платно</h2>
    <p class="price-figure giant nums" aria-label="от ${num(Math.min(...costs) / 1000)} до ${num(Math.max(...costs) / 1000)} тысяч рублей в год">${Math.min(...costs) / 1000}–${Math.max(...costs) / 1000}</p>
    <div class="price-notes">
      <p class="price-unit lead" data-reveal>тысяч рублей в год, смотря по направлению</p>
      <p data-reveal style="--i:1">Дешевле всего — ${cheapest.map((p) => `«${p.name}»`).join(' и ')}: до ${num(Math.min(...costs))} ₽ в год. Учёбу можно оплатить образовательным кредитом с господдержкой.</p>
      <p class="small" data-reveal style="--i:2">Источник: максимальная стоимость в калькуляторе ЕГЭ УрФУ, 2026.</p>
      <a class="btn btn-ink" href="programmy.html?sort=cost" data-reveal style="--i:3">Программы по цене ${icon.arrow}</a>
    </div>
  </div>
</section>

<section class="sec field-paper" id="voprosy" aria-labelledby="faq-title">
  <div class="wrap faq-grid">
    <div class="faq-side">
      <h2 class="sec-title" id="faq-title">Вопросы</h2>
      <figure class="faq-photo">${img('plaque', { alt: 'Мемориальная доска на гранитной стене главного корпуса', sizes: '(min-width: 48em) 28vw, 100vw', cls: 'cover' })}</figure>
    </div>
    <div class="faq">
      ${FAQ.map(([q, a], i) => html`<details class="faq-item"${i === 0 ? ' open' : ''}><summary class="faq-q">${q}${icon.plus}</summary><div class="faq-a"><p>${a}</p></div></details>`)}
    </div>
  </div>
</section>

<section class="field-red" aria-labelledby="call-title">
  <div class="wrap callout">
    <h2 class="callout-title" id="call-title">Приёмная комиссия</h2>
    <div class="callout-body">
      <a href="tel:+73433754474">${CONTACT.admissionsPhone}</a>
      <a href="mailto:priem@urfu.ru">priem@urfu.ru</a>
      <span>${CONTACT.admissionsAddress}</span>
    </div>
  </div>
</section>`;

  return {
    file: 'postupit.html',
    html: page({
      id: 'postupit',
      title: 'Поступление 2026 — УрФУ',
      description: 'Сроки приёма 2026 года, чек-лист абитуриента, как подать документы, стоимость и ответы на вопросы о поступлении в УрФУ.',
      section: 'postupit',
      body,
      styles: ['postupit.css'],
      scripts: ['postupit.js'],
      footerField: 'ink',
      credits: credits(IMAGES),
    }),
  };
}
