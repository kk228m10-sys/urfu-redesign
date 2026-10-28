// The page shell: head, header with section panels, search dialog, footer and scripts.
import { html, esc, MOTION } from '../lib.mjs';
import { SECTIONS, hrefOf, outAttrs, SERVICES, CONTACT } from '../site.mjs';
import { lockup, mark } from './logo.mjs';
import { icon } from './icons.mjs';

const navLinks = (s) =>
  s.links.map((l) => html`<li><a class="mega-link" href="${esc(hrefOf(l))}"${outAttrs(hrefOf(l))}>${esc(l.label)}${l.ext ? ' ↗' : ''}</a></li>`);

export const header = ({ section } = {}) => html`
<header class="site-header" data-header>
  <div class="bar wrap">
    ${lockup()}
    <nav class="nav" aria-label="Разделы сайта">
      <ul class="nav-list">
        ${SECTIONS.map(
          (s) => html`<li><button class="nav-btn${s.id === section ? ' is-current' : ''}" type="button" aria-expanded="false" aria-controls="mega-${s.id}" data-mega="${s.id}"${s.id === section ? ' aria-current="true"' : ''}>${s.label}</button></li>`,
        )}
      </ul>
    </nav>
    <div class="bar-tools">
      <button class="tool" type="button" data-search-open aria-haspopup="dialog" aria-label="Поиск по сайту, клавиша «/»">${icon.search}<span class="tool-label">Поиск</span></button>
      <a class="btn btn-ink bar-action" href="${SERVICES.cabinet}" target="_blank" rel="noopener" title="Личный кабинет студента на istudent.urfu.ru">Кабинет</a>
      <button class="tool menu-btn" type="button" data-menu-open aria-haspopup="dialog" aria-controls="menu">Меню</button>
    </div>
  </div>
  ${SECTIONS.map(
    (s) => html`
  <div class="mega field-${s.field}" id="mega-${s.id}" data-mega-panel hidden>
    <div class="mega-inner wrap">
      <div class="mega-side">
        <p class="mega-title display">${s.label}</p>
        <p class="lead">${esc(s.lead)}</p>
        <a class="btn" href="${s.href}">Весь раздел ${icon.arrow}</a>
      </div>
      <ul class="mega-links" role="list">${navLinks(s)}</ul>
    </div>
  </div>`,
  )}
</header>`;

// Phone menu: the same five sections as accordions, full screen.
export const menu = () => html`
<dialog class="menu field-paper" id="menu" aria-label="Меню сайта" data-menu>
  <div class="menu-bar wrap">
    ${lockup()}
    <button class="tool" type="button" data-menu-close>${icon.close}<span class="tool-label">Закрыть</span></button>
  </div>
  <div class="menu-body wrap">
    <button class="menu-search" type="button" data-search-open>${icon.search}<span>Поиск по сайту</span></button>
    ${SECTIONS.map(
      (s) => html`
    <details class="menu-group field-${s.field}">
      <summary class="menu-summary">${s.label}<span class="menu-sign" aria-hidden="true">${icon.plus}</span></summary>
      <ul class="menu-links" role="list">
        <li><a class="menu-link menu-link-hub" href="${s.href}">Весь раздел «${s.label}»</a></li>
        ${s.links.map((l) => html`<li><a class="menu-link" href="${esc(hrefOf(l))}"${outAttrs(hrefOf(l))}>${esc(l.label)}${l.ext ? ' ↗' : ''}</a></li>`)}
      </ul>
    </details>`,
    )}
    <a class="btn btn-ink btn-block" href="${SERVICES.cabinet}" target="_blank" rel="noopener">Личный кабинет ↗</a>
  </div>
</dialog>`;

// Command palette: pages, programmes, institutes and room codes in one search field.
export const search = () => html`
<dialog class="search" aria-label="Поиск по сайту" data-search>
  <div class="search-box">
    <label class="search-field">
      ${icon.search}
      <span class="sr-only">Что ищем</span>
      <input type="search" placeholder="Программа, институт, аудитория «Р-237»…" autocomplete="off" spellcheck="false" data-search-input>
      <button class="tool" type="button" data-search-close aria-label="Закрыть поиск">${icon.close}</button>
    </label>
    <div class="search-results" data-search-results role="listbox" aria-label="Результаты"></div>
    <p class="search-hint small">Стрелки — выбрать, Enter — открыть, Esc — закрыть.</p>
  </div>
</dialog>`;

export const footer = ({ field = 'ink', credits = [] } = {}) => html`
<footer class="site-footer field-${field}" id="kontakty-podval">
  <div class="footer-top wrap">
    <p class="small">Уральский федеральный университет<br>620002, Екатеринбург, ул. Мира, 19</p>
    <p class="small">Приёмная комиссия: ГУК-100<br><a class="link" href="tel:+73433754474">${CONTACT.admissionsPhone}</a></p>
    <p class="small"><a class="link" href="mailto:${CONTACT.email}">${CONTACT.email}</a><br><a class="link" href="kontakty.html">Все контакты и службы</a></p>
    <a class="small link footer-top-link" href="#top">Наверх ${icon.arrow}</a>
  </div>
  <div class="footer-contact wrap">
    <a class="footer-phone display" href="${CONTACT.phoneHref}" data-reveal>${CONTACT.phone}</a>
    <p class="lead" data-reveal style="--i:1">Контакт-центр. Звонок по России бесплатный.</p>
  </div>
  <div class="footer-meta wrap small">
    <ul class="footer-links" role="list">
      <li><a class="link" href="${SERVICES.sveden}" target="_blank" rel="noopener">Сведения об образовательной организации</a></li>
      <li><a class="link" href="${SERVICES.anticorruption}" target="_blank" rel="noopener">Противодействие коррупции</a></li>
      <li><a class="link" href="brand.html">Фирменный стиль</a></li>
      <li><button class="link a11y-toggle" type="button" data-a11y-toggle aria-pressed="false">Крупный текст и контраст</button></li>
    </ul>
    <div class="footer-credits">
      <p>Концепт редизайна для конкурса, не официальный сайт УрФУ.</p>
      ${credits.length ? html`<details class="footer-photos"><summary class="link">Фото и лицензии</summary><p>${credits.join('; ')}.</p></details>` : ''}
    </div>
    <p class="footer-place">Екатеринбург, 2026</p>
  </div>
</footer>`;

const SITE_CSS = 'css/site.css';

export const page = ({
  id,
  title,
  description,
  section = null,
  body,
  styles = [],
  scripts = [],
  vendor = [],
  data = '',
  footerField = 'ink',
  credits = [],
  bodyClass = '',
}) => html`<!doctype html>
<html lang="ru" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, nofollow"><!-- a contest concept, not the official site: kept out of search -->
<meta name="theme-color" content="#e6e0d2">
<meta name="color-scheme" content="light">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${SITE_CSS}">
${styles.map((s) => html`<link rel="stylesheet" href="css/${s}">`)}
<script>document.documentElement.classList.replace('no-js','js');try{if(localStorage.getItem('urfu-a11y')==='1')document.documentElement.classList.add('a11y')}catch(e){}</script>
${MOTION ? html`<link rel="stylesheet" href="css/motion.css">
<script>try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&(!sessionStorage.getItem('mo-intro')||sessionStorage.getItem('mo-cover')))document.documentElement.classList.add('mo-covered')}catch(e){}</script>` : ''}
</head>
<body class="page-${id}${bodyClass ? ' ' + bodyClass : ''}" id="top">
<a class="skip" href="#main">К содержанию</a>
${header({ section })}
<main id="main">
${body}
</main>
${footer({ field: footerField, credits })}
${menu()}
${search()}
${data}
<script src="js/search-index.js" defer></script>
${(MOTION ? [...new Set(['gsap.min.js', 'ScrollTrigger.min.js', 'SplitText.min.js', ...vendor])] : vendor).map((v) => html`<script src="vendor/${v}" defer></script>`)}
<script src="js/site.js" defer></script>
${scripts.map((s) => html`<script src="js/${s}" defer></script>`)}
${MOTION ? html`<script src="js/motion.js" defer></script>` : ''}
</body>
</html>
`;

export { mark };
