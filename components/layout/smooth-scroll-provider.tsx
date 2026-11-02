'use client';

import { MotionConfig } from 'framer-motion';
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

  /*
   * Keep every ScrollTrigger measured against the page as it really is.
   *
   * Triggers record their start/end once, when created. Content above them
   * keeps settling afterwards — the dance shelf's WebGL, video metadata, late
   * images, fonts — so a section further down would fire at a stale position
   * and sit blank in view (the Domains wall did, intermittently, depending on
   * what finished loading first). Re-measure whenever the document height
   * actually changes; the debounce and height check stop a refresh from
   * re-triggering itself. Runs with or without Lenis, since native scrolling
   * has the same problem.
   */
  React.useEffect(() => {
    let lastHeight = document.documentElement.scrollHeight;
    let timer = 0;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const height = document.documentElement.scrollHeight;
        if (Math.abs(height - lastHeight) < 2) return;
        lastHeight = height;
        ScrollTrigger.refresh();
      }, 200);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  /*
   * `reducedMotion="user"` makes every Framer Motion reveal on the site honour
   * the visitor's reduced-motion setting: opacity still fades, but nothing
   * slides or scales. Without it the reveals ignored the setting entirely —
   * the CSS rule in globals.css only reaches CSS animations.
   */
  return (
    <MotionConfig reducedMotion="user">
      <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
    </MotionConfig>
  );
}
