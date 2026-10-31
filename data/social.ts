import type { SocialLink } from '@/types/social';

/**
 * Social profiles.
 *
 * Empty `href` renders a disabled icon button with the correct aria-label, so
 * the layout is final before the real links exist. Fill `href` and `handle` to
 * activate a profile.
 */
export const socialLinks: SocialLink[] = [
  {
    id: 'social-linkedin',
    platform: 'linkedin',
    label: 'LinkedIn',
    href: '',
    handle: '',
    icon: 'linkedin',
  },
  {
    id: 'social-instagram',
    platform: 'instagram',
    label: 'Instagram',
    href: 'https://instagram.com/kinematicsroboticslabs',
    handle: '@kinematicsroboticslabs',
    icon: 'instagram',
  },
  {
    id: 'social-whatsapp',
    platform: 'whatsapp',
    label: 'WhatsApp',
    href: '',
    handle: '',
    icon: 'message',
  },
  {
    id: 'social-email',
    platform: 'email',
    label: 'Email',
    href: 'mailto:kinematicroboticslabs@gmail.com',
    handle: 'kinematicroboticslabs@gmail.com',
    icon: 'mail',
  },
];

/** Absolute profile URLs for JSON-LD `sameAs`. Empty entries are dropped. */
export const socialProfileUrls: string[] = socialLinks
  .map((link) => link.href)
  .filter((href) => href.length > 0);
