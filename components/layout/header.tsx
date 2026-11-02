'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Container } from '@/components/common/container';
import { Logo } from '@/components/common/logo';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { mainNavigation } from '@/data/navigation';
import { useScrollDirection } from '@/hooks/use-scroll-direction';
import { cn } from '@/lib/utils';

/**
 * Sticky site header.
 *
 * Retracts on downward scroll and returns on the way up, so long sections stay
 * uninterrupted. The hairline border and translucent backdrop only appear once
 * the page has moved — over the hero the header is invisible.
 *
 * At the very top of the home page the bar sits transparent over the black
 * light-wordmark hero, so its marks flip light there (`onDark`); everywhere
 * else they are navy on the pale blue page.
 */
export function Header() {
  const pathname = usePathname();
  const { direction, isScrolled, isAtTop } = useScrollDirection();

  const isHidden = direction === 'down' && isScrolled;
  /* Over the home hero the ground is black, so the marks go light until the
     bar picks up its own pale background on the first scroll. */
  const onDark = pathname === ROUTES.home && isAtTop;

  return (
    <header
      id="site-header"
      className={cn(
        'fixed inset-x-0 top-0 z-40 h-[var(--header-height)]',
        'transition-[transform,background-color,border-color] duration-500 ease-premium',
        isHidden ? '-translate-y-full' : 'translate-y-0',
        isAtTop
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-border bg-background/80 backdrop-blur-xl',
      )}
    >
      {/* Desktop bar. First in the header, so editor edits saved against it keep their address. */}
      <Container className="hidden h-full items-center justify-between gap-8 lg:flex">
        <Logo size="lg" inverted={onDark} />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative inline-flex h-12 items-center rounded-full px-5 text-lg font-medium',
                      'transition-colors duration-300 ease-premium',
                      onDark
                        ? isActive
                          ? 'text-white'
                          : 'text-white/75 hover:text-white'
                        : isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {item.label}
                    {/* Active marker — a dot rather than an underline keeps the bar quiet. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-4 -bottom-0.5 mx-auto size-1 rounded-full',
                        'transition-opacity duration-300 ease-premium',
                        onDark ? 'bg-white' : 'bg-foreground',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className={cn(
              'hidden sm:inline-flex',
              /* The violet primary would vanish on the black hero; emerald stays visible. */
              onDark && 'bg-[#0D7651] text-[#F7F3FB] hover:bg-[#0B6646]',
            )}
          >
            <Link href={ROUTES.contact}>
              Start a project
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>

      {/*
        Phones and tablets: the four pages as pills, always in reach, with the
        menu beside them and "Start a project" on a second line — a hidden
        hamburger alone made every page a two-tap trip.
      */}
      <Container className="flex h-full flex-col justify-center gap-2 lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <nav aria-label="Primary">
            <ul className="flex flex-nowrap items-center gap-1">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'inline-flex h-8 items-center whitespace-nowrap rounded-full border px-2.5 text-xs',
                        'transition-colors duration-300 ease-premium',
                        isActive ? 'font-semibold' : 'font-medium',
                        onDark
                          ? 'border-transparent bg-white text-black'
                          : 'border-border bg-card text-foreground',
                        isActive && !onDark && 'border-foreground',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <MobileNav triggerClassName={onDark ? 'text-white' : undefined} />
        </div>
        <div className="flex justify-end">
          <Link
            href={ROUTES.contact}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#0D7651] px-3 text-[0.8125rem] font-medium text-[#F7F3FB] transition-colors duration-300 hover:bg-[#0B6646]"
          >
            Start a project
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </Container>
    </header>
  );
}
