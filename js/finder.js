// The live thing: tick the exams you take, and the programmes they open print along the bottom edge.
// Data: УрФУ's own EGE calculator, embedded in the page (works offline and from file://).
(() => {
  const root = document.querySelector('[data-finder]');
  const dataEl = document.getElementById('finder-data');
  if (!root || !dataEl) return;
  const data = JSON.parse(dataEl.textContent);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const picked = new Set(data.start);
  const chips = [...root.querySelectorAll('[data-subject]')];
  const slips = root.querySelector('[data-finder-slips]');
  const count = root.querySelector('[data-finder-count]');
  const all = root.querySelector('[data-finder-all]');

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lower = (k) => data.subjects[k].toLowerCase();
  const rub = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  const plural = (n, f) => { const a = n % 100, b = n % 10; return a > 10 && a < 20 ? f[2] : b > 1 && b < 5 ? f[1] : b === 1 ? f[0] : f[2]; };
  const fits = (p) => Object.keys(p.req).every((k) => picked.has(k)) && Object.keys(p.choice).some((k) => picked.has(k));
  const HEIGHTS = [34, 42, 30, 44, 27, 38];

  const slip = (p, i) => `<li class="slip${i % 3 === 1 ? ' slip-tilt-l' : i % 3 === 2 && i > 2 ? ' slip-tilt-r' : ''}" style="--h:${HEIGHTS[i % 6]};--n:${i}">
    <a class="slip-body" href="programma-${p.code.replace(/\./g, '-')}.html">
      <span class="slip-name">${esc(p.name)}</span>
      <span class="slip-cut" aria-hidden="true">- - - - - - - - - - - - - - - - - - - - - -</span>
      <span>Код ${p.code}</span>
      <span>Обязательно: ${Object.entries(p.req).map(([k, v]) => `${lower(k)} от ${v}`).join(', ')}</span>
      <span>На выбор: ${Object.entries(p.choice).map(([k, v]) => `${lower(k)} от ${v}`).join(' или ')}</span>
      <span>Платно: ${p.cost ? 'до ' + rub(p.cost) + ' в год' : 'стоимость уточняется'}</span>
    </a></li>`;

  function print(list) {
    slips.innerHTML = list.length
      ? list.slice(0, 6).map(slip).join('')
      : '<li class="slips-empty">Отметь ещё предмет: почти везде нужны три экзамена — русский и два по направлению.</li>';
    if (!reduced) [...slips.children].forEach((el) => el.classList.add('is-new'));
  }

  function update() {
    const list = data.programs.filter(fits);
    count.textContent = list.length
      ? `Подходит ${list.length} ${plural(list.length, ['направление', 'направления', 'направлений'])}`
      : 'Пока ничего не подходит';
    all.href = 'programmy.html?ege=' + [...picked].join(',');
    if (reduced || !slips.children.length) return print(list);
    slips.classList.add('is-printing');
    setTimeout(() => { slips.classList.remove('is-printing'); print(list); }, 400);
  }

  chips.forEach((chip) => chip.addEventListener('click', () => {
    const k = chip.dataset.subject;
    if (k === 'rus') return;
    picked.has(k) ? picked.delete(k) : picked.add(k);
    chip.setAttribute('aria-pressed', String(picked.has(k)));
    update();
  }));
  all.href = 'programmy.html?ege=' + [...picked].join(',');

  // The first slips print when the section scrolls into view.
  if (!reduced && 'IntersectionObserver' in window) {
    slips.classList.add('is-waiting');
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      slips.classList.remove('is-waiting');
      [...slips.children].forEach((el, i) => { el.style.setProperty('--n', i); el.classList.add('is-new'); });
      io.disconnect();
    }, { threshold: 0.35 });
    io.observe(root);
  }
})();
