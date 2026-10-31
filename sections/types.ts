import type { ComponentType } from 'react';

/**
 * A page-level section entry.
 *
 * Pages render an ordered array of these instead of hardcoding a JSX stack, so
 * resequencing a page is a one-line data change rather than a refactor.
 */
export interface PageSection {
  /** Stable key — matches the section's DOM id where one exists. */
  id: string;
  /** The section component. Takes no props by design. */
  Component: ComponentType;
}
