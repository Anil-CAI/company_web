import {
  ContactCardSection,
  ContactFormSection,
  ContactHero,
  MapSection,
} from '@/components/contact';
import { SECTION_IDS } from '@/constants/routes';
import type { PageSection } from '@/sections/types';

/** Contact page composition, in render order. */
export const contactSections: PageSection[] = [
  { id: 'contact-hero', Component: ContactHero },
  { id: SECTION_IDS.contact, Component: ContactCardSection },
  { id: SECTION_IDS.contactForm, Component: ContactFormSection },
  { id: SECTION_IDS.map, Component: MapSection },
];
