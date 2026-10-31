import * as React from 'react';

import { OverridesApplier } from '@/components/editor/overrides-applier';
import { BAKED_STYLE_ID, overridesToCss, PATH_ATTR } from '@/lib/site-overrides';
import { readOverrides } from '@/lib/site-overrides-server';

/**
 * Bakes the editor's saved overrides into the page.
 *
 * The route attribute is set by an inline script before first paint, so
 * page-scoped rules match immediately instead of flashing the unedited page.
 * Everything in the stylesheet has passed `sanitizeOverrides`, which is what
 * makes rendering it as raw CSS safe.
 */

/* Same rule as `normalisePath`, written out because it runs before any bundle. */
const PATH_SCRIPT = `document.documentElement.setAttribute(${JSON.stringify(PATH_ATTR)},location.pathname.replace(/\\/+$/,'')||'/')`;

export function SiteOverrides() {
  const overrides = readOverrides();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PATH_SCRIPT }} />
      <style id={BAKED_STYLE_ID} dangerouslySetInnerHTML={{ __html: overridesToCss(overrides) }} />
      <OverridesApplier initial={overrides} />
    </>
  );
}
