'use client';

import * as React from 'react';

import dynamic from 'next/dynamic';

import type { BookCfg } from '@/components/ui/books-showcase';
import { danceModels } from '@/data/dance';

/*
 * Loaded on demand, never during SSR.
 *
 * `books-showcase` pulls in three.js, which is ~400 kB. Importing it statically
 * put that weight into the shared chunk, so /contact and /privacy — pages with
 * no 3D at all — paid for it too. A dynamic import keeps it on the one route
 * that renders it, and `ssr: false` is required because the component touches
 * WebGL on mount.
 */
const BooksShowcase = dynamic(
  () => import('@/components/ui/books-showcase').then((m) => m.BooksShowcase),
  { ssr: false },
);

/**
 * The dance routines, as a 3D shelf.
 *
 * Each routine is a "book": the cover is its poster frame, the detail panel
 * carries the summary and the move list. The carousel earns its keep because
 * the catalogue is growing — new routines are appended to `data/dance.ts` and
 * appear here with no component change.
 *
 * Two things worth knowing before editing:
 *
 * - This is the one place in the project that loads a WebGL runtime. It was an
 *   explicit product decision, not an accident; see the note in CLAUDE.md. The
 *   component ships its own `prefers-reduced-motion` guard and a message for
 *   browsers that block WebGL, so neither case falls through to a blank frame.
 * - `themeColors` is passed rather than the component's defaults, which are a
 *   navy/pink scheme that would be a foreign object on the lilac page. The
 *   values below are the project's own brand tokens.
 */

/** Brand palette, mapped onto the component's five colour slots. */
const THEME = {
  navy: '#2A1E40', // deep violet — detail panel ground
  pink: '#6FD3A8', // light emerald — headings on the dark panel
  cream: '#F7F3FB', // lilac-white card surface
  lav: '#D9CFEA', // pale lilac, secondary copy on the dark panel
  peri: '#0D7651', // deep emerald — spines
  bgLight: '#ECE6F5',
  bgDark: '#2A1E40',
  foregroundLight: '#2A1E40',
  foregroundDark: '#F7F3FB',
} as const;

export function DanceShowcase() {
  const books = React.useMemo<BookCfg[]>(
    () =>
      danceModels.map((model) => ({
        id: model.id,
        title: model.track.title,
        author: model.platform,
        year: model.track.film,
        /* Every routine is shown at full marks — this is a showcase, not a
           rating, and a partial star row would imply a judgement we are not
           making. */
        stars: 5,
        desc: model.summary,
        story: model.story,
        /* The poster already exists for the video card; reuse it as the cover
           rather than generating a procedural one. */
        images: model.video?.poster ? { front: model.video.poster } : undefined,
        edge: THEME.cream,
        backBg: THEME.navy,
        backInk: THEME.cream,
        spineBg: THEME.peri,
        spineInk: THEME.cream,
        /* The move names read as a chapter list, which is exactly the shape
           the detail panel expects. */
        chapters: model.moves.map((move) => `${move.name} · ${move.bpm} BPM`),
      })),
    [],
  );

  return <BooksShowcase books={books} showNav={false} themeColors={THEME} className="mt-16" />;
}
