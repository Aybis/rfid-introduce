import * as THREE from 'three';
import { boxMat, makeHuman, tagMat } from '../helpers';
import type { PlanCallbacks, PlanInit } from './types';

export function initGate(
  scene: THREE.Scene,
  _cleanups: Array<() => void>,
  cbs: PlanCallbacks,
): PlanInit {
  cbs.setLabel('AKSES');

  const facade = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 0.4), boxMat(0x16243a));
  facade.position.set(0, 2.5, -2.5); scene.add(facade);
  for (let i = -3; i <= 3; i++) {
    const win = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.4, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x2a4a6a, emissive: 0x16314e, emissiveIntensity: 0.3, metalness: 0.6, roughness: 0.2 }),
    );
    win.position.set(i * 2.0, 3.4, -2.28); scene.add(win);
  }
  const lobbyFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 6),
    new THREE.MeshStandardMaterial({ color: 0x0c1a2a, roughness: 0.8, metalness: 0.1 }),
  );
  lobbyFloor.rotation.x = -Math.PI / 2; lobbyFloor.position.set(0, 0.02, -1.4); scene.add(lobbyFloor);

  interface Lane {
    lx: number; grant: boolean;
    fp: THREE.Group; fp2: THREE.Group;
    reader: THREE.Mesh; light: THREE.Mesh; person: ReturnType<typeof makeHuman>;
    badge: THREE.Mesh; rg: THREE.Mesh;
    t: number; prevZ: number; scanned: boolean; pulse: number; wait: number;
  }

  const makeLane = (lx: number, grant: boolean): Lane => {
    [[-0.8], [0.8]].forEach(([px]) => {
      const ped = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.1, 1.6), boxMat(0x223149));
      ped.position.set(lx + px, 0.55, 0); scene.add(ped);
    });
    const reader = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.5, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x7fc4f0, emissive: 0x3a7fb5, emissiveIntensity: 0.6 }),
    );
    reader.position.set(lx - 0.8, 1.15, 0.5); reader.rotation.y = 0.3; scene.add(reader);

    const fp = new THREE.Group(); fp.position.set(lx - 0.55, 0.6, 0); scene.add(fp);
    const flap = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.0, 1.1),
      new THREE.MeshStandardMaterial({ color: grant ? 0x2f6a4a : 0x6a2f2f, transparent: true, opacity: 0.5, metalness: 0.5, roughness: 0.2 }),
    );
    flap.position.z = 0.55; fp.add(flap);

    const fp2 = new THREE.Group(); fp2.position.set(lx + 0.55, 0.6, 0); scene.add(fp2);
    const flap2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.0, 1.1),
      new THREE.MeshStandardMaterial({ color: grant ? 0x2f6a4a : 0x6a2f2f, transparent: true, opacity: 0.5, metalness: 0.5, roughness: 0.2 }),
    );
    flap2.position.z = -0.55; fp2.add(flap2);

    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshBasicMaterial({ color: grant ? 0x39d98a : 0xff5a5a }),
    );
    light.position.set(lx - 0.8, 1.5, 0.5); scene.add(light);

    const person = makeHuman(grant ? 0x2f6da0 : 0x7a4a4a, 0x223149);
    person.position.set(lx, 0, 5.5); scene.add(person);
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.34, 0.04), tagMat());
    badge.position.set(0.18, 1.1, 0.16); person.add(badge);

    const rg = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.34, 28),
      new THREE.MeshBasicMaterial({ color: grant ? 0x39d98a : 0xff5a5a, transparent: true, opacity: 0, side: THREE.DoubleSide }),
    );
    rg.position.set(lx - 0.8, 1.15, 0.55); scene.add(rg);

    return { lx, grant, fp, fp2, reader, light, person, badge, rg, t: 0, prevZ: 5.5, scanned: false, pulse: 0, wait: 0 };
  };

  const lanes = [makeLane(-3.2, true), makeLane(3.2, false)];
  let granted = 0, denied = 0;

  return {
    update: (dt, now) => {
      lanes.forEach((L, li) => {
        L.prevZ = L.person.position.z;
        const stopZ = L.grant ? -1.0 : 1.7;
        const sw = Math.sin(now * 0.012 + li) * 0.5;
        L.person.userData.legL.rotation.x = sw; L.person.userData.legR.rotation.x = -sw;
        if (L.person.position.z > stopZ + 0.05) { L.person.position.z -= dt * 2.2; L.person.rotation.y = Math.PI; }
        else { L.person.userData.legL.rotation.x = 0; L.person.userData.legR.rotation.x = 0; }

        if (!L.scanned && L.person.position.z < 2.4) {
          L.scanned = true; L.pulse = 1;
          if (L.grant) {
            granted++; cbs.incCount();
            cbs.logEvent('Diizinkan · Karyawan #' + granted, '#39d98a');
          } else {
            denied++; cbs.incCount();
            cbs.logEvent('DITOLAK · kartu tidak valid', '#ff5a5a');
          }
        }

        L.pulse = Math.max(0, L.pulse - dt * 1.5);
        const pr = 0.6 + (1 - L.pulse) * 0.7;
        (L.rg as THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>).scale.set(pr, pr, 1);
        (L.rg.material as THREE.MeshBasicMaterial).opacity = L.pulse * 0.8;
        (L.reader.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + L.pulse * 1.2;
        (L.badge.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + L.pulse * 1.4;

        const wantOpen = L.grant ? (L.person.position.z < 2.0 && L.person.position.z > -0.6 ? 1 : 0) : 0;
        L.t += (wantOpen - L.t) * Math.min(1, dt * 4);
        L.fp.rotation.y = -L.t * 1.3; L.fp2.rotation.y = L.t * 1.3;

        if (L.grant && L.person.position.z < -1.0) { L.person.position.z = 5.5; L.scanned = false; }
        if (!L.grant && L.scanned) {
          L.wait = (L.wait || 0) + dt;
          if (L.wait > 1.6) {
            L.person.position.z += dt * 2.4; L.person.rotation.y = 0;
            if (L.person.position.z > 6) { L.person.position.z = 5.5; L.scanned = false; L.wait = 0; }
          }
        }
      });
    },
    target: new THREE.Vector3(0, 1.5, 1.5),
    orbitOpts: { az: 0.6, pol: 0.86, r: 15, auto: 0.0011 },
  };
}
