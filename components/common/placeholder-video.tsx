import { Play } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import type { MediaRatio, VideoMedia } from '@/types/media';
import { RATIO_CLASS, hasVideo } from '@/utils/media';

interface PlaceholderVideoProps {
  media: VideoMedia;
  ratio?: MediaRatio;
  className?: string;
  /** Autoplay muted loop — the usual treatment for background showreels. */
  ambient?: boolean;
  /** Hide the caption for small frames. */
  compact?: boolean;
}

/**
 * Video slot.
 *
 * Empty `src` renders a bordered placeholder with a play affordance, matching
 * the exact frame the real clip will occupy. Set `src` to a file under
 * `/public/videos` to activate playback — controls appear automatically unless
 * `ambient` is set.
 */
export function PlaceholderVideo({
  media,
  ratio = 'video',
  className,
  ambient = false,
  compact = false,
}: PlaceholderVideoProps) {
  return (
    <div
      className={cn(
        'relative isolate w-full overflow-hidden rounded-2xl border border-border bg-muted',
        RATIO_CLASS[ratio],
        className,
      )}
    >
      {hasVideo(media) ? (
        <video
          className="absolute inset-0 size-full object-cover"
          src={media.src}
          poster={media.poster || undefined}
          aria-label={media.label}
          controls={!ambient}
          autoPlay={ambient}
          muted={ambient}
          loop={ambient}
          playsInline
          /*
            `none`, not `metadata`.

            With `metadata` the browser opens a connection and pulls the header
            of every clip on the page the moment it loads — six requests against
            52 MB of footage before the visitor has pressed anything. Every clip
            here ships a poster frame, so there is nothing for that fetch to
            provide that the poster does not already show. The video is fetched
            when someone actually presses play.
          */
          preload={ambient ? 'metadata' : 'none'}
        />
      ) : (
        <div
          className="placeholder-draft absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
          role="img"
          aria-label={`${media.label} — video placeholder`}
        >
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-full border border-border bg-background/80 shadow-soft"
          >
            <Play className="ml-0.5 size-4 text-ink-500" strokeWidth={1.5} />
          </span>
          {!compact && (
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-500">
              Video placeholder
            </p>
          )}
        </div>
      )}
    </div>
  );
}
