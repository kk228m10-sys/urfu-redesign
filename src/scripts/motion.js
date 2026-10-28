// Motion edition: the prototype with an intro, page curtains, headings that rise word by word,
// magnetic buttons, velocity skew on giant type, parallax and a reading bar. The home page and the
// campus have their own scenes (mh.js, campus3d.js).
// Every effect is an enhancement: links, forms, search and the live tools work exactly as before,
// and with prefers-reduced-motion nothing here runs (the head script never raises the curtain).
(() => {
  const d = document, root = d.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = { get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) {} } };
  if (reduced || !window.gsap) { root.classList.remove('mo-covered'); return; }
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  const EASE = 'expo.inOut';

  /* ---------- the curtain: intro on the first visit, a wipe between pages ---------- */
  const ARM = 'M16 0H30L47.28 36L40.3 50.6Z', STEM = 'M62 0H84L36 100H14Z';
  const curtain = d.createElement('div');
  curtain.className = 'mo-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = `<svg viewBox="0 0 100 100"><path class="mo-arm" d="${ARM}"/><path class="mo-stem" d="${STEM}"/></svg><span class="mo-curtain-word">Уральский федеральный</span>`;
  d.body.appendChild(curtain);
  const arm = curtain.querySelector('.mo-arm'), stem = curtain.querySelector('.mo-stem'), word = curtain.querySelector('.mo-curtain-word');
  const drop = () => { curtain.classList.remove('is-on'); gsap.set(curtain, { yPercent: 0 }); };
  const lift = () => {
    d.dispatchEvent(new Event('mo:lift')); // scenes waiting under the curtain start now
    gsap.to(curtain, { yPercent: -100, duration: 0.8, ease: EASE, onComplete: drop });
    setTimeout(drop, 1600); // even if animation frames are throttled, the page is never left covered
  };
  if (root.classList.contains('mo-covered')) {
    setTimeout(() => { if (curtain.classList.contains('is-on')) lift(); }, 2600);
    curtain.classList.add('is-on');
    root.classList.remove('mo-covered');
    const intro = !store.get('mo-intro');
    store.set('mo-intro', '1'); store.set('mo-cover', null);
    if (intro) {
      // the two strokes of the sign fly in and become one letter, then the curtain lifts
      const tl = gsap.timeline({ onComplete: lift });
      tl.from(arm, { x: -90, y: -70, rotation: -30, opacity: 0, transformOrigin: '50% 50%', duration: 0.75, ease: 'expo.out' }, 0.1)
        .from(stem, { x: 110, y: 40, rotation: 16, opacity: 0, transformOrigin: '50% 50%', duration: 0.75, ease: 'expo.out' }, 0.22)
        .to(curtain.querySelector('svg'), { scaleX: 1.12, scaleY: 0.86, transformOrigin: '50% 100%', duration: 0.07 }, 0.95)
        .to(curtain.querySelector('svg'), { scaleX: 1, scaleY: 1, duration: 0.4, ease: 'elastic.out(1,0.4)' }, 1.02)
        .from(word, { y: 24, opacity: 0, duration: 0.45, ease: 'power3.out' }, 0.7);
    } else {
      gsap.delayedCall(0.08, lift);
    }
  }
  const leave = (href) => {
    store.set('mo-cover', '1');
    curtain.classList.add('is-on');
    let gone = false;
    const go = () => { if (!gone) { gone = true; location.href = href; } };
    gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: EASE, onComplete: go });
    setTimeout(go, 750);
    gsap.fromTo([arm, stem], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.25 });
  };
  d.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download') || a.dataset.noCurtain !== undefined) return;
    const url = new URL(a.href, location.href);
    if (!/^(https?|file):$/.test(url.protocol) || url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // a hash on this page
    e.preventDefault();
    leave(url.href);
  });
  addEventListener('pageshow', (e) => { if (e.persisted) { curtain.classList.remove('is-on'); gsap.set(curtain, { yPercent: 0 }); store.set('mo-cover', null); } });

  /* ---------- reading bar ---------- */
  const bar = d.createElement('div');
  bar.className = 'mo-progress';
  d.body.appendChild(bar);
  if (window.ScrollTrigger) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }) });

  /* ---------- headings rise word by word out of a mask ---------- */
  if (window.SplitText && window.ScrollTrigger) {
    d.querySelectorAll('.sec-title, .callout-title, .board-title, .stair-line').forEach((el) => {
      if (el.closest('[data-reveal]') || el.hasAttribute('data-reveal')) return;
      const split = new SplitText(el, { type: 'words', mask: 'words', wordsClass: 'mo-split-word' });
      gsap.from(split.words, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }

  /* ---------- giant type leans with the speed of the scroll ---------- */
  const giants = gsap.utils.toArray('.giant, .band-word, .figure-num, .anatomy-code, .np-code');
  if (giants.length && window.ScrollTrigger) {
    const skew = gsap.quickTo(giants, 'skewY', { duration: 0.5, ease: 'power3.out' });
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => skew(gsap.utils.clamp(-7, 7, s.getVelocity() / -320)) });
  }

  /* ---------- parallax on the big photographs ---------- */
  if (window.ScrollTrigger) {
    d.querySelectorAll('.inst-hero img, .art-hero img, .showcase-photo img, .newcampus-photo img, .hero-photo-frame img, .split-photo img').forEach((img) => {
      gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, { yPercent: 7, scale: 1.16, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- magnetic buttons (mouse only) ---------- */
  if (fine) {
    d.querySelectorAll('.btn, .chip, .band-arrow').forEach((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' }), my = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.28); my((e.clientY - r.top - r.height / 2) * 0.4); });
      el.addEventListener('pointerleave', () => { gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' }); });
    });
  }
})();
