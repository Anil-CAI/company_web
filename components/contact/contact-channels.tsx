import { ArrowUpRight } from 'lucide-react';
import * as React from 'react';

import { PlaceholderValue } from '@/components/common/placeholder-value';
import { contactChannels } from '@/data/contact';
import { getIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { ContactChannel, ContactChannelType } from '@/types/contact';
import { hasValue } from '@/utils/media';

interface ContactChannelsProps {
  /** Columns at the large breakpoint, or `bento` for the contact page's tile wall. */
  columns?: 1 | 2 | 3 | 'bento';
  className?: string;
}

const COLUMN_CLASS = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
} as const;

/**
 * Bento placement, keyed by channel type rather than list position.
 *
 * Email is the channel the form and footer also point at, so it gets the 2×2
 * tile; Instagram (the DM link) runs tall beside it. Placement is explicit at
 * `lg` so the wall never reflows into a ragged last row. The DOM order is left
 * as `data/contact.ts` has it — visual-editor edits are saved against
 * `li:nth-of-type(n)` — and `order-first` only lifts email to the top of the
 * one- and two-column stacks.
 */
const BENTO_TILE: Record<ContactChannelType, string> = {
  email: 'order-first sm:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-1',
  instagram: 'lg:col-start-3 lg:row-span-2 lg:row-start-1',
  linkedin: 'lg:col-start-4 lg:row-start-1',
  x: 'lg:col-start-4 lg:row-start-2',
  location: 'sm:col-span-2 lg:col-start-1 lg:row-start-3',
  whatsapp: 'lg:col-start-3 lg:row-start-3',
  phone: 'lg:col-start-4 lg:row-start-3',
};

/**
 * Contact channel grid.
 *
 * Each row is live only when both `value` and `href` are filled in
 * (`data/contact.ts`); until then it renders as static text with a muted hint,
 * so the card looks finished while the details are still placeholders.
 */
export function ContactChannels({ columns = 2, className }: ContactChannelsProps) {
  if (columns === 'bento') {
    return (
      <ul
        className={cn(
          'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[repeat(3,minmax(9.5rem,auto))]',
          className,
        )}
      >
        {contactChannels.map((channel) => (
          <li
            key={channel.id}
            className={cn(
              'flex overflow-hidden rounded-3xl border border-border bg-card shadow-soft',
              BENTO_TILE[channel.type],
            )}
          >
            <ContactChannelRow channel={channel} featured={channel.type === 'email'} tile />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        'grid grid-cols-1 gap-px overflow-hidden bg-border',
        COLUMN_CLASS[columns],
        className,
      )}
    >
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
  /** Bento tile: icon on top, text at the foot, arrow pinned top-right. */
  tile?: boolean;
  /** The 2×2 tile — larger value text. */
  featured?: boolean;
}

/**
 * A single channel row — link when live, plain text while placeholder.
 *
 * Tile and row share one child order (icon span, text span, arrow) so the
 * visual editor's `span:nth-of-type(2) > span:nth-of-type(1)` addresses hold in
 * both layouts.
 */
function ContactChannelRow({ channel, tile = false, featured = false }: ContactChannelRowProps) {
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
          isLive &&
            'group-hover/channel:border-transparent group-hover/channel:bg-foreground group-hover/channel:text-background',
        )}
      >
        <Icon className="size-[18px]" strokeWidth={1.5} />
      </span>

      <span className={cn('min-w-0 flex-1', tile && 'sm:w-full sm:flex-none')}>
        <span className="block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
          {channel.label}
        </span>
        <span
          className={cn(
            'mt-1.5 block text-foreground',
            tile ? '[overflow-wrap:anywhere]' : 'truncate',
            featured ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base',
          )}
        >
          <PlaceholderValue value={channel.value} placeholder={channel.placeholder} />
        </span>
      </span>

      {isLive ? (
        <ArrowUpRight
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform duration-500 ease-premium',
            tile && 'sm:absolute sm:right-7 sm:top-7',
            'group-hover/channel:translate-x-0.5 group-hover/channel:-translate-y-0.5',
          )}
        />
      ) : null}
    </>
  );

  const rowClass = tile
    ? 'group/channel relative flex w-full items-center gap-5 p-5 text-left sm:flex-col sm:items-start sm:justify-between sm:gap-8 sm:p-7'
    : 'group/channel flex w-full items-center gap-5 p-6 text-left sm:p-7';

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
