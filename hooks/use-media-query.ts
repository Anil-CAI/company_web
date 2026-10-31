'use client';

import { useEffect, useState } from 'react';

import { REDUCED_MOTION_QUERY, down, up, type BreakpointKey } from '@/constants/breakpoints';

/**
 * Subscribe to a CSS media query.
 * Returns `false` during SSR and on the first client render, then syncs — so
 * markup is always deterministic and hydration-safe.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    };

    handleChange(mediaQueryList);
    mediaQueryList.addEventListener('change', handleChange);

    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

/** True at or above the given breakpoint. */
export function useBreakpointUp(key: BreakpointKey): boolean {
  return useMediaQuery(up(key));
}

/** True below the given breakpoint. */
export function useBreakpointDown(key: BreakpointKey): boolean {
  return useMediaQuery(down(key));
}

/** True when the user asked the OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}
