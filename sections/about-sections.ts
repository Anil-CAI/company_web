import {
  AboutHero,
  AboutPrinciplesSection,
  AboutStorySection,
  AboutTeamSection,
} from '@/components/about';
import { SECTION_IDS } from '@/constants/routes';
import type { PageSection } from '@/sections/types';

/**
 * About page composition, in render order.
 *
 * Story before team before principles: a visitor wants to know what this is
 * before who is behind it, and how it is run last.
 */
export const aboutSections: PageSection[] = [
  { id: 'about-hero', Component: AboutHero },
  { id: SECTION_IDS.story, Component: AboutStorySection },
  { id: SECTION_IDS.team, Component: AboutTeamSection },
  { id: SECTION_IDS.principles, Component: AboutPrinciplesSection },
];
