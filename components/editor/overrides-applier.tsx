'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';

import { isEditorNode, safeQuery } from '@/components/editor/editor-dom';
import { originalText, overridesStore } from '@/components/editor/overrides-store';
import {
  BAKED_STYLE_ID,
  LIVE_STYLE_ID,
  normalisePath,
  overridesToCss,
  PATH_ATTR,
  textEntriesFor,
} from '@/lib/site-overrides';
import type { SiteOverrides } from '@/types/site-overrides';

/**
 * Applies the editor's overrides on every page, for every visitor.
 *
 * Styling, hiding and the theme arrive as a stylesheet the server already
 * rendered, so they are in place on first paint. This component handles the
 * two things CSS cannot do: keeping `<html data-site-path>` in step with
 * client-side navigation, and replacing text.
 *
 * Text is re-applied when the DOM changes, because some sections render after
 * hydration (lazy WebGL, reveals) and a page transition swaps the whole tree.
 */

/* Elements currently showing replaced text, by selector. */
const applied = new Map<string, Element>();

function setText(el: Element, text: string) {
  const only = el.childNodes.length === 1 ? el.firstChild : null;
  /* Reuse React's own text node where there is one, so React keeps its handle. */
  if (only && only.nodeType === Node.TEXT_NODE) only.nodeValue = text;
  else el.textContent = text;
}

function applyText(entries: [string, string][]) {
  const wanted = new Map(entries);

  for (const [selector, el] of applied) {
    if (!el.isConnected) {
      applied.delete(selector);
    } else if (!wanted.has(selector)) {
      /* The edit was revoked: put the original words back. */
      const original = originalText.get(el);
      if (original !== undefined && el.textContent !== original) setText(el, original);
      applied.delete(selector);
    }
  }

  for (const [selector, text] of wanted) {
    const el = safeQuery(selector);
    if (!el || isEditorNode(el) || (el instanceof HTMLElement && el.isContentEditable)) continue;
    if (!originalText.has(el)) originalText.set(el, el.textContent ?? '');
    if (el.textContent !== text) setText(el, text);
    applied.set(selector, el);
  }
}

interface OverridesApplierProps {
  /** The overrides baked into this build. */
  initial: SiteOverrides;
}

export function OverridesApplier({ initial }: OverridesApplierProps) {
  React.useState(() => overridesStore.init(initial));

  const state = React.useSyncExternalStore(
    overridesStore.subscribe,
    overridesStore.get,
    () => initial,
  );
  const path = normalisePath(usePathname() ?? '/');

  React.useEffect(() => {
    document.documentElement.setAttribute(PATH_ATTR, path);
  }, [path]);

  /*
   * Once the editor changes anything, the baked stylesheet is stale: write a
   * live one and switch the baked one off rather than editing server markup.
   */
  React.useEffect(() => {
    if (state === initial) return;
    let live = document.getElementById(LIVE_STYLE_ID);
    if (!live) {
      live = document.createElement('style');
      live.id = LIVE_STYLE_ID;
      document.head.appendChild(live);
    }
    live.textContent = overridesToCss(state);
    document.getElementById(BAKED_STYLE_ID)?.setAttribute('media', 'not all');
  }, [state, initial]);

  React.useEffect(() => {
    const entries = textEntriesFor(state, path);
    if (entries.length === 0 && applied.size === 0) return;

    let frame = 0;
    let applying = false;
    let observer: MutationObserver | null = null;

    const run = () => {
      frame = 0;
      applying = true;
      try {
        applyText(entries);
      } finally {
        observer?.takeRecords();
        applying = false;
      }
    };

    observer = new MutationObserver((records) => {
      if (applying || frame) return;
      if (records.every((record) => isEditorNode(record.target))) return;
      frame = requestAnimationFrame(run);
    });

    run();
    if (entries.length > 0) {
      observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    }

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [state, path]);

  return null;
}
