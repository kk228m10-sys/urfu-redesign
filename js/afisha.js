// Афиша: days left, audience filter (posters glide with Flip), one-tap .ics for each event.
(() => {
  const d = document;
  const root = d.querySelector('[data-posters]');
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const Flip = window.Flip && window.gsap ? (gsap.registerPlugin(window.Flip), window.Flip) : null;
  const posters = [...root.querySelectorAll('.poster')];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const plural = (n, f) => { const a = n % 100, b = n % 10; return a > 10 && a < 20 ? f[2] : b > 1 && b < 5 ? f[1] : b === 1 ? f[0] : f[2]; };
  const day = (iso) => { const [y, m, dd] = iso.split('-').map(Number); return new Date(y, m - 1, dd); };

  posters.forEach((p) => {
    const from = day(p.dataset.from), to = p.dataset.to ? day(p.dataset.to) : null;
    const left = p.querySelector('[data-left]');
    const target = to && from <= today ? to : from;
    const n = Math.round((target - today) / 86400000);
    left.textContent = to && from <= today && to >= today ? (n === 0 ? 'Идёт, последний день сегодня' : `Идёт, осталось ${n} ${plural(n, ['день', 'дня', 'дней'])}`)
      : n > 0 ? `Через ${n} ${plural(n, ['день', 'дня', 'дней'])}` : n === 0 ? 'Сегодня' : 'Уже прошло';
  });

  const buttons = [...d.querySelectorAll('[data-poster-filter] [data-who]')];
  const empty = d.querySelector('[data-posters-empty]');
  buttons.forEach((b) => b.addEventListener('click', () => {
    const state = Flip && !reduced ? Flip.getState(posters) : null;
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    posters.forEach((p) => { p.hidden = b.dataset.who !== 'all' && p.dataset.who !== b.dataset.who; });
    empty.hidden = posters.some((p) => !p.hidden);
    if (state) Flip.from(state, { duration: 0.55, ease: 'power3.inOut', onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4 }) });
  }));

  // afisha.html?who=Школьникам opens with that audience already chosen (links from the sections)
  const want = new URLSearchParams(location.search).get('who');
  const preset = want && buttons.find((b) => b.dataset.who === want);
  if (preset) preset.click();

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ics]');
    if (!btn) return;
    const p = btn.closest('.poster');
    const ymd = (iso) => iso.replace(/-/g, '');
    const end = new Date(day(p.dataset.to || p.dataset.from)); end.setDate(end.getDate() + 1);
    const pad = (v) => String(v).padStart(2, '0');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//UrFU prototype//RU', 'BEGIN:VEVENT', `UID:${ymd(p.dataset.from)}-${p.dataset.title.length}@urfu-prototype`,
      `DTSTAMP:${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}T000000`, `DTSTART;VALUE=DATE:${ymd(p.dataset.from)}`,
      `DTEND;VALUE=DATE:${end.getFullYear()}${pad(end.getMonth() + 1)}${pad(end.getDate())}`, `SUMMARY:${p.dataset.title} — УрФУ`, 'END:VEVENT', 'END:VCALENDAR'];
    const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
    const a = Object.assign(d.createElement('a'), { href: url, download: 'sobytie-urfu.ics' });
    d.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
