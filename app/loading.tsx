import * as React from 'react';

import { Container } from '@/components/common/container';

/**
 * Route loading state.
 * A quiet skeleton rather than a spinner — matches the site's stillness.
 */
export default function Loading() {
  return (
    <Container className="py-section" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>

      <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
      <div className="mt-10 h-14 w-full max-w-2xl animate-pulse rounded-2xl bg-muted" />
      <div className="mt-4 h-14 w-full max-w-xl animate-pulse rounded-2xl bg-muted" />

      <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-56 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </Container>
  );
}
