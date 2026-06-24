import * as THREE from 'three';
import { boxMat, makeShelfMat, makeCar } from '../helpers';
import type { PlanCallbacks, PlanInit } from './types';

export function initToll(
  scene: THREE.Scene,
  _cleanups: Array<() => void>,
  cbs: PlanCallbacks,
): PlanInit {
  cbs.setLabel('KENDARAAN LEWAT');
  const shelfMat = makeShelfMat();
  const LANES = [-3.0, 0, 3.0];
  const BARRIER_X = -1.2;

  // Road surface
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(44, 11),
    new THREE.MeshStandardMaterial({ color: 0x101a26, roughness: 0.95 }),
  );
  road.rotation.x = -Math.PI / 2; road.position.y = 0.02; scene.add(road);
  [-1.5, 1.5].forEach(z => {
    for (let i = -10; i <= 10; i++) {
      const ln = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.02, 0.16),
        new THREE.MeshBasicMaterial({ color: 0xffd9a0 }),
      );
      ln.position.set(i * 2.1, 0.04, z); scene.add(ln);
    }
  });

  // Overhead gantry
  const gantryBar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 11), shelfMat);
  gantryBar.position.set(0, 5.2, 0); scene.add(gantryBar);
  [-5, 5].forEach(z => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5.2, 0.5), shelfMat);
    post.position.set(0, 2.6, z); scene.add(post);
  });

  const carColors = [0x9a3b2e, 0x2f6da0, 0x4a7a4a];
  const lanes = LANES.map((lz, li) => {
    const reader = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x7fc4f0, emissive: 0x3a7fb5, emissiveIntensity: 0.5 }),
    );
    reader.position.set(0, 5.0, lz); scene.add(reader);

    const bpost = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.6, 0.28), boxMat(0x1e3048));
    bpost.position.set(BARRIER_X, 1.3, lz + 1.46); scene.add(bpost);
    const bhouse = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.55), boxMat(0x172638));
    bhouse.position.set(BARRIER_X, 1.8, lz + 1.46); scene.add(bhouse);

    const statusLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xff4040 }),
    );
    statusLight.position.set(BARRIER_X - 0.3, 1.9, lz + 1.46); scene.add(statusLight);

    const pivot = new THREE.Group();
    pivot.position.set(BARRIER_X, 1.55, lz + 1.46); scene.add(pivot);

    const armLen = 3.0;
    const armMat = new THREE.MeshStandardMaterial({
      color: 0xe83030, emissive: 0xaa1010, emissiveIntensity: 0.25, roughness: 0.5,
    });
    const armMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.13, armLen), armMat);
    armMesh.position.z = -(armLen / 2); pivot.add(armMesh);

    for (let s = 0; s < 5; s++) {
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.15, 0.24),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 }),
      );
      stripe.position.z = -(0.45 + s * 0.58); pivot.add(stripe);
    }
    const cwt = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.22, 0.55), boxMat(0x1e3048));
    cwt.position.z = 0.42; pivot.add(cwt);

    const car = makeCar(carColors[li]);
    car.position.set(-15 - li * 4, 0, lz); scene.add(car);

    return { reader, pivot, armMat, car, statusLight, lz, armAngle: 0, targetAngle: 0, prevX: -15 };
  });

  let beamFlash = 0;
  let readCount = 0;

  return {
    update: (dt) => {
      lanes.forEach((L, li) => {
        L.prevX = L.car.position.x;
        const isOpen = L.armAngle > 0.8;
        const nearGate = L.car.position.x > -4.0 && L.car.position.x < 0.8;
        const speed = (nearGate && !isOpen) ? 1.4 : 4.8;
        L.car.position.x += dt * speed;
        if (L.car.position.x > 16) { L.car.position.x = -15 - ((li * 3) % 6); L.targetAngle = 0; }
        if (L.prevX < BARRIER_X - 0.6 && L.car.position.x >= BARRIER_X - 0.6) {
          readCount++;
          cbs.incCount();
          L.targetAngle = Math.PI / 2; beamFlash = 1;
          cbs.logEvent('Lajur ' + (li + 1) + ' · kend. #' + readCount, '#a9d4ff');
        }
        if (L.car.position.x > 1.4 && L.targetAngle > 0.1) L.targetAngle = 0;
        L.armAngle += (L.targetAngle - L.armAngle) * Math.min(1, dt * 3.2);
        L.pivot.rotation.x = L.armAngle;
        const pct = L.armAngle / (Math.PI / 2);
        (L.statusLight.material as THREE.MeshBasicMaterial).color.setHex(pct > 0.5 ? 0x39d98a : 0xff4040);
        (L.reader.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + (pct > 0.5 ? 1.2 : 0);
        (L.car.userData.tag.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.6 + (beamFlash > 0.5 && pct > 0.3 ? 1.4 : 0);
      });
      beamFlash = Math.max(0, beamFlash - dt * 2.5);
    },
    target: new THREE.Vector3(0, 1.8, 0),
    orbitOpts: { az: 0.66, pol: 0.84, r: 21, auto: 0.0009 },
  };
}
