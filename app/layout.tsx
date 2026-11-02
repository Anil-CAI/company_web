import type { Metadata, Viewport } from 'next';
import * as React from 'react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { BootScreen } from '@/components/layout/boot-screen';
import { SiteEditorLoader } from '@/components/editor/site-editor-loader';
import { SiteOverrides } from '@/components/editor/site-overrides';
import { JsonLd } from '@/components/layout/json-ld';
import { PageTransition } from '@/components/layout/page-transition';
import { ScrollToTop } from '@/components/layout/scroll-to-top';
import { SingleAudio } from '@/components/layout/single-audio';
import { SkipLink } from '@/components/layout/skip-link';
import { SmoothScrollProvider } from '@/components/layout/smooth-scroll-provider';
import { SECTION_IDS } from '@/constants/routes';
import { ASSETS, SITE, SITE_URL } from '@/constants/site';
import { fontVariables } from '@/lib/fonts';

import '@/styles/globals.css';

/**
 * Root metadata.
 *
 * `metadataBase` makes every relative OG/Twitter asset resolve to an absolute
 * URL. Per-page metadata is composed with `buildMetadata` in `lib/seo.ts`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: SITE.titleTemplate,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: SITE.locale,
    images: [{ url: ASSETS.ogImage, width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    /* Omitted entirely while no handle is owned — see `constants/site.ts`. */
    ...(SITE.twitterHandle ? { site: SITE.twitterHandle, creator: SITE.twitterHandle } : {}),
    images: [ASSETS.twitterImage],
  },
  /*
    Icons come from the App Router file convention (`app/icon.svg`), so nothing
    is declared here — a manual `icons` entry would override the convention and
    point at files that do not exist yet. Add `app/apple-icon.png` to ship an
    iOS home-screen icon.
  */
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
  verification: {
    google: '4ybZRSbruhvz0CicEwgTWrNv9foMFiPzEhRxnPzmX6s',
  },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={SITE.language} className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        {/*
          Edits made in the visual editor (`npm run edit`), baked in at build
          time from `data/site-overrides.json`. First, so they apply before
          anything paints.
        */}
        <SiteOverrides />

        {/* Covers the page while above-the-fold assets decode. */}
        <BootScreen />

        <SmoothScrollProvider>
          <SkipLink />
          <Header />

          {/*
            `main` is the skip-link target and the page's landmark.
            `overflow-x-clip` contains the horizontal slide-in reveals: without
            it their off-screen start position widens the document and mobile
            picks up a sideways scroll. Clip (not hidden) avoids turning this
            into a scroll container, which would fight Lenis.
          */}
          <main id={SECTION_IDS.main} className="overflow-x-clip">
            <PageTransition>{children}</PageTransition>
          </main>

          <Footer />
          <ScrollToTop />
          <SingleAudio />

          {/* Renders nothing unless served from localhost by `npm run edit`. */}
          <SiteEditorLoader />
        </SmoothScrollProvider>

        <JsonLd />
      </body>
    </html>
  );
}
