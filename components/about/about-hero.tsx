import * as React from 'react';

import { PageHero } from '@/components/common/page-hero';
import { aboutContent } from '@/data/content';

/** About page hero — same rhythm as the services and contact pages. */
export function AboutHero() {
  const { hero } = aboutContent;

  return (
    <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />
  );
}
