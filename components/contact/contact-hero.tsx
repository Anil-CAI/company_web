import * as React from 'react';

import { PageHero } from '@/components/common/page-hero';
import { ContactFlip } from '@/components/contact/contact-flip';
import { contactContent } from '@/data/content';

/**
 * Contact page hero — copy plus the CONTACT flip row.
 *
 * The plain icon row that used to sit here held the same channels; the flip
 * spells the word itself, so the row stops being decoration beside the heading
 * and becomes the thing the heading is about.
 */
export function ContactHero() {
  const { hero } = contactContent;

  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      description={hero.description}
      action={<ContactFlip />}
    />
  );
}
