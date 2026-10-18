// Главная: scroll-linked drift on the two large photographs. Transform only; nothing under reduced motion.
(() => {
  if (!window.gsap || !window.ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  const hero = document.querySelector('.hero-photo-frame img');
  if (hero) {
    gsap.fromTo(hero, { yPercent: -8 }, {
      yPercent: 2, ease: 'none',
      scrollTrigger: { trigger: '.hero-photo', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  const hall = document.querySelector('.showcase-photo img');
  if (hall) {
    gsap.fromTo(hall, { scale: 1.1 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.showcase', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  // The staircase is written as it arrives: each line uncovers left to right with the scroll.
  document.querySelectorAll('.stair-line').forEach((line) => {
    gsap.fromTo(line, { clipPath: 'inset(-10% 100% -10% 0)' }, {
      clipPath: 'inset(-10% 0% -10% 0)', ease: 'none',
      scrollTrigger: { trigger: line, start: 'top 92%', end: 'top 58%', scrub: 0.4 },
    });
  });
})();
