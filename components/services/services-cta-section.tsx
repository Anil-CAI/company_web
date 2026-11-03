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
 * Full-width deep violet, so the page ends on one branded base that runs
 * straight into the violet footer.
 */
export function ServicesCtaSection() {
  const content = servicesContent.cta;

  return (
    <Section id="services-cta" label="Get in touch" className="bg-violet text-[#F7F3FB]">
      <Reveal variant="fade-up">
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-eyebrow uppercase text-[#CFC6E0]">{content.eyebrow}</p>

            <AnimatedText
              as="h2"
              text={content.title}
              className="mt-8 text-display-sm font-medium tracking-tight text-[#F7F3FB]"
            />

            <p className="mx-auto mt-8 max-w-prose text-base leading-relaxed text-[#D9D1E8] text-pretty sm:text-lg">
              {content.body}
            </p>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton asChild size="lg">
                <Link href={ROUTES.contact}>
                  {content.ctaLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </MagneticButton>

              <MagneticButton
                asChild
                size="lg"
                variant="ghost"
                className="text-[#F7F3FB] hover:bg-white/10 hover:text-white"
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
