import * as React from 'react';

import { MARQUEE_DURATION_SECONDS } from '@/constants/animation';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: React.ReactNode;
  /** Seconds for one full cycle. Longer = slower. */
  durationSeconds?: number;
  /** Travel right instead of left. */
  reverse?: boolean;
  /** Freeze while the pointer is over the track. */
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Infinite horizontal marquee.
 *
 * The track holds two identical copies of the content and translates by -50%,
 * so the loop is seamless. CSS-driven rather than JS, which means it costs
 * nothing on the main thread and stops dead under `prefers-reduced-motion`.
 * The duplicate is `aria-hidden`, so assistive tech reads the list once.
 */
export function Marquee({
  children,
  durationSeconds = MARQUEE_DURATION_SECONDS,
  reverse = false,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div className={cn('group/marquee mask-fade-x relative w-full overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max animate-marquee items-center',
          reverse && '[animation-direction:reverse]',
          pauseOnHover && 'group-hover/marquee:[animation-play-state:paused]',
        )}
        style={{ '--marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
