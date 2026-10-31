import {
  ContactPreviewSection,
  DanceSection,
  DomainsSection,
  FeaturedProjectsSection,
  HeroSection,
  ServicesPreviewSection,
} from '@/components/home';
import { SECTION_IDS } from '@/constants/routes';
import type { PageSection } from '@/sections/types';

/**
 * Landing page composition.
 *
 * Order here is the order on screen. The dance routines sit directly under the
 * project rows — navigation lives inside those rows as a project of its own.
 */
export const homeSections: PageSection[] = [
  { id: SECTION_IDS.hero, Component: HeroSection },
  { id: SECTION_IDS.projects, Component: FeaturedProjectsSection },
  { id: SECTION_IDS.dance, Component: DanceSection },
  { id: SECTION_IDS.services, Component: ServicesPreviewSection },
  { id: SECTION_IDS.domains, Component: DomainsSection },
  { id: SECTION_IDS.contact, Component: ContactPreviewSection },
];
