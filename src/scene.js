// The 3D town. TownScene.create(stageEl, labelsEl) -> { apply(state) }
(function (root) {
  const AGENTS = [
    { id: 'chief',      name: 'Chief of Staff', kind: 'hall',       shirt: 0xe5533d, angle: -90 },
    { id: 'whatif',     name: 'What If Studio', kind: 'whatif',     shirt: 0x7656d1, angle: -30 },
    { id: 'howitworks', name: 'How It Works',   kind: 'howitworks', shirt: 0xee8434, angle: 30 },
    { id: 'banker',     name: 'Banker',         kind: 'bank',       shirt: 0x3f9f6b, angle: 90 },
    { id: 'programmer', name: 'Programmer',     kind: 'workshop',   shirt: 0x2e3d5a, angle: 150 },
    { id: 'news',       name: 'World News',     kind: 'news',       shirt: 0x2f6fd6, angle: 210 },
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

    // Building kit
    function box(w, h, d, c, x, y, z) { return mesh(new THREE.BoxGeometry(w, h, d), typeof c === 'number' ? mat(c) : c, x, y, z); }
    function roof(w, d, h, c, y) {
      const r = mesh(new THREE.ConeGeometry(Math.SQRT1_2, h, 4), mat(c), 0, y + h / 2, 0);
      r.rotation.y = Math.PI / 4; r.scale.set(w, 1, d); return r;
    }
    function windows(g, glow, w, h, depth, cols, y) {
      for (let i = 0; i < cols; i++) {
        const x = (i - (cols - 1) / 2) * (w / cols);
        g.add(box(0.6, 0.75, 0.08, glow, x, y, depth / 2 + 0.03));
      }
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
    const glowMat = c => mat(c, { emissive: c, emissiveIntensity: 0 });

    const builders = {
      hall(g) { // Town Hall: Chief of Staff
        const glow = glowMat(0xffe08a);
        g.add(box(6.2, 0.4, 5, 0xc9ced6, 0, 0.2, 0));
        g.add(box(5.4, 3.2, 4, 0xf6f2e8, 0, 2, 0));
        for (let i = 0; i < 4; i++) g.add(mesh(new THREE.CylinderGeometry(0.22, 0.26, 2.8, 8), mat(0xffffff), -2 + i * 1.33, 1.8, 2.45));
        g.add(box(5.8, 0.4, 1.4, 0xf6f2e8, 0, 3.4, 2.1));
        windows(g, glow, 5.4, 3.2, 4, 3, 2.2);
        g.add(roof(5.8, 4.4, 2.2, 0xe5533d, 3.6));
        g.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 6), mat(0x55606e), 0, 6.8, 0));
        const flag = box(1.1, 0.6, 0.06, 0x2f80ed, 0.55, 7.6, 0); g.add(flag);
        return { glow: [glow], spin: [{ o: flag, wave: true }], top: 8.6 };
      },
      workshop(g) { // Programmer
        const glow = glowMat(0x39e4ff);
        g.add(box(4.6, 2.8, 4.2, 0x2e3d5a, 0, 1.4, 0));
        g.add(box(5, 0.35, 4.6, 0x46587c, 0, 2.95, 0));
        g.add(box(3, 1.5, 0.1, glow, 0, 1.7, 2.12));
        g.add(box(1, 0.18, 0.12, 0x2e3d5a, -0.6, 1.95, 2.2));
        g.add(box(0.7, 0.18, 0.12, 0x2e3d5a, 0.3, 1.55, 2.2));
        g.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), mat(0x9aa7b6), 1.4, 3.7, -1));
        const dish = mesh(new THREE.CylinderGeometry(0.9, 0.15, 0.35, 14), mat(0xe8edf2), 1.4, 4.4, -1);
        dish.rotation.z = 0.6; g.add(dish);
        return { glow: [glow], spin: [{ o: dish, axis: 'y', speed: 1.2 }], top: 5.6 };
      },
      bank(g) { // Banker
        const glow = glowMat(0xffe7a3);
        g.add(box(5, 0.35, 4.2, 0xc9ced6, 0, 0.18, 0));
        g.add(box(4.6, 2.8, 3.6, 0xfff1d2, 0, 1.75, 0));
        windows(g, glow, 4.6, 2.8, 3.6, 2, 1.9);
        g.add(box(1, 1.5, 0.1, 0x7a4b2a, 0, 1.1, 1.83));
        g.add(roof(5, 4, 1.4, 0x3f9f6b, 3.15));
        const coin = new THREE.Group();
        const face = mesh(new THREE.CylinderGeometry(1, 1, 0.26, 28), mat(0xf2b10c, { emissive: 0xf2b10c, emissiveIntensity: 0.15 }));
        face.rotation.x = Math.PI / 2; coin.add(face);
        coin.add(box(0.22, 1.1, 0.3, 0xb07e00, 0, 0, 0));
        coin.position.set(0, 5.6, 0); g.add(coin);
        return { glow: [glow], spin: [{ o: coin, axis: 'y', speed: 1.4, always: 0.4 }], top: 7.2 };
      },
      whatif(g) { // What If studio: an observatory
        const glow = glowMat(0xc8b6ff);
        g.add(box(4.4, 2.6, 4.4, 0x7656d1, 0, 1.3, 0));
        windows(g, glow, 4.4, 2.6, 4.4, 2, 1.4);
        g.add(mesh(new THREE.SphereGeometry(2, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xe9e3ff), 0, 2.6, 0));
        const scope = mesh(new THREE.CylinderGeometry(0.28, 0.4, 2.4, 10), mat(0x5b6474), 0.9, 4.2, 0.4);
        scope.rotation.z = -0.9; g.add(scope);
        const orbit = new THREE.Group(); orbit.position.set(0, 6.4, 0);
        const planet = mesh(new THREE.SphereGeometry(0.5, 14, 10), mat(0xff9a3c), 1.8, 0, 0);
        const ring = mesh(new THREE.TorusGeometry(0.8, 0.07, 6, 24), mat(0xffd36b), 1.8, 0, 0); ring.rotation.x = 1.2;
        orbit.add(planet, ring); g.add(orbit);
        return { glow: [glow], spin: [{ o: orbit, axis: 'y', speed: 1.6, always: 0.25 }], top: 7.4 };
      },
      howitworks(g) { // How It Works studio: a gear factory
        const glow = glowMat(0xffd0a0);
        g.add(box(4.8, 2.8, 3.8, 0xee8434, 0, 1.4, 0));
        for (let i = 0; i < 3; i++) { const t = roof(1.6, 3.8, 1, 0xb85e1e, 2.8); t.position.x = -1.6 + i * 1.6; g.add(t); }
        windows(g, glow, 4.8, 2.8, 3.8, 2, 1.2);
        g.add(mesh(new THREE.CylinderGeometry(0.35, 0.4, 2.2, 10), mat(0x7a8592), 1.7, 4.1, -1.1));
        const g1 = gear(0.9, 10, 0xc4ccd6); g1.position.set(-1, 2.2, 2.15); g.add(g1);
        const g2 = gear(0.55, 7, 0x9aa7b6); g2.position.set(0.45, 2.85, 2.15); g.add(g2);
        return { glow: [glow], spin: [{ o: g1, axis: 'z', speed: 1.3 }, { o: g2, axis: 'z', speed: -2.1 }], top: 5.8 };
      },
      news(g) { // World News tower
        const glow = glowMat(0xa8d4ff), onair = glowMat(0xff3b3b);
        g.add(box(3.4, 5.2, 3.4, 0x2f6fd6, 0, 2.6, 0));
        for (let r = 0; r < 3; r++) windows(g, glow, 3.4, 5.2, 3.4, 2, 1.3 + r * 1.4);
        g.add(box(3.8, 0.35, 3.8, 0x1f4ea0, 0, 5.35, 0));
        g.add(box(1.8, 0.5, 0.1, onair, 0, 4.9, 1.75));
        g.add(mesh(new THREE.CylinderGeometry(0.07, 0.12, 2.6, 6), mat(0xe8edf2), 0, 6.8, 0));
        const beacon = mesh(new THREE.SphereGeometry(0.22, 10, 8), mat(0xff3b3b, { emissive: 0xff3b3b, emissiveIntensity: 0.6 }), 0, 8.2, 0);
        g.add(beacon);
        const globe = new THREE.Group(); globe.position.set(-1.3, 6.2, 0.9);
        globe.add(mesh(new THREE.SphereGeometry(0.6, 14, 10), mat(0x3fa7e8)));
        globe.add(mesh(new THREE.SphereGeometry(0.62, 6, 4, 0, 2), mat(0x6fcf6a)));
        g.add(globe);
        return { glow: [glow, onair], spin: [{ o: globe, axis: 'y', speed: 1.5, always: 0.3 }], blink: beacon, top: 9 };
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
      const ang = a.angle * Math.PI / 180, x = Math.cos(ang) * R, z = Math.sin(ang) * R;
      const path = box(1.7, 0.1, R - 5, 0xf1dfb0, 0, 0.05, 0);
      path.castShadow = false;
      const pg = new THREE.Group(); pg.add(path); path.position.z = (R - 5) / 2 + 5;
      pg.rotation.y = Math.atan2(x, z); scene.add(pg);

      const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = Math.atan2(-x, -z);
      const parts = builders[a.kind](g);
      scene.add(g);

      const person = villager(a.shirt); person.position.set(1.6, 0, 3.9); g.add(person);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.75, 1.05, 32), new THREE.MeshBasicMaterial({ color: RING.idle, transparent: true, opacity: 0.5 }));
      ring.rotation.x = -Math.PI / 2; ring.position.set(1.6, 0.07, 3.9); g.add(ring);

      const tag = document.createElement('div');
      tag.className = 'tag'; tag.dataset.s = 'idle'; tag.dataset.id = a.id;
      const bubble = document.createElement('div'); bubble.className = 'bubble';
      const btext = document.createElement('span'); btext.className = 'btext'; bubble.appendChild(btext);
      const chip = document.createElement('div'); chip.className = 'chip';
      const dot = document.createElement('span'); dot.className = 'dot';
      const name = document.createElement('span'); name.textContent = a.name;
      chip.append(dot, name); tag.append(bubble, chip);
      labels.appendChild(tag);

      return Object.assign(a, parts, { person, ring, tag, btext, status: 'idle', anchor: new THREE.Vector3(x, parts.top + 0.6, z) });
    });

    // Trees and clouds
    function tree(x, z, s) {
      const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s);
      g.add(mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.9, 6), mat(0x8a5a33), 0, 0.45, 0));
      if (rand() < 0.5) g.add(mesh(new THREE.ConeGeometry(0.85, 1.9, 7), mat(0x3e9e4a), 0, 1.75, 0));
      else g.add(mesh(new THREE.IcosahedronGeometry(0.85, 0), mat(0x55b84a), 0, 1.5, 0));
      scene.add(g);
    }
    const nearBuilding = ang => AGENTS.some(a => Math.abs(((ang * 180 / Math.PI) - a.angle + 540) % 360 - 180) < 17);
    for (let i = 0; i < 70; i++) {
      const ang = rand() * Math.PI * 2, r = 18 + rand() * 4;
      if (nearBuilding(ang) && r < 19.5) continue;
      tree(Math.cos(ang) * r, Math.sin(ang) * r, 0.8 + rand() * 0.6);
    }
    AGENTS.forEach(a => { const ang = (a.angle + 30) * Math.PI / 180; tree(Math.cos(ang) * 9.5, Math.sin(ang) * 9.5, 0.9); });
    const clouds = [];
    for (let i = 0; i < 6; i++) {
      const c = new THREE.Group(), m = mat(0xffffff);
      for (let j = 0; j < 3; j++) { const p = mesh(new THREE.IcosahedronGeometry(1.2 + rand(), 1), m, j * 1.6, rand() * 0.5, rand()); p.castShadow = false; c.add(p); }
      c.position.set(-60 + rand() * 120, 14 + rand() * 6, -40 + rand() * 60); c.scale.y = 0.6;
      c.userData.v = 0.6 + rand() * 0.8; scene.add(c); clouds.push(c);
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
      },
    };
  }

  root.TownScene = { create };
})(this);
