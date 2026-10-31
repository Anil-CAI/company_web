# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

KRL Labs marketing site — Next.js 15 App Router, React 19, TypeScript (strict), Tailwind 3, Framer Motion, GSAP, Lenis, shadcn-style primitives (Radix). Five static pages (`/`, `/about`, `/services`, `/contact`, `/privacy`), no backend, no CMS. `README.md` is the primary reference for the content/placeholder system and design tokens; read it first.

## Commands

```bash
npm run dev         # dev server on :3000
npm run build       # production build
npm run start       # serve the build
npm run edit        # build + serve on 127.0.0.1 with the in-browser visual editor
npm run lint        # next lint — only scans the dirs listed in next.config.mjs `eslint.dirs`
npm run typecheck   # tsc --noEmit
```

There is no test suite. Verify changes with `npm run typecheck && npm run lint`, then `npm run build` for anything touching routing, metadata or `'use client'` boundaries.

## Architecture

### Content vs. presentation — the core rule

**All copy lives in `/data`. Components never contain literal strings of content.** Every data module is typed by a matching module in `/types` (barrels: `@/data`, `@/types`). To change what the site says, edit `/data`; to change how it looks, edit the component. Don't blur this line when adding features — a new section means a new `data/*.ts` + `types/*.ts` pair, not inline copy.

### Section registry

Pages are trivial: `app/*/page.tsx` maps over an ordered `PageSection[]` from `sections/*-sections.ts`. Section components take **no props by design** — they import their own data from `@/data`. To add/reorder/remove a section on a page, edit the array in `/sections`, never the page file. Section DOM ids come from `SECTION_IDS` in `constants/routes.ts` (used for anchors, nav and scroll targets).

`components/common/section.tsx` wraps every block. By default it sets `aria-labelledby="{id}-title"`, so a section must render a heading with `id="{id}-title"` (`SectionHeading` does this) or pass `label=` instead — otherwise the ARIA reference dangles.

### Real media

Six clips live in `/public/videos`, each with a `-poster.jpg` generated beside it (`ffmpeg -ss 2 -frames:v 1`), so a card costs one small JPEG until someone presses play — this matters: the 3D navigation capture alone is 25 MB. Source files are kept in `containt/` (outside `public/`, not served).

Ratios are mixed and that drives real code: the G1 captures are 16:9, the Go2 web-navigation clips are 9:16 phone recordings. `MediaRatio` gained a `tall` (9:16) member because `portrait` is 3:4 and letterboxes phone footage. `Project.videoRatio` carries the frame per project (`project-card.tsx` also width-caps a `tall` clip so it does not run a desktop column's full height), and `DanceModel.video` is optional — a routine without footage falls back to the animated stick figure.

**Layout follows the footage.** `project-card.tsx` branches on `videoRatio`: a `tall` (9:16) clip sits **side by side** with its image in a 7-column media block, because two portrait frames stay tall at half width. A landscape (16:9) clip **stacks** above its image in a wider 8-column block — side by side, a 16:9 frame at half width is also half height, which made the dance clip too small to watch. The copy column narrows to 4 columns to compensate. Don't unify these: the two ratios genuinely need different treatment.

Empty media slots use `.placeholder-draft` (a drafting grid with corner registration marks), not the old diagonal hatch — beside real footage the hatch read as a broken image.

**Don't caption footage as something it isn't.** Two featured projects (Point Cloud Mapping, and any routine not yet filmed) deliberately keep empty video slots rather than borrow an unrelated clip; the `label` is read out by screen readers, so a mismatch is a lie the alt text has to tell.

### Placeholder system

Empty string = "not supplied yet". `utils/media.ts` (`hasImage`, `hasVideo`, `hasValue`) is the single source of that rule; `PlaceholderImage`, `PlaceholderVideo`, `PlaceholderLogo` and `PlaceholderValue` in `components/common` render a styled frame/hint when empty and the real asset when filled. Never special-case empty media in a section component — route it through these. `public/README.md` documents expected asset paths.

### Icons by string key

Data files reference icons as strings (`icon: 'mail'`) resolved through `iconRegistry` / `getIcon` in `lib/icons.ts`. The `IconName` union is derived from the registry, so adding an icon is one line there and type-checks everywhere.

### Motion — three layers, one token set

- **Framer Motion** — entrance reveals (`Reveal`, `RevealGroup`/`RevealItem`, `AnimatedText`), magnetic buttons, drawer. Variants are shared from `lib/motion.ts`; pick one rather than inventing timings.
- **GSAP + ScrollTrigger** — only for scroll-scrubbed work (count-ups, parallax, timeline draws). Always import from `@/lib/gsap` (registers the plugin, browser-guarded), never from `gsap` directly.
- **Lenis** — `SmoothScrollProvider` (root layout) drives Lenis from the **GSAP ticker** so scroll position and ScrollTrigger advance on the same frame. Use `useLenis()` / `useScrollTo()` from `hooks/use-lenis.ts` for programmatic scrolling; both fall back to native when Lenis is null.
- All durations, easings, stagger and Lenis options live in `constants/animation.ts` — no magic numbers in components.
- **Reduced motion**: Lenis never initialises (context stays `null`), GSAP effects must be skipped by consumers, and `globals.css` collapses CSS animations. New motion must degrade the same way.

### Design tokens

**The palette is warm, not monochrome.** `:root` in `styles/globals.css` declares the three brand colours — `--kumkuma` (maroon), `--pasupu` (turmeric), `--skin` (wheatish) — and every shadcn surface token is derived from them. Re-skinning the whole site happens in that one block.

Two rules that are easy to break:

- **Surfaces are tinted, never neutral.** `--background` sits at 35° hue; the ink is maroon-biased (`350 41% 12%`), not black. A neutral grey dropped onto this page reads as dirty, because the eye compares it against the surrounding warmth. The Tailwind `ink-*` ramp carries the same bias for exactly this reason — don't swap in a stock grey scale.
- **Contrast is enforced, not assumed.** `scripts/verify-palette.mjs tokens` recomputes WCAG ratios from the committed token values and fails below 4.5:1 for body text. If you retune a colour, run it.

### Motion: page transitions

`components/layout/page-transition.tsx` wraps `children` in the root layout and cross-fades on `pathname`. Two deliberate choices: **no `mode="wait"`** (waiting for the exit before the entrance doubles perceived click latency — the two overlap instead), and reduced-motion visitors get the children with **no `AnimatePresence` in the tree at all**, since an opacity animation starting at 0 is still a flash even at 0.01ms.

`VIEWPORT_ONCE` in `constants/animation.ts` uses `amount: 0.08` with a `-12%` bottom margin. The old 0.25 meant a tall section had to be a quarter on screen before moving, which on a phone fired after the reader had already arrived. The margin is viewport-relative so one value serves laptop and mobile without a breakpoint.

### Legacy design tokens

CSS variables in `styles/globals.css` (`@layer base`) feed Tailwind via `tailwind.config.ts`. Custom scale worth knowing: `text-display-sm|md|lg|xl`, `text-eyebrow`, `py-section`, `px-gutter`, `shadow-soft|lift|float`, `ease-premium`, `ink-50…950`. Two gotchas:

- `lib/utils.ts` extends tailwind-merge so `text-display-*` isn't treated as a colour and stripped. Always compose classes with `cn()`.
- Tailwind `content` globs include `utils/`, `constants/` and `data/` because class maps (e.g. `RATIO_CLASS`) live outside `components/`. Any new folder that holds class strings must be added or its classes silently disappear from the build.

### The hero (README is out of date here)

`README.md` still describes the hero as an empty white section. It is white again, but not empty: `components/home/hero-section.tsx` is a full-viewport drafting sheet with a spec card (`hero-spec-card.tsx`, copy from `data/hero.ts`) and an SVG CAD drawing (`robot-blueprint.tsx`, projection math with heavy inline commentary). Its entrance is pure CSS (`hero-rise`, `hero-zoom-in`) with `animation-fill-mode: both` so reduced-motion lands on the finished state.

The sheet was formerly maroon/turmeric (`--kumkuma`, `--pasupu`, `--skin`) and is now white/ink (`--sheet`, `--rule`, `--ghost`), still scoped to `.hero-paper`. Three consequences if you touch it:

- The grid ruling is held very faint (5.5% / 2.8% black). Black on white has none of the latitude the maroon ground had — at "normal" opacity it reads as a data table.
- The hero vignette fades to **white** at the edges, not dark. Darkening on a white sheet reads as a smudge.
- `robot-blueprint.tsx`'s face tints invert: the lit top is nearly clean paper and the shadowed side takes the most ink. The screen stays dark on purpose — it is the drawing's only filled shape and the cream LED face needs something to glow against.

The header no longer has an `onHeroSheet` inversion; it was there only to flip the bar to cream over the dark hero.

### Fleet sections: Navigation and Robot dance models

Two features describe the same two robots (Unitree **Go2**, a quadruped, and **G1**, a humanoid) from different angles, and they share a card layout on purpose so they scan as a pair. Nothing general-purpose should be inserted between them in `sections/home-sections.ts`.

- **Navigation** is *not* a section — it is a featured project (`project-01` in `data/projects.ts`). `Project` carries an optional `platforms?: readonly NavPlatform[]`; when present, `project-card.tsx` renders `project-platforms.tsx` as a native `<details>` "see more" disclosure beneath the card copy. The data lives in `data/navigation-stack.ts` / `types/navigation-stack.ts`. A capability carries a `status` of `deployed` or `planned`; planned rows render dimmed with an "In progress" chip rather than being omitted, because "shipping on Go2, coming to G1" is the actual state of the work (person following is the live example). Don't silently drop a planned capability — that loses the roadmap. The disclosure is a `<details>` rather than React state so the open/close, keyboard handling and ARIA come from the element.
- **Robot dance models** — `components/home/dance-section.tsx` over `data/dance.ts` / `types/dance.ts`. Both routines run on G1 and are named for their tracks (from the Telugu film *Paradise*), so the card headline is `track.title` with `track.film` credited beneath. There is no platform→figure map here; every card draws the biped.

`dance-figure.tsx` is shared by both sections — `kind` picks biped/quadruped/arm and `action` sets the accessible label ("walking" in Navigation at a flat 60 BPM, "dancing" in the dance cards at the routine's own tempo). The `arm` figure is currently unused by either section; it is kept because the rig demonstrates the nested-joint approach the other two depend on.

The figures are jointed SVG stick figures, not 3D models — deliberately, to avoid a WebGL runtime for a looping drawing partway down the page. Two things to know:

- Each `<g>` sets `transform-origin` in **viewBox user units**, so the CSS rule uses `transform-box: view-box`, *not* the `fill-box` the `robot-*` classes use. Under `fill-box` each limb pivots around its own bounding box and the figure comes apart.
- Tempo flows from data: a move's `bpm` becomes a `--beat` CSS variable per figure, which the `dance-*` keyframes consume. Change the number in `data/dance.ts` and that figure dances faster. Every cycle starts and ends at the rest pose, so the global reduced-motion rule freezes the figures standing rather than mid-swing.

### Services page — split by robot, not by category

`components/services/service-platforms-section.tsx` over `data/services.ts`. Each `Service` carries `platforms: ('go2'|'g1'|'other')[]`, and a service can appear under more than one — most of the stack runs on both robots, so duplicating entries would mean two places to edit one piece of copy. `platformNotes` overrides the one-liner where the offer genuinely differs per platform (Go2 VR is teleoperation + robot-perspective view only; G1 VR adds training and maintenance).

The hero hands over to `platform-picker.tsx`: three picture cards (Go2 / G1 / Other) that anchor down to their section. Pictures beat text pills here — a visitor recognises the quadruped on sight faster than they parse a model name. They are plain `<a href="#platform-go2">` anchors, so they work before hydration and keep every service in the document.

**Every group renders in full — do not convert this to tabs.** Tabs would hide half the catalogue behind a click most visitors never make, and the hidden half would be invisible to search engines. The jump links are plain `<a href="#platform-go2">` anchors so they work before hydration and on mobile, where a hover-reveal would not.

KRL does **not** do hardware work, so there is no "Robotics Engineering" service; `scripts/verify-tonight.mjs services` asserts it stays removed.

### About / Team page

`app/about/page.tsx` over `sections/about-sections.ts`, with copy in `data/team.ts` (`types/team.ts`) and `aboutContent` in `data/content.ts`. Four blocks: hero, story, team, principles.

**The thin fields are deliberate.** `TeamMember.focus` is a domain, not a job title, and `note`/`image` are optional — the company was founded by students and the titles are not settled, so inventing "Lead Perception Engineer" would be a detail a visitor could check and find wrong. `TeamPortrait` falls back to an initials monogram rather than an empty photo frame, so a page with no headshots reads as a choice rather than as unfinished; set `image.src` on one member and that person alone gets a photograph. The closing `note` says the named members are part of a wider team, so four cards never imply the whole company.

The principles section renders `company.principles`, which already existed in `data/company.ts` but had no page rendering them.

### Privacy policy

`app/privacy/page.tsx` over `data/privacy.ts`. Plain prose, not a section stack — it is read top to bottom and will never be reordered. Every claim must stay true of the implementation: if the contact form ever starts storing or sharing anything, this file changes in the same commit.

### Visual editor (`npm run edit`)

An in-browser editor lets the owner restyle, re-word, resize and delete things without touching code. `npm run edit` builds, then serves on `127.0.0.1:3000` with `SITE_EDITOR=1`; an "Edit site" pill appears bottom-left. Plain `npm run start` and any real deployment show no editor and answer 404 on the save route.

- **Edits are data, not code changes.** They live in `data/site-overrides.json` (typed by `types/site-overrides.ts`), keyed by a CSS selector per page (`pages["/services"]`) or `global` for anything outside `<main>`. Components are never modified, so the content/presentation split holds — but an edit made here will silently win over a later change to the same element in `/data` or a component, because overrides apply with `!important`. Check the Changes tab (or the JSON) before wondering why a component edit "doesn't work".
- **Selectors anchor at the nearest unique id or landmark** (`#platform-go2 > div:nth-of-type(2) > …`, `header > …`), never at `<body>`, so the boot screen and the editor mounting do not shift them. Restructuring a section's markup can orphan its edits; they then show as "Not found on page" in the Changes tab.
- **Baking.** `components/editor/site-overrides.tsx` reads the file with `fs` (not `import`, which would hot-reload on every save and wipe undo history) and renders it as a `<style>` plus a pre-paint script that sets `html[data-site-path]` for page-scoped rules. Visitors get edits on first paint with no editor code. Text replacements are applied client-side by `overrides-applier.tsx`.
- **Safety.** `lib/site-overrides.ts#sanitizeOverrides` whitelists properties and rejects any value containing `;{}<>`, both on save and when baking — the file ends up as raw CSS in every page. The API route (`app/api/site-editor`) also requires a localhost `Host` and `Origin`.
- **Undo.** Ctrl+Z / Ctrl+Shift+Z within a session; per-element and per-page Revoke in the Changes tab; `data/site-overrides.backup.json` is the file as it stood before the session's first save.
- Edits saved under `npm run edit` show immediately there; a deploy needs a fresh `npm run build` to bake them.

### Contact form

The form POSTs to `NEXT_PUBLIC_CONTACT_ENDPOINT` (see `.env.example`). **A missing endpoint surfaces an error, never a fake success** — a submission that silently vanishes is the worst of the three outcomes, because the sender believes they were heard.

### Verification gates

`GATES.md` plus `scripts/verify-tonight.mjs` and `scripts/verify-build.mjs` (the `unlazy` skill's format). Run `node .claude/skills/unlazy/scripts/gate-check.mjs --status GATES.md`. `verify-build.mjs` parses the route token out of each build line and compares exactly — an earlier substring match let `/privacy` satisfy a check for `/`, so it passed dishonestly.

### SEO / site config

Per-route metadata is composed with `buildMetadata()` in `lib/seo.ts`; the domain and defaults live in `constants/site.ts` (`SITE_URL` is the single place to change it). Favicon uses the `app/icon.svg` file convention — don't add an `icons` entry to root metadata or it overrides the convention. Organisation JSON-LD is injected once in the root layout.

### Contact form

`components/contact/contact-form.tsx` validates client-side and transmits nothing. Fields are declared in `data/contact.ts`. To wire a backend, replace the `setStatus('success')` branch; loading/error/success states already exist.

## Code conventions

- Path alias `@/*` → repo root. Each folder has an `index.ts` barrel; import from the barrel or the specific module, both are used.
- ESLint enforces inline type imports (`import { type Foo }`) and `_`-prefixed unused vars. Prettier: single quotes, semicolons, trailing commas, 100 cols.
- Files use `import * as React from 'react'`. Client components declare `'use client'` at the top; sections that only render data stay server components.
- Components carry short JSDoc blocks explaining *why* (not what). Match that density — especially in `robot-blueprint.tsx` and `globals.css`, where the comments encode design decisions.

## Installed agent skills

`.claude/skills/` holds project-level skills copied from these upstream repos (re-copy from source to update):

| Skills | Source |
|---|---|
| `ponytail`, `ponytail-review/-audit/-debt/-gain/-help` | `DietrichGebert/ponytail` |
| `ui-ux-pro-max`, `design`, `design-system`, `ui-styling`, `brand`, `banner-design`, `slides` | `nextlevelbuilder/ui-ux-pro-max-skill` (its `.claude/skills/`; needs `python3` for `scripts/search.py`) |
| `design-taste-frontend` | `leonxlnx/taste-skill` (`skills/taste-skill/`) |
| `gsap-core/-timeline/-scrolltrigger/-react/-performance/-plugins/-utils` | `greensock/gsap-skills` (official; `gsap-frameworks` omitted — Vue/Svelte/Nuxt only) |
| `react-bits` | `Philotheephilix/reactbits.dev-skill` (fetches component source from the live registry via `scripts/rb-add.mjs`) |
| `lenis-smooth-scroll` | `menervatripolska/awwwards-lenis-smooth-scroll-skill` |

Use `gsap-react` / `gsap-scrolltrigger` together with the Lenis + GSAP-ticker wiring described above; don't let a skill introduce a second RAF loop or `autoRaf: true`.
