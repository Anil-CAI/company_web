'use client';

import * as React from 'react';

import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Route-level error boundary. Client component by contract. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  React.useEffect(() => {
    // Surface the failure in development; wire to a reporter in production.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[70svh] flex-col justify-center py-section">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-8 max-w-2xl text-display-md font-medium tracking-tight">
        This page failed to load.
      </h1>
      <p className="mt-6 max-w-prose text-base leading-relaxed text-muted-foreground">
        An unexpected error interrupted rendering. Try again — if it persists, the details are in
        the browser console.
      </p>

      <div className="mt-12">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
      </div>
    </Container>
  );
}
