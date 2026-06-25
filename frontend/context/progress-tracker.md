# Progress Tracker

Update this file after every completed section/feature. Any AI agent reading this should
immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 0 Foundation (scaffolded) + Phases 1 Hero, 2 About, 3 Recent Work, 4 Experience,
6 Contact (done). Phase 5 Testimonials skipped at the developer's request.

**Done / mostly done:**

- **Foundation scaffolded.** Next.js 16 + React 19 + TypeScript (strict), App Router. Tailwind
  v4 + tw-animate-css; `globals.css` imports `src/shared/styles/theme.css`. shadcn/ui
  initialized (`components.json`); a set of primitives already vendored under
  `src/shared/components/ui` (Button, Card, Input, Badge, Label, Textarea, Select, Checkbox,
  Radio, Field, Switch, Avatar, Table, Progress, Separator, Skeleton, Sheet, Tooltip, Sidebar,
  Typography). *Not all are used by the portfolio yet — keep what the sections need.*
- **Theme.** Dark teal token system in `theme.css` — emerald-teal primary, charcoal-black
  neutrals, dark active theme (see ui-tokens.md). Dark only; no theme toggle.
- **Fonts.** Poppins via `next/font/google` (`--font-poppins`) wired into the root layout;
  `html` uses `font-sans`.
- **Layout shell.** Root `layout.tsx` (metadata, font) + `(customer)` route group:
  `layout.tsx` composes `Navbar` + `main` + `Footer`; `page.tsx` is the home page (placeholder
  content for now).
- **Chrome.** `Logo` (CodeXml badge + "Portfolio" wordmark) and `Navbar` (logo + centered pill
  nav + "Download CV" CTA) built in `src/shared/components`. Nav links in
  `src/shared/config/navigation.config.ts`. `Footer` is a stub.

**Done sections:**

- **Hero** (`features/sections/components/hero/Hero.tsx`, `data/hero.data.ts`) — `section#home`:
  eyebrow pill, headline with teal highlight, subcopy, primary + secondary CTAs, circular
  portrait with brand glow (initials placeholder until a photo is added via `portraitSrc`).
  Text uses the `Typography` component (variants, not raw `text-*`).
- **About / Intro band** (`components/about/About.tsx`, `data/about.data.ts`) — `section#about`:
  circular profile image + glow (initials placeholder), "About Me" eyebrow, heading, two
  paragraphs, and a 3-up feature card grid (Clean Code / Fullstack Apps / Performance) with
  lucide icons. Mirrors the design; `Typography` throughout.

- **Recent Work** (`components/projects/{Projects,ProjectCard}.tsx`, `data/projects.data.ts`) —
  `section#projects`: centered `SectionHeading` + a `md:grid-cols-2` grid of 4 `ProjectCard`s
  (image well placeholder, title, description, tech-tag chips, Live Demo / Code links). Card
  hover lifts + zooms the image. Exact design copy/tags.
- **SectionHeading** (`components/section-heading/`) — reusable centered eyebrow pill + title
  (optional teal highlight) + subtitle, driven by `SectionHeadingContent`. For Projects /
  Experience / Testimonials / Contact.

- **Experience** (`components/experience/{Experience,ExperienceCard}.tsx`,
  `data/experience.data.ts`) — `section#experience`: centered `SectionHeading` + a vertical
  timeline (center line on desktop, left line on mobile) with pulsing nodes and alternating
  cards (period, role, company, description). 4 entries, exact design copy.

- **Contact** (`components/contact/{Contact,ContactForm,ContactInfo}.tsx`,
  `data/contact.data.ts`, `schemas/contact.schema.ts`) — `section#contact`: centered
  `SectionHeading` + a 2-col grid. Left: "Send a message" card with a **client** RHF + Zod
  form (Name / Email / Message, shared `Field`/`Input`/`Textarea` primitives), "Send Message"
  button. Submits via `api/contact.service.ts` -> **`POST /api/contact`** (App Router route
  handler) which emails the message through **Resend**; success/error shown via sonner toast,
  form resets on success. Right: "Contact Information" (Email / Phone / Location) with icon
  wells. `Toaster` mounted in the `(customer)` layout.

- **Footer** (`src/shared/components/Footer.tsx`) — replaces the stub. Glow + brand (`Logo`) +
  tagline, a row of circular social icon buttons (inline brand glyphs in
  `shared/components/icons/SocialIcons.tsx` — lucide has no brand icons), and a "© year name.
  All rights reserved." bar. Content + socials in `shared/config/navigation.config.ts`. Also
  fixed `Logo`'s stale `aria-label` (was "Dealport home" -> "Portfolio home").

**Skipped:** Testimonials (`#testimonials`) — per developer request. The nav still links to
`#testimonials`; revisit if the section is added later.

**Not started:** Polish phase — anchor-scroll nav (navbar links still point at `/about`-style
routes, should be `#about` etc.), scroll-spy, animations, mobile nav drawer, real assets/CV.

**Next:** Polish — wire the navbar links to section anchors so the page actually scrolls.

---

## Progress

See build-plan.md for the full per-section breakdown.

- [~] Phase 0 — Foundation (scaffold, tokens, fonts, layout shell, Navbar/Logo done; Footer stub;
  anchor-scroll ids pending)
- [x] Phase 1 — Hero (content + portrait + CTAs; Typography-driven)
- [x] Phase 2 — Intro band (About section)
- [x] Phase 3 — Recent Work (Projects grid + ProjectCard + SectionHeading)
- [x] Phase 4 — Experience (timeline + ExperienceCard)
- [-] Phase 5 — Testimonials (skipped at developer request)
- [x] Phase 6 — Contact (form + ContactInfo; RHF + Zod + sonner)
- [x] Phase 7 — Footer (brand + tagline + socials + copyright)
- [ ] Phase 8 — Polish

---

## Decisions Made During Build

- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind v4 +
  shadcn/ui. Frontend only.
- **No backend:** there is no API, database, or auth. Content is authored in typed `data/`
  files per section and rendered statically.
- **Single page:** one route (`/`); navigation is anchor-scroll to section ids, not separate
  routes.
- **Theme:** dark only, charcoal/teal — emerald-teal primary, charcoal-black neutrals. No
  `next-themes`, no light mode, no toggle.
- **Fonts:** Poppins (`next/font/google`).
- **Contact form:** the only form. React Hook Form + Zod, submitted to a Next.js route handler
  (`app/api/contact/route.ts`) that emails via **Resend** (`resend` SDK). The same
  `contactSchema` validates on both client and server. Env (server-side only): `RESEND_API_KEY`,
  `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (see `.env.example`). This is the one piece of
  server code in the app; everything else is static.
- **CV:** served as a static asset (e.g. `public/documents/cv.pdf`), linked from the navbar
  "Download CV" CTA.

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from
the context files._

> **Existing scaffold / cleanup:** some pieces still carry placeholder or stale naming from
> setup — e.g. the home `page.tsx` placeholder content, the `Footer` stub, the navbar links
> using route-style hrefs (`/about`, `/projects`) instead of anchor ids, and `Logo`'s
> `aria-label="Dealport home"`. Fix these as the relevant sections are built. The `ui/`
> directory contains more primitives than the portfolio needs; keep only what sections use.

> **Sections feature structure:** all page sections live in one vertical slice,
> `src/features/sections/`, with `components/<section>/` (kebab folder + `index.ts` barrel),
> `data/<section>.data.ts` (typed mock content), and `types/portfolio.types.ts`. `page.tsx`
> imports public components from `@features/sections/components`. Hero + About are built this way.

> **Typography component:** section text uses `@components/ui/typography` `Typography` (variant +
> weight props) rather than raw `text-*` size classes — single source of truth for font sizes.
> Colour/layout stay on `className`. The eyebrow pill
> (`rounded-full border border-border bg-primary/10 px-4 py-1.5 text-primary`, `body-sm`) recurs
> in Hero + About; promote to a shared component when the centered-heading sections need it.

> **tailwind-merge / custom type scale:** `cn()` in `src/shared/lib/utils.ts` registers the
> custom `text-*` size tokens with `extendTailwindMerge` so size classes (`text-h2`) are not
> conflated with colour classes (`text-foreground`) and dropped. Any new `text-size` token
> added to `theme.css` must also be added to that list.
