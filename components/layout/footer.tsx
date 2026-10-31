import Link from 'next/link';
import * as React from 'react';

import { Container } from '@/components/common/container';
import { Logo } from '@/components/common/logo';
import { PlaceholderValue } from '@/components/common/placeholder-value';
import { SocialIcons } from '@/components/contact/social-icons';
import { company } from '@/data/company';
import { footerNavigation, legalNavigation } from '@/data/navigation';
import { cn } from '@/lib/utils';
import { hasValue } from '@/utils/media';

/**
 * Site footer.
 *
 * Deliberately minimal: brand block, three link columns, social row and a
 * hairline bottom bar. The copyright year is computed at render time, so it
 * never goes stale.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="border-t border-border">
      <Container className="py-section-sm">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          {/* Brand block */}
          <div className="flex flex-col gap-8">
            <Logo withTagline />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
              {company.description}
            </p>
            <SocialIcons />
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3">
            {footerNavigation.map((group) => (
              <div key={group.id}>
                <h2 className="eyebrow mb-6">{group.title}</h2>
                <ul className="flex flex-col gap-4">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={cn(
                          'text-sm text-muted-foreground',
                          'transition-colors duration-300 ease-premium hover:text-foreground',
                        )}
                        {...(item.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {company.legalName}
            {hasValue(company.founded) ? (
              <>
                {' · '}
                <span>Est. {company.founded}</span>
              </>
            ) : (
              <>
                {' · '}
                <PlaceholderValue value="" placeholder="Est. ——" className="text-xs" />
              </>
            )}
            {' · '}All rights reserved.
          </p>

          <ul className="flex items-center gap-6">
            {legalNavigation.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="text-xs text-muted-foreground transition-colors duration-300 ease-premium hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
