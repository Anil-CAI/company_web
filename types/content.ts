import type { VideoMedia } from '@/types/media';

/** Copy block shared by every section header. */
export interface SectionContent {
  /** Small mono label above the title. */
  eyebrow: string;
  /** Section title — rendered as the animated heading. */
  title: string;
  /** Optional supporting paragraph. */
  description?: string;
  /** Optional call-to-action label. */
  ctaLabel?: string;
}

/** Copy for an interior page hero. */
export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
}

/** Landing page copy. */
export interface HomeContent {
  projects: SectionContent;
  dance: SectionContent;
  services: SectionContent;
  domains: SectionContent;
  contact: SectionContent & { body: string };
}

/** Services page copy. */
export interface ServicesContent {
  hero: HeroContent;
  showreel: VideoMedia;
  categories: SectionContent;
  details: SectionContent;
  technologies: SectionContent;
  process: SectionContent;
  faq: SectionContent;
  cta: SectionContent & { body: string; secondaryLabel: string };
}

/** About page copy. */
export interface AboutContent {
  hero: HeroContent;
  principles: SectionContent;
}

/** Contact page copy. */
export interface ContactContent {
  hero: HeroContent;
  channels: SectionContent;
  form: SectionContent & {
    submitLabel: string;
    /** Button label while the request is in flight. */
    submittingLabel: string;
    successTitle: string;
    successBody: string;
    /** Shown when the submission fails — must name a fallback address. */
    errorBody: string;
    /** Shown under the form at rest. */
    disclaimer: string;
  };
  map: SectionContent;
}
