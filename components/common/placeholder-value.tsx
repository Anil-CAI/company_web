import * as React from 'react';

import { cn } from '@/lib/utils';
import { hasValue } from '@/utils/media';

interface PlaceholderValueProps {
  /** The real value. Empty renders the placeholder glyph instead. */
  value: string;
  /** Muted hint shown while `value` is empty. */
  placeholder?: string;
  className?: string;
  /** Classes applied only in the empty state. */
  placeholderClassName?: string;
}

/**
 * Text slot.
 *
 * The text counterpart to `PlaceholderImage`: renders the real value when it
 * exists, and a muted hint at the same size when it doesn't. Used for contact
 * details, years and handles, so an unfilled site still looks deliberate rather
 * than broken.
 */
export function PlaceholderValue({
  value,
  placeholder = '—',
  className,
  placeholderClassName,
}: PlaceholderValueProps) {
  if (hasValue(value)) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span
      className={cn('text-ink-400', className, placeholderClassName)}
      // Placeholders are provisional content, not information.
      data-placeholder="true"
    >
      {placeholder}
    </span>
  );
}
