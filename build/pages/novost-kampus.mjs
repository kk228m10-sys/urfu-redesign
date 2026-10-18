// Лонгрид. Argument: an explainer built only from published facts → where it is → how many places →
// the move of October 2026 → what is there → sources. Reading progress, contents pinned at the side.
import { html, esc, num, readJSON } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits, isAi } from '../components/media.mjs';

const { items } = readJSON('src/data/news.json');
const PARTS = [
  { id: 'gde', title: 'Где он', body: ['Кампус строится в микрорайоне Новокольцовский, рядом с выставочным центром «Екатеринбург-Экспо». Корпуса стоят в стороне от исторического Втузгородка, поэтому тем, кто живёт в кампусе, а учится на Мира, стоит заранее спланировать дорогу.', 'Задумывали кампус к Всемирной летней универсиаде 2023 года. Универсиаду не провели, а корпуса остались университету и городу.'] },
  { id: 'mesta', title: 'Сколько мест', body: ['По проекту в общежитиях кампуса около 8 500 мест. Первые два студенческих корпуса, на 3 400 человек, заселили в 2024 году.', 'Сейчас в кампусе четыре общежития и гостиница — в путеводителях её называют НВК-3.'] },
  { id: 'pereezd', title: 'Переезд 2026 года', body: ['Осенью 2026 года заселение шло с 1 по 15 октября. В общежития 3 (гостиница), 4 и 5 заселяли с 1 октября, в общежития 1 и 2 — с 12 октября.', 'Первокурсникам места распределяют после студентов старших курсов: сначала на свободные места, затем — на те, что остались после первого этапа.'] },
  { id: 'chto', title: 'Что там есть', body: ['Кроме общежитий, на территории кампуса работает поликлиника и открываются учебные корпуса.', 'Как устроены этажи, кухни и прачечные, лучше смотреть на странице переезда: условия в разных корпусах отличаются.'] },
];
const SOURCES = [
  ['urfu.ru/ru/pereezd — переезд и сроки заселения', 'https://urfu.ru/ru/pereezd/'],
  ['campus.urfu.ru — новости кампуса', 'https://campus.urfu.ru/'],
  ['Википедия — «Уральский федеральный университет»', 'https://ru.wikipedia.org/wiki/Уральский_федеральный_университет'],
  ['E1.RU, 4 июля 2023 — «Новые общежития УрФУ в Новокольцовском»', 'https://www.e1.ru/text/education/2023/07/04/72457766/'],
];
const IMAGES = ['campus-new', 'campus-room', 'campus-cafe', ...items.slice(0, 3).map((n) => n.photo).filter(Boolean)];

export default function () {
  const body = html`
<div class="progress" aria-hidden="true"><span class="progress-bar" data-progress></span></div>
${pageHead({
  section: 'universitet',
  lines: ['Новый кампус'],
  lead: 'Что известно о кампусе УрФУ в Новокольцовском: где он, сколько там мест и как прошёл переезд осенью 2026 года. Только опубликованные факты, с источниками.',
  crumbs: [{ label: 'Новости', href: 'novosti.html' }, { label: 'Новый кампус' }],
})}

<figure class="art-hero shutter" data-reveal>${img('campus-new', { alt: 'Новые корпуса из стекла и бетона, вечер', sizes: '100vw', cls: 'cover', eager: true })}${isAi('campus-new') ? html`<figcaption class="photo-note">Иллюстрация</figcaption>` : ''}</figure>

<article class="art field-paper" aria-labelledby="page-title">
  <div class="art-grid wrap">
    <nav class="art-toc" aria-label="Содержание">
      <p class="art-toc-title">В материале</p>
      <ol class="art-toc-list" role="list">${PARTS.map((p) => html`<li><a class="link-quiet" href="#${p.id}" data-toc="${p.id}">${p.title}</a></li>`)}</ol>
      <p class="art-meta small">18 октября 2026 · 4 минуты чтения</p>
    </nav>
    <div class="art-body">
      ${PARTS.map((p, i) => html`
      <section class="art-part" id="${p.id}" aria-labelledby="h-${p.id}">
        <h2 class="art-h" id="h-${p.id}">${p.title}</h2>
        ${p.body.map((t, k) => html`<p data-reveal style="--i:${k}">${esc(t)}</p>`)}
        ${i === 1 ? html`<p class="art-figure" aria-label="около 8 500 мест по проекту"><span class="giant nums">${num(8500)}</span><span class="lead">мест в общежитиях по проекту</span></p>` : ''}
        ${i === 2 ? html`<figure class="art-photo">${img('campus-room', { alt: 'Комната на двоих в новом общежитии', sizes: '(min-width: 48em) 60vw, 100vw', cls: 'cover' })}<figcaption class="small">Комната в новом общежитии. Иллюстрация к материалу.</figcaption></figure>` : ''}
        ${i === 3 ? html`<figure class="art-photo">${img('campus-cafe', { alt: 'Столовая кампуса в обеденное время', sizes: '(min-width: 48em) 60vw, 100vw', cls: 'cover' })}<figcaption class="small">Обед в столовой кампуса. Иллюстрация к материалу.</figcaption></figure>` : ''}
      </section>`)}
      <section class="art-sources" aria-labelledby="src-title">
        <h2 class="art-h" id="src-title">Источники</h2>
        <ul class="art-src-list" role="list">${SOURCES.map(([t, u]) => html`<li><a class="link" href="${u}" target="_blank" rel="noopener">${esc(t)}</a></li>`)}</ul>
      </section>
    </div>
  </div>
</article>

<section class="more field-ink" aria-labelledby="more-title">
  <div class="wrap">
    <h2 class="sec-title" id="more-title">Ещё новости</h2>
    <ul class="more-list" role="list">
      ${items.slice(0, 3).map((n, i) => html`<li class="more-item" data-reveal style="--i:${i}"><a class="more-link" href="${n.url}" target="_blank" rel="noopener">${n.photo ? html`<span class="more-photo">${img(n.photo, { alt: '', sizes: '(min-width: 48em) 30vw, 100vw', cls: 'cover' })}</span>` : ''}<span class="more-title">${esc(n.title)}</span><span class="more-lead">${esc(n.lead)}</span></a></li>`)}
    </ul>
    <a class="btn btn-red" href="novosti.html">Все новости ${icon.arrow}</a>
  </div>
</section>`;

  return {
    file: 'novost-kampus.html',
    html: page({
      id: 'statya',
      title: 'Новый кампус УрФУ в Новокольцовском: что известно',
      description: 'Где находится новый кампус УрФУ, сколько в нём мест и как прошёл переезд осенью 2026 года. С источниками.',
      section: 'universitet',
      body,
      styles: ['statya.css'],
      scripts: ['statya.js'],
      credits: credits(IMAGES),
    }),
  };
}
