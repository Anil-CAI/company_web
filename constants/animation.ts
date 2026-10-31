/**
 * Motion constants.
 *
 * Every duration, easing curve and offset used across the site lives here so
 * the whole experience shares one rhythm. No magic numbers in components.
 */

/** Signature easing curve — fast out, long settle. */
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

/** Symmetric curve for hover/tap micro-interactions. */
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;

export const DURATION = {
  fast: 0.25,
  base: 0.5,
  slow: 0.8,
  slower: 1.1,
} as const;

/** Stagger applied between siblings in a revealed group. */
export const STAGGER = {
  tight: 0.045,
  base: 0.08,
  loose: 0.12,
} as const;

/** Distance (px) elements travel during reveal animations. */
export const REVEAL_OFFSET = 28;

/**
 * How much of an element must be visible before it reveals.
 *
 * Deliberately small. At 25% a tall section had to be a quarter on screen
 * before it moved, which on a phone meant scrolling most of a card past the
 * fold before anything happened — the animation landed after the reader had
 * already arrived. A low threshold plus a negative root margin starts the
 * reveal just as the element enters, which is what makes it feel like the page
 * is responding rather than catching up.
 */
export const VIEWPORT_AMOUNT = 0.08;

/**
 * Shared `whileInView` viewport config — reveal once, never replay.
 *
 * The bottom margin pulls the trigger line up off the fold so a reveal has
 * begun by the time the element is properly in view. The same value works on
 * both laptop and phone: it is expressed against the viewport, so it scales
 * with the screen rather than needing a breakpoint.
 */
export const VIEWPORT_ONCE = {
  once: true,
  amount: VIEWPORT_AMOUNT,
  margin: '0px 0px -12% 0px',
} as const;

/** Spring used by magnetic buttons and cursor-follow effects. */
export const MAGNETIC_SPRING = {
  stiffness: 220,
  damping: 22,
  mass: 0.35,
} as const;

/** Max px a magnetic element is pulled toward the cursor. */
export const MAGNETIC_STRENGTH = 14;

/**
 * Lenis smooth-scroll tuning.
 * `lerp` (not `duration`) drives the easing — lower is heavier and slower.
 */
export const LENIS_OPTIONS = {
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
} as const;

/** Duration (seconds) of one full client-marquee cycle. */
export const MARQUEE_DURATION_SECONDS = 44;

/** Count-up animation length for statistics, in seconds. */
export const COUNTER_DURATION = 2;

/**
 * Landing hero, as the first section scrolls up over it: how far it shrinks
 * and fades. Small on purpose — it should read as stepping back, not leaving.
 */
export const HERO_RECEDE = { scale: 0.9, opacity: 0.35 } as const;
