// The home page of the motion edition. Same argument as the prototype, told as scenes:
// the sign in 3D (you can get in) → the film, scrubbed by the scroll → 9 855 free places → 13
// institutes, each with its own «У» → the live finder → the campus raised in 3D, with a room
// decoder → four steps of admission, sideways → life after classes → the week → one verb.
// The finder, the board and the band are the prototype's own parts, passed in unchanged.
import { html, esc, num, readJSON } from '../lib.mjs';
import { STEPS } from '../admission.mjs';
import { INST_COLORS } from '../institutes.mjs';
import { ARM, STEM } from '../components/logo.mjs';
import { ROOMS } from '../rooms.mjs';
import { icon } from '../components/icons.mjs';
import { img } from '../components/media.mjs';

const { institutes } = readJSON('src/data/institutes.json');
const sign = (arm, stem) => html`<svg class="mh-sign" viewBox="0 0 100 100" aria-hidden="true"><path class="mh-sign-arm" d="${ARM}" style="fill:${arm}"/><path class="mh-sign-stem" d="${STEM}" style="fill:${stem}"/></svg>`;
// the institutes on Мира first, then Софьи Ковалевской, then the city centre, as on the old list
const ORDER = ['isa', 'ineu', 'itoo', 'fti', 'inmit', 'hti', 'irit', 'info', 'uralenin', 'upish', 'ienim', 'ugi', 'ifksmp'];
const inst = Object.fromEntries(institutes.map((i) => [i.id, i]));

export function motionHome({ figure, showcase, tiles, board, band }) {
  const hero = html`
<section class="mh-hero field-paper" aria-labelledby="hero-title" data-mh-hero>
  <div class="mh-hero-pin">
    <div class="mh-hero-stage" data-mh-stage>${sign('var(--red)', 'var(--red)')}</div>
    <h1 class="mh-hero-title display" id="hero-title"><span class="mh-line"><span>У тебя</span></span><span class="mh-line"><span>получится</span></span></h1>
    <div class="mh-hero-talk">
      <p class="mh-hero-lead">358 программ и ${num(9855)} бюджетных мест. Подберём твою по ЕГЭ за минуту.</p>
      <a class="btn btn-ink" href="#podbor">Подобрать программу ${icon.arrowDown}</a>
    </div>
    <p class="mh-hero-meta"><span>Уральский федеральный</span><span class="nums">1920 — 2026</span></p>
    <p class="mh-hero-hint" aria-hidden="true">Листай</p>
  </div>
</section>`;

  const film = html`
<section class="mh-film field-ink" aria-label="Ролик: две линии знака становятся одной буквой" data-mh-film>
  <div class="mh-film-pin">
    <canvas class="mh-film-canvas" aria-hidden="true" data-mh-canvas></canvas>
    <video class="mh-film-video" muted loop playsinline controls preload="none" poster="video/reel.webp" data-mh-video>
      <source src="video/reel.mp4" type="video/mp4">
    </video>
    <p class="mh-film-cap">Ролик идёт, пока ты листаешь. Назад — и он отматывается.</p>
    <div class="mh-film-bar" aria-hidden="true"><span data-mh-filmbar></span></div>
  </div>
</section>`;

  const wall = html`
<section class="mh-wall field-ink" id="instituty" aria-labelledby="wall-title" data-mh-wall>
  <div class="wrap mh-wall-head">
    <h2 class="sec-title" id="wall-title">13 институтов. У каждого своя «У».</h2>
    <p class="mh-wall-lead">Знак один, цвета свои: штрих и ножка буквы. Наведи на карточку — буква соберётся.</p>
  </div>
  <ul class="mh-wall-grid wrap" role="list">
    ${ORDER.map((id, i) => {
      const it = inst[id], [arm, stem] = INST_COLORS[id];
      return html`<li class="mh-card" style="--i:${i}">
      <a class="mh-card-link" href="institut-${id}.html" data-mh-tilt>
        ${sign(arm, stem)}
        <span class="mh-card-short display">${esc(it.short)}</span>
        <span class="mh-card-name">${esc(it.name)}</span>
        <span class="mh-card-fields">${esc(it.fields)}</span>
        <span class="mh-card-addr">${esc(it.address)}</span>
      </a>
    </li>`;
    })}
  </ul>
  <p class="wrap mh-wall-all"><a class="link" href="instituty.html">Все институты с телефонами и адресами ${icon.arrow}</a></p>
</section>`;

  const campus = html`
<section class="mh-campus field-paper" aria-labelledby="campus-title" data-mh-campus>
  <div class="mh-campus-pin">
    <div class="mh-campus-scene" data-mh-scene></div>
    <div class="mh-campus-talk">
      <h2 class="sec-title" id="campus-title">Втузгородок в 3D</h2>
      <p class="mh-campus-lead">Одиннадцать корпусов на Мира, 19 — 32. Впиши аудиторию из расписания, и камера долетит до корпуса.</p>
      <form class="mh-room" data-mh-room>
        <label class="sr-only" for="mh-room-input">Аудитория из расписания</label>
        <input class="mh-room-input" id="mh-room-input" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="Р-237" maxlength="9">
        <button class="btn btn-ink" type="submit">Найти</button>
      </form>
      <p class="mh-room-answer" aria-live="polite" data-mh-answer>Например: Р-237, ГУК-100, Мт-418.</p>
      <ul class="mh-codes" role="list">
        ${ROOMS.map((r) => html`<li><button class="mh-code" type="button" data-mh-b="${r.id}" style="--c:${r.color}" aria-label="${esc(r.code)}: ${esc(r.name)}">${esc(r.code)}</button></li>`)}
      </ul>
      <a class="link" href="kampus.html">Где аудитория: план и все корпуса ${icon.arrow}</a>
    </div>
  </div>
</section>`;

  const path = html`
<section class="mh-path" aria-labelledby="path-title" data-mh-path>
  <h2 class="sr-only" id="path-title">Как поступить</h2>
  <div class="mh-path-pin">
    <ol class="mh-path-track" role="list" data-mh-track>
      ${STEPS.map((s, i) => html`<li class="mh-step field-${['green', 'yellow', 'red', 'ink'][i]}">
        <span class="mh-step-num giant nums" aria-hidden="true">0${i + 1}</span>
        <p class="mh-step-line display">${s.line}</p>
        <p class="mh-step-text">${s.text}</p>
        ${i === 3 ? html`<a class="btn btn-paper mh-step-cta" href="postupit.html">Всё о поступлении ${icon.arrow}</a>
        <figure class="mh-path-jump" aria-hidden="true">${img('cutout-applicant', { alt: '', sizes: '22vw', cls: 'mh-path-cut' })}</figure>` : ''}
      </li>`)}
    </ol>
  </div>
</section>`;

  return html`${hero}${film}${figure}${wall}${showcase}${campus}${path}${tiles}${board}${band}`;
}
