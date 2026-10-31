import { Instrument_Sans, Inter, JetBrains_Mono } from 'next/font/google';

/**
 * Typography.
 *
 * Inter carries the Apple-inspired display scale (tight tracking, optical
 * sizing). JetBrains Mono is reserved for eyebrows, indices and chips, where a
 * technical voice reads better than the sans.
 */

export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  axes: ['opsz'],
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
});

/** The landing hero's face, carried over from its design. */
export const fontHero = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hero',
  weight: ['400', '500', '600'],
});

/** Applied on `<html>` so every family is available everywhere. */
export const fontVariables = `${fontSans.variable} ${fontMono.variable} ${fontHero.variable}`;
