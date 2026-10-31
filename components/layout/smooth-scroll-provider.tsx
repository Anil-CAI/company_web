'use client';

import Lenis from 'lenis';
import * as React from 'react';

import { LENIS_OPTIONS } from '@/constants/animation';
import { LenisContext } from '@/hooks/use-lenis';
import { usePrefersReducedMotion } from '@/hooks/use-media-query';
import { ScrollTrigger, gsap } from '@/lib/gsap';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Lenis smooth scrolling.
 *
 * Lenis is driven by the GSAP ticker rather than its own rAF loop, so scroll
 * position, ScrollTrigger and every scrubbed animation advance on the same
 * frame — without this they drift and parallax visibly lags.
 *
 * Users who prefer reduced motion never get an instance: the context stays
 * null, native scrolling takes over and every consumer falls back gracefully.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenis, setLenis] = React.useState<Lenis | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const instance = new Lenis(LENIS_OPTIONS);
    setLenis(instance);

    // GSAP's ticker reports seconds; Lenis expects milliseconds.
    const update = (time: number) => instance.raf(time * 1000);

    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
