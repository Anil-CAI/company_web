'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { MagneticButton } from '@/components/common/magnetic-button';
import { PlaceholderImage } from '@/components/common/placeholder-image';
import { PlaceholderVideo } from '@/components/common/placeholder-video';
import { InViewAutoplay } from '@/components/projects/in-view-autoplay';
import { Reveal } from '@/components/common/reveal';
import { ProjectPlatforms } from '@/components/projects/project-platforms';
import { Badge } from '@/components/ui/badge';
import { useParallax } from '@/hooks/use-parallax';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';
import { padIndex } from '@/utils/format';
import { hasValue } from '@/utils/media';

interface ProjectCardProps {
  project: Project;
  /** Zero-based position — drives the displayed index and the layout flip. */
  index: number;
}

/**
 * Featured project row.
 *
 * A full-bleed editorial layout rather than a uniform grid tile: copy on one
 * side, a tall image frame and a wide clip strip on the other, mirrored on
 * alternating rows. Both media slots are placeholders until `image.src` /
 * `video.src` are filled in.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const isReversed = index % 2 === 1;
  /* 9:16 phone footage needs a width cap; 16:9 fills the column as before. */
  const isTall = project.videoRatio === 'tall';
  // Slow drift inside the image frame — the frame itself never moves.
  const parallaxRef = useParallax<HTMLDivElement>({ distance: 10 });

  return (
    <article
      className={cn(
        'group grid items-center gap-10 lg:grid-cols-12 lg:gap-16',
        // The media column swaps sides on odd rows.
        isReversed && 'lg:[&>*:first-child]:order-2',
      )}
    >
      {/* Copy column */}
      <Reveal
        variant={isReversed ? 'slide-right' : 'slide-left'}
        /* Narrows when the media column widens for landscape footage. */
        className={cn('lg:pr-4', isTall ? 'lg:col-span-5' : 'lg:col-span-4')}
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.6875rem] text-muted-foreground">
            {padIndex(index + 1)}
          </span>
          <span aria-hidden="true" className="h-px w-10 bg-border" />
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            {project.category}
          </span>
        </div>

        <h3 className="mt-8 text-display-sm font-medium tracking-tight">
          <Link
            href={project.href}
            className="transition-colors duration-500 ease-premium hover:text-ink-600"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-6 max-w-prose text-base leading-relaxed text-muted-foreground text-pretty">
          {project.summary}
        </p>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <li key={technology}>
              <Badge>{technology}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center gap-6">
          <MagneticButton asChild variant="outline">
            <Link href={project.href}>
              Read more
              <ArrowRight className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-1" />
            </Link>
          </MagneticButton>

          {hasValue(project.year) ? (
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              {project.year}
            </span>
          ) : null}
        </div>

        {/* Only projects carrying a capability matrix get the disclosure. */}
        {project.platforms && project.platforms.length > 0 ? (
          <ProjectPlatforms platforms={project.platforms} projectTitle={project.title} />
        ) : null}
      </Reveal>

      {/*
        Media column.

        Its width follows the footage. A pair of 9:16 phone clips is narrow
        enough to sit beside the copy in 7 of 12 columns; a 16:9 clip stacked
        above or below an image needs the extra width or it ends up a
        letterbox strip too small to watch.
      */}
      <Reveal variant="scale" className={cn(isTall ? 'lg:col-span-7' : 'lg:col-span-8')}>
        {/*
          Portrait footage goes side by side; landscape footage stacks.

          Two 9:16 frames side by side are each about half the column wide and
          still tall — they fill the row. Two 16:9 frames side by side are half
          as wide and therefore half as tall, which is what made the dance clip
          unwatchable. Stacked at full column width, a 16:9 clip gets roughly
          twice the area.

          `items-start` stops one frame stretching the other when the two
          aspect ratios differ.
        */}
        <div className={cn('grid items-start gap-4', isTall && 'sm:grid-cols-2')}>
          <div
            className={cn(
              'overflow-hidden rounded-2xl border border-border shadow-soft',
              'transition-shadow duration-700 ease-premium group-hover:shadow-lift',
            )}
          >
            {/* Oversized inner frame so the parallax never exposes an edge. */}
            <div ref={parallaxRef} className="scale-110">
              <PlaceholderImage
                media={project.image}
                /* Matches the clip, so the pair reads as one block. */
                ratio={isTall ? 'tall' : 'video'}
                className="rounded-none border-0"
                innerClassName="transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
                sizes={
                  isTall
                    ? '(min-width: 1024px) 29vw, (min-width: 640px) 50vw, 100vw'
                    : '(min-width: 1024px) 58vw, 100vw'
                }
              />
            </div>
          </div>

          {/*
            The project's clip. Ratio comes from the data because the real
            footage is mixed — 16:9 screen captures alongside 9:16 phone
            recordings — and one hardcoded frame letterboxes half of them.
          */}
          <InViewAutoplay>
            <PlaceholderVideo
              media={project.video}
              ratio={project.videoRatio ?? 'video'}
              className="shadow-soft transition-shadow duration-700 ease-premium group-hover:shadow-lift"
            />
          </InViewAutoplay>
        </div>
      </Reveal>
    </article>
  );
}
