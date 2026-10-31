import * as React from 'react';

import { company } from '@/data/company';
import { socialProfileUrls } from '@/data/social';
import { buildOrganisationJsonLd } from '@/lib/seo';

/**
 * Structured data.
 *
 * Emits an Organization graph so search engines can read company identity
 * without a CMS. Values come straight from `data/company.ts`.
 */
export function JsonLd() {
  const payload = buildOrganisationJsonLd({
    name: company.name,
    legalName: company.legalName,
    description: company.description,
    founded: company.founded,
    socialUrls: socialProfileUrls,
  });

  return (
    <script
      type="application/ld+json"
      // Payload is authored locally, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
