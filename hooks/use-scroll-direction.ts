'use client';

import { useEffect, useRef, useState } from 'react';

/** Threshold (px) below which the header always stays visible. */
const TOP_THRESHOLD = 24;

/** Minimum delta (px) before a direction flip registers — kills jitter. */
const DELTA_THRESHOLD = 8;

export interface ScrollDirectionState {
  /** Last committed scroll direction. */
  direction: 'up' | 'down';
  /** True while the page is scrolled past `TOP_THRESHOLD`. */
  isScrolled: boolean;
  /** True at the very top of the document. */
  isAtTop: boolean;
}

/**
 * Track scroll direction with hysteresis.
 * Drives the sticky header's hide/reveal and its border state.
 */
export function useScrollDirection(): ScrollDirectionState {
  const [state, setState] = useState<ScrollDirectionState>({
    direction: 'up',
    isScrolled: false,
    isAtTop: true,
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const update = () => {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - lastScrollY.current;

      setState((previous) => {
        const direction =
          Math.abs(delta) < DELTA_THRESHOLD
            ? previous.direction
            : delta > 0
              ? 'down'
              : 'up';

        const isScrolled = currentY > TOP_THRESHOLD;
        const isAtTop = currentY <= 2;

        if (
          direction === previous.direction &&
          isScrolled === previous.isScrolled &&
          isAtTop === previous.isAtTop
        ) {
          return previous;
        }

        return { direction, isScrolled, isAtTop };
      });

      if (Math.abs(delta) >= DELTA_THRESHOLD) {
        lastScrollY.current = currentY;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return state;
}
