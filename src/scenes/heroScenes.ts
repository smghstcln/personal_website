// Vanilla Three.js hero scenes.
// Two options — buildAgentGraph (default) and buildLatentDrift.
// Each builder mounts a renderer to the container, returns a cleanup function.

import * as THREE from 'three';

const COLORS = {
  ink: new THREE.Color('#0a0e1a'),
  primary: new THREE.Color('#4f46e5'),
  secondary: new THREE.Color('#0ea5e9'),
  accent: new THREE.Color('#f43f5e'),
  pale: new THREE.Color('#cbd5e1'),
};

function makeRenderer(container: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return renderer;
}

function makeCamera(container: HTMLElement) {
  const cam = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
  cam.position.set(0, 0, 9);
  return cam;
}

// ---------------- HERO A: Agent Graph ----------------
export function buildAgentGraph(container: HTMLElement): () => void {
  const scene = new THREE.Scene();
  const camera = makeCamera(container);
  const renderer = makeRenderer(container);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dl = new THREE.DirectionalLight(0xffffff, 0.5);
  dl.position.set(5, 6, 4);
  scene.add(dl);

  const group = new THREE.Group();
  group.position.set(1.4, 0, 0);
  scene.add(group);

  const nodes: { p: [number, number, number]; s: number; c: THREE.Color }[] = [
    { p: [0, 0, 0], s: 0.34, c: COLORS.ink },
    { p: [-2.4, 1.4, -0.3], s: 0.18, c: COLORS.primary },
    { p: [-2.6, -0.2, 0.2], s: 0.16, c: COLORS.primary },
    { p: [-2.2, -1.6, -0.4], s: 0.14, c: COLORS.primary },
    { p: [2.6, 1.6, 0.2], s: 0.18, c: COLORS.secondary },
    { p: [2.9, 0.0, -0.4], s: 0.16, c: COLORS.secondary },
    { p: [2.4, -1.4, 0.3], s: 0.14, c: COLORS.secondary },
    { p: [0.4, 2.2, -0.5], s: 0.13, c: COLORS.accent },
    { p: [-0.6, -2.3, 0.0], s: 0.12, c: COLORS.pale },
  ];

  const meshes = nodes.map(n => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(n.s, 24, 24),
      new THREE.MeshStandardMaterial({ color: n.c, emissive: n.c, emissiveIntensity: 0.4, roughness: 0.3 })
    );
    m.position.set(...n.p);
    group.add(m);
    return m;
  });

  // edges + animated packets traveling between nodes (suggests tool calls / retrieval)
  const packets: { mesh: THREE.Mesh; a: THREE.Vector3; b: THREE.Vector3; speed: number; phase: number }[] = [];
  for (let i = 1; i < nodes.length; i++) {
    const pts = [new THREE.Vector3(...nodes[0].p), new THREE.Vector3(...nodes[i].p)];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: nodes[i].c, transparent: true, opacity: 0.35,
    }));
    group.add(line);

    const packet = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 12, 12),
      new THREE.MeshBasicMaterial({ color: nodes[i].c, transparent: true, opacity: 0.9 })
    );
    packet.visible = false;
    group.add(packet);
    packets.push({ mesh: packet, a: pts[0], b: pts[1], speed: 0.6 + (i % 4) * 0.15, phase: i * 0.31 });
  }

  let mouseX = 0;
  let mouseY = 0;
  function onMove(e: MouseEvent) {
    const r = container.getBoundingClientRect();
    mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouseY = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  window.addEventListener('mousemove', onMove);

  let running = true;
  const start = performance.now();
  function tick() {
    if (!running) return;
    const t = (performance.now() - start) / 1000;
    group.rotation.y += (mouseX * 0.25 + Math.sin(t * 0.15) * 0.05 - group.rotation.y) * 0.04;
    group.rotation.x += (-mouseY * 0.15 - group.rotation.x) * 0.04;
    meshes.forEach((m, i) => {
      const s = 1 + 0.06 * Math.sin(t * 1.2 + i * 0.7);
      m.scale.setScalar(s);
    });
    packets.forEach(p => {
      const u = ((t * p.speed + p.phase) % 1.6) / 1.6;
      if (u < 1) {
        p.mesh.visible = true;
        p.mesh.position.copy(p.a).lerp(p.b, u);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(u * Math.PI) * 0.95;
      } else {
        p.mesh.visible = false;
      }
    });
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  return () => {
    running = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  };
}

// ---------------- HERO B: Latent Drift ----------------
// Cloud of points that gently re-clusters between two configurations — reads as embedding space.
// Not used by default; swap in App.tsx to try it.
export function buildLatentDrift(container: HTMLElement): () => void {
  const scene = new THREE.Scene();
  const camera = makeCamera(container);
  const renderer = makeRenderer(container);
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  const N = 800;
  const positions = new Float32Array(N * 3);
  const aA = new Float32Array(N * 3);
  const aB = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 2.2 + Math.random() * 0.9;
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    aA[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    aA[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    aA[i * 3 + 2] = r * Math.cos(phi);
    const cluster = i % 4;
    const cx = [-1.8, 1.8, -1.4, 1.4][cluster];
    const cy = [1.2, 1.0, -1.4, -1.2][cluster];
    const cz = [0.2, -0.4, -0.2, 0.4][cluster];
    aB[i * 3] = cx + (Math.random() - 0.5) * 0.9;
    aB[i * 3 + 1] = cy + (Math.random() - 0.5) * 0.9;
    aB[i * 3 + 2] = cz + (Math.random() - 0.5) * 0.6;
    positions[i * 3] = aA[i * 3];
    positions[i * 3 + 1] = aA[i * 3 + 1];
    positions[i * 3 + 2] = aA[i * 3 + 2];
    const c = i % 7 === 0 ? COLORS.accent : (i % 2 === 0 ? COLORS.primary : COLORS.secondary);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.08, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true, depthWrite: false,
  }));
  points.position.set(1.4, 0, 0);
  scene.add(points);

  let mouseX = 0;
  let mouseY = 0;
  function onMove(e: MouseEvent) {
    const r = container.getBoundingClientRect();
    mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouseY = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  window.addEventListener('mousemove', onMove);

  let running = true;
  const start = performance.now();
  function tick() {
    if (!running) return;
    const t = (performance.now() - start) / 1000;
    const m = (Math.sin(t * 0.2) + 1) / 2;
    const eased = m * m * (3 - 2 * m);
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < N; i++) {
      const wob = 0.04 * Math.sin(t * 0.7 + i);
      pos[i * 3] = aA[i * 3] * (1 - eased) + aB[i * 3] * eased + wob;
      pos[i * 3 + 1] = aA[i * 3 + 1] * (1 - eased) + aB[i * 3 + 1] * eased + wob * 0.5;
      pos[i * 3 + 2] = aA[i * 3 + 2] * (1 - eased) + aB[i * 3 + 2] * eased;
    }
    geo.attributes.position.needsUpdate = true;
    points.rotation.y += (mouseX * 0.4 + t * 0.04 - points.rotation.y) * 0.03;
    points.rotation.x += (-mouseY * 0.2 - points.rotation.x) * 0.03;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  return () => {
    running = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  };
}
