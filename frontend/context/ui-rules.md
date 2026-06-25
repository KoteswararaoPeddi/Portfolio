# UI Rules

How the Portfolio's UI should look, behave, and read. Pairs with ui-tokens.md
(colors/typography) and ui-registry.md (built components). Keep every section visually
consistent — shared tokens and primitives, one set of conventions, one dark theme.

---

## Layout

- The page is a **single, centered column**: content sits in a centered container
  (max ~1440px) with comfortable horizontal padding; sections are generously spaced and stack
  vertically down the page.
- **Sticky navbar** on every viewport: logo on the left, a centered pill of section links, and
  a "Download CV" CTA on the right. It stays fixed on scroll over the dark background.
- **Navigation is anchor-scroll:** nav links jump to on-page section ids (`#home`, `#work`,
  `#experience`, `#contact`, …), not to separate routes. The active section is reflected in the
  navbar as the user scrolls (scroll-spy, polish phase).
- **Footer** closes the page: wordmark, a compact link set echoing the nav, social links, and a
  copyright line.
- Build **responsive**: on mobile the centered pill collapses or simplifies, grids reflow to
  fewer columns, and the hero portrait + copy stack. Verify mobile, tablet, and desktop.

---

## Cards & Surfaces

- Content panels (project cards, testimonial cards, timeline entries) use `bg-card` with
  `border border-border` and a `rounded-lg`/`rounded-xl` radius (from `--radius`); add a subtle
  shadow for raised elements.
- Page background is `bg-background` (the dark charcoal base); raised/muted panels use
  `bg-surface-raised` / `bg-muted`.
- Let imagery and whitespace carry the design — keep card chrome quiet so the work stands out.
  The hero portrait's green glow is the one deliberate accent flourish.

---

## Components (use shadcn primitives)

- Build on the primitives in `src/shared/components/ui` (button, card, input, label, textarea,
  badge, …). Don't hand-roll equivalents.
- Promote a section component to `shared/components` only once a second section needs it.
- Buttons: `primary` for the main action (Download CV, Send message), an outline/quiet variant
  for secondary actions (View work, View source), ghost for tertiary. One primary action per
  view/section.
- The contact form uses label + control + inline error; if it validates client-side, drive it
  with RHF + Zod (optional — see code-standards.md).

---

## Color & Type Usage

- Follow ui-tokens.md. Brand actions, links, and active states use `primary` (emerald-teal).
  Feedback uses `success`/`warning`/`danger`/`info`. Everything sits on the dark base.
- Use the typography scale (`text-display-*`, `text-h1`…`text-h6`, `text-body-*`,
  `text-label-*`) rather than arbitrary sizes. The hero heading uses a display size; section
  headings use `text-h2`/`text-h3`; body text stays at `text-body-base`.
- Never hardcode hex or use raw Tailwind color classes.

---

## Section patterns

- **Hero:** display-size heading, a short supporting line, primary + secondary CTAs, and the
  circular portrait with a green glow. It sets the tone — keep it uncluttered.
- **Intro band:** a single confident statement in large type; pure typography on the dark
  background, generous vertical padding.
- **Recent work:** a responsive grid of project cards. Each card: thumbnail, title, short
  description, tech tags (`Badge`), and links (live demo / source). Keep cards uniform in
  height and chrome so the grid reads cleanly.
- **Experience:** a vertical timeline; each entry shows role, company, dates, and a short
  description. Consistent spacing and a clear connector line.
- **Testimonials:** quote cards with the person's name and role/company. Equal-weight cards in
  a row/grid.
- **Contact:** the contact form (name, email, message) beside a block of direct contact info
  and social links. The form is the page's clear final call to action.

---

## States (where relevant)

The page is static, so most sections have no loading/error states. The states that matter:

- **Contact form:** inline **validation errors** (what's wrong + how to fix), a disabled /
  submitting state on the button, and a **success confirmation** after submit (or, for a
  `mailto:` form, opening the mail client is the confirmation).
- **Empty content:** authored `data/` arrays should not be empty in production, but a section
  that maps over content should render nothing-gracefully (no broken layout) if its list is
  empty.
- **Images:** provide meaningful `alt` text; use `next/image` so thumbnails and the portrait
  load well.

---

## UX Writing / UI Content Standards

Standards for UI copy — button labels, form labels, errors, empty states, toasts, headings.
Good UI content tells users what to do, what happened, and what happens next. Apply these
everywhere; consistency matters more than any single choice.

### 1. Be clear, not clever

Prioritize clarity over marketing language.

- ❌ "Let's get rolling!" · "Time to embark on your journey."
- ✅ "Create account" · "Get started"

### 2. Use action-oriented button labels

Buttons describe the action they perform.

- ❌ Submit · Click here · Continue (when the action is unclear)
- ✅ Send message · Download CV · View work · View source

### 3. Keep labels short

Form labels are concise.

- ❌ "Please enter your full legal name"
- ✅ "Full name"

### 4. Error messages explain the problem

Tell the user **what went wrong** and **how to fix it**.

- ❌ "Invalid input"
- ✅ "Enter a valid email address." · "Message must be at least 10 characters."

### 5. Empty states guide the user

- ❌ "No data found."
- ✅ "No projects to show yet, check back soon."

### 6. Success messages confirm completion

- ❌ "Success!"
- ✅ "Message sent" · "Thanks, I'll get back to you soon"

### 7. Avoid unnecessary punctuation

No trailing periods in short UI text (buttons, labels, toasts). Periods are fine for longer
sentences in descriptions/body copy.

- ✅ Button: "Send message" / ❌ "Send message."
- ✅ Toast: "Message sent" / ❌ "Message sent."

**Never use a long hyphen (em dash `—` or en dash `–`) in UI content.** Use a comma, or
rewrite as a separate sentence.

- ❌ "Building modern web experiences — with clean code."
- ✅ "Building modern web experiences with clean code."

### 8. Maintain consistency

Pick one term and use it everywhere — don't mix "Send message" with "Submit" or "Contact me".

### 9. Use sentence case

Sentence case for UI text (the modern default, used by Google/Microsoft).

- ✅ "Download CV" · "View work" · "Send message"
- ❌ "Download Cv" · "View Work"

### 10. Reduce cognitive load

Don't make users read more than necessary; write a single, refined thought.

- ❌ "I am a passionate, detail-oriented frontend developer who loves crafting beautiful, performant, accessible web experiences for clients of all sizes."
- ✅ "I build scalable and user-focused web applications."

---

## Do Nots

- **Never use a long hyphen (em dash `—` or en dash `–`) in UI content** (labels, buttons,
  headings, body copy). Use a comma, or rewrite as a separate sentence.
- Never use raw Tailwind color classes (`bg-emerald-500`, `text-gray-400`) — use tokens only.
- Never define colors in a config file — tokens live in `theme.css` (`@theme`).
- Never author a light-mode-only colour or add a theme toggle — the site is dark only.
- Never add multi-page routing for sections — navigation is anchor-scroll on one page.
- Never ship the contact form without validation, a submitting state, and a success message.
- Never put business logic in a `page.tsx` — compose section components.
