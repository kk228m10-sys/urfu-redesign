// Лонгрид: reading progress (for browsers without scroll timelines) and the active part in the contents.
(() => {
  const d = document;
  const bar = d.querySelector('[data-progress]');
  if (bar && !CSS.supports('animation-timeline: scroll()')) {
    const update = () => {
      const max = d.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--read', max > 0 ? String(scrollY / max) : '0');
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }
  const links = [...d.querySelectorAll('[data-toc]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a) => a.classList.toggle('is-on', a.dataset.toc === e.target.id));
    }
  }, { rootMargin: '-35% 0px -55% 0px' });
  links.forEach((a) => io.observe(d.getElementById(a.dataset.toc)));
})();
