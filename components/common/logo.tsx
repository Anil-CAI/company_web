import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { ROUTES } from '@/constants/routes';
import { company } from '@/data/company';
import { cn } from '@/lib/utils';
import { hasImage } from '@/utils/media';

interface LogoProps {
  /** Use the inverted mark on dark surfaces. */
  inverted?: boolean;
  /** Render the "Robotic Solutions" line beneath the wordmark. */
  withTagline?: boolean;
  /** Wrap in a link to the home page. */
  asLink?: boolean;
  /** `lg` is the header's larger mark. */
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * Brand mark.
 *
 * Falls back to a typographic wordmark until a logo file exists — set
 * `company.logo.src` in `data/company.ts` and the image takes over everywhere
 * at once.
 */
export function Logo({
  inverted = false,
  withTagline = false,
  asLink = true,
  size = 'md',
  className,
}: LogoProps) {
  const lg = size === 'lg';
  const media = inverted ? company.logoInverted : company.logo;

  /*
   * The supplied logo is a square mark cropped from a dark mockup render, so
   * its background is baked in and cannot be made transparent honestly. It is
   * therefore set in a dark rounded badge — which reads as a deliberate brand
   * container rather than a grey rectangle sitting on the white header — with
   * the wordmark set beside it so the company name is still text.
   */
  const mark = hasImage(media) ? (
    <span className="flex items-center gap-4">
      {/*
        The badge lifts and grows as the cursor reaches it — the mark is the
        one element on the bar that is pure brand, so it is the one that reacts.
        The global reduced-motion rule collapses the transition to an instant
        swap.
      */}
      <span
        className={cn(
          'flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-ink-900 shadow-soft',
          'transition-[transform,box-shadow] duration-500 ease-premium',
          'group-hover:-translate-y-1 group-hover:scale-[1.18] group-hover:shadow-lift',
          'group-focus-visible:-translate-y-1 group-focus-visible:scale-[1.18]',
          lg ? 'size-16' : 'size-12',
        )}
      >
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width ?? 512}
          height={media.height ?? 512}
          priority
          className="size-full object-cover"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-semibold tracking-[-0.04em]',
            lg ? 'text-4xl' : 'text-2xl',
            inverted ? 'text-background' : 'text-foreground',
          )}
        >
          {company.name}
        </span>
        {withTagline ? (
          <span
            className={cn(
              'mt-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.28em]',
              inverted ? 'text-background/60' : 'text-muted-foreground',
            )}
          >
            {company.tagline}
          </span>
        ) : null}
      </span>
    </span>
  ) : (
    <span className="flex flex-col leading-none">
      <span
        className={cn(
          'text-2xl font-semibold tracking-[-0.04em]',
          inverted ? 'text-background' : 'text-foreground',
        )}
      >
        {company.name}
      </span>
      {withTagline ? (
        <span
          className={cn(
            'mt-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.28em]',
            inverted ? 'text-background/60' : 'text-muted-foreground',
          )}
        >
          {company.tagline}
        </span>
      ) : null}
    </span>
  );

  if (!asLink) {
    return <span className={cn('inline-flex items-center', className)}>{mark}</span>;
  }

  return (
    <Link
      href={ROUTES.home}
      aria-label={`${company.legalName} — home`}
      className={cn('group inline-flex items-center rounded-sm', className)}
    >
      {mark}
    </Link>
  );
}
