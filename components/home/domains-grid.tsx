'use client';

import * as React from 'react';

import { getIcon } from '@/lib/icons';
import { StaggeredGrid, type BentoItem, type GridTile } from '@/components/ui/staggered-grid';
import { domains } from '@/data/domains';

/**
 * Domains, as a scroll-animated wall.
 *
 * Every tile is a domain — icon and name — rather than a photograph. An earlier
 * version cycled seven stills across the wall's twenty-one slots, which read as
 * the same picture repeating rather than as a catalogue; and the full list was
 * then printed again as cards directly beneath it, so the section said
 * everything twice. The wall is now the list, and the card grid is gone.
 *
 * `WALL_IMAGES` is still passed: the component's loader waits on those files
 * before it starts the scroll animation, and the bento block at the centre uses
 * them as its backdrops.
 */

/** Stills the loader waits on, and the bento block's backdrops. */
const WALL_IMAGES = [
  '/projects/g1-multilingual-interaction.jpg',
  '/projects/go2-3d-web-navigation.jpg',
  '/projects/g1-parcel-pick-and-drop.jpg',
  '/images/platform-g1.jpg',
  '/projects/g1-dance-ayaa-sher.jpg',
  '/images/platform-go2.jpg',
  '/projects/go2-web-outdoor-navigation.jpg',
];

export function DomainsGrid() {
  /*
   * One tile per domain. Fifteen domains across twenty-one slots means the
   * last six repeat, which is far less noticeable than seven photos repeating
   * three times each — and adding a domain thins the repeats automatically.
   */
  const tiles = React.useMemo<GridTile[]>(
    () =>
      domains.map((domain) => {
        const Icon = getIcon(domain.icon);

        return {
          id: domain.id,
          label: domain.title,
          icon: <Icon className="size-5" aria-hidden="true" />,
        };
      }),
    [],
  );

  const bentoItems = React.useMemo<BentoItem[]>(
    () =>
      /*
       * The centre block is a horizontal expand row inside a three-column slot,
       * so it holds four domains at most — more and each collapses to a sliver
       * too narrow to read. The full fifteen live in the card grid below, which
       * is the authoritative list.
       */
      domains.slice(0, 4).map((domain, index) => {
        const Icon = getIcon(domain.icon);

        return {
          id: domain.id,
          title: domain.title,
          subtitle: `0${index + 1}`,
          description: domain.description,
          icon: <Icon className="size-4" aria-hidden="true" />,
          image: WALL_IMAGES[index % WALL_IMAGES.length],
        };
      }),
    [],
  );

  return (
    <StaggeredGrid
      images={WALL_IMAGES}
      tiles={tiles}
      bentoItems={bentoItems}
      showFooter={false}
    />
  );
}
