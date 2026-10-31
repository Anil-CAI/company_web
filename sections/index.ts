/**
 * Section registry.
 *
 * Each page renders an ordered array from this folder. Reordering, adding or
 * removing a section is a one-line edit here — pages never hold a JSX stack.
 */

export { aboutSections } from '@/sections/about-sections';
export { contactSections } from '@/sections/contact-sections';
export { homeSections } from '@/sections/home-sections';
export { servicesSections } from '@/sections/services-sections';
export type { PageSection } from '@/sections/types';
