import * as THREE from 'three';
import { boxMat, makeShelfMat } from '../helpers';
import type { PlanCallbacks, PlanInit } from './types';

interface Cow {
  c: THREE.Group;
  etag: THREE.Mesh;
  legs: THREE.Mesh[];
  graze?: [number, number];
  state: string;
  t: number;
  wt: number;
  et: number;
  id: number;
  scanned: boolean;
}

export function initLivestock(
  scene: THREE.Scene,
  _cleanups: Array<() => void>,
  cbs: PlanCallbacks,
): PlanInit {
  cbs.setLabel('TERNAK MASUK');
  const shelfMat = makeShelfMat();

  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x2c4626, roughness: 1 }),
  );
  grass.rotation.x = -Math.PI / 2; grass.position.y = 0.02; scene.add(grass);

  // Barn
  const barn = new THREE.Group();
  const bw = new THREE.Mesh(new THREE.BoxGeometry(5, 3.2, 7), boxMat(0x7a3128));
  bw.position.set(0, 1.6, 0); barn.add(bw);
  const roofL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.4, 7.4), boxMat(0x5a2018));
  roofL.position.set(-1.4, 3.6, 0); roofL.rotation.z = 0.7; barn.add(roofL);
  const roofR = roofL.clone(); roofR.position.x = 1.4; roofR.rotation.z = -0.7; barn.add(roofR);
  const doorway = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 2.4, 3.0),
    new THREE.MeshStandardMaterial({ color: 0x100a08 }),
  );
  doorway.position.set(2.5, 1.2, 0); barn.add(doorway);
  barn.position.set(-9, 0, 0); scene.add(barn);

  // Scanner post
  const sp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.0, 0.3), shelfMat);
  sp.position.set(-6.0, 1.0, 1.7); scene.add(sp);
  const sPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.7, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x7fc4f0, emissive: 0x3a7fb5, emissiveIntensity: 0.6 }),
  );
  sPanel.position.set(-6.0, 1.2, 1.5); scene.add(sPanel);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.55, 32),
    new THREE.MeshBasicMaterial({ color: 0xffb24d, transparent: true, opacity: 0, side: THREE.DoubleSide }),
  );
  ring.position.set(-6.0, 1.2, 1.5); scene.add(ring);

  const makeCow = (col: number): Cow => {
    const c = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.9), boxMat(col));
    body.position.y = 1.0; c.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.6), boxMat(col));
    head.position.set(1.0, 1.15, 0); c.add(head);
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.42), boxMat(0xc9a0a0));
    snout.position.set(1.35, 1.0, 0); c.add(snout);
    const legs = [[-0.6, -0.32], [0.6, -0.32], [-0.6, 0.32], [0.6, 0.32]].map(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.72, 0.2), boxMat(0x2a1f18));
      leg.position.set(lx, 0.36, lz); c.add(leg); return leg;
    });
    const etag = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.18, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xffb24d, emissive: 0xffb24d, emissiveIntensity: 0.85, metalness: 0.4, roughness: 0.3 }),
    );
    etag.position.set(1.0, 1.42, 0.33); c.add(etag);
    return { c, etag, legs, state: 'graze', t: 0, wt: 0, et: 0, id: 0, scanned: false };
  };

  const cols = [0x4a3528, 0x6a5040, 0x2a2622, 0x5a4535, 0x3a2a20];
  const HERD = 10;
  const cows: Cow[] = [];
  for (let i = 0; i < HERD; i++) {
    const cw = makeCow(cols[i % cols.length]);
    const gx = 2 + (i % 5) * 2.2, gz = (i < 5 ? -3.2 : 3.2) + (i % 2 ? 0.6 : -0.6);
    cw.c.position.set(gx, 0, gz); cw.c.rotation.y = Math.PI * 0.5 + ((i * 1.3) % 1);
    cw.graze = [gx, gz]; cw.id = i + 1;
    scene.add(cw.c); cows.push(cw);
  }

  let queueT = 0, pulse = 0, nextIn = 0;
  const fmt = (n: number) => String(n).padStart(2, '0');

  return {
    update: (dt, now) => {
      queueT += dt;
      if (queueT > nextIn) {
        const c = cows.find(c => c.state === 'graze');
        if (c) { c.state = 'walk'; c.wt = 0; }
        nextIn = queueT + 2.2;
      }
      pulse = Math.max(0, pulse - dt * 1.4);
      const pr = 0.6 + (1 - pulse) * 0.6;
      ring.scale.set(pr, pr, 1);
      (ring.material as THREE.MeshBasicMaterial).opacity = pulse * 0.85;
      (sPanel.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + pulse * 1.3;

      cows.forEach((cw, i) => {
        if (cw.state === 'graze') {
          cw.c.position.y = Math.sin(now * 0.002 + i) * 0.02;
          const head = cw.c.children[1] as THREE.Mesh;
          head.rotation.z = Math.sin(now * 0.0015 + i) * 0.18 - 0.1;
        } else if (cw.state === 'walk') {
          cw.wt += dt;
          const tx = -6.0, tz = 1.5;
          const dx = tx - cw.c.position.x, dz = tz - cw.c.position.z;
          const d = Math.hypot(dx, dz);
          cw.c.rotation.y = Math.atan2(dz, dx) + Math.PI;
          if (d > 0.15) { cw.c.position.x += dx / d * dt * 2.6; cw.c.position.z += dz / d * dt * 2.6; }
          const sw = Math.sin(now * 0.012 + i) * 0.5;
          cw.legs[0].rotation.x = sw; cw.legs[3].rotation.x = sw;
          cw.legs[1].rotation.x = -sw; cw.legs[2].rotation.x = -sw;
          (cw.etag.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
          if (d <= 0.5 && !cw.scanned) {
            cw.scanned = true; pulse = 1;
            (cw.etag.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
            cbs.incCount();
            cbs.logEvent('Sapi ' + fmt(cw.id) + ' masuk kandang', '#ffcf8f');
            cw.state = 'enter'; cw.et = 0;
          }
        } else if (cw.state === 'enter') {
          cw.et += dt; cw.c.position.x += -dt * 2.2;
          if (cw.c.position.x < -8.5) { cw.c.visible = false; cw.state = 'done'; }
        }
      });

      if (cows.every(c => c.state === 'done')) {
        cows.forEach((c, i) => {
          c.c.visible = true; c.state = 'graze'; c.scanned = false;
          const gx = 2 + (i % 5) * 2.2, gz = (i < 5 ? -3.2 : 3.2) + (i % 2 ? 0.6 : -0.6);
          c.c.position.set(gx, 0, gz);
        });
        cbs.resetCount(); cbs.clearLog(); queueT = 0; nextIn = 0;
      }
    },
    target: new THREE.Vector3(-3, 1.4, 0),
    orbitOpts: { az: 0.9, pol: 0.82, r: 20, auto: 0.0011 },
  };
}
