'use client';

import * as React from 'react';

import SocialFlipButton, { type SocialItem } from '@/components/ui/social-flip-button';
import { contactChannels } from '@/data/contact';
import { getIcon } from '@/lib/icons';
import type { ContactChannel } from '@/types/contact';
import { hasValue } from '@/utils/media';

/**
 * The word CONTACT, each letter flipping to one of our channels on hover.
 *
 * Seven letters, so seven tiles. They are built from `data/contact.ts` rather
 * than hardcoded, so publishing a WhatsApp number or LinkedIn URL there lights
 * up the matching tile with no change here.
 *
 * Every tile is clickable, as asked. A channel we have not published yet has no
 * `href` of its own, so it falls back to email — the one channel we actually
 * answer. Its tooltip still names the real channel and says so ("LinkedIn —
 * email us"), because a tile that silently redirects would be a small lie.
 */

/** Order of the tiles, one per letter of C-O-N-T-A-C-T. */
const LETTERS = ['C', 'O', 'N', 'T', 'A', 'C', 'T'] as const;

/**
 * Which channel sits under each letter.
 *
 * Email leads because it is the live one; location closes because it is context
 * rather than a destination. The ids are the ones in `data/contact.ts`.
 */
const TILE_ORDER = [
  'contact-email',
  'contact-instagram',
  'contact-linkedin',
  'contact-whatsapp',
  'contact-phone',
  'contact-location',
] as const;

/** The email channel — the destination for any tile without one of its own. */
function findEmail(): ContactChannel | undefined {
  return contactChannels.find((channel) => channel.type === 'email');
}

export function ContactFlip() {
  const items = React.useMemo<SocialItem[]>(() => {
    const email = findEmail();
    const fallback = hasValue(email?.href) ? email!.href : '';

    const tiles = TILE_ORDER.map((id) =>
      contactChannels.find((channel) => channel.id === id),
    ).filter((channel): channel is ContactChannel => Boolean(channel));

    /*
     * Six channels across seven letters, so the last letter repeats the email
     * tile — a second, larger target for the action we most want. If a channel
     * is ever added to the data this slot fills itself instead.
     */
    const ordered = [...tiles];
    while (ordered.length < LETTERS.length && email) ordered.push(email);

    return ordered.slice(0, LETTERS.length).map((channel, index) => {
      const Icon = getIcon(channel.icon);
      const live = hasValue(channel.href);

      return {
        letter: LETTERS[index],
        icon: <Icon className="size-4" aria-hidden="true" />,
        /* An unpublished channel says where the click actually goes. */
        label: live ? channel.label : `${channel.label} — email us`,
        href: live ? channel.href : fallback,
      };
    });
  }, []);

  return <SocialFlipButton items={items} className="p-0" />;
}
