'use client';

import type Lenis from 'lenis';
import { createContext, useCallback, useContext } from 'react';

/** Populated by `SmoothScrollProvider`. Null until Lenis has initialised. */
export const LenisContext = createContext<Lenis | null>(null);

/** Access the shared Lenis instance (null on first render / reduced motion). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Scroll to an element or offset through Lenis, with a native fallback so
 * anchors keep working before Lenis mounts or when motion is reduced.
 */
export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (target: string | number | HTMLElement, offset = 0) => {
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
        return;
      }

      if (typeof target === 'number') {
        window.scrollTo({ top: target + offset, behavior: 'smooth' });
        return;
      }

      const element =
        typeof target === 'string' ? document.querySelector(target) : target;

      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [lenis],
  );
}
