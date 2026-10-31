import type { Metadata } from 'next';
import * as React from 'react';

import { ROUTES } from '@/constants/routes';
import { aboutContent } from '@/data/content';
import { buildMetadata } from '@/lib/seo';
import { aboutSections } from '@/sections';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: aboutContent.hero.description,
  path: ROUTES.about,
});

/** About page — composition lives in `sections/about-sections.ts`. */
export default function AboutPage() {
  return (
    <>
      {aboutSections.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
}
