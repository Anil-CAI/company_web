import { ArrowUpRight, MapPin } from 'lucide-react';
import * as React from 'react';

import { PlaceholderValue } from '@/components/common/placeholder-value';
import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { SECTION_IDS } from '@/constants/routes';
import { officeLocation } from '@/data/contact';
import { contactContent } from '@/data/content';
import { hasValue } from '@/utils/media';

/**
 * Map section.
 *
 * Renders a live Google Maps embed when `officeLocation.mapEmbedUrl` is set,
 * and a bordered placeholder of identical proportions until then. Get the URL
 * from Google Maps → Share → Embed a map, and paste the iframe's `src`.
 */
export function MapSection() {
  const content = contactContent.map;
  const hasMap = hasValue(officeLocation.mapEmbedUrl);

  return (
    <Section id={SECTION_IDS.map} bordered>
      <SectionHeading
        id={`${SECTION_IDS.map}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        size="md"
      />

      <Reveal variant="fade-up" className="mt-16">
        <div className="overflow-hidden rounded-4xl border border-border bg-card shadow-soft">
          {/* Address bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-xl border border-border bg-secondary/50"
              >
                <MapPin className="size-[18px]" strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {officeLocation.label}
                </p>
                <p className="mt-1.5 text-base">
                  <PlaceholderValue
                    value={officeLocation.address}
                    placeholder="Add office address"
                  />
                </p>
              </div>
            </div>

            {hasValue(officeLocation.directionsUrl) ? (
              <a
                href={officeLocation.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 ease-premium hover:text-ink-600"
              >
                Open in Maps
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 ease-premium group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                />
              </a>
            ) : null}
          </div>

          {/* Map frame */}
          <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
            {hasMap ? (
              <iframe
                src={officeLocation.mapEmbedUrl}
                title={`Map showing ${officeLocation.label}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            ) : (
              <div
                role="img"
                aria-label="Kakinada, India"
                className="placeholder-surface absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-full border border-border bg-background/80 shadow-soft"
                >
                  <MapPin className="size-5 text-ink-500" strokeWidth={1.5} />
                </span>
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-500">
                  Kakinada · India
                </p>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
