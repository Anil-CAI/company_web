import * as React from 'react';

import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { DomainsGrid } from '@/components/home/domains-grid';
import { SECTION_IDS } from '@/constants/routes';
import { homeContent } from '@/data/content';

/**
 * Domains.
 *
 * Every field the studio works across, from `data/domains.ts`, rendered as a
 * single scroll-animated wall.
 *
 * There is deliberately no card grid beneath it any more: the wall already
 * names all fifteen domains, so a second list repeated every one of them.
 */
export function DomainsSection() {
  const content = homeContent.domains;

  return (
    <Section id={SECTION_IDS.domains} bordered>
      <SectionHeading
        id={`${SECTION_IDS.domains}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      {/* One tile per domain — this is the full list, not a preview. */}
      <div className="mt-20">
        <DomainsGrid />
      </div>
    </Section>
  );
}
