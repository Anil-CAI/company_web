import type { Metadata } from 'next';
import * as React from 'react';

import { ROUTES } from '@/constants/routes';
import { SITE } from '@/constants/site';
import { buildMetadata } from '@/lib/seo';
import { homeSections } from '@/sections';

export const metadata: Metadata = buildMetadata({
  title: 'Robotic Solutions',
  description: SITE.description,
  path: ROUTES.home,
});

/**
 * Landing page.
 *
 * Renders the ordered section list from `sections/home-sections.ts`. To change
 * the page, reorder that array — nothing here needs to move.
 */
export default function HomePage() {
  return (
    <>
      {homeSections.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
}
