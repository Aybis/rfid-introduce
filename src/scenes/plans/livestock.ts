import * as THREE from 'three';
import { boxMat, makeShelfMat } from '../helpers';
import type { PlanCallbacks, PlanInit } from './types';

// Indonesian cattle breeds with realistic weight ranges and body colors
const CATTLE = [
  { breed: 'Sapi Bali',       sex: '♀', wMin: 280, wMax: 380, col: 0x3a2a20, spot: 0x1a1412 },
  { breed: 'Sapi FH',         sex: '♀', wMin: 420, wMax: 550, col: 0xdce8dc, spot: 0x222222 },
  { breed: 'Sapi Madura',     sex: '♂', wMin: 220, wMax: 320, col: 0xb08060, spot: 0x7a5040 },
  { breed: 'Sapi Brahman',    sex: '♂', wMin: 380, wMax: 520, col: 0xd8ccc0, spot: 0xa8a098 },
  { breed: 'Sapi Simmental',  sex: '♀', wMin: 460, wMax: 600, col: 0xd09050, spot: 0x8a6030 },
];

// Vaccination schedule — realistic diseases for Indonesian cattle
const VAX: string[] = ['FMD ✓', 'Brucella ✓', 'SE ✓', 'Anthrax ✓', 'BVD ✓'];

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const fmtId = (n: number) => `IDN-360-${String(n).padStart(3, '0')}-${String(n * 7 + 1000).padStart(4, '0')}`;
const fmtWeight = (w: number) => `${w} kg`;

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
  breed: string;
  sex: string;
  weight: number;
  vax: string;
  age: number;
}

export function initLivestock(
  scene: THREE.Scene,
  _cleanups: Array<() => void>,
  cbs: PlanCallbacks,
): PlanInit {
  cbs.setLabel('IDENTIFIKASI TERNAK');
  const shelfMat = makeShelfMat();

  // Pasture
  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x2c4626, roughness: 1 }),
  );
  grass.rotation.x = -Math.PI / 2; grass.position.y = 0.02; scene.add(grass);

  // Soil path to scanner
  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 3),
    new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 1 }),
  );
  path.rotation.x = -Math.PI / 2; path.position.set(-4, 0.025, 1.5); scene.add(path);

  // Barn
  const barn = new THREE.Group();
  // Barn body centered at z=1.5 to match chute center
  const bw = new THREE.Mesh(new THREE.BoxGeometry(5, 3.2, 7), boxMat(0x7a3128));
  bw.position.set(0, 1.6, 1.5); barn.add(bw);
  const roofL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.4, 7.4), boxMat(0x5a2018));
  roofL.position.set(-1.4, 3.6, 1.5); roofL.rotation.z = 0.7; barn.add(roofL);
  const roofR = roofL.clone(); roofR.position.x = 1.4; roofR.rotation.z = -0.7; barn.add(roofR);
  // Doorway aligned with chute (z=0 to z=3, center z=1.5)
  const doorway = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 3.0),
    new THREE.MeshStandardMaterial({ color: 0x100a08 }));
  doorway.position.set(2.5, 1.2, 1.5); barn.add(doorway);
  barn.position.set(-9, 0, 0); scene.add(barn);

  // Fence panels
  const fence = (x: number, z: number, len: number, rx: boolean) => {
    const f = new THREE.Mesh(new THREE.BoxGeometry(rx ? 0.12 : len, 1.2, rx ? len : 0.12), boxMat(0x5a3820));
    f.position.set(x, 0.6, z); scene.add(f);
  };
  // Pasture outer enclosure
  fence(11, -4, 10, false); fence(11, 4, 10, false);
  fence(16, 0, 8, true);
  // Close the gap at x=6: from pasture to chute opening (z=0) and above chute (z=3 to z=4)
  fence(6, -2, 4, true);   // z=-4 to z=0
  fence(6, 3.5, 1, true);  // z=3 to z=4
  // Chute — channels cows single-file from pasture gate (x=6) to scanner
  fence(-0.5, 0, 13, false); fence(-0.5, 3, 13, false);
  // Gate posts only (entrance pillars, no arm)
  fence(6, 0, 0.3, true); fence(6, 3, 0.3, true);

  // Scanner post — on the side of chute (z=0 edge), not blocking the path
  const sp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.0, 0.3), shelfMat);
  sp.position.set(-6.0, 1.0, -0.3); scene.add(sp);
  const spanel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x7fc4f0, emissive: 0x3a7fb5, emissiveIntensity: 0.6 }));
  spanel.position.set(-6.0, 1.2, -0.1); scene.add(spanel);

  // Weighing platform under scanner
  const scale = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 2.0),
    new THREE.MeshStandardMaterial({ color: 0x2a4060, roughness: 0.4, metalness: 0.5 }));
  scale.position.set(-6.2, 0.04, 1.5); scene.add(scale);
  const scaleRim = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x1a3050, roughness: 0.5, metalness: 0.4 }));
  scaleRim.position.set(-6.2, 0.0, 1.5); scene.add(scaleRim);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.55, 32),
    new THREE.MeshBasicMaterial({ color: 0xffb24d, transparent: true, opacity: 0, side: THREE.DoubleSide }),
  );
  ring.position.set(-6.0, 1.2, -0.1); scene.add(ring);

  const makeCow = (info: typeof CATTLE[0], id: number): Cow => {
    const c = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.9), boxMat(info.col));
    body.position.y = 1.0; c.add(body);

    // Spotted pattern for FH (Holstein)
    if (info.breed === 'Sapi FH') {
      const spot1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.92), boxMat(info.spot));
      spot1.position.set(-0.3, 1.0, 0); c.add(spot1);
      const spot2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.92), boxMat(info.spot));
      spot2.position.set(0.5, 1.05, 0); c.add(spot2);
    }

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.6), boxMat(info.col));
    head.position.set(1.0, 1.15, 0); c.add(head);
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.42), boxMat(0xc9a0a0));
    snout.position.set(1.35, 1.0, 0); c.add(snout);

    // Brahman hump
    if (info.breed === 'Sapi Brahman') {
      const hump = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), boxMat(info.col));
      hump.position.set(-0.2, 1.55, 0); c.add(hump);
    }

    const legs = [[-0.6, -0.32], [0.6, -0.32], [-0.6, 0.32], [0.6, 0.32]].map(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.72, 0.2), boxMat(0x2a1f18));
      leg.position.set(lx, 0.36, lz); c.add(leg); return leg;
    });

    // Ear tag — color-coded by breed
    const tagColors: Record<string, number> = {
      'Sapi Bali': 0xffb24d, 'Sapi FH': 0x39d98a, 'Sapi Madura': 0xff6666,
      'Sapi Brahman': 0x7fc4f0, 'Sapi Simmental': 0xb48aff,
    };
    const etag = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.04),
      new THREE.MeshStandardMaterial({
        color: tagColors[info.breed] ?? 0xffb24d,
        emissive: tagColors[info.breed] ?? 0xffb24d,
        emissiveIntensity: 0.85, metalness: 0.4, roughness: 0.3,
      }));
    etag.position.set(1.0, 1.42, 0.34); c.add(etag);

    const weight = randInt(info.wMin, info.wMax);
    const vax = VAX[id % VAX.length];
    const age = randInt(1, 5);
    return { c, etag, legs, state: 'graze', t: 0, wt: 0, et: 0, id, scanned: false,
             breed: info.breed, sex: info.sex, weight, vax, age };
  };

  const HERD = 10;
  const cows: Cow[] = [];
  for (let i = 0; i < HERD; i++) {
    const info = CATTLE[i % CATTLE.length];
    const cw = makeCow(info, i + 1);
    // All cows start in the pasture (x > 6, outside the chute fence)
    const gx = 8 + (i % 5) * 1.8, gz = -3 + (i * 1.5 % 6.5);
    cw.c.position.set(gx, 0, gz); cw.c.rotation.y = Math.PI * 0.5 + ((i * 1.3) % 1);
    cw.graze = [gx, gz];
    scene.add(cw.c); cows.push(cw);
  }

  let queueT = 0, pulse = 0, nextIn = 0;

  return {
    update: (dt, now) => {
      queueT += dt;
      const chuteOccupied = cows.some(c => c.state === 'walk' || c.state === 'enter');
      if (queueT > nextIn && !chuteOccupied) {
        const c = cows.find(c => c.state === 'graze');
        if (c) { c.state = 'walk'; c.wt = 0; }
        nextIn = queueT + 1.2;
      }
      pulse = Math.max(0, pulse - dt * 1.4);
      const pr = 0.6 + (1 - pulse) * 0.6;
      ring.scale.set(pr, pr, 1);
      (ring.material as THREE.MeshBasicMaterial).opacity = pulse * 0.85;
      (spanel.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + pulse * 1.3;

      cows.forEach((cw, i) => {
        if (cw.state === 'graze') {
          cw.c.position.y = Math.sin(now * 0.002 + i) * 0.02;
          const head = cw.c.children.find(ch => ch instanceof THREE.Mesh &&
            (ch as THREE.Mesh).geometry instanceof THREE.BoxGeometry) as THREE.Mesh | undefined;
          if (head) head.rotation.z = Math.sin(now * 0.0015 + i) * 0.18 - 0.1;

        } else if (cw.state === 'walk') {
          cw.wt += dt;
          const chuteZ = 1.5;
          const sw = Math.sin(now * 0.012 + i) * 0.5;
          cw.legs[0].rotation.x = sw; cw.legs[3].rotation.x = sw;
          cw.legs[1].rotation.x = -sw; cw.legs[2].rotation.x = -sw;

          // Phase 1: move ONLY in Z to align with chute center (no diagonal)
          if (Math.abs(cw.c.position.z - chuteZ) > 0.12) {
            const dz = chuteZ - cw.c.position.z;
            cw.c.position.z += Math.sign(dz) * Math.min(Math.abs(dz), dt * 2.2);
            cw.c.rotation.y = dz > 0 ? Math.PI / 2 : -Math.PI / 2;
          } else {
            // Phase 2: walk straight through chute in -X
            cw.c.position.z = chuteZ;
            cw.c.position.x -= dt * 2.6;
            cw.c.rotation.y = Math.PI; // cow head (+X) faces -X direction
          }

          const dx = -6.0 - cw.c.position.x;
          const d = Math.abs(dx);
          (cw.etag.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
          if (d <= 0.5 && !cw.scanned) {
            cw.scanned = true; pulse = 1;
            (cw.etag.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
            cbs.incCount();
            cbs.logEvent(
              `${fmtId(cw.id)} · ${cw.breed} · ${cw.sex} ${cw.age}th · ${fmtWeight(cw.weight)} · ${cw.vax}`,
              '#ffcf8f',
            );
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
