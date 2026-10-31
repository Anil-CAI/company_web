'use client';

import type { SiteOverrides } from '@/types/site-overrides';

/**
 * The live overrides, shared between the applier (every visitor) and the
 * editor (localhost only). A module-level store rather than React context so
 * the editor can be lazy-loaded into a different part of the tree.
 */

type Listener = () => void;

let current: SiteOverrides | null = null;
const listeners = new Set<Listener>();

export const overridesStore = {
  /** First caller wins — the baked overrides from the server. */
  init(value: SiteOverrides) {
    if (current === null) current = value;
  },
  get(): SiteOverrides {
    return current as SiteOverrides;
  },
  set(value: SiteOverrides) {
    current = value;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

/**
 * Each element's text before any override touched it, so revoking a text edit
 * can put the original back. Weak, so unmounted elements are not retained.
 */
export const originalText = new WeakMap<Element, string>();

/** Record an element's current text as its original, if not already known. */
export function rememberOriginalText(el: Element) {
  if (!originalText.has(el)) originalText.set(el, el.textContent ?? '');
}
