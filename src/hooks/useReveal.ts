import { useEffect, useRef } from 'react';

/**
 * Observes an element and adds `data-visible="true"` when it enters the viewport.
 * Returns the ref to attach to the element.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.dataset.visible = 'true'; obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}
