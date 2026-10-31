'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import { overridesStore } from '@/components/editor/overrides-store';
import { EDITOR_API, sanitizeOverrides } from '@/lib/site-overrides';

/**
 * Loads the visual editor only where it can work.
 *
 * On any host but localhost this renders nothing and makes no request, so
 * visitors never download the editor. On localhost it asks the save endpoint
 * whether editing is switched on (`npm run edit`); a plain `npm run start`
 * answers 404 and the page stays a normal page.
 */

const SiteEditor = dynamic(
  () => import('@/components/editor/site-editor').then((m) => m.SiteEditor),
  { ssr: false },
);

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

export function SiteEditorLoader() {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (!LOCAL_HOSTS.has(window.location.hostname)) return;
    let cancelled = false;

    fetch(EDITOR_API, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { enabled?: boolean; overrides?: unknown } | null) => {
        if (cancelled || !data?.enabled) return;
        /* The file on disk is newer than the build if edits were saved since. */
        overridesStore.set(sanitizeOverrides(data.overrides));
        setEnabled(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return enabled ? <SiteEditor /> : null;
}
