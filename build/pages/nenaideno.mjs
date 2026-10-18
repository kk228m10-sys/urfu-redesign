// 404. The sign has lost its arm: put it back (drag, or press the button), then search for the page.
import { html } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { icon } from '../components/icons.mjs';
import { ARM, STEM } from '../components/logo.mjs';
import { img, credits } from '../components/media.mjs';

const LINKS = [
  ['Подбор программы по ЕГЭ', 'index.html#podbor'],
  ['Сроки приёма', 'postupit.html#sroki'],
  ['Расписание', 'raspisanie.html'],
  ['Где аудитория', 'kampus.html'],
  ['Новости', 'novosti.html'],
  ['Контакты', 'kontakty.html'],
];

export default function () {
  const body = html`
<section class="lost field-yellow" aria-labelledby="lost-title" data-lost>
  <div class="wrap lost-grid">
    <div class="lost-stage">
      <svg class="lost-svg" viewBox="-40 -10 180 150" role="img" aria-label="Знак УрФУ, у которого отвалился штрих" data-lost-svg>
        <path class="lost-stem" d="${STEM}"/>
        <path class="lost-slot" d="${ARM}"/>
        <path class="lost-arm" d="${ARM}" data-arm tabindex="-1"/>
      </svg>
      <p class="lost-hint small" data-lost-hint data-rise style="--i:5">Перетащите штрих на место</p>
    </div>
    <figure class="lost-photo" data-rise style="--i:3">${img('cutout-lost', { alt: 'Растерянный студент смотрит в развёрнутую карту и чешет затылок', sizes: '(min-width: 48em) 18vw, 40vw', cls: 'lost-cut' })}</figure>
    <div class="lost-text">
      <p class="lost-code giant nums" aria-hidden="true" data-rise style="--i:0">404</p>
      <h1 class="lost-title display" id="lost-title" data-rise style="--i:1">У нас такой страницы нет</h1>
      <p class="lead" data-rise style="--i:2">Возможно, её переименовали, когда мы пересобирали структуру сайта. Найдите нужное через поиск — он понимает и коды аудиторий.</p>
      <div class="lost-actions" data-rise style="--i:3">
        <button class="btn btn-ink" type="button" data-search-open>Искать ${icon.search}</button>
        <button class="btn btn-paper" type="button" data-fix>Собрать знак</button>
      </div>
      <ul class="lost-links" role="list">${LINKS.map(([t, h], i) => html`<li data-rise style="--i:${4 + i}"><a class="link" href="${h}">${t}</a></li>`)}</ul>
    </div>
  </div>
</section>`;

  return {
    file: '404.html',
    html: page({
      id: 'lost',
      title: 'Страница не найдена — УрФУ',
      description: 'Такой страницы нет. Поиск по сайту УрФУ и популярные разделы.',
      body,
      styles: ['lost.css'],
      scripts: ['lost.js'],
      vendor: ['gsap.min.js', 'Draggable.min.js'],
      credits: credits(['cutout-lost']),
    }),
  };
}
