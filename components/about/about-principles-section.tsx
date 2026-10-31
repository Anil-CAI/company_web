import * as React from 'react';

import { RevealGroup, RevealItem } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { SECTION_IDS } from '@/constants/routes';
import { company } from '@/data/company';
import { aboutContent } from '@/data/content';

/**
 * How we work.
 *
 * Renders `company.principles`, which were already written in `data/company.ts`
 * but had no page rendering them — this is where they belong, since "how a team
 * works" is the question an About page exists to answer.
 */
export function AboutPrinciplesSection() {
  const content = aboutContent.principles;

  return (
    <Section id={SECTION_IDS.principles} bordered>
      <SectionHeading
        id={`${SECTION_IDS.principles}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <RevealGroup className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {company.principles.map((principle, index) => (
          <RevealItem key={principle.id} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-8">
              <span className="font-mono text-[0.6875rem] text-ink-400">
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 className="mt-6 text-lg font-medium tracking-tight">{principle.title}</h3>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                {principle.description}
              </p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
