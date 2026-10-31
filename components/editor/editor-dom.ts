'use client';

/**
 * DOM helpers for the visual editor: addressing elements by a selector that
 * survives a reload, and converting between the colour formats the browser
 * reports and the ones the editor stores.
 */

/** Marks the editor's own UI so it is never selectable or overridden. */
export const EDITOR_ATTR = 'data-site-editor';

const STABLE_ID = /^[A-Za-z][\w-]*$/;

/* Landmarks that are unique on every page, so they can anchor a selector. */
const LANDMARKS = new Set(['header', 'footer', 'main']);

const INLINE_TAGS = new Set([
  'SPAN',
  'STRONG',
  'EM',
  'B',
  'I',
  'A',
  'BR',
  'SMALL',
  'SUP',
  'SUB',
  'MARK',
  'CODE',
  'ABBR',
  'TIME',
]);

export function isEditorNode(node: Node | null): boolean {
  const el = node instanceof Element ? node : node?.parentElement;
  return Boolean(el?.closest(`[${EDITOR_ATTR}]`));
}

/**
 * The element the editor should act on for a pointer target.
 *
 * Inside an SVG the target is a path or a group nobody means to edit; the
 * drawing as a whole is the useful unit.
 */
export function editableTarget(target: EventTarget | null): Element | null {
  if (!(target instanceof Element) || isEditorNode(target)) return null;
  let el: Element = target;
  for (let svg = el.closest('svg'); svg; svg = svg.parentElement?.closest('svg') ?? null) {
    el = svg;
  }
  if (el === document.body || el === document.documentElement) return null;
  return el;
}

/**
 * A selector for `el` that resolves to the same element after a reload.
 *
 * It anchors at the nearest unique id (every section has one) or landmark,
 * then descends by `nth-of-type`. Anchoring matters: a path counted from
 * `<body>` would shift whenever the boot screen or the editor mounted.
 * Generated ids (React's `:r1:`, Radix's) change between renders and are
 * skipped.
 */
export function selectorFor(el: Element): string {
  const segments: string[] = [];
  let node: Element | null = el;

  while (node && node !== document.documentElement) {
    if (node === document.body) {
      segments.unshift('body');
      break;
    }

    const id = node.id;
    if (id && STABLE_ID.test(id) && document.querySelectorAll(`#${CSS.escape(id)}`).length === 1) {
      segments.unshift(`#${CSS.escape(id)}`);
      break;
    }

    const tag = node.localName;
    if (LANDMARKS.has(tag) && document.getElementsByTagName(tag).length === 1) {
      segments.unshift(tag);
      break;
    }

    let index = 1;
    for (let sib = node.previousElementSibling; sib; sib = sib.previousElementSibling) {
      if (sib.localName === tag) index += 1;
    }
    segments.unshift(`${tag}:nth-of-type(${index})`);
    node = node.parentElement;
  }

  return segments.join(' > ');
}

export function safeQuery(selector: string): Element | null {
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

/** Header, footer and the rest of the chrome are shared by every page. */
export function isGlobalElement(el: Element): boolean {
  return !el.closest('main');
}

/** "h3 · Industrial Automation" — what the Changes list shows. */
export function describe(el: Element): string {
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  const snippet = text.length > 42 ? `${text.slice(0, 42)}…` : text;
  return snippet ? `${el.localName} · ${snippet}` : el.localName;
}

/**
 * Whether double-click text editing is safe here: the element holds text and
 * nothing but inline formatting, so replacing its text loses no structure.
 */
export function isTextEditable(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (!(el.textContent ?? '').trim()) return false;
  return Array.from(el.querySelectorAll('*')).every((child) => INLINE_TAGS.has(child.tagName));
}

/* ---------------------------------------------------------------- colour -- */

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const hex2 = (n: number) =>
  Math.round(clamp(n, 0, 255))
    .toString(16)
    .padStart(2, '0');

/** "rgb(12, 34, 56)" / "rgb(12 34 56 / .5)" → "#0c2238"; transparent → null. */
export function cssColorToHex(value: string): string | null {
  const nums = value.match(/[\d.]+/g)?.map(Number);
  if (!nums || nums.length < 3) return null;
  if (nums.length >= 4 && nums[3] === 0) return null;
  return `#${hex2(nums[0])}${hex2(nums[1])}${hex2(nums[2])}`;
}

/** "265 48% 12%" → "#1c102d". */
export function hslTripletToHex(triplet: string): string {
  const [h = 0, s = 0, l = 0] = triplet.match(/[\d.]+/g)?.map(Number) ?? [];
  const S = s / 100;
  const L = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `#${hex2(f(0) * 255)}${hex2(f(8) * 255)}${hex2(f(4) * 255)}`;
}

/** "#1c102d" → "265 48% 12%" — the format the `:root` tokens use. */
export function hexToHslTriplet(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
