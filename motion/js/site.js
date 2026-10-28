// Shared behaviour: header, section panels, phone menu, search palette, reveals, accessibility toggle.
// Classic script (no modules) so the prototype also runs from file://.
(() => {
  const d = document;
  const root = d.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reveal once when an element enters the viewport ---------- */
  const targets = d.querySelectorAll('[data-reveal]');
  if (targets.length) {
    if (!('IntersectionObserver' in window)) targets.forEach((el) => el.classList.add('is-in'));
    else {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
      targets.forEach((el) => io.observe(el));
      addEventListener('load', () => setTimeout(() => targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
      }), 2500));
    }
  }

  /* ---------- muted loops play only while on screen, and never under reduced motion ---------- */
  const loops = d.querySelectorAll('video[data-loop]');
  if (loops.length && !reduced && 'IntersectionObserver' in window) {
    const watch = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause();
    }, { threshold: 0.2 });
    loops.forEach((v) => watch.observe(v));
  }

  /* ---------- header: tucks away while reading down, returns on the way up ---------- */
  const header = d.querySelector('[data-header]');
  let lastY = scrollY;
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      if (!header.classList.contains('is-open')) header.classList.toggle('is-tucked', y > lastY && y > 240);
      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  /* ---------- section panels ---------- */
  const megaButtons = [...d.querySelectorAll('[data-mega]')];
  let openBtn = null;
  const panelOf = (btn) => d.getElementById(btn.getAttribute('aria-controls'));
  function closeMega() {
    if (!openBtn) return;
    const panel = panelOf(openBtn);
    panel.hidden = true;
    panel.classList.remove('is-entering');
    openBtn.setAttribute('aria-expanded', 'false');
    header.classList.remove('is-open');
    openBtn = null;
  }
  function openMega(btn) {
    if (openBtn) closeMega();
    const panel = panelOf(btn);
    panel.querySelectorAll('.mega-link').forEach((a, i) => a.style.setProperty('--n', i));
    panel.hidden = false;
    void panel.offsetWidth;
    panel.classList.add('is-entering');
    btn.setAttribute('aria-expanded', 'true');
    header.classList.add('is-open');
    openBtn = btn;
  }
  megaButtons.forEach((btn) => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openBtn === btn ? closeMega() : openMega(btn);
  }));
  d.addEventListener('click', (e) => { if (openBtn && !header.contains(e.target)) closeMega(); });
  d.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openBtn) { const b = openBtn; closeMega(); b.focus(); }
  });

  /* ---------- phone menu ---------- */
  const menu = d.querySelector('[data-menu]');
  d.querySelectorAll('[data-menu-open]').forEach((b) => b.addEventListener('click', () => menu.showModal()));
  d.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', () => menu.close()));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) menu.close(); });

  /* ---------- search palette: pages, programmes, institutes, room codes ---------- */
  const dialog = d.querySelector('[data-search]');
  const input = dialog.querySelector('[data-search-input]');
  const results = dialog.querySelector('[data-search-results]');
  const INDEX = window.SEARCH_INDEX || [];
  const norm = (s) => String(s).toLowerCase().replace(/ё/g, 'е');
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Same rule as build/rooms.mjs: two-letter codes first, «Фт» is the old spelling of Ф.
  const ROOM = /^\s*(гук|мт|сп|фт|[а-яё])\s*-?\s*(\d{3,4})\s*$/i;
  const ROOM_ALIASES = { гук: 'ГУК', мт: 'Мт', сп: 'СП', фт: 'Ф' };
  let items = [];
  let active = -1;

  const highlight = (text, q) => {
    if (!q) return escapeHTML(text);
    const i = norm(text).indexOf(q);
    if (i < 0) return escapeHTML(text);
    return escapeHTML(text.slice(0, i)) + '<mark>' + escapeHTML(text.slice(i, i + q.length)) + '</mark>' + escapeHTML(text.slice(i + q.length));
  };

  function roomCard(m) {
    const code = ROOM_ALIASES[m[1].toLowerCase()] || m[1].toUpperCase();
    const b = INDEX.find((x) => x.room === code);
    if (!b) return '';
    const n = Number(m[2]);
    const floor = Math.floor(n / 100);
    return `<a class="search-room search-item" role="option" href="${b.u.replace('#', '?room=' + encodeURIComponent(code + '-' + m[2]) + '#')}"><span><strong>${escapeHTML(code)}-${m[2]}</strong> — ${escapeHTML(b.t.replace(/^Корпус «[^»]+»: /, ''))}, ${floor}-й этаж<br><small>${escapeHTML(b.k.replace(code + ' ', ''))} · показать на карте</small></span></a>`;
  }

  function render(qRaw) {
    const q = norm(qRaw.trim());
    let out = '';
    const m = qRaw.match(ROOM);
    if (m) out += roomCard(m);
    if (q.length >= 2) {
      const words = q.split(/\s+/).filter(Boolean);
      const scored = [];
      for (const it of INDEX) {
        const t = norm(it.t), k = norm((it.k || '') + ' ' + it.s);
        let score = 0;
        let ok = true;
        for (const w of words) {
          if (t.startsWith(w)) score += 4;
          else if (t.includes(' ' + w)) score += 3;
          else if (t.includes(w)) score += 2;
          else if (k.includes(w)) score += 1;
          else { ok = false; break; }
        }
        if (ok) scored.push([score - t.length / 200, it]);
      }
      scored.sort((a, b) => b[0] - a[0]);
      const top = scored.slice(0, 10).map(([, it]) => it);
      let group = '';
      for (const it of top) {
        const g = it.s.startsWith('Программа') ? 'Программы' : it.s.startsWith('Институт') ? 'Институты' : it.s.startsWith('Аудитории') ? 'Корпуса' : 'Страницы';
        if (g !== group) { out += `<p class="search-group">${g}</p>`; group = g; }
        out += `<a class="search-item" role="option" href="${it.u}"><span>${highlight(it.t, words[0])}</span><small>${escapeHTML(it.s)}</small></a>`;
      }
      if (!top.length && !m) out = `<p class="search-group">Ничего не нашлось. Попробуйте «общежитие», «программная инженерия» или код аудитории «Р-237».</p>`;
    } else if (!m) {
      out = `<p class="search-group">Часто ищут</p>` + ['Подбор программы по ЕГЭ', 'Сроки приёма 2026', 'Расписание', 'Общежития', 'Где аудитория']
        .map((label) => INDEX.find((x) => x.t === label)).filter(Boolean)
        .map((it) => `<a class="search-item" role="option" href="${it.u}"><span>${escapeHTML(it.t)}</span><small>${escapeHTML(it.s)}</small></a>`).join('');
    }
    results.innerHTML = out;
    items = [...results.querySelectorAll('.search-item')];
    select(items.length ? 0 : -1);
  }
  function select(i) {
    items.forEach((el, n) => el.setAttribute('aria-selected', String(n === i)));
    active = i;
    if (i >= 0) items[i].scrollIntoView({ block: 'nearest' });
  }
  function openSearch() {
    if (menu.open) menu.close();
    closeMega();
    dialog.showModal();
    input.value = '';
    render('');
    input.focus();
  }
  d.querySelectorAll('[data-search-open]').forEach((b) => b.addEventListener('click', openSearch));
  dialog.querySelector('[data-search-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (items.length) select((active + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (items.length) select((active - 1 + items.length) % items.length); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); location.href = items[active].getAttribute('href'); }
  });
  d.addEventListener('keydown', (e) => {
    const typing = e.target.closest('input, textarea, select, [contenteditable]');
    if (((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && !dialog.open) { e.preventDefault(); openSearch(); }
  });

  /* ---------- large text and contrast ---------- */
  const a11y = d.querySelector('[data-a11y-toggle]');
  if (a11y) {
    a11y.setAttribute('aria-pressed', String(root.classList.contains('a11y')));
    a11y.addEventListener('click', () => {
      const on = root.classList.toggle('a11y');
      a11y.setAttribute('aria-pressed', String(on));
      try { localStorage.setItem('urfu-a11y', on ? '1' : '0'); } catch (e) {}
    });
  }

  root.classList.toggle('reduced', reduced);
})();
