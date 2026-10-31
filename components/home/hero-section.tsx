import * as React from 'react';

import { HeroLight } from '@/components/home/hero-light';
import { SECTION_IDS } from '@/constants/routes';

/**
 * Hero — the KRL light wordmark, full screen. See `hero-light.tsx`.
 *
 * Black, keeping the design's own colours rather than the site palette: the
 * photo's ground is black, and the copy sits in that black above the L. The
 * fixed header floats over it transparent.
 */
export function HeroSection() {
  return (
    <section id={SECTION_IDS.hero} aria-label="Introduction" className="relative isolate w-full">
      <HeroLight />
    </section>
  );
}
