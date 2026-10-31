/**
 * Site-wide configuration consumed by metadata, sitemap, manifest and robots.
 * Change the domain in exactly one place: `SITE_URL`.
 */

export const SITE_URL = 'https://krl-labs.com';

export const SITE = {
  name: 'KRL Labs',
  shortName: 'KRL',
  title: 'KRL Labs — Robotic Solutions',
  titleTemplate: '%s — KRL Labs',
  description:
    'KRL Labs engineers robotics, AI and industrial automation systems — from autonomous platforms and computer vision to digital twins, simulation and embedded control.',
  keywords: [
    'robotics company',
    'industrial automation',
    'autonomous systems',
    'ROS 2',
    'digital twin',
    'robot simulation',
    'computer vision',
    'embedded systems',
    'VR robotics',
    'AR robotics',
    'machine learning',
    'robotics research',
  ],
  locale: 'en_US',
  language: 'en',
  themeColor: '#ffffff',
  /**
   * No X/Twitter account yet. Left empty on purpose: a card that names a
   * handle nobody owns points at a stranger's profile. `lib/seo.ts` drops the
   * `site`/`creator` fields when this is blank.
   */
  twitterHandle: '',
} as const;

/**
 * Static asset paths.
 *
 * The files are intentionally absent — drop them into `/public` at these exact
 * paths and the metadata, manifest and structured data pick them up with no
 * code change. The browser tab icon is handled separately by `app/icon.svg`.
 */
export const ASSETS = {
  ogImage: '/images/og-image.png',
  twitterImage: '/images/twitter-image.png',
} as const;
