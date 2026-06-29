import * as THREE from 'three';
import { boxMat, makeShelfMat, makeHuman, makePortal, tagMat } from '../helpers';
import type { PlanCallbacks, PlanInit } from './types';

export function initLogistics(
  scene: THREE.Scene,
  _cleanups: Array<() => void>,
  cbs: PlanCallbacks,
): PlanInit {
  cbs.setLabel('OUTBOUND LOGISTICS');
  const shelfMat = makeShelfMat();

  const makeWarehouse = (x: number, roofCol: number) => {
    const g = new THREE.Group();
    const back = new THREE.Mesh(new THREE.BoxGeometry(8, 7.5, 0.2), boxMat(0x1a2940));
    back.position.set(0, 3.75, -3.0); g.add(back);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.3, 6.4), boxMat(roofCol));
    roof.position.set(0, 7.65, 0); g.add(roof);
    // Side walls — stop at z=1.2 so the front dock area is open for the truck
    [-4, 4].forEach(xw => {
      const w = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7.5, 4.6), boxMat(0x1a2940));
      w.position.set(xw, 3.75, -1.1); g.add(w);
    });
    // 4 shelf levels
    for (let s = 0; s < 4; s++) {
      const sh = new THREE.Mesh(new THREE.BoxGeometry(7, 0.13, 1.5), shelfMat);
      sh.position.set(0, 0.8 + s * 1.5, -2.2); g.add(sh);
      for (let i = -2; i <= 2; i++) {
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(1.0, 1.1, 1.1),
          boxMat([0x4a3a2a, 0x274a3a, 0x3a3a5a][(Math.abs(i) + s) % 3]),
        );
        b.position.set(i * 1.4, 0.8 + s * 1.5 + 0.6, -2.2); g.add(b);
      }
    }
    // Conveyor belt — runs in Z from inside warehouse to dock (z=-2.3 to z=3.0)
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const belt = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.10, 5.5), beltMat);
    belt.position.set(0, 0.86, 0.35); g.add(belt);
    const frameMat = boxMat(0x2a3a4a);
    [-0.68, 0.68].forEach(fx => {
      const fr = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 5.5), frameMat);
      fr.position.set(fx, 0.86, 0.35); g.add(fr);
    });
    for (let rz = -2.3; rz <= 2.9; rz += 0.45) {
      const rol = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 1.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a5a6a, metalness: 0.7, roughness: 0.2 }),
      );
      rol.rotation.z = Math.PI / 2; rol.position.set(0, 0.90, rz); g.add(rol);
    }
    for (const lz of [-2.2, 0.35, 2.7]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.88, 0.08), frameMat);
      leg.position.set(0, 0.44, lz); g.add(leg);
    }
    g.position.set(x, 0, 0); scene.add(g);
  };
  makeWarehouse(-16, 0x2f6da0); makeWarehouse(16, 0x4a7a4a);

  // Road — wide enough for x=±16 warehouses
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(44, 8.0),
    new THREE.MeshStandardMaterial({ color: 0x101a26, roughness: 0.95 }),
  );
  road.rotation.x = -Math.PI / 2; road.position.set(0, 0.02, 3.2); scene.add(road);
  for (let i = -9; i <= 9; i++) {
    const ln = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.02, 0.18),
      new THREE.MeshBasicMaterial({ color: 0xffd9a0 }),
    );
    ln.position.set(i * 2.3, 0.04, 3.2); scene.add(ln);
  }

  // RFID portals — span warehouse width (X) so conveyor goods pass through in Z
  const PA = makePortal(-3.5, 3.5, 5.5, 0xffb24d, scene, shelfMat);
  PA.grp.position.set(-16, 0, -0.5);
  PA.grp.rotation.y = Math.PI / 2;
  const PB = makePortal(-3.5, 3.5, 5.5, 0xffb24d, scene, shelfMat);
  PB.grp.position.set(16, 0, -0.5);
  PB.grp.rotation.y = Math.PI / 2;

  // Truck
  const truck = new THREE.Group();
  const trailer = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.5, 2.2), boxMat(0x2f4a63));
  trailer.position.set(-0.9, 1.55, 0); truck.add(trailer);
  const tcab = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.9, 2.1), boxMat(0x9a3b2e));
  tcab.position.set(2.3, 1.15, 0); truck.add(tcab);
  const twind = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.65, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x0a1622, metalness: 0.6, roughness: 0.2 }),
  );
  twind.position.set(1.52, 1.7, 0); truck.add(twind);
  [[-1.8, 1.1], [0.0, 1.1], [2.0, 1.1]].forEach(([tx, tz]) => {
    const w = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.44, 0.34, 14),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a }),
    );
    w.rotation.x = Math.PI / 2; w.position.set(tx, 0.44, tz); truck.add(w);
    const w2 = w.clone(); w2.position.z = -1.12; truck.add(w2);
  });

  // Cargo pallets
  const PALLET_COLS = [0x5a3a1a, 0x2a4a2a, 0x2a3a5a];
  const cargos = PALLET_COLS.map((col, i) => {
    const g = new THREE.Group(); g.position.set(-2.4 + i * 0.9, 0, 0); truck.add(g);
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.9, 1.1), boxMat(col));
    box.position.y = 2.07; g.add(box);
    const pallet = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 1.18), boxMat(0x8a6a3a));
    pallet.position.y = 1.65; g.add(pallet);
    const ctag = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.02), tagMat());
    ctag.position.set(0, 2.1, 0.56); g.add(ctag);
    g.visible = false; g.scale.set(1, 0, 1);
    return { g, ctag, prog: 0, loadLogged: false, unloadLogged: false };
  });
  truck.position.set(-16, 0, 3.2); scene.add(truck);

  // Workers
  const wkA = makeHuman(0xffb24d, 0x223149);
  wkA.position.set(-15.2, 0, 1.8); wkA.rotation.y = -Math.PI / 4; scene.add(wkA);
  const wkB = makeHuman(0x7fc4f0, 0x223149);
  wkB.position.set(15.2, 0, 1.8); wkB.rotation.y = Math.PI + Math.PI / 4; scene.add(wkB);

  let stage = 0, stageT = 0, flashA = 0, flashB = 0;
  const nextStage = (s: number) => { stage = s; stageT = 0; };

  return {
    update: (dt, now) => {
      stageT += dt;
      const sw = Math.sin(now * 0.011) * 0.45;

      if (stage === 0) {
        wkA.userData.legL.rotation.x = sw; wkA.userData.legR.rotation.x = -sw;
        let allLoaded = true;
        cargos.forEach((c, i) => {
          if (stageT >= 0.7 * (i + 1)) { c.g.visible = true; c.prog = Math.min(1, c.prog + dt * 2.4); c.g.scale.set(1, c.prog, 1); }
          if (c.prog < 0.99) allLoaded = false;
          if (c.prog >= 0.99 && !c.loadLogged) {
            c.loadLogged = true; flashA = 1;
            cbs.incCount();
            cbs.logEvent('Palet #' + (i + 1) + ' RFID terbaca · Gudang A', '#ffcf8f');
          }
        });
        if (allLoaded && stageT > 3.5) { cbs.logEvent('Semua palet dimuat — truk berangkat', '#7fc4f0'); nextStage(1); }

      } else if (stage === 1) {
        wkA.userData.legL.rotation.x = 0; wkA.userData.legR.rotation.x = 0;
        truck.rotation.y = 0; truck.position.x += dt * 6.0;
        if (truck.position.x >= 16) { truck.position.x = 16; cbs.logEvent('Tiba di Gudang Agen', '#7fc4f0'); nextStage(2); }

      } else if (stage === 2) {
        wkB.userData.legL.rotation.x = sw; wkB.userData.legR.rotation.x = -sw;
        let allUnloaded = true;
        cargos.forEach((c, i) => {
          if (stageT >= 0.6 * (i + 1)) { c.prog = Math.max(0, c.prog - dt * 2.2); c.g.scale.set(1, c.prog, 1); if (c.prog <= 0) c.g.visible = false; }
          if (c.prog > 0.01) allUnloaded = false;
          if (c.prog <= 0.01 && !c.unloadLogged && c.loadLogged) {
            c.unloadLogged = true; flashB = 1;
            cbs.incCount();
            cbs.logEvent('Palet #' + (i + 1) + ' diturunkan · Gudang Agen', '#a9d4ff');
          }
        });
        if (allUnloaded && stageT > 3.2) { cbs.logEvent('Pengiriman selesai — truk kembali', '#9cc2dd'); nextStage(3); }

      } else {
        wkB.userData.legL.rotation.x = 0; wkB.userData.legR.rotation.x = 0;
        truck.rotation.y = Math.PI; truck.position.x -= dt * 8.5;
        if (truck.position.x <= -16) {
          truck.position.x = -16; truck.rotation.y = 0;
          cargos.forEach(c => { c.g.visible = false; c.g.scale.set(1, 0, 1); c.prog = 0; c.loadLogged = false; c.unloadLogged = false; });
          cbs.resetCount(); cbs.clearLog(); nextStage(0);
        }
      }

      flashA = Math.max(0, flashA - dt * 2); flashB = Math.max(0, flashB - dt * 2);
      (PA.beam.material as THREE.MeshBasicMaterial).opacity = 0.07 + flashA * 0.65;
      (PB.beam.material as THREE.MeshBasicMaterial).opacity = 0.07 + flashB * 0.65;
      cargos.forEach(c => {
        if (c.g.visible && c.ctag) {
          (c.ctag.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7 + Math.max(flashA, flashB) * 1.6;
        }
      });
    },
    target: new THREE.Vector3(0, 2.8, 1.5),
    orbitOpts: { az: 0.12, pol: 0.72, r: 70, auto: 0.0008 },
  };
}
