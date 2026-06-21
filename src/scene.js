import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export function initScene() {
  const wrap = document.getElementById('env-canvas-wrap');
  const canvas = document.getElementById('env-canvas');
  if (!wrap || !canvas) return;

  // ── RENDERER ──
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.setClearColor(0x8a9080);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x8a9080, 0.014);
  scene.background = new THREE.Color(0x8a9080);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
  camera.position.set(0, 5, 32);

  function resize() {
    const W = wrap.clientWidth, H = wrap.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    composer.setSize(W, H);
  }

  // ── POST-PROCESSING ──
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.25, 0.4, 0.82);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  resize();
  window.addEventListener('resize', resize);

  // ── MATERIALS ──
  const matConcrete = new THREE.MeshStandardMaterial({ color: 0x2c2f2a, roughness: 0.95, metalness: 0 });
  const matConcreteWarm = new THREE.MeshStandardMaterial({ color: 0x3a3530, roughness: 0.97, metalness: 0 });
  const matConcreteDark = new THREE.MeshStandardMaterial({ color: 0x1e2018, roughness: 0.98, metalness: 0 });
  const matMetal = new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.65, metalness: 0.75 });
  const matRust = new THREE.MeshStandardMaterial({ color: 0x5a3820, roughness: 0.9, metalness: 0.4 });
  const matGround = new THREE.MeshStandardMaterial({ color: 0x1a1c18, roughness: 0.2, metalness: 0 });
  const matFoliageDark = new THREE.MeshStandardMaterial({ color: 0x1a3a1a, roughness: 1.0, metalness: 0 });
  const matFoliageMid = new THREE.MeshStandardMaterial({ color: 0x2a5a20, roughness: 1.0, metalness: 0 });
  const matFoliageLight = new THREE.MeshStandardMaterial({ color: 0x3a6a28, roughness: 1.0, metalness: 0 });
  const matVine = new THREE.MeshStandardMaterial({ color: 0x1e3018, roughness: 1.0, metalness: 0 });
  const matRebar = new THREE.MeshStandardMaterial({ color: 0x3a3228, roughness: 0.8, metalness: 0.5 });

  // Water puddle shader
  const matPuddle = new THREE.MeshStandardMaterial({
    color: 0x1a2820,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.7,
  });

  // ── HELPERS ──
  function box(w, h, d, mat, x, y, z, rx = 0, ry = 0, rz = 0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  function cyl(rt, rb, h, segs, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segs), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  // ── GROUND ──
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), matGround);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Ground puddles
  const puddlePositions = [[-6, 0.05, 8], [4, 0.05, 12], [-12, 0.05, 4], [10, 0.05, 6]];
  puddlePositions.forEach(([x, y, z]) => {
    const pw = 2 + Math.random() * 3, pd = 1.5 + Math.random() * 2;
    const puddle = new THREE.Mesh(new THREE.PlaneGeometry(pw, pd), matPuddle);
    puddle.rotation.x = -Math.PI / 2;
    puddle.position.set(x, y, z);
    scene.add(puddle);
  });

  // ── MAIN BUILDING — long elevated brutalist block ──
  // Ground floor slab (piloti level — mostly open)
  box(40, 0.5, 14, matConcrete, 0, 0.25, 0);

  // ── PILOTI COLUMNS — two rows, 8 columns each ──
  const pilotiX = [-18, -12, -6, 0, 6, 12, 18, 24];
  pilotiX.forEach(x => {
    const h = 4.5 + (Math.random() - 0.5) * 0.3;
    cyl(0.4, 0.45, h, 6, matConcrete, x, h / 2 + 0.5, -4);
    cyl(0.4, 0.45, h, 6, matConcrete, x, h / 2 + 0.5, 4);
    // Weathering stain strip on some columns
    if (Math.random() > 0.5) {
      const stainH = 1 + Math.random();
      box(0.95, stainH, 0.95, matConcreteWarm, x, h - stainH / 2 + 0.5, -4, 0, Math.random() * 0.3);
    }
  });

  // ── MEZZANINE LEVEL SLAB ──
  box(44, 0.45, 15, matConcrete, 1, 5.2, 0);

  // Mezzanine edge beams
  box(44, 0.6, 0.4, matConcreteDark, 1, 4.95, -7.7);
  box(44, 0.6, 0.4, matConcreteDark, 1, 4.95, 7.7);

  // ── UPPER BUILDING VOLUMES — staggered blocks ──
  // Main long block
  box(38, 6, 12, matConcrete, 1, 8.45, 0);
  // Upper floor set back
  box(30, 3.5, 10, matConcreteWarm, 1, 13.45, 0.5);
  // Roof slab overhang
  box(42, 0.4, 14, matConcreteDark, 1, 15.4, 0);

  // ── SIDE EXTENSIONS ──
  box(5, 4, 14, matConcrete, -21.5, 7.7, 0);
  box(0.4, 10, 14, matConcrete, -24, 5.2, 0);

  // ── SECONDARY ELEVATED WALKWAY (right side) ──
  box(12, 0.3, 4, matMetal, 18, 3.5, 0);
  // Walkway railings
  box(12, 0.8, 0.08, matMetal, 18, 4.15, 2.1);
  box(12, 0.8, 0.08, matMetal, 18, 4.15, -2.1);
  for (let rx = -17; rx <= 24; rx += 1.5) {
    box(0.06, 0.8, 0.06, matMetal, rx, 4.15, 2.1);
    box(0.06, 0.8, 0.06, matMetal, rx, 4.15, -2.1);
  }

  // ── STAIRCASE ──
  for (let i = 0; i < 8; i++) {
    box(3, 0.18, 0.6, matConcrete, 22, 0.6 + i * 0.62, -3 + i * 0.5);
  }

  // ── INDUSTRIAL DUCTS ──
  box(16, 0.6, 0.6, matMetal, -4, 14, -4);
  box(0.6, 2, 0.6, matMetal, -12, 13.2, -4);
  box(8, 0.5, 0.5, matRust, 6, 14, -3);
  box(0.5, 1.5, 0.5, matRust, 9.5, 13.4, -3);
  // Duct flange rings
  box(0.9, 0.7, 0.7, matMetal, -4, 14, -4);
  box(0.9, 0.7, 0.7, matMetal, 2, 14, -4);

  // ── EXPOSED REBAR STUBS at slab edges ──
  for (let rx = -20; rx <= 22; rx += 1.8) {
    const h = 0.3 + Math.random() * 0.5;
    box(0.06, h, 0.06, matRebar, rx + (Math.random()-0.5)*0.4, 15.4 + h/2, -7.2);
    box(0.06, h, 0.06, matRebar, rx + (Math.random()-0.5)*0.4, 15.4 + h/2, 7.2);
  }

  // ── COLLAPSED / DAMAGED SECTIONS ──
  box(6, 0.3, 5, matConcreteDark, 14, 12.8, 2, 0.08, 0, -0.05);
  box(4, 0.25, 3, matConcrete, -10, 5.5, -3, -0.06, 0, 0.04);

  // ── BACKGROUND CITY SILHOUETTES ──
  const silhouettes = [
    [-50, 20, -60], [-35, 35, -65], [-20, 28, -70],
    [30, 22, -62], [50, 40, -68], [65, 18, -60],
    [80, 30, -65], [-65, 15, -58],
  ];
  silhouettes.forEach(([x, h, z]) => {
    const w = 8 + Math.random() * 12;
    box(w, h, 2, matConcreteDark, x, h / 2, z);
  });

  // ── FOLIAGE SYSTEM ──
  const foliageMats = [matFoliageDark, matFoliageMid, matFoliageLight];
  const foliageMeshes = [];

  function foliageCluster(cx, cy, cz, count, minR, maxR) {
    for (let i = 0; i < count; i++) {
      const r = minR + Math.random() * (maxR - minR);
      const x = cx + (Math.random() - 0.5) * 5;
      const y = cy + Math.random() * 1.5;
      const z = cz + (Math.random() - 0.5) * 4;
      const mat = foliageMats[Math.floor(Math.random() * foliageMats.length)];
      const geo = new THREE.SphereGeometry(r, 5, 4);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.scale.set(1 + Math.random() * 0.3, 0.9 + Math.random() * 0.5, 1 + Math.random() * 0.3);
      mesh.castShadow = true;
      mesh.userData.phase = Math.random() * Math.PI * 2;
      mesh.userData.amp = 0.003 + Math.random() * 0.004;
      foliageMeshes.push(mesh);
      scene.add(mesh);
    }
  }

  // Rooftop overgrowth
  foliageCluster(-14, 15.6, 0, 10, 0.6, 1.5);
  foliageCluster(0, 15.6, -2, 8, 0.5, 1.2);
  foliageCluster(12, 15.6, 1, 7, 0.7, 1.6);
  foliageCluster(20, 15.6, -1, 5, 0.5, 1.1);
  // Mezzanine edge overgrowth
  foliageCluster(-8, 5.5, 7, 7, 0.4, 1.0);
  foliageCluster(6, 5.5, 7, 6, 0.4, 0.9);
  foliageCluster(-16, 5.5, 6, 5, 0.5, 1.1);
  // Ground level overgrowth around columns
  foliageCluster(-18, 1, 6, 8, 0.4, 0.9);
  foliageCluster(6, 1, -7, 6, 0.3, 0.8);
  foliageCluster(20, 1, 4, 7, 0.4, 1.0);
  foliageCluster(-6, 1, 10, 9, 0.5, 1.2);
  foliageCluster(12, 1, 10, 6, 0.4, 0.9);

  // ── VINE CASCADES down columns ──
  function addVine(colX, colZ, colH) {
    const startY = colH;
    const points = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      points.push(new THREE.Vector3(
        colX + Math.sin(t * 4) * 0.25,
        startY - t * startY,
        colZ + Math.cos(t * 3) * 0.2
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 16, 0.04, 5, false);
    const mesh = new THREE.Mesh(geo, matVine);
    mesh.castShadow = true;
    scene.add(mesh);
  }

  // Add vines to several columns
  pilotiX.slice(0, 5).forEach(x => {
    if (Math.random() > 0.4) addVine(x, -4, 4.5);
    if (Math.random() > 0.5) addVine(x, 4, 4.5);
  });

  // Large ground trees around periphery
  function groundTree(x, z) {
    const h = 9 + Math.random() * 5;
    cyl(0.15, 0.22, h, 6, matVine, x, h / 2, z);
    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(2.2 + Math.random() * 0.8, 6, 5),
      Math.random() > 0.5 ? matFoliageMid : matFoliageDark
    );
    canopy.position.set(x, h + 0.8, z);
    canopy.scale.set(1, 0.75, 1);
    canopy.castShadow = true;
    canopy.userData.phase = Math.random() * Math.PI * 2;
    canopy.userData.amp = 0.002;
    foliageMeshes.push(canopy);
    scene.add(canopy);
  }

  groundTree(-28, -2); groundTree(-26, 8);
  groundTree(30, 3); groundTree(28, -6);
  groundTree(-4, 15); groundTree(8, 16);
  groundTree(-20, 14); groundTree(20, 14);

  // ── LIGHTING ──
  const hemi = new THREE.HemisphereLight(0x8a9490, 0x1a2010, 0.6);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xc8cec0, 0.35);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xd4d8c8, 0.9);
  sun.position.set(-20, 40, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 150;
  sun.shadow.camera.left = -50;
  sun.shadow.camera.right = 50;
  sun.shadow.camera.top = 50;
  sun.shadow.camera.bottom = -50;
  sun.shadow.bias = -0.001;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x1a2820, 0.3);
  fill.position.set(20, 10, -10);
  scene.add(fill);

  // Interior glow through openings
  const pt1 = new THREE.PointLight(0x3a5a30, 0.8, 15);
  pt1.position.set(-8, 8, 0);
  scene.add(pt1);

  const pt2 = new THREE.PointLight(0x4a4030, 0.5, 10);
  pt2.position.set(10, 9, 0);
  scene.add(pt2);

  // ── CONTROLS ──
  const keys = {};
  document.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
  document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

  let pitch = 0, yaw = 0;
  let isDragging = false, lastMX = 0, lastMY = 0;
  let idleTimer = 0;
  let userActive = false;

  canvas.addEventListener('mousedown', e => {
    isDragging = true; lastMX = e.clientX; lastMY = e.clientY;
    userActive = true; idleTimer = 0;
  });
  document.addEventListener('mouseup', () => { isDragging = false; });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    yaw   -= (e.clientX - lastMX) * 0.003;
    pitch -= (e.clientY - lastMY) * 0.003;
    pitch = Math.max(-1.1, Math.min(1.1, pitch));
    lastMX = e.clientX; lastMY = e.clientY;
  });

  canvas.addEventListener('touchstart', e => {
    isDragging = true;
    lastMX = e.touches[0].clientX; lastMY = e.touches[0].clientY;
    userActive = true;
  }, { passive: true });
  document.addEventListener('touchend', () => { isDragging = false; });
  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    yaw   -= (e.touches[0].clientX - lastMX) * 0.004;
    pitch -= (e.touches[0].clientY - lastMY) * 0.004;
    pitch = Math.max(-1.1, Math.min(1.1, pitch));
    lastMX = e.touches[0].clientX; lastMY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('wheel', e => {
    const dir = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    camera.position.addScaledVector(dir, -e.deltaY * 0.025);
    userActive = true; idleTimer = 0;
  }, { passive: true });

  const hud = document.getElementById('hud-pos');
  const SPEED = 0.1;

  let autoYaw = 0;

  function animate(time) {
    requestAnimationFrame(animate);

    const forward = new THREE.Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

    let moved = false;
    if (keys['w'] || keys['arrowup'])    { camera.position.addScaledVector(forward, SPEED); moved = true; }
    if (keys['s'] || keys['arrowdown'])  { camera.position.addScaledVector(forward, -SPEED); moved = true; }
    if (keys['a'] || keys['arrowleft'])  { camera.position.addScaledVector(right, -SPEED); moved = true; }
    if (keys['d'] || keys['arrowright']) { camera.position.addScaledVector(right, SPEED); moved = true; }
    if (keys['q']) { camera.position.y += SPEED; moved = true; }
    if (keys['e']) { camera.position.y -= SPEED; moved = true; }
    if (moved) { userActive = true; idleTimer = 0; }

    camera.position.y = Math.max(0.8, camera.position.y);

    // Auto-orbit when idle
    if (!userActive) {
      autoYaw += 0.0004;
      yaw = autoYaw;
      pitch = -0.08;
      const orbitR = 30;
      camera.position.x = Math.sin(autoYaw) * orbitR;
      camera.position.z = Math.cos(autoYaw) * orbitR;
      camera.position.y = 6;
    } else {
      idleTimer++;
      if (idleTimer > 360) { // ~6s at 60fps
        userActive = false;
        autoYaw = yaw;
      }
    }

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    // Animate foliage sway
    const t = time * 0.001;
    foliageMeshes.forEach(m => {
      m.rotation.z = Math.sin(t * 0.6 + m.userData.phase) * (m.userData.amp || 0.003) * 10;
      m.rotation.x = Math.sin(t * 0.4 + m.userData.phase * 1.3) * (m.userData.amp || 0.003) * 5;
    });

    if (hud) {
      const p = camera.position;
      hud.textContent = `x:${p.x.toFixed(1)} y:${p.y.toFixed(1)} z:${p.z.toFixed(1)}`;
    }

    composer.render();
  }

  animate(0);
}
