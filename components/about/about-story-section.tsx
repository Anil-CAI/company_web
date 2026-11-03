import * as React from 'react';

import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { TeamPortrait } from '@/components/about/team-portrait';
import { AsciiGlitchRipple } from '@/components/ui/ascii-glitch-ripple';
import { SECTION_IDS } from '@/constants/routes';
import { company } from '@/data/company';
import { teamContent } from '@/data/team';

/**
 * The founding story.
 *
 * Prose in a single measured column rather than a feature grid — this is the
 * one part of the site a visitor reads rather than scans, and breaking it into
 * cards would fight that. The founder card sits at the end as the signature on
 * the story, not as a separate biography section.
 */
export function AboutStorySection() {
  const { story, founder } = teamContent;

  return (
    <Section id={SECTION_IDS.story} tone="paper" bordered>
      <SectionHeading
        id={`${SECTION_IDS.story}-title`}
        eyebrow={story.eyebrow}
        title={story.title}
      />

      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <div className="max-w-prose space-y-6 lg:col-span-7">
          {story.body.map((paragraph) => (
            <Reveal key={paragraph.slice(0, 40)}>
              <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal variant="slide-right" className="lg:col-span-5">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex items-center gap-5">
              <TeamPortrait member={founder} />
              <div>
                {/*
                  The founder's name scrambles through an ASCII ripple on
                  hover. Rendered `as="p"` rather than the component's default
                  anchor — there is nothing to link to, and a link that goes
                  nowhere is worse than plain text. The resolved name is the
                  real DOM content, so a screen reader reads it normally and a
                  no-JS visitor sees it unanimated.
                */}
                <AsciiGlitchRipple
                  as="p"
                  className="cursor-default text-lg font-medium tracking-tight"
                >
                  {founder.name}
                </AsciiGlitchRipple>
                <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {founder.role}
                </p>
              </div>
            </div>

            {/*
              The founder's note scrambles on hover like the name above it, so
              the whole card reacts as one object rather than having a single
              live word sitting in static text. `as="p"` again — nothing to
              link to — and the component resolves to the real sentence, so
              screen readers and no-JS visitors read it plainly.
            */}
            {founder.note ? (
              <AsciiGlitchRipple
                as="p"
                dur={1400}
                spread={1.6}
                /* `block` overrides the component's `inline-block`, which would
                   shrink-wrap the paragraph instead of filling the card. */
                className="mt-6 block cursor-default text-sm leading-relaxed text-muted-foreground text-pretty"
              >
                {founder.note}
              </AsciiGlitchRipple>
            ) : null}

            {/* Founded year comes from `data/company.ts`, not a second copy here. */}
            <dl className="mt-8 flex gap-8 border-t border-border pt-6">
              <div>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-400">
                  Founded
                </dt>
                <dd className="mt-1.5 text-sm font-medium">{company.founded}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-400">
                  Based in
                </dt>
                <dd className="mt-1.5 text-sm font-medium">Kakinada, India</dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
