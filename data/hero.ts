import { ROUTES } from '@/constants/routes';
import type { HeroLight } from '@/types/hero';


/** Landing hero — the light wordmark and its copy. */
export const heroLight: HeroLight = {
  image: '/images/krl-hero-light.jpg',
  canvasLabel: 'KRL light wallpaper that reacts to your cursor',
  title: 'Light you can touch.',
  description: 'Hover the letters to wake the fibres. Press and drag to bend the light.',
  cta: { label: 'Get in touch', href: ROUTES.contact },
};
