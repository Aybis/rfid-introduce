import * as THREE from 'three';
import { boxMat, makeShelfMat, makeHuman } from '../helpers';
import type { PlanCallbacks, PlanInit } from './types';

export function initWarehouse(
  scene: THREE.Scene,
  _cleanups: Array<() => void>,
  cbs: PlanCallbacks,
): PlanInit {
  cbs.setLabel('STOK TERINDEKS');
  const shelfMat = makeShelfMat();
  const prodCols = [0xc9923a, 0x4a7a4a, 0x9a3b2e, 0x2f6da0, 0x6a4a8a, 0xbb5547, 0x3a6a8a];

  const makeShelf = (z: number, face: number) => {
    const g = new THREE.Group();
    const back = new THREE.Mesh(new THREE.BoxGeometry(18, 3.4, 0.3), boxMat(0x223149));
    back.position.set(0, 1.7, 0); g.add(back);
    for (let s = 0; s < 3; s++) {
      const sb = new THREE.Mesh(new THREE.BoxGeometry(18, 0.12, 1.1), shelfMat);
      sb.position.set(0, 0.7 + s * 1.05, face * 0.45); g.add(sb);
      for (let i = 0; i < 22; i++) {
        const h = 0.45 + ((i * 5 + s) % 3) * 0.13;
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.56, h, 0.6),
          boxMat(prodCols[(i + s) % prodCols.length]));
        p.position.set(-8.4 + i * 0.78, 0.7 + s * 1.05 + h / 2 + 0.06, face * 0.45);
        g.add(p);
      }
    }
    g.position.set(0, 0, z); scene.add(g);
  };
  makeShelf(-2.7, 1); makeShelf(2.7, -1);

  const worker = makeHuman(0xffb24d, 0x223149);
  worker.position.set(-8, 0, 0); scene.add(worker);

  const scanner = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.2, 0.14),
    new THREE.MeshStandardMaterial({ color: 0x16314e, emissive: 0x3a7fb5, emissiveIntensity: 0.4, metalness: 0.5, roughness: 0.4 }),
  );
  scanner.position.set(0.42, 1.18, 0.42); worker.add(scanner);

  const beam = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 2.6),
    new THREE.MeshBasicMaterial({ color: 0xffb24d, transparent: true, opacity: 0, side: THREE.DoubleSide }),
  );
  beam.rotation.y = Math.PI / 2; beam.position.y = 1.4; scene.add(beam);

  const shelfLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  let dir = 1, scanT = 0, sect = -1, flash = 0;

  return {
    update: (dt, now) => {
      worker.position.x += dir * dt * 2.4;
      if (worker.position.x > 8.2) dir = -1;
      if (worker.position.x < -8.2) dir = 1;
      worker.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      const sw = Math.sin(now * 0.013) * 0.5;
      worker.userData.legL.rotation.x = sw; worker.userData.legR.rotation.x = -sw;
      beam.position.x = worker.position.x;
      (beam.material as THREE.MeshBasicMaterial).opacity = flash * 0.42;
      (scanner.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4 + flash * 1.4;
      const s = Math.round((worker.position.x + 8) / 2.3);
      scanT += dt;
      if (s !== sect && scanT > 0.45 && worker.position.x > -8 && worker.position.x < 8) {
        sect = s; scanT = 0; flash = 1;
        const items = 8 + ((s * 7 + 5) % 18);
        cbs.incCount();
        cbs.logEvent('Rak ' + shelfLetters[((s % 7) + 7) % 7] + '·' + items + ' unit', '#ffcf8f');
      }
      flash = Math.max(0, flash - dt * 2.0);
    },
    target: new THREE.Vector3(0, 1.4, 0),
    orbitOpts: { az: 0.58, pol: 0.8, r: 16.5, auto: 0.0010 },
  };
}
