import * as THREE from 'three';
import { addScene } from './loop';
import { mkRenderer, watchSize, addLights, makeOrbit } from './helpers';
import { buildTag } from './tag';
import type { WaveCfgRuntime } from '../constants';

export interface WaveRefs {
  cfg: WaveCfgRuntime;
  readerFace: THREE.Mesh | null;
  tag: ReturnType<typeof buildTag> | null;
}

export function initWave(
  canvas: HTMLCanvasElement,
  cleanups: Array<() => void>,
  waveCfg: WaveCfgRuntime,
  onPhaseLabel: (label: string) => void,
): WaveRefs {
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  addLights(scene);
  const orbit = makeOrbit(canvas, cam, new THREE.Vector3(0, -0.5, 0),
    { az: 0.95, pol: 0.62, r: 18.5, auto: 0.001 }, cleanups);

  const cfg = waveCfg;
  const W = 20, D = 12, SX = 130, SZ = 80;
  const geo = new THREE.PlaneGeometry(W, D, SX, SZ);
  geo.rotateX(-Math.PI / 2);
  const vcount = geo.attributes.position.count;
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(vcount * 3), 3));
  const mat = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true, transparent: true, opacity: 0.92 });
  const water = new THREE.Mesh(geo, mat);
  scene.add(water);

  const under = new THREE.Mesh(new THREE.PlaneGeometry(W, D),
    new THREE.MeshBasicMaterial({ color: 0x081a2e, transparent: true, opacity: 0.55 }));
  under.rotation.x = -Math.PI / 2; under.position.y = -0.04;
  scene.add(under);

  const pos = geo.attributes.position as THREE.BufferAttribute;
  const col = geo.attributes.color as THREE.BufferAttribute;
  const px = new Float32Array(vcount), pz = new Float32Array(vcount);
  for (let i = 0; i < vcount; i++) { px[i] = pos.getX(i); pz[i] = pos.getZ(i); }

  const reader = new THREE.Group();
  reader.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.7, 1.1),
    new THREE.MeshStandardMaterial({ color: 0x16314e, metalness: 0.4, roughness: 0.5 })));
  const face = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.25, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x7fc4f0, emissive: 0x3a7fb5, emissiveIntensity: 0.6, metalness: 0.3, roughness: 0.4 }));
  face.position.x = 0.28; reader.add(face);
  reader.position.set(-cfg.dist / 2, 0.85, 0);
  scene.add(reader);

  const tag = buildTag();
  tag.group.scale.setScalar(0.34);
  tag.group.rotation.set(0, -Math.PI / 2, 0);
  tag.group.position.set(cfg.dist / 2, 0.5, 0);
  scene.add(tag.group);

  const r = mkRenderer(canvas);
  watchSize(r, cam, canvas, cleanups);

  let _labelTs = 0;

  addScene({ canvas, renderer: r, render: (_, now) => {
    orbit.apply();
    const t = now * 0.001, k = (2 * Math.PI) / cfg.wl, ws = cfg.speed * 2.2;
    const ax = -cfg.dist / 2, bx = cfg.dist / 2, amp = cfg.amp;
    const isActive = cfg.mode === 'active';
    const dr = 0.03, dg = 0.10, db = 0.18;
    const { cr, cg, cb } = cfg;

    const macroPhase = !isActive ? (t * 0.25) % 1.0 : 0;
    const tagMix = !isActive ? (
      macroPhase < 0.44 ? 0 :
      macroPhase < 0.58 ? (macroPhase - 0.44) / 0.14 :
      macroPhase < 0.92 ? 1.0 :
      Math.max(0, 1.0 - (macroPhase - 0.92) / 0.08)
    ) : 1.0;
    const cycleFade = (!isActive && macroPhase > 0.94) ? Math.max(0, 1 - (macroPhase - 0.94) / 0.06) : 1.0;
    const activFlash = (!isActive && macroPhase > 0.41 && macroPhase < 0.66)
      ? Math.sin((macroPhase - 0.41) / 0.25 * Math.PI) : 0;

    (face.material as THREE.MeshStandardMaterial).emissiveIntensity = isActive ? 0.18 : 0.55 + Math.sin(t * cfg.speed * 2) * 0.28;
    (tag.chip.material as THREE.MeshStandardMaterial).emissiveIntensity = isActive
      ? 1.0 + Math.sin(t * 5) * 0.5
      : 0.20 + activFlash * 2.6 + tagMix * 0.85;

    if (!isActive && now - _labelTs > 300) {
      _labelTs = now;
      onPhaseLabel(
        macroPhase < 0.44 ? '① PASSIVE · Reader memancarkan sinyal ke sekitar' :
        macroPhase < 0.65 ? '② PASSIVE · Sinyal tiba → tag menerima daya & aktif' :
                            '③ PASSIVE · Tag backscatter — memantulkan sinyal ke reader',
      );
    }

    for (let i = 0; i < vcount; i++) {
      const x = px[i], z = pz[i];
      const dA = Math.sqrt((x - ax) ** 2 + z * z);
      const dB = Math.sqrt((x - bx) ** 2 + z * z);
      const fA = Math.exp(-dA * 0.13), fB = Math.exp(-dB * 0.15);
      let h: number;
      if (!isActive) {
        const dirA = Math.max(0, Math.cos(Math.atan2(z, x - ax)));
        const dirB = Math.max(0, Math.cos(Math.atan2(z, bx - x)));
        h = (amp * Math.sin(k * dA - ws * t) * fA * dirA +
             amp * 0.65 * Math.sin(k * dB - ws * t + k * cfg.dist) * fB * dirB * tagMix) * cycleFade;
      } else {
        h = amp * Math.sin(k * dA - ws * t) * fA + amp * Math.sin(k * dB - ws * t) * fB;
      }
      pos.setY(i, h);
      const n = Math.max(0, Math.min(1, h / amp * 0.5 + 0.5));
      col.setXYZ(i, dr + (cr - dr) * n, dg + (cg - dg) * n, db + (cb - db) * n);
    }
    pos.needsUpdate = true; col.needsUpdate = true;
    reader.position.x = ax; tag.group.position.x = bx;
    tag.group.rotation.z = Math.sin(now * 0.0009) * 0.12;
    r.render(scene, cam);
  }});

  return { cfg, readerFace: face, tag };
}
