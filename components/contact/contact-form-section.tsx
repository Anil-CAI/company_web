import * as React from 'react';

import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { ContactForm } from '@/components/contact/contact-form';
import { PlaceholderValue } from '@/components/common/placeholder-value';
import { SECTION_IDS } from '@/constants/routes';
import { company } from '@/data/company';
import { contactResponseNote } from '@/data/contact';
import { contactContent } from '@/data/content';

/**
 * Enquiry form section.
 *
 * Heading and the studio's principles on the left, the form on the right. The
 * response-time note is a placeholder until set in `data/contact.ts`.
 */
export function ContactFormSection() {
  const content = contactContent.form;

  return (
    <Section id={SECTION_IDS.contactForm} bordered>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            id={`${SECTION_IDS.contactForm}-title`}
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            size="md"
          />

          <Reveal variant="fade-up" delay={0.2} className="mt-12">
            <p className="eyebrow">Response time</p>
            <p className="mt-4 text-base text-foreground">
              <PlaceholderValue value={contactResponseNote} placeholder="Add a response time" />
            </p>

            <ul className="mt-12 flex flex-col gap-8 border-t border-border pt-10">
              {company.principles.map((principle) => (
                <li key={principle.id}>
                  <h3 className="text-base font-medium tracking-tight">{principle.title}</h3>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground text-pretty">
                    {principle.description}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal variant="fade-up">
            <div className="rounded-4xl border border-border bg-card p-8 shadow-soft sm:p-12">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
