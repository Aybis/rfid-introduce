import * as THREE from 'three';
import { addScene } from './loop';
import { mkRenderer, watchSize } from './helpers';
import { buildTag } from './tag';

export function initHero(canvas: HTMLCanvasElement, cleanups: Array<() => void>): void {
  const scene = new THREE.Scene();

  // Wider FOV + more distance so the tag never clips at any rotation
  const cam = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
  cam.position.set(0, 0.3, 5.8);

  // Lighting tuned for the dark substrate colour (0x0e2840)
  scene.add(new THREE.AmbientLight(0x88aacc, 0.85));
  const key = new THREE.DirectionalLight(0xffd9a0, 1.4);
  key.position.set(4, 7, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5a9bd6, 0.9);
  rim.position.set(-5, 2, -4);
  scene.add(rim);
  const fill = new THREE.PointLight(0xaad4f5, 1.8, 28);
  fill.position.set(-3, 2, 5);
  scene.add(fill);

  const tag = buildTag();
  tag.group.rotation.set(-0.45, 0.5, 0.06);
  tag.group.scale.setScalar(1.0); // FOV=52 gives enough margin at any rotation
  scene.add(tag.group);

  const r = mkRenderer(canvas);
  watchSize(r, cam, canvas, cleanups);

  const st = { down: false, px: 0, py: 0, vx: 0, vy: 0, rx: -0.45, ry: 0.5 };
  const down = (e: PointerEvent) => {
    st.down = true; st.px = e.clientX; st.py = e.clientY;
    canvas.style.cursor = 'grabbing';
  };
  const move = (e: PointerEvent) => {
    if (!st.down) return;
    const dx = e.clientX - st.px, dy = e.clientY - st.py;
    st.px = e.clientX; st.py = e.clientY;
    st.ry += dx * 0.008; st.rx += dy * 0.008;
    st.rx = Math.max(-1.2, Math.min(1.2, st.rx));
    st.vx = dx * 0.008; st.vy = dy * 0.008;
  };
  const up = () => { st.down = false; canvas.style.cursor = 'grab'; };
  canvas.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  cleanups.push(() => {
    canvas.removeEventListener('pointerdown', down);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
  });

  addScene({ canvas, renderer: r, render: (_, now) => {
    if (!st.down) {
      st.ry += 0.004 + st.vx; st.rx += st.vy;
      st.vx *= 0.93; st.vy *= 0.93;
    }
    tag.group.rotation.x += (st.rx - tag.group.rotation.x) * 0.12;
    tag.group.rotation.y += (st.ry - tag.group.rotation.y) * 0.12;
    (tag.chip.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(now * 0.005) * 0.35;
    r.render(scene, cam);
  }});
}
