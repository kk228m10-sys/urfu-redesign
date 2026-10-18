// Наука. Argument: the scale (four numbers) → what the scientists are working on right now (topics
// from this week's news, a marquee and rows that open the story) → three places of science → how a
// student gets in (real competitions from the calendar). Numbers: urfu.ru «Об УрФУ в цифрах».
import { html, esc, num, readJSON } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits, isAi } from '../components/media.mjs';

const { items: news } = readJSON('src/data/news.json');
const byUrl = (u) => news.find((n) => n.url === u);
const TOPICS = [
  { word: 'Энергетика и ИИ', news: 'https://urfu.ru/ru/news/60310/', photo: 'program-powerlines' },
  { word: 'Центры данных', news: 'https://urfu.ru/ru/news/60348/', photo: 'news-datacenter' },
  { word: 'Археология', news: 'https://urfu.ru/ru/news/60306/', photo: 'science-microscope' },
  { word: 'Астрономия', news: 'https://urfu.ru/ru/news/60313/', photo: 'science-observatory' },
  { word: 'Редкие книги', news: 'https://urfu.ru/ru/news/60329/', photo: 'library' },
];
const PLACES = [
  { title: 'Коуровская астрономическая обсерватория', text: 'Обсерватория университета в лесу под Екатеринбургом: телескопы для наблюдений и практики студентов-астрономов.', photo: 'science-observatory', alt: 'Купол обсерватории в сосновом лесу ночью' },
  { title: 'Молодёжная лаборатория энергоснабжения', text: 'Новая лаборатория: учёные ищут, как с помощью ИИ управлять энергоснабжением удалённых территорий.', photo: 'program-renewables', alt: 'Двое инженеров с планшетом у солнечных панелей и ветряка в снегу' },
  { title: 'Отдел редких книг', text: 'Отделу 45 лет. На юбилейной выставке — книги Татищева и Демидовых.', photo: 'library', alt: 'Студент у стеллажей библиотеки' },
];
const START = [
  ['Премия губернатора для молодых учёных', 'приём заявок до 1 ноября'],
  ['Всероссийский инженерный конкурс', 'идёт до 1 декабря'],
  ['«Молодость.Наука» и «Инновационная звезда»', 'конкурсы из календаря УрФУ'],
];
const IMAGES = [...new Set([...TOPICS.map((t) => t.photo), ...PLACES.map((p) => p.photo)])];

export default function () {
  const marquee = TOPICS.map((t) => t.word).join(' · ') + ' · ';
  const body = html`
${pageHead({
  section: 'nauka',
  lines: ['Наука'],
  lead: `${num(164)} лаборатории, ${num(561)} доктор наук и 23 члена Российской академии наук. Ниже — о чём они пишут на этой неделе и как студенту попасть в науку.`,
  crumbs: [{ label: 'Наука' }],
  aside: html`<figure class="phead-photo" data-rise style="--i:2">${img('science-laser', { alt: 'Исследователь настраивает зеркала на оптическом столе, через тёмную комнату идут лучи лазера', sizes: '(min-width: 48em) 30vw, 70vw', cls: 'cover', eager: true })}</figure>`,
})}

<section class="nums-row field-paper" aria-label="Наука в цифрах">
  <p class="num-cell" data-reveal><span class="display">164</span><span>лаборатории с современным оборудованием</span></p>
  <p class="num-cell" data-reveal style="--i:1"><span class="display">561</span><span>доктор наук среди преподавателей</span></p>
  <p class="num-cell" data-reveal style="--i:2"><span class="display">23</span><span>члена РАН, действительные и корреспонденты</span></p>
  <p class="num-cell" data-reveal style="--i:3"><span class="display">10+</span><span>лабораторий ведут ведущие зарубежные учёные</span></p>
</section>

<section class="topics field-ink" aria-labelledby="topics-title">
  <div class="marquee" aria-hidden="true"><div class="marquee-track"><span class="display">${marquee}</span><span class="display">${marquee}</span></div></div>
  <div class="wrap">
    <h2 class="sec-title topics-title" id="topics-title">На этой неделе</h2>
    <ul class="topic-list" role="list">
      ${TOPICS.map((t, i) => { const n = byUrl(t.news); return html`<li class="topic" data-reveal style="--i:${i % 3}">
        <a class="topic-link" href="${t.news}" target="_blank" rel="noopener">
          <figure class="topic-photo">${img(t.photo, { alt: '', sizes: '(min-width: 48em) 18vw, 40vw', cls: 'cover' })}</figure>
          <span class="topic-word">${esc(t.word)}</span>
          <span class="topic-news">${esc(n.title)}</span>
          <span class="topic-go">${icon.arrow}</span>
        </a>
      </li>`; })}
    </ul>
  </div>
</section>

<section class="sec field-paper" id="laboratorii" aria-labelledby="places-title">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="sec-title" id="places-title">Где делают науку</h2>
      <p class="sec-note">Три места, о которых университет рассказывает в этом месяце.</p>
    </div>
    <div class="places">
      ${PLACES.map((p, i) => html`<article class="place" data-reveal style="--i:${i}">
        <figure class="place-photo">${img(p.photo, { alt: p.alt, sizes: '(min-width: 48em) 32vw, 100vw', cls: 'cover' })}${isAi(p.photo) ? html`<figcaption class="photo-note">Иллюстрация</figcaption>` : ''}</figure>
        <h3 class="place-title">${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
      </article>`)}
    </div>
  </div>
</section>

<section class="sec field-green" id="studentam" aria-labelledby="start-title">
  <div class="wrap start-grid">
    <h2 class="sec-title" id="start-title">Как студенту начать</h2>
    <ol class="start-steps" role="list">
      <li data-reveal><strong>Найти тему на кафедре.</strong> Научного руководителя ищут среди преподавателей своего направления — часто с курсовой.</li>
      <li data-reveal style="--i:1"><strong>Подать на конкурс.</strong> Сроки этой осени:</li>
    </ol>
    <ul class="start-list" role="list">${START.map(([t, d]) => html`<li data-reveal><span class="start-name">${esc(t)}</span><span>${esc(d)}</span></li>`)}</ul>
    <a class="btn btn-ink" href="afisha.html">Все конкурсы в афише ${icon.arrow}</a>
  </div>
</section>`;

  return {
    file: 'nauka.html',
    html: page({
      id: 'nauka',
      title: 'Наука в УрФУ: лаборатории, исследования, студенческая наука',
      description: '164 лаборатории, 561 доктор наук и 23 члена РАН. О чём пишут учёные УрФУ, где делают науку и как студенту начать.',
      section: 'nauka',
      body,
      styles: ['nauka.css'],
      credits: credits(['science-laser', ...IMAGES]),
    }),
  };
}
