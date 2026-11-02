'use client'
import React, { useEffect, useRef, useState } from 'react'
/*
 * KRL changes to the vendored component, all forced by this project:
 *
 * 1. GSAP comes from `@/lib/gsap`, which registers ScrollTrigger once behind a
 *    browser guard. The original called `gsap.registerPlugin()` at module
 *    scope, which runs during SSR where `window` does not exist.
 * 2. `imagesloaded` and `react-icons` are dropped. The registry entry declared
 *    only `gsap`, so neither was installed and the component would not build.
 *    Image readiness now uses the native `load` event and the icons come from
 *    `lucide-react`, which the project already depends on.
 */

/* Importing from '@/lib/gsap' is what registers ScrollTrigger, browser-guarded. */
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { cn } from '@/lib/utils'

export interface BentoItem {
    id: number | string
    title: string
    subtitle: string
    description: string
    icon: React.ReactNode
    content?: React.ReactNode
    image?: string
}

/** A labelled tile: a name and icon rather than a photograph. */
export interface GridTile {
    id: string
    label: string
    icon: React.ReactNode
}

export interface StaggeredGridProps {
    images: string[]
    /**
     * KRL addition: render labelled tiles instead of cycling `images`.
     *
     * With only a handful of photographs the wall repeated each one three
     * times, which read as a loading bug. Supplying `tiles` paints a name and
     * an icon per slot instead, so every tile carries distinct information.
     * `images` is still required — the loader waits on it.
     */
    tiles?: GridTile[]
    bentoItems: BentoItem[]
    centerText?: string
    credits?: {
        madeBy: { text: string; href: string }
        moreDemos: { text: string; href: string }
    }
    className?: string
    showFooter?: boolean
    scroller?: string | Element | Window | null
}

export function StaggeredGrid({
    images,
    tiles,
    bentoItems,
    centerText = "Halcyon",
    credits = {
        madeBy: { text: "@codrops", href: "https://x.com/codrops" },
        moreDemos: { text: "More demos", href: "https://tympanus.net/codrops/demos" }
    },
    className,
    showFooter = true,
    scroller
}: StaggeredGridProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const gridFullRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    // Bento Grid State
    const [activeBento, setActiveBento] = useState<number>(0);

    const splitText = (text: string) => {
        return text.split('').map((char, i) => (
            <span key={i} className="char inline-block" style={{ willChange: 'transform' }}>{char === ' ' ? '\u00A0' : char}</span>
        ))
    }

    useEffect(() => {
        const handleLoad = () => {
            document.body.classList.remove('loading')
            setIsLoaded(true)
        }

        /*
         * Wait for the grid's images before animating.
         *
         * `imagesloaded` watched CSS background images too; these are real
         * `<img>` elements, so the native `load` event covers them. A cached
         * image is already `complete`, which the filter below accounts for —
         * without it the promise would never settle and the grid would stay
         * hidden.
         */
        const images = Array.from(
            document.querySelectorAll<HTMLImageElement>('.grid__item-img img'),
        )
        const pending = images.filter((img) => !img.complete)

        if (pending.length === 0) {
            handleLoad()
            return
        }

        let settled = 0
        const onSettle = () => {
            settled += 1
            if (settled >= pending.length) handleLoad()
        }
        pending.forEach((img) => {
            img.addEventListener('load', onSettle, { once: true })
            img.addEventListener('error', onSettle, { once: true })
        })

        /* A stalled image must not strand the section invisible. */
        const timeout = window.setTimeout(handleLoad, 3000)

        return () => {
            window.clearTimeout(timeout)
            pending.forEach((img) => {
                img.removeEventListener('load', onSettle)
                img.removeEventListener('error', onSettle)
            })
        }
    }, [])

    useEffect(() => {
        if (!isLoaded) return

        /*
         * KRL fix: everything below is built inside a gsap.context, so cleanup
         * reverts it completely. Killing only the ScrollTriggers (as before)
         * left the `from()` tweens' inline `opacity: 0; visibility: hidden` on
         * the tiles, so coming back to the page could show an empty wall.
         */
        const ctx = gsap.context(() => {
        // Animate Text Element
        if (textRef.current) {
            const chars = textRef.current.querySelectorAll('.char')
            gsap.timeline({
                scrollTrigger: {
                    trigger: textRef.current,
                    scroller: scroller || undefined,
                    start: 'top bottom',
                    end: 'center center-=25%',
                    scrub: 1,
                }
            })
                .from(chars, {
                    ease: 'sine.out',
                    yPercent: 300,
                    autoAlpha: 0,
                    stagger: {
                        each: 0.05,
                        from: 'center'
                    }
                })
        }

        // Animate Full Grid
        if (gridFullRef.current) {
            const gridFullItems = gridFullRef.current.querySelectorAll('.grid__item')
            const numColumns = getComputedStyle(gridFullRef.current).getPropertyValue('grid-template-columns').split(' ').length
            const middleColumnIndex = Math.floor(numColumns / 2)

            /*
             * KRL fix: the column index is derived from the element's own
             * position, not from a hardcoded `data-col={i % 7}`.
             *
             * The grid is responsive (3 / 5 / 7 columns), so at any breakpoint
             * below `lg` the authored `data-col` could be 5 or 6 while
             * `numColumns` was only 3 — `columns[columnIndex]` was then
             * undefined and those tiles were silently dropped from the
             * timeline, which is why most of the wall stopped animating.
             *
             * Reading `offsetLeft` buckets each tile into the column it is
             * actually rendered in, so the stagger follows the layout at every
             * breakpoint.
             */
            const columns: Element[][] = Array.from({ length: numColumns }, () => [])
            const gridWidth = (gridFullRef.current as HTMLElement).clientWidth || 1
            gridFullItems.forEach((item: Element) => {
                const el = item as HTMLElement
                const centre = el.offsetLeft + el.offsetWidth / 2
                const columnIndex = Math.min(
                    numColumns - 1,
                    Math.max(0, Math.floor((centre / gridWidth) * numColumns)),
                )
                columns[columnIndex].push(item)
            })

            columns.forEach((columnItems, columnIndex) => {
                const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.2

                gsap.timeline({
                    scrollTrigger: {
                        trigger: gridFullRef.current,
                        scroller: scroller || undefined,
                        /*
                         * Runs from the wall first appearing until it is
                         * centred. `scrub` binds progress to scroll position,
                         * so dragging back up plays it in reverse rather than
                         * leaving the tiles stranded in their end state.
                         */
                        start: 'top bottom',
                        end: 'center center+=10%',
                        scrub: 1.5,
                    }
                })
                    .from(columnItems, {
                        yPercent: 450,
                        autoAlpha: 0,
                        delay: delayFactor,
                        ease: 'sine.out',
                    })
                    .from(columnItems.map(item => item.querySelector('.grid__item-img')), {
                        transformOrigin: '50% 0%',
                        ease: 'sine.out',
                    }, 0)
            })

            // Specific animation for Bento Container
            const bentoContainer = gridFullRef.current.querySelector('.bento-container')

            if (bentoContainer) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: gridFullRef.current,
                        scroller: scroller || undefined,
                        start: 'top top+=15%',
                        end: 'bottom center',
                        scrub: 1,
                        invalidateOnRefresh: true,
                    }
                })

                // Animate Bento Container to move down and scale
                tl.to(bentoContainer, {
                    y: window.innerHeight * 0.1, // Move down relative to grid
                    /*
                     * KRL change: on a phone the grid has 3 columns, so the
                     * 3-column bento block is already full width and 1.5x
                     * pushed it past both edges of the screen. It only grows
                     * where it starts narrower than the grid.
                     */
                    scale: window.matchMedia('(min-width: 640px)').matches ? 1.5 : 1,
                    zIndex: 1000,
                    ease: 'power2.out', // Smooth easing
                    duration: 1,
                    force3D: true // Force hardware acceleration
                }, 0)
            }
        }

        })

        /*
         * The triggers are created after the images finish loading, by which
         * point ScrollTrigger has already measured the document, so re-measure
         * now. Later layout shifts are handled site-wide by the refresh in
         * `SmoothScrollProvider`.
         */
        ScrollTrigger.refresh()

        return () => ctx.revert()
    }, [isLoaded, scroller])

    // Prepare grid items: fill up to the end of Row 3 (21 slots)
    // This perfectly balances the 3rd row with 2 cards on each side of the bento container.
    const mixedGridItems: (string | GridTile | 'BENTO_GROUP')[] = tiles?.length
        ? Array.from({ length: 21 }, (_, i) => tiles[i % tiles.length])
        : Array.from({ length: 21 }, (_, i) => images[i % images.length]);

    // Replace the slot where we want the bento group
    // Position at index 16 = Row 3 (middle row), spanning columns 3-5 (center)
    mixedGridItems[16] = 'BENTO_GROUP';

    return (
        <div
            className={cn("shadow relative overflow-hidden w-full", className)}
            style={{
                '--grid-item-translate': '0px',
            } as React.CSSProperties}
        >
            <section className="grid place-items-center w-full relative mt-[10vh]">
                <div ref={textRef} className="text font-alt uppercase flex content-center text-[clamp(3rem,14vw,10rem)] leading-[0.7] text-neutral-900 dark:text-white">
                    {splitText(centerText)}
                </div>
            </section>

            <section className="grid place-items-center w-full relative">
                <div ref={gridFullRef} /*
                      KRL change: the column count is responsive. At the
                      original fixed `grid-cols-7` a phone rendered seven ~40px
                      tiles, which is unreadable. `numColumns` above is read
                      from the computed style, so the stagger maths follows
                      whatever the breakpoint resolves to without further
                      changes.
                    */
                    className="grid--full relative w-full my-[10vh] h-auto aspect-[0.8] sm:aspect-[1.1] max-w-none p-4 grid gap-2 sm:gap-4 grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 grid-rows-7 sm:grid-rows-5">
                    <div className="grid-overlay absolute inset-0 z-[15] pointer-events-none opacity-0 bg-white/80 dark:bg-black/80 rounded-lg transition-opacity duration-500" />
                    {mixedGridItems.map((item, i) => {
                        if (item === 'BENTO_GROUP') {
                            // Render the HoverExpand Group using passed bentoItems
                            if (!bentoItems || bentoItems.length === 0) return null;

                            return (
                                <div key="bento-group" data-col={2} className="grid__item bento-container col-span-3 row-span-1 relative z-20 flex items-center justify-center gap-2 h-full w-full will-change-transform">
                                    {bentoItems.map((bentoItem, index) => {
                                        const isActive = activeBento === index;
                                        return (
                                            <div
                                                key={bentoItem.id}
                                                className={cn(
                                                    "relative cursor-pointer overflow-hidden rounded-2xl h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                                                    isActive
                                                        ? "bg-zinc-900/10 shadow-2xl"
                                                        : "bg-zinc-950"
                                                )}
                                                style={{ width: isActive ? "60%" : "20%" }}
                                                onMouseEnter={() => setActiveBento(index)}
                                                onClick={() => setActiveBento(index)}
                                            >
                                                {/* Border Overlay - Fixes edge artifacts by sitting on top */}
                                                <div className={cn(
                                                    "absolute inset-0 rounded-2xl border z-50 pointer-events-none transition-colors duration-700",
                                                    isActive
                                                        ? "border-zinc-500/50"
                                                        : "border-zinc-800/50 group-hover:border-zinc-700"
                                                )} />

                                                {/* Content Container */}
                                                <div className="relative z-10 w-full h-full flex flex-col p-0">
                                                    {/* Active State Content */}
                                                    <div className={cn(
                                                        "absolute inset-0 flex flex-col transition-all duration-500 ease-in-out",
                                                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                                                    )}>
                                                        {/* Image - Full Coverage */}
                                                        <div className="absolute inset-0 bg-zinc-900 overflow-hidden z-0 group/img">
                                                            {bentoItem.image && (
                                                                <>
                                                                    {/*
                                                                      A plain <img>, not next/image: GSAP animates these
                                                                      nodes directly and the loader above waits on their
                                                                      native load event. next/image wraps the element in
                                                                      its own markup, which breaks both.
                                                                    */}
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={bentoItem.image}
                                                                        alt={bentoItem.title}
                                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 opacity-90 group-hover/img:opacity-100"
                                                                    />
                                                                    {/* Text Protection Gradient - Shadow peaking from bottom */}
                                                                    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Footer Row - Full Width with Shadow */}
                                                        <div className="absolute bottom-0 left-0 w-full h-20 flex items-center justify-between px-5 z-20">


                                                            <div className="flex flex-col relative z-10">
                                                                <h3 className="text-sm font-bold text-white drop-shadow-md leading-none tracking-tight">{bentoItem.title}</h3>
                                                            </div>
                                                            <div className="text-white/90 transition-colors hover:text-white drop-shadow-md relative z-10">
                                                                {bentoItem.icon}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Inactive State - Icon + Title - Centered */}
                                                <div className={cn(
                                                    "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-500",
                                                    isActive ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                                                )}>
                                                    <div className="text-white/50 group-hover:text-white transition-colors">
                                                        {bentoItem.icon}
                                                    </div>
                                                    <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider">{bentoItem.title}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }

                        // Skip rendering for the slots that the group takes up
                        // Group starts at 16, takes 17, 18.
                        if (i === 17 || i === 18) return null;

                        /* KRL: a labelled tile — a domain name and its icon. */
                        if (typeof item === 'object' && item !== null && 'label' in item) {
                            return (
                                <figure key={`tile-${i}`} data-col={i % 7} className="grid__item m-0 relative z-10 [perspective:800px] will-change-[transform,opacity] group cursor-default">
                                    <div className="grid__item-img w-full h-full [backface-visibility:hidden] will-change-transform rounded-xl overflow-hidden border border-border bg-card shadow-sm flex flex-col items-center justify-center gap-2 p-3 text-center transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:border-ink-300 group-hover:shadow-lg">
                                        <span className="text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                                            {item.icon}
                                        </span>
                                        <span className="font-mono text-[9px] leading-tight uppercase tracking-[0.1em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                                            {item.label}
                                        </span>
                                    </div>
                                </figure>
                            )
                        }

                        if (typeof item === 'string') {
                            return (
                                <figure key={`img-${i}`} data-col={i % 7} className="grid__item m-0 relative z-10 [perspective:800px] will-change-[transform,opacity] group cursor-pointer">
                                    <div className="grid__item-img w-full h-full [backface-visibility:hidden] will-change-transform rounded-xl overflow-hidden shadow-sm border border-border bg-muted transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-xl">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item}
                                            alt=""
                                            aria-hidden="true"
                                            loading="lazy"
                                            decoding="async"
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    </div>
                                </figure>
                            )
                        }
                        return null;
                    })}
                </div>
            </section >

            {showFooter && (
                <footer className="frame__footer w-full p-8 flex justify-between items-center relative z-50 text-neutral-900 dark:text-white uppercase font-medium text-xs tracking-wider">
                    <a href={credits.madeBy.href} className="hover:opacity-60 transition-opacity">{credits.madeBy.text}</a>
                    <a href={credits.moreDemos.href} className="hover:opacity-60 transition-opacity">{credits.moreDemos.text}</a>
                </footer>
            )}
        </div >
    )
}

export default StaggeredGrid
