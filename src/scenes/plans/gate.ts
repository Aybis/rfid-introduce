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

  const NEUTRAL_FLAP = 0x2a3a5a;
  const NEUTRAL_LIGHT = 0x3a6a9a;

  interface Lane {
    lx: number; grant: boolean;
    fp: THREE.Group; fp2: THREE.Group;
    flapMat: THREE.MeshStandardMaterial;
    reader: THREE.Mesh; lightMesh: THREE.Mesh;
    lightMat: THREE.MeshBasicMaterial;
    person: ReturnType<typeof makeHuman>;
    badge: THREE.Mesh; rg: THREE.Mesh;
    rgMat: THREE.MeshBasicMaterial;
    t: number; scanned: boolean; pulse: number; wait: number;
    denied: number;
  }

  const makeLane = (lx: number, grant: boolean): Lane => {
    [[-0.8], [0.8]].forEach(([px]) => {
      const ped = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.1, 1.6), boxMat(0x223149));
      ped.position.set(lx + px, 0.55, 0); scene.add(ped);
    });

    const reader = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.5, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x7fc4f0, emissive: 0x3a7fb5, emissiveIntensity: 0.4 }),
    );
    reader.position.set(lx - 0.8, 1.15, 0.5); reader.rotation.y = 0.3; scene.add(reader);

    // Both flaps start neutral — color changes on scan result
    const flapMat = new THREE.MeshStandardMaterial({
      color: NEUTRAL_FLAP, transparent: true, opacity: 0.55, metalness: 0.5, roughness: 0.2,
    });

    const fp = new THREE.Group(); fp.position.set(lx - 0.55, 0.6, 0); scene.add(fp);
    const flap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 1.1), flapMat);
    flap.position.z = 0.55; fp.add(flap);

    const fp2 = new THREE.Group(); fp2.position.set(lx + 0.55, 0.6, 0); scene.add(fp2);
    const flap2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 1.1), flapMat);
    flap2.position.z = 0.55; fp2.add(flap2);

    // Light starts neutral blue
    const lightMat = new THREE.MeshBasicMaterial({ color: NEUTRAL_LIGHT });
    const lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), lightMat);
    lightMesh.position.set(lx - 0.8, 1.5, 0.5); scene.add(lightMesh);

    const person = makeHuman(grant ? 0x2f6da0 : 0x7a4a4a, 0x223149);
    person.position.set(lx, 0, 5.5); scene.add(person);
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.34, 0.04), tagMat());
    badge.position.set(0.18, 1.1, 0.16); person.add(badge);

    const rgMat = new THREE.MeshBasicMaterial({
      color: grant ? 0x39d98a : 0xff5a5a, transparent: true, opacity: 0, side: THREE.DoubleSide,
    });
    const rg = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.34, 28), rgMat);
    rg.position.set(lx - 0.8, 1.15, 0.55); scene.add(rg);

    return { lx, grant, fp, fp2, flapMat, reader, lightMesh, lightMat, rgMat,
             person, badge, rg, t: 0, scanned: false, pulse: 0, wait: 0, denied: 0 };
  };

  const lanes = [makeLane(-3.2, true), makeLane(3.2, false)];
  let granted = 0, denied = 0;

  return {
    update: (dt, now) => {
      lanes.forEach((L, li) => {
        const sw = Math.sin(now * 0.012 + li) * 0.5;
        const stopZ = L.grant ? -1.0 : 1.2;

        // Walk toward gate
        if (L.person.position.z > stopZ + 0.05) {
          L.person.position.z -= dt * 2.2;
          L.person.rotation.y = Math.PI;
          L.person.userData.legL.rotation.x = sw;
          L.person.userData.legR.rotation.x = -sw;
        } else {
          L.person.userData.legL.rotation.x = 0;
          L.person.userData.legR.rotation.x = 0;
        }

        // Scan event — fires once when person gets close to reader
        if (!L.scanned && L.person.position.z < 2.4) {
          L.scanned = true; L.pulse = 1;
          if (L.grant) {
            granted++; cbs.incCount();
            cbs.logEvent('✓ Tervalidasi · Akses diberikan', '#39d98a');
            // Flip flap to green
            L.flapMat.color.set(0x2f6a4a);
            L.lightMat.color.set(0x39d98a);
          } else {
            denied++; cbs.incCount();
            cbs.logEvent('✗ Tidak valid · Akses ditolak', '#ff5a5a');
            // Flip flap to red
            L.flapMat.color.set(0x6a2f2f);
            L.lightMat.color.set(0xff5a5a);
            L.denied = 1;
          }
        }

        // Pulse ring & reader glow
        L.pulse = Math.max(0, L.pulse - dt * 1.5);
        const pr = 0.6 + (1 - L.pulse) * 0.7;
        (L.rg as THREE.Mesh).scale.set(pr, pr, 1);
        L.rgMat.opacity = L.pulse * 0.8;
        (L.reader.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4 + L.pulse * 1.4;
        (L.badge.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + L.pulse * 1.4;

        // Denied: flash red light
        if (L.denied > 0) {
          L.denied += dt;
          L.lightMat.color.setHex(Math.floor(L.denied * 6) % 2 === 0 ? 0xff5a5a : 0x220000);
        }

        // Gate open only for granted lane while person is passing
        const wantOpen = L.grant && L.scanned && L.person.position.z < 2.0 && L.person.position.z > -0.6 ? 1 : 0;
        L.t += (wantOpen - L.t) * Math.min(1, dt * 4);
        // closed (t=0): arms across lane (±π/2); open (t=1): arms tucked toward building (±π)
        L.fp.rotation.y  =  Math.PI / 2 * (1 + L.t);
        L.fp2.rotation.y = -Math.PI / 2 * (1 + L.t);

        // Reset green person after passing through
        if (L.grant && L.person.position.z < -1.0) {
          L.person.position.z = 5.5; L.scanned = false;
          L.flapMat.color.set(NEUTRAL_FLAP); L.lightMat.color.set(NEUTRAL_LIGHT);
        }

        // Reset red person after waiting
        if (!L.grant && L.scanned) {
          L.wait += dt;
          if (L.wait > 1.8) {
            L.person.position.z += dt * 2.4; L.person.rotation.y = 0;
            L.person.userData.legL.rotation.x = sw; L.person.userData.legR.rotation.x = -sw;
            if (L.person.position.z > 6) {
              L.person.position.z = 5.5; L.scanned = false; L.wait = 0; L.denied = 0;
              L.flapMat.color.set(NEUTRAL_FLAP); L.lightMat.color.set(NEUTRAL_LIGHT);
            }
          }
        }
      });
    },
    target: new THREE.Vector3(0, 1.5, 1.5),
    orbitOpts: { az: 0.6, pol: 0.86, r: 15, auto: 0.0011 },
  };
}
