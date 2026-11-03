'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { Badge } from '@/components/ui/badge';
import { DURATION, EASE_PREMIUM, VIEWPORT_ONCE } from '@/constants/animation';
import { SECTION_IDS } from '@/constants/routes';
import { servicesContent } from '@/data/content';
import { processSteps } from '@/data/process';

/**
 * Process timeline.
 *
 * Each phase is a row on a shared rail; the marker scales in as the row enters
 * view, giving the section a stepping cadence as you scroll it.
 */
export function ProcessSection() {
  const content = servicesContent.process;

  return (
    <Section id={SECTION_IDS.process} tone="paper" bordered>
      <SectionHeading
        id={`${SECTION_IDS.process}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <ol className="mt-20">
        {processSteps.map((step) => (
          <li key={step.id}>
            <motion.div
              className="grid gap-6 border-t border-border py-12 md:grid-cols-12 md:gap-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: DURATION.slow, ease: EASE_PREMIUM }}
            >
              {/* Step marker */}
              <div className="flex items-center gap-4 md:col-span-2 md:block">
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Phase
                </span>
                <span className="block text-display-sm font-medium leading-none tracking-tight md:mt-4">
                  {step.step}
                </span>
              </div>

              <div className="md:col-span-4">
                <h3 className="text-2xl font-medium tracking-tight">{step.title}</h3>
              </div>

              <div className="md:col-span-6">
                <p className="max-w-prose text-base leading-relaxed text-muted-foreground text-pretty">
                  {step.description}
                </p>

                <ul className="mt-8 flex flex-wrap gap-2" aria-label={`${step.title} deliverables`}>
                  {step.deliverables.map((deliverable) => (
                    <li key={deliverable}>
                      <Badge>{deliverable}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
