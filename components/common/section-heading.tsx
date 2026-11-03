import * as React from 'react';

import { AnimatedText } from '@/components/common/animated-text';
import { Reveal } from '@/components/common/reveal';
import { cn } from '@/lib/utils';

type HeadingSize = 'md' | 'lg';
type HeadingAlign = 'left' | 'center';

/*
 * Large headings carry `text-headline`, the brand display colour, rather than
 * the body ink. It is one token in `globals.css`, so the whole site's headline
 * colour changes from a single line.
 */
const TITLE_SIZE: Record<HeadingSize, string> = {
  md: 'text-display-sm text-headline',
  lg: 'text-display-sm text-headline',
};

interface SectionHeadingProps {
  /** Small mono label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Must match the owning `Section`'s `aria-labelledby` target. */
  id?: string;
  size?: HeadingSize;
  align?: HeadingAlign;
  /** Heading level — pick for document outline, not for looks. */
  as?: 'h1' | 'h2' | 'h3';
  /** Optional CTA rendered opposite the title on wide screens. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Section header block.
 *
 * Eyebrow, animated title, supporting line and an optional action — the same
 * composition on every section, so the page reads as one rhythm.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  size = 'lg',
  align = 'left',
  as = 'h2',
  action,
  className,
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-8',
        action && !isCentered && 'lg:flex-row lg:items-end lg:justify-between lg:gap-16',
        className,
      )}
    >
      <div className={cn('max-w-3xl', isCentered && 'mx-auto text-center')}>
        {eyebrow ? (
          <Reveal variant="fade">
            <p className="eyebrow mb-6">{eyebrow}</p>
          </Reveal>
        ) : null}

        <AnimatedText
          id={id}
          as={as}
          text={title}
          className={cn(TITLE_SIZE[size], 'font-medium')}
        />

        {description ? (
          <Reveal variant="fade-up" delay={0.15}>
            <p
              className={cn(
                'mt-6 max-w-prose text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg',
                isCentered && 'mx-auto',
              )}
            >
              {description}
            </p>
          </Reveal>
        ) : null}
      </div>

      {action ? (
        <Reveal variant="fade-up" delay={0.2} className={cn(isCentered && 'mx-auto')}>
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}
