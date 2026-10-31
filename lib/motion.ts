import type { Variants } from 'framer-motion';

import {
  DURATION,
  EASE_PREMIUM,
  EASE_SOFT,
  REVEAL_OFFSET,
  STAGGER,
} from '@/constants/animation';

/**
 * Shared Framer Motion variants.
 *
 * Components pick a variant instead of inventing their own timings, which keeps
 * every reveal on the site feeling like one continuous system.
 */

/** Fade up — the default entrance for text and cards. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: REVEAL_OFFSET },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_PREMIUM },
  },
};

/** Straight fade — for elements where movement would feel noisy. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_PREMIUM },
  },
};

/** Slide in from the left. */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -REVEAL_OFFSET * 1.5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE_PREMIUM },
  },
};

/** Slide in from the right. */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: REVEAL_OFFSET * 1.5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE_PREMIUM },
  },
};

/** Subtle scale-in, used for media and feature tiles. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE_PREMIUM },
  },
};

/** Parent container that staggers its children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.base,
      delayChildren: 0.05,
    },
  },
};

/** Tighter stagger for dense grids (domains, chips). */
export const staggerContainerTight: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.tight },
  },
};

/** Per-word/line mask reveal used by `AnimatedText`. */
export const maskReveal: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: DURATION.slower, ease: EASE_PREMIUM },
  },
};

/** Drawer panel slide for the mobile navigation. */
export const drawerPanel: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: DURATION.base, ease: EASE_PREMIUM } },
  exit: { x: '100%', transition: { duration: DURATION.fast, ease: EASE_SOFT } },
};

/** Backdrop fade for overlays. */
export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE_SOFT } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE_SOFT } },
};

/** Variant map keyed by name, for components that accept a variant prop. */
export const revealVariants = {
  fade,
  'fade-up': fadeUp,
  'slide-left': slideInLeft,
  'slide-right': slideInRight,
  scale: scaleIn,
} as const;

export type RevealVariant = keyof typeof revealVariants;

/**
 * Build a transition with an explicit delay — used where a stagger container
 * isn't practical (e.g. siblings rendered by different components).
 */
export function delayedTransition(delay: number) {
  return { duration: DURATION.slow, ease: EASE_PREMIUM, delay };
}
