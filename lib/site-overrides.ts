import type {
  EditableStyleProp,
  ElementOverride,
  OverrideBucket,
  SiteOverrides,
  ThemeToken,
} from '@/types/site-overrides';

/**
 * The visual editor's rules, shared by the server (baking the stylesheet,
 * validating saves) and the browser (applying edits live).
 *
 * Overrides end up inside a `<style>` tag on every page, so everything here is
 * whitelist-and-validate: an unknown property is dropped, and a value that
 * could close the rule or the tag (`;`, `{`, `}`, `<`) never survives
 * `sanitizeOverrides`. That holds whether the file was written by the editor
 * or edited by hand.
 */

export const EDITABLE_STYLE_PROPS: readonly EditableStyleProp[] = [
  'color',
  'background-color',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-transform',
  'display',
  'width',
  'max-width',
  'min-height',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-bottom',
  'border-radius',
  'opacity',
  /* Moves an element without disturbing layout or the animations' own `transform`. */
  'translate',
];

/** Palette tokens the Theme tab exposes, in the order it lists them. */
export const THEME_TOKENS: readonly { token: ThemeToken; label: string }[] = [
  { token: 'background', label: 'Page background' },
  { token: 'card', label: 'Cards' },
  { token: 'secondary', label: 'Raised surfaces' },
  { token: 'muted', label: 'Muted surfaces' },
  { token: 'border', label: 'Borders' },
  { token: 'signal', label: 'Large headings (h1, h2)' },
  { token: 'snow', label: 'Reading text (h3–h6, paragraphs)' },
  { token: 'foreground', label: 'UI text' },
  { token: 'muted-foreground', label: 'Muted text' },
  { token: 'primary', label: 'Buttons' },
  { token: 'accent', label: 'Accent' },
];

/** Attribute on `<html>` carrying the current route, for page-scoped rules. */
export const PATH_ATTR = 'data-site-path';
export const BAKED_STYLE_ID = 'site-overrides-baked';
export const LIVE_STYLE_ID = 'site-overrides-live';
export const EDITOR_API = '/api/site-editor';

/** Bounds on the root font-size scale, in percent. */
export const SCALE_MIN = 70;
export const SCALE_MAX = 150;

const SELECTOR_RE = /^[A-Za-z0-9#.\-_>:()\s\\]{1,600}$/;
const VALUE_RE = /^[#A-Za-z0-9.%\s(),\-+/]{1,80}$/;
const HSL_RE = /^\d{1,3}(\.\d+)?\s+\d{1,3}(\.\d+)?%\s+\d{1,3}(\.\d+)?%$/;
const PATH_RE = /^\/[A-Za-z0-9\-_/]{0,100}$/;

const STYLE_SET = new Set<string>(EDITABLE_STYLE_PROPS);
const TOKEN_SET = new Set<string>(THEME_TOKENS.map((t) => t.token));

export function emptyOverrides(): SiteOverrides {
  return { version: 1, theme: {}, global: {}, pages: {} };
}

/** "/services/" and "/services" are the same page; "" is the home page. */
export function normalisePath(path: string): string {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function isEmptyOverride(o: ElementOverride): boolean {
  return !o.hidden && o.text === undefined && (!o.style || Object.keys(o.style).length === 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeElement(input: unknown): ElementOverride | null {
  if (!isRecord(input)) return null;
  const out: ElementOverride = {};

  if (typeof input.label === 'string') out.label = input.label.slice(0, 120);
  if (typeof input.text === 'string') out.text = input.text.slice(0, 4000);
  if (input.hidden === true) out.hidden = true;

  if (isRecord(input.style)) {
    const style: ElementOverride['style'] = {};
    for (const [prop, value] of Object.entries(input.style)) {
      if (STYLE_SET.has(prop) && typeof value === 'string' && VALUE_RE.test(value)) {
        style[prop as EditableStyleProp] = value.trim();
      }
    }
    if (Object.keys(style).length > 0) out.style = style;
  }

  return isEmptyOverride(out) ? null : out;
}

function sanitizeBucket(input: unknown): OverrideBucket {
  const out: OverrideBucket = {};
  if (!isRecord(input)) return out;
  for (const [selector, value] of Object.entries(input)) {
    if (!SELECTOR_RE.test(selector)) continue;
    const clean = sanitizeElement(value);
    if (clean) out[selector] = clean;
  }
  return out;
}

/** Coerce anything — a request body, a hand-edited file — into safe overrides. */
export function sanitizeOverrides(input: unknown): SiteOverrides {
  const out = emptyOverrides();
  if (!isRecord(input)) return out;

  if (typeof input.scale === 'number' && Number.isFinite(input.scale)) {
    const scale = Math.round(input.scale);
    if (scale >= SCALE_MIN && scale <= SCALE_MAX && scale !== 100) out.scale = scale;
  }

  if (isRecord(input.theme)) {
    for (const [token, value] of Object.entries(input.theme)) {
      if (TOKEN_SET.has(token) && typeof value === 'string' && HSL_RE.test(value.trim())) {
        out.theme[token as ThemeToken] = value.trim();
      }
    }
  }

  out.global = sanitizeBucket(input.global);

  if (isRecord(input.pages)) {
    for (const [path, bucket] of Object.entries(input.pages)) {
      if (!PATH_RE.test(path)) continue;
      const clean = sanitizeBucket(bucket);
      if (Object.keys(clean).length > 0) out.pages[normalisePath(path)] = clean;
    }
  }

  return out;
}

function ruleFor(prefix: string, selector: string, o: ElementOverride): string {
  let decls = '';
  for (const [prop, value] of Object.entries(o.style ?? {})) {
    decls += `${prop}:${value} !important;`;
  }
  /* Last, so a hidden element stays hidden even if `display` was also set. */
  if (o.hidden) decls += 'display:none !important;';
  return decls ? `${prefix}${selector}{${decls}}` : '';
}

/**
 * The stylesheet for a set of overrides.
 *
 * Page rules are prefixed with the route attribute on `<html>`, so one
 * stylesheet serves every page and client-side navigation needs no rewrite —
 * only the attribute changes. `!important` is what lets an edit beat the
 * Tailwind utility it is overriding without knowing which one that was.
 */
export function overridesToCss(input: SiteOverrides): string {
  const o = sanitizeOverrides(input);
  const parts: string[] = [];

  if (o.scale) parts.push(`html{font-size:${o.scale}% !important}`);

  const vars = Object.entries(o.theme)
    .map(([token, value]) => `--${token}:${value} !important;`)
    .join('');
  if (vars) parts.push(`:root{${vars}}`);

  for (const [selector, el] of Object.entries(o.global)) {
    parts.push(ruleFor('', selector, el));
  }
  for (const [path, bucket] of Object.entries(o.pages)) {
    const prefix = `html[${PATH_ATTR}="${path}"] `;
    for (const [selector, el] of Object.entries(bucket)) {
      parts.push(ruleFor(prefix, selector, el));
    }
  }

  return parts.filter(Boolean).join('\n');
}

/** Text replacements that apply on `path`: the page's own plus the global ones. */
export function textEntriesFor(o: SiteOverrides, path: string): [string, string][] {
  const entries: [string, string][] = [];
  for (const bucket of [o.global, o.pages[path] ?? {}]) {
    for (const [selector, el] of Object.entries(bucket)) {
      if (el.text !== undefined && !el.hidden) entries.push([selector, el.text]);
    }
  }
  return entries;
}
