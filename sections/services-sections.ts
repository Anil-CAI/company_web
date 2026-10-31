import {
  FaqSection,
  ProcessSection,
  ServicePlatformsSection,
  ServiceDetailsSection,
  ServicesCtaSection,
  ServicesHero,
} from '@/components/services';
import { TechnologyStacksSection } from '@/components/services/technology-stacks-section';
import { SECTION_IDS } from '@/constants/routes';
import type { PageSection } from '@/sections/types';

/** Services page composition, in render order. */
export const servicesSections: PageSection[] = [
  { id: 'services-hero', Component: ServicesHero },
  { id: SECTION_IDS.serviceCategories, Component: ServicePlatformsSection },
  { id: SECTION_IDS.serviceDetails, Component: ServiceDetailsSection },
  { id: SECTION_IDS.technologies, Component: TechnologyStacksSection },
  { id: SECTION_IDS.process, Component: ProcessSection },
  { id: SECTION_IDS.faq, Component: FaqSection },
  { id: 'services-cta', Component: ServicesCtaSection },
];
