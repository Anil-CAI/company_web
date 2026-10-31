'use client';

import { useRef } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { usePrefersReducedMotion } from '@/hooks/use-media-query';
import { gsap } from '@/lib/gsap';

interface UseParallaxOptions {
  /** Total travel in percent of the element height. Negative moves up. */
  distance?: number;
  /** Disable on small screens where the effect reads as jitter. */
  enabled?: boolean;
}

/**
 * Scrub-linked vertical parallax for media inside a fixed-ratio frame.
 * The inner element is intentionally oversized by the consumer (scale-110) so
 * the travel never exposes an edge.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>({
  distance = 12,
  enabled = true,
}: UseParallaxOptions = {}) {
  const ref = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || !enabled || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { yPercent: -distance / 2 },
        {
          yPercent: distance / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: element.parentElement ?? element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, element);

    return () => context.revert();
  }, [distance, enabled, prefersReducedMotion]);

  return ref;
}
