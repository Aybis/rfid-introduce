import * as THREE from 'three';

export function mkRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  return r;
}

export function fitCamera(
  r: THREE.WebGLRenderer,
  cam: THREE.PerspectiveCamera,
  canvas: HTMLCanvasElement,
) {
  const w = canvas.clientWidth || canvas.parentElement?.clientWidth || 1;
  const h = canvas.clientHeight || canvas.parentElement?.clientHeight || 1;
  if (!w || !h) return;
  r.setSize(w, h, false);
  cam.aspect = w / h;
  cam.updateProjectionMatrix();
}

export function watchSize(
  r: THREE.WebGLRenderer,
  cam: THREE.PerspectiveCamera,
  canvas: HTMLCanvasElement,
  cleanups: Array<() => void>,
) {
  const fit = () => fitCamera(r, cam, canvas);
  const ro = new ResizeObserver(fit);
  ro.observe(canvas);
  setTimeout(fit, 30);
  fit();
  cleanups.push(() => ro.disconnect());
}

export function addLights(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0x88aacc, 0.55));
  const key = new THREE.DirectionalLight(0xffd9a0, 1.05);
  key.position.set(4, 7, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5a9bd6, 0.6);
  rim.position.set(-5, 2, -4);
  scene.add(rim);
}

export function boxMat(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.1 });
}

export function tagMat(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xffb24d, emissive: 0xffb24d, emissiveIntensity: 0.85,
    metalness: 0.4, roughness: 0.3,
  });
}

/** Shared shelf/post material */
export function makeShelfMat(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: 0x16314e, roughness: 0.7, metalness: 0.25 });
}

export function makeOrbit(
  canvas: HTMLCanvasElement,
  cam: THREE.PerspectiveCamera,
  target: THREE.Vector3,
  o: { az: number; pol: number; r: number; auto?: number },
  cleanups: Array<() => void>,
) {
  const st = {
    az: o.az, pol: o.pol, r: o.r,
    down: false, px: 0, py: 0, va: 0, vp: 0,
    auto: o.auto ?? 0.0016,
  };
  const xy = (e: PointerEvent | TouchEvent): [number, number] =>
    'touches' in e
      ? [e.touches[0].clientX, e.touches[0].clientY]
      : [e.clientX, e.clientY];

  const down = (e: PointerEvent) => {
    st.down = true; const p = xy(e); st.px = p[0]; st.py = p[1];
    canvas.style.cursor = 'grabbing';
  };
  const move = (e: PointerEvent) => {
    if (!st.down) return;
    const p = xy(e); const dx = p[0] - st.px, dy = p[1] - st.py;
    st.px = p[0]; st.py = p[1];
    st.az -= dx * 0.006; st.pol -= dy * 0.005;
    st.va = -dx * 0.006; st.vp = -dy * 0.005;
  };
  const up = () => { st.down = false; canvas.style.cursor = 'grab'; };

  const wheel = (e: WheelEvent) => {
    e.preventDefault();
    st.r = Math.max(4, Math.min(120, st.r + e.deltaY * 0.04));
  };

  canvas.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  canvas.addEventListener('wheel', wheel, { passive: false });
  cleanups.push(() => {
    canvas.removeEventListener('pointerdown', down);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    canvas.removeEventListener('wheel', wheel);
  });

  return {
    apply() {
      if (!st.down) { st.az += st.auto + st.va; st.va *= 0.92; st.pol += st.vp; st.vp *= 0.9; }
      st.pol = Math.max(0.25, Math.min(1.45, st.pol));
      cam.position.set(
        target.x + st.r * Math.sin(st.pol) * Math.sin(st.az),
        target.y + st.r * Math.cos(st.pol),
        target.z + st.r * Math.sin(st.pol) * Math.cos(st.az),
      );
      cam.lookAt(target);
    },
  };
}

export function makeHuman(shirt: number, pants: number): THREE.Group & {
  userData: { legL: THREE.Mesh; legR: THREE.Mesh; armL: THREE.Mesh; armR: THREE.Mesh };
} {
  const g = new THREE.Group() as THREE.Group & { userData: { legL: THREE.Mesh; legR: THREE.Mesh; armL: THREE.Mesh; armR: THREE.Mesh } };
  const skin = 0xd8a878;
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.62, 0.3), boxMat(shirt));
  torso.position.y = 1.12; g.add(torso);
  const hip = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.4, 0.3), boxMat(pants));
  hip.position.y = 0.7; g.add(hip);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.32, 0.3), boxMat(skin));
  head.position.y = 1.62; g.add(head);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.62, 0.2), boxMat(pants));
  legL.position.set(-0.13, 0.31, 0); g.add(legL);
  const legR = legL.clone() as THREE.Mesh; legR.position.x = 0.13; g.add(legR);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.16), boxMat(shirt));
  armL.position.set(-0.32, 1.12, 0); g.add(armL);
  const armR = armL.clone() as THREE.Mesh; armR.position.x = 0.32; g.add(armR);
  g.userData = { legL, legR, armL, armR };
  return g;
}

export function makeCar(color: number): THREE.Group & { userData: { tag: THREE.Mesh } } {
  const c = new THREE.Group() as THREE.Group & { userData: { tag: THREE.Mesh } };
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 1.3), boxMat(color));
  body.position.y = 0.62; c.add(body);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.62, 1.2), boxMat(color));
  cab.position.set(-0.1, 1.18, 0); c.add(cab);
  const wind = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x0a1622, metalness: 0.6, roughness: 0.2 }));
  wind.position.set(0.56, 1.2, 0); c.add(wind);
  [[-0.75, 0.7], [0.75, 0.7], [-0.75, -0.7], [0.75, -0.7]].forEach(([x, z]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 14),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a }));
    w.rotation.x = Math.PI / 2; w.position.set(x, 0.3, z); c.add(w);
  });
  const wsd = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.4), tagMat());
  wsd.position.set(0.56, 1.18, 0); c.add(wsd);
  c.userData = { tag: wsd };
  return c;
}

export function makePortal(
  z0: number, z1: number, h: number, col: number, scene: THREE.Scene,
  shelfMat: THREE.MeshStandardMaterial,
): { grp: THREE.Group; beam: THREE.Mesh } {
  const grp = new THREE.Group();
  [z0, z1].forEach(z => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, h, 0.2), shelfMat);
    post.position.set(0, h / 2, z); grp.add(post);
  });
  const bar = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.22, Math.abs(z1 - z0) + 0.4), shelfMat);
  bar.position.set(0, h, (z0 + z1) / 2); grp.add(bar);
  const beam = new THREE.Mesh(
    new THREE.PlaneGeometry(Math.abs(z1 - z0), h * 0.92),
    new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.07, side: THREE.DoubleSide }));
  beam.rotation.y = Math.PI / 2;
  beam.position.set(0, h * 0.5, (z0 + z1) / 2); grp.add(beam);
  scene.add(grp);
  return { grp, beam };
}
