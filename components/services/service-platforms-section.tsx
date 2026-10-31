import * as React from 'react';

import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { ServiceBentoGrid } from '@/components/services/service-bento-grid';
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
                Every group is a bento grid with the focus-scale on scroll.
                `ServiceBentoGrid` picks its slot pattern from the group size,
                so the eight-service groups get wide anchor tiles and the
                three-service group stays even rather than leaving a hole.
              */}
              <ServiceBentoGrid
                className="mt-12"
                items={groupServices.map((service) => ({
                  service,
                  /*
                   * Where a platform changes the offer, say so here instead of
                   * repeating the generic line — Go2 VR is view-only, G1 VR
                   * adds training and maintenance.
                   */
                  copy: service.platformNotes?.[group.id] ?? service.shortDescription,
                }))}
              />
            </section>
          );
        })}
      </div>
    </Section>
  );
}
