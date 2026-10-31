'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { DURATION, EASE_PREMIUM } from '@/constants/animation';
import { usePrefersReducedMotion } from '@/hooks/use-media-query';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Cross-fade between routes.
 *
 * Keyed on the pathname so each navigation mounts a fresh subtree and the old
 * one fades out under it. The movement is small on purpose — a few pixels of
 * rise rather than a slide — because a long travel on a route change reads as
 * the page being rebuilt rather than turned.
 *
 * `mode="wait"` is deliberately *not* used: waiting for the exit to finish
 * before the entrance begins doubles the perceived latency of every click. The
 * two overlap instead, so a navigation feels immediate.
 *
 * Reduced-motion visitors get the children rendered directly, with no
 * `AnimatePresence` in the tree at all — an opacity animation that starts at 0
 * is still a flash even at 0.01ms, and the safest version is no animation.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div data-page-transition="static">{children}</div>;
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        data-page-transition="animated"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        /* The exit is quicker than the entrance so the two pages do not
           visibly stack during the overlap. */
        exit={{ opacity: 0, transition: { duration: DURATION.fast, ease: EASE_PREMIUM } }}
        transition={{ duration: DURATION.base, ease: EASE_PREMIUM }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
