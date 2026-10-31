import * as React from 'react';

import { Reveal, RevealGroup, RevealItem } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { SectionHeading } from '@/components/common/section-heading';
import { PlaceholderVideo } from '@/components/common/placeholder-video';
import { DanceFigure } from '@/components/home/dance-figure';
import { DanceShowcase } from '@/components/home/dance-showcase';
import { Badge } from '@/components/ui/badge';
import { SECTION_IDS } from '@/constants/routes';
import { homeContent } from '@/data/content';
import { danceModels } from '@/data/dance';

/**
 * Robot dance routines.
 *
 * Both routines run on the G1 humanoid, so every card draws the biped figure —
 * there is no platform-to-figure mapping to make. The figures run on CSS
 * keyframes at the tempo their first move specifies, so the section stays a
 * server component: no client runtime for what is ultimately a looping drawing.
 */
export function DanceSection() {
  const content = homeContent.dance;

  return (
    <Section id={SECTION_IDS.dance} bordered>
      <SectionHeading
        id={`${SECTION_IDS.dance}-title`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      {/* The 3D shelf — one spine per routine, growing with the data. */}
      <DanceShowcase />

      {/*
        Two routines across the full content width.

        The grid was previously capped at `max-w-5xl`, which left a dead column
        of white down the right of an otherwise full-width section. Two cards
        sharing the whole width read as a deliberate pair; two cards hugging the
        left read as a row that failed to finish.
      */}
      <RevealGroup className="mt-20 grid gap-8 md:grid-cols-2">
        {danceModels.map((model) => {
          /* The card's tempo is its opening move — the one the figure dances. */
          const lead = model.moves[0];

          return (
            <RevealItem key={model.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                {/*
                  Real footage when we have it; the ruled stage with the
                  animated figure is the fallback for a routine not yet filmed.
                  The clip wins because a drawing of a robot dancing is a stand-
                  in for exactly this.
                */}
                {model.video ? (
                  <PlaceholderVideo
                    media={model.video}
                    ratio="video"
                    className="rounded-none border-0 border-b border-border"
                  />
                ) : (
                  <div className="relative border-b border-border bg-ink-50">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(rgba(90,40,34,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(90,40,34,0.05)_1px,transparent_1px)] bg-[size:22px_22px]"
                    />
                    <DanceFigure
                      kind="biped"
                      bpm={lead ? lead.bpm : 100}
                      className="relative aspect-[4/3] p-4"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {model.platform}
                    </span>
                    <span aria-hidden="true" className="h-px w-8 bg-border" />
                  </div>

                  <h3 className="mt-4 text-2xl font-medium tracking-tight">{model.track.title}</h3>

                  {/* The track is the routine's identity, so the film is credited under it. */}
                  <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-400">
                    {model.track.film}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {model.summary}
                  </p>

                  {/* Moves — the actual choreography, listed like spec rows. */}
                  <dl className="mt-7 space-y-4 border-t border-border pt-6">
                    {model.moves.map((move) => (
                      <div key={move.id} className="flex gap-4">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 font-mono text-[0.6875rem] text-ink-400"
                        >
                          {move.marker}
                        </span>
                        <div className="min-w-0">
                          <dt className="flex flex-wrap items-baseline gap-x-3 text-sm font-medium">
                            {move.name}
                            <span className="font-mono text-[0.6875rem] text-ink-400">
                              {move.bpm} BPM · {move.dof}
                            </span>
                          </dt>
                          <dd className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                            {move.description}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>

                  {/* Capabilities sit last, pinned to the bottom of the card. */}
                  <div className="mt-auto flex flex-wrap gap-2 pt-7">
                    {model.capabilities.map((capability) => (
                      <Badge key={capability} variant="default">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <Reveal className="mt-14">
        <p className="max-w-prose font-mono text-[0.75rem] leading-relaxed text-ink-400">
          Figures animate at each model&rsquo;s own tempo. Motion pauses entirely for visitors who
          prefer reduced motion.
        </p>
      </Reveal>
    </Section>
  );
}
