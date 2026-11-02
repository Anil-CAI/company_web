import * as React from 'react';

import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { Reveal, RevealGroup, RevealItem } from '@/components/common/reveal';
import { ServiceCard } from '@/components/services/service-card';
import { SECTION_IDS } from '@/constants/routes';
import { servicesContent } from '@/data/content';
import { getServicesByPlatform, servicePlatformGroups } from '@/data/services';

/**
 * Services, grouped by robot.
 *
 * Visitors arrive asking "can it do X on a Go2?", not "I need Virtual
 * Engineering", so the page leads with the platforms.
 *
 * Every group is rendered in full rather than hidden behind a tab. Tabs would
 * put half the catalogue one click away that most people never make, and the
 * hidden half would be invisible to search engines. The picture cards in the
 * hero jump straight to a group, which gives the same fast access without
 * hiding anything.
 */
export function ServicePlatformsSection() {
  const content = servicesContent.categories;

  return (
    <Section id={SECTION_IDS.serviceCategories} bordered>
      <SectionHeading
        id={`${SECTION_IDS.serviceCategories}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div className="mt-20 flex flex-col gap-24">
        {servicePlatformGroups.map((group) => {
          const groupServices = getServicesByPlatform(group.id);

          return (
            <section
              key={group.id}
              id={`platform-${group.id}`}
              aria-labelledby={`platform-${group.id}-title`}
              className="scroll-mt-32"
            >
              <Reveal>
                <div className="flex flex-wrap items-baseline gap-4 border-b border-border pb-7">
                  <h3
                    id={`platform-${group.id}-title`}
                    className="text-display-sm font-medium tracking-tight"
                  >
                    {group.name}
                  </h3>
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {group.form}
                  </span>
                  <span className="font-mono text-[0.6875rem] text-ink-400">
                    {groupServices.length} services
                  </span>
                </div>

                <p className="mt-6 max-w-prose text-base leading-relaxed text-muted-foreground text-pretty">
                  {group.description}
                </p>
              </Reveal>

              {/*
                The same card as the rest of the site's services: icon, title,
                copy and a hover folder listing the stack. The per-robot line
                replaces the generic one where the offer differs (Go2 VR is
                view-only, G1 VR adds training and maintenance).
              */}
              <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {groupServices.map((service) => (
                  <RevealItem key={service.id} className="h-full">
                    <ServiceCard
                      service={service}
                      description={service.platformNotes?.[group.id] ?? service.shortDescription}
                    />
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>
          );
        })}
      </div>
    </Section>
  );
}
