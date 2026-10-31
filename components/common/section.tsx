import * as React from 'react';

import { Container } from '@/components/common/container';
import { cn } from '@/lib/utils';

type SectionSpacing = 'default' | 'compact' | 'none';

const SPACING_CLASS: Record<SectionSpacing, string> = {
  default: 'py-section',
  compact: 'py-section-sm',
  none: '',
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Anchor id — also used as the `aria-labelledby` target prefix. */
  id: string;
  spacing?: SectionSpacing;
  /** Wrap children in a `Container`. Disable for full-bleed content. */
  contained?: boolean;
  /** Adds the hairline that separates stacked sections. */
  bordered?: boolean;
  containerClassName?: string;
  /**
   * Names the section directly instead of pointing at a heading. Use for
   * sections that render no visible title — otherwise `aria-labelledby` would
   * reference an element that does not exist.
   */
  label?: string;
}

/**
 * Vertical rhythm wrapper.
 *
 * Every landing/services/contact block is a `Section`, so the generous
 * whitespace between them comes from one place and stays consistent.
 */
export function Section({
  id,
  className,
  containerClassName,
  spacing = 'default',
  contained = true,
  bordered = false,
  label,
  children,
  ...props
}: SectionProps) {
  const content = contained ? (
    <Container className={containerClassName}>{children}</Container>
  ) : (
    children
  );

  return (
    <section
      id={id}
      {...(label ? { 'aria-label': label } : { 'aria-labelledby': `${id}-title` })}
      className={cn(
        'relative w-full scroll-mt-24',
        SPACING_CLASS[spacing],
        bordered && 'border-t border-border',
        className,
      )}
      {...props}
    >
      {content}
    </section>
  );
}
