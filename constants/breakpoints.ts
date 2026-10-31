/**
 * Breakpoints mirrored from `tailwind.config.ts`.
 * Used by `useMediaQuery` so JS and CSS never drift apart.
 */

export const BREAKPOINTS = {
  xs: 420,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/** `min-width` media query string for a breakpoint. */
export function up(key: BreakpointKey): string {
  return `(min-width: ${BREAKPOINTS[key]}px)`;
}

/** `max-width` media query string for a breakpoint (exclusive). */
export function down(key: BreakpointKey): string {
  return `(max-width: ${BREAKPOINTS[key] - 0.02}px)`;
}

/** Matches users who asked the OS to reduce motion. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
