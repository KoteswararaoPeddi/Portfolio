# Project Overview

## About the Project

**Portfolio** is a single-page **developer portfolio** for a frontend engineer. It is a
focused marketing site whose one job is to present the developer's work, experience, and
contact details in a way that earns a reply from a recruiter or a client. There is no
account system, no catalog, no cart, no checkout, no dashboard, no AI. One page, scrolled
top to bottom, with a sticky navbar whose links jump to the relevant section.

This is a **frontend-only** application — a single Next.js app, no backend and no database.
All content is authored in the codebase (typed mock/content files under each feature's
`data/`) and rendered statically. The design is dark-themed (charcoal/teal) and the visual
reference lives at `context/designs/nextdev-egbontech.vercel.app_.png`.

```
frontend/        → Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn/ui
```

There is no `backend/`. The site holds no secrets and talks to no API of its own.

---

## The Problem It Solves

A recruiter or prospective client spends seconds deciding whether a developer is worth a
conversation. This portfolio answers their questions in one scroll: *what does this person
build, is the work any good, what have they done, do others vouch for them, and how do I
reach them.* It is fast, legible, and consistent, and it ends on a clear call to make
contact.

---

## The Page

One route — `/` — composed of these sections, top to bottom:

```
Navbar         → logo, centered pill navigation, "Download CV" CTA (sticky)
Hero           → "Building modern web experiences with clean code", CTAs,
                 circular portrait with a green glow
Intro band     → "I build scalable and user-focused web applications"
Recent Work    → "Some of my recent work" — project cards grid
Experience     → "Experience that speaks volumes" — vertical timeline
Testimonials   → "What people say about me" — testimonial cards
Contact        → "Let's build something great" — contact form + contact info / socials
Footer         → wordmark, nav, socials, copyright
```

The navbar links are **anchor links** to section ids on the same page (`#home`, `#work`,
`#experience`, `#contact`, …) — not separate routes. Scrolling is the primary navigation.

---

## Navigation

- **Navbar (sticky, top):** logo on the left, a centered pill containing the section links,
  and a "Download CV" call to action on the right. On scroll it stays fixed; the active
  section is reflected in the nav (scroll-spy, added in polish).
- **Footer:** wordmark, a compact link set echoing the nav, social links, and a copyright
  line.
- No drawers, menus, modals, or multi-page routing in scope.

---

## Sections In Detail

### Hero

Large heading ("Building modern web experiences with clean code"), a short supporting line,
two CTAs (primary "Download CV" / contact, secondary "View work"), and a circular portrait
with a green glow accent. This is the first impression and sets the dark teal tone.

### Intro band

A short, confident statement band ("I build scalable and user-focused web applications")
that bridges the hero and the work. Pure typography on the dark background.

### Recent Work ("Some of my recent work")

A responsive grid of project cards. Each card shows a project image/thumbnail, title, a
short description, the tech used, and links (live demo / source). Content is authored in
`data/`.

### Experience ("Experience that speaks volumes")

A vertical timeline of roles. Each entry shows the role, company, dates, and a short
description of the work and impact.

### Testimonials ("What people say about me")

Cards with a quote, the person's name, and their role/company. Lightweight social proof.

### Contact ("Let's build something great")

A contact form (name, email, message) paired with direct contact information and social
links. The form is the only form in the app; until a submission backend is specified it can
be a no-op or a `mailto:` (see architecture.md / code-standards.md). The CTA closes the page
on a clear next step.

---

## Features In Scope

- Single-page layout with a sticky navbar and anchor-scroll navigation
- Hero with heading, CTAs, and a glowing circular portrait
- Intro statement band
- Recent work grid (project cards from authored content)
- Experience timeline
- Testimonials
- Contact section: contact form + direct contact info and social links
- Footer
- Downloadable CV (static asset, e.g. `public/documents/cv.pdf`)
- Dark theme throughout (charcoal/teal), responsive across mobile/tablet/desktop
- Scroll-spy active-section highlight and tasteful scroll/entrance animations (polish)

---

## Features Out of Scope

- Any backend, database, or REST API of its own
- Authentication, accounts, or user data
- E-commerce of any kind (catalog, cart, checkout, orders, payments)
- AI / chat / assistants
- A blog or CMS-driven content (content is authored in the codebase)
- A light/dark theme toggle — the site is **dark only**
- Multi-page routing (the portfolio is one page)

---

## Target Audience

- **Recruiters and hiring managers** — scanning quickly for relevant work, experience, and a
  way to make contact.
- **Prospective clients** — evaluating whether the developer can deliver the kind of web work
  they need.

---

## Success Criteria

- The page loads fast and reads clearly from hero to contact in a single scroll.
- The navbar stays accessible and its links jump to the right sections; the active section is
  reflected as the user scrolls.
- Recent work communicates what was built, the tech used, and where to see it.
- The experience timeline and testimonials build credibility at a glance.
- The contact section makes it obvious how to get in touch (form + direct info + socials).
- The CV downloads correctly.
- The layout is visually consistent (shared tokens and components) and responsive on mobile,
  tablet, and desktop, in the dark theme.
