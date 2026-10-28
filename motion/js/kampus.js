// Карта кампуса: decode a room code, light its building on the plan of Втузгородок, glide towards it.
// Accepts ?room=Р-237 and #r from search results and the programme page.
(() => {
  const d = document;
  const root = d.querySelector('[data-rooms]');
  const dataEl = d.getElementById('rooms-data');
  if (!root || !dataEl) return;
  const ROOMS = JSON.parse(dataEl.textContent);
  const input = root.querySelector('[data-room-input]');
  const result = root.querySelector('[data-room-result]');
  const svg = d.querySelector('[data-map]');
  const blocks = [...svg.querySelectorAll('[data-b]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Same rule as build/rooms.mjs: two-letter codes first, «Фт» is the old spelling of Ф.
  const PATTERN = /^\s*(гук|мт|сп|фт|[а-яё])\s*-?\s*(\d{1,4}[а-яё]?)?\s*$/i;
  const ALIASES = { гук: 'ГУК', мт: 'Мт', сп: 'СП', фт: 'Ф' };
  const FULL = svg.viewBox.baseVal;
  const home = { x: FULL.x, y: FULL.y, w: FULL.width, h: FULL.height };
  let view = { ...home };

  // The plan glides by animating its viewBox: a gentle zoom towards the chosen building.
  function glide(to) {
    const from = { ...view };
    if (reduced) { view = to; return apply(); }
    const t0 = performance.now(), dur = 700;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      view = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e };
      apply();
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const apply = () => svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);

  function light(id) {
    blocks.forEach((b) => b.classList.toggle('is-on', b.dataset.b === id));
    svg.classList.toggle('has-on', Boolean(id));
    const b = blocks.find((x) => x.dataset.b === id);
    if (!b) return glide(home);
    const r = b.querySelector('path').getBBox();
    const w = Math.max(home.w * 0.5, r.width * 1.6, r.height * 1.6 * (home.w / home.h)), h = w * (home.h / home.w);
    const x = Math.min(Math.max(r.x + r.width / 2 - w / 2, home.x), home.x + home.w - w);
    const y = Math.min(Math.max(r.y + r.height / 2 - h / 2, home.y), home.y + home.h - h);
    glide({ x, y, w, h });
  }

  const codeOf = (raw) => ALIASES[raw.toLowerCase()] || raw.toUpperCase();
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function decode(value) {
    const m = value.match(PATTERN);
    if (!value.trim()) { result.innerHTML = '<p class="room-hint">Начните вводить код — корпус загорится на плане. Или нажмите на корпус.</p>'; light(null); return; }
    if (!m) { result.innerHTML = '<div class="room-card is-unknown"><p class="room-card-title">Не похоже на код аудитории</p><p>Код выглядит так: буква корпуса, дефис и номер — например, Р-237.</p></div>'; light(null); return; }
    const code = codeOf(m[1]);
    const room = ROOMS.find((r) => r.code === code);
    if (!room) { result.innerHTML = `<div class="room-card is-unknown"><p class="room-card-title">Корпуса «${esc(code)}» нет в прототипе</p><p>На плане есть ${ROOMS.map((r) => r.code).join(', ')}.</p></div>`; light(null); return; }
    const num = m[2] || '';
    const digits = num.replace(/\D/g, '');
    const floor = digits.length >= 3 ? Math.floor(Number(digits) / 100) : null;
    // The answer card wears its building's colour and shows the building itself, when there is a photo.
    result.innerHTML = `<div class="room-card" style="--b:${room.color};--b-ink:${room.ink}">
      ${room.photo ? `<div class="room-card-photo">${room.photo}</div>` : ''}
      <p class="room-card-title">${esc(code)}${num ? '-' + esc(num) : ''}: ${esc(room.name.charAt(0).toLowerCase() + room.name.slice(1))}</p>
      ${room.address || room.who ? `<p>${esc([room.address, room.who].filter(Boolean).join(' · '))}</p>` : ''}
      ${floor !== null ? `<p>${floor}-й этаж, аудитория ${esc(num.slice(String(floor).length))}</p>` : '<p>Добавьте номер, чтобы узнать этаж.</p>'}
      <p class="room-card-where">${esc(cap(room.where))}.</p>
    </div>`;
    light(room.id);
  }

  input.addEventListener('input', () => decode(input.value));
  root.querySelectorAll('[data-try]').forEach((b) => b.addEventListener('click', () => { input.value = b.dataset.try; decode(input.value); input.focus(); }));
  blocks.forEach((b) => {
    const pick = () => { const r = ROOMS.find((x) => x.id === b.dataset.b); input.value = r.code; decode(r.code); };
    b.addEventListener('click', pick);
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
  d.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => {
    const r = ROOMS.find((x) => x.id === b.dataset.show);
    input.value = r.code;
    decode(r.code);
    root.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }));

  const param = new URLSearchParams(location.search).get('room');
  const hash = location.hash.slice(1);
  if (param) { input.value = param; decode(param); }
  else if (hash && ROOMS.some((r) => r.id === hash)) { const r = ROOMS.find((x) => x.id === hash); input.value = r.code; decode(r.code); }
})();
