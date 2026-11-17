// Aloha Island (Nov 17, 2026, owner's pick): a Hawaiian island whose sky follows the real time in
// Hawaii: morning, day, sunset and night with stars and tiki torches. Palms and flower bushes
// replace the pine trees, a sandy beach and a lagoon ring the island, a volcano sits across the
// water. (WhiteBucket stood in the plaza for a day; the owner had him removed, Nov 17, 2026.)
// The normal look since Nov 17, 2026. ?hour=21 previews another time of day; ?classic shows the old island.
(function (root) {
  const HAWAII_OFFSET = -10; // Hawaii has no daylight saving: always UTC-10

  function hawaiiHour(now) {
    const d = now || new Date();
    return ((d.getUTCHours() + HAWAII_OFFSET + 24) % 24) + d.getUTCMinutes() / 60;
  }

  function clockText(hour) {
    const h = Math.floor(hour), m = Math.floor((hour - h) * 60);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  }

  // Looks through the day. Colors are hex numbers; torch and stars go 0..1.
  const NIGHT = { skyTop: 0x060b22, skyBottom: 0x2a3a6e, fog: 0x0e1838, sun: 0x9fb4ff, sunI: 0.32, hemiSky: 0x6476b8, hemiGround: 0x1b2240, hemiI: 0.62, water: 0x0e2d4f, lagoon: 0x1d5a78, torch: 1, stars: 1 };
  const DAWN = { skyTop: 0x5a6fb0, skyBottom: 0xffb38a, fog: 0xf2b9a0, sun: 0xffb07a, sunI: 0.6, hemiSky: 0xffd9c8, hemiGround: 0x6a6a8a, hemiI: 0.62, water: 0x3a7fb0, lagoon: 0x6fc6c8, torch: 0.4, stars: 0.15 };
  const DAY = { skyTop: 0x4aa3df, skyBottom: 0xc8ecf8, fog: 0xcfe9f5, sun: 0xfff3e0, sunI: 0.85, hemiSky: 0xffffff, hemiGround: 0x7fae5a, hemiI: 0.8, water: 0x1d9fd0, lagoon: 0x5fe0d6, torch: 0, stars: 0 };
  const SUNSET = { skyTop: 0x3b4a8f, skyBottom: 0xff9a5c, fog: 0xe8946e, sun: 0xff9a50, sunI: 0.65, hemiSky: 0xffc9a0, hemiGround: 0x5a5a80, hemiI: 0.62, water: 0x2a6f9f, lagoon: 0x4fb0b8, torch: 0.6, stars: 0.1 };
  const KEYS = [[0, NIGHT], [5.2, NIGHT], [6.3, DAWN], [7.6, DAY], [17.2, DAY], [18.4, SUNSET], [19.5, NIGHT], [24, NIGHT]];

  const mixHex = (a, b, k) => {
    const c = [16, 8, 0].map(s => Math.round(((a >> s) & 255) + ((((b >> s) & 255) - ((a >> s) & 255)) * k)));
    return (c[0] << 16) | (c[1] << 8) | c[2];
  };
  function look(hour) {
    const h = ((hour % 24) + 24) % 24;
    let i = 1; while (h > KEYS[i][0]) i++;
    const [h0, a] = KEYS[i - 1], [h1, b] = KEYS[i], k = h1 === h0 ? 0 : (h - h0) / (h1 - h0);
    const out = {};
    for (const key of Object.keys(a)) out[key] = Number.isInteger(a[key]) && a[key] > 1 ? mixHex(a[key], b[key], k) : a[key] + (b[key] - a[key]) * k;
    out.phase = h < 5.2 || h >= 19.5 ? 'night' : h < 7.6 ? 'morning' : h < 17.2 ? 'day' : 'sunset';
    return out;
  }

  const css = n => '#' + n.toString(16).padStart(6, '0');

  // A palm (2 of 3 trees) or a flower bush. Returns where a bird can sit on top.
  function tree(T, mat, mesh, g, rand) {
    if (rand() < 0.67) {
      let px = 0, py = 0; const lean = (rand() - 0.5) * 0.6;
      for (let i = 0; i < 6; i++) {
        px += lean * 0.12; py += 0.46;
        const seg = mesh(new T.CylinderGeometry(0.13, 0.16, 0.5, 6), mat(0x9c6b3d), px, py, 0);
        seg.rotation.z = -lean * 0.3; g.add(seg);
      }
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * Math.PI * 2 + rand() * 0.3;
        const leaf = mesh(new T.ConeGeometry(0.22, 1.6, 4), mat(i % 2 ? 0x2f9e4f : 0x3fb85c), px + Math.cos(a) * 0.62, py + 0.05, Math.sin(a) * 0.62);
        leaf.rotation.set(Math.sin(a) * 1.25, 0, -Math.cos(a) * 1.25); leaf.scale.z = 0.35; g.add(leaf);
      }
      g.add(mesh(new T.SphereGeometry(0.13, 6, 5), mat(0x6b4423), px + 0.12, py - 0.15, 0.1));
      return py + 0.15;
    }
    g.add(mesh(new T.IcosahedronGeometry(0.7, 0), mat(0x3c9a4a), 0, 0.55, 0));
    const FLOWERS = [0xff5a8a, 0xffd23f, 0xff8a3d, 0xffffff];
    for (let f = 0; f < 4; f++) g.add(mesh(new T.SphereGeometry(0.12, 6, 4), mat(FLOWERS[f]), Math.cos(f * 1.7) * 0.55, 0.8 + (f % 2) * 0.2, Math.sin(f * 1.7) * 0.55));
    return 1.25;
  }

  // Everything else; returns update(t) for the render loop.
  function build(ctx) {
    const { THREE: T, scene, mat, mesh, sun, hemi, water, fog, R, outerAngles, reduced } = ctx;
    const params = new URLSearchParams(location.search);
    const fixedHour = params.has('hour') ? Number(params.get('hour')) : null;

    const beach = mesh(new T.CylinderGeometry(24.6, 24.6, 0.5, 48), mat(0xf2dca4), 0, -0.85, 0);
    beach.castShadow = false; scene.add(beach);
    fog.near = 115; fog.far = 240; // the colored haze stays out at the horizon, not on the island
    const lagoon = mesh(new T.CylinderGeometry(30, 30, 0.2, 48), mat(0x5fe0d6), 0, -1.0, 0);
    lagoon.castShadow = false; lagoon.receiveShadow = false; scene.add(lagoon);

    water.scale.set(4, 1, 4); // a much bigger sea, so the volcano and the horizon sit on water

    // The volcano across the water, with a lazy puff of smoke and a glowing top at night.
    const volc = new T.Group(); volc.position.set(-55, -1.5, -120); volc.scale.setScalar(1.3);
    // It sits in the sea on a sandy, rocky shore (the sea is made much bigger below so it doesn't float).
    volc.add(mesh(new T.CylinderGeometry(23, 25, 1.2, 20), mat(0xe9d39a), 0, 0.2, 0));
    volc.add(mesh(new T.CylinderGeometry(20.5, 22, 1.6, 14), mat(0x6b6560), 0, 0.6, 0));
    volc.add(mesh(new T.CylinderGeometry(3, 20, 18, 14), mat(0x4f8a4a), 0, 9, 0));
    volc.add(mesh(new T.CylinderGeometry(3.05, 7, 5, 14), mat(0x4a4440), 0, 16.2, 0));
    const lava = new T.MeshLambertMaterial({ color: 0xff6a2a, emissive: 0xff4a10, emissiveIntensity: 0 });
    volc.add(mesh(new T.CylinderGeometry(2.6, 2.6, 0.3, 14), lava, 0, 18.6, 0));
    const puffs = [];
    for (let i = 0; i < 4; i++) { const p = mesh(new T.IcosahedronGeometry(1.4 + i * 0.5, 0), mat(0xf3eee6), i * 1.3, 19.5 + i * 2.2, 0); puffs.push(p); volc.add(p); }
    volc.traverse(o => { o.castShadow = false; });
    scene.add(volc);


    // Tiki torches beside every bucket path, lit from sunset to morning.
    const flame = new T.MeshLambertMaterial({ color: 0xffc062, emissive: 0xffa030, emissiveIntensity: 0 });
    const torches = [];
    for (const deg of outerAngles) {
      const a = deg * Math.PI / 180, r = R - 5.6, side = 1.3;
      const x = Math.cos(a) * r - Math.sin(a) * side, z = Math.sin(a) * r + Math.cos(a) * side;
      scene.add(mesh(new T.CylinderGeometry(0.06, 0.08, 1.6, 6), mat(0x6b4423), x, 0.8, z));
      const cup = mesh(new T.CylinderGeometry(0.16, 0.1, 0.22, 8), mat(0x3a2a20), x, 1.65, z); scene.add(cup);
      const f = mesh(new T.ConeGeometry(0.15, 0.42, 6), flame, x, 1.95, z); f.castShadow = false; scene.add(f);
      const light = new T.PointLight(0xffa64a, 0, 8); light.position.set(x, 2.3, z); scene.add(light);
      torches.push({ f, light, p: deg });
    }
    const poolLight = new T.PointLight(0x7fe6ff, 0, 7); poolLight.position.set(0, 2, 0); scene.add(poolLight);

    // Stars and a moon, far away.
    const starPos = [];
    let s = 99; const r01 = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 420; i++) {
      const th = r01() * Math.PI * 2, ph = 0.08 + r01() * 1.3, rr = 160;
      starPos.push(Math.cos(th) * Math.cos(ph) * rr, Math.sin(ph) * rr + 5, Math.sin(th) * Math.cos(ph) * rr);
    }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(starPos, 3));
    const starMat = new T.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
    scene.add(new T.Points(sg, starMat));
    const moon = new T.Mesh(new T.SphereGeometry(5, 20, 14), new T.MeshBasicMaterial({ color: 0xfff6dc, fog: false, transparent: true, opacity: 0 }));
    moon.position.set(40, 60, -120); scene.add(moon);

    // The little Hawaii clock on screen.
    const clock = document.createElement('span'); clock.className = 'hawaii-clock';
    const logTitle = document.querySelector('.panel.log h2');
    if (logTitle) logTitle.appendChild(clock); else document.body.appendChild(clock);

    const docStyle = document.documentElement.style;
    let lastMinute = -1, L = null;
    function setTime(hour) {
      L = look(hour);
      docStyle.setProperty('--sky-top', css(L.skyTop)); docStyle.setProperty('--sky-bottom', css(L.skyBottom));
      fog.color.setHex(L.fog);
      sun.color.setHex(L.sun); sun.intensity = L.sunI;
      if (L.phase === 'night') sun.position.set(-22, 34, -14);
      else { const a = Math.min(Math.PI - 0.25, Math.max(0.25, (hour - 6) / 13 * Math.PI)); sun.position.set(Math.cos(a) * 40, Math.max(12, Math.sin(a) * 40), 18); }
      hemi.color.setHex(L.hemiSky); hemi.groundColor.setHex(L.hemiGround); hemi.intensity = L.hemiI;
      water.material.color.setHex(L.water); lagoon.material.color.setHex(L.lagoon);
      starMat.opacity = L.stars; moon.material.opacity = L.stars; moon.visible = L.stars > 0.02;
      lava.emissiveIntensity = 0.2 + L.torch * 0.9; flame.emissiveIntensity = L.torch * 1.2;
      for (const tc of torches) { tc.f.visible = L.torch > 0.05; }
      poolLight.intensity = L.torch * 1.2;
      const icon = { night: '🌙', morning: '🌅', day: '☀️', sunset: '🌇' }[L.phase];
      clock.textContent = `${icon} Hawaii · ${clockText(hour)}`;
    }

    return function update(t) {
      const hour = fixedHour !== null && !Number.isNaN(fixedHour) ? fixedHour : hawaiiHour();
      const minute = Math.floor(hour * 60);
      if (minute !== lastMinute) { lastMinute = minute; setTime(hour); }
      if (!reduced) {
        puffs.forEach((p, i) => { p.position.y = 19.5 + i * 2.2 + Math.sin(t * 0.6 + i) * 0.4; p.position.x = i * 1.3 + Math.sin(t * 0.3 + i) * 0.5; });
        for (const tc of torches) { const fl = 1 + Math.sin(t * 13 + tc.p) * 0.12 + Math.sin(t * 7.3 + tc.p) * 0.08; tc.f.scale.set(1, fl, 1); tc.light.intensity = L.torch * 1.5 * fl; }
      } else for (const tc of torches) tc.light.intensity = L.torch * 1.5;
    };
  }

  // The normal look since Nov 17, 2026 (owner approved). ?classic shows the old island.
  const on = () => typeof location === 'undefined' || !new URLSearchParams(location.search).has('classic');
  const Aloha = { on, hawaiiHour, clockText, look, tree, build };
  if (typeof module !== 'undefined' && module.exports) module.exports = Aloha;
  root.Aloha = Aloha;
})(typeof window !== 'undefined' ? window : globalThis);
