'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { mainNavigation } from '@/data/navigation';
import { socialLinks } from '@/data/social';
import { getIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { padIndex } from '@/utils/format';
import { hasValue } from '@/utils/media';

/**
 * Mobile navigation drawer.
 *
 * Built on Radix Dialog, which supplies the focus trap, Escape handling,
 * `aria-modal` semantics and scroll locking. Entrance/exit is CSS-driven via
 * `data-state`, so no AnimatePresence bookkeeping is needed.
 */
interface MobileNavProps {
  /** Recolours the trigger when the header sits on a dark surface. */
  triggerClassName?: string;
}

export function MobileNav({ triggerClassName }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className={cn('lg:hidden', triggerClassName)}
        >
          <Menu className="size-5" strokeWidth={1.5} />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          )}
        />

        <Dialog.Content
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-background sm:max-w-md',
            'shadow-float duration-500 ease-premium',
            'data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
            'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
          )}
        >
          <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Primary site navigation and contact links
          </Dialog.Description>

          {/* Drawer header mirrors the site header so the transition feels continuous. */}
          <div className="flex h-[var(--header-height)] items-center justify-between border-b border-border px-gutter">
            <Logo />
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close navigation menu">
                <X className="size-5" strokeWidth={1.5} />
              </Button>
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-gutter py-10">
            <ul className="flex flex-col">
              {mainNavigation.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.id} className="border-b border-border last:border-b-0">
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className="group flex items-baseline gap-5 py-6"
                    >
                      <span className="font-mono text-[0.625rem] text-muted-foreground">
                        {padIndex(index + 1)}
                      </span>
                      <span className="flex-1">
                        <span
                          className={cn(
                            'block text-3xl font-medium tracking-tight transition-colors duration-300 ease-premium',
                            isActive ? 'text-foreground' : 'text-ink-600 group-hover:text-foreground',
                          )}
                        >
                          {item.label}
                        </span>
                        {item.description ? (
                          <span className="mt-2 block text-sm text-muted-foreground">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-5 shrink-0 translate-y-1 text-muted-foreground transition-transform duration-500 ease-premium group-hover:translate-x-1 group-hover:translate-y-1"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border px-gutter py-8">
            <Button asChild size="lg" className="w-full">
              <Link href={ROUTES.contact}>
                Start a project
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <ul className="mt-8 flex items-center gap-2">
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
                        className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 ease-premium hover:border-foreground hover:text-foreground"
                      >
                        <Icon className="size-4" strokeWidth={1.5} />
                      </a>
                    ) : (
                      <span
                        aria-label={`${link.label} — link not set`}
                        role="img"
                        className="flex size-10 items-center justify-center rounded-full border border-dashed border-border text-ink-400"
                      >
                        <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
