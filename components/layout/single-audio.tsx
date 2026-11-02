'use client';

import * as React from 'react';

/**
 * Only one video plays with sound at a time.
 *
 * The featured projects each carry their own clip, and pressing play on a
 * second one used to leave the first talking over it. A single capture-phase
 * `play` listener on the document sees every <video> on the site — project
 * cards, the dance shelf, anything added later — and pauses whichever other
 * video is audible. Muted ambient loops are left running.
 */
export function SingleAudio() {
  React.useEffect(() => {
    const onPlay = (event: Event) => {
      const started = event.target;
      if (!(started instanceof HTMLVideoElement) || started.muted) return;
      document.querySelectorAll('video').forEach((video) => {
        if (video !== started && !video.paused && !video.muted) video.pause();
      });
    };
    /* `play` does not bubble, so it is caught on the way down. */
    document.addEventListener('play', onPlay, true);
    return () => document.removeEventListener('play', onPlay, true);
  }, []);

  return null;
}
