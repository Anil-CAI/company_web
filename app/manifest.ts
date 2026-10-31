import type { MetadataRoute } from 'next';

import { SITE } from '@/constants/site';

/**
 * Web app manifest.
 *
 * The icon points at `app/icon.svg` — the one mark that always exists — so the
 * manifest never requests a missing file. When you have real PNGs, drop them in
 * `public/icons/` and add them here:
 *
 *   { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
 *   { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.title,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: SITE.themeColor,
    theme_color: SITE.themeColor,
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
