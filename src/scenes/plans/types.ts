import * as THREE from 'three';

export interface PlanCallbacks {
  logEvent: (text: string, color?: string) => void;
  incCount: () => void;
  resetCount: () => void;
  clearLog: () => void;
  setLabel: (text: string) => void;
  canvas: HTMLCanvasElement;
}

export interface OrbitOpts {
  az: number;
  pol: number;
  r: number;
  auto?: number;
}

export interface PlanInit {
  update: (dt: number, now: number) => void;
  target: THREE.Vector3;
  orbitOpts: OrbitOpts;
}
