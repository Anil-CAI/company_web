import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge, taught about our custom type scale.
 *
 * Without this, `text-display-md` is parsed as a text *colour* (the name is not
 * in the default font-size scale) and any later `text-*` colour class silently
 * removes it — headings quietly collapse to 16px. Declaring the custom sizes as
 * font-size keeps both classes alive.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: ['display-sm', 'display-md', 'display-lg', 'display-xl', 'eyebrow'],
        },
      ],
    },
  },
});

/**
 * Merge conditional class names, with Tailwind conflict resolution.
 * The single canonical class helper — never concatenate classes by hand.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
