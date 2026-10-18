// Фирменный стиль. Argument: the sign and why it looks like this (construction) → how it is set with
// the name (lockups on the three grounds) → the colours and the type → colour as wayfinding (sections)
// → one sign, many institutes → it moves → the rules → the files.
import { html, esc, readJSON } from '../lib.mjs';
import { INST_COLORS } from '../institutes.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { mark, ARM, STEM } from '../components/logo.mjs';
import { SECTIONS } from '../site.mjs';
import { img, credits } from '../components/media.mjs';

const COLORS = [
  { name: 'Рубин', hex: '#E50046', role: 'знак, главные действия, «Поступить»', ink: '#FFFFFF', note: 'красный знака УрФУ' },
  { name: 'Чугун', hex: '#1D1D1B', role: 'текст, «Наука»', ink: '#E6E0D2', note: 'чёрный логотипа' },
  { name: 'Бумага', hex: '#E6E0D2', role: 'фон, «Университет»', ink: '#1D1D1B', note: 'тёплый серый, не белый' },
  { name: 'Изумруд', hex: '#22C278', role: '«Учиться»', ink: '#1D1D1B', note: 'олимпиада «Изумруд», уральский камень' },
  { name: 'Топаз', hex: '#FECE00', role: '«Жизнь»', ink: '#1D1D1B', note: 'жёлтый кнопок нынешнего сайта' },
];
// all thirteen institutes, each with its own pair of palette colours (build/institutes.mjs)
const INST = readJSON('src/data/institutes.json').institutes.map((i) => [i.short, ...INST_COLORS[i.id], i.id]);
const signSvg = (arm, stem, cls = '') => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><path fill="${arm}" d="${ARM}"/><path fill="${stem}" d="${STEM}"/></svg>`;

export default function () {
  const body = html`
${pageHead({
  section: 'universitet',
  lines: ['Знак', 'и стиль'],
  lead: 'Новый знак УрФУ — та же буква «У», что и сейчас: тонкий штрих и толстый. Мы убрали каллиграфию и хвост и собрали её из двух прямых, как в истории университета.',
  crumbs: [{ label: 'Фирменный стиль' }],
})}

<section class="construct field-red" aria-labelledby="construct-title">
  <div class="wrap construct-grid">
    <figure class="construct-figure" data-reveal>
      <svg class="construct-svg" viewBox="-12 -12 124 124" role="img" aria-labelledby="construct-cap">
        <g class="construct-dots">${Array.from({ length: 121 }, (_, k) => `<rect x="${(k % 11) * 10 - 0.6}" y="${Math.floor(k / 11) * 10 - 0.6}" width="1.2" height="1.2"/>`).join('')}</g>
        <path class="construct-arm" d="${ARM}"/><path class="construct-stem" d="${STEM}"/>
        <line class="construct-guide" x1="62" y1="0" x2="14" y2="100"/><line class="construct-guide" x1="16" y1="0" x2="64" y2="100"/>
        <text class="construct-label" x="84" y="-3">наклон 1 : 0,48</text>
        <text class="construct-label" x="-10" y="58">штрих 14</text>
        <text class="construct-label" x="54" y="108">ножка 22</text>
      </svg>
      <figcaption id="construct-cap" class="small">Построение на сетке 100 × 100: оба штриха под одним углом (25,6°), штрих — 14 единиц, ножка — 22. Штрих входит в ножку на середине высоты.</figcaption>
    </figure>
    <div class="construct-text">
      <h2 class="sec-title" id="construct-title">Две линии — одна</h2>
      <p class="lead">Тонкий штрих — классический университет, толстая ножка — политех. В 2011 году они стали одним вузом, и штрих входит в ножку и дальше идёт с ней одной линией.</p>
      <p>Контраст тонкого и толстого — от нынешнего знака: его узнают. Новое — прямые срезы и общий угол наклона. Так знак рисуется из двух полос и легко анимируется.</p>
      <a class="btn btn-ink" href="istoriya.html">История двух линий ${icon.arrow}</a>
    </div>
  </div>
</section>

<section class="sec field-paper" aria-labelledby="lock-title">
  <div class="wrap">
    <div class="sec-head"><h2 class="sec-title" id="lock-title">С названием</h2><p class="sec-note">Знак всегда слева от названия. Свободное поле вокруг — не меньше ширины штриха.</p></div>
    <div class="locks">
      <div class="lock field-paper-2" data-reveal><span class="lock-row">${mark({ cls: 'lock-mark' })}<span class="lock-name">Уральский<br>федеральный</span></span><p class="small">Основной: для сайта, шапок и вывесок</p></div>
      <div class="lock field-red" data-reveal style="--i:1"><span class="lock-row lock-on-red">${mark({ cls: 'lock-mark' })}<span class="lock-name">УрФУ</span></span><p class="small">Короткий: для иконок, соцсетей, мерча</p></div>
      <div class="lock field-ink" data-reveal style="--i:2"><span class="lock-row lock-on-ink">${mark({ cls: 'lock-mark' })}<span class="lock-name">Ural Federal<br>University</span></span><p class="small">Английский: для международных материалов</p></div>
    </div>
  </div>
</section>

<section class="sec field-ink" aria-labelledby="color-title">
  <div class="wrap">
    <div class="sec-head"><h2 class="sec-title" id="color-title">Самоцветы и чугун</h2><p class="sec-note">Пять цветов, у каждого — один цвет текста на нём. Никаких градиентов и оттенков между ними.</p></div>
    <ul class="swatches" role="list">
      ${COLORS.map((c, i) => html`<li class="swatch" style="background:${c.hex};color:${c.ink};--i:${i}" data-reveal>
        <span class="swatch-name display">${c.name}</span>
        <span class="swatch-hex nums">${c.hex}</span>
        <span class="swatch-role">${c.role}</span>
        <span class="swatch-note small">${c.note}</span>
      </li>`)}
    </ul>
  </div>
</section>

<section class="sec field-paper" aria-labelledby="type-title">
  <div class="wrap type-grid">
    <h2 class="sec-title" id="type-title">Шрифты</h2>
    <div class="type-spec" data-reveal>
      <p class="type-sample display">Unbounded</p>
      <p>Заголовки, цифры, коды аудиторий. Только прописные, жирность 800, плотная разрядка. Широкий и «построенный», как конструктивистские вывески.</p>
      <p class="type-alpha display">АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 0123456789</p>
    </div>
    <div class="type-spec" data-reveal style="--i:1">
      <p class="type-sample type-text">Onest</p>
      <p>Весь остальной текст: 17–22 пикселя, межстрочный 1,5. Свободный шрифт с кириллицей, читается на телефоне.</p>
      <p class="type-alpha type-text">Абвгдеёжзийклмнопрстуфхцчшщъыьэюя 0123456789</p>
    </div>
  </div>
</section>

<section class="sec field-yellow" aria-labelledby="sections-title">
  <div class="wrap">
    <div class="sec-head"><h2 class="sec-title" id="sections-title">Цвет — это раздел</h2><p class="sec-note">Пять разделов новой навигации, у каждого свой цвет шапки. По цвету видно, где вы, даже не читая.</p></div>
    <ul class="sec-colors" role="list">
      ${SECTIONS.map((s, i) => html`<li class="sec-color field-${s.field}" data-reveal style="--i:${i}"><a class="sec-color-link" href="${s.href}"><span class="sec-color-name">${s.label}</span><span class="small">${esc(s.lead)}</span></a></li>`)}
    </ul>
  </div>
</section>

<section class="sec field-paper" aria-labelledby="inst-title">
  <div class="wrap">
    <div class="sec-head"><h2 class="sec-title" id="inst-title">Знаки институтов</h2><p class="sec-note">Один знак на тринадцать институтов: каждый получает свою пару цветов для штриха и ножки. Буква та же, поэтому университет узнаётся всегда.</p></div>
    <ul class="insts" role="list">
      ${INST.map(([n, arm, stem, id], i) => html`<li class="inst" data-reveal style="--i:${i % 3}"><a class="inst-link" href="institut-${id}.html">${signSvg(arm, stem, 'inst-svg')}<span class="inst-name">${n}</span></a></li>`)}
    </ul>
  </div>
</section>

<section class="motion field-ink" aria-labelledby="motion-title" data-sign-motion>
  <div class="wrap motion-grid">
    <div class="motion-stage" aria-hidden="true">${mark({ cls: 'motion-mark' })}</div>
    <div class="motion-text">
      <h2 class="sec-title" id="motion-title">Знак движется</h2>
      <p class="lead">В анимации штрих приходит сверху и входит в ножку — та же история, за секунду. Так знак открывает видео и загрузку приложения.</p>
      <button class="btn btn-red" type="button" data-replay>Показать ещё раз ${icon.arrowRight}</button>
    </div>
  </div>
</section>

<section class="city field-paper" aria-labelledby="city-title">
  <div class="wrap">
    <div class="sec-head"><h2 class="sec-title" id="city-title">Знак в городе</h2><p class="sec-note">Визуализация для конкурса: как знак может выглядеть на корпусах. Фото — реальные, знак наложен.</p></div>
    <div class="city-grid">
      <figure class="city-shot city-a" data-reveal>${img('guk-front', { alt: 'Главный корпус с красным полотнищем нового знака между колоннами', sizes: '(min-width: 48em) 60vw, 100vw', cls: 'cover' })}<span class="city-flag" aria-hidden="true">${signSvg('#fff', '#fff')}</span><figcaption class="small">Полотнище между колоннами главного корпуса</figcaption></figure>
      <figure class="city-shot city-b" data-reveal style="--i:1">${img('guk-night', { alt: 'Главный корпус вечером со светящимся знаком на крыше', sizes: '(min-width: 48em) 38vw, 100vw', cls: 'cover' })}<span class="city-light" aria-hidden="true">${signSvg('#e50046', '#e50046')}</span><figcaption class="small">Световой знак на крыше</figcaption></figure>
      <figure class="city-shot city-c" data-reveal style="--i:2">${img('guk-columns', { alt: 'Вход в корпус с табличкой нового знака у дверей', sizes: '(min-width: 48em) 38vw, 100vw', cls: 'cover' })}<span class="city-plate" aria-hidden="true">${signSvg('#e50046', '#e50046')}<span>УрФУ</span></span><figcaption class="small">Табличка у входа</figcaption></figure>
      <figure class="city-shot city-d" data-reveal style="--i:3">${img('urgu-2022', { alt: 'Здание на Ленина, 51 с жёлтым баннером нового знака', sizes: '(min-width: 48em) 60vw, 100vw', cls: 'cover' })}<span class="city-banner" aria-hidden="true">${signSvg('#E50046', '#1D1D1B')}</span><figcaption class="small">Баннер на здании гуманитарного института</figcaption></figure>
    </div>
  </div>
</section>

<section class="sec field-paper" aria-labelledby="rules-title">
  <div class="wrap">
    <div class="sec-head"><h2 class="sec-title" id="rules-title">Нельзя</h2><p class="sec-note">Чтобы знак оставался знаком.</p></div>
    <ul class="rules" role="list">
      <li class="rule" data-reveal><span class="rule-demo">${signSvg('#E50046', '#E50046', 'rule-svg rule-squash')}</span>растягивать и сжимать</li>
      <li class="rule" data-reveal style="--i:1"><span class="rule-demo">${signSvg('#E50046', '#E50046', 'rule-svg rule-turn')}</span>поворачивать</li>
      <li class="rule" data-reveal style="--i:2"><span class="rule-demo rule-demo-busy">${signSvg('#E6E0D2', '#E6E0D2', 'rule-svg')}</span>ставить на пёструю фотографию без плашки</li>
      <li class="rule" data-reveal style="--i:3"><span class="rule-demo">${signSvg('#22C278', '#E50046', 'rule-svg')}</span>брать цвета не из палитры института</li>
    </ul>
    <div class="files">
      <p class="lead">Файлы знака</p>
      <a class="btn btn-ink" href="img/mark-red.svg" download>Знак красный, SVG</a>
      <a class="btn btn-ink" href="img/mark-ink.svg" download>Знак чёрный, SVG</a>
      <a class="btn btn-paper" href="img/favicon.svg" download>Иконка сайта, SVG</a>
    </div>
  </div>
</section>`;

  return {
    file: 'brand.html',
    html: page({
      id: 'brand',
      title: 'Фирменный стиль УрФУ: знак, цвета, шрифты',
      description: 'Новый знак Уральского федерального университета: построение, варианты, палитра «самоцветы и чугун», шрифты и правила.',
      section: 'universitet',
      body,
      styles: ['brand.css'],
      scripts: ['brand.js'],
      credits: credits(['guk-front', 'guk-night', 'guk-columns', 'urgu-2022']),
    }),
  };
}
