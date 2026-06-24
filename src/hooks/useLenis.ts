import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

let _lenis: Lenis | null = null;

export function getLenis(): Lenis | null { return _lenis; }

export function useLenis(): Lenis | null {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.065, smoothWheel: true });
    _lenis = lenis;
    let raf: number;
    function tick(time: number) { lenis.raf(time); raf = requestAnimationFrame(tick); }
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); _lenis = null; };
  }, []);
  return _lenis;
}
