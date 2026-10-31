import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';
import type { ImageMedia, MediaRatio } from '@/types/media';
import { RATIO_CLASS, hasImage } from '@/utils/media';

interface PlaceholderImageProps {
  media: ImageMedia;
  ratio?: MediaRatio;
  className?: string;
  /** Classes applied to the `<img>` / placeholder body, not the frame. */
  innerClassName?: string;
  /** Caption shown inside the empty state. Defaults to the alt text. */
  label?: string;
  /** Hint text under the caption, e.g. "1600 × 1000". */
  hint?: string;
  /** Passed to `next/image` for above-the-fold media. */
  priority?: boolean;
  /** Responsive `sizes` attribute. */
  sizes?: string;
  /** Hide the caption for small tiles where it would crowd the frame. */
  compact?: boolean;
}

/**
 * Image slot.
 *
 * Renders a real `next/image` when `media.src` is set, and a bordered
 * placeholder frame when it is empty — so every media position on the site is
 * already laid out at its final size. Filling in `src` is the only change
 * needed to go live.
 */
export function PlaceholderImage({
  media,
  ratio = 'video',
  className,
  innerClassName,
  label,
  hint,
  priority = false,
  sizes = '(min-width: 1280px) 50vw, (min-width: 768px) 70vw, 100vw',
  compact = false,
}: PlaceholderImageProps) {
  const caption = label ?? media.alt;

  return (
    <div
      className={cn(
        'relative isolate w-full overflow-hidden rounded-2xl border border-border bg-muted',
        RATIO_CLASS[ratio],
        className,
      )}
    >
      {hasImage(media) ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn('object-cover', innerClassName)}
        />
      ) : (
        <div
          className={cn(
            'placeholder-draft absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center',
            innerClassName,
          )}
          role="img"
          aria-label={`${caption} — image placeholder`}
        >
          <ImageIcon aria-hidden="true" className="size-6 text-ink-400" strokeWidth={1.25} />
          {!compact && (
            <div className="space-y-1">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-500">
                Image placeholder
              </p>
              {hint ? <p className="text-xs text-ink-400">{hint}</p> : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
