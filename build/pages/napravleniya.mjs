// Страницы направлений: one page for every programme of the UrFU EGE calculator (the 13.03.02 page is
// drawn by hand and is skipped here). Argument: the code and the name (head) → which exams and how many
// points (the receipt) → term, price and the lowest sum of points (facts) → the other programmes of
// the same group → how to apply in 2026 → one verb. Only the calculator's data is claimed.
import { html, esc, num, readJSON } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits } from '../components/media.mjs';
import { UGSN, level } from '../ugsn.mjs';
import { programHref } from '../site.mjs';
import { STEPS } from '../admission.mjs';
import { fit } from '../fit.mjs';

const { subjects, programs } = readJSON('src/data/programs.json');
const lower = (k) => subjects[k].toLowerCase();

// One picture for every group of programmes, from the generated series and the real buildings.
const GROUP_IMAGE = {
  '01': 'showcase-hall', '02': 'news-datacenter', '03': 'science-laser', '04': 'science-microscope', '05': 'program-renewables',
  '06': 'science-microscope', '08': 'bld-s', '09': 'news-datacenter', '10': 'news-datacenter', '11': 'life-robotics',
  '12': 'science-laser', '13': 'program-powerlines', '14': 'institute-turbine', '15': 'program-drive', '18': 'science-microscope',
  '19': 'science-microscope', '20': 'program-panel-hands', '21': 'program-renewables', '22': 'program-hv-lab', '23': 'program-drive',
  '27': 'program-panel-hands', '28': 'science-microscope', '29': 'library', '30': 'science-microscope', '33': 'science-microscope',
  '37': 'international', '38': 'showcase-hall', '39': 'international', '40': 'library', '41': 'international', '42': 'news-voice',
  '43': 'international', '44': 'showcase-hall', '45': 'library', '46': 'library', '47': 'library', '51': 'life-stage', '58': 'international',
};
const ALT = {
  'showcase-hall': 'Читальный зал: студенты за длинными столами', 'news-datacenter': 'Коридор между стойками серверов',
  'science-laser': 'Исследователь настраивает лазерную установку', 'science-microscope': 'Исследовательница у электронного микроскопа',
  'program-renewables': 'Инженеры у солнечных панелей и ветряка в снегу', 'bld-s': 'Строительный корпус на Мира, 17',
  'life-robotics': 'Студенты паяют плату и собирают робота', 'program-powerlines': 'Опора высоковольтной линии на заснеженных холмах',
  'institute-turbine': 'Машинный зал электростанции с турбинами', 'program-drive': 'Студент у стенда электропривода',
  'program-panel-hands': 'Руки собирают электрический щит', 'program-hv-lab': 'Студент у высоковольтной установки',
  library: 'Студент на лестнице между книжными стеллажами', international: 'Студенты из разных стран за одним столом',
  'news-voice': 'Студентка говорит с голосовым помощником в коридоре', 'life-stage': 'Танцовщица в луче прожектора на сцене',
};

const groups = programs.reduce((acc, p) => { (acc[p.code.slice(0, 2)] ||= []).push(p); return acc; }, {});
const minOf = (o) => Math.min(...Object.values(o));
// The width (em) of the longer line of the best two-line break of a name: set to fit that line, the
// name never takes a third line, however the browser breaks it. Measured in the display face, or
// estimated for the long names set in the text face.
const twoLines = (name, width) => {
  const words = name.split(' ');
  if (words.length === 1) return width(name);
  let best = Infinity;
  for (let k = 1; k < words.length; k++) best = Math.min(best, Math.max(width(words.slice(0, k).join(' ')), width(words.slice(k).join(' '))));
  return best;
};
const lowestSum = (p) => Object.values(p.req).reduce((a, b) => a + b, 0) + minOf(p.choice);

function programPage(p) {
  const g = p.code.slice(0, 2);
  const lvl = level(p.code);
  const bachelor = lvl === 'Бакалавриат';
  const pic = GROUP_IMAGE[g] || 'showcase-hall';
  const peers = groups[g].filter((x) => x.code !== p.code);
  const long = p.name.length > 46;
  const tfit = twoLines(p.name, (t) => t.length * 0.62);
  const nfit = long ? tfit : twoLines(p.name, fit);
  const body = html`
<header class="phead field-red np-head" aria-labelledby="page-title">
  <nav class="crumbs wrap" aria-label="Вы здесь">
    <ol class="crumbs-list">
      <li><a class="link" href="index.html">Главная</a></li>
      <li><a class="link" href="postupit.html">Поступление</a></li>
      <li><a class="link" href="programmy.html">Программы</a></li>
      <li aria-current="page">${p.code}</li>
    </ol>
  </nav>
  <div class="phead-grid wrap">
    <p class="phead-title display lines np-code nums" aria-hidden="true" style="--fit:${(fit(p.code) * 1.02).toFixed(3)}"><span class="line"><span data-line style="--i:0">${p.code}</span></span></p>
    <div class="phead-talk">
      <h1 class="np-name${long ? ' is-long' : ''}" id="page-title" data-rise style="--i:0;--nfit:${nfit.toFixed(2)};--tfit:${tfit.toFixed(2)}">${esc(p.name)}</h1>
      <p class="phead-lead" data-rise style="--i:1">${lvl} УрФУ, группа «${esc(UGSN[g] || '')}». Экзамены, минимальные баллы и цена — по калькулятору ЕГЭ университета на 2026 год.</p>
      <div class="phead-actions" data-rise style="--i:2"><a class="btn btn-ink" href="postupit.html#podat">Подать документы ${icon.arrow}</a><a class="btn btn-paper" href="programmy.html#p-${p.code}">В каталоге</a></div>
    </div>
    <figure class="phead-photo" data-rise style="--i:3">${img(pic, { alt: ALT[pic] || '', sizes: '(min-width: 48em) 24vw, 70vw', cls: 'cover', eager: true })}</figure>
  </div>
</header>

<section class="sec field-yellow exams" aria-labelledby="exams-title">
  <div class="wrap exams-grid">
    <h2 class="sec-title" id="exams-title">Экзамены</h2>
    <dl class="exams-list">
      ${Object.entries(p.req).map(([k, v], i) => html`<div class="exam" data-reveal style="--i:${i}"><dt>${subjects[k]}</dt><dd class="display">${v}</dd><dd class="exam-note">обязательно, минимум баллов</dd></div>`)}
      ${Object.entries(p.choice).map(([k, v], i) => html`<div class="exam" data-reveal style="--i:${i + 2}"><dt>${subjects[k]}</dt><dd class="display">${v}</dd><dd class="exam-note">${Object.keys(p.choice).length > 1 ? 'или другой предмет на выбор' : 'обязательно, минимум баллов'}</dd></div>`)}
    </dl>
    <p class="exams-more">Подобрать направления под свои предметы можно в <a class="link" href="index.html#podbor">подборе по ЕГЭ</a> на главной.</p>
  </div>
</section>

<section class="facts np-facts" aria-label="Коротко о направлении">
  <p class="fact field-ink" data-reveal><span class="fact-big display">${bachelor ? '4 года' : 'от 5 лет'}</span><span class="fact-note">очно, по стандарту ${bachelor ? 'бакалавриата' : 'специалитета'}</span></p>
  <p class="fact field-green" data-reveal style="--i:1"><span class="fact-big display">${p.cost ? `${num(p.cost)} ₽` : 'Цена'}</span><span class="fact-note">${p.cost ? 'в год на платном месте, по калькулятору 2026 года' : 'на платном месте уточняется в приёмной комиссии'}</span></p>
  <p class="fact field-paper" data-reveal style="--i:2"><span class="fact-big display">${lowestSum(p)}</span><span class="fact-note">сумма минимальных баллов трёх экзаменов</span></p>
  <p class="fact field-red" data-reveal style="--i:3"><span class="fact-big display">${groups[g].length}</span><span class="fact-note">${groups[g].length === 1 ? 'направление' : groups[g].length < 5 ? 'направления' : 'направлений'} группы в УрФУ</span></p>
</section>

${peers.length ? html`<section class="sec field-paper" aria-labelledby="peers-title">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="sec-title" id="peers-title">Похожие направления</h2>
      <p class="sec-note">Другие направления группы «${esc(UGSN[g] || '')}»: экзамены похожи, можно подать на несколько сразу.</p>
    </div>
    <ul class="np-peers" role="list">
      ${peers.map((x, i) => html`<li data-reveal style="--i:${i % 4}"><a class="np-peer" href="${programHref(x.code)}"><span class="np-peer-code nums">${x.code}</span><span class="np-peer-name">${esc(x.name)}</span><span class="np-peer-req">${Object.entries(x.req).filter(([k]) => k !== 'rus').map(([k, v]) => `${lower(k)} от ${v}`).concat(Object.entries(x.choice).map(([k, v]) => `${lower(k)} от ${v}`).join(' или ')).join(', ')}</span>${icon.arrow}</a></li>`)}
    </ul>
  </div>
</section>` : ''}

<section class="sec field-green np-steps" aria-labelledby="steps-title">
  <div class="wrap">
    <h2 class="sec-title" id="steps-title">Как поступить</h2>
    <ol class="np-steps-list" role="list">
      ${STEPS.map((s, i) => html`<li class="np-step" data-reveal style="--i:${i}"><p class="np-step-line">${s.line}</p><p>${s.text.replace(' Минимумы видно в подборе выше.', '')}</p></li>`)}
    </ol>
  </div>
</section>

<a class="band field-red" href="postupit.html#podat">
  <span class="band-note">Подать документы на «${esc(p.name)}» можно онлайн через Госуслуги или в ГУК-100.</span>
  <span class="band-arrow" aria-hidden="true">${icon.arrow}</span>
  <span class="band-word giant">Подать</span>
</a>`;

  return {
    file: programHref(p.code),
    html: page({
      id: 'napravlenie',
      title: `${p.code} ${p.name} — ${lvl.toLowerCase()} УрФУ`,
      description: `${p.name} (${p.code}) в УрФУ: какие ЕГЭ сдавать, минимальные баллы, стоимость обучения и как подать документы в 2026 году.`,
      section: 'postupit',
      body,
      styles: ['programma.css', 'napravlenie.css'],
      credits: credits([pic]),
    }),
  };
}

export default () => programs.filter((p) => p.code !== '13.03.02').map(programPage);
