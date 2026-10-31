import * as React from 'react';

import { getIcon, type IconName } from '@/lib/icons';
import { cn } from '@/lib/utils';

type IconTileSize = 'sm' | 'md' | 'lg';

const TILE_SIZE: Record<IconTileSize, string> = {
  sm: 'size-10 rounded-xl',
  md: 'size-14 rounded-2xl',
  lg: 'size-16 rounded-2xl',
};

const ICON_SIZE: Record<IconTileSize, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-7',
};

interface IconTileProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: IconName;
  size?: IconTileSize;
  /** Inverts to a black tile — used on hover states and dark surfaces. */
  inverted?: boolean;
}

/**
 * Framed icon.
 *
 * The recurring "large icon" element on service, domain and stack cards. Keeps
 * icon sizing and stroke weight identical everywhere they appear.
 */
export function IconTile({
  icon,
  size = 'md',
  inverted = false,
  className,
  ...props
}: IconTileProps) {
  const Icon = getIcon(icon);

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center border',
        'transition-colors duration-500 ease-premium',
        TILE_SIZE[size],
        inverted
          ? 'border-transparent bg-foreground text-background'
          : 'border-border bg-secondary/50 text-foreground',
        className,
      )}
      {...props}
    >
      <Icon className={ICON_SIZE[size]} strokeWidth={1.5} />
    </span>
  );
}
