import type { Metadata } from 'next';
import * as React from 'react';

import { ROUTES } from '@/constants/routes';
import { servicesContent } from '@/data/content';
import { buildMetadata } from '@/lib/seo';
import { servicesSections } from '@/sections';

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description: servicesContent.hero.description,
  path: ROUTES.services,
});

/** Services page — composition lives in `sections/services-sections.ts`. */
export default function ServicesPage() {
  return (
    <>
      {servicesSections.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
}
