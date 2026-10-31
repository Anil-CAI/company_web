import Link from 'next/link';
import * as React from 'react';

import { Container } from '@/components/common/container';
import { MagneticButton } from '@/components/common/magnetic-button';
import { ROUTES } from '@/constants/routes';

/** 404 page — same typographic language as the rest of the site. */
export default function NotFound() {
  return (
    <Container className="flex min-h-[70svh] flex-col justify-center py-section">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-8 max-w-2xl text-display-md font-medium tracking-tight">
        This page does not exist.
      </h1>
      <p className="mt-6 max-w-prose text-base leading-relaxed text-muted-foreground">
        The link may be out of date, or the page may have moved. Everything lives across three
        pages — start from one of them.
      </p>

      <div className="mt-12 flex flex-wrap gap-4">
        <MagneticButton asChild>
          <Link href={ROUTES.home}>Back to home</Link>
        </MagneticButton>
        <MagneticButton asChild variant="outline">
          <Link href={ROUTES.contact}>Contact us</Link>
        </MagneticButton>
      </div>
    </Container>
  );
}
