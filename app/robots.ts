import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/constants/site';

/** Crawl everything, and point robots at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
