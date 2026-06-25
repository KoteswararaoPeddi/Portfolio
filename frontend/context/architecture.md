# Architecture

The Portfolio is a **single, frontend-only** Next.js application. It renders one page (`/`)
composed of the sections in project-overview.md. There is **no backend, no database, no API
of its own** — all content is authored in the codebase as typed content files and rendered
statically.

```
frontend/        → Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn/ui
```

---

## Stack

| Layer        | Tool                              | Purpose                                                        |
| ------------ | --------------------------------- | ------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router)           | Routing, rendering, route groups                              |
| UI runtime   | React 19                          | Component model                                               |
| Language     | TypeScript (strict)               | Throughout                                                    |
| Styling      | Tailwind CSS v4 + tw-animate-css  | Utility styling and animation                                 |
| Components   | shadcn/ui (Radix + Base UI)       | Accessible UI primitives in `src/shared/components/ui`        |
| Icons        | lucide-react                      | Icon set                                                      |
| Fonts        | `next/font/google` (Poppins)      | Self-hosted webfont, exposed as `--font-poppins`              |
| Forms (opt.) | React Hook Form + Zod             | **Only** the contact form, if it does client-side validation  |

> The app holds **no** database access and **no** secrets. It makes no API calls of its own.
> If the contact form ever submits somewhere, that target is configured via a public env var
> (see code-standards.md), not a backend in this repo.

Notes on optional / situational dependencies:

- **React Hook Form + Zod** — installed; use them only for the contact form. If the form is a
  simple `mailto:` or no-op, plain React state is enough and RHF/Zod can be skipped.
- Avoid pulling in axios, Zustand, recharts, or a data layer — there is nothing to fetch,
  no cross-cutting client state, and no charts. Add a dependency only with a clear reason
  (see code-standards.md → Dependencies).

---

## Frontend Folder Structure

Feature-based. Routing lives in `src/app` (thin route entries using route groups), section
UI lives in `src/features/*`, and cross-cutting UI/utilities live in `src/shared`.

```
frontend/
├── AGENTS.md                                → Agent guidance (Next.js 16 caveats)
├── components.json                          → shadcn/ui config
├── next.config.ts
├── context/                                 → These docs
├── public/
│   └── documents/cv.pdf                     → Downloadable CV (static asset)
└── src/
    ├── app/                                 → App Router. Route groups only; pages stay thin.
    │   ├── layout.tsx                        → Root layout: metadata, Poppins font
    │   ├── globals.css                       → Tailwind entry + imports theme.css
    │   └── (customer)/                        → The site (route group; URL stays "/")
    │       ├── layout.tsx                    → Navbar + main + Footer shell
    │       └── page.tsx                      → Home: composes the section components
    │
    ├── features/
    │   └── sections/                         → One page, one section per file
    │       ├── Hero.tsx                       → #home — heading, CTAs, glowing portrait
    │       ├── Intro.tsx                      → intro statement band
    │       ├── RecentWork.tsx                 → #work — project cards grid
    │       ├── Experience.tsx                 → #experience — vertical timeline
    │       ├── Testimonials.tsx               → testimonial cards
    │       ├── Contact.tsx                    → #contact — form + contact info / socials
    │       ├── components/                    → section composites (ProjectCard, TestimonialCard, TimelineItem, …)
    │       └── data/                          → authored content (projects.data.ts, experience.data.ts, …)
    │
    └── shared/                              → Cross-cutting, framework-agnostic
        ├── components/
        │   ├── ui/                           → shadcn/ui primitives (button, card, input, …)
        │   ├── Navbar.tsx                     → sticky header: logo + pill nav + Download CV
        │   ├── Footer.tsx                     → wordmark + nav + socials + copyright
        │   └── Logo.tsx                       → wordmark used in Navbar + Footer
        ├── config/                           → render-driving objects (navigation links)
        ├── constants/                        → authoritative values (section ids, …)
        ├── lib/
        │   └── utils.ts                       → cn() + shared helpers
        ├── hooks/                            → e.g. scroll-spy for active section
        ├── types/
        └── styles/
            └── theme.css                      → design tokens (see ui-tokens.md)
```

The current tree is the simpler reality: sections live directly in `src/features/sections/`
(`Hero.tsx` exists today as a stub). As sections grow their own composites and content,
introduce `features/sections/components/` and `features/sections/data/` as shown. Promote a
component to `src/shared/components` only once a second place needs it.

### Import aliases (`frontend/tsconfig.json`)

```jsonc
"@/*":          ["./src/*"]
"@app/*":       ["./src/app/*"]
"@features/*":  ["./src/features/*"]
"@shared/*":    ["./src/shared/*"]
"@components/*": ["./src/shared/components/*"]
"@lib/*":       ["./src/shared/lib/*"]
```

Use these — never deep relative imports. `cn` is imported from `@lib/utils`; primitives from
`@components/ui/*`; the navbar/footer from `@components/*`.

---

## Rendering & Data Flow

- The page is **static**. `src/app/(customer)/page.tsx` composes the section components; each
  section reads its content from a typed `data/` file and renders it. No fetching, no
  loading/error states for data (there is no remote data).
- **Server Components by default.** A section becomes a Client Component (`"use client"`) only
  when it needs interactivity — e.g. the contact form, scroll-spy hooks, or animation that
  depends on browser APIs. Keep the boundary as low in the tree as possible.
- **Navigation is anchor-scroll.** Navbar links target on-page section ids (`#home`, `#work`,
  `#experience`, `#contact`, …). A small scroll-spy hook can reflect the active section in the
  navbar (polish phase).

### Contact form (only form)

```
User fills the contact form (client component)
        ↓
optional React Hook Form + Zod validation
        ↓
submit → mailto: or a no-op confirmation (no backend in this repo)
        ↓
inline success / error messaging
```

If a real submission target is introduced later (e.g. a serverless form endpoint or a 3rd
party form service), it is reached via a public env var and documented here and in
code-standards.md. It is **not** part of the current scope.

---

## Invariants

Rules the AI agent must never violate:

- The app is **frontend-only**: no database, no backend, no API of its own, no secrets. Do not
  add a server, ORM, auth, or data layer.
- `src/app/*` holds route entries only — compose section components; no business logic in
  pages/layouts.
- Content the UI renders lives in typed `data/` files, not hardcoded inside components.
- A section never imports another section's internals; cross-cutting code lives in
  `src/shared`. `shared` never imports from `features`/`app`.
- It is one page: navigation is anchor-scroll to section ids — do not add multi-page routing
  or route-based "pages" for sections.
- Dark theme only. Every surface uses the semantic tokens (see ui-tokens.md) so it renders
  correctly — never hardcode a colour. There is no light mode and no theme toggle.
- No hardcoded hex values or raw Tailwind color classes in components — use the design tokens.
- Do not add e-commerce, accounts, AI, payments, or charts — none are in scope.
