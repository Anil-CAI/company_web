'use client';

import { ArrowUp } from 'lucide-react';
import * as React from 'react';

import { useScrollTo } from '@/hooks/use-lenis';
import { useScrollDirection } from '@/hooks/use-scroll-direction';
import { cn } from '@/lib/utils';

/**
 * Back-to-top control.
 *
 * Appears once the page has scrolled and returns through Lenis, so the trip up
 * uses the same easing as everything else.
 */
export function ScrollToTop() {
  const { isScrolled, direction } = useScrollDirection();
  const scrollTo = useScrollTo();

  // Only offer it on the way up — mid-descent it just gets in the way.
  const isVisible = isScrolled && direction === 'up';

  return (
    <button
      type="button"
      onClick={() => scrollTo(0)}
      aria-label="Scroll back to top"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={cn(
        'fixed bottom-6 right-6 z-30 flex size-11 items-center justify-center rounded-full',
        'border border-border bg-background/80 text-foreground shadow-soft backdrop-blur-xl',
        'transition-all duration-500 ease-premium hover:border-foreground hover:shadow-lift',
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <ArrowUp className="size-4" strokeWidth={1.5} />
    </button>
  );
}
