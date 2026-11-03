import * as React from 'react';

import { PageHero } from '@/components/common/page-hero';
import { ContactFlip } from '@/components/contact/contact-flip';
import { Button } from '@/components/ui/button';
import { contactChannels } from '@/data/contact';
import { contactContent } from '@/data/content';
import { hasValue } from '@/utils/media';

/**
 * Contact page hero — copy plus the CONTACT flip row.
 *
 * The plain icon row that used to sit here held the same channels; the flip
 * spells the word itself, so the row stops being decoration beside the heading
 * and becomes the thing the heading is about.
 */
export function ContactHero() {
  const { hero } = contactContent;
  const email = contactChannels.find((channel) => channel.type === 'email');

  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      description={hero.description}
      action={
        <div className="flex flex-wrap items-center gap-4">
          <ContactFlip />
          {email && hasValue(email.href) ? (
            <Button asChild variant="secondary">
              <a href={email.href}>{hero.emailLabel}</a>
            </Button>
          ) : null}
        </div>
      }
    />
  );
}
