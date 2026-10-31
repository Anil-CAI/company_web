import Link from 'next/link';
import * as React from 'react';

import { MagneticButton } from '@/components/common/magnetic-button';
import { RevealGroup, RevealItem } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { ServiceCard } from '@/components/services/service-card';
import { ROUTES, SECTION_IDS } from '@/constants/routes';
import { homeContent } from '@/data/content';
import { featuredServices } from '@/data/services';

/**
 * Services preview.
 *
 * A staggered grid of the services flagged `featured` in `data/services.ts`.
 * The full catalogue lives on the services page.
 */
export function ServicesPreviewSection() {
  const content = homeContent.services;

  return (
    <Section id={SECTION_IDS.services} bordered>
      <SectionHeading
        id={`${SECTION_IDS.services}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        action={
          <MagneticButton asChild>
            <Link href={ROUTES.services}>{content.ctaLabel}</Link>
          </MagneticButton>
        }
      />

      <RevealGroup className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredServices.map((service) => (
          <RevealItem key={service.id} className="h-full">
            <ServiceCard service={service} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
