import * as THREE from 'three';

function roundedRectCurve(w: number, h: number, r: number): THREE.CatmullRomCurve3 {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  const pts = s.getPoints(80).map(p => new THREE.Vector3(p.x, p.y, 0));
  return new THREE.CatmullRomCurve3(pts, true);
}

export interface TagParts {
  group: THREE.Group;
  substrate: THREE.Mesh;
  antenna: THREE.Group;
  chip: THREE.Mesh;
  casing: THREE.Mesh;
}

export function buildTag(): TagParts {
  const matNavy = new THREE.MeshStandardMaterial({
    color: 0x0e2840, metalness: 0.2, roughness: 0.65, transparent: true, opacity: 0.95,
  });
  const matGold = new THREE.MeshStandardMaterial({
    color: 0xffb24d, emissive: 0xffb24d, emissiveIntensity: 0.32,
    metalness: 0.55, roughness: 0.35,
  });
  const matChip = new THREE.MeshStandardMaterial({
    color: 0xffc46b, emissive: 0xffb24d, emissiveIntensity: 0.7,
    metalness: 0.7, roughness: 0.25,
  });
  const matGlass = new THREE.MeshStandardMaterial({
    color: 0xe8f3fb, metalness: 0.1, roughness: 0.12, transparent: true, opacity: 0.13,
  });

  const group = new THREE.Group();
  const substrate = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.9, 0.07), matNavy);
  group.add(substrate);

  const antenna = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const curve = roundedRectCurve(2.55 - i * 0.32, 1.5 - i * 0.2, 0.2);
    antenna.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 130, 0.018, 8, true), matGold));
  }
  antenna.position.z = 0.07;
  group.add(antenna);

  const chip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.13), matChip);
  chip.position.set(0, 0, 0.13);
  group.add(chip);

  const casing = new THREE.Mesh(new THREE.BoxGeometry(3.12, 2.02, 0.1), matGlass);
  casing.position.z = 0.18;
  group.add(casing);

  return { group, substrate, antenna, chip, casing };
}
