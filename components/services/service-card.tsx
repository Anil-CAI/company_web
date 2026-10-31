'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { IconTile } from '@/components/common/icon-tile';
import { Card } from '@/components/ui/card';
import { FolderPreview } from '@/components/ui/folder-preview';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/service';

interface ServiceCardProps {
  service: Service;
  className?: string;
}

/**
 * Service card.
 *
 * The whole card is one hit target: the title carries the link and a
 * pseudo-element stretches it over the card, so the tab order stays clean and
 * screen readers announce a single, well-named link.
 *
 * Hovering the card opens a folder listing the service's stack. That folder is
 * decoration over information that is already in the DOM — the technologies are
 * also rendered as a visually-hidden list, because hover does not exist on a
 * touch screen and a screen reader never sees it. Nothing is behind the hover
 * that is only behind the hover.
 */
export function ServiceCard({ service, className }: ServiceCardProps) {
  /*
   * The folder's tooltip lists at most six entries, so cap what is handed to
   * it. The screen-reader list below is never capped.
   */
  const stack = React.useMemo(
    () => service.technologies.slice(0, 6).map((name) => ({ name, type: 'default' as const })),
    [service.technologies],
  );

  /*
   * The folder is `pointer-events-none`, so it can never see a hover of its
   * own — the card tracks hover and drives it through the `open` prop. Focus
   * counts too, so a keyboard user tabbing to the card gets the same reveal.
   */
  const [isActive, setIsActive] = React.useState(false);

  return (
    <Card
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden p-8',
        'hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <IconTile
          icon={service.icon}
          size="md"
          className="group-hover:border-transparent group-hover:bg-foreground group-hover:text-background"
        />

        {/*
          Decorative: the visually-hidden list below carries the same content
          for assistive tech. `pointer-events-none` keeps it from stealing the card's hit
          target — the folder opens from the card's own hover, not its own.
        */}
        {stack.length > 0 ? (
          <div aria-hidden="true" className="pointer-events-none hidden shrink-0 sm:block">
            <FolderPreview variant="krl" files={stack} size="sm" open={isActive} />
          </div>
        ) : null}
      </div>

      <h3 className="mt-8 text-xl font-medium tracking-tight">
        <Link
          href={`${ROUTES.services}#${service.slug}`}
          // Stretches the link across the card without nesting interactive nodes.
          className="after:absolute after:inset-0 after:content-['']"
        >
          {service.title}
        </Link>
      </h3>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
        {service.shortDescription}
      </p>

      {/* The accessible counterpart to the folder. */}
      {stack.length > 0 ? (
        <ul className="sr-only" aria-label={`${service.title} technologies`}>
          {service.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      ) : null}

      <span
        aria-hidden="true"
        className={cn(
          'mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground',
          'transition-colors duration-500 ease-premium group-hover:text-foreground',
        )}
      >
        Learn more
        <ArrowUpRight
          className={cn(
            'size-4 transition-transform duration-500 ease-premium',
            'group-hover:translate-x-1 group-hover:-translate-y-1',
          )}
        />
      </span>
    </Card>
  );
}
