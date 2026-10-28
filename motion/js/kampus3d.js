// Motion edition, «Где аудитория»: the plan rises into the 3D campus. The SVG plan stays underneath
// and keeps doing the work (kampus.js decodes the room and lights its building); the 3D scene follows
// whichever building is lit, and a click on a block clicks that building on the plan. «План» switches back.
(() => {
  const d = document;
  const svg = d.querySelector('[data-map]');
  if (!svg || !window.Campus3D || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const host = d.createElement('div');
  host.className = 'map-3d';
  svg.parentNode.insertBefore(host, svg);
  host.appendChild(svg);
  const scene = d.createElement('div');
  scene.className = 'map-3d-scene';
  host.appendChild(scene);
  const c3 = window.Campus3D.mount(scene, { onPick: (id) => { const b = svg.querySelector(`[data-b="${id}"]`); if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
  if (!c3) { host.replaceWith(svg); return; }
  host.classList.add('is-3d');
  const toggle = d.createElement('button');
  toggle.type = 'button'; toggle.className = 'map-3d-toggle'; toggle.textContent = 'План'; toggle.setAttribute('aria-pressed', 'false');
  toggle.addEventListener('click', () => {
    const flat = host.classList.toggle('is-3d') === false;
    toggle.textContent = flat ? '3D' : 'План';
    toggle.setAttribute('aria-pressed', String(flat));
    if (!flat) c3.draw();
  });
  host.appendChild(toggle);
  let shown = null;
  const follow = () => { const on = svg.querySelector('.plan-b.is-on'), id = on ? on.dataset.b : null; if (id !== shown) { shown = id; c3.flyTo(id); } };
  new MutationObserver(follow).observe(svg, { subtree: true, attributes: true, attributeFilter: ['class'] });
  follow();
  // a slow look around the campus while the page scrolls past it
  if (window.gsap && window.ScrollTrigger) { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.create({ trigger: host, start: 'top bottom', end: 'bottom top', onUpdate: (s) => c3.orbit(s.progress * 0.5) }); }
})();
