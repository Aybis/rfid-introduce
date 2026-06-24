import { useState, useEffect, useRef } from 'react';

/**
 * Tracks scroll progress (0–1) of a section element relative to viewport.
 */
export function useProgress(sectionRef: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current; if (!el) return;
      const total = el.offsetHeight - window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / total));
      setProgress(p);
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sectionRef]);

  return progress;
}
