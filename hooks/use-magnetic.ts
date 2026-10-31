'use client';

import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';

import { MAGNETIC_SPRING, MAGNETIC_STRENGTH } from '@/constants/animation';
import { usePrefersReducedMotion } from '@/hooks/use-media-query';
import { clamp } from '@/utils/math';

export interface MagneticHandlers {
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

export interface UseMagneticResult extends MagneticHandlers {
  /** Spring-smoothed offsets — bind to a `motion` element's `style`. */
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * Magnetic pointer attraction.
 *
 * The element drifts toward the cursor while hovered and springs back on exit.
 * Fully disabled when the user prefers reduced motion, and inert on touch
 * devices (pointer events never fire a hover there).
 */
export function useMagnetic(strength: number = MAGNETIC_STRENGTH): UseMagneticResult {
  const prefersReducedMotion = usePrefersReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, MAGNETIC_SPRING);
  const y = useSpring(rawY, MAGNETIC_SPRING);

  // Avoids re-reading layout on every pointer move for elements that never move.
  const frame = useRef<number | null>(null);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (prefersReducedMotion || event.pointerType === 'touch') return;

      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);

      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        rawX.set(clamp((offsetX / rect.width) * strength * 2, -strength, strength));
        rawY.set(clamp((offsetY / rect.height) * strength * 2, -strength, strength));
      });
    },
    [prefersReducedMotion, rawX, rawY, strength],
  );

  const onPointerLeave = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { x, y, onPointerMove, onPointerLeave };
}
