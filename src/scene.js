// The 3D town. TownScene.create(stageEl, labelsEl) -> { apply(state) }
(function (root) {
  const AGENTS = [
    { id: 'chief',      name: 'Chief of Staff', kind: 'hall',       shirt: 0xe5533d, angle: -90 },
    { id: 'whatif',     name: 'What If Studio', kind: 'whatif',     shirt: 0x7656d1, angle: -30 },
    { id: 'howitworks', name: 'How It Works',   kind: 'howitworks', shirt: 0xee8434, angle: 30 },
    { id: 'banker',     name: 'Banker',         kind: 'bank',       shirt: 0x3f9f6b, angle: 90 },
    { id: 'programmer', name: 'Programmer',     kind: 'workshop',   shirt: 0x2e3d5a, angle: 150 },
    { id: 'news',       name: 'World News',     kind: 'news',       shirt: 0x2f6fd6, angle: 210 },
    // The Analyst moved in on Nov 15, 2026. Its building is still a covered construction site with
    // no sign (owner's wish): visitors find out what it is at the reveal. Set kind 'stats' and drop
    // `hidden` to reveal it.
    { id: 'analyst',    name: 'Analyst',        kind: 'construction', shirt: 0x17a398, angle: 180, r: 8.6, scale: 0.8, hidden: true },
  ];
  const R = 13.5;
  const RING = { idle: 0x9aa7b6, working: 0xff9f1a, done: 0x1fae6a };

  function create(stage, labels) {
    const THREE = root.THREE;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xdaf1fb, 70, 140);
    const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 300);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.appendChild(renderer.domElement);

    const narrow = innerWidth / innerHeight < 0.8;
    camera.position.set(0, narrow ? 62 : 27, narrow ? 84 : 40);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.5, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 0.35;
    controls.maxPolarAngle = 1.2;
    controls.minDistance = 18;
    controls.maxDistance = 90;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x7fae5a, 0.8));
    const sun = new THREE.DirectionalLight(0xffffff, 0.85);
    sun.position.set(22, 38, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.05;
    Object.assign(sun.shadow.camera, { left: -28, right: 28, top: 28, bottom: -28, near: 1, far: 90 });
    scene.add(sun);

    const mat = (c, extra) => new THREE.MeshLambertMaterial(Object.assign({ color: c, flatShading: true }, extra || {}));
    function mesh(geo, m, x, y, z) {
      const o = new THREE.Mesh(geo, m);
      o.position.set(x || 0, y || 0, z || 0);
      o.castShadow = true; o.receiveShadow = true;
      return o;
    }
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    // Ground
    const water = mesh(new THREE.CylinderGeometry(90, 90, 1, 64), mat(0x56bfe6), 0, -1.6, 0);
    water.castShadow = false; scene.add(water);
    scene.add(mesh(new THREE.CylinderGeometry(21.5, 17, 3.2, 40), mat(0xb5824f), 0, -2.1, 0));
    const grass = mesh(new THREE.CylinderGeometry(23, 21.5, 1.2, 40), mat(0x7fd35a), 0, -0.6, 0);
    grass.castShadow = false; scene.add(grass);
    const plaza = mesh(new THREE.CylinderGeometry(5.2, 5.2, 0.16, 36), mat(0xf1dfb0), 0, 0.08, 0);
    plaza.castShadow = false; scene.add(plaza);
    scene.add(mesh(new THREE.CylinderGeometry(1.8, 2, 0.6, 20), mat(0xdfe6ee), 0, 0.4, 0));
    const pool = mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.1, 20), mat(0x6fd3f5), 0, 0.72, 0); scene.add(pool);
    scene.add(mesh(new THREE.CylinderGeometry(0.25, 0.35, 1.6, 10), mat(0xdfe6ee), 0, 1.3, 0));

    // Bucket kit: every building is a white bucket with its job on it (WhiteBucket's village).
    function box(w, h, d, c, x, y, z) { return mesh(new THREE.BoxGeometry(w, h, d), typeof c === 'number' ? mat(c) : c, x, y, z); }
    const BH = 4.2, RB = 2, RT = 2.6;
    const rAt = y => RB + (RT - RB) * y / BH;
    function bucket(g, stripe, fill) {
      const white = mat(0xf7f6f1);
      g.add(mesh(new THREE.CylinderGeometry(RT, RB, BH, 36, 1, true), mat(0xf7f6f1, { side: THREE.DoubleSide }), 0, BH / 2, 0));
      g.add(mesh(new THREE.CylinderGeometry(RB, RB, 0.12, 36), white, 0, 0.06, 0));
      g.add(mesh(new THREE.CylinderGeometry(RT - 0.1, RT - 0.1, 0.1, 36), mat(fill || 0xdfe3e8), 0, BH - 0.45, 0));
      const rim = mesh(new THREE.TorusGeometry(RT, 0.14, 8, 44), white, 0, BH, 0); rim.rotation.x = Math.PI / 2; g.add(rim);
      g.add(mesh(new THREE.CylinderGeometry(rAt(3.85) + 0.03, rAt(3.45) + 0.03, 0.4, 36, 1, true), mat(stripe), 0, 3.65, 0));
      g.add(mesh(new THREE.CylinderGeometry(rAt(0.3) + 0.03, RB + 0.03, 0.3, 36, 1, true), mat(0xe2e2dc), 0, 0.15, 0));
      const handle = mesh(new THREE.TorusGeometry(RT + 0.12, 0.08, 6, 30, Math.PI), mat(0xaab3be), 0, BH - 0.35, 0);
      handle.rotation.x = -0.75; g.add(handle);
      for (const s of [-1, 1]) g.add(box(0.18, 0.4, 0.4, 0xaab3be, s * (RT + 0.05), BH - 0.35, 0));
      g.add(box(0.95, 1.25, 0.2, 0x8a5a33, 0, 0.63, rAt(0.6) + 0.02));
      g.add(mesh(new THREE.SphereGeometry(0.06, 6, 4), mat(0xf2b10c), 0.28, 0.65, rAt(0.6) + 0.14));
    }
    // A painted label wrapped around the front of the bucket. It glows while the worker is busy.
    function label(g, draw) {
      const W = 640, H = 256, c = document.createElement('canvas');
      c.width = W; c.height = H;
      const ctx = c.getContext('2d');
      draw(ctx, W, H);
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 4;
      const m = new THREE.MeshLambertMaterial({ map: tex, transparent: true, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0 });
      // Front and back, so the job reads from any side of the island.
      const y0 = 1.4, y1 = 3.35, L = 2.1;
      for (const start of [-L / 2, Math.PI - L / 2]) {
        const o = new THREE.Mesh(new THREE.CylinderGeometry(rAt(y1) + 0.03, rAt(y0) + 0.03, y1 - y0, 24, 1, true, start, L), m);
        o.position.y = (y0 + y1) / 2; g.add(o);
      }
      return m;
    }
    function patch(ctx, W, H, color) {
      const r = 46;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(r, 8); ctx.arcTo(W - 8, 8, W - 8, H - 8, r); ctx.arcTo(W - 8, H - 8, 8, H - 8, r);
      ctx.arcTo(8, H - 8, 8, 8, r); ctx.arcTo(8, 8, W - 8, 8, r); ctx.closePath(); ctx.fill();
    }
    function words(ctx, text, x, y, size, color, font) {
      ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `${font || '700'} ${size}px "Fredoka", "Trebuchet MS", sans-serif`;
      ctx.fillText(text, x, y);
    }
    function star(ctx, cx, cy, r, color) {
      ctx.fillStyle = color; ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
        ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      ctx.closePath(); ctx.fill();
    }
    function gear(r, n, c) {
      const g = new THREE.Group(); const m = mat(c);
      const core = mesh(new THREE.CylinderGeometry(r, r, 0.3, 16), m); core.rotation.x = Math.PI / 2; g.add(core);
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2;
        const t = mesh(new THREE.BoxGeometry(0.34, 0.34, 0.3), m, Math.cos(a) * (r + 0.13), Math.sin(a) * (r + 0.13), 0);
        t.rotation.z = a; g.add(t);
      }
      const hub = mesh(new THREE.CylinderGeometry(r * 0.35, r * 0.35, 0.36, 10), mat(0x3c4652)); hub.rotation.x = Math.PI / 2; g.add(hub);
      return g;
    }
    function bitSprite(ch) {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#39e4ff'; ctx.font = '700 52px ui-monospace, Menlo, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ch, 32, 34);
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
      s.scale.setScalar(1); return s;
    }

    // Workers: villagers in hard hats and orange vests who build things around the island.
    const workers = [];
    function worker(parent, x, y, z, yaw, tool, path) {
      const g = villager(0xff7a1a);
      g.add(mesh(new THREE.SphereGeometry(0.45, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xf2b10c), 0, 1.4, 0));
      g.add(mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.05, 14), mat(0xf2b10c), 0, 1.4, 0.06));
      const arm = new THREE.Group(); arm.position.set(0.42, 0.85, 0.05);
      arm.add(box(0.14, 0.5, 0.14, 0xff7a1a, 0, -0.22, 0));
      if (tool === 'hammer') {
        arm.add(box(0.06, 0.06, 0.42, 0x8a5a33, 0, -0.45, 0.16));
        arm.add(box(0.12, 0.13, 0.22, 0x6b7785, 0, -0.45, 0.38));
        arm.rotation.x = -1.2;
      }
      if (tool === 'plank') { g.add(box(0.12, 0.08, 1.7, 0xd9a86c, 0.38, 1.12, 0)); arm.rotation.x = -2.7; }
      if (tool === 'clipboard') { arm.add(box(0.3, 0.04, 0.38, 0xf7f6f1, 0, -0.48, 0.1)); arm.rotation.x = -1.1; }
      g.add(arm);
      g.position.set(x, y, z); g.rotation.y = yaw;
      parent.add(g);
      const w = { g, arm, tool, path: path || null, y, p: workers.length * 1.7 };
      workers.push(w);
      return w;
    }

    const builders = {
      construction(g) { // a building under wraps: tarp, scaffolding, a crane and workers. No sign.
        g.add(mesh(new THREE.CylinderGeometry(RT - 0.05, RB, BH, 10), mat(0x9fb0c2), 0, BH / 2, 0));
        g.add(mesh(new THREE.ConeGeometry(RT - 0.05, 0.9, 10), mat(0x8b9db0), 0, BH + 0.45, 0));
        for (const y of [1.2, 2.6]) {
          const rope = mesh(new THREE.TorusGeometry(rAt(y) + 0.03, 0.05, 4, 24), mat(0x5a4a3a), 0, y, 0);
          rope.rotation.x = Math.PI / 2; g.add(rope);
        }
        const S = 2.95, steel = 0xc9ced6, wood = 0xd9a86c;
        for (const x of [-S, S]) for (const z of [-S, S]) g.add(box(0.12, BH + 0.4, 0.12, steel, x, (BH + 0.4) / 2, z));
        for (const y of [1.5, 3]) {
          for (const z of [-S, S]) g.add(box(S * 2, 0.08, 0.08, steel, 0, y + 0.4, z));
          for (const x of [-S, S]) g.add(box(0.08, 0.08, S * 2, steel, x, y + 0.4, 0));
        }
        g.add(box(S * 2, 0.07, 0.6, wood, 0, 1.5, S));
        g.add(box(0.6, 0.07, S * 2, wood, S, 3, 0));
        for (const x of [-1.4, 0, 1.4]) g.add(mesh(new THREE.ConeGeometry(0.2, 0.5, 10), mat(0xff7a1a), x, 0.25, S + 1.9));
        const yellow = 0xf2b10c;
        g.add(box(0.28, 7.4, 0.28, yellow, -S, 3.7, -S));
        const jib = new THREE.Group(); jib.position.set(-S, 7.4, -S);
        jib.add(box(5, 0.2, 0.2, yellow, 1.7, 0, 0));
        jib.add(box(1, 0.45, 0.45, 0x6b7785, -1.1, 0, 0));
        jib.add(box(0.03, 2.2, 0.03, 0x1c2836, 3.6, -1.1, 0));
        jib.add(box(0.25, 0.2, 0.25, 0x1c2836, 3.6, -2.25, 0));
        g.add(jib);
        worker(g, 0.9, 1.54, S - 0.05, Math.PI, 'hammer');
        worker(g, -0.5, 0, S + 1.2, 0, 'plank', [new THREE.Vector3(-2.6, 0, S + 1.2), new THREE.Vector3(2.6, 0, S + 1.2)]);
        worker(g, -2.1, 0, S + 2.6, Math.PI, 'clipboard');
        return { glow: [], spin: [{ o: jib, axis: 'y', speed: 0.35, always: 0.35 }], top: 7.6 };
      },
      hall(g) { // Chief of Staff: a bucket with a star badge and the town flag
        bucket(g, 0xe5533d);
        const glow = label(g, (ctx, W, H) => { patch(ctx, W, H, '#e5533d'); star(ctx, W / 2, 98, 70, '#fff'); words(ctx, 'CHIEF', W / 2, 208, 54, '#fff'); });
        g.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.2, 6), mat(0x55606e), -0.8, BH + 1, -0.6));
        const flag = box(1.3, 0.75, 0.06, 0x2f80ed, -0.15, BH + 2.2, -0.6); g.add(flag);
        return { glow: [glow], spin: [{ o: flag, wave: true }], top: BH + 3 };
      },
      whatif(g) { // What If: a bucket with a big question mark and a telescope
        bucket(g, 0x7656d1, 0x3b2f73);
        const glow = label(g, (ctx, W, H) => { patch(ctx, W, H, '#7656d1'); words(ctx, '?', W / 2, 100, 150, '#fff'); words(ctx, 'WHAT IF', W / 2, 212, 50, '#fff'); });
        const scope = mesh(new THREE.CylinderGeometry(0.3, 0.42, 2.6, 10), mat(0x5b6474), 0.5, BH + 0.6, -0.3);
        scope.rotation.z = -0.8; g.add(scope);
        const orbit = new THREE.Group(); orbit.position.set(0, BH + 2.6, 0);
        const planet = mesh(new THREE.SphereGeometry(0.5, 14, 10), mat(0xff9a3c), 1.8, 0, 0);
        const ring = mesh(new THREE.TorusGeometry(0.8, 0.07, 6, 24), mat(0xffd36b), 1.8, 0, 0); ring.rotation.x = 1.2;
        orbit.add(planet, ring); g.add(orbit);
        return { glow: [glow], spin: [{ o: orbit, axis: 'y', speed: 1.6, always: 0.25 }], top: BH + 3.4 };
      },
      howitworks(g) { // How It Works: a bucket with gears on the front and one turning on top
        bucket(g, 0xee8434, 0x9aa7b6);
        const glow = label(g, (ctx, W, H) => { patch(ctx, W, H, '#ee8434'); words(ctx, 'HOW IT WORKS', W / 2, 222, 40, '#fff'); });
        const z = rAt(2.5) + 0.2;
        const g1 = gear(0.75, 10, 0xe8edf2); g1.position.set(-0.35, 2.55, z); g.add(g1);
        const g2 = gear(0.45, 7, 0xc4ccd6); g2.position.set(0.82, 2.95, z - 0.05); g.add(g2);
        const big = gear(1.25, 12, 0xc4ccd6); big.position.set(0, BH + 0.6, -0.2); g.add(big);
        return { glow: [glow], spin: [{ o: g1, axis: 'z', speed: 1.3 }, { o: g2, axis: 'z', speed: -2.1 }, { o: big, axis: 'z', speed: 0.8, always: 0.15 }], top: BH + 2.2 };
      },
      bank(g) { // Banker: a bucket full of gold coins with a big dollar sign
        bucket(g, 0x3f9f6b, 0xf2b10c);
        const glow = label(g, (ctx, W, H) => { patch(ctx, W, H, '#3f9f6b'); words(ctx, '$', W / 2, 110, 150, '#ffe07a'); words(ctx, 'BANK', W / 2, 212, 50, '#fff'); });
        for (let i = 0; i < 9; i++) {
          const a = i * 2.4, r = 0.5 + (i % 3) * 0.55;
          const c = mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 14), mat(0xf2b10c), Math.cos(a) * r, BH - 0.3 + (i % 2) * 0.1, Math.sin(a) * r);
          c.rotation.set(0.3 * (i % 3), 0, 0.25 * ((i + 1) % 3)); g.add(c);
        }
        const coin = new THREE.Group();
        const face = mesh(new THREE.CylinderGeometry(1, 1, 0.26, 28), mat(0xf2b10c, { emissive: 0xf2b10c, emissiveIntensity: 0.15 }));
        face.rotation.x = Math.PI / 2; coin.add(face);
        coin.add(box(0.22, 1.1, 0.3, 0xb07e00, 0, 0, 0));
        coin.position.set(0, BH + 2, 0); g.add(coin);
        return { glow: [glow], spin: [{ o: coin, axis: 'y', speed: 1.4, always: 0.4 }], top: BH + 3.2 };
      },
      workshop(g) { // Programmer: a bucket with a code screen, ones and zeros floating out
        bucket(g, 0x2e3d5a, 0x1c2836);
        const rows = ['10110 01', '0 101101', '1101 010', '01 10011'];
        const glow = label(g, (ctx, W, H) => {
          patch(ctx, W, H, '#1c2836');
          ctx.fillStyle = '#39e4ff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.font = '700 50px ui-monospace, Menlo, monospace';
          rows.forEach((r, i) => ctx.fillText(r, W / 2, 46 + i * 55));
        });
        const bits = [];
        for (let i = 0; i < 8; i++) {
          const s = bitSprite(i % 3 ? '1' : '0');
          s.position.set((i % 4 - 1.5) * 0.7, BH, ((i * 5) % 3 - 1) * 0.6);
          s.userData.off = i / 8; g.add(s); bits.push(s);
        }
        return { glow: [glow], bits, spin: [], top: BH + 2.8 };
      },
      news(g) { // World News: a bucket with an ON AIR sign, an antenna and a globe
        bucket(g, 0x2f6fd6, 0x1f4ea0);
        const glow = label(g, (ctx, W, H) => {
          patch(ctx, W, H, '#2f6fd6'); words(ctx, 'NEWS', W / 2, 96, 96, '#fff');
          ctx.fillStyle = '#ff3b3b'; ctx.beginPath(); ctx.arc(W / 2 - 112, 204, 16, 0, Math.PI * 2); ctx.fill();
          words(ctx, 'ON AIR', W / 2 + 18, 206, 46, '#fff');
        });
        g.add(mesh(new THREE.CylinderGeometry(0.07, 0.12, 3.6, 6), mat(0xe8edf2), 0.9, BH + 1.4, -0.6));
        const beacon = mesh(new THREE.SphereGeometry(0.24, 10, 8), mat(0xff3b3b, { emissive: 0xff3b3b, emissiveIntensity: 0.6 }), 0.9, BH + 3.3, -0.6);
        g.add(beacon);
        const globe = new THREE.Group(); globe.position.set(-0.6, BH + 0.9, 0.1);
        globe.add(mesh(new THREE.SphereGeometry(1, 16, 12), mat(0x3fa7e8)));
        globe.add(mesh(new THREE.SphereGeometry(1.03, 7, 5, 0, 2), mat(0x6fcf6a)));
        globe.add(mesh(new THREE.SphereGeometry(1.03, 6, 4, 3, 1.4, 0.6, 1.2), mat(0x6fcf6a)));
        g.add(globe);
        return { glow: [glow], spin: [{ o: globe, axis: 'y', speed: 1.5, always: 0.3 }], blink: beacon, top: BH + 3.8 };
      },
      stats(g) { // Analyst: a bucket with a bar chart on the front and a growing chart on top
        bucket(g, 0x17a398, 0x0f6b63);
        const glow = label(g, (ctx, W, H) => {
          patch(ctx, W, H, '#17a398');
          ctx.fillStyle = '#fff';
          [[0.3, 60], [0.45, 95], [0.6, 75], [0.75, 135]].forEach(([fx, h]) => ctx.fillRect(W * fx - 30, 160 - h, 60, h));
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(W * 0.2, 162); ctx.lineTo(W * 0.85, 162); ctx.stroke();
          words(ctx, 'STATS', W / 2, 214, 50, '#fff');
        });
        const bars = [0xffffff, 0x9be8df, 0xffd36b].map((c, i) => {
          const b = box(0.55, 1, 0.55, c, (i - 1) * 0.75, BH, 0); b.userData.base = 0.9 + i * 0.55; g.add(b); return b;
        });
        return { glow: [glow], spin: [], bars, top: BH + 2.4 };
      },
    };

    function villager(shirt) {
      const g = new THREE.Group();
      g.add(mesh(new THREE.CylinderGeometry(0.34, 0.46, 0.95, 10), mat(shirt), 0, 0.48, 0));
      g.add(mesh(new THREE.SphereGeometry(0.4, 14, 10), mat(0xffd5ad), 0, 1.25, 0));
      g.add(mesh(new THREE.SphereGeometry(0.42, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.4), mat(0x3a2a20), 0, 1.3, -0.03));
      g.add(box(0.08, 0.12, 0.05, 0x1c2836, -0.14, 1.27, 0.38));
      g.add(box(0.08, 0.12, 0.05, 0x1c2836, 0.14, 1.27, 0.38));
      return g;
    }

    const agents = AGENTS.map(def => {
      const a = Object.assign({}, def);
      const r = a.r || R, sc = a.scale || 1;
      const ang = a.angle * Math.PI / 180, x = Math.cos(ang) * r, z = Math.sin(ang) * r;
      if (!a.r) { // buckets on the outer ring get a path to the plaza
        const path = box(1.7, 0.1, R - 5, 0xf1dfb0, 0, 0.05, 0);
        path.castShadow = false;
        const pg = new THREE.Group(); pg.add(path); path.position.z = (R - 5) / 2 + 5;
        pg.rotation.y = Math.atan2(x, z); scene.add(pg);
      }

      const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = Math.atan2(-x, -z); g.scale.setScalar(sc);
      const parts = builders[a.kind](g);
      scene.add(g);

      // A small wooden name sign in front of each bucket (the floating name only shows while it works).
      if (!a.hidden) {
        const c = document.createElement('canvas'); c.width = 512; c.height = 128;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#f6e7c4'; ctx.fillRect(0, 0, 512, 128);
        ctx.strokeStyle = '#8a5a33'; ctx.lineWidth = 10; ctx.strokeRect(5, 5, 502, 118);
        words(ctx, a.name, 256, 68, a.name.length > 12 ? 50 : 58, '#3a2a20');
        const wood = mat(0x8a5a33);
        const sign = new THREE.Group(); sign.position.set(-1.7, 0, 3.7); sign.rotation.y = 0.25;
        for (const x of [-0.7, 0.7]) sign.add(box(0.1, 1.0, 0.1, 0x8a5a33, x, 0.5, 0));
        const board = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.07), [wood, wood, wood, wood, new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(c) }), wood]);
        board.position.set(0, 0.85, 0.06); board.castShadow = true; sign.add(board);
        g.add(sign);
      }

      const person = villager(a.shirt); person.position.set(1.6, 0, 3.9); g.add(person);
      person.visible = !a.hidden;
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.75, 1.05, 32), new THREE.MeshBasicMaterial({ color: RING.idle, transparent: true, opacity: 0.5 }));
      ring.rotation.x = -Math.PI / 2; ring.position.set(1.6, 0.07, 3.9); g.add(ring);
      ring.visible = !a.hidden;

      const tag = document.createElement('div');
      tag.className = 'tag'; tag.dataset.s = 'idle'; tag.dataset.id = a.id;
      const bubble = document.createElement('div'); bubble.className = 'bubble';
      const btext = document.createElement('span'); btext.className = 'btext'; bubble.appendChild(btext);
      const chip = document.createElement('div'); chip.className = 'chip';
      const dot = document.createElement('span'); dot.className = 'dot';
      const name = document.createElement('span'); name.textContent = a.name;
      chip.append(dot, name); tag.append(bubble, chip);
      tag.hidden = !!a.hidden; // a building under wraps has no sign
      labels.appendChild(tag);

      return Object.assign(a, parts, { g, person, ring, tag, btext, status: 'idle', anchor: new THREE.Vector3(x, parts.top * sc + 0.6, z) });
    });

    // Trees and clouds
    const treeTops = [];
    function tree(x, z, s) {
      const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s);
      g.add(mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.9, 6), mat(0x8a5a33), 0, 0.45, 0));
      const cone = rand() < 0.5;
      if (cone) g.add(mesh(new THREE.ConeGeometry(0.85, 1.9, 7), mat(0x3e9e4a), 0, 1.75, 0));
      else g.add(mesh(new THREE.IcosahedronGeometry(0.85, 0), mat(0x55b84a), 0, 1.5, 0));
      treeTops.push(new THREE.Vector3(x, (cone ? 2.55 : 2.25) * s, z));
      scene.add(g);
    }
    const nearBuilding = ang => AGENTS.some(a => !a.r && Math.abs(((ang * 180 / Math.PI) - a.angle + 540) % 360 - 180) < 17);
    for (let i = 0; i < 70; i++) {
      const ang = rand() * Math.PI * 2, r = 18 + rand() * 4;
      if (nearBuilding(ang) && r < 19.5) continue;
      tree(Math.cos(ang) * r, Math.sin(ang) * r, 0.8 + rand() * 0.6);
    }
    // Built plots: the Birdhouses (Nov 15, 2026, a YouTube viewer's idea) between What If and
    // How It Works; the Bird Bath (Nov 17, 2026, a YouTube viewer asked "Where is the bird bath?"),
    // being built between How It Works and the Banker; and the empty "? NEXT BUILD" plot, now
    // between the Banker and the Programmer.
    const BIRDHOUSE_ANGLE = 0, BIRDBATH_ANGLE = 60, PLOT_ANGLE = 120;
    const BUILT = [BIRDHOUSE_ANGLE, BIRDBATH_ANGLE, PLOT_ANGLE];
    AGENTS.forEach(a => {
      if (a.r) return;
      if (BUILT.includes((a.angle + 30 + 360) % 360)) return; // leave room for the plots
      if (AGENTS.some(b => b.r && b.angle === a.angle + 30)) return; // or for an inner bucket
      const ang = (a.angle + 30) * Math.PI / 180; tree(Math.cos(ang) * 9.5, Math.sin(ang) * 9.5, 0.9);
    });
    const extras = [];
    function plotAt(angle) {
      const ang = angle * Math.PI / 180, r = 7.6;
      const plot = new THREE.Group(); plot.position.set(Math.cos(ang) * r, 0, Math.sin(ang) * r);
      plot.rotation.y = Math.atan2(-Math.cos(ang), -Math.sin(ang)); // the front faces the plaza
      scene.add(plot);
      return plot;
    }

    // The Birdhouses: three little houses on poles. The first few birds of the flock sit on them.
    const perches = [];
    {
      const plot = plotAt(BIRDHOUSE_ANGLE);
      const lawn = mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.1, 24), mat(0x6cc24a), 0, 0.05, 0); lawn.castShadow = false; plot.add(lawn);
      const HOUSES = [[-1.1, 0.5, 2.0, 0xe5533d], [0.15, -0.6, 2.6, 0x2f80ed], [1.15, 0.55, 1.7, 0xf2b10c]];
      for (const [x, z, h, roofColor] of HOUSES) {
        const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = (x * 0.4);
        g.add(box(0.12, h, 0.12, 0x8a5a33, 0, h / 2, 0));
        g.add(box(0.7, 0.62, 0.62, 0xffffff, 0, h + 0.31, 0));
        const roof = mesh(new THREE.ConeGeometry(0.62, 0.5, 4), mat(roofColor), 0, h + 0.87, 0); roof.rotation.y = Math.PI / 4; g.add(roof);
        const hole = mesh(new THREE.CircleGeometry(0.13, 12), new THREE.MeshBasicMaterial({ color: 0x1c2836 }), 0, h + 0.36, 0.312); hole.castShadow = false; g.add(hole);
        g.add(box(0.05, 0.05, 0.3, 0x8a5a33, 0, h + 0.16, 0.42));
        plot.add(g);
        plot.updateMatrixWorld(true);
        perches.push({ pos: new THREE.Vector3(0, h + 0.08, 0.52).applyMatrix4(g.matrixWorld), yaw: plot.rotation.y + g.rotation.y });
        perches.push({ pos: new THREE.Vector3(0, h + 0.95, 0).applyMatrix4(g.matrixWorld), yaw: plot.rotation.y + g.rotation.y });
      }
    }

    // The Bird Bath, under construction: a stone bowl on a pedestal, half filled with water,
    // inside a little fence with cones, a pile of stones and three workers.
    {
      const plot = plotAt(BIRDBATH_ANGLE);
      const dirt = box(2.8, 0.12, 2.8, 0x9b6b3f, 0, 0.06, 0); dirt.castShadow = false; plot.add(dirt);
      const stone = 0xc9c4b8;
      plot.add(mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.2, 16), mat(stone), 0, 0.22, 0));
      plot.add(mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.9, 12), mat(stone), 0, 0.77, 0));
      const bowl = mesh(new THREE.CylinderGeometry(0.95, 0.45, 0.32, 20, 1, true), mat(stone), 0, 1.36, 0);
      bowl.material.side = THREE.DoubleSide; plot.add(bowl);
      plot.add(mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.06, 16), mat(stone), 0, 1.22, 0));
      const water = mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.05, 20), new THREE.MeshLambertMaterial({ color: 0x5fb8f0, transparent: true, opacity: 0.85 }), 0, 1.38, 0);
      water.castShadow = false; plot.add(water);
      for (const [x, z] of [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]]) plot.add(box(0.1, 0.55, 0.1, 0xe8d3a8, x, 0.28, z));
      for (const z of [-1.4, 1.4]) plot.add(box(2.8, 0.06, 0.05, 0xff7a1a, 0, 0.45, z));
      for (const x of [-0.9, 0.9]) plot.add(mesh(new THREE.ConeGeometry(0.16, 0.42, 10), mat(0xff7a1a), x, 0.21, 1.75));
      for (const [x, z, s] of [[1.0, -0.8, 0.22], [1.2, -0.5, 0.18], [0.85, -0.45, 0.2], [1.05, -0.62, 0.16]]) plot.add(mesh(new THREE.DodecahedronGeometry(s, 0), mat(0xa9a395), x, s, z));
      const k = 0.85;
      worker(plot, -0.85, 0, 0.6, 2.4, 'hammer').g.scale.setScalar(k);
      worker(plot, 0.9, 0, 0.95, Math.PI, 'clipboard').g.scale.setScalar(k);
      worker(plot, -1.0, 0, -0.9, 0, 'plank', [new THREE.Vector3(-1.0, 0, -0.9), new THREE.Vector3(0.6, 0, -1.0)]).g.scale.setScalar(k);
      plot.updateMatrixWorld(true);
      for (const deg of [20, 140, 260]) { // bathing birds sit on the rim
        const th = deg * Math.PI / 180;
        perches.push({ pos: new THREE.Vector3(Math.cos(th) * 0.9, 1.5, Math.sin(th) * 0.9).applyMatrix4(plot.matrixWorld), yaw: plot.rotation.y - th });
      }
    }

    // The empty "? NEXT BUILD" plot: each week something new goes here (the followers pick).
    {
      const plot = plotAt(PLOT_ANGLE);
      const dirt = box(2.6, 0.12, 2.6, 0x9b6b3f, 0, 0.06, 0); dirt.castShadow = false; plot.add(dirt);
      for (const [x, z] of [[-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3]]) plot.add(box(0.12, 0.5, 0.12, 0xe8d3a8, x, 0.25, z));
      for (const z of [-1.3, 1.3]) plot.add(box(2.6, 0.06, 0.05, 0xe8d3a8, 0, 0.4, z));
      plot.add(box(0.12, 1.5, 0.12, 0x8a5a33, 0, 0.75, 0));
      const c = document.createElement('canvas'); c.width = 256; c.height = 160;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#f6e7c4'; ctx.fillRect(0, 0, 256, 160);
      words(ctx, '?', 128, 70, 100, '#d6402f');
      words(ctx, 'NEXT BUILD', 128, 136, 28, '#3a2a20');
      const wood = mat(0x8a5a33);
      const sign = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.08), [wood, wood, wood, wood, new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(c) }), wood]);
      sign.position.set(0, 1.6, 0.07); sign.castShadow = true; plot.add(sign);
    }
    // Places where birds land: birdhouses, bucket rims, treetops and the grass.
    const spots = [];
    const spot = (pos, yaw) => spots.push({ pos, yaw: yaw === undefined ? rand() * Math.PI * 2 : yaw, bird: null });
    perches.forEach(pc => spot(pc.pos, pc.yaw));
    for (const a of agents) {
      if (a.hidden) continue;
      a.g.updateMatrixWorld(true);
      for (const deg of [35, 90, 145]) {
        const th = deg * Math.PI / 180;
        spot(new THREE.Vector3(RT * Math.cos(th), BH + 0.1, RT * Math.sin(th)).applyMatrix4(a.g.matrixWorld), a.g.rotation.y + Math.atan2(Math.cos(th), Math.sin(th)));
      }
    }
    treeTops.forEach((p, i) => { if (i % 3 === 0) spot(p); });
    for (let i = 0; i < 12; i++) {
      const deg = i * 30 + 15, ang = deg * Math.PI / 180, r = 16.6 + (i % 2) * 0.6;
      spot(new THREE.Vector3(Math.cos(ang) * r, 0.02, Math.sin(ang) * r));
    }
    for (let i = 0; i < 8; i++) {
      const ang = (i * 45 + 22) * Math.PI / 180;
      spot(new THREE.Vector3(Math.cos(ang) * 4.4, 0.18, Math.sin(ang) * 4.4));
    }

    const clouds = [];
    for (let i = 0; i < 6; i++) {
      const c = new THREE.Group(), m = mat(0xffffff);
      for (let j = 0; j < 3; j++) { const p = mesh(new THREE.IcosahedronGeometry(1.2 + rand(), 1), m, j * 1.6, rand() * 0.5, rand()); p.castShadow = false; c.add(p); }
      c.position.set(-60 + rand() * 120, 14 + rand() * 6, -40 + rand() * 60); c.scale.y = 0.6;
      c.userData.v = 0.6 + rand() * 0.8; scene.add(c); clouds.push(c);
    }

    // Birds: one for each follower (up to MAX_BIRDS). Most sit around the island; 5-10 fly at a
    // time, and every few seconds one lands and another takes off.
    const MAX_BIRDS = 60;
    const BIRD_COLORS = [0xffffff, 0xffffff, 0x2f80ed, 0xe5533d, 0xf2b10c, 0x7656d1, 0x1c2836];
    const birds = [];
    function bird(i) {
      let bs = 1013 + i * 7919;
      const br = () => (bs = (bs * 16807) % 2147483647) / 2147483647;
      const color = BIRD_COLORS[i % BIRD_COLORS.length], m = mat(color);
      const g = new THREE.Group();
      const body = mesh(new THREE.SphereGeometry(0.3, 8, 6), m); body.scale.set(0.9, 0.75, 1.6); g.add(body);
      g.add(mesh(new THREE.SphereGeometry(0.21, 8, 6), m, 0, 0.14, 0.45));
      const beak = mesh(new THREE.ConeGeometry(0.07, 0.22, 5), mat(0xffa21a), 0, 0.12, 0.7); beak.rotation.x = Math.PI / 2; g.add(beak);
      const wings = [-1, 1].map(side => {
        const pivot = new THREE.Group(); pivot.position.set(side * 0.18, 0.08, 0);
        pivot.add(box(0.8, 0.05, 0.38, color === 0xffffff ? 0xdfe6ee : color, side * 0.42, 0, 0));
        g.add(pivot); return pivot;
      });
      g.traverse(o => { o.castShadow = false; });
      g.scale.setScalar(0.8);
      g.visible = false;
      const b = { g, wings, mode: 'fly', spot: null, from: null, t0: 0, r: 9 + br() * 20, h: 8 + br() * 7, w: (0.18 + br() * 0.25) * (br() < 0.5 ? -1 : 1), p: br() * Math.PI * 2 };
      scene.add(g);
      return b;
    }
    function orbit(b, t, out) {
      const a = b.p + b.w * t;
      out.set(Math.cos(a) * b.r, b.h + Math.sin(t * 0.8 + b.p) * 0.6, Math.sin(a) * b.r);
      return Math.atan2(-Math.sin(a) * b.w, Math.cos(a) * b.w);
    }
    const FLIGHT = 2.8, SIT = 0.2;
    const ease = k => k * k * (3 - 2 * k);
    const goal = new THREE.Vector3();
    function wingsAt(b, t, flying) {
      if (!flying) { // folded along the back
        b.wings[0].rotation.set(0, -1.4, 0.25); b.wings[1].rotation.set(0, 1.4, -0.25);
        return;
      }
      const f = reduced ? 0.2 : Math.sin(t * 9 + b.p * 3) * 0.6;
      b.wings[0].rotation.set(0, 0, -f); b.wings[1].rotation.set(0, 0, f);
    }
    function placeBird(b, t) {
      if (b.mode === 'sit') {
        b.g.position.copy(b.spot.pos);
        b.g.position.y += SIT + (reduced ? 0 : Math.max(0, Math.sin(t * 1.3 + b.p * 5)) ** 12 * 0.25);
        b.g.rotation.y = b.spot.yaw;
        wingsAt(b, t, false);
        return;
      }
      if (b.mode === 'fly') { b.g.rotation.y = orbit(b, t, b.g.position); wingsAt(b, t, true); return; }
      // 'land' glides down to its spot; 'up' climbs back to its circle.
      const k = Math.min(1, (t - b.t0) / FLIGHT), e = ease(k);
      if (b.mode === 'land') { goal.copy(b.spot.pos); goal.y += SIT; } else orbit(b, t, goal);
      const x = b.from.x + (goal.x - b.from.x) * e, z = b.from.z + (goal.z - b.from.z) * e;
      const y = b.from.y + (goal.y - b.from.y) * e + Math.sin(Math.PI * k) * 1.5;
      const dx = x - b.g.position.x, dz = z - b.g.position.z;
      if (dx * dx + dz * dz > 1e-6) b.g.rotation.y = Math.atan2(dx, dz);
      b.g.position.set(x, y, z);
      wingsAt(b, t, true);
      if (k >= 1) b.mode = b.mode === 'land' ? 'sit' : 'fly';
    }
    const flyTarget = n => Math.min(n, Math.max(5, Math.min(10, 5 + Math.floor(n / 15))));
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    function land(b, t, instant) {
      const free = spots.filter(x => !x.bird);
      if (!free.length) return false;
      b.spot = pick(free); b.spot.bird = b;
      if (instant) b.mode = 'sit';
      else { b.mode = 'land'; b.from = b.g.position.clone(); b.t0 = t; }
      return true;
    }
    function takeOff(b, t, instant) {
      if (b.spot) { b.spot.bird = null; b.spot = null; }
      if (instant) b.mode = 'fly';
      else { b.mode = 'up'; b.from = b.g.position.clone(); b.t0 = t; }
    }
    let shown = 0, nextSwap = 3;
    function schedule(t) {
      if (t < nextSwap) return;
      nextSwap = t + 2.5 + Math.random() * 2;
      const vis = birds.slice(0, shown);
      const flying = vis.filter(b => b.mode === 'fly');
      const sitting = vis.filter(b => b.mode === 'sit');
      const airborne = vis.filter(b => b.mode === 'fly' || b.mode === 'up').length;
      const want = flyTarget(shown);
      if (airborne > want && flying.length) { land(pick(flying), t); return; }
      if (airborne < want && sitting.length) { takeOff(pick(sitting), t); return; }
      if (flying.length && sitting.length) { const up = pick(sitting); land(pick(flying), t); takeOff(up, t); }
    }
    // Named birds: followers who asked for one get their username on a small tag.
    function setBirds(n, names) {
      const want = Math.min(Math.max(0, n | 0, names.length), MAX_BIRDS);
      while (birds.length < want) birds.push(bird(birds.length));
      const t = clock.elapsedTime;
      birds.forEach((b, i) => {
        if (i < want && !b.g.visible) {
          b.g.visible = true;
          const airborne = birds.filter(x => x !== b && x.g.visible && (x.mode === 'fly' || x.mode === 'up')).length;
          if (airborne < flyTarget(want) || !land(b, t, true)) takeOff(b, t, true);
          placeBird(b, t);
        } else if (i >= want && b.g.visible) {
          b.g.visible = false;
          takeOff(b, t, true);
        }
        const name = i < want ? names[i] || '' : '';
        if (name && !b.tag) {
          b.tag = document.createElement('div'); b.tag.className = 'tag birdtag'; b.tag.dataset.id = 'bird';
          labels.appendChild(b.tag);
        }
        if (b.tag) { b.tag.textContent = name; b.tag.hidden = !name; }
      });
      shown = want;
    }

    const v = new THREE.Vector3();
    const clock = new THREE.Clock();
    function frame() {
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
      for (const a of agents) {
        const working = a.status === 'working';
        a.ring.material.color.setHex(RING[a.status]);
        a.ring.material.opacity = working ? 0.55 + Math.sin(t * 5) * 0.3 : (a.status === 'done' ? 0.8 : 0.35);
        a.glow.forEach(m => { m.emissiveIntensity = working ? 0.55 + Math.sin(t * 4) * 0.2 : (a.status === 'done' ? 0.25 : 0); });
        a.person.position.y = working && !reduced ? Math.abs(Math.sin(t * 6)) * 0.18 : 0;
        for (const s of a.spin) {
          if (s.wave) { s.o.rotation.y = Math.sin(t * 3) * 0.25; continue; }
          const sp = working ? s.speed : (s.always || 0);
          if (!reduced) s.o.rotation[s.axis] += sp * dt;
        }
        if (a.bits && !reduced) a.bits.forEach(b => {
          const k = (t * (working ? 0.45 : 0.12) + b.userData.off) % 1;
          b.position.y = BH + k * 3.2;
          b.material.opacity = Math.sin(k * Math.PI);
        });
        if (a.bars) a.bars.forEach((b, i) => {
          const h = b.userData.base * (working && !reduced ? 0.75 + 0.35 * Math.abs(Math.sin(t * 2.2 + i)) : 1);
          b.scale.y = h; b.position.y = BH + h / 2;
        });
        if (a.blink) a.blink.material.emissiveIntensity = working ? (Math.sin(t * 8) > 0 ? 1 : 0.1) : 0.4;

        v.copy(a.anchor).project(camera);
        if (v.z > 1) { a.tag.style.display = 'none'; continue; }
        a.tag.style.display = '';
        const pad = Math.min(90, innerWidth * 0.2);
        const x = Math.max(pad, Math.min(innerWidth - pad, (v.x * 0.5 + 0.5) * innerWidth));
        const y = (-v.y * 0.5 + 0.5) * innerHeight;
        a.tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
        a.tag.style.zIndex = String(Math.round((1 - v.z) * 1000));
      }
      if (!reduced) {
        schedule(t);
        birds.forEach(b => { if (b.g.visible) placeBird(b, t); });
        for (const w of workers) {
          if (w.tool === 'hammer') w.arm.rotation.x = -1.2 + Math.sin(t * 7 + w.p) * 0.5;
          if (w.path) {
            const ph = t * 0.5 + w.p, k = (Math.sin(ph) + 1) / 2, [a, b] = w.path;
            const dir = Math.cos(ph) >= 0 ? 1 : -1;
            w.g.position.set(a.x + (b.x - a.x) * k, w.y + Math.abs(Math.sin(t * 7)) * 0.06, a.z + (b.z - a.z) * k);
            w.g.rotation.y = Math.atan2((b.x - a.x) * dir, (b.z - a.z) * dir);
          }
        }
      }
      for (const b of birds) {
        if (!b.tag || b.tag.hidden) continue;
        v.copy(b.g.position); v.y += 0.7; v.project(camera);
        if (v.z > 1) { b.tag.style.display = 'none'; continue; }
        b.tag.style.display = '';
        b.tag.style.transform = `translate(${(v.x * 0.5 + 0.5) * innerWidth}px, ${(-v.y * 0.5 + 0.5) * innerHeight}px) translate(-50%, -100%)`;
      }
      for (const e of extras) {
        v.copy(e.anchor).project(camera);
        if (v.z > 1) { e.tag.style.display = 'none'; continue; }
        e.tag.style.display = '';
        const ex = Math.max(Math.min(90, innerWidth * 0.2), Math.min(innerWidth - Math.min(90, innerWidth * 0.2), (v.x * 0.5 + 0.5) * innerWidth));
        e.tag.style.transform = `translate(${ex}px, ${(-v.y * 0.5 + 0.5) * innerHeight}px) translate(-50%, -100%)`;
        e.tag.style.zIndex = String(Math.round((1 - v.z) * 1000));
      }
      if (!reduced) clouds.forEach(c => { c.position.x += c.userData.v * dt; if (c.position.x > 70) c.position.x = -70; });
      pool.material.color.setHSL(0.54, 0.8, 0.68 + Math.sin(t * 2) * 0.03);
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }
    frame();

    addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });

    return {
      apply(state) {
        for (const a of agents) {
          const s = state.agents[a.id] || { status: 'idle', task: '' };
          a.status = s.status;
          a.tag.dataset.s = s.status;
          a.btext.textContent = s.task;
          a.btext.parentNode.hidden = !s.task;
        }
        setBirds(state.followers || 0, state.birds || []);
      },
    };
  }

  root.TownScene = { create, MAX_BIRDS: 60 };
})(this);
