import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { AnimatedText } from '@/components/common/animated-text';
import { MagneticButton } from '@/components/common/magnetic-button';
import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { ContactChannels } from '@/components/contact/contact-channels';
import { SocialIcons } from '@/components/contact/social-icons';
import { ROUTES, SECTION_IDS } from '@/constants/routes';
import { homeContent } from '@/data/content';

/**
 * Contact preview.
 *
 * One large card: an invitation on the left, every contact channel on the
 * right. All values are placeholders — fill them in `data/contact.ts` and each
 * row becomes a live link.
 */
export function ContactPreviewSection() {
  const content = homeContent.contact;

  return (
    <Section id={SECTION_IDS.contact} bordered>
      <Reveal variant="scale">
        <div className="overflow-hidden rounded-4xl border border-border bg-card shadow-soft">
          <div className="grid lg:grid-cols-2">
            {/* Invitation */}
            <div className="flex flex-col justify-between gap-16 p-8 sm:p-12 lg:border-r lg:border-border">
              <div>
                <p className="eyebrow">{content.eyebrow}</p>
                <AnimatedText
                  id={`${SECTION_IDS.contact}-title`}
                  as="h2"
                  text={content.title}
                  className="mt-6 text-display-sm font-medium tracking-tight"
                />
                <p className="mt-6 max-w-prose text-base leading-relaxed text-muted-foreground text-pretty">
                  {content.body}
                </p>
              </div>

              <div className="flex flex-col gap-8">
                <MagneticButton asChild size="lg" wrapperClassName="self-start">
                  <Link href={ROUTES.contact}>
                    {content.ctaLabel}
                    <ArrowRight className="size-4" />
                  </Link>
                </MagneticButton>

                <SocialIcons />
              </div>
            </div>

            {/* Channels */}
            <ContactChannels columns={1} className="border-t border-border lg:border-t-0" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
