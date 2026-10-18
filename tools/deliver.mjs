// The folder to hand to the jury: the site that opens from a stick, the concept PDF, the sign files
// (SVG and PNG), full-page mock-ups of every kind of page for desktop and phone, and a short note.
//   npm run dev  →  node tools/deliver.mjs ["<folder>"]
// Default folder: «УрФУ редизайн — на проверку» on the desktop next to the project.
import { mkdirSync, rmSync, cpSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://localhost:4321';
const LIVE = 'https://kk228m10-sys.github.io/urfu-redesign/';
const REPO = 'https://github.com/kk228m10-sys/urfu-redesign';
const OUT = process.argv[2] || join(ROOT, '..', 'УрФУ редизайн — на проверку');
const cdp = await import(pathToFileURL(join(homedir(), '.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs')).href);
const { ARM, STEM, markFile } = await import(pathToFileURL(join(ROOT, 'build/components/logo.mjs')).href);
const { INST_COLORS } = await import(pathToFileURL(join(ROOT, 'build/institutes.mjs')).href);
const { institutes } = JSON.parse(readFileSync(join(ROOT, 'src/data/institutes.json'), 'utf8'));

const PAGES = [
  ['index.html', 'Главная'], ['postupit.html', 'Поступление'], ['programmy.html', 'Каталог программ'],
  ['programma-13-03-02.html', 'Программа 13.03.02'], ['programma-09-03-01.html', 'Направление (шаблон для всех 112)'],
  ['institut-uralenin.html', 'Институт УралЭНИН'], ['institut-irit.html', 'Институт (шаблон для всех 13)'],
  ['novosti.html', 'Новости'], ['novost-kampus.html', 'Статья'], ['afisha.html', 'Афиша'], ['kampus.html', 'Где аудитория — план кампуса'],
  ['raspisanie.html', 'Расписание'], ['istoriya.html', 'История'], ['zhizn.html', 'Студенческая жизнь'], ['nauka.html', 'Наука'],
  ['kontakty.html', 'Контакты'], ['brand.html', 'Фирменный стиль'], ['koncepciya.html', 'Концепция'],
  ['razdel-inostrancam.html', 'Раздел меню (шаблон для 20 разделов)'], ['404.html', 'Страница 404'],
];

rmSync(OUT, { recursive: true, force: true });
for (const d of ['Сайт', 'Логотип', 'Логотип/Знаки институтов', 'Макеты/Десктоп', 'Макеты/Телефон']) mkdirSync(join(OUT, d), { recursive: true });

// 1. the site itself and the concept
cpSync(join(ROOT, 'dist'), join(OUT, 'Сайт'), { recursive: true });
cpSync(join(ROOT, 'docs/urfu-koncepciya.pdf'), join(OUT, 'Концепция редизайна УрФУ.pdf'));

// 2. the sign as files
const svg = (arm, stem, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bg ? '-18 -18 136 136' : '0 0 100 100'}">${bg ? `<rect x="-18" y="-18" width="136" height="136" fill="${bg}"/>` : ''}<path fill="${arm}" d="${ARM}"/><path fill="${stem}" d="${STEM}"/></svg>`;
writeFileSync(join(OUT, 'Логотип/Знак — красный.svg'), markFile('#e50046'));
writeFileSync(join(OUT, 'Логотип/Знак — чёрный.svg'), markFile('#1d1d1b'));
writeFileSync(join(OUT, 'Логотип/Знак — белый.svg'), markFile('#ffffff'));
writeFileSync(join(OUT, 'Логотип/Знак — белый на красном.svg'), markFile('#ffffff', '#e50046'));
for (const i of institutes) writeFileSync(join(OUT, `Логотип/Знаки институтов/${i.short}.svg`), svg(...INST_COLORS[i.id]));

const browser = await cdp.Browser.launch();
const shot = async (page, path, clip) => {
  const r = await page.send('Page.captureScreenshot', { format: path.endsWith('.png') ? 'png' : 'jpeg', ...(path.endsWith('.png') ? {} : { quality: 78 }), captureBeyondViewport: true, ...(clip ? { clip: { ...clip, scale: 1 } } : {}) });
  writeFileSync(path, Buffer.from(r.data, 'base64'));
};
try {
  // PNG renders of the sign and of the sign with the name, set in the site's own fonts
  const page = await browser.newPage({ width: 1600, height: 1200 });
  await page.goto(`${BASE}/brand.html`, { settleMs: 800 });
  await page.eval('document.fonts.ready.then(() => true)');
  const render = async (markup, file) => {
    const box = await page.eval(`(() => { document.body.innerHTML = ${JSON.stringify(`<div id="art" style="display:inline-block">${markup}</div>`)}; document.body.style.margin = 0; document.body.style.background = 'transparent'; const b = document.getElementById('art').getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: b.height }; })()`);
    await cdp.sleep(300);
    await shot(page, join(OUT, 'Логотип', file), box);
  };
  const lockup = (bg, fg, name) => `<div style="display:flex;align-items:center;gap:56px;padding:120px 140px;background:${bg}"><svg viewBox="0 0 100 100" style="width:260px;height:260px"><path fill="${fg}" d="${ARM}"/><path fill="${fg}" d="${STEM}"/></svg><span style="font-family:var(--font-display);font-weight:800;text-transform:uppercase;letter-spacing:-0.02em;line-height:0.95;font-size:96px;color:${name}">Уральский<br>федеральный</span></div>`;
  await render(lockup('#e6e0d2', '#e50046', '#1d1d1b'), 'Знак с названием — на бумаге.png');
  await render(lockup('#e50046', '#ffffff', '#ffffff'), 'Знак с названием — на красном.png');
  await render(lockup('#1d1d1b', '#e50046', '#e6e0d2'), 'Знак с названием — на чёрном.png');
  await render(`<div style="padding:120px;background:#e6e0d2"><svg viewBox="0 0 100 100" style="width:800px;height:800px"><path fill="#e50046" d="${ARM}"/><path fill="#e50046" d="${STEM}"/></svg></div>`, 'Знак — красный на бумаге.png');
  await render(`<div style="display:grid;grid-template-columns:repeat(7,200px);gap:48px 40px;padding:100px;background:#e6e0d2;font-family:var(--font-text);font-weight:600;font-size:26px;color:#1d1d1b">${institutes.map((i) => `<div style="display:grid;gap:16px"><svg viewBox="0 0 100 100" style="width:200px;height:200px"><path fill="${INST_COLORS[i.id][0]}" d="${ARM}"/><path fill="${INST_COLORS[i.id][1]}" d="${STEM}"/></svg><span>${i.short}</span></div>`).join('')}</div>`, 'Знаки институтов — все 13.png');
  await page.close();
  console.log('sign files done');

  // full-page mock-ups: reduced motion shows every element in its final place, no entrance halfway
  for (const [w, h, dir] of [[1440, 900, 'Десктоп'], [390, 844, 'Телефон']]) {
    const p = await browser.newPage({ width: w, height: h, mobile: w < 600, reducedMotion: true });
    for (const [n, [file, title]] of PAGES.entries()) {
      await p.goto(`${BASE}/${file}`, { timeoutMs: 45000, settleMs: 700 });
      await p.eval(`(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); } document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }); scrollTo(0, 0); await new Promise((r) => setTimeout(r, 900)); return true; })()`);
      const height = await p.eval('Math.min(document.documentElement.scrollHeight, 16000)');
      await shot(p, join(OUT, 'Макеты', dir, `${String(n + 1).padStart(2, '0')} ${title}.jpg`), { x: 0, y: 0, width: w, height });
    }
    await p.close();
    console.log('mock-ups done:', dir);
  }
} finally {
  await browser.close();
}

writeFileSync(join(OUT, 'Ссылка на сайт.url'), `[InternetShortcut]\r\nURL=${LIVE}\r\n`);
writeFileSync(join(OUT, 'Прочитай меня.txt'), [
  'РЕДИЗАЙН САЙТА УРФУ — конкурсный проект',
  '',
  `Онлайн-версия (работает как настоящий сайт): ${LIVE}`,
  `Исходный код: ${REPO}`,
  '',
  'Что внутри',
  '  Концепция редизайна УрФУ.pdf — описание концепции: идея знака, аудит, новая структура, UX, визуальный язык.',
  '  Сайт — интерактивный прототип. Откройте Сайт/index.html двойным кликом: работает без интернета, даже с флешки.',
  '  Макеты — полные снимки 20 страниц для компьютера и телефона.',
  '  Логотип — знак в SVG и PNG: цвета, вариант с названием на трёх фонах, знаки 13 институтов.',
  '',
  'Что можно попробовать в прототипе',
  '  • подбор направления по ЕГЭ на главной: отметьте предметы — выедут билеты подходящих направлений;',
  '  • каталог 112 направлений с фильтрами и страница каждого направления;',
  '  • «Где аудитория»: введите код из расписания, например Р-237, — корпус загорится на плане;',
  '  • расписание с текущей парой и экспортом в календарь телефона;',
  '  • поиск по всему сайту: клавиша / или Ctrl+K, понимает и коды аудиторий;',
  '  • календарь приёма 2026, чек-лист абитуриента, афиша с фильтрами, история УрФУ, 404 с «собери знак».',
  '',
  'Структура: 161 страница. 18 свёрстаны вручную, ещё 143 (все направления, институты и разделы меню) собраны из данных,',
  'поэтому в прототипе работает каждая кнопка. Разделы, которые не свёрстаны, честно об этом говорят и ведут на действующий urfu.ru.',
  '',
  'Фото зданий — Wikimedia Commons (авторы и лицензии — в подвале каждой страницы, «Фото и лицензии»).',
  'Иллюстрации и видео сгенерированы нейросетью для концепта; где картинка изображает реальное место, она подписана «Иллюстрация».',
  'Это концепт для конкурса, не официальный сайт УрФУ.',
  '',
].join('\r\n'));
console.log('folder ready:', OUT);
