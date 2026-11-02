'use client';

import { ArrowRight, Maximize, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import type { BooksController } from '@/components/ui/books-showcase';
import { homeContent } from '@/data/content';
import { useLenis } from '@/hooks/use-lenis';
import { cn } from '@/lib/utils';
import type { DanceRoutine } from '@/types/dance';

/**
 * The book reader: one routine as a flat two-page spread.
 *
 * Left page is the video, right page the title, summary and a Story / Moves
 * pair of tabs that scroll on their own so the video stays in view. On phones
 * the spread becomes a single page with the video on top.
 *
 * The handoff from the 3D book is measured, not guessed: the spread starts at
 * the exact projected bounds of the open book's front cover (`coverRect`),
 * fades in over it, then the 3D book is hidden and the spread grows to its
 * final size. Closing runs the same steps backwards, ending on the cover
 * before the book folds back to the shelf. Reduced motion skips the growth and
 * only fades.
 *
 * It is a modal dialog: focus moves in on open, Tab stays inside, Esc closes,
 * focus returns to the book on close, and the page behind cannot scroll —
 * including on iOS Safari, which ignores `overflow: hidden` on <body>, so the
 * body is pinned with `position: fixed` instead.
 */

interface DanceReaderProps {
  routines: readonly DanceRoutine[];
  activeId: string;
  controller: React.MutableRefObject<BooksController | null>;
  /** The stage; the video pauses when it scrolls out of view. */
  watchRef: React.RefObject<HTMLElement | null>;
  onSwitch: (id: string) => void;
  onClosed: (id: string) => void;
}

const GROW_MS = 560;
const FADE_MS = 160;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const copy = homeContent.dance.reader;

function formatTime(s: number) {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

/** Transform that maps `final` onto `from` (origin top-left). */
function transformFrom(from: DOMRect, final: DOMRect) {
  const sx = from.width / final.width;
  const sy = from.height / final.height;
  return `translate(${from.left - final.left}px, ${from.top - final.top}px) scale(${sx}, ${sy})`;
}

/** Wait until the 3D cover stops moving, so the handoff lands on its final spot. */
function stableRect(get: () => DOMRect | null, timeoutMs = 1500): Promise<DOMRect | null> {
  return new Promise((resolve) => {
    const start = performance.now();
    let last: DOMRect | null = null;
    let still = 0;
    const step = () => {
      const r = get();
      if (
        r &&
        last &&
        Math.abs(r.left - last.left) + Math.abs(r.top - last.top) + Math.abs(r.width - last.width) <
          0.6
      )
        still += 1;
      else still = 0;
      last = r;
      if (still >= 3 || performance.now() - start > timeoutMs) resolve(r);
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/**
 * Body scroll lock that also holds on iOS Safari, without moving the page.
 *
 * Not the usual `position: fixed` on <body>: that resets the scroll position
 * to 0, and GSAP's ScrollTriggers then re-pin the home hero behind the reader.
 * Instead overflow is hidden on <html> and <body> (the scrollbar's space is
 * kept, so the 3D stage does not shift sideways), and touch scrolling is
 * blocked everywhere except inside `allowed` — the reader's own scrolling
 * page — which is what iOS needs, since it ignores overflow on <body>.
 */
function lockBodyScroll(allowed: () => HTMLElement | null) {
  const html = document.documentElement;
  const body = document.body;
  const prev = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    gutter: html.style.scrollbarGutter,
  };
  html.style.scrollbarGutter = 'stable';
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  const onTouchMove = (e: TouchEvent) => {
    const area = allowed();
    if (area && e.target instanceof Node && area.contains(e.target)) return;
    e.preventDefault();
  };
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  return () => {
    document.removeEventListener('touchmove', onTouchMove);
    html.style.overflow = prev.htmlOverflow;
    body.style.overflow = prev.bodyOverflow;
    html.style.scrollbarGutter = prev.gutter;
  };
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"]), video[controls]';

export function DanceReader({
  routines,
  activeId,
  controller,
  watchRef,
  onSwitch,
  onClosed,
}: DanceReaderProps) {
  const routine = routines.find((r) => r.id === activeId) ?? routines[0];
  const others = routines.filter((r) => r.id !== routine.id);
  const next = others[0];

  const lenis = useLenis();
  const [mounted, setMounted] = React.useState(false);
  const [tab, setTab] = React.useState<'story' | 'moves'>('story');
  const [contentOn, setContentOn] = React.useState(false);

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const coverRef = React.useRef<HTMLDivElement>(null);
  const scrimRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const busy = React.useRef(false);
  /* A close asked for while the book is still opening runs as soon as it can. */
  const closeRequested = React.useRef(false);
  const closeFnRef = React.useRef<() => void>(() => {});
  const openedId = React.useRef(activeId);

  const reduced = React.useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  React.useEffect(() => setMounted(true), []);

  const pause = React.useCallback(() => {
    videoRef.current?.pause();
  }, []);

  /* ---------------------------------------------------------- open -- */
  React.useLayoutEffect(() => {
    if (!mounted) return;
    const frame = frameRef.current;
    const cover = coverRef.current;
    const scrim = scrimRef.current;
    if (!frame || !cover || !scrim) return;

    const unlock = lockBodyScroll(() => panelRef.current);
    lenis?.stop();
    busy.current = true;
    let cancelled = false;

    frame.style.opacity = '0';
    const run = async () => {
      if (reduced) {
        controller.current?.setReaderOpen(true);
        cover.style.opacity = '0';
        await Promise.all([
          frame.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, fill: 'forwards' })
            .finished,
          scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, fill: 'forwards' })
            .finished,
        ]);
      } else {
        const from = await stableRect(() => controller.current?.coverRect() ?? null);
        if (cancelled) return;
        const final = frame.getBoundingClientRect();
        const start = from ? transformFrom(from, final) : 'scale(0.9)';
        frame.style.transformOrigin = '0 0';
        frame.style.transform = start;
        cover.style.opacity = '1';
        /* 1. Fade the spread in exactly over the 3D cover. */
        await frame.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: FADE_MS,
          fill: 'forwards',
        }).finished;
        if (cancelled) return;
        /* 2. The 3D book goes; the spread grows to its own size. */
        controller.current?.setReaderOpen(true);
        scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: GROW_MS, fill: 'forwards' });
        cover.animate([{ opacity: 1 }, { opacity: 1, offset: 0.35 }, { opacity: 0 }], {
          duration: GROW_MS,
          fill: 'forwards',
        });
        /* Content starts fading in over the last third of the growth, so there
           is never a blank page between the cover and the spread. */
        const overlap = window.setTimeout(() => setContentOn(true), GROW_MS * 0.65);
        void overlap;
        await frame.animate([{ transform: start }, { transform: 'none' }], {
          duration: GROW_MS,
          easing: EASE,
          fill: 'forwards',
        }).finished;
        frame.style.transform = 'none';
      }
      if (cancelled) return;
      setContentOn(true);
      busy.current = false;
      closeRef.current?.focus({ preventScroll: true });
      if (closeRequested.current) closeFnRef.current();
    };
    /* Whatever happens mid-animation, never leave the reader stuck half-grown. */
    const finish = () => {
      if (cancelled) return;
      controller.current?.setReaderOpen(true);
      frame.getAnimations().forEach((a) => a.cancel());
      frame.style.transform = 'none';
      frame.style.opacity = '1';
      cover.style.opacity = '0';
      scrim.style.opacity = '1';
      setContentOn(true);
      busy.current = false;
      closeRef.current?.focus({ preventScroll: true });
      if (closeRequested.current) closeFnRef.current();
    };
    run().catch(finish);

    return () => {
      cancelled = true;
      unlock();
      /* Re-sync smooth scrolling to where the page really is before resuming,
         or it can glide back to a position it remembered from before. */
      const y = window.scrollY;
      lenis?.start();
      lenis?.scrollTo(y, { immediate: true, force: true });
    };
    // Runs once per opening; switching books does not replay the handoff.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  /* --------------------------------------------------------- close -- */
  const close = React.useCallback(async () => {
    if (busy.current) {
      closeRequested.current = true;
      return;
    }
    closeRequested.current = false;
    busy.current = true;
    pause();
    const frame = frameRef.current;
    const cover = coverRef.current;
    const scrim = scrimRef.current;
    const id = routine.id;
    setContentOn(false);
    if (frame && cover && scrim) {
      if (reduced) {
        await frame.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' })
          .finished;
        controller.current?.setReaderOpen(false);
      } else {
        const final = frame.getBoundingClientRect();
        const to = controller.current?.coverRect();
        const end = to ? transformFrom(to, final) : 'scale(0.9)';
        frame.style.transformOrigin = '0 0';
        cover.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: GROW_MS * 0.6,
          fill: 'forwards',
        });
        scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: GROW_MS, fill: 'forwards' });
        await frame.animate([{ transform: 'none' }, { transform: end }], {
          duration: GROW_MS,
          easing: EASE,
          fill: 'forwards',
        }).finished;
        /* Back on the cover: show the 3D book under it, then let go. */
        controller.current?.setReaderOpen(false);
        await frame.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: FADE_MS,
          fill: 'forwards',
        }).finished;
      }
    }
    controller.current?.close();
    onClosed(id);
    /* After the dialog unmounts, give focus back to the book it came from. */
    requestAnimationFrame(() => controller.current?.focusBook(id));
  }, [controller, onClosed, pause, reduced, routine.id]);

  closeFnRef.current = () => void close();

  /* -------------------------------------------------------- switch -- */
  const switchTo = React.useCallback(
    async (id: string) => {
      if (busy.current) return;
      busy.current = true;
      pause();
      setContentOn(false);
      await new Promise((r) => setTimeout(r, 180));
      controller.current?.swap(id);
      openedId.current = id;
      setTab('story');
      onSwitch(id);
      requestAnimationFrame(() => {
        setContentOn(true);
        busy.current = false;
      });
    },
    [controller, onSwitch, pause],
  );

  /* ----------------------------------------- keyboard: Esc and Tab trap -- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      void close();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  /* The video pauses if the stage leaves the screen. */
  React.useEffect(() => {
    const el = watchRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [pause, watchRef]);

  if (!mounted) return null;

  const titleId = `dance-reader-title-${routine.id}`;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-6"
    >
      {/* Deep violet scrim — the stage's own colour, carried over the page. */}
      <div
        ref={scrimRef}
        aria-hidden="true"
        className="absolute inset-0 bg-[#2A1E40]/80 opacity-0"
      />

      <div
        ref={frameRef}
        className={cn(
          'relative flex h-[calc(100svh-24px)] w-full flex-col overflow-hidden rounded-2xl bg-[#F7F3FB] text-[#2A1E40] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)]',
          'md:h-[min(70svh,760px)] md:w-[min(1100px,94vw)] md:flex-row',
        )}
      >
        {/* The book's edge. */}
        <span aria-hidden="true" className="absolute inset-y-0 left-0 z-10 w-1.5 bg-[#0D7651]" />

        {/* Cover face: what the spread looks like while it grows from the 3D book. */}
        <div
          ref={coverRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-[#F7F3FB] opacity-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={routine.poster} alt="" className="absolute inset-0 size-full object-cover" />
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={() => void close()}
          aria-label={copy.close}
          className={cn(
            'absolute right-3 top-3 z-30 grid size-11 place-items-center rounded-full border border-[#2A1E40]/15 bg-[#F7F3FB]/90 text-[#2A1E40] backdrop-blur transition-colors hover:bg-[#2A1E40] hover:text-[#F7F3FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D7651] focus-visible:ring-offset-2 transition-opacity',
            contentOn ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <X className="size-5" />
        </button>

        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col transition-opacity duration-200 md:flex-row',
            contentOn ? 'opacity-100' : 'opacity-0',
          )}
        >
          {/* Left page: the dance. */}
          <div className="shrink-0 p-4 pl-6 md:flex md:w-1/2 md:flex-col md:justify-center md:p-8 md:pl-10">
            <DanceVideo key={routine.id} routine={routine} videoRef={videoRef} />
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[#5B4D73]">
              {routine.platform} · {routine.song.film}
            </p>
          </div>

          {/* The spine. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#2A1E40]/10 to-transparent md:block"
          />

          {/* Right page: words. Scrolls on its own so the video stays put. */}
          <div className="flex min-h-0 flex-1 flex-col px-6 pb-5 md:w-1/2 md:px-10 md:pb-7 md:pt-12">
            <h2
              id={titleId}
              className="m-0 text-3xl font-semibold tracking-tight text-[#0F8A5F] md:text-4xl"
            >
              {routine.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#5B4D73]">
              {routine.song.title} · {routine.song.film}
            </p>
            <p className="mt-3 text-base leading-relaxed text-[#2A1E40]">{routine.summary}</p>

            <div role="tablist" aria-label={routine.title} className="mt-5 flex gap-2">
              {(['story', 'moves'] as const).map((id) => (
                <button
                  key={id}
                  id={`${titleId}-tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  aria-controls={`${titleId}-panel`}
                  tabIndex={tab === id ? 0 : -1}
                  onClick={() => setTab(id)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                      e.preventDefault();
                      const nextTab = tab === 'story' ? 'moves' : 'story';
                      setTab(nextTab);
                      document.getElementById(`${titleId}-tab-${nextTab}`)?.focus();
                    }
                  }}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D7651]',
                    tab === id
                      ? 'bg-[#0D7651] text-[#F7F3FB]'
                      : 'text-[#5B4D73] hover:bg-[#2A1E40]/5',
                  )}
                >
                  {id === 'story' ? copy.storyTab : copy.movesTab}
                </button>
              ))}
            </div>

            <div
              id={`${titleId}-panel`}
              ref={panelRef}
              role="tabpanel"
              aria-labelledby={`${titleId}-tab-${tab}`}
              tabIndex={0}
              data-lenis-prevent=""
              className="mt-4 min-h-[8rem] flex-1 overflow-y-auto overscroll-contain pr-2 focus-visible:outline-none"
            >
              {tab === 'story' ? (
                <div className="space-y-4 text-base leading-relaxed text-[#2A1E40]">
                  {routine.story.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="text-[#2A1E40]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div>
                  <ol className="space-y-4">
                    {routine.moves.map((move) => (
                      <li key={move.letter} className="flex gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#2A1E40] font-mono text-xs text-[#F7F3FB]">
                          {move.letter}
                        </span>
                        <div>
                          <p className="text-base font-semibold text-[#2A1E40]">
                            {move.name}{' '}
                            <span className="ml-1 font-mono text-xs font-medium text-[#0D7651]">
                              {move.bpm} {copy.bpm}
                            </span>
                          </p>
                          <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.1em] text-[#5B4D73]">
                            {move.bodyParts}
                          </p>
                          <p className="mt-1 text-base leading-relaxed text-[#2A1E40]">
                            {move.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {routine.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-[#2A1E40]/20 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[#2A1E40]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {next ? (
              <button
                type="button"
                onClick={() => void switchTo(next.id)}
                className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full px-1 text-sm font-semibold text-[#0D7651] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D7651]"
              >
                {next.title}
                <ArrowRight className="size-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------ video -- */

function DanceVideo({
  routine,
  videoRef,
}: {
  routine: DanceRoutine;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };

  const fullscreen = () => {
    const v = videoRef.current as
      (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    const wrap = wrapRef.current;
    if (wrap?.requestFullscreen)
      void wrap.requestFullscreen().catch(() => v?.webkitEnterFullscreen?.());
    else v?.webkitEnterFullscreen?.(); // iOS Safari
  };

  const btn =
    'grid size-9 shrink-0 place-items-center rounded-full text-[#F7F3FB] transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F3FB]';

  return (
    <div ref={wrapRef} className="overflow-hidden rounded-xl bg-black">
      <video
        ref={videoRef}
        src={routine.videoSrc}
        poster={routine.poster}
        aria-label={routine.videoLabel}
        playsInline
        preload="metadata"
        muted={muted}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        className="block aspect-video w-full cursor-pointer bg-black object-contain"
      />
      <div className="flex items-center gap-1 bg-[#2A1E40] px-2 py-1.5">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? copy.pause : copy.play}
          className={btn}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          aria-label={copy.seek}
          onChange={(e) => {
            const v = videoRef.current;
            if (v) v.currentTime = Number(e.target.value);
          }}
          className="mx-1 h-1 min-w-0 flex-1 cursor-pointer accent-[#6FD3A8]"
        />
        <span className="w-[5.5rem] shrink-0 text-center font-mono text-[0.6875rem] tabular-nums text-[#F7F3FB]/80">
          {formatTime(time)} / {formatTime(duration)}
        </span>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? copy.unmute : copy.mute}
          aria-pressed={muted}
          className={btn}
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
        <button type="button" onClick={fullscreen} aria-label={copy.fullscreen} className={btn}>
          <Maximize className="size-4" />
        </button>
      </div>
    </div>
  );
}
