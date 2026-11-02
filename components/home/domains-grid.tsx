'use client';

import * as React from 'react';

import { getIcon } from '@/lib/icons';
import { StaggeredGrid, type GridTile } from '@/components/ui/staggered-grid';
import { homeContent } from '@/data/content';
import { domains } from '@/data/domains';

/**
 * Domains, as a scroll-animated wall.
 *
 * Every tile is a domain — icon and name — and nothing else. The component's
 * centre bento block (four expanding photo cards) is not used: photographs
 * among the symbol tiles read as a different list, so every slot is a symbol.
 * With no images the loader settles immediately and the animation starts.
 */
export function DomainsGrid() {
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

  return (
    <StaggeredGrid
      images={[]}
      tiles={tiles}
      bentoItems={[]}
      centerText={homeContent.domains.wallWord}
      showFooter={false}
    />
  );
}
