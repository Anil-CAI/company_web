'use client';

import * as React from 'react';

import { company } from '@/data/company';
import { usePrefersReducedMotion } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

/**
 * First-paint boot screen.
 *
 * Black field, the KRL mark drawing itself on, a progress bar beneath. It
 * covers the page while the heavy above-the-fold assets decode, so the first
 * thing a visitor sees is a finished page rather than a hero that pops in and a
 * shader that stutters on its first frame.
 *
 * The logo is drawn rather than faded: each letter is a stroked path with
 * `stroke-dasharray` equal to its own length and the offset animated to zero,
 * which is what makes it look written rather than revealed. The paths are
 * single strokes for exactly this reason — a filled logo has nothing to draw.
 *
 * It waits on *real* work, not a timer: every image in `PRELOAD` is fetched and
 * decoded and the bar tracks how many have finished. A fixed delay would be
 * dishonest — too short on a slow connection, pure waste on a fast one.
 *
 * Four guards, because a splash that fails to lift is far worse than no splash:
 *
 * - A hard ceiling. If an asset stalls, the page is revealed anyway.
 * - A failed image counts as settled, so one 404 cannot hold the screen.
 * - A floor. On a warm cache every asset settles in a few milliseconds, which
 *   made an earlier version flash past faster than the eye could register.
 * - It runs on every full page load. A `sessionStorage` flag made it invisible
 *   on reloads of the same tab, which is how it went unnoticed entirely.
 */

/** Above-the-fold assets worth waiting for. Video posters gate the clips. */
const PRELOAD = ['/images/krl-hero-light.jpg'] as const;

/** Never hold the page longer than this, whatever the network is doing. */
const MAX_WAIT_MS = 4500;

/** Hold at least this long, so the draw animation can actually be seen. */
const MIN_SHOW_MS = 1900;

export function BootScreen() {
  const prefersReducedMotion = usePrefersReducedMotion();

  /*
   * Starts null so the server and the first client render agree: rendering the
   * overlay during SSR and then removing it would be a hydration mismatch.
   */
  const [active, setActive] = React.useState<boolean | null>(null);
  const [loaded, setLoaded] = React.useState(0);
  const [leaving, setLeaving] = React.useState(false);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setActive(false);
      return;
    }

    setActive(true);
    const startedAt = Date.now();

    let settled = 0;
    let done = false;
    let holdTimer = 0;
    let exitTimer = 0;

    const reveal = () => {
      /* Fade the cover out before unmounting, so the page does not snap in. */
      setLeaving(true);
      exitTimer = window.setTimeout(() => setActive(false), 620);
    };

    const finish = () => {
      if (done) return;
      done = true;
      /* Serve out the remainder of the floor before revealing. */
      holdTimer = window.setTimeout(reveal, Math.max(0, MIN_SHOW_MS - (Date.now() - startedAt)));
    };

    const onSettle = () => {
      settled += 1;
      setLoaded(settled);
      if (settled >= PRELOAD.length) finish();
    };

    PRELOAD.forEach((src) => {
      const img = new window.Image();
      /* `error` settles too: a missing asset must not strand the screen. */
      img.onload = onSettle;
      img.onerror = onSettle;
      img.src = src;
    });

    const ceiling = window.setTimeout(finish, MAX_WAIT_MS);

    return () => {
      window.clearTimeout(ceiling);
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
    };
  }, [prefersReducedMotion]);

  if (!active) return null;

  const progress = Math.round((loaded / PRELOAD.length) * 100);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={cn(
        'fixed inset-0 z-[200] flex flex-col items-center justify-center gap-12',
        'bg-[#0B0809] transition-opacity duration-500 ease-premium',
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
    >
      {/*
        The mark, drawn on. Stroked letterforms rather than the raster logo:
        a bitmap has no path to animate along.
      */}
      <svg
        viewBox="0 0 240 92"
        aria-hidden="true"
        className="boot-mark w-[min(46vw,280px)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: '#F4F8FE' }}
      >
        {/* K */}
        <path className="boot-stroke" pathLength={1} d="M26 14 V78" />
        <path className="boot-stroke" pathLength={1} d="M26 48 L62 14" />
        <path className="boot-stroke" pathLength={1} d="M26 48 L64 78" />
        {/* R */}
        <path className="boot-stroke" pathLength={1} d="M94 78 V14 H120 a17 17 0 0 1 0 34 H94" />
        <path className="boot-stroke" pathLength={1} d="M114 48 L136 78" />
        {/* L */}
        <path className="boot-stroke" pathLength={1} d="M168 14 V78 H210" />
      </svg>

      <div className="flex flex-col items-center gap-5">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.42em] text-[#C9B9A0]">
          {company.legalName}
        </p>

        {/* A real measure of work done, not a looping indeterminate bar. */}
        <div className="h-px w-44 overflow-hidden bg-[#2E2622]">
          <div
            className="h-full bg-[#F4F8FE] transition-[width] duration-500 ease-premium"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
