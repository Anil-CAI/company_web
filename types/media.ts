/**
 * Media contracts.
 *
 * Every media slot in the site is described by one of these objects. Leaving
 * `src` as an empty string is a first-class state: the UI renders a styled
 * placeholder instead. Drop a file into `/public/...` and set `src` to swap in
 * real media — no component changes required.
 */

export interface ImageMedia {
  /** Path under `/public`. Empty string renders a placeholder box. */
  src: string;
  /** Always required — placeholders still need an accessible description. */
  alt: string;
  /** Intrinsic width in px. Used when `src` is provided. */
  width?: number;
  /** Intrinsic height in px. Used when `src` is provided. */
  height?: number;
}

export interface VideoMedia {
  /** Path under `/public/videos`. Empty string renders a placeholder box. */
  src: string;
  /** Poster frame shown before playback. */
  poster?: string;
  /** Accessible label describing the clip. */
  label: string;
}

/**
 * Aspect ratios supported by the placeholder primitives.
 *
 * `portrait` is 3:4 — a tall frame, not a phone one. `tall` is 9:16, which is
 * what a clip recorded on a phone actually is; using `portrait` for those
 * letterboxes them with grey bars down both sides.
 */
export type MediaRatio = 'square' | 'video' | 'portrait' | 'tall' | 'wide' | 'ultrawide';
