'use client';

import * as React from 'react';

import { VIDEO_AUTOPLAY } from '@/constants/animation';

interface InViewAutoplayProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Plays a project's clip when the visitor stops on it.
 *
 * Starts once the clip is mostly on screen and has stayed there briefly (or,
 * on a pointer device, on hover); pauses only when it has mostly left the
 * screen. The gap between the two thresholds is what stops a slight scroll
 * from toggling it. Starting one pauses every other project clip, so only one
 * plays at a time.
 *
 * Sound is attempted first; browsers refuse audible autoplay until the
 * visitor has tapped the page, in which case it starts muted and the native
 * controls can unmute it. Reduced-motion visitors get no autoplay at all.
 */
export function InViewAutoplay({ children, className }: InViewAutoplayProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = ref.current;
    const video = root?.querySelector('video');
    if (!root || !video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let dwell = 0;
    /* A pause the visitor made sticks until the clip has left the screen. */
    let held = false;
    let pausingOurselves = false;
    const pause = () => {
      pausingOurselves = true;
      video.pause();
      pausingOurselves = false;
    };
    const onPause = () => {
      if (!pausingOurselves) held = true;
    };
    video.addEventListener('pause', onPause);

    const start = () => {
      document
        .querySelectorAll<HTMLVideoElement>('[data-inview-autoplay] video')
        .forEach((other) => {
          if (other !== video && !other.paused) other.pause();
        });
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        void video.play().catch(() => {});
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(dwell);
        /* A tall clip on a short screen can never reach the ratio, so half the
           viewport's height in view also counts as "stopped on it". */
        const enough =
          entry.intersectionRatio >= VIDEO_AUTOPLAY.playRatio ||
          entry.intersectionRect.height >= window.innerHeight * 0.5;
        if (enough) {
          if (video.paused && !held) dwell = window.setTimeout(start, VIDEO_AUTOPLAY.dwellMs);
        } else if (entry.intersectionRatio < VIDEO_AUTOPLAY.pauseRatio) {
          held = false;
          if (!video.paused) pause();
        }
      },
      { threshold: [0, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 1] },
    );
    observer.observe(video);

    const hover = window.matchMedia('(hover: hover)').matches;
    const onEnter = () => {
      window.clearTimeout(dwell);
      if (video.paused) start();
    };
    if (hover) root.addEventListener('pointerenter', onEnter);

    return () => {
      observer.disconnect();
      window.clearTimeout(dwell);
      root.removeEventListener('pointerenter', onEnter);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  return (
    <div ref={ref} data-inview-autoplay="" className={className}>
      {children}
    </div>
  );
}
