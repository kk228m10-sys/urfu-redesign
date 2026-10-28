// Motion edition, home page scenes: the sign in WebGL (it assembles, follows the mouse and swallows
// the screen as you scroll), the film scrubbed frame by frame, the wall of signs tilting under the
// mouse, the campus in 3D with the room decoder, the four steps sliding sideways. Each scene checks
// for what it needs and stays a plain section without it; with reduced motion none of them pins.
(() => {
  const d = document;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ST = window.ScrollTrigger;
  if (!window.gsap) return;
  if (ST) gsap.registerPlugin(ST);
  const live = !reduced && ST;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a + (b - a) * t;
  // run once the curtain starts to lift (or now, when there is no curtain)
  const whenOpen = (fn) => {
    let done = false; const go = () => { if (!done) { done = true; fn(); } };
    if (d.querySelector('.mo-curtain.is-on')) { d.addEventListener('mo:lift', go, { once: true }); setTimeout(go, 2800); } else go();
  };

  /* ---------- 1. the sign in WebGL ---------- */
  const hero = d.querySelector('[data-mh-hero]');
  if (hero) {
    const stage = hero.querySelector('[data-mh-stage]');
    const lines = hero.querySelectorAll('.mh-line > span');
    const talk = hero.querySelectorAll('.mh-hero-talk > *, .mh-hero-meta, .mh-hero-hint');
    const gl = !reduced && window.THREE && sign3d(stage);
    if (live) hero.classList.add('is-live');
    if (!reduced) {
      gsap.set(lines, { yPercent: 110 }); gsap.set(talk, { opacity: 0, y: 20 });
      whenOpen(() => {
        gsap.to(lines, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.25 });
        gsap.to(talk, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07, delay: 0.6 });
        if (gl) gl.intro(); else gsap.from(stage.querySelectorAll('path'), { x: (i) => (i ? 120 : -120), y: (i) => (i ? 60 : -60), opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.2 });
      });
    }
    if (live) {
      const flood = d.createElement('div'); flood.className = 'mh-hero-flood'; hero.querySelector('.mh-hero-pin').appendChild(flood);
      ST.create({ trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (s) => {
        const p = s.progress;
        if (gl) gl.scroll(p);
        gsap.set([...lines].map((l) => l.parentElement), { y: -p * 260, opacity: 1 - clamp(p * 2.6, 0, 1) });
        gsap.set(talk, { y: -p * 120, opacity: 1 - clamp(p * 3.2, 0, 1) });
        flood.style.opacity = clamp((p - 0.86) / 0.12, 0, 1);
      } });
    }
  }

  // the «У» as two lacquered blocks: the thin arm (УрГУ) and the thick stem (УПИ)
  function sign3d(host) {
    const T = window.THREE;
    let r;
    try { r = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return null; }
    if (!r.getContext()) return null;
    r.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    r.outputColorSpace = T.SRGBColorSpace;
    r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
    r.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(r.domElement); host.classList.add('has-gl');
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, 0.1, 2000);
    scene.add(new T.HemisphereLight(0xffffff, 0xe6e0d2, 1.4));
    const key = new T.DirectionalLight(0xffffff, 2.4); key.position.set(-80, 120, 160); scene.add(key);
    const rim = new T.DirectionalLight(0xffc7d6, 1.6); rim.position.set(120, -60, -80); scene.add(rim);
    const fill = new T.PointLight(0xffffff, 1.2, 0, 0); fill.position.set(60, 20, 120); scene.add(fill);
    const shape = (pts) => { const s = new T.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x - 50, 50 - y) : s.moveTo(x - 50, 50 - y))); s.closePath(); return s; };
    const geo = (pts) => { const g = new T.ExtrudeGeometry(shape(pts), { depth: 12, bevelEnabled: true, bevelThickness: 2.2, bevelSize: 1.4, bevelSegments: 5, curveSegments: 4 }); g.translate(0, 0, -6); return g; };
    const mat = new T.MeshPhysicalMaterial({ color: new T.Color('#e50046'), roughness: 0.28, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0.4 });
    const arm = new T.Mesh(geo([[16, 0], [30, 0], [47.28, 36], [40.3, 50.6]]), mat);
    const stem = new T.Mesh(geo([[62, 0], [84, 0], [36, 100], [14, 100]]), mat);
    const sign = new T.Group(); sign.add(arm, stem); scene.add(sign);

    const st = { p: 0, mx: 0, my: 0, rx: 0, ry: 0, intro: reduced ? 1 : 0 };
    let base = { x: 0, y: 0, s: 1 }, dist = 200;
    const size = () => {
      const w = host.clientWidth, h = host.clientHeight || 1;
      r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      const vh = 2 * dist * Math.tan((cam.fov * Math.PI) / 360), vw = vh * cam.aspect;
      base = cam.aspect > 0.9 ? { x: vw * 0.2, y: -vh * 0.02, s: (vh * 0.66) / 100 } : { x: 0, y: vh * 0.06, s: Math.min(vw * 0.7, vh * 0.42) / 100 };
    };
    size(); new ResizeObserver(size).observe(host);
    if (fine) addEventListener('pointermove', (e) => { st.mx = e.clientX / innerWidth - 0.5; st.my = e.clientY / innerHeight - 0.5; }, { passive: true });

    // pieces start apart; intro() brings them together like the curtain does
    const from = { ax: -70, ay: 60, az: 80, ar: -0.9, sx: 80, sy: -50, sz: -60, sr: 0.5 };
    const k = { t: st.intro };
    const intro = () => gsap.to(k, { t: 1, duration: 1.25, ease: 'expo.out', onComplete: () => gsap.fromTo(sign.scale, { x: base.s * 1.08, y: base.s * 0.9 }, { x: base.s, y: base.s, duration: 0.6, ease: 'elastic.out(1,0.4)', onUpdate: () => (k.squash = true), onComplete: () => (k.squash = false) }) });
    const spin = gsap.parseEase('power2.inOut'), dive = gsap.parseEase('power3.in');

    let on = true, t0 = performance.now();
    new IntersectionObserver((en) => { on = en[0].isIntersecting; if (on) loop(); }).observe(host);
    function loop() {
      if (!on) return;
      const now = performance.now(), t = (now - t0) / 1000;
      st.rx += (st.my * 0.5 - st.rx) * 0.06; st.ry += (st.mx * 0.7 - st.ry) * 0.06;
      const p = st.p, a = spin(clamp(p / 0.6, 0, 1)), b = dive(clamp((p - 0.5) / 0.45, 0, 1)), i = k.t;
      arm.position.set(from.ax * (1 - i), from.ay * (1 - i), from.az * (1 - i)); arm.rotation.z = from.ar * (1 - i);
      stem.position.set(from.sx * (1 - i), from.sy * (1 - i), from.sz * (1 - i)); stem.rotation.z = from.sr * (1 - i);
      mat.opacity = 1;
      sign.position.set(mix(base.x, 0, a), mix(base.y, 0, a) + Math.sin(t * 1.1) * 1.6 * (1 - a), 0);
      if (!k.squash) { const s = base.s * mix(1, 1.25, a); sign.scale.set(s, s, s); }
      sign.rotation.set(-0.18 + st.rx * (1 - a) + Math.sin(t * 0.8) * 0.04 * (1 - a), 0.38 + st.ry * (1 - a) - a * (Math.PI * 2 + 0.38), 0);
      // the dive: the camera flies into the middle of the stem until it is all red
      const front = 8.2 * base.s * 1.25;
      cam.position.set(mix(0, -1 * base.s * 1.25, b), 0, mix(dist, front + 0.6, b));
      cam.lookAt(mix(0, -1 * base.s * 1.25, b), 0, 0);
      r.render(scene, cam);
      requestAnimationFrame(loop);
    }
    loop();
    return { intro, scroll: (p) => { st.p = p; } };
  }

  /* ---------- 2. the film, scrubbed ---------- */
  const film = d.querySelector('[data-mh-film]');
  if (film && live) {
    const cv = film.querySelector('[data-mh-canvas]'), ctx = cv.getContext('2d'), bar = film.querySelector('[data-mh-filmbar]'), cap = film.querySelector('.mh-film-cap');
    film.classList.add('is-live');
    const N = 180, src = (i) => `frames/reel/frame_${String(i + 1).padStart(4, '0')}.webp`;
    const frames = new Array(N), asked = new Uint8Array(N);
    let target = 0, head = 0, last = performance.now(), running = false, w = 0, h = 0;
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };
    const near = (i) => { for (let k = 0; k < N; k++) { if (frames[i - k]) return frames[i - k]; if (frames[i + k]) return frames[i + k]; } return null; };
    const cover = (img) => { const s = Math.max(w / img.naturalWidth, h / img.naturalHeight), iw = img.naturalWidth * s, ih = img.naturalHeight * s; ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih); };
    function paint() {
      const a = Math.floor(head), f = head - a, A = near(a), B = frames[Math.min(N - 1, a + 1)];
      ctx.globalAlpha = 1; ctx.fillStyle = '#1d1d1b'; ctx.fillRect(0, 0, w, h);
      if (A) cover(A);
      if (B && f > 0.02) { ctx.globalAlpha = f; cover(B); ctx.globalAlpha = 1; }
    }
    // frame 1, then every eighth so any seek has a neighbour, then the rest; six at a time
    const queue = [0]; for (let i = 8; i < N; i += 8) queue.push(i); for (let i = 1; i < N; i++) if (i % 8) queue.push(i);
    let busy = 0;
    const pump = () => {
      while (busy < 6 && queue.length) {
        const i = queue.shift(); if (asked[i]) continue; asked[i] = 1; busy++;
        const img = new Image(); img.decoding = 'async';
        img.onload = () => { frames[i] = img; busy--; if (i === 0) { size(); cv.classList.add('is-ready'); } else if (Math.abs(i - head) < 2) paint(); pump(); };
        img.onerror = () => { busy--; pump(); };
        img.src = src(i);
      }
    };
    new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { io.disconnect(); pump(); } }, { rootMargin: '150% 0px' }).observe(film);
    new ResizeObserver(size).observe(cv);
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1); last = now;
      head += (target - head) * (1 - Math.exp(-dt * 9));
      if (Math.abs(target - head) < 0.002) head = target;
      paint();
      if (head !== target) requestAnimationFrame(tick); else running = false;
    };
    ST.create({ trigger: film, start: 'top top', end: 'bottom bottom', onUpdate: (s) => {
      target = s.progress * (N - 1);
      bar.style.transform = `scaleX(${s.progress})`;
      cap.style.opacity = String(1 - clamp(s.progress * 14, 0, 1)); // the hint steps aside once the film moves
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
    } });
  }

  /* ---------- 4. the wall of signs ---------- */
  const wall = d.querySelector('[data-mh-wall]');
  if (wall && !reduced) {
    const cards = gsap.utils.toArray(wall.querySelectorAll('.mh-card-link'));
    if (ST) gsap.from(cards, { y: 80, rotationX: -28, opacity: 0, transformPerspective: 1000, transformOrigin: '50% 0%', duration: 1, ease: 'expo.out', stagger: { each: 0.05, grid: 'auto', from: 'start' }, scrollTrigger: { trigger: wall.querySelector('.mh-wall-grid'), start: 'top 80%', once: true } });
    if (fine) cards.forEach((c) => {
      const rx = gsap.quickTo(c, 'rotationX', { duration: 0.5, ease: 'power3.out' }), ry = gsap.quickTo(c, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      gsap.set(c, { transformPerspective: 900 });
      c.addEventListener('pointermove', (e) => { const b = c.getBoundingClientRect(); ry(((e.clientX - b.left) / b.width - 0.5) * 18); rx(-((e.clientY - b.top) / b.height - 0.5) * 14); });
      c.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* ---------- 6. the campus in 3D, with the room decoder ---------- */
  const campus = d.querySelector('[data-mh-campus]');
  if (campus) {
    const ROOMS = window.Campus3D ? window.Campus3D.rooms : JSON.parse((d.getElementById('campus3d-data') || { textContent: '{"rooms":[]}' }).textContent).rooms;
    const answer = campus.querySelector('[data-mh-answer]'), form = campus.querySelector('[data-mh-room]'), input = form.querySelector('input');
    const buttons = [...campus.querySelectorAll('[data-mh-b]')];
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const PATTERN = /^\s*(гук|мт|сп|фт|[а-яё])\s*-?\s*(\d{1,4}[а-яё]?)?\s*$/i;
    const ALIASES = { гук: 'ГУК', мт: 'Мт', сп: 'СП', фт: 'Ф' };
    let current = null;
    const c3 = window.Campus3D && window.Campus3D.mount(campus.querySelector('[data-mh-scene]'), { shift: () => (innerWidth > 768 ? 0.16 : 0), onPick: (id) => choose(id === current ? null : id) });
    function choose(id, num = '') {
      current = id;
      buttons.forEach((b) => b.classList.toggle('is-on', b.dataset.mhB === id));
      if (c3) c3.flyTo(id);
      const r = ROOMS.find((x) => x.id === id);
      if (!r) { answer.textContent = 'Например: Р-237, ГУК-100, Мт-418.'; return; }
      const digits = num.replace(/\D/g, ''), floor = digits.length >= 3 ? Math.floor(Number(digits) / 100) : null;
      answer.innerHTML = `<strong>${esc(r.code)}${num ? '-' + esc(num) : ''}</strong> — ${esc(r.name.charAt(0).toLowerCase() + r.name.slice(1))}${r.address ? ', ' + esc(r.address) : ''}.${floor !== null ? ` ${floor}-й этаж, аудитория ${esc(num.slice(String(floor).length))}.` : ''} ${r.who ? esc(r.who) + '.' : ''}`;
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const m = input.value.match(PATTERN);
      if (!m) { answer.textContent = 'Код выглядит так: буква корпуса, дефис и номер — например, Р-237.'; return; }
      const code = ALIASES[m[1].toLowerCase()] || m[1].toUpperCase(), r = ROOMS.find((x) => x.code === code);
      if (!r) { answer.textContent = `Корпуса «${code}» на плане нет. Есть ${ROOMS.map((x) => x.code).join(', ')}.`; return; }
      choose(r.id, m[2] || '');
    });
    buttons.forEach((b) => b.addEventListener('click', () => choose(b.dataset.mhB === current ? null : b.dataset.mhB)));
    if (c3 && live && matchMedia('(min-width: 48.01rem)').matches) {
      campus.classList.add('is-live');
      ST.create({ trigger: campus, start: 'top top', end: 'bottom bottom', scrub: 0.5, onUpdate: (s) => c3.orbit(s.progress) });
    }
  }

  /* ---------- 7. four steps, sideways ---------- */
  const path = d.querySelector('[data-mh-path]');
  if (path && live) {
    const track = path.querySelector('[data-mh-track]'), jump = path.querySelector('.mh-path-jump');
    path.classList.add('is-live');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: path, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true, onUpdate: (s) => {
      // she hops twice as the last step slides in, and lands
      const p = clamp((s.progress - 0.62) / 0.38, 0, 1), hop = Math.abs(Math.sin(p * Math.PI * 2));
      if (jump) gsap.set(jump, { y: -hop * 120 * (1 - p), rotation: Math.sin(p * Math.PI * 4) * 6 * (1 - p) });
    } } });
    // each step's line rises as the step slides in
    path.querySelectorAll('.mh-step').forEach((step, i) => {
      if (!i) return;
      gsap.from(step.querySelectorAll('.mh-step-line, .mh-step-text, .mh-step-cta'), { y: 60, opacity: 0, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: path, start: () => `top+=${(i - 0.6) * (path.offsetHeight - innerHeight) / 3} top`, end: () => `+=${(path.offsetHeight - innerHeight) / 6}`, scrub: 0.5, invalidateOnRefresh: true } });
    });
  }
})();
