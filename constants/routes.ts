/**
 * Route registry.
 *
 * The site has four pages; every other destination is an in-page anchor. Keeping them here means a rename never leaves a dead link behind.
 */

export const ROUTES = {
  home: '/',
  services: '/services',
  contact: '/contact',
  about: '/about',
  privacy: '/privacy',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

/** Section ids used for anchors, skip links and scroll targets. */
export const SECTION_IDS = {
  hero: 'hero',
  projects: 'projects',
  dance: 'dance-models',
  services: 'services',
  domains: 'domains',
  contact: 'contact',
  main: 'main-content',
  serviceCategories: 'service-categories',
  serviceDetails: 'service-details',
  technologies: 'technologies',
  process: 'process',
  faq: 'faq',
  story: 'story',
  team: 'team',
  principles: 'principles',
  contactForm: 'contact-form',
  map: 'map',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Convenience helper for anchor hrefs. */
export function anchor(id: SectionId): string {
  return `#${id}`;
}
