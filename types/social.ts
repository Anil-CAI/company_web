import type { IconName } from '@/lib/icons';

/** A social profile shown in the footer and contact sections. */
export interface SocialLink {
  id: string;
  /** Machine-ish key, e.g. "linkedin". */
  platform: string;
  /** Human label used for `aria-label`. */
  label: string;
  /** Where the icon goes — a DM link where the platform has one. Empty renders a disabled button. */
  href: string;
  /** The public profile URL, when `href` is a DM link. Used for JSON-LD `sameAs`. */
  profile?: string;
  /** Display handle, e.g. "@krllabs". Empty renders a placeholder. */
  handle: string;
  icon: IconName;
}
