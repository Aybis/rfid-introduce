import * as THREE from 'three';
import { boxMat, makeShelfMat, makeHuman, tagMat } from '../helpers';
import type { PlanCallbacks, PlanInit } from './types';

// Real Indonesian school/university library books with Dewey Decimal call numbers
const BOOKS = [
  { title: 'Matematika Peminatan XI', call: '510 MAT', days: 7 },
  { title: 'Fisika Untuk SMA Kelas XII', call: '530 FIS', days: 7 },
  { title: 'Sejarah Indonesia Modern', call: '959.8 SEJ', days: 14 },
  { title: 'Kimia Dasar Organik', call: '547 KIM', days: 7 },
  { title: 'Biologi Sel & Molekuler', call: '571.6 BIO', days: 14 },
  { title: 'Pemrograman Web Dasar', call: '005.1 PEM', days: 7 },
  { title: 'Atlas Geografi Indonesia', call: '912.598 ATL', days: 3 },
  { title: 'Bahasa Indonesia Kelas XI', call: '499.22 BHS', days: 7 },
  { title: 'Ekonomi Mikro & Makro', call: '330 EKO', days: 14 },
  { title: 'Jaringan Komputer & TCP/IP', call: '004.6 JAR', days: 7 },
];

// Due dates based on today + book.days
const dueDate = (days: number): string => {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
};

export function initLibrary(
  scene: THREE.Scene,
  cleanups: Array<() => void>,
  cbs: PlanCallbacks,
): PlanInit {
  cbs.setLabel('SELF-CHECKOUT MANDIRI');
  const shelfMat = makeShelfMat();
  const bookCols = [0x9a3b2e, 0x2f6da0, 0x4a7a4a, 0xc9923a, 0x6a4a8a, 0xbb5547, 0x3a6a8a, 0x8a6a2a, 0x4a2a6a, 0x2a6a5a];

  // Wood floor
  const woodFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 12),
    new THREE.MeshStandardMaterial({ color: 0x2a1f14, roughness: 0.9 }),
  );
  woodFloor.rotation.x = -Math.PI / 2; woodFloor.position.set(0, 0.015, -1); scene.add(woodFloor);

  // Shelves
  const shelfWall = (z: number, face: number) => {
    const g = new THREE.Group();
    const bk = new THREE.Mesh(new THREE.BoxGeometry(16, 4.6, 0.4), boxMat(0x3a2a1e));
    bk.position.set(0, 2.3, 0); g.add(bk);
    for (let s = 0; s < 3; s++) {
      const sb = new THREE.Mesh(new THREE.BoxGeometry(16, 0.16, 1.1), boxMat(0x4a3320));
      sb.position.set(0, 0.9 + s * 1.45, face * 0.45); g.add(sb);
      for (let i = 0; i < 40; i++) {
        const h = 0.9 + ((i * 7) % 4) * 0.08;
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.34, h, 0.72), boxMat(bookCols[(i + s) % bookCols.length]));
        book.position.set(-7.6 + i * 0.39, 0.9 + s * 1.45 + h / 2 + 0.07, face * 0.45);
        g.add(book);
      }
    }
    g.position.set(0, 0, z); scene.add(g);
  };
  shelfWall(-4.6, 1); shelfWall(4.6, -1);

  // Reading tables
  const tableF = (x: number) => {
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.3), boxMat(0x5a4330));
    top.position.set(x, 0.85, -1); scene.add(top);
    [[-1.0, -0.5], [1.0, -0.5], [-1.0, 0.5], [1.0, 0.5]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.12), boxMat(0x3a2a1e));
      leg.position.set(x + lx, 0.42, -1 + lz); scene.add(leg);
    });
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.36), boxMat(bookCols[(i + Math.round(x)) % bookCols.length]));
      b.position.set(x - 0.6 + i * 0.6, 0.96, -1.2); scene.add(b);
    }
    const sitter = makeHuman(0x4a7a4a, 0x223149);
    sitter.position.set(x, -0.35, 0.1);
    sitter.userData.legL.rotation.x = -1.4; sitter.userData.legR.rotation.x = -1.4;
    scene.add(sitter);
  };
  tableF(-4.5); tableF(0.2);

  // Anti-theft EAS gate — at the RIGHT END of the corridor; patron walks in X direction
  const COL_NEUTRAL = 0x1e3048, COL_GREEN = 0x163a22, COL_RED = 0x3a1616;
  const LT_NEUTRAL = 0x7fc4f0, LT_GREEN = 0x39d98a, LT_RED = 0xff5a5a;
  const gateGrp = new THREE.Group(); gateGrp.position.set(7, 0, 0);
  const pedMatL = new THREE.MeshStandardMaterial({ color: COL_NEUTRAL, roughness: 0.6, metalness: 0.35 });
  const pedMatR = new THREE.MeshStandardMaterial({ color: COL_NEUTRAL, roughness: 0.6, metalness: 0.35 });
  // Pedestals at kiri (z=-2) and kanan (z=+2) — gate spans corridor width in Z
  const pedL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.9, 0.45), pedMatL);
  pedL.position.set(0, 1.45, -2.0); gateGrp.add(pedL);
  const pedR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.9, 0.45), pedMatR);
  pedR.position.set(0, 1.45, 2.0); gateGrp.add(pedR);
  // Top bar spanning Z (across the corridor)
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 4.4), shelfMat);
  topBar.position.set(0, 2.95, 0); gateGrp.add(topBar);

  const ltMatL = new THREE.MeshBasicMaterial({ color: LT_NEUTRAL });
  const ltL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), ltMatL);
  ltL.position.set(0, 3.22, -2.0); gateGrp.add(ltL);
  const ltMatR = new THREE.MeshBasicMaterial({ color: LT_NEUTRAL });
  const ltR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), ltMatR);
  ltR.position.set(0, 3.22, 2.0); gateGrp.add(ltR);

  // Reader panel on left pedestal, facing patron approaching in +X direction
  const rdrMat = new THREE.MeshStandardMaterial({ color: 0x7fc4f0, emissive: 0x3a7fb5, emissiveIntensity: 0.5 });
  const rdrPanel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.13), rdrMat);
  rdrPanel.position.set(0.22, 1.35, -2.0); rdrPanel.rotation.y = Math.PI / 2; gateGrp.add(rdrPanel);

  // Beam in YZ plane — faces X so patron walks through it in X direction
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x7fc4f0, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.8), beamMat);
  beam.position.set(0, 1.5, 0); beam.rotation.y = Math.PI / 2; gateGrp.add(beam);
  scene.add(gateGrp);

  // Self-checkout kiosk — near gate at x=7, facing corridor (toward z=0)
  const kioskBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.5), boxMat(0x1e3048));
  kioskBase.position.set(5.5, 0.55, -3.0); scene.add(kioskBase);
  const kioskScreen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x7fc4f0, emissive: 0x3a6a9a, emissiveIntensity: 0.7 }));
  kioskScreen.position.set(5.5, 1.15, -2.77); scene.add(kioskScreen);
  const kioskPad = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.45),
    new THREE.MeshStandardMaterial({ color: 0x2a4060, roughness: 0.4, metalness: 0.3 }));
  kioskPad.position.set(5.5, 1.12, -2.85); scene.add(kioskPad);

  // Alarm overlay
  const alertDiv = document.createElement('div');
  alertDiv.style.cssText = [
    'position:absolute', 'top:48%', 'left:50%', 'transform:translate(-50%,-50%)',
    'background:rgba(160,20,20,0.96)', 'color:#fff', 'padding:14px 26px',
    'border-radius:4px', 'font-family:"IBM Plex Mono",monospace', 'font-size:14px',
    'font-weight:600', 'letter-spacing:.06em', 'pointer-events:none', 'opacity:0',
    'transition:opacity .25s', 'z-index:20', 'border:1px solid rgba(255,90,90,.6)',
    'white-space:nowrap',
  ].join(';');
  alertDiv.textContent = '🔔 ALARM — Tag masih aktif!';
  cbs.canvas.parentElement?.appendChild(alertDiv);
  cleanups.push(() => { try { alertDiv.remove(); } catch { /* */ } });

  // Patron
  const patron = makeHuman(0xc9923a, 0x223149); scene.add(patron);
  const carried = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.16, 0.5), boxMat(bookCols[i + 1]));
    b.position.y = i * 0.18; carried.add(b);
  }
  const rfidTag = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.02), tagMat());
  rfidTag.position.set(0, 0.18, 0.26); carried.add(rfidTag);
  carried.position.set(0, 1.05, 0.35); patron.add(carried);

  let bookIdx = 0, checkedOut = true;
  let pState = 'walk', pTimer = 0, pFlash = 0, alertTimer = 0;
  // Patron starts at left end, walks in +X direction through the corridor
  patron.position.set(-7, 0, 0); patron.rotation.y = Math.PI / 2;

  const resetGate = () => {
    pedMatL.color.setHex(COL_NEUTRAL); pedMatR.color.setHex(COL_NEUTRAL);
    ltMatL.color.setHex(LT_NEUTRAL); ltMatR.color.setHex(LT_NEUTRAL);
    beamMat.color.setHex(0x7fc4f0); beamMat.opacity = 0.04; rdrMat.emissiveIntensity = 0.5;
  };

  return {
    update: (dt, now) => {
      const sw = Math.sin(now * 0.012) * 0.5;
      alertTimer = Math.max(0, alertTimer - dt);
      alertDiv.style.opacity = alertTimer > 0.4 ? '1' : String(Math.max(0, alertTimer / 0.4).toFixed(2));

      if (pState === 'walk') {
        patron.position.x += dt * 2.3; patron.rotation.y = Math.PI / 2;
        patron.userData.legL.rotation.x = sw; patron.userData.legR.rotation.x = -sw;
        if (patron.position.x >= 6.0) { pState = 'scan'; pTimer = 0; pFlash = 0; }

      } else if (pState === 'scan') {
        pTimer += dt; pFlash = Math.min(1, pTimer * 3.5);
        beamMat.opacity = 0.05 + pFlash * 0.55; rdrMat.emissiveIntensity = 0.5 + pFlash;
        (rfidTag.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7 + pFlash * 1.5;
        patron.userData.legL.rotation.x = 0; patron.userData.legR.rotation.x = 0;
        if (pTimer > 0.55) {
          cbs.incCount();
          const book = BOOKS[bookIdx % BOOKS.length];
          if (checkedOut) {
            pedMatL.color.setHex(COL_GREEN); pedMatR.color.setHex(COL_GREEN);
            ltMatL.color.setHex(LT_GREEN); ltMatR.color.setHex(LT_GREEN);
            beamMat.color.setHex(0x39d98a);
            cbs.logEvent(`✓ CHECKOUT · ${book.call} · "${book.title}" · Kembali: ${dueDate(book.days)}`, '#39d98a');
            bookIdx++; pState = 'pass';
          } else {
            pedMatL.color.setHex(COL_RED); pedMatR.color.setHex(COL_RED);
            ltMatL.color.setHex(LT_RED); ltMatR.color.setHex(LT_RED);
            beamMat.color.setHex(0xff5a5a);
            cbs.logEvent(`🔔 ALARM · ${book.call} · Tag belum dinonaktifkan!`, '#ff5a5a');
            alertDiv.style.opacity = '1'; alertTimer = 2.8; pState = 'reject';
          }
          pTimer = 0;
        }
      } else if (pState === 'pass') {
        patron.position.x += dt * 2.0; patron.rotation.y = Math.PI / 2;
        patron.userData.legL.rotation.x = sw; patron.userData.legR.rotation.x = -sw;
        if (patron.position.x > 14) { pTimer = 0; pState = 'reset'; }

      } else if (pState === 'reject') {
        pTimer += dt;
        if (pTimer > 1.0) {
          patron.position.x -= dt * 2.2; patron.rotation.y = -Math.PI / 2;
          patron.userData.legL.rotation.x = -sw; patron.userData.legR.rotation.x = sw;
        }
        if (patron.position.x < -8.5) { pState = 'reset'; pTimer = 0; }

      } else if (pState === 'reset') {
        pTimer += dt;
        if (pTimer > 0.8) {
          checkedOut = !checkedOut; patron.position.set(-7, 0, 0); patron.rotation.y = Math.PI / 2;
          resetGate(); pState = 'walk'; pTimer = 0; pFlash = 0;
        }
      }
    },
    target: new THREE.Vector3(0, 1.4, 0),
    orbitOpts: { az: 0.4, pol: 0.78, r: 22, auto: 0.0010 },
  };
}
