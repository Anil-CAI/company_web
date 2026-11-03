import * as React from 'react';

import { AnimatedText } from '@/components/common/animated-text';
import { Container } from '@/components/common/container';
import { Reveal } from '@/components/common/reveal';
import { PlatformPicker } from '@/components/services/platform-picker';
import { servicesContent } from '@/data/content';

/**
 * Services hero.
 *
 * Deliberately not `PageHero`.
 *
 * The shared hero always renders a paragraph under the headline, and here that
 * paragraph was taller than the robot cards beneath it — the page led with a
 * block of prose and buried the thing a visitor actually came to choose from.
 * This lays out the headline and then hands straight to the picker, which is
 * the page's real entry point. The description is not lost: it opens the first
 * platform group below.
 */
export function ServicesHero() {
  const { hero } = servicesContent;

  return (
    <header className="relative w-full pb-section-sm pt-[calc(var(--header-height)+clamp(3rem,7vw,5rem))]">
      <Container>
        <div className="max-w-4xl">
          <Reveal variant="fade">
            <p className="eyebrow">{hero.eyebrow}</p>
          </Reveal>

          <AnimatedText
            as="h1"
            text={hero.title}
            className="mt-8 text-display-h1 font-medium tracking-tight text-headline"
          />
        </div>

        <Reveal variant="fade-up" delay={0.2} className="mt-16">
          <PlatformPicker />
        </Reveal>
      </Container>
    </header>
  );
}
