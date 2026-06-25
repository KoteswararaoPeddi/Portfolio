# Build Plan

A from-scratch plan for the **Portfolio** — a single-page, frontend-only developer
portfolio (Next.js 16 + React 19 + Tailwind v4 + shadcn/ui). The site has one route (`/`)
composed of the sections in project-overview.md. Mark items `[x]` as they land and keep
progress-tracker.md in sync.

## Core Principle

UI is built with **mock content first** and **verified visually** against the design
(`context/designs/nextdev-egbontech.vercel.app_.png`). Each section authors its content in a
typed `data/` file, renders from it, and is checked in the running app before moving on.
Every section must be visible and testable before the next begins. No invisible phases.

There is no backend — nothing is "wired" later. The content files *are* the source of truth.

---

## Phase 0 — Foundation

- [x] App scaffolded: Next.js 16 + React 19 + TypeScript (strict); App Router
- [x] Tailwind v4 + tw-animate-css pipeline; `theme.css` tokens imported by `globals.css`
- [x] Design tokens: dark teal palette + semantic tokens in `theme.css` (see ui-tokens.md)
- [x] shadcn/ui initialized (`components.json`); base primitives in `src/shared/components/ui`
- [x] Fonts: Poppins via `next/font/google` (`--font-poppins`), wired in the root layout
- [~] Layout shell: root layout + `(customer)` route group (Navbar + main + Footer); home page
- [x] Shared chrome: `Logo`, `Navbar` built; `Footer` is a stub to be finished
- [ ] Anchor-scroll section ids agreed (`#home`, `#work`, `#experience`, `#contact`, …) and the
      navbar links pointed at them (currently route-style hrefs)

> Dark only — no `next-themes`, no theme toggle. Every surface uses semantic tokens so the
> dark theme is the single source of truth.

---

## Phase 1 — Hero

- [~] Hero section (`#home`): heading "Building modern web experiences with clean code",
      supporting line, primary + secondary CTAs, circular portrait with green glow
- [ ] Hero content in `data/` (heading, subcopy, CTA labels/links, portrait asset)
- [ ] Responsive: portrait + copy stack on mobile, side by side on desktop
- [ ] Verified against the design

---

## Phase 2 — Intro band

- [ ] Intro statement band ("I build scalable and user-focused web applications")
- [ ] Content in `data/`; typographic treatment on the dark background
- [ ] Verified against the design

---

## Phase 3 — Recent Work

- [ ] Section heading "Some of my recent work"
- [ ] `ProjectCard` composite: thumbnail, title, description, tech tags, demo/source links
- [ ] Responsive project grid; content authored in `data/` (projects list)
- [ ] Verified against the design

---

## Phase 4 — Experience

- [ ] Section heading "Experience that speaks volumes"
- [ ] Vertical timeline component: role, company, dates, description per entry
- [ ] Content authored in `data/` (experience entries)
- [ ] Verified against the design

---

## Phase 5 — Testimonials

- [ ] Section heading "What people say about me"
- [ ] `TestimonialCard`: quote, name, role/company
- [ ] Testimonials grid/row; content authored in `data/`
- [ ] Verified against the design

---

## Phase 6 — Contact

- [ ] Section heading "Let's build something great"
- [ ] Contact info / socials block (email, location, social links) from `data/`
- [ ] Contact form: name, email, message (RHF + Zod **optional** — both installed). No
      submission backend yet — no-op or `mailto:` until a target is specified
- [ ] Form states: validation errors, disabled/submitting, success/empty messaging
- [ ] Verified against the design

---

## Phase 7 — Footer

- [ ] Footer: wordmark, compact nav echoing the navbar, social links, copyright
- [ ] Content from the shared navigation config / `data/`
- [ ] Verified against the design

---

## Phase 8 — Polish

- [ ] Responsive pass across mobile, tablet, desktop (every section)
- [ ] Scroll-spy: active section reflected in the navbar; smooth anchor scrolling
- [ ] Entrance / scroll animations (tasteful, `tw-animate-css`)
- [ ] Accessibility pass: focus states, labels, keyboard nav, reduced-motion respect
- [ ] Real assets: portrait, project thumbnails, and the CV (`public/documents/cv.pdf`)
- [ ] Final visual diff against the design; metadata / favicon / Open Graph

---

## Phase Summary

| Phase                | Status      |
| -------------------- | ----------- |
| 0 — Foundation       | In progress |
| 1 — Hero             | In progress |
| 2 — Intro band       | Not started |
| 3 — Recent Work      | Not started |
| 4 — Experience       | Not started |
| 5 — Testimonials     | Not started |
| 6 — Contact          | Not started |
| 7 — Footer           | Not started |
| 8 — Polish           | Not started |
