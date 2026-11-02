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
    href: 'https://www.linkedin.com/in/kinematics-robotics-labs-krl-974597426/',
    handle: 'Kinematics Robotics Labs (KRL)',
    icon: 'linkedin',
  },
  {
    id: 'social-instagram',
    platform: 'instagram',
    label: 'Instagram',
    /* Opens a direct message; `profile` is what search engines are given. */
    href: 'https://ig.me/m/kinematicroboticslabs',
    profile: 'https://www.instagram.com/kinematicroboticslabs',
    handle: '@kinematicroboticslabs',
    icon: 'instagram',
  },
  {
    id: 'social-x',
    platform: 'x',
    label: 'X',
    href: 'https://x.com/KRLRobotics',
    handle: '@KRLRobotics',
    icon: 'x',
  },
  {
    id: 'social-whatsapp',
    platform: 'whatsapp',
    label: 'WhatsApp',
    href: '',
    handle: '',
    icon: 'whatsapp',
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

/**
 * Absolute profile URLs for JSON-LD `sameAs`: the profile, never a DM or
 * mailto link. Empty entries are dropped.
 */
export const socialProfileUrls: string[] = socialLinks
  .map((link) => link.profile ?? link.href)
  .filter((href) => href.startsWith('http'));
