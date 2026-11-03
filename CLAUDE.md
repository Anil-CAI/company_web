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

Six clips live in `/public/videos`, each with a `-poster.jpg` generated beside it (`ffmpeg -ss 2 -frames:v 1`), so a card costs one small JPEG until someone presses play — this matters: the 3D navigation capture alone is 25 MB. Source files are kept locally in `containt/` (outside `public/`, not served, git-ignored).

Ratios are mixed and that drives real code: the G1 captures are 16:9, the Go2 web-navigation clips are 9:16 phone recordings. `MediaRatio` gained a `tall` (9:16) member because `portrait` is 3:4 and letterboxes phone footage. `Project.videoRatio` carries the frame per project (`project-card.tsx` also width-caps a `tall` clip so it does not run a desktop column's full height), and `DanceModel.video` is optional — a routine without footage falls back to the animated stick figure.

**Layout follows the footage.** `project-card.tsx` branches on `videoRatio`: a `tall` (9:16) clip sits **side by side** with its image in a 7-column media block, because two portrait frames stay tall at half width. A landscape (16:9) clip **stacks** above its image in a wider 8-column block — side by side, a 16:9 frame at half width is also half height, which made the dance clip too small to watch. The copy column narrows to 4 columns to compensate. Don't unify these: the two ratios genuinely need different treatment.

Empty media slots use `.placeholder-draft` (a drafting grid with corner registration marks), not the old diagonal hatch — beside real footage the hatch read as a broken image.

**Don't caption footage as something it isn't.** Two featured projects (Point Cloud Mapping, and any routine not yet filmed) deliberately keep empty video slots rather than borrow an unrelated clip; the `label` is read out by screen readers, so a mismatch is a lie the alt text has to tell.

### Placeholder system

Empty string = "not supplied yet". `utils/media.ts` (`hasImage`, `hasVideo`, `hasValue`) is the single source of that rule; `PlaceholderImage`, `PlaceholderVideo` and `PlaceholderValue` in `components/common` render a styled frame/hint when empty and the real asset when filled. Never special-case empty media in a section component — route it through these. `public/README.md` documents expected asset paths.

### Icons by string key

Data files reference icons as strings (`icon: 'mail'`) resolved through `iconRegistry` / `getIcon` in `lib/icons.ts`. The `IconName` union is derived from the registry, so adding an icon is one line there and type-checks everywhere.

### Motion — three layers, one token set

- **Framer Motion** — entrance reveals (`Reveal`, `RevealGroup`/`RevealItem`, `AnimatedText`), magnetic buttons, drawer. Variants are shared from `lib/motion.ts`; pick one rather than inventing timings.
- **GSAP + ScrollTrigger** — only for scroll-scrubbed work (count-ups, parallax, timeline draws). Always import from `@/lib/gsap` (registers the plugin, browser-guarded), never from `gsap` directly.
- **Lenis** — `SmoothScrollProvider` (root layout) drives Lenis from the **GSAP ticker** so scroll position and ScrollTrigger advance on the same frame. Use `useLenis()` / `useScrollTo()` from `hooks/use-lenis.ts` for programmatic scrolling; both fall back to native when Lenis is null.
- All durations, easings, stagger and Lenis options live in `constants/animation.ts` — no magic numbers in components.
- **Reduced motion**: Lenis never initialises (context stays `null`), GSAP effects must be skipped by consumers, `globals.css` collapses CSS animations, and `<MotionConfig reducedMotion="user">` in `SmoothScrollProvider` stops every Framer Motion reveal from sliding (opacity still fades). New motion must degrade the same way.

### Design tokens

**Lilac and emerald** (from the scroll storyboard): a lilac `#ECE6F5` ground, deep-violet `#2A1E40` ink, emerald to highlight headings and data, and no pure black or white anywhere — the lightest surface is `#F7F3FB`. `:root` in `styles/globals.css` holds every token; re-skin there. Cards are frosted glass via one unlayered `.bg-card` rule at the end of `globals.css` (translucent `#F7F3FB` + `backdrop-filter`), placed after Tailwind's utilities so it wins without touching components. The section after the hero (`#hero + *`) is a near-opaque lilac glass sheet with rounded top corners — the dark-to-light handoff.

Rules that are easy to break:

- **Two emeralds, not one.** `#0F7F4E` (`--signal`) is for headings only: 4.1:1 on the ground (3.7:1 on mist) passes the heading bar, not body text. `#0D7651` (`--accent`) is for small emerald text and for emerald fills under lilac-white text (5.14:1). `--signal` behind or on small text fails — the hero's "Get in touch" is a `#0D7651` pill for that reason. `scripts/verify-palette.mjs tokens` checks these pairs.
- `--snow` kept its name from the dark palette but is the violet reading ink.
- **Section rhythm.** `Section` takes `tone` (`base | paper | mist | mint`, tokens `--paper #F6F3FA`, `--mist #E2DAEE`, `--mint #E4F1EA`). Mint is used once (About → values). The footer and the Services closing CTA are `bg-violet` (`#291C3F`) with lilac-white text; the section after the home hero is paper glass.
- **Type and controls.** H1 is `text-display-h1` (64px), every section H2 is `text-display-sm` (48px). Buttons: primary = emerald pill (`--accent`), secondary/outline = 1px ink outline; all 48px tall, 20px side padding. Chips: 12px mono, `foreground/30` border, `foreground/75` text.
- **Ink is violet-biased, never neutral grey.** Same for the Tailwind `ink-*` ramp; `ink-400` (small labels) is 6.3:1 on the ground.
- **`backdrop-filter` makes an element the containing block for `position: fixed` descendants.** Nothing fixed or GSAP-pinned may live inside a `.bg-card` or inside the section right after the hero.
- **The header flips light only over the black home hero** (`onDark` in `header.tsx`); everywhere else its marks are violet.
- **Two header layouts.** Desktop (`lg+`) is the first `<Container>` in `header.tsx` — kept first so visual-editor edits saved against `#site-header > div:nth-of-type(1)` keep their address. Below `lg` a second container shows the four pages as pills on one row (never wrapping) with the menu, and "Start a project" beneath.
- The boot screen is still pure black on purpose — it was specified that way before the storyboard.

### Motion: page transitions

`components/layout/page-transition.tsx` wraps `children` in the root layout and cross-fades on `pathname`. Two deliberate choices: **no `mode="wait"`** (waiting for the exit before the entrance doubles perceived click latency — the two overlap instead), and reduced-motion visitors get the children with **no `AnimatePresence` in the tree at all**, since an opacity animation starting at 0 is still a flash even at 0.01ms.

`VIEWPORT_ONCE` in `constants/animation.ts` uses `amount: 0.08` with a `-12%` bottom margin. The old 0.25 meant a tall section had to be a quarter on screen before moving, which on a phone fired after the reader had already arrived. The margin is viewport-relative so one value serves laptop and mobile without a breakpoint.

### Legacy design tokens

CSS variables in `styles/globals.css` (`@layer base`) feed Tailwind via `tailwind.config.ts`. Custom scale worth knowing: `text-display-sm|md|lg|xl`, `text-eyebrow`, `py-section`, `px-gutter`, `shadow-soft|lift|float`, `ease-premium`, `ink-50…950`. Two gotchas:

- `lib/utils.ts` extends tailwind-merge so `text-display-*` isn't treated as a colour and stripped. Always compose classes with `cn()`.
- Tailwind `content` globs include `utils/`, `constants/` and `data/` because class maps (e.g. `RATIO_CLASS`) live outside `components/`. Any new folder that holds class strings must be added or its classes silently disappear from the build.

### The hero

`components/home/hero-light.tsx`: the KRL wordmark photographed in light fibres (`public/images/krl-hero-light.jpg`), redrawn by a WebGL fragment shader that lights a spectral trail under the cursor and throws ripples and a wave bend on press-and-drag. Ported from a design-tool export (kept locally in `KRL hero-html/`, not in git) with the shader and motion constants unchanged — retune them there only if the design changes. Copy is `heroLight` in `data/hero.ts`; the copy block is positioned in `.krl-hero-copy` (`globals.css`) against the photo's cover box, not the viewport.

- The `<img>` under the canvas is the fallback: no WebGL or a shader compile failure leaves the photo showing.
- Deliberate departures from the standalone design: a black fade under the fixed site header (its links were unreadable over the bright letters), the render loop pauses off screen via IntersectionObserver, `touch-action: pan-y` so phones can scroll past, and the design's own 3-link nav is dropped because the site header already provides it.
- **Fit:** every screen shows the whole wordmark (`uFit` contain — the bars are invisible because the photo's ground is black). Portrait used to keep the design's cover crop, which on a phone showed a slice of the R and left KRL unreadable. The shader, `toTex` pointer mapping and the `<img>` (`object-contain`) must agree — change one, change all three. WebGL2 is preferred so the 2560px photo can be mipmapped; the stepped letter edges are in the source art itself.
- **Scroll-over:** GSAP pins the hero with `pinSpacing: false` for one viewport while the stage scales/fades to `HERO_RECEDE`; the `#hero + *` rule in `globals.css` gives the next section the opaque background, z-index, rounded edge and shadow that make it slide over like a page. Reduced motion skips the pin.
- **Editor:** `.krl-hero-copy` is `pointer-events: none` (so the canvas gets the cursor) except under `html[data-site-editing]`, which is what makes the hero copy selectable and movable in the visual editor.
- **The hero keeps the design's own colours, not the site palette:** black ground, blue-white fibres, `#F4F7FB`/`#9AA6B8` copy and an outlined `#E9EEF6` CTA. A Lilac & Emerald recolour was tried and reverted at the owner's request — don't re-theme it with the rest of the site. Instrument Sans is loaded as `--font-hero` for this section only.

### Featured project videos

`components/projects/in-view-autoplay.tsx` wraps each project's clip: it plays once at least `VIDEO_AUTOPLAY.playRatio` of it is in view for `dwellMs` (or on hover with a pointer), and pauses only below `pauseRatio` — the gap is what keeps a slight scroll from stopping it. Starting one pauses the others; a pause the visitor makes sticks until the clip leaves the screen. Browsers refuse audible autoplay before a tap, so it falls back to muted. `components/layout/single-audio.tsx` separately guarantees only one video on the page is audible.

### Domains wall

`components/home/domains-grid.tsx` over `components/ui/staggered-grid.tsx` (vendored, heavily patched). Every slot is an icon + label tile: the component's centre bento block of photos is only inserted when `bentoItems` is non-empty, and Domains passes none. Rows have a fixed height per breakpoint (not an aspect-locked grid, which squashed tiles on phones); below `lg` each domain shows once, and the 6 repeats only fill the 7-column desktop wall. The large word it assembles around is `homeContent.domains.wallWord`.

The book shelf canvas in the dance section uses `touch-action: pan-y` — `none` trapped vertical swipes, so a phone could not scroll past it.

### Fleet sections: Navigation and Robot dance models

Two features describe the same two robots (Unitree **Go2**, a quadruped, and **G1**, a humanoid) from different angles, and they share a card layout on purpose so they scan as a pair. Nothing general-purpose should be inserted between them in `sections/home-sections.ts`.

- **Navigation** is *not* a section — it is a featured project (`project-01` in `data/projects.ts`). `Project` carries an optional `platforms?: readonly NavPlatform[]`; when present, `project-card.tsx` renders `project-platforms.tsx` as a native `<details>` "see more" disclosure beneath the card copy. The data lives in `data/navigation-stack.ts` / `types/navigation-stack.ts`. A capability carries a `status` of `deployed` or `planned`; planned rows render dimmed with an "In progress" chip rather than being omitted, because "shipping on Go2, coming to G1" is the actual state of the work (person following is the live example). Don't silently drop a planned capability — that loses the roadmap. The disclosure is a `<details>` rather than React state so the open/close, keyboard handling and ARIA come from the element.
- **Robot dance models** — `components/home/dance-section.tsx` is just the heading and the shelf (`dance-showcase.tsx` over the vendored three.js `components/ui/books-showcase.tsx`). Data is one `DanceRoutine` per routine in `data/dance.ts` (title, song, summary, story, videoSrc, poster, moves A–C with BPM/body parts, tags) — the old dance cards are gone, so each routine lives in one place. Each book opens into `components/home/dance-reader.tsx`, an HTML dialog spread (video left; title, summary, Story/Moves tabs right; single page under 768px).
  - The shelf runs with `readerMode`: the chosen book flies to the centre square-on with its cover shut, and the shelf exposes a `BooksController` (open, close, swap, coverRect, setReaderOpen, focusBook). `onBookReady` fires from the frame loop only once the book has **actually settled** — not on the open timer, which a slow device's motion lags.
  - **Handoff:** the reader starts at `coverRect()` (the front-cover mesh projected to viewport pixels), fades in over the 3D book, the book is hidden, and the spread grows to size; close runs it backwards. While open the render loop only draws the falling leaves, and stops drawing once none are visible.
  - **Scroll lock** is `overflow: hidden` on html/body + blocking `touchmove` outside the reader's scroll panel (iOS-safe). Not `position: fixed` on body: that resets scroll to 0 and GSAP re-pins the hero.
  - **The shelf root must stay `overflow-clip`**: with `overflow-hidden`, focusing a book's keyboard button scrolled the whole canvas inside the stage.
  - Book buttons (one per book, focus-visible ring) are positioned by the frame loop over each projected cover; Enter/Space opens, focus returns to the book on close.

`dance-figure.tsx` is shared by both sections — `kind` picks biped/quadruped/arm and `action` sets the accessible label ("walking" in Navigation at a flat 60 BPM, "dancing" in the dance cards at the routine's own tempo). The `arm` figure is currently unused by either section; it is kept because the rig demonstrates the nested-joint approach the other two depend on.

The figures are jointed SVG stick figures, not 3D models — deliberately, to avoid a WebGL runtime for a looping drawing partway down the page. Two things to know:

- Each `<g>` sets `transform-origin` in **viewBox user units**, so the CSS rule uses `transform-box: view-box`, *not* the `fill-box` the `robot-*` classes use. Under `fill-box` each limb pivots around its own bounding box and the figure comes apart.
- Tempo flows from data: a move's `bpm` becomes a `--beat` CSS variable per figure, which the `dance-*` keyframes consume. Change the number in `data/dance.ts` and that figure dances faster. Every cycle starts and ends at the rest pose, so the global reduced-motion rule freezes the figures standing rather than mid-swing.

### Services page — split by robot, not by category

`components/services/service-platforms-section.tsx` over `data/services.ts`. Each `Service` carries `platforms: ('go2'|'g1'|'other')[]`, and a service can appear under more than one — most of the stack runs on both robots, so duplicating entries would mean two places to edit one piece of copy. `platformNotes` overrides the one-liner where the offer genuinely differs per platform (Go2 VR is teleoperation + robot-perspective view only; G1 VR adds training and maintenance).

Each service renders as `ServiceCard` (`components/services/service-card.tsx`) — the same card the site uses everywhere: icon tile, title, copy, a hover folder listing the stack, and "Learn more". `description` overrides the generic line with the per-robot `platformNotes`. (A pop-colour bento grid was tried and dropped at the owner's request.)

The hero hands over to `platform-picker.tsx`: three picture cards (Go2 / G1 / Other) that anchor down to their section. Pictures beat text pills here — a visitor recognises the quadruped on sight faster than they parse a model name. They are plain `<a href="#platform-go2">` anchors, so they work before hydration and keep every service in the document.

**Every group renders in full — do not convert this to tabs.** Tabs would hide half the catalogue behind a click most visitors never make, and the hidden half would be invisible to search engines. The jump links are plain `<a href="#platform-go2">` anchors so they work before hydration and on mobile, where a hover-reveal would not.

KRL does **not** do hardware work, so there is no "Robotics Engineering" service; `scripts/verify-tonight.mjs services` asserts it stays removed.

### About / Team page

`app/about/page.tsx` over `sections/about-sections.ts`, with copy in `data/team.ts` (`types/team.ts`) and `aboutContent` in `data/content.ts`. Four blocks: hero, story, team, principles.

**The thin fields are deliberate.** `TeamMember.focus` is a domain, not a job title, and `note`/`image` are optional — the company was founded by students and the titles are not settled, so inventing "Lead Perception Engineer" would be a detail a visitor could check and find wrong. `TeamPortrait` falls back to an initials monogram rather than an empty photo frame, so a page with no headshots reads as a choice rather than as unfinished; set `image.src` on one member and that person alone gets a photograph. The closing `note` says the named members are part of a wider team, so four cards never imply the whole company.

The team grid is the vendored `team-reveal-grid.tsx`, rendered with `showHeader={false}` (the section already has a heading; its built-in one was stock demo copy). Its accent is the deep emerald `#0D7651`; initials are solid ink (not `mix-blend-difference`, which turned them cyan) and fade out while a card is open so its description reads cleanly in `#F7F3FB`.

The principles section renders `company.principles` (plain-language copy: what each rule means for a client), which already existed in `data/company.ts` but had no page rendering them.

### Privacy policy

`app/privacy/page.tsx` over `data/privacy.ts`. Plain prose, not a section stack — it is read top to bottom and will never be reordered. Every claim must stay true of the implementation: if the contact form ever starts storing or sharing anything, this file changes in the same commit.

### Visual editor (`npm run edit`)

An in-browser editor lets the owner restyle, re-word, resize and delete things without touching code. `npm run edit` builds, then serves on `127.0.0.1:3000` with `SITE_EDITOR=1`; an "Edit site" pill appears bottom-left. Plain `npm run start` and any real deployment show no editor and answer 404 on the save route.

- **Edits are data, not code changes.** They live in `data/site-overrides.json` (typed by `types/site-overrides.ts`), keyed by a CSS selector per page (`pages["/services"]`) or `global` for anything outside `<main>`. Components are never modified, so the content/presentation split holds — but an edit made here will silently win over a later change to the same element in `/data` or a component, because overrides apply with `!important`. Check the Changes tab (or the JSON) before wondering why a component edit "doesn't work".
- **Selectors anchor at the nearest unique id or landmark** (`#platform-go2 > div:nth-of-type(2) > …`, `header > …`), never at `<body>`, so the boot screen and the editor mounting do not shift them. Restructuring a section's markup can orphan its edits; they then show as "Not found on page" in the Changes tab.
- **Baking.** `components/editor/site-overrides.tsx` reads the file with `fs` (not `import`, which would hot-reload on every save and wipe undo history) and renders it as a `<style>` plus a pre-paint script that sets `html[data-site-path]` for page-scoped rules. Visitors get edits on first paint with no editor code. Text replacements are applied client-side by `overrides-applier.tsx`.
- **Safety.** `lib/site-overrides.ts#sanitizeOverrides` whitelists properties and rejects any value containing `;{}<>`, both on save and when baking — the file ends up as raw CSS in every page. The API route (`app/api/site-editor`) also requires a localhost `Host` and `Origin`.
- **Undo.** Ctrl+Z / Ctrl+Shift+Z within a session; per-element and per-page Revoke in the Changes tab; `data/site-overrides.backup.json` is the file as it stood before the session's first save.
- **Layout edits are desktop-only.** Width, height, moves, spacing and text size apply from 1024px up (`DESKTOP_ONLY` in `lib/site-overrides.ts`), and a pixel width is emitted as `min(<px>, 100%)`. Edits made on a 1920px screen otherwise pushed phones off-screen. Colours, text and deletions apply everywhere.
- Edits saved under `npm run edit` show immediately there; a deploy needs a fresh `npm run build` to bake them.

### Contact form

The form POSTs to `NEXT_PUBLIC_CONTACT_ENDPOINT` (see `.env.example`). **A failed or rejected submission shows an error naming the email address, never a fake success** — a submission that silently vanishes is the worst of the three outcomes, because the sender believes they were heard.

### Verification gates

`GATES.md` plus `scripts/verify-tonight.mjs` and `scripts/verify-build.mjs` (the `unlazy` skill's format). Run `node .claude/skills/unlazy/scripts/gate-check.mjs --status GATES.md`. `verify-build.mjs` parses the route token out of each build line and compares exactly — an earlier substring match let `/privacy` satisfy a check for `/`, so it passed dishonestly.

### SEO / site config

Per-route metadata is composed with `buildMetadata()` in `lib/seo.ts`; the domain and defaults live in `constants/site.ts` (`SITE_URL` is the single place to change it). Favicon uses the `app/icon.svg` file convention — don't add an `icons` entry to root metadata or it overrides the convention. Organisation JSON-LD is injected once in the root layout.

### Contact form

`components/contact/contact-form.tsx` validates client-side, then POSTs JSON straight to a form service: `NEXT_PUBLIC_CONTACT_ENDPOINT` if set, otherwise FormSubmit at `https://formsubmit.co/ajax/<email channel value from data/contact.ts>`. FormSubmit replies 200 even when it rejects (`success: "false"`), so the form checks the body, not just the status. Its one-time **activation** reply counts as received — the first message is held and delivered once the inbox owner clicks Activate in FormSubmit's email. `data/privacy.ts` says submissions go through a third-party form service; keep it true.

## Code conventions

- Path alias `@/*` → repo root. Each folder has an `index.ts` barrel; import from the barrel or the specific module, both are used.
- ESLint enforces inline type imports (`import { type Foo }`) and `_`-prefixed unused vars. Prettier: single quotes, semicolons, trailing commas, 100 cols.
- Files use `import * as React from 'react'`. Client components declare `'use client'` at the top; sections that only render data stay server components.
- Components carry short JSDoc blocks explaining *why* (not what). Match that density — especially in `hero-light.tsx` and `globals.css`, where the comments encode design decisions.

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
