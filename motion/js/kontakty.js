// Контакты: filter the directory as you type; copy a number or an address in one tap.
(() => {
  const d = document;
  const root = d.querySelector('[data-directory]');
  if (!root) return;
  const q = root.querySelector('[data-dir-q]');
  const rows = [...root.querySelectorAll('.dir-row')];
  const empty = root.querySelector('[data-dir-empty]');
  const toast = root.querySelector('[data-toast]');
  const norm = (s) => s.toLowerCase().replace(/ё/g, 'е');
  q.addEventListener('input', () => {
    const words = norm(q.value).split(/\s+/).filter(Boolean);
    let shown = 0;
    rows.forEach((r) => { const ok = words.every((w) => norm(r.dataset.text).includes(w)); r.hidden = !ok; if (ok) shown++; });
    empty.hidden = shown > 0;
  });
  let timer = null;
  root.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const value = b.dataset.copy;
    try { await navigator.clipboard.writeText(value); toast.textContent = `Скопировано: ${value}`; }
    catch { toast.textContent = `Не получилось скопировать — выделите ${value} вручную`; }
    toast.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-on'), 2200);
  });
})();
