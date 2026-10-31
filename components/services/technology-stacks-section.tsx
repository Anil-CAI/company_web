import * as React from 'react';

import { IconTile } from '@/components/common/icon-tile';
import { RevealGroup, RevealItem } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { SECTION_IDS } from '@/constants/routes';
import { servicesContent } from '@/data/content';
import { technologyStacks } from '@/data/technologies';

/**
 * Technology stacks.
 *
 * A grid of the toolchains behind each discipline, from
 * `data/technologies.ts`.
 */
export function TechnologyStacksSection() {
  const content = servicesContent.technologies;

  return (
    <Section id={SECTION_IDS.technologies} bordered>
      <SectionHeading
        id={`${SECTION_IDS.technologies}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <RevealGroup className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {technologyStacks.map((stack) => (
          <RevealItem key={stack.id} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 transition-[border-color,box-shadow] duration-500 ease-premium hover:border-ink-300 hover:shadow-soft">
              <IconTile icon={stack.icon} size="sm" />

              <h3 className="mt-8 text-lg font-medium tracking-tight">{stack.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                {stack.description}
              </p>

              <ul className="mt-8 flex flex-col gap-px border-t border-border pt-1">
                {stack.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between border-b border-border/60 py-3 text-sm text-foreground last:border-b-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
