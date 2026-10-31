'use client';

import { Check } from 'lucide-react';
import * as React from 'react';

import { IconTile } from '@/components/common/icon-tile';
import { PlaceholderImage } from '@/components/common/placeholder-image';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { SECTION_IDS } from '@/constants/routes';
import { servicesContent } from '@/data/content';
import { services } from '@/data/services';
import { padIndex } from '@/utils/format';

/**
 * Detailed services.
 *
 * Every service as an expandable row: full description, deliverables, stack
 * chips and a media slot. The first row opens by default so the pattern is
 * obvious without a click. Rows carry their slug as an id, so the category
 * chips above can link straight to one.
 */
export function ServiceDetailsSection() {
  const content = servicesContent.details;
  const [firstService] = services;

  return (
    <Section id={SECTION_IDS.serviceDetails} bordered>
      <SectionHeading
        id={`${SECTION_IDS.serviceDetails}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <Accordion
        type="multiple"
        defaultValue={firstService ? [firstService.slug] : []}
        className="mt-20 border-t border-border"
      >
        {services.map((service, index) => (
          <AccordionItem key={service.id} value={service.slug} id={service.slug} className="scroll-mt-28">
            <AccordionTrigger>
              <span className="flex flex-1 items-baseline gap-5 sm:gap-8">
                <span className="font-mono text-[0.6875rem] text-muted-foreground">
                  {padIndex(index + 1)}
                </span>
                <span className="flex-1">
                  <span className="block">{service.title}</span>
                  <span className="mt-2 block text-sm font-normal text-muted-foreground">
                    {service.shortDescription}
                  </span>
                </span>
              </span>
            </AccordionTrigger>

            <AccordionContent>
              <div className="grid gap-12 pl-0 sm:pl-[calc(0.6875rem+2rem)] lg:grid-cols-2 lg:gap-16">
                <div>
                  <IconTile icon={service.icon} size="md" />

                  <p className="mt-8 max-w-prose text-base leading-relaxed text-muted-foreground text-pretty">
                    {service.description}
                  </p>

                  <h4 className="eyebrow mt-10">What you get</h4>
                  <ul className="mt-5 flex flex-col gap-3">
                    {service.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3 text-sm text-foreground">
                        <Check
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                          strokeWidth={1.5}
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="eyebrow mt-10">Stack</h4>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.technologies.map((technology) => (
                      <li key={technology}>
                        <Badge>{technology}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>

                <PlaceholderImage
                  media={service.image}
                  ratio="wide"
                  className="self-start"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
