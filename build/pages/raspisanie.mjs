// Расписание. Argument: the question a student opens the site with is "what now and where" → the
// current or next class, with its room linked to the map → the week at a glance, today marked, a line
// at the present minute → take it into the phone's calendar. Sample timetable for the prototype.
import { html, esc, jsonScript } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits } from '../components/media.mjs';

// Bell times as commonly published for УрФУ; to be checked against the real timetable.
const PAIRS = [['08:30', '10:00'], ['10:15', '11:45'], ['12:00', '13:30'], ['14:15', '15:45'], ['16:00', '17:30'], ['17:40', '19:10']];
const T = { l: 'лекция', p: 'практика', lab: 'лабораторная' };
// [pair index, subject, type, room]
const WEEK = [
  { day: 'Понедельник', short: 'Пн', items: [[0, 'Теоретические основы электротехники', 'l', 'Э-205'], [1, 'Высшая математика', 'p', 'И-420'], [2, 'Физика', 'lab', 'Ф-210']] },
  { day: 'Вторник', short: 'Вт', items: [[1, 'Электрические машины', 'l', 'Э-309б'], [2, 'Электрические машины', 'lab', 'Э-110'], [4, 'Иностранный язык', 'p', 'ГУК-312']] },
  { day: 'Среда', short: 'Ср', items: [[0, 'Высшая математика', 'l', 'И-301'], [1, 'Физика', 'l', 'Ф-419'], [3, 'Физическая культура', 'p', 'спорткомплекс']] },
  { day: 'Четверг', short: 'Чт', items: [[1, 'Теоретические основы электротехники', 'lab', 'Э-501а'], [2, 'Электроника', 'l', 'Р-237'], [3, 'Электроника', 'p', 'Р-404']] },
  { day: 'Пятница', short: 'Пт', items: [[0, 'Метрология и измерения', 'l', 'Т-209'], [1, 'Программирование', 'p', 'Р-044'], [2, 'Программирование', 'p', 'Р-044']] },
  { day: 'Суббота', short: 'Сб', items: [[1, 'Проектный практикум', 'p', 'ГУК-100']] },
];
const roomLink = (room) => (/^[А-ЯЁа-яё]{1,3}-\d/.test(room) ? `kampus.html?room=${encodeURIComponent(room)}` : null);

export default function () {
  const body = html`
${pageHead({
  section: 'uchitsya',
  lines: ['Расписание'],
  lead: 'Что сейчас, что дальше и где это. Пример для прототипа: группа второго курса направления «Электроэнергетика и электротехника».',
  crumbs: [{ label: 'Расписание' }],
  actions: html`<button class="btn btn-ink" type="button" data-ics>В календарь телефона ${icon.calendar}</button>`,
})}

<section class="now field-ink" aria-live="polite" aria-labelledby="now-title" data-now>
  <div class="wrap now-grid">
    <h2 class="now-label lead" id="now-title" data-now-label>Следующая пара</h2>
    <p class="now-subject" data-now-subject>Электроника</p>
    <p class="now-meta lead" data-now-meta>Четверг, 12:00–13:30 · лекция</p>
    <a class="now-room" href="kampus.html?room=${encodeURIComponent('Р-237')}" data-now-room><span class="display">Р-237</span><span>как пройти ${icon.arrow}</span></a>
  </div>
</section>

<section class="week field-paper" aria-labelledby="week-title" data-week>
  <div class="wrap">
    <h2 class="sr-only" id="week-title">Неделя</h2>
    <div class="week-tabs" role="tablist" aria-label="Дни недели">
      ${WEEK.map((d, i) => html`<button class="chip week-tab" type="button" role="tab" aria-selected="${i === 0}" data-tab="${i}">${d.short}</button>`)}
    </div>
    <div class="week-grid" style="--pairs:${PAIRS.length}">
      <div class="week-times" aria-hidden="true">${PAIRS.map(([a, b]) => html`<p class="week-time"><span>${a}</span><span>${b}</span></p>`)}</div>
      ${WEEK.map((d, i) => html`<section class="day" data-day="${i}" role="tabpanel" aria-label="${d.day}">
        <h3 class="day-name"><span class="day-full">${d.day}</span><span class="day-short" aria-hidden="true">${d.short}</span></h3>
        <ol class="day-list" role="list">
          ${PAIRS.map((p, n) => {
            const it = d.items.find((x) => x[0] === n);
            if (!it) return html`<li class="slot slot-free" style="--row:${n + 1}"><span class="sr-only">${p[0]}–${p[1]}: окно</span></li>`;
            const link = roomLink(it[3]);
            return html`<li class="slot slot-${it[2]}" data-reveal style="--row:${n + 1};--i:${i}" data-start="${p[0]}" data-end="${p[1]}">
              <p class="slot-time">${p[0]}–${p[1]}</p>
              <p class="slot-subject">${esc(it[1])}</p>
              <p class="slot-meta">${T[it[2]]} · ${link ? html`<a class="link" href="${link}">${esc(it[3])}</a>` : esc(it[3])}</p>
            </li>`;
          })}
        </ol>
        <span class="now-line" aria-hidden="true" data-now-line></span>
      </section>`)}
    </div>
    <p class="week-note">Расписание и время пар — пример для прототипа. В рабочей версии данные приходят из системы расписания УрФУ.</p>
  </div>
</section>

<section class="field-green" aria-labelledby="study-title">
  <div class="wrap study">
    <figure class="study-photo">${img('library', { alt: 'Студент на лестнице между книжными стеллажами', sizes: '(min-width: 48em) 40vw, 100vw', cls: 'cover' })}</figure>
    <div class="study-text">
      <h2 class="sec-title" id="study-title">Окно между парами</h2>
      <p class="lead">Зональная научная библиотека, коворкинги и «Точка кипения» открыты для студентов. Посмотрите на карте, что ближе к вашему корпусу.</p>
      <a class="btn btn-ink" href="kampus.html">Карта кампуса ${icon.arrow}</a>
    </div>
  </div>
</section>
${jsonScript('week-data', { pairs: PAIRS, week: WEEK.map((d) => ({ day: d.day, items: d.items.map(([n, s, t, r]) => ({ n, s, t: T[t], r })) })) })}`;

  return {
    file: 'raspisanie.html',
    html: page({
      id: 'raspisanie',
      title: 'Расписание группы — УрФУ',
      description: 'Расписание группы на неделю: текущая и следующая пара, аудитории со ссылкой на карту, экспорт в календарь.',
      section: 'uchitsya',
      body,
      styles: ['raspisanie.css'],
      scripts: ['raspisanie.js'],
      credits: credits(['library']),
    }),
  };
}
