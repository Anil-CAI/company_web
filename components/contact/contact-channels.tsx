import { ArrowUpRight } from 'lucide-react';
import * as React from 'react';

import { PlaceholderValue } from '@/components/common/placeholder-value';
import { contactChannels } from '@/data/contact';
import { getIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { ContactChannel } from '@/types/contact';
import { hasValue } from '@/utils/media';

interface ContactChannelsProps {
  /** Columns at the large breakpoint. */
  columns?: 1 | 2 | 3;
  className?: string;
}

const COLUMN_CLASS = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
} as const;

/**
 * Contact channel grid.
 *
 * Each row is live only when both `value` and `href` are filled in
 * (`data/contact.ts`); until then it renders as static text with a muted hint,
 * so the card looks finished while the details are still placeholders.
 */
export function ContactChannels({ columns = 2, className }: ContactChannelsProps) {
  return (
    <ul className={cn('grid gap-px overflow-hidden bg-border', COLUMN_CLASS[columns], className)}>
      {contactChannels.map((channel) => (
        <li key={channel.id} className="bg-background">
          <ContactChannelRow channel={channel} />
        </li>
      ))}
    </ul>
  );
}

interface ContactChannelRowProps {
  channel: ContactChannel;
}

/** A single channel row — link when live, plain text while placeholder. */
function ContactChannelRow({ channel }: ContactChannelRowProps) {
  const Icon = getIcon(channel.icon);
  const isLive = hasValue(channel.value) && hasValue(channel.href);
  const isExternal = channel.type !== 'email' && channel.type !== 'phone';

  const body = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/50',
          'transition-colors duration-500 ease-premium',
          isLive && 'group-hover/channel:border-transparent group-hover/channel:bg-foreground group-hover/channel:text-background',
        )}
      >
        <Icon className="size-[18px]" strokeWidth={1.5} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
          {channel.label}
        </span>
        <span className="mt-1.5 block truncate text-base text-foreground">
          <PlaceholderValue value={channel.value} placeholder={channel.placeholder} />
        </span>
      </span>

      {isLive ? (
        <ArrowUpRight
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform duration-500 ease-premium',
            'group-hover/channel:translate-x-0.5 group-hover/channel:-translate-y-0.5',
          )}
        />
      ) : null}
    </>
  );

  const rowClass = 'group/channel flex w-full items-center gap-5 p-6 text-left sm:p-7';

  if (!isLive) {
    return <div className={rowClass}>{body}</div>;
  }

  return (
    <a
      href={channel.href}
      className={cn(rowClass, 'transition-colors duration-500 ease-premium hover:bg-secondary/40')}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {body}
    </a>
  );
}
