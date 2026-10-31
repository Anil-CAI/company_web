import { ROUTES, SECTION_IDS } from '@/constants/routes';
import type { NavGroup, NavItem } from '@/types/navigation';

/** Primary header navigation. */
export const mainNavigation: NavItem[] = [
  {
    id: 'nav-home',
    label: 'Home',
    href: ROUTES.home,
    description: 'Overview, featured work and capabilities',
  },
  {
    id: 'nav-about',
    label: 'About',
    href: ROUTES.about,
    description: 'Who we are and how we work',
  },
  {
    id: 'nav-services',
    label: 'Services',
    href: ROUTES.services,
    description: 'What we build and how we engage',
  },
  {
    id: 'nav-contact',
    label: 'Contact',
    href: ROUTES.contact,
    description: 'Start a conversation with the team',
  },
];

/** Footer link columns. In-page anchors resolve on the landing page. */
export const footerNavigation: NavGroup[] = [
  {
    id: 'footer-company',
    title: 'Company',
    items: [
      { id: 'footer-home', label: 'Home', href: ROUTES.home },
      { id: 'footer-about', label: 'About', href: ROUTES.about },
      { id: 'footer-services', label: 'Services', href: ROUTES.services },
      { id: 'footer-contact', label: 'Contact', href: ROUTES.contact },
    ],
  },
  {
    id: 'footer-explore',
    title: 'Explore',
    items: [
      { id: 'footer-projects', label: 'Featured work', href: `${ROUTES.home}#${SECTION_IDS.projects}` },
      { id: 'footer-dance', label: 'Dance models', href: `${ROUTES.home}#${SECTION_IDS.dance}` },
      { id: 'footer-domains', label: 'Domains', href: `${ROUTES.home}#${SECTION_IDS.domains}` },
    ],
  },
  {
    id: 'footer-capabilities',
    title: 'Capabilities',
    items: [
      { id: 'footer-process', label: 'Process', href: `${ROUTES.services}#${SECTION_IDS.process}` },
      {
        id: 'footer-stack',
        label: 'Technology stack',
        href: `${ROUTES.services}#${SECTION_IDS.technologies}`,
      },
      { id: 'footer-faq', label: 'FAQ', href: `${ROUTES.services}#${SECTION_IDS.faq}` },
    ],
  },
];

/** Legal links rendered on the footer's bottom bar. */
export const legalNavigation: NavItem[] = [
  { id: 'legal-privacy', label: 'Privacy', href: ROUTES.privacy },
  /* No terms page exists yet. A link to one would be a dead end, so it is not listed. */
];
