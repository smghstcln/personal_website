// Vanilla Three.js Career Arc — diagonal ribbon of plane-cards.
// Replaces the older "blockchain career chain" stacked-cubes visual.

import * as THREE from 'three';
import type { ExperienceItem } from '../data/resume';

function makeRenderer(container: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return renderer;
}

export function buildCareerArc(
  container: HTMLElement,
  getActive: () => number,
  items: ExperienceItem[]
): () => void {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 7);
  const renderer = makeRenderer(container);
  scene.add(new THREE.AmbientLight(0xffffff, 1));

  const group = new THREE.Group();
  scene.add(group);

  // Ribbon (catmull-rom tube)
  const ribbonPoints = items.map((_, i) => new THREE.Vector3(
    (i % 2 === 0 ? -1 : 1) * 0.6, -i * 2.2, 0
  ));
  const curve = new THREE.CatmullRomCurve3(ribbonPoints, false, 'catmullrom', 0.5);
  const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.012, 8, false);
  const tubeBg = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.7 }));
  group.add(tubeBg);
  const tubeFg = new THREE.Mesh(tubeGeo.clone(), new THREE.MeshBasicMaterial({ color: 0x4f46e5 }));
  group.add(tubeFg);

  // Card meshes — flat planes positioned along the ribbon
  const cards = items.map((_, i) => {
    const g = new THREE.Group();
    const card = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.6),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 })
    );
    g.add(card);
    const hairline = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 0.012),
      new THREE.MeshBasicMaterial({ color: 0x4f46e5 })
    );
    hairline.position.set(0, 0.78, 0.001);
    g.add(hairline);
    const dot = new THREE.Mesh(
      new THREE.PlaneGeometry(0.3, 0.3),
      new THREE.MeshBasicMaterial({ color: 0x4f46e5 })
    );
    dot.position.set(-1.05, 0.55, 0.001);
    g.add(dot);
    g.position.set((i % 2 === 0 ? -1 : 1) * 0.6, -i * 2.2, 0);
    group.add(g);
    return { group: g, card, hairline, dot };
  });

  let running = true;
  function tick() {
    if (!running) return;
    const active = Math.max(0, Math.min(getActive(), items.length - 1));
    const targetY = active * 2.2 + 3.3;
    group.position.y += (targetY - group.position.y) * 0.08;

    cards.forEach((c, i) => {
      const isActive = i === active;
      const distance = Math.abs(i - active);
      const targetScale = isActive ? 1.0 : 0.85;
      const s = THREE.MathUtils.lerp(c.group.scale.x, targetScale, 0.1);
      c.group.scale.set(s, s, s);
      const targetZ = isActive ? 0 : -distance * 0.6;
      c.group.position.z += (targetZ - c.group.position.z) * 0.1;
      (c.card.material as THREE.MeshBasicMaterial).color.set(isActive ? 0xffffff : 0xf1f5f9);
      (c.card.material as THREE.MeshBasicMaterial).opacity = isActive ? 1 : 0.55;
      (c.hairline.material as THREE.MeshBasicMaterial).color.set(isActive ? 0x4f46e5 : 0xcbd5e1);
      (c.dot.material as THREE.MeshBasicMaterial).color.set(isActive ? 0x4f46e5 : 0xe2e8f0);
    });

    // Foreground tube fill grows with the active index
    const total = tubeFg.geometry.index ? tubeFg.geometry.index.count : 0;
    const fraction = items.length > 1 ? (active + 0.5) / items.length : 1;
    tubeFg.geometry.setDrawRange(0, Math.floor(total * fraction));

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
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  };
}
