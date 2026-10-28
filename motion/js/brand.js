// Фирменный стиль: the sign assembles when its section comes into view, and again on request.
(() => {
  const section = document.querySelector('[data-sign-motion]');
  if (!section) return;
  const play = () => { section.classList.remove('is-playing'); void section.offsetWidth; section.classList.add('is-playing'); };
  section.querySelector('[data-replay]').addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { play(); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(section);
  } else play();
})();
