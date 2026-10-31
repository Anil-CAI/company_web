import type { IconName } from '@/lib/icons';

/** A social profile shown in the footer and contact sections. */
export interface SocialLink {
  id: string;
  /** Machine-ish key, e.g. "linkedin". */
  platform: string;
  /** Human label used for `aria-label`. */
  label: string;
  /** Empty string renders a disabled icon button. */
  href: string;
  /** Display handle, e.g. "@krllabs". Empty renders a placeholder. */
  handle: string;
  icon: IconName;
}
