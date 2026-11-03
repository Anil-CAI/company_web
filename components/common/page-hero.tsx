import * as React from 'react';

import { AnimatedText } from '@/components/common/animated-text';
import { Container } from '@/components/common/container';
import { Reveal } from '@/components/common/reveal';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Buttons or quick links rendered under the description. */
  action?: React.ReactNode;
  /** Rendered flush at the bottom of the hero, e.g. a media frame. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Interior page hero.
 *
 * Shared by the services and contact pages so both open with identical rhythm.
 * The landing page deliberately does not use this — its hero is left empty.
 *
 * Top padding clears the fixed header via the `--header-height` token.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
}: PageHeroProps) {
  return (
    <header
      className={cn(
        'relative w-full pb-section-sm pt-[calc(var(--header-height)+clamp(4rem,10vw,8rem))]',
        className,
      )}
    >
      <Container>
        <div className="max-w-4xl">
          <Reveal variant="fade">
            <p className="eyebrow">{eyebrow}</p>
          </Reveal>

          <AnimatedText
            as="h1"
            text={title}
            className="mt-8 text-display-h1 font-medium tracking-tight text-headline"
          />

          <Reveal variant="fade-up" delay={0.2}>
            <p className="mt-8 max-w-prose text-lg leading-relaxed text-muted-foreground text-pretty">
              {description}
            </p>
          </Reveal>

          {action ? (
            <Reveal variant="fade-up" delay={0.3} className="mt-12">
              {action}
            </Reveal>
          ) : null}
        </div>

        {children ? <div className="mt-20">{children}</div> : null}
      </Container>
    </header>
  );
}
