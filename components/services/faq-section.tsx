'use client';

import * as React from 'react';

import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SECTION_IDS } from '@/constants/routes';
import { servicesContent } from '@/data/content';
import { faqItems } from '@/data/faq';

/**
 * FAQ.
 *
 * Single-open accordion — collapsible, so a visitor can close everything.
 * Questions come from `data/faq.ts`.
 */
export function FaqSection() {
  const content = servicesContent.faq;

  return (
    <Section id={SECTION_IDS.faq} bordered>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-4">
          <SectionHeading
            id={`${SECTION_IDS.faq}-title`}
            eyebrow={content.eyebrow}
            title={content.title}
            size="md"
          />
        </div>

        <div className="lg:col-span-8">
          <Accordion type="single" collapsible className="border-t border-border">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Section>
  );
}
