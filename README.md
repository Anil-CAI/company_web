# KRL Labs — Robotic Solutions

Marketing site for KRL Labs, a robotics company that builds autonomy,
perception and interfaces for the Unitree Go2 and G1 platforms.

Built with Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS,
Framer Motion, GSAP, Lenis and shadcn-style UI primitives. There is no backend
and no CMS: the site is statically rendered, and everything it says lives in
`/data`.

---

## Running the project

You need **Node.js 20 or newer** and npm.

```bash
git clone https://github.com/Anil-CAI/company_web.git
cd company_web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script              | What it does                                                    |
| ------------------- | --------------------------------------------------------------- |
| `npm run dev`       | Development server with hot reload                              |
| `npm run build`     | Production build (run this before deploying)                    |
| `npm run start`     | Serve the production build                                      |
| `npm run edit`      | Build and serve on `127.0.0.1:3000` with the visual editor on   |
| `npm run lint`      | ESLint                                                          |
| `npm run typecheck` | `tsc --noEmit`, strict mode                                     |

Use `npm run edit` only on your own machine. It is the only mode that exposes
the editor's save route, and that route refuses every request not addressed to
localhost.

---

## Making changes

### Change the text, links or data

Copy and facts live in `/data` (typed by `/types`). Edit the data file and the
component picks it up:

| To change…                       | Edit                         |
| -------------------------------- | ---------------------------- |
| Projects and their videos        | `data/projects.ts`           |
| Services, grouped by robot       | `data/services.ts`           |
| Team and the About page          | `data/team.ts`, `data/company.ts` |
| Contact details                  | `data/contact.ts`, `data/social.ts` |
| Navigation links                 | `data/navigation.ts`         |
| Privacy policy                   | `data/privacy.ts`            |

Do not hardcode copy in a component. If a section needs new text, add it to
`/data` first.

### Change the look

- **Colours:** the palette is the `:root` block in `styles/globals.css`. Change
  a token there and the whole site follows. Run `node scripts/verify-palette.mjs tokens`
  afterwards; it fails if body text drops below WCAG AA contrast.
- **Type sizes and spacing:** `tailwind.config.ts`.
- **Motion timings:** `constants/animation.ts`. Do not put magic numbers in
  components.

### Change the layout

Pages are lists of sections. Each page reads an ordered array in `/sections`:

- To reorder, add or remove a section, edit the array in `/sections`.
- To change how a section looks, edit its component in `/components`.

### Add images and video

Drop files into `public/` (see `public/README.md` for the expected paths), then
point the matching `image` or `video` field in `/data` at them. Empty strings
render a placeholder frame, so a missing file never breaks the page.

### Edit the site in the browser

Run `npm run edit`, open the site, and click **Edit site** (bottom left).

- **Select** anything by clicking it, then **double-click** text to rewrite it.
- **Drag** the blue handles to resize. Drag the move handle (top-left corner), or
  nudge with the arrow keys (Shift for 10px), to move it.
- **Delete** removes the selected element. **Ctrl+Z / Ctrl+Shift+Z** undo and redo.
- The **Theme** tab changes colours site-wide and scales the whole site.
- The **Changes** tab lists every edit, lets you restore or revoke any of them,
  and reports edits whose element no longer exists.

Edits save automatically to `data/site-overrides.json`. They apply to visitors
after a fresh `npm run build`. A plain `npm run start` or a deployed site shows
no editor.

### Save your changes to GitHub

```bash
git checkout -b my-change        # work on a branch, not main
# ...make your changes...
npm run typecheck && npm run lint && npm run build
git add -A
git commit -m "Describe what changed"
git push -u origin my-change     # then open a pull request on GitHub
```

Keep `main` deployable. Merge through a pull request so each change is reviewed.

---

## Project layout

| Folder         | Holds                                                          |
| -------------- | -------------------------------------------------------------- |
| `app/`         | Routes (`/`, `/about`, `/services`, `/contact`, `/privacy`) and the save API |
| `components/`  | React components: layout, sections, UI primitives, editor      |
| `sections/`    | The ordered section list for each page                         |
| `data/`        | All copy and facts, and the visual editor's saved edits        |
| `types/`       | TypeScript types for `/data`                                   |
| `styles/`      | Global CSS and the colour tokens                               |
| `public/`      | Images, posters and the other static files                     |
| `containt/`    | Original source footage (not served to visitors)               |
| `scripts/`     | Verification scripts (palette contrast, build routes)          |

The deeper design notes, including the content system and how motion is built,
are in the sections below and in `CLAUDE.md`.

---

## The one thing to know

**Content lives in `/data`. Components never contain literal copy.**

To change what the site says or shows, edit a file in `/data` — the components
already render it. To change how it looks, edit the component. The two concerns
never mix.

Two conventions make the placeholder system work:

1. **Empty `src` means "not supplied yet."** Media components render a styled
   placeholder frame at the exact final dimensions. Set `src` and real media
   takes over — no component change.
2. **Empty `value` means "not supplied yet."** Contact rows, years and handles
   render a muted hint and stay non-interactive. Fill in `value` (and `href`)
   and the row becomes a live link.

Nothing is broken while the placeholders are in place; the layout is final.

---

## Filling in the placeholders

| I want to…                     | Edit                                      |
| ------------------------------ | ----------------------------------------- |
| Change the company name/blurb  | `data/company.ts`                         |
| Add the logo                   | `data/company.ts` → `logo.src`            |
| Add contact details            | `data/contact.ts` → `value` **and** `href` |
| Add social links               | `data/social.ts` → `href`, `handle`       |
| Add the Google Map             | `data/contact.ts` → `officeLocation.mapEmbedUrl` |
| Add projects / project media   | `data/projects.ts`                        |
| Add or reword services         | `data/services.ts`                        |
| Change domains                 | `data/domains.ts`                         |
| Set real numbers & milestones  | `data/achievements.ts`                    |
| Add client logos               | `data/clients.ts`                         |
| Reword any heading or section  | `data/content.ts`                         |
| Change menus / footer links    | `data/navigation.ts`                      |
| Change the domain, SEO defaults| `constants/site.ts`                       |
| Reorder a whole page           | `sections/*-sections.ts`                  |

Asset drop zones and expected filenames are documented in
[`public/README.md`](./public/README.md).

### Example: switching on the email row

```ts
// data/contact.ts
{
  id: 'contact-email',
  type: 'email',
  label: 'Email',
  value: 'hello@krl-labs.com',        // was ''
  placeholder: 'Add email address',
  href: 'mailto:hello@krl-labs.com',  // was ''
  icon: 'mail',
}
```

The row becomes a live `mailto:` link, gains its hover state and the arrow
affordance. Nothing else changes.

### Example: adding a project image

Drop `public/projects/amr.jpg`, then:

```ts
image: { src: '/projects/amr.jpg', alt: 'Autonomous mobile platform' },
```

---

## Architecture

```
app/                    App Router: three pages + SEO routes
├─ layout.tsx           Root layout, metadata, providers, chrome
├─ page.tsx             Landing page
├─ services/page.tsx    Services page
├─ contact/page.tsx     Contact page
├─ icon.svg             Favicon placeholder (file convention)
├─ sitemap.ts robots.ts manifest.ts
└─ not-found.tsx error.tsx loading.tsx

components/
├─ ui/                  shadcn-style primitives (Button, Card, Accordion, …)
├─ common/              Shared building blocks (Section, Reveal, placeholders…)
├─ layout/              Header, Footer, mobile nav, smooth scroll, JSON-LD
├─ home/                Landing page sections
├─ services/            Services page sections
├─ projects/            Project card
└─ contact/             Contact card, channels, form, map

sections/               Ordered section registry — one array per page
data/                   All content. The only files you need to edit.
types/                  Domain types, one module per concept
hooks/                  Reusable client hooks
lib/                    cn, motion variants, icon registry, fonts, seo, gsap
utils/                  Pure helpers (format, math, media)
constants/              Site config, routes, breakpoints, animation tokens
styles/                 Global CSS and design tokens
public/                 Media drop zones (all empty)
```

### Why `/sections` exists alongside `/components/*`

`components/home`, `components/services` and `components/contact` hold the
section *implementations*. `/sections` holds the *composition* — an ordered
array per page:

```ts
// sections/home-sections.ts
export const homeSections: PageSection[] = [
  { id: SECTION_IDS.hero, Component: HeroSection },
  { id: SECTION_IDS.projects, Component: FeaturedProjectsSection },
  // …
];
```

Pages map over that array. Reordering, removing or inserting a section is a
one-line change and never touches a page file.

---

## The hero

`components/home/hero-portrait.tsx` is the opening screen. It shows a character
illustration that dissolves into the robot as the visitor scrolls, using a WebGL
shader (`components/ui/scroll-dissolve-reveal.tsx`). The shader is loaded only on
the client, and reduced-motion visitors get a still image. The copy lives in
`data/hero.ts`.

---

## Design system

| Token        | Value                                                    |
| ------------ | -------------------------------------------------------- |
| Background   | Pure white                                                |
| Ink          | `#111111`                                                 |
| Borders      | Single hairline, `hsl(0 0% 91%)`                          |
| Radius       | `rounded-2xl` on cards, `rounded-4xl` on large surfaces    |
| Shadows      | `soft` → `lift` → `float`, all very low contrast          |
| Type         | Inter (display + body), JetBrains Mono (eyebrows, chips)   |
| Easing       | `cubic-bezier(0.16, 1, 0.3, 1)` everywhere                |
| Section pad  | `clamp(6rem, 12vw, 11rem)`                                |

Tokens live in `styles/globals.css` (CSS variables) and `tailwind.config.ts`.
Animation timings live in `constants/animation.ts` — no magic numbers in
components.

### Motion

- **Framer Motion** — all entrance reveals (`Reveal`, `RevealGroup`), the masked
  word reveal on headings (`AnimatedText`), magnetic buttons, timelines.
- **GSAP + ScrollTrigger** — only where scroll-linked scrubbing is needed:
  statistic count-ups and media parallax.
- **Lenis** — smooth scrolling, driven by the GSAP ticker so scroll position and
  scrubbed animations advance on the same frame.

Everything degrades under `prefers-reduced-motion`: Lenis never initialises,
GSAP effects are skipped and the marquee stops.

---

## Accessibility

- Semantic landmarks (`header`, `main`, `nav`, `footer`, `section`), each
  section labelled by its heading.
- Skip link to main content.
- Radix primitives for the accordion and mobile drawer, so focus trapping,
  Escape handling and ARIA state are correct by construction.
- Visible focus rings on every interactive element; card links use a stretched
  pseudo-element so the tab order stays clean.
- Placeholder media carries descriptive `aria-label`s; decorative duplicates
  (the client marquee) are `aria-hidden`.
- Form errors use `role="alert"`, `aria-invalid` and `aria-describedby`, and
  focus moves to the first invalid field on submit.

---

## SEO

Metadata is composed per route by `buildMetadata` in `lib/seo.ts`: canonical
URLs, Open Graph and Twitter cards. `app/sitemap.ts`, `app/robots.ts` and
`app/manifest.ts` are generated. Organisation JSON-LD is injected in the root
layout from `data/company.ts`. Set your domain once in `constants/site.ts`.

---

## The contact form

Fields are declared in `data/contact.ts`, so adding one is a data edit.
Validation runs entirely client-side and **nothing is transmitted** — there is
no backend. To make it live, replace the `setStatus('success')` branch in
`components/contact/contact-form.tsx` with a call to your endpoint or form
service; the loading, error and success states are already in place.
