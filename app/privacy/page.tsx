import type { Metadata } from 'next';
import * as React from 'react';

import { Container } from '@/components/common/container';
import { Reveal } from '@/components/common/reveal';
import { ROUTES } from '@/constants/routes';
import { privacyPolicy } from '@/data/privacy';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: privacyPolicy.title,
  description:
    'What KRL Labs collects through the contact form, why, and how to have it deleted.',
  path: ROUTES.privacy,
});

/**
 * Privacy policy.
 *
 * A plain prose page rather than a composed section stack: it has one job, it
 * is read top to bottom, and the section registry would add indirection for a
 * page that will never be reordered.
 */
export default function PrivacyPage() {
  const updated = new Date(privacyPolicy.updated).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Container className="py-section">
      <Reveal className="max-w-prose">
        <p className="eyebrow text-muted-foreground">Legal</p>
        <h1 className="mt-6 text-display-md font-medium tracking-tight text-headline">{privacyPolicy.title}</h1>

        <p className="mt-8 text-lg leading-relaxed text-muted-foreground text-pretty">
          {privacyPolicy.summary}
        </p>

        <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-400">
          Last updated {updated}
        </p>
      </Reveal>

      <div className="mt-20 max-w-prose space-y-14">
        {privacyPolicy.sections.map((section) => (
          <Reveal key={section.id}>
            <section aria-labelledby={`${section.id}-title`}>
              <h2
                id={`${section.id}-title`}
                className="text-2xl font-medium tracking-tight"
              >
                {section.heading}
              </h2>

              <div className="mt-5 space-y-4">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-base leading-relaxed text-muted-foreground text-pretty"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
