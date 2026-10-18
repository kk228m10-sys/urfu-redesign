// 404: the arm of the sign lies where it fell; drag it back (or press «Собрать знак»).
(() => {
  const root = document.querySelector('[data-lost]');
  if (!root || !window.gsap) return;
  const arm = root.querySelector('[data-arm]');
  const svg = root.querySelector('[data-lost-svg]');
  const hint = root.querySelector('[data-lost-hint]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FALLEN = { x: -26, y: 74, rotation: -62 };
  // On arrival the arm comes loose and drops — that is the joke of the page.
  if (reduced) gsap.set(arm, FALLEN);
  else gsap.fromTo(arm, { x: 0, y: 0, rotation: 0 }, { ...FALLEN, duration: 1.1, delay: 0.6, ease: 'bounce.out' });
  let fixed = false;

  const fix = () => {
    if (fixed) return;
    fixed = true;
    gsap.to(arm, { x: 0, y: 0, rotation: 0, duration: reduced ? 0 : 0.6, ease: 'back.out(1.6)' });
    root.classList.add('is-fixed');
    hint.textContent = 'Знак собран. Теперь найдём страницу.';
  };
  root.querySelector('[data-fix]').addEventListener('click', fix);

  if (window.Draggable) {
    gsap.registerPlugin(window.Draggable);
    // Convert pointer movement into the SVG's own units so the drag follows the finger.
    const scale = () => svg.viewBox.baseVal.width / svg.getBoundingClientRect().width;
    let start = null;
    Draggable.create(arm, {
      type: 'x,y',
      onPress() { start = { x: gsap.getProperty(arm, 'x'), y: gsap.getProperty(arm, 'y') }; gsap.to(arm, { rotation: -20, duration: 0.25 }); },
      onDrag() {
        const k = scale();
        const x = start.x + (this.x - this.startX) * k, y = start.y + (this.y - this.startY) * k;
        const dist = Math.hypot(x, y);
        gsap.set(arm, { x, y, rotation: -Math.min(20, dist / 3) });
      },
      onDragEnd() {
        const x = gsap.getProperty(arm, 'x'), y = gsap.getProperty(arm, 'y');
        if (Math.hypot(x, y) < 16) fix();
        else gsap.to(arm, { ...FALLEN, duration: 0.5, ease: 'power2.out' });
      },
    });
  }
})();
