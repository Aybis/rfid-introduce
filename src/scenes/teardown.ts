import * as THREE from 'three';
import { addScene } from './loop';
import { mkRenderer, watchSize, addLights } from './helpers';
import { buildTag } from './tag';

export type LayerChangeCallback = (active: number) => void;

export function initTeardown(
  canvas: HTMLCanvasElement,
  sectionEl: HTMLElement,
  cleanups: Array<() => void>,
  onLayerChange: LayerChangeCallback,
): void {
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  addLights(scene);

  const tag = buildTag();
  tag.group.rotation.set(-Math.PI / 2, 0, 0);
  tag.group.scale.setScalar(1.45);
  scene.add(tag.group);

  const goldMat = (tag.antenna.children[0] as THREE.Mesh)?.material as THREE.MeshStandardMaterial;
  const parts: { node: THREE.Object3D; mats: THREE.MeshStandardMaterial[] }[] = [
    { node: tag.substrate, mats: [tag.substrate.material as THREE.MeshStandardMaterial] },
    { node: tag.antenna,   mats: [goldMat] },
    { node: tag.chip,      mats: [tag.chip.material as THREE.MeshStandardMaterial] },
    { node: tag.casing,    mats: [tag.casing.material as THREE.MeshStandardMaterial] },
  ];
  parts.forEach(P => P.mats.forEach(m => { if (m) { m.transparent = true; } }));

  const GAP = 0.70, GSCALE = 1.0;
  const topZ = (i: number) => (3 - i) * GAP;
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const r = mkRenderer(canvas);
  watchSize(r, cam, canvas, cleanups);

  let lastActive = -1, prog = 0, camAimY = GAP * 1.5 * GSCALE;

  addScene({ canvas, renderer: r, render: (_, now) => {
    const total = (sectionEl.offsetHeight - window.innerHeight) || 1;
    const p = clamp(-sectionEl.getBoundingClientRect().top / total, 0, 1);
    prog += (p - prog) * 0.07;
    const sp = clamp(prog / 0.14, 0, 1);
    const active = clamp(Math.round(prog * 3), 0, 3);

    parts.forEach((P, i) => {
      const isA = i === active;
      const tz = topZ(i) * sp + (isA ? 0.28 : 0);
      P.node.position.z += (tz - P.node.position.z) * 0.09;
      const tOp = sp < 0.45 ? 1 : (isA ? (i === 3 ? 0.52 : 1) : 0.14);
      P.mats.forEach(m => { if (m) m.opacity += (tOp - m.opacity) * 0.09; });
    });

    (tag.chip.material as THREE.MeshStandardMaterial).emissiveIntensity = (active === 2 ? 1.1 : 0.35) + Math.sin(now * 0.005) * 0.22;
    if (goldMat) goldMat.emissiveIntensity = active === 1 ? 0.72 : 0.22;

    const activeWorldY = (parts[active].node.position.z) * GSCALE;
    camAimY += (activeWorldY - camAimY) * 0.045;

    const dist = 7.8 - sp * 2.6;
    cam.position.set(dist * 0.40, camAimY + dist * 0.52, dist * 0.88);
    cam.lookAt(0, camAimY, 0);
    tag.group.rotation.z += 0.0008;

    if (active !== lastActive) {
      lastActive = active;
      onLayerChange(active);
    }
    r.render(scene, cam);
  }});
}
