import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * KRL design system.
 *
 * The palette is warm: kumkuma (maroon), pasupu (turmeric) and a wheatish skin
 * tone, over a golden-beige page with a maroon-biased ink. The light end of the
 * `ink` ramp is rebased on the beige page rather than on white — a step lighter
 * than the page would be invisible on it.
 * Everything is driven by CSS variables declared in `styles/globals.css`, so a
 * future theme (or a dark mode) only needs new variable values.
 */
const config: Config = {
  darkMode: ['class'],
  /*
   * Every folder that can contain a class string must be listed. `utils` and
   * `constants` matter as much as `components`: class maps such as
   * `RATIO_CLASS` live there, and anything unscanned is silently dropped from
   * the generated CSS.
   */
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './sections/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './types/**/*.{ts,tsx}',
    './utils/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2.5rem',
        xl: '4rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      screens: {
        xs: '420px',
        '3xl': '1728px',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        /**
         * Warm ramp used for hairlines, placeholders and quiet surfaces.
         *
         * Every step carries the same warm bias as the surfaces — a neutral
         * grey ramp on a tinted page reads as dirty, because the eye compares
         * it against the surrounding warmth rather than against white.
         */
        /*
         * Ink ramp — inverted for the dark royal-purple page.
         *
         * The scale still runs 50 → 950, and every existing usage still means
         * the same thing: `ink-400` is muted text, `ink-300` a hover hairline.
         * What changed is which end is light. On the old beige sheet 50 was
         * the near-white page and 950 the near-black ink; here 50 sits nearest
         * the *ink* and 950 nearest the *page*, so `text-ink-400` goes on
         * reading as a step back from the foreground rather than inverting
         * into something invisible.
         *
         * The violet bias is deliberate and carries the same reasoning the
         * warm ramp did: a stock grey dropped on a saturated purple reads as
         * dirty, because the eye compares it against the surrounding colour.
         * `ink-400` clears 6.9:1 on the page and 6.2:1 on a card.
         */
        ink: {
          50: '#F5F2F8',
          100: '#EBE5F1',
          200: '#DCD1E5',
          300: '#C8B7D7',
          400: '#AE98C3',
          500: '#9479AF',
          600: '#765798',
          700: '#5D447E',
          800: '#43305F',
          900: '#301F47',
          950: '#1C102D',
        },
        /** The three brand colours, for the few places that name them directly. */
        /*
         * Display colour for large headings — swap in `globals.css`.
         *
         * Named `headline`, not `display`: `text-display` would be ambiguous
         * with the `display-sm|md|lg` font-size scale below and Tailwind drops
         * the class entirely rather than guessing.
         */
        headline: 'hsl(var(--display))',
        /** Soft snow white — reading text (h3–h6 and prose). */
        snow: 'hsl(var(--snow))',
        /** Signal red — h1, h2 and the display sizes. Large text only. */
        signal: 'hsl(var(--signal))',
        kumkuma: 'hsl(var(--kumkuma))',
        pasupu: 'hsl(var(--pasupu))',
        skin: 'hsl(var(--skin))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        /** Apple-inspired display scale: tight tracking, generous size. */
        'display-sm': ['clamp(2.25rem, 5vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(2.75rem, 7vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(3.25rem, 9vw, 6.5rem)', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
        'display-xl': ['clamp(4rem, 12vw, 9rem)', { lineHeight: '0.94', letterSpacing: '-0.045em' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      spacing: {
        section: 'clamp(6rem, 12vw, 11rem)',
        'section-sm': 'clamp(4rem, 8vw, 7rem)',
        gutter: 'clamp(1.25rem, 4vw, 4rem)',
      },
      maxWidth: {
        shell: '1440px',
        prose: '68ch',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(60, 24, 28, 0.05), 0 8px 24px -12px rgba(60, 24, 28, 0.12)',
        lift: '0 2px 4px rgba(60, 24, 28, 0.05), 0 24px 48px -24px rgba(60, 24, 28, 0.24)',
        float: '0 40px 80px -40px rgba(60, 24, 28, 0.32)',
      },
      transitionTimingFunction: {
        /** Shared easing curve — mirrors `constants/animation.ts`. */
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0, 0, 0)' },
          to: { transform: 'translate3d(-50%, 0, 0)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'accordion-down': 'accordion-down 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'accordion-up': 'accordion-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 2.4s infinite',
      },
    },
  },
  plugins: [animate],
};

export default config;
