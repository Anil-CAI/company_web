'use client';

import * as React from 'react';

import { IconTile } from '@/components/common/icon-tile';
import { Badge } from '@/components/ui/badge';
import { services as allServices } from '@/data/services';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/service';

/**
 * Go2 services as a bento grid with a focus-scale effect.
 *
 * Two things are happening here, and they are separate:
 *
 * 1. **Bento** — tiles are deliberately unequal. The two flagship Go2
 *    capabilities (the ones the quadruped actually runs today) take double-wide
 *    slots, the rest sit in single slots. A uniform 3-column grid gave every
 *    service the same weight, which is not how the work is distributed.
 *
 * 2. **Focus scale** — the tile nearest the vertical centre of the viewport
 *    scales up slightly and the others recede. This is the carousel "focus"
 *    behaviour applied to a scrolling grid rather than a horizontal track, so
 *    it costs no extra interaction: the thing you are looking at is the thing
 *    that grows.
 *
 * Reduced motion skips the scale entirely — every tile renders at rest size
 * and the grid is a plain bento. The DOM is identical either way, so nothing
 * is hidden from search engines or from a reader who never scrolls.
 */

/** Scale applied to the tile at the focal point, and to the ones away from it. */
const FOCUS_SCALE = 1.028;
const REST_SCALE = 0.978;

/**
 * Which slot each tile occupies, chosen by how many services the group has.
 *
 * The grid is three columns, so a wide tile only lands cleanly when the count
 * leaves room for it. Rather than one fixed pattern, the shape is picked from
 * the group size:
 *
 * - **8 services** (Go2, G1) — a wide opener and a wide tile at index 5. Both
 *   rows stay full, and the two flagship capabilities get the weight.
 * - **3 services** (Other) — all equal. A wide tile among three would leave a
 *   visible hole, and with so few services none of them is the headline.
 * - **anything else** — all equal, which is always safe.
 *
 * Index-based rather than keyed by service id: the data decides the order and
 * this decides the shape, so adding a service never breaks the layout.
 */
function bentoSpans(count: number): string[] {
  if (count === 8) {
    return [
      'lg:col-span-2', // wide opener
      'lg:col-span-1',
      'lg:col-span-1',
      'lg:col-span-1',
      'lg:col-span-1',
      'lg:col-span-2', // second anchor, keeps the lower rows full
      'lg:col-span-1',
      'lg:col-span-1',
    ];
  }

  return Array.from({ length: count }, () => 'lg:col-span-1');
}
/** A service plus its already-resolved per-platform copy. */
export interface BentoService {
  service: Service;
  /** Resolved on the server — `platformNotes` override or the generic line. */
  copy: string;
}

/*
 * Pop colours — one per service, so each card is its own block of colour.
 *
 * Keyed by the service's place in the full catalogue (`data/services.ts`), not
 * by its place in a group, so Computer Vision is the same teal under Go2 and
 * under G1. Each colour carries the text colour that reads on it: dark violet
 * ink or lilac-white, whichever clears 4.5:1 — every pair below does, which
 * is why magenta is the deeper #A21CAF (#C42BD6 only reached 4.11:1).
 */
const INK = '#2A1E40';
const PAPER = '#F7F3FB';
const POP = [
  { bg: '#FF6B5E', fg: INK }, // coral
  { bg: '#FFB020', fg: INK }, // amber
  { bg: '#00BFA5', fg: INK }, // teal
  { bg: '#6A3DF0', fg: PAPER }, // violet
  { bg: '#FF6FB5', fg: INK }, // pink
  { bg: '#33BBFF', fg: INK }, // sky
  { bg: '#A8E63D', fg: INK }, // lime
  { bg: '#FF8A3D', fg: INK }, // orange
  { bg: '#3346D3', fg: PAPER }, // indigo
  { bg: '#0E9F6E', fg: INK }, // green
  { bg: '#A21CAF', fg: PAPER }, // magenta
  { bg: '#FFD43B', fg: INK }, // yellow
  { bg: '#3DDBE0', fg: INK }, // aqua
] as const;

function popFor(id: string) {
  const index = allServices.findIndex((service) => service.id === id);
  return POP[Math.max(0, index) % POP.length];
}

interface ServiceBentoGridProps {
  items: readonly BentoService[];
  className?: string;
}

export function ServiceBentoGrid({ items, className }: ServiceBentoGridProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const spans = React.useMemo(() => bentoSpans(items.length), [items.length]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    /* The site-wide contract: no scroll-driven motion under reduced motion. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-bento-tile]'));
    if (tiles.length === 0) return;

    const ctx = gsap.context(() => {
      for (const tile of tiles) {
        gsap.set(tile, { scale: REST_SCALE });

        /*
         * One trigger per tile, scrubbed across the band where the tile crosses
         * the viewport centre. `yoyo`-style easing is done with two tweens in a
         * timeline rather than a single `scrub` on scale, so the tile peaks at
         * the centre and settles again on the way out instead of staying large.
         */
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: tile,
            start: 'top bottom-=12%',
            end: 'bottom top+=12%',
            scrub: 0.6,
          },
        });

        timeline
          .to(tile, { scale: FOCUS_SCALE, ease: 'power2.out', duration: 1 })
          .to(tile, { scale: REST_SCALE, ease: 'power2.in', duration: 1 });
      }
    }, root);

    /*
     * The grid sits below the fold and its tiles change height as fonts settle,
     * so the measured start/end positions are stale on first paint.
     */
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [items]);

  return (
    <div ref={rootRef} className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map(({ service, copy }, index) => (
        <article
          key={service.id}
          data-bento-tile
          style={{ backgroundColor: popFor(service.id).bg, color: popFor(service.id).fg }}
          className={cn(
            'flex h-full flex-col rounded-2xl p-7 shadow-soft',
            'transition-shadow duration-500 ease-premium hover:shadow-lift',
            /* `will-change` keeps the scrubbed scale off the main thread. */
            'will-change-transform',
            spans[index],
          )}
        >
          {/* Everything inside takes the card's own text colour (`text-current`),
              so the pair verified above is the pair that renders. */}
          <IconTile icon={service.icon} className="border-transparent bg-white/25 text-current" />

          <h4 className="mt-7 text-lg font-semibold tracking-tight text-current">
            {service.title}
          </h4>

          <p className="mt-3 flex-1 text-sm leading-relaxed text-current text-pretty">{copy}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {service.technologies.slice(0, 3).map((technology) => (
              <Badge key={technology} className="border-current bg-transparent text-current">
                {technology}
              </Badge>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
