/**
 * Visual-editor overrides.
 *
 * Everything the in-browser editor changes is stored as data in
 * `data/site-overrides.json` rather than patched into components, so the
 * content/presentation split still holds: components render what they always
 * rendered, and this layer restyles, re-words or hides the result.
 */

/** CSS properties the editor may set. Anything else is dropped on save. */
export type EditableStyleProp =
  | 'color'
  | 'background-color'
  | 'font-size'
  | 'font-weight'
  | 'font-style'
  | 'line-height'
  | 'letter-spacing'
  | 'text-align'
  | 'text-transform'
  | 'display'
  | 'width'
  | 'max-width'
  | 'min-height'
  | 'padding-top'
  | 'padding-right'
  | 'padding-bottom'
  | 'padding-left'
  | 'margin-top'
  | 'margin-bottom'
  | 'border-radius'
  | 'opacity'
  | 'translate';

/** Palette tokens the editor exposes — names match the `:root` variables. */
export type ThemeToken =
  | 'background'
  | 'card'
  | 'secondary'
  | 'muted'
  | 'border'
  | 'signal'
  | 'snow'
  | 'foreground'
  | 'muted-foreground'
  | 'primary'
  | 'accent';

/** One element's edits. An empty override is deleted rather than stored. */
export interface ElementOverride {
  /** Human hint for the Changes list, captured when the edit was made. */
  label?: string;
  /** Replacement text. Applied with `textContent`, never as HTML. */
  text?: string;
  /** Removed from the page (`display: none`). Restorable from Changes. */
  hidden?: boolean;
  style?: Partial<Record<EditableStyleProp, string>>;
}

/** Overrides keyed by the element's CSS selector. */
export type OverrideBucket = Record<string, ElementOverride>;

export interface SiteOverrides {
  version: 1;
  /** Root font-size as a percentage — scales every rem-based size at once. */
  scale?: number;
  /** HSL triplets ("265 48% 12%"), the same format as `globals.css`. */
  theme: Partial<Record<ThemeToken, string>>;
  /** Header, footer and anything else outside `<main>` — every page. */
  global: OverrideBucket;
  /** Per-route edits, keyed by pathname ("/", "/services"). */
  pages: Record<string, OverrideBucket>;
}
