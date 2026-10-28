// Каталог: filter by exams, level, price and text; sort; rows glide to their new places (GSAP Flip).
// Reads ?ege=rus,math&sort=cost from links on other pages and opens #p-<code> rows.
(() => {
  const d = document;
  const root = d.querySelector('[data-catalog]');
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const Flip = window.Flip && window.gsap ? (gsap.registerPlugin(window.Flip), window.Flip) : null;

  const rows = [...root.querySelectorAll('.prog')];
  const groups = [...root.querySelectorAll('[data-group]')];
  const lists = new Map(groups.map((g) => [g, g.querySelector('.cat-list')]));
  const q = root.querySelector('[data-q]');
  const sort = root.querySelector('[data-sort]');
  const count = root.querySelector('[data-count]');
  const countWord = root.querySelector('[data-count-word]');
  const empty = root.querySelector('[data-empty]');
  const reset = root.querySelector('[data-reset]');
  const subjectBtns = [...root.querySelectorAll('[data-subject]')];
  const levelBtns = [...root.querySelectorAll('[data-level]')];
  const costBtns = [...root.querySelectorAll('[data-cost]')];

  const state = { ege: new Set(), level: 'all', cost: 0, q: '', sort: 'code' };
  const params = new URLSearchParams(location.search);
  (params.get('ege') || '').split(',').filter(Boolean).forEach((k) => state.ege.add(k));
  if (params.get('sort')) state.sort = params.get('sort');

  const plural = (n, f) => { const a = n % 100, b = n % 10; return a > 10 && a < 20 ? f[2] : b > 1 && b < 5 ? f[1] : b === 1 ? f[0] : f[2]; };
  const norm = (s) => s.toLowerCase().replace(/ё/g, 'е').trim();

  function matches(row) {
    if (state.level !== 'all' && row.dataset.level !== state.level) return false;
    const cost = Number(row.dataset.cost);
    if (state.cost && (!cost || cost > state.cost)) return false;
    if (state.ege.size) {
      const req = row.dataset.req.split(' ');
      const choice = row.dataset.choice.split(' ');
      if (!req.every((k) => state.ege.has(k)) || !choice.some((k) => state.ege.has(k))) return false;
    }
    if (state.q) {
      const t = norm(state.q);
      if (!norm(row.dataset.name).includes(t) && !row.dataset.code.startsWith(t)) return false;
    }
    return true;
  }

  function order(a, b) {
    if (state.sort === 'name') return a.dataset.name.localeCompare(b.dataset.name, 'ru');
    if (state.sort === 'cost') return (Number(a.dataset.cost) || 1e9) - (Number(b.dataset.cost) || 1e9);
    return a.dataset.code.localeCompare(b.dataset.code);
  }

  function apply(animate = true) {
    const flip = animate && Flip && !reduced ? Flip.getState(rows.concat(groups)) : null;
    let shown = 0;
    for (const row of rows) { const ok = matches(row); row.hidden = !ok; if (ok) shown++; }
    for (const g of groups) {
      const list = lists.get(g);
      [...list.children].sort(order).forEach((li) => list.appendChild(li));
      g.hidden = ![...list.children].some((li) => !li.hidden);
    }
    count.textContent = shown;
    countWord.textContent = plural(shown, ['направление', 'направления', 'направлений']);
    empty.hidden = shown > 0;
    reset.hidden = !(state.ege.size || state.level !== 'all' || state.cost || state.q);
    subjectBtns.forEach((b) => b.setAttribute('aria-pressed', String(state.ege.has(b.dataset.subject))));
    levelBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.level === state.level)));
    costBtns.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.cost) === state.cost)));
    sort.value = state.sort;
    if (flip) Flip.from(flip, { duration: 0.5, ease: 'power3.inOut', absolute: false, nested: true, onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }), onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.2 }) });
    const url = new URL(location.href);
    state.ege.size ? url.searchParams.set('ege', [...state.ege].join(',')) : url.searchParams.delete('ege');
    state.sort !== 'code' ? url.searchParams.set('sort', state.sort) : url.searchParams.delete('sort');
    history.replaceState(null, '', url);
  }

  subjectBtns.forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.subject;
    state.ege.has(k) ? state.ege.delete(k) : state.ege.add(k);
    apply();
  }));
  levelBtns.forEach((b) => b.addEventListener('click', () => { state.level = b.dataset.level; apply(); }));
  costBtns.forEach((b) => b.addEventListener('click', () => { state.cost = Number(b.dataset.cost); apply(); }));
  sort.addEventListener('change', () => { state.sort = sort.value; apply(); });
  let t = null;
  q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = q.value; apply(false); }, 120); });
  reset.addEventListener('click', () => { state.ege.clear(); state.level = 'all'; state.cost = 0; state.q = ''; q.value = ''; apply(); });

  apply(false);

  // #p-09.03.04 from the home page: open that row and bring it into view.
  const target = location.hash.startsWith('#p-') && d.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) {
    if (target.hidden) { state.ege.clear(); state.level = 'all'; state.cost = 0; apply(false); }
    target.classList.add('is-target');
    target.querySelector('details').open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'center' }));
  }
})();
