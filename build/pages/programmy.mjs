// Каталог программ. Argument: every bachelor and specialist programme on one page, grouped like an
// index → narrow it by the exams you take, the level and the price → each row opens with the exact
// minimums and cost. Real data from УрФУ's EGE calculator; works without script (everything listed).
import { html, esc, num, rub, readJSON, plural, jsonScript } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { UGSN, level } from '../ugsn.mjs';
import { programHref } from '../site.mjs';
import { img, credits } from '../components/media.mjs';

const { subjects, programs } = readJSON('src/data/programs.json');
const lower = (k) => subjects[k].toLowerCase();
const groups = Object.entries(
  programs.reduce((acc, p) => { (acc[p.code.slice(0, 2)] ||= []).push(p); return acc; }, {}),
).sort(([a], [b]) => a.localeCompare(b));

const row = (p, i) => html`
<li class="prog" data-reveal style="--i:${Math.min(i, 5)}" id="p-${p.code}" data-code="${p.code}" data-name="${esc(p.name.toLowerCase())}" data-level="${level(p.code) === 'Специалитет' ? 'spec' : 'bak'}" data-cost="${p.cost || 0}" data-req="${Object.keys(p.req).join(' ')}" data-choice="${Object.keys(p.choice).join(' ')}">
  <details class="prog-box">
    <summary class="prog-sum">
      <span class="prog-name">${esc(p.name)}</span>
      <span class="prog-meta"><span class="nums">${p.code}</span> · ${level(p.code).toLowerCase()} · ${Object.keys(p.req).filter((k) => k !== 'rus').map(lower).join(', ')} + ${Object.keys(p.choice).map(lower).join(' или ')}</span>
      <span class="prog-cost nums">${p.cost ? 'до ' + rub(p.cost) : 'цена уточняется'}</span>
      <span class="prog-sign" aria-hidden="true">${icon.plus}</span>
    </summary>
    <div class="prog-more">
      <dl class="prog-facts">
        <div><dt>Обязательно</dt><dd>${Object.entries(p.req).map(([k, v]) => `${subjects[k]} — от ${v}`).join('<br>')}</dd></div>
        <div><dt>Один на выбор</dt><dd>${Object.entries(p.choice).map(([k, v]) => `${subjects[k]} — от ${v}`).join('<br>')}</dd></div>
        <div><dt>Платно, в год</dt><dd>${p.cost ? 'до ' + rub(p.cost) : 'стоимость уточняется в приказе'}</dd></div>
      </dl>
      <div class="prog-actions">
        <a class="btn btn-ink" href="${programHref(p.code)}">Страница программы ${icon.arrow}</a>
        <a class="btn btn-paper" href="postupit.html#sroki">Сроки подачи</a>
      </div>
    </div>
  </details>
</li>`;

export default function () {
  const body = html`
${pageHead({
  section: 'postupit',
  lines: ['Программы'],
  lead: `${programs.length} ${plural(programs.length, ['направление', 'направления', 'направлений'])} бакалавриата и специалитета: экзамены, минимальные баллы и цена. Отметьте свои ЕГЭ — останется то, куда можно подать документы.`,
  crumbs: [{ label: 'Поступление', href: 'postupit.html' }, { label: 'Программы' }],
  aside: html`<figure class="phead-photo" data-rise style="--i:2">${img('guk-winter', { alt: 'Учебный корпус УрФУ зимой', sizes: '(min-width: 48em) 30vw, 70vw', cls: 'cover', eager: true })}</figure>`,
})}

<section class="cat field-paper" aria-label="Каталог" data-catalog>
  <form class="cat-filters wrap" data-filters role="search" aria-label="Фильтры каталога" onsubmit="return false">
    <label class="cat-search">
      ${icon.search}
      <span class="sr-only">Название или код</span>
      <input type="search" name="q" placeholder="Название или код, например «09.03»" autocomplete="off" data-q>
    </label>
    <fieldset class="chips cat-ege">
      <legend class="cat-legend">Мои ЕГЭ</legend>
      ${Object.entries(subjects).map(([k, label]) => html`<button class="chip" type="button" data-subject="${k}" aria-pressed="false">${label}</button>`)}
    </fieldset>
    <div class="cat-row">
      <fieldset class="chips">
        <legend class="cat-legend">Уровень</legend>
        <button class="chip" type="button" data-level="all" aria-pressed="true">Все</button>
        <button class="chip" type="button" data-level="bak" aria-pressed="false">Бакалавриат</button>
        <button class="chip" type="button" data-level="spec" aria-pressed="false">Специалитет</button>
      </fieldset>
      <fieldset class="chips">
        <legend class="cat-legend">Платно, в год</legend>
        <button class="chip" type="button" data-cost="0" aria-pressed="true">Любая цена</button>
        <button class="chip" type="button" data-cost="250000" aria-pressed="false">до 250 тыс.</button>
        <button class="chip" type="button" data-cost="300000" aria-pressed="false">до 300 тыс.</button>
      </fieldset>
      <label class="cat-sort">
        <span class="cat-legend">Порядок</span>
        <select data-sort>
          <option value="code">по коду</option>
          <option value="name">по алфавиту</option>
          <option value="cost">дешевле — выше</option>
        </select>
      </label>
    </div>
    <p class="cat-count" aria-live="polite"><strong data-count>${programs.length}</strong> <span data-count-word>${plural(programs.length, ['направление', 'направления', 'направлений'])}</span><button class="link cat-reset" type="button" data-reset hidden>Сбросить фильтры</button></p>
  </form>

  <div class="cat-groups wrap" data-groups>
    ${groups.map(([g, list]) => html`
    <section class="cat-group" data-group="${g}" aria-labelledby="g-${g}">
      <h2 class="cat-group-title" id="g-${g}" data-reveal>${UGSN[g] || ''} <span class="cat-group-code nums">${g}.00.00</span></h2>
      <ul class="cat-list" role="list">${list.map(row)}</ul>
    </section>`)}
    <p class="cat-empty lead" data-empty hidden>С таким набором ничего не нашлось. Уберите один фильтр: почти везде нужны русский и ещё два предмета.</p>
  </div>
</section>`;

  return {
    file: 'programmy.html',
    html: page({
      id: 'programmy',
      title: 'Каталог программ бакалавриата и специалитета — УрФУ',
      description: `${programs.length} направлений УрФУ с экзаменами ЕГЭ, минимальными баллами и стоимостью. Фильтр по предметам, уровню и цене.`,
      section: 'postupit',
      body,
      styles: ['programmy.css'],
      scripts: ['programmy.js'],
      vendor: ['gsap.min.js', 'Flip.min.js'],
      credits: credits(['guk-winter']),
    }),
  };
}
