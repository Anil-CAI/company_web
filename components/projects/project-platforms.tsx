import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { NavPlatform } from '@/types/navigation-stack';

interface ProjectPlatformsProps {
  platforms: readonly NavPlatform[];
  /** Used to label the disclosure for screen readers. */
  projectTitle: string;
}

/**
 * The "see more" panel on a project card.
 *
 * A native `<details>` rather than React state: the card is otherwise a client
 * component only because of its parallax, and the open/closed behaviour, the
 * keyboard handling and the correct ARIA all come free from the element. The
 * chevron rotation is the one thing CSS has to do, via `group-open`.
 *
 * Capabilities with `status: 'planned'` are dimmed and chipped rather than
 * hidden — "shipping on one platform, coming to the other" is the point of the
 * panel, and a plain list cannot express it.
 */
export function ProjectPlatforms({ platforms, projectTitle }: ProjectPlatformsProps) {
  return (
    <details className="group mt-8 border-t border-border pt-6">
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-2 text-sm font-medium',
          'transition-colors duration-300 ease-premium hover:text-ink-600',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4',
          /* Safari still paints its own marker without this. */
          '[&::-webkit-details-marker]:hidden',
        )}
        aria-label={`See more about ${projectTitle}`}
      >
        <span className="group-open:hidden">See more about {projectTitle.toLowerCase()}</span>
        <span className="hidden group-open:inline">
          Hide {projectTitle.toLowerCase()} detail
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-premium group-open:rotate-180"
        />
      </summary>

      <div className="mt-7 grid gap-8 sm:grid-cols-2">
        {platforms.map((platform) => (
          <section key={platform.id} aria-label={`${platform.name} navigation capabilities`}>
            <div className="flex items-center gap-3">
              <h4 className="text-base font-medium tracking-tight">{platform.name}</h4>
              <span
                aria-hidden="true"
                className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground"
              >
                {platform.form}
              </span>
            </div>

            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {platform.summary}
            </p>

            <dl className="mt-5 space-y-4">
              {platform.capabilities.map((capability) => {
                const isPlanned = capability.status === 'planned';

                return (
                  <div key={capability.id} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 font-mono text-[0.6875rem] text-ink-400"
                    >
                      {capability.marker}
                    </span>
                    <div className="min-w-0">
                      <dt className="flex flex-wrap items-baseline gap-x-2 text-[0.8125rem] font-medium">
                        <span className={cn(isPlanned && 'text-muted-foreground')}>
                          {capability.name}
                        </span>
                        {isPlanned ? (
                          <Badge variant="outline" className="font-mono text-[0.625rem]">
                            In progress
                          </Badge>
                        ) : null}
                      </dt>
                      <dd className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                        {capability.description}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>
    </details>
  );
}
