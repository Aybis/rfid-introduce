import * as THREE from 'three';

interface SceneEntry {
  canvas: HTMLCanvasElement;
  renderer?: THREE.WebGLRenderer;
  render: (dt: number, now: number) => void;
  visible: boolean;
  autoVis: boolean;
}

const __scenes: SceneEntry[] = [];
let __loopRunning = false;

export function addScene(
  s: Omit<SceneEntry, 'visible' | 'autoVis'>,
  always = false,
): SceneEntry {
  const entry: SceneEntry = { ...s, visible: !!always, autoVis: !always };
  // Remove existing scene for same canvas
  for (let i = __scenes.length - 1; i >= 0; i--) {
    if (__scenes[i].canvas === s.canvas) {
      try { __scenes[i].renderer?.dispose(); } catch { /* */ }
      __scenes.splice(i, 1);
    }
  }
  __scenes.push(entry);
  startLoop();
  return entry;
}

export function removeScene(canvas: HTMLCanvasElement) {
  for (let i = __scenes.length - 1; i >= 0; i--) {
    if (__scenes[i].canvas === canvas) {
      try { __scenes[i].renderer?.dispose(); } catch { /* */ }
      __scenes.splice(i, 1);
    }
  }
}

function startLoop() {
  if (__loopRunning) return;
  __loopRunning = true;
  let last = performance.now();
  let lastFrame = 0;

  function frame(now: number) {
    let dt = (now - last) / 1000;
    if (!(dt > 0) || dt > 0.05) dt = 0.016;
    last = now;
    lastFrame = now;

    for (let i = __scenes.length - 1; i >= 0; i--) {
      const s = __scenes[i];
      if (!s.canvas || !document.contains(s.canvas)) {
        try { s.renderer?.dispose?.(); } catch { /* */ }
        __scenes.splice(i, 1);
        continue;
      }
      if (s.autoVis) {
        const r = s.canvas.getBoundingClientRect();
        s.visible = r.bottom > -160 && r.top < window.innerHeight + 160 && r.width > 0;
      }
      if (s.visible) {
        try { s.render(dt, now); } catch { /* */ }
      }
    }
  }

  (function raf() { frame(performance.now()); requestAnimationFrame(raf); })();
  setInterval(() => { const n = performance.now(); if (n - lastFrame > 180) frame(n); }, 60);
}
