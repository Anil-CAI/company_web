import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { AnimatedText } from '@/components/common/animated-text';
import { MagneticButton } from '@/components/common/magnetic-button';
import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { ROUTES, SECTION_IDS } from '@/constants/routes';
import { servicesContent } from '@/data/content';

/**
 * Closing call to action.
 *
 * The one inverted surface on the site — black card, white type. Used sparingly
 * so it lands.
 */
export function ServicesCtaSection() {
  const content = servicesContent.cta;

  return (
    <Section id="services-cta" label="Get in touch" bordered>
      <Reveal variant="scale">
        <div className="rounded-4xl bg-foreground px-8 py-20 text-background sm:px-16 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-eyebrow uppercase text-background/50">{content.eyebrow}</p>

            <AnimatedText
              as="h2"
              text={content.title}
              className="mt-8 text-display-md font-medium tracking-tight"
            />

            <p className="mx-auto mt-8 max-w-prose text-base leading-relaxed text-background/70 text-pretty sm:text-lg">
              {content.body}
            </p>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton asChild size="lg" variant="secondary">
                <Link href={ROUTES.contact}>
                  {content.ctaLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </MagneticButton>

              <MagneticButton
                asChild
                size="lg"
                variant="ghost"
                className="text-background hover:bg-background/10 hover:text-background"
              >
                <Link href={`${ROUTES.home}#${SECTION_IDS.projects}`}>
                  {content.secondaryLabel}
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
