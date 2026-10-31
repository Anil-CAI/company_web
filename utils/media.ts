import type { ImageMedia, MediaRatio, VideoMedia } from '@/types/media';

/**
 * Media helpers.
 *
 * The whole placeholder system hinges on one rule: an empty `src` means "not
 * supplied yet" and the UI must render a placeholder instead of a broken asset.
 */

/*
 * These return plain booleans rather than type predicates on purpose: the slot
 * types are identical whether or not a `src` is set, so narrowing would collapse
 * the placeholder branch to `never`.
 */

/** True when the image slot has a real asset behind it. */
export function hasImage(media: ImageMedia | undefined): boolean {
  return Boolean(media && media.src.trim().length > 0);
}

/** True when the video slot has a real asset behind it. */
export function hasVideo(media: VideoMedia | undefined): boolean {
  return Boolean(media && media.src.trim().length > 0);
}

/** True when a text value has been filled in (contact rows, years, handles). */
export function hasValue(value: string | undefined | null): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Tailwind aspect-ratio class for each supported media ratio. */
export const RATIO_CLASS: Record<MediaRatio, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  tall: 'aspect-[9/16]',
  wide: 'aspect-[16/10]',
  ultrawide: 'aspect-[21/9]',
};
