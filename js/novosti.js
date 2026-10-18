// Новости: filter by topic; the stories that stay glide into place.
(() => {
  const d = document;
  const filter = d.querySelector('[data-news-filter]');
  const root = d.querySelector('[data-news]');
  if (!filter || !root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const Flip = window.Flip && window.gsap ? (gsap.registerPlugin(window.Flip), window.Flip) : null;
  const buttons = [...filter.querySelectorAll('[data-topic]')];
  const news = [...root.querySelectorAll('.news')];
  const cols = [...root.querySelectorAll('[data-day-col]')];
  const leadBlock = d.querySelector('[data-tag-block]');
  const empty = d.querySelector('[data-news-empty]');
  buttons.forEach((b) => b.addEventListener('click', () => {
    const topic = b.dataset.topic;
    const state = Flip && !reduced ? Flip.getState(news.concat(cols)) : null;
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    news.forEach((n) => { n.hidden = topic !== 'all' && n.dataset.tag !== topic; });
    cols.forEach((c) => { c.hidden = ![...c.querySelectorAll('.news')].some((n) => !n.hidden); });
    leadBlock.classList.toggle('is-hidden', topic !== 'all' && leadBlock.dataset.tagBlock !== topic);
    empty.hidden = cols.some((c) => !c.hidden);
    if (state) Flip.from(state, { duration: 0.5, ease: 'power3.inOut', nested: true, onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }) });
  }));
})();
