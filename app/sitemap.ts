import type { MetadataRoute } from 'next';

import { ROUTES } from '@/constants/routes';
import { SITE_URL } from '@/constants/site';

/** Static sitemap — one entry per route in `ROUTES`. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${SITE_URL}${ROUTES.services}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}${ROUTES.about}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}${ROUTES.contact}`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}${ROUTES.privacy}`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
