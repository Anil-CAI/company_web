/** Pure formatting helpers. No React, no side effects. */

/** Locale-aware thousands separator. */
export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Zero-pad an index for display, e.g. 3 -> "03". */
export function padIndex(index: number, length = 2): string {
  return String(index).padStart(length, '0');
}

/** URL-safe slug from arbitrary text. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** First letters of each word, capped — used for logo monograms. */
export function initials(input: string, max = 2): string {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/** Truncate to a character budget without cutting mid-word. */
export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  const clipped = input.slice(0, maxLength);
  return `${clipped.slice(0, clipped.lastIndexOf(' '))}…`;
}
