// 3D campus (motion edition): raises the traced plan of Втузгородок into blocks with three.js —
// every building in its gem colour with an ink outline, the square and its lawns, the streets, the
// rhodonite passages, a letter above each block. window.Campus3D.mount(host, options) returns
// { flyTo(id), orbit(progress), pick(id) }; without WebGL it returns null and the page keeps its plan.
(() => {
  const dataEl = document.getElementById('campus3d-data');
  if (!dataEl || !window.THREE) return;
  const T = window.THREE;
  const DATA = JSON.parse(dataEl.textContent);
  const [VX, VY, VW, VH] = DATA.view;
  const CX = VX + VW / 2, CY = VY + VH / 2, K = 0.1; // plan pixels → world units
  const wx = (x) => (x - CX) * K, wz = (y) => (y - CY) * K;
  const C = { paper: 0xe6e0d2, ground: 0xeeeeea, street: 0xffffff, square: 0xe2eedd, lawn: 0xc4e3c9, other: 0xdcd5c6, ink: 0x1d1d1b, link: 0xee7a9c, red: 0xe50046 };

  // "M x yL x y…Z M…" → arrays of [x, y]
  const polys = (d) => d.split('M').filter(Boolean).map((s) => s.replace(/Z/g, '').split('L').map((p) => p.trim().split(/\s+/).map(Number)));
  // the landmark is drawn with h/v commands: turn each rectangle into four corners
  const rects = (d) => [...d.matchAll(/M(-?[\d.]+) (-?[\d.]+)h(-?[\d.]+)v(-?[\d.]+)h-?[\d.]+Z/g)].map((m) => { const x = +m[1], y = +m[2], w = +m[3], h = +m[4]; return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; });
  const shapeOf = (pts) => { const s = new T.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(wx(x), -wz(y)) : s.moveTo(wx(x), -wz(y)))); s.closePath(); return s; };

  function block(pts, h, color, outline) {
    const geo = new T.ExtrudeGeometry(shapeOf(pts), { depth: h, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    const mesh = new T.Mesh(geo, new T.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.02 }));
    mesh.castShadow = true; mesh.receiveShadow = true;
    if (outline) mesh.add(new T.LineSegments(new T.EdgesGeometry(geo, 20), new T.LineBasicMaterial({ color: C.ink })));
    return mesh;
  }
  function flat(x, y, w, h, color, lift) {
    const m = new T.Mesh(new T.PlaneGeometry(w * K, h * K), new T.MeshStandardMaterial({ color, roughness: 1 }));
    m.rotation.x = -Math.PI / 2; m.position.set(wx(x + w / 2), lift, wz(y + h / 2)); m.receiveShadow = true;
    return m;
  }
  function letter(text, color) {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 256;
    const c = cv.getContext('2d');
    c.font = `800 ${text.length > 2 ? 92 : 132}px "Unbounded Variable", "Unbounded", sans-serif`;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineWidth = 18; c.strokeStyle = '#1d1d1b'; c.lineJoin = 'round'; c.strokeText(text, 128, 136);
    c.fillStyle = '#ffffff'; c.fillText(text, 128, 136);
    const tex = new T.CanvasTexture(cv); tex.colorSpace = T.SRGBColorSpace;
    const s = new T.Sprite(new T.SpriteMaterial({ map: tex, depthTest: false }));
    s.scale.set(6, 6, 1); s.renderOrder = 10;
    return s;
  }

  function mount(host, opts = {}) {
    let gl;
    try { gl = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return null; }
    if (!gl.getContext()) return null;
    gl.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    gl.shadowMap.enabled = true; gl.shadowMap.type = T.PCFSoftShadowMap;
    gl.outputColorSpace = T.SRGBColorSpace;
    gl.domElement.className = 'c3d-canvas';
    gl.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(gl.domElement);

    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(32, 1, 1, 1000);
    scene.add(new T.HemisphereLight(0xffffff, 0xd8d2c4, 1.35));
    const sun = new T.DirectionalLight(0xffffff, 1.6);
    sun.position.set(-40, 80, 30); sun.castShadow = true;
    Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, near: 1, far: 220 });
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005;
    scene.add(sun);

    const world = new T.Group(); scene.add(world);
    const ground = new T.Mesh(new T.PlaneGeometry(VW * K * 1.6, VH * K * 1.6), new T.MeshStandardMaterial({ color: C.ground, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; world.add(ground);
    DATA.square.forEach(([x, y, w, h]) => world.add(flat(x, y, w, h, C.square, 0.02)));
    DATA.lawns.forEach(([x, y, w, h]) => world.add(flat(x, y, w, h, C.lawn, 0.04)));
    DATA.streets.forEach(([x, y, w, h]) => world.add(flat(x, y, w, h, C.street, 0.03)));
    DATA.landmarks.forEach((l) => rects(l.d).forEach((r) => world.add(block(r, 2.6, C.other, false))));
    DATA.links.forEach(([x1, y1, x2, y2]) => {
      const a = new T.Vector3(wx(x1), 2.2, wz(y1)), b = new T.Vector3(wx(x2), 2.2, wz(y2));
      const len = a.distanceTo(b), m = new T.Mesh(new T.BoxGeometry(len, 1.1, 1.1), new T.MeshStandardMaterial({ color: C.link, roughness: 0.5 }));
      m.position.copy(a).lerp(b, 0.5); m.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x); m.castShadow = true; world.add(m);
    });
    const blocks = {}, centres = {};
    DATA.rooms.forEach((r) => {
      const g = new T.Group(); g.userData.id = r.id;
      polys(r.d).forEach((pts) => g.add(block(pts, r.h, new T.Color(r.color).getHex(), true)));
      const [x, y, w, h] = r.box;
      const c = new T.Vector3(wx(x + w / 2), 0, wz(y + h / 2));
      const tag = letter(r.code); tag.position.set(c.x, r.h + 4.2, c.z); g.add(tag);
      world.add(g); blocks[r.id] = g; centres[r.id] = c;
    });

    // camera: an orbit around the campus, or a flight to one building
    const rig = { angle: -0.75, radius: 118, height: 86, tx: 0, tz: 4 };
    let focus = null;
    const place = () => {
      cam.position.set(rig.tx + Math.sin(rig.angle) * rig.radius, rig.height, rig.tz + Math.cos(rig.angle) * rig.radius);
      cam.lookAt(rig.tx, 0, rig.tz);
    };
    const size = () => {
      const w = host.clientWidth, h = host.clientHeight || 1;
      gl.setSize(w, h, false); cam.aspect = w / h;
      // opts.shift moves the picture sideways (a fraction of the width), clear of a text panel
      const sx = typeof opts.shift === 'function' ? opts.shift() : opts.shift || 0;
      if (sx) cam.setViewOffset(w, h, -w * sx, 0, w, h); else cam.clearViewOffset();
      cam.updateProjectionMatrix();
    };
    size(); place();
    new ResizeObserver(() => { size(); draw(); }).observe(host);

    // lift the chosen building, dim the others
    function pick(id) {
      focus = id;
      Object.entries(blocks).forEach(([k, g]) => {
        const on = !id || k === id;
        gsap.to(g.position, { y: id && k === id ? 2.2 : 0, duration: 0.6, ease: 'expo.out', onUpdate: draw });
        g.traverse((o) => { if (o.material && o.isMesh) { o.material.transparent = true; o.material.needsUpdate = true; gsap.to(o.material, { opacity: on ? 1 : 0.28, duration: 0.4, onUpdate: draw }); } });
      });
    }
    function flyTo(id) {
      const c = centres[id];
      if (!c) { pick(null); gsap.to(rig, { tx: 0, tz: 4, radius: 118, height: 86, duration: 1.2, ease: 'expo.inOut', onUpdate: () => { place(); draw(); } }); return; }
      pick(id);
      gsap.to(rig, { tx: c.x, tz: c.z, radius: 74, height: 58, angle: rig.angle + 0.3, duration: 1.3, ease: 'expo.inOut', onUpdate: () => { place(); draw(); } });
    }
    function orbit(p) { if (focus) return; rig.angle = -0.75 + p * 2.1; rig.height = 86 - p * 26; place(); draw(); }

    // click a block to choose it
    const ray = new T.Raycaster(), ptr = new T.Vector2();
    gl.domElement.addEventListener('click', (e) => {
      const r = gl.domElement.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, cam);
      const hit = ray.intersectObjects(Object.values(blocks), true).find((h) => h.object.isMesh);
      let g = hit && hit.object; while (g && !g.userData.id) g = g.parent;
      if (g && opts.onPick) opts.onPick(g.userData.id);
    });
    gl.domElement.style.cursor = 'pointer';

    // render only while on screen
    let visible = false, queued = false;
    function draw() { if (!visible || queued) return; queued = true; requestAnimationFrame(() => { queued = false; gl.render(scene, cam); }); }
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; draw(); }).observe(host);
    // the blocks rise out of the ground the first time the campus is seen
    let raised = false;
    new IntersectionObserver((en, io) => {
      if (!en[0].isIntersecting || raised) return; raised = true; io.disconnect();
      Object.values(blocks).forEach((g, i) => { g.scale.y = 0.001; gsap.to(g.scale, { y: 1, duration: 1.1, ease: 'expo.out', delay: 0.05 * i, onUpdate: draw }); });
    }, { threshold: 0.3 }).observe(host);
    return { flyTo, orbit, pick, draw };
  }
  window.Campus3D = { mount, rooms: DATA.rooms };
})();
