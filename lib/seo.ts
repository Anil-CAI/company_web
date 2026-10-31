import type { Metadata } from 'next';

import { ASSETS, SITE, SITE_URL } from '@/constants/site';

interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. "/services". */
  path: string;
  /** Overrides the default Open Graph image. */
  image?: string;
}

/**
 * Compose page metadata from a small input, so every route ships consistent
 * canonical URLs, Open Graph and Twitter cards.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = ASSETS.ogImage,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${title} — ${SITE.name}`,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE.name} — ${title}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${SITE.name}`,
      description,
      /* Omitted entirely while no handle is owned — see `constants/site.ts`. */
      ...(SITE.twitterHandle
        ? { site: SITE.twitterHandle, creator: SITE.twitterHandle }
        : {}),
      images: [image],
    },
  };
}

/**
 * JSON-LD organisation payload. Injected once in the root layout so search
 * engines get structured company data without a CMS.
 */
export function buildOrganisationJsonLd(input: {
  name: string;
  legalName: string;
  description: string;
  founded: string;
  socialUrls: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    legalName: input.legalName,
    description: input.description,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    ...(input.founded ? { foundingDate: input.founded } : {}),
    ...(input.socialUrls.length > 0 ? { sameAs: input.socialUrls } : {}),
  };
}
