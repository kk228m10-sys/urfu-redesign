// История. Argument: one university that became two and then one again (the two lines) → each name
// change on its own line (stem = the polytechnic, arm = the classical university) → in 2011 the arm
// joins the stem at the angle of the sign → the sign itself. Dates: ru.wikipedia.org and urfu.ru.
import { html, esc, num } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits } from '../components/media.mjs';
import { mark } from '../components/logo.mjs';

// lane: 'one' — a single line; 'fork' — the arm leaves the stem; 'poly' / 'uni' — two lines run,
// the event belongs to one of them; 'merge' — the arm joins the stem.
const EVENTS = [
  { y: 1920, lane: 'one', title: 'Уральский университет', text: '19 октября Совнарком подписывает декрет об учреждении Уральского государственного университета в Екатеринбурге.' },
  { y: 1924, lane: 'one', title: 'Политехнический институт', text: 'Университет преобразован в Уральский политехнический институт — УПИ.' },
  { y: 1931, lane: 'fork', who: 'uni', title: 'Снова университет', text: 'Свердловский государственный университет воссоздан как отдельный вуз. Линий становится две.' },
  { y: 1934, lane: 'poly', title: 'Имени Кирова', text: 'Политех становится Уральским индустриальным институтом имени С. М. Кирова. Надпись с этим именем до сих пор на фасаде главного корпуса.', photo: 'guk-2022', alt: 'Фасад главного корпуса с надписью «Уральский политехнический институт имени С. М. Кирова»' },
  { y: 1936, lane: 'uni', title: 'Имени Горького', text: 'Университет получает имя А. М. Горького.' },
  { y: 1945, lane: 'uni', title: 'УрГУ', text: 'Новое название — Уральский государственный университет имени А. М. Горького.', photo: 'urgu-2022', alt: 'Главный корпус Уральского государственного университета на проспекте Ленина' },
  { y: 1948, lane: 'poly', title: 'Снова УПИ', text: 'Индустриальный институт возвращает имя Уральского политехнического.' },
  { y: 1992, lane: 'poly', title: 'Технический университет', text: 'УПИ становится Уральским государственным техническим университетом — УГТУ-УПИ.' },
  { y: 2008, lane: 'poly', title: 'Имени Ельцина', text: 'УГТУ-УПИ получает имя первого Президента России Б. Н. Ельцина.', photo: 'guk-columns', alt: 'Вход в главный корпус под вывеской с полным названием университета' },
  { y: 2009, lane: 'poly', title: 'Федеральный', text: 'На базе УГТУ-УПИ создан Уральский федеральный университет.' },
  { y: 2011, lane: 'merge', title: 'Один университет', text: 'УрГУ присоединяется к УрФУ. Тонкая линия входит в толстую — так, как сходятся штрихи буквы «У».', photo: 'guk-entrance', alt: 'Памятная табличка у входа в главный учебный корпус' },
  { y: 2020, lane: 'one', title: 'Сто лет', text: 'Университет отмечает столетие.' },
  { y: 2024, lane: 'one', title: 'Новый кампус', text: 'Заселены первые студенческие корпуса нового кампуса — на 3 400 мест.' },
  { y: 2026, lane: 'one', title: 'Сегодня', text: `${num(50000)} студентов, 13 институтов и 358 образовательных программ.`, photo: 'guk-night', alt: 'Главный учебный корпус зимним вечером' },
];
const IMAGES = EVENTS.filter((e) => e.photo).map((e) => e.photo);

export default function () {
  const body = html`
${pageHead({
  section: 'universitet',
  lines: ['История', 'с 1920 года'],
  lead: 'Один университет, который стал двумя и снова одним. Прокручивайте: две линии нарисуют знак «У».',
  crumbs: [{ label: 'История' }],
  actions: html`<div class="tl-legend small"><p><span class="tl-key tl-key-stem"></span>толстая линия — политехнический: УПИ, потом УГТУ-УПИ</p><p><span class="tl-key tl-key-arm"></span>тонкая линия — классический: университет, потом УрГУ</p></div>`,
})}

<section class="tl field-paper" aria-labelledby="tl-title">
  <h2 class="sr-only" id="tl-title">Хронология</h2>
  <ol class="tl-list" role="list">
    ${EVENTS.map((e, i) => html`<li class="tl-ev tl-${e.lane}${e.lane === 'uni' || (e.lane === 'fork' && e.who === 'uni') ? ' is-uni' : ''}" style="--n:${i}">
      <div class="tl-rail" aria-hidden="true"><span class="tl-stem"></span><span class="tl-arm"></span><span class="tl-dot"></span></div>
      <div class="tl-body">
        <p class="tl-year display">${e.y}</p>
        <h3 class="tl-title">${esc(e.title)}</h3>
        <p class="tl-text">${esc(e.text)}</p>
        ${e.photo ? html`<figure class="tl-photo" data-reveal>${img(e.photo, { alt: e.alt, sizes: '(min-width: 48em) 40vw, 80vw', cls: 'cover' })}</figure>` : ''}
      </div>
    </li>`)}
  </ol>
</section>

<section class="sign field-red" aria-labelledby="sign-title">
  <div class="wrap sign-grid">
    <div class="sign-mark" data-reveal>${mark({ cls: 'sign-svg' })}</div>
    <div class="sign-text">
      <h2 class="sec-title" id="sign-title">Две линии — одна буква</h2>
      <p class="lead">Новый знак УрФУ нарисован из этой истории: тонкий штрих классического университета входит в тяжёлый штрих политеха и дальше идёт с ним одной линией.</p>
      <a class="btn btn-ink" href="brand.html">Как устроен знак ${icon.arrow}</a>
    </div>
  </div>
</section>

<section class="field-paper">
  <p class="wrap tl-source small">Хронология составлена по материалам статьи «Уральский федеральный университет» в Википедии и сайта urfu.ru. Перед публикацией даты стоит сверить с музеем истории УрФУ.</p>
</section>`;

  return {
    file: 'istoriya.html',
    html: page({
      id: 'istoriya',
      title: 'История УрФУ с 1920 года',
      description: 'Как Уральский университет стал политехом и классическим университетом, а в 2011 году — снова одним вузом. Хронология 1920–2026.',
      section: 'universitet',
      body,
      styles: ['istoriya.css'],
      credits: credits(IMAGES),
      footerField: 'ink',
    }),
  };
}
