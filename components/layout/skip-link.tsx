import * as React from 'react';

import { SECTION_IDS } from '@/constants/routes';

/**
 * Keyboard skip link.
 * Hidden until focused, then jumps past the header straight to page content.
 */
export function SkipLink() {
  return (
    <a href={`#${SECTION_IDS.main}`} className="skip-link">
      Skip to main content
    </a>
  );
}
