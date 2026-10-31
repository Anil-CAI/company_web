import type { Metadata } from 'next';
import * as React from 'react';

import { ROUTES } from '@/constants/routes';
import { contactContent } from '@/data/content';
import { buildMetadata } from '@/lib/seo';
import { contactSections } from '@/sections';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: contactContent.hero.description,
  path: ROUTES.contact,
});

/** Contact page — composition lives in `sections/contact-sections.ts`. */
export default function ContactPage() {
  return (
    <>
      {contactSections.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
}
