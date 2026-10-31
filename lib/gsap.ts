'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAP bootstrap.
 *
 * GSAP is used sparingly — only for scroll-linked work Framer Motion handles
 * awkwardly: number count-ups, timeline line draws and media parallax.
 * Registration is idempotent and browser-only.
 */
if (typeof window !== 'undefined') {
  // `registerPlugin` is idempotent — repeat calls are a no-op.
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
