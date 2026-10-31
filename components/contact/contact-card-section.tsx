import * as React from 'react';

import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { ContactChannels } from '@/components/contact/contact-channels';
import { SECTION_IDS } from '@/constants/routes';
import { contactContent } from '@/data/content';

/**
 * Large contact card.
 *
 * Every channel in one bordered surface. Rows stay in placeholder mode until
 * `value` and `href` are set in `data/contact.ts`.
 */
export function ContactCardSection() {
  const content = contactContent.channels;

  return (
    <Section id={SECTION_IDS.contact} bordered>
      <SectionHeading
        id={`${SECTION_IDS.contact}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        size="md"
      />

      <Reveal variant="fade-up" className="mt-16">
        <div className="overflow-hidden rounded-4xl border border-border bg-card shadow-soft">
          <ContactChannels columns={3} />
        </div>
      </Reveal>
    </Section>
  );
}
