import { ArrowDown } from 'lucide-react';
import * as React from 'react';

import { PlaceholderImage } from '@/components/common/placeholder-image';
import { RevealGroup, RevealItem } from '@/components/common/reveal';
import { servicePlatformGroups } from '@/data/services';
import { cn } from '@/lib/utils';

/**
 * The platform chooser under the hero copy.
 *
 * Three picture cards rather than three text pills: a visitor recognises the
 * quadruped and the humanoid on sight far faster than they parse the model
 * names, and the picture is the thing they actually came to ask about.
 *
 * Each card is a plain anchor to its section further down the page, so it works
 * before hydration, is keyboard-navigable for free, and leaves every service in
 * the document for search engines — which a tab panel would not.
 */
export function PlatformPicker() {
  return (
    <RevealGroup className="grid gap-5 sm:grid-cols-3">
      {servicePlatformGroups.map((group) => (
        <RevealItem key={group.id} className="h-full">
          <a
            href={`#platform-${group.id}`}
            className={cn(
              'group/card flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card',
              'transition-[border-color,box-shadow,transform] duration-500 ease-premium',
              'hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
          >
            {/*
              A tall frame, not a wide one. These are the page's entry point and
              the only pictures on it, so they get the height to actually show a
              robot — a 16:10 strip reduced each machine to a smudge.
            */}
            <PlaceholderImage
              media={group.image}
              ratio="portrait"
              className="rounded-none border-0 border-b border-border"
              innerClassName="transition-transform duration-700 ease-premium group-hover/card:scale-[1.04]"
              sizes="(min-width: 640px) 31vw, 100vw"
              compact
            />

            <div className="flex flex-1 items-end justify-between gap-4 p-7">
              <div>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {group.form}
                </p>
                <p className="mt-2 text-xl font-medium tracking-tight">{group.name}</p>
              </div>

              <span
                aria-hidden="true"
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full border border-border',
                  'transition-colors duration-500 ease-premium',
                  'group-hover/card:border-foreground group-hover/card:bg-foreground group-hover/card:text-background',
                )}
              >
                <ArrowDown className="size-4" />
              </span>
            </div>
          </a>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
