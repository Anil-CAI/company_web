import * as React from 'react';

import { socialLinks } from '@/data/social';
import { getIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { hasValue } from '@/utils/media';

interface SocialIconsProps {
  /** Larger circles for the contact page's standalone row. */
  size?: 'sm' | 'lg';
  className?: string;
}

const CIRCLE_SIZE = {
  sm: 'size-10',
  lg: 'size-12',
} as const;

const ICON_SIZE = {
  sm: 'size-4',
  lg: 'size-5',
} as const;

/**
 * Social profile row.
 *
 * Links with an empty `href` render as dashed, non-interactive circles that
 * still announce which platform they represent — the layout is final before
 * the accounts exist. Fill `href` in `data/social.ts` to activate one.
 */
export function SocialIcons({ size = 'sm', className }: SocialIconsProps) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {socialLinks.map((link) => {
        const Icon = getIcon(link.icon);
        const isEnabled = hasValue(link.href);

        return (
          <li key={link.id}>
            {isEnabled ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className={cn(
                  'flex items-center justify-center rounded-full border border-border text-muted-foreground',
                  'transition-all duration-300 ease-premium',
                  'hover:-translate-y-0.5 hover:border-foreground hover:text-foreground',
                  CIRCLE_SIZE[size],
                )}
              >
                <Icon className={ICON_SIZE[size]} strokeWidth={1.5} />
              </a>
            ) : (
              <span
                role="img"
                aria-label={`${link.label} — link not set`}
                className={cn(
                  'flex items-center justify-center rounded-full border border-dashed border-border text-ink-400',
                  CIRCLE_SIZE[size],
                )}
              >
                <Icon aria-hidden="true" className={ICON_SIZE[size]} strokeWidth={1.5} />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
