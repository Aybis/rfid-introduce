import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArrowRight } from '@phosphor-icons/react';

interface Props {
  onEnter: () => void;
}

const CW = 300, CH = 200;

function buildScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(CW, CH);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, CW / CH, 0.1, 100);
  camera.position.set(4.0, 2.8, 4.8);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0x223149, 3));
  const kl = new THREE.DirectionalLight(0xffb24d, 4); kl.position.set(3, 5, 3); scene.add(kl);
  const bl = new THREE.DirectionalLight(0x7fc4f0, 2); bl.position.set(-3, 1, -2); scene.add(bl);

  const mat = (c: number, rough = 0.4, metal = 0.35) =>
    new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: metal });

  // ── Handheld RFID reader ────────────────────────────────────────────────
  const rdr = new THREE.Group();

  // Body (flat scanner head)
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 2.0), mat(0x1a3550));
  body.position.y = 0; rdr.add(body);

  // Antenna pad (front, slightly raised)
  const ant = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.10, 0.85), mat(0x0e2236));
  ant.position.set(0, 0.26, 0.6); rdr.add(ant);

  // Screen glow
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x7fc4f0, emissive: 0x3a7fb5, emissiveIntensity: 0.9,
  });
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.06, 0.65), screenMat);
  screen.position.set(0, 0.24, -0.42); rdr.add(screen);

  // Screen content lines
  for (let i = 0; i < 3; i++) {
    const ln = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.03, 0.06),
      new THREE.MeshBasicMaterial({ color: 0xffffff }));
    ln.position.set(0, 0.31, -0.56 + i * 0.13); rdr.add(ln);
  }

  // Status LED
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xffb24d });
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), ledMat);
  led.position.set(0.58, 0.27, -0.78); rdr.add(led);

  // Grip handle
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.1, 0.52), mat(0x0e2236));
  grip.position.set(0, -0.78, 0.15); rdr.add(grip);

  // Trigger button
  const trig = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.22), mat(0xc9923a));
  trig.position.set(0.3, -0.28, 0.36); rdr.add(trig);

  // Scan beam plane (flashes when tag is near)
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffb24d, transparent: true, opacity: 0, side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.85), beamMat);
  beam.rotation.x = Math.PI / 2; beam.position.set(0, 0.32, 0.6); rdr.add(beam);

  rdr.rotation.x = 0.25;
  scene.add(rdr);

  // ── RFID Tag (credit card) ───────────────────────────────────────────────
  const tagGrp = new THREE.Group();

  const tagMat = new THREE.MeshStandardMaterial({ color: 0x2f6da0, roughness: 0.3, metalness: 0.5 });
  const tagBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.58), tagMat);
  tagGrp.add(tagBody);

  const chipMat = mat(0xc9923a, 0.3, 0.7);
  const chip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.14), chipMat);
  chip.position.set(-0.22, 0.04, 0.05); tagGrp.add(chip);

  // Antenna coil (simplified wireframe rectangle)
  const coilMat = new THREE.MeshBasicMaterial({ color: 0xc9923a, wireframe: true });
  const coil = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.02, 0.46), coilMat);
  coil.position.y = 0.04; tagGrp.add(coil);

  // Tag RFID label
  const labelMat = new THREE.MeshStandardMaterial({
    color: 0xffb24d, emissive: 0xffb24d, emissiveIntensity: 0.6,
  });
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.1), labelMat);
  label.position.set(0.22, 0.04, -0.15); tagGrp.add(label);

  scene.add(tagGrp);

  // ── Animate ─────────────────────────────────────────────────────────────
  let t = 0, raf = 0;

  const tick = () => {
    t += 0.016;

    // Reader gentle sway
    rdr.rotation.y = Math.sin(t * 0.45) * 0.4;

    // Tag orbit ellipse around reader
    const angle = t * 0.7;
    tagGrp.position.set(
      Math.cos(angle) * 2.0,
      0.7 + Math.sin(angle * 0.6) * 0.35,
      Math.sin(angle) * 1.3,
    );
    tagGrp.rotation.y = -angle;
    tagGrp.rotation.x = Math.sin(angle * 0.4) * 0.2;

    // Proximity to antenna pad
    const antWorld = new THREE.Vector3(0, 0.32, 0.6).applyMatrix4(rdr.matrixWorld);
    const dist = tagGrp.position.distanceTo(antWorld);
    const prox = Math.max(0, 1 - dist / 0.95);

    beamMat.opacity = prox * 0.6;
    ledMat.color.setHex(prox > 0.25 ? 0x39d98a : 0xffb24d);
    screenMat.emissiveIntensity = 0.9 + prox * 2.0;
    labelMat.emissiveIntensity = 0.6 + prox * 2.0;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => { cancelAnimationFrame(raf); renderer.dispose(); };
}

export function SplashScreen({ onEnter }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchY = useRef(0);
  const entered = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    return buildScene(canvasRef.current);
  }, []);

  const trigger = () => {
    if (entered.current) return;
    entered.current = true;
    onEnter();
  };

  return (
    <div
      id="splash"
      onWheel={trigger}
      onTouchStart={e => { touchY.current = e.touches[0].clientY; }}
      onTouchMove={e => { if (touchY.current - e.touches[0].clientY > 40) trigger(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: '#050f1c',
        backgroundImage: 'radial-gradient(120% 90% at 50% 30%,rgba(255,178,77,.10),transparent 55%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 14, textAlign: 'center', padding: 24,
        cursor: 'default',
      }}
    >
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{ borderRadius: 10, marginBottom: 4 }}
      />
      <div style={{
        fontFamily: "'Space Grotesk',sans-serif",
        fontSize: 'clamp(26px,5vw,46px)', fontWeight: 700,
        color: '#fff', letterSpacing: '-.02em', lineHeight: 1.1,
      }}>
        Bagaimana RFID<br />bekerja?
      </div>
      <p style={{ fontSize: 15, color: '#7fa9c9', maxWidth: 340, lineHeight: 1.65, margin: 0 }}>
        Pelajari teknologi di balik tap kartu, palang tol, dan lacak ribuan barang — semuanya tanpa kontak.
      </p>
      <button
        onClick={trigger}
        style={{
          marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 10,
          background: '#ffb24d', color: '#071423', fontWeight: 600,
          fontSize: 13, letterSpacing: '.12em', padding: '15px 28px',
          border: 'none', borderRadius: 2, cursor: 'pointer',
        }}
      >
        MASUK <ArrowRight size={16} weight="bold" />
      </button>
      <div style={{
        position: 'absolute', bottom: 24,
        fontSize: 10, color: '#2a4a6a', letterSpacing: '.14em',
        animation: 'splashmark 2s ease-in-out infinite alternate',
      }}>
        SCROLL UNTUK MASUK ↓
      </div>
    </div>
  );
}
