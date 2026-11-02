import * as React from 'react';

import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { DanceShowcase } from '@/components/home/dance-showcase';
import { SECTION_IDS } from '@/constants/routes';
import { homeContent } from '@/data/content';

/**
 * Robot dance models.
 *
 * Just the heading and the shelf. Each book opens into a reader holding
 * everything about its routine — video, story, moves and tags — so the dance
 * cards that used to repeat that content below the shelf are gone, and each
 * routine lives in one place.
 */
export function DanceSection() {
  const content = homeContent.dance;

  return (
    <Section id={SECTION_IDS.dance} bordered>
      <SectionHeading
        id={`${SECTION_IDS.dance}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      {/* Generous space so the intro reads as the section's, not the stage's. */}
      <DanceShowcase className="mt-20 sm:mt-28" />
    </Section>
  );
}
