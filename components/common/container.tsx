import * as React from 'react';

import { cn } from '@/lib/utils';

type ContainerWidth = 'default' | 'narrow' | 'wide' | 'full';

const WIDTH_CLASS: Record<ContainerWidth, string> = {
  default: 'max-w-shell',
  narrow: 'max-w-4xl',
  wide: 'max-w-[1680px]',
  full: 'max-w-none',
};

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  /** Render as a different element, e.g. `header` or `footer`. */
  as?: 'div' | 'header' | 'footer' | 'section' | 'article';
}

/**
 * Horizontal layout shell.
 * The only place page gutters are defined — nothing else should set them.
 */
export function Container({
  className,
  width = 'default',
  as: Component = 'div',
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full px-gutter', WIDTH_CLASS[width], className)}
      {...props}
    />
  );
}
