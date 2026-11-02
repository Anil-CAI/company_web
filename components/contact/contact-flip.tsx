'use client';

import { Send } from 'lucide-react';
import * as React from 'react';

import SocialFlipButton, { type SocialItem } from '@/components/ui/social-flip-button';
import { SECTION_IDS } from '@/constants/routes';
import { contactChannels } from '@/data/contact';
import { contactContent } from '@/data/content';
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
 * Email leads because it is the one we answer fastest; the social channels
 * follow, then WhatsApp and phone (which fall back to email until their
 * numbers are published). Location has no link, so it lives only in the
 * "Reach us" list. The ids are the ones in `data/contact.ts`.
 */
const TILE_ORDER = [
  'contact-email',
  'contact-instagram',
  'contact-linkedin',
  'contact-x',
  'contact-whatsapp',
  'contact-phone',
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

    const channelItems = tiles.map((channel, index) => {
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

    /*
     * Six channels across seven letters. The last letter used to repeat the
     * email tile, which read as a mistake (two identical mail icons); it now
     * jumps to the message form further down the page.
     */
    return [
      ...channelItems,
      {
        letter: LETTERS[channelItems.length],
        icon: <Send className="size-4" aria-hidden="true" />,
        label: contactContent.form.title,
        href: `#${SECTION_IDS.contactForm}`,
      },
    ].slice(0, LETTERS.length);
  }, []);

  return <SocialFlipButton items={items} className="justify-start p-0" />;
}
