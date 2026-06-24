import * as THREE from 'three';
import { addScene, removeScene } from '../loop';
import { mkRenderer, watchSize, addLights, makeOrbit } from '../helpers';
import { initWarehouse } from './warehouse';
import { initToll } from './toll';
import { initLogistics } from './logistics';
import { initLibrary } from './library';
import { initLivestock } from './livestock';
import { initGate } from './gate';
import type { PlanCallbacks } from './types';
import type { PlanKey } from '../../constants';

export type { PlanCallbacks };

export interface PlanHandle {
  dispose: () => void;
}

export function startPlan(
  plan: PlanKey,
  canvas: HTMLCanvasElement,
  cbs: PlanCallbacks,
): PlanHandle {
  const cleanups: Array<() => void> = [];
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  addLights(scene);

  // Point light
  const pt = new THREE.PointLight(0xffb24d, 0.5, 40);
  pt.position.set(0, 6, 2); scene.add(pt);

  // Floor + grid
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0x081726, roughness: 0.95, metalness: 0.05 }),
  );
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const grid = new THREE.GridHelper(40, 40, 0x2f6da0, 0x16314a);
  grid.position.y = 0.01; scene.add(grid);

  // Reset count + log
  cbs.resetCount(); cbs.clearLog();

  // Build plan content
  const builders: Record<PlanKey, typeof initWarehouse> = {
    warehouse: initWarehouse,
    toll: initToll,
    logistics: initLogistics as typeof initWarehouse,
    library: initLibrary as typeof initWarehouse,
    livestock: initLivestock as typeof initWarehouse,
    gate: initGate as typeof initWarehouse,
  };
  const { update, target, orbitOpts } = builders[plan](scene, cleanups, cbs);

  const r = mkRenderer(canvas);
  const orbit = makeOrbit(canvas, cam, target, orbitOpts, cleanups);
  watchSize(r, cam, canvas, cleanups);

  addScene({
    canvas,
    renderer: r,
    render: (dt, now) => { update(dt, now); orbit.apply(); r.render(scene, cam); },
  }, true /* always render */);

  const dispose = () => {
    removeScene(canvas);
    cleanups.forEach(fn => { try { fn(); } catch (e) { /* */ } });
    try { r.dispose(); r.forceContextLoss(); } catch (e) { /* */ }
  };

  return { dispose };
}
