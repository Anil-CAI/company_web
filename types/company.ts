import type { ImageMedia } from '@/types/media';

/** Single source of truth for company identity and brand copy. */
export interface Company {
  /** Short brand name used in the wordmark. */
  name: string;
  /** Full legal / display name. */
  legalName: string;
  /** Line beneath the wordmark, e.g. "Robotic Solutions". */
  tagline: string;
  /** One-sentence positioning statement. */
  description: string;
  /** Longer paragraph used in about-style blocks. */
  longDescription: string;
  /** Canonical origin, no trailing slash. */
  url: string;
  /** Empty `src` renders the wordmark fallback. */
  logo: ImageMedia;
  /** Monochrome mark used on dark surfaces. */
  logoInverted: ImageMedia;
  /** Founding year. Empty string renders a placeholder. */
  founded: string;
  /** Short values / principles list. */
  principles: CompanyPrinciple[];
}

export interface CompanyPrinciple {
  id: string;
  title: string;
  description: string;
}
