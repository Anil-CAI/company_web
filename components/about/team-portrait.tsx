import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';
import type { TeamMember } from '@/types/team';
import { hasImage } from '@/utils/media';

interface TeamPortraitProps {
  member: TeamMember;
  className?: string;
}

/**
 * Reduces a name to its initials.
 *
 * Handles the "V. Vamsi" form the team uses: the trailing dot is dropped so
 * the monogram reads "VV" rather than "V.V".
 */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.replace(/\W/g, '').charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * A team member's portrait.
 *
 * Falls back to an initials monogram rather than a grey "photo missing" frame.
 * No headshots have been supplied yet, and a page of empty placeholder boxes
 * reads as unfinished, where a set of monograms reads as a deliberate choice.
 * Set `image.src` on a member and the photograph takes over for that person
 * alone — the two treatments sit together without looking broken.
 */
export function TeamPortrait({ member, className }: TeamPortraitProps) {
  const base = cn(
    'relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full',
    className,
  );

  if (member.image && hasImage(member.image)) {
    return (
      <span className={cn(base, 'border border-border bg-muted')}>
        <Image
          src={member.image.src}
          alt={member.image.alt}
          fill
          sizes="64px"
          className="object-cover"
        />
      </span>
    );
  }

  return (
    <span aria-hidden="true" className={cn(base, 'border border-border bg-ink-50')}>
      <span className="font-mono text-sm tracking-[0.08em] text-ink-500">
        {initials(member.name)}
      </span>
    </span>
  );
}
