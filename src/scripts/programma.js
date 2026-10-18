// Страница программы: the index shows the picture of the row under the pointer, or, while reading
// with the keyboard or the wheel, of the row nearest the middle of the screen.
(() => {
  const root = document.querySelector('[data-index]');
  if (!root) return;
  const rows = [...root.querySelectorAll('.index-row')];
  const pics = [...root.querySelectorAll('.index-pic')];
  let hovering = false;
  const show = (i) => {
    rows.forEach((r, n) => r.classList.toggle('is-on', n === i));
    pics.forEach((p, n) => p.classList.toggle('is-on', n === i));
  };
  rows.forEach((row, i) => {
    row.addEventListener('pointerenter', () => { hovering = true; show(i); });
    row.addEventListener('pointerleave', () => { hovering = false; });
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (hovering) return;
      for (const e of entries) if (e.isIntersecting) show(rows.indexOf(e.target));
    }, { rootMargin: '-45% 0px -45% 0px' });
    rows.forEach((r) => io.observe(r));
  }
  show(0);
})();
