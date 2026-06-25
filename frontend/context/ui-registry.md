# UI Registry

Living document. Updated after every shared component is built. **Read this before building
any new component** — match an existing pattern before inventing a new one.

## How to Use

Before building a component:

1. Check if a similar component already exists here (or in `src/shared/components/ui`).
2. If yes — reuse it; match its props/classes.
3. If no — build it on shadcn/ui primitives following ui-rules.md + ui-tokens.md, then add a
   row below.

After building or promoting a shared component, add it here with its file path and a short
note. Sections and their composites are logged here as they are built.

---

## UI Typos / Known Issues

Record UI copy typos and other UI issues here: location (page/component + file), current
(wrong) text, correct text, status.

| # | Location (component / file) | Current text | Correct text | Status |
| - | --------------------------- | ------------ | ------------ | ------ |
| 1 | `Logo.tsx` | `aria-label="Dealport home"` | `aria-label="Portfolio home"` | Fixed |
| 2 | `navigation.config.ts` | route-style hrefs (`/about`, `/projects`) | anchor ids (`#work`, `#experience`, `#contact`, …) | Open (anchor-scroll nav pending) |

---

## Components

The portfolio is early — only chrome and primitives exist so far. Section composites
(`ProjectCard`, `TestimonialCard`, `TimelineItem`, contact form) are logged here as they land.

### Primitives (`src/shared/components/ui`)

Only the primitives the portfolio actually uses are kept under `ui/`. The unused scaffold
primitives (Avatar, Checkbox, Radio, Select, Switch, Skeleton, Table, Progress, Sheet, Tooltip,
Sidebar) were **deleted**. Add a primitive back with the shadcn CLI only when a section needs it.

| Component | File | Notes |
| --------- | ---- | ----- |
| Button | `ui/button.tsx` | base-ui Button + cva. Variants: default/outline/secondary/ghost/destructive/link; sizes xs–lg + icon. Token-styled (`bg-primary text-primary-foreground`, focus `ring-ring`). Used in the navbar CTA, Hero CTAs, contact submit. |
| Card | `ui/card.tsx` | `Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`. Base is surface only (`rounded-xl border bg-card`, no shadow/padding) so variants compose. Used by ProjectCard, ExperienceCard, About feature cards, the contact form card. `bg-card` resolves to `--surface`. |
| Badge | `ui/badge.tsx` | cva chip, `border-border`. Variants: `pill` (rounded-full, `text-body-base`, `bg-primary/10 text-primary` — section eyebrows), `tag` (rounded-md, `text-body-sm`, `bg-primary/10 text-primary` — project tech tags), `status` (rounded-full, `text-body-base`, `bg-surface text-muted-foreground` + `gap-2` — Hero availability pill with pulse dot). |
| Separator | `ui/separator.tsx` | Token `bg-border` rule (`role="separator"`); `h-px w-full` (horizontal) / `w-px h-full` (vertical). Used for the footer divider. No extra dep. |
| Input | `ui/input.tsx` | Token-styled text input (`border-input`, ring on focus). Contact form. RHF `register()` ref flows through via React 19 ref-as-prop. |
| Textarea | `ui/textarea.tsx` | forwardRef `<textarea>`; mirrors `Input`, `min-h-24`, `aria-invalid:border-destructive`. Contact message field. |
| Label | `ui/label.tsx` | `<label>`, `text-body-sm font-medium text-foreground select-none`. Used by `Field`. |
| Field | `ui/field.tsx` | Wrapper: `Label` + control + `error` (`text-body-sm text-danger`); `flex flex-col gap-1.5`; optional muted `hint`. Contact form. |
| Typography | `ui/typography/` | Polymorphic text component (`typography.tsx` + styles/types/constants). **Not shadcn** — custom. Every section's text goes through it (variant + weight props). |

### Shared composites (`src/shared/components`)

| Component | File | Notes |
| --------- | ---- | ----- |
| Logo | `Logo.tsx` | `CodeXml` glyph in a `rounded-full bg-surface border-border` badge + "Portfolio" wordmark; `text-primary`, hover → `border-primary`. Links home. Used in Navbar + Footer. |
| Navbar | `Navbar.tsx` | `fixed top-0` header. Logo + a centered desktop pill of section links (`bg-surface/60 backdrop-blur-xl border-border`, hover `text-primary`) + a "Download CV" `Button` (lucide `Download`) linking the CV asset. Server component; links from `navigation.config`. *Currently desktop-first and route-style hrefs — mobile nav + anchor ids pending.* |
| Footer | `Footer.tsx` | Glow + brand (`Logo`) + tagline, a row of circular social icon buttons (inline brand glyphs from `icons/SocialIcons.tsx`), and a copyright bar. Content/socials from `navigation.config`. |

### Sections (`src/features/sections`)

| Section | File | Notes |
| ------- | ---- | ----- |
| Hero | `Hero.tsx` | **Stub** — `section#home` shell only. To build: display heading, supporting line, primary + secondary CTAs, circular portrait with green glow; content moved to `data/`. |

_Intro band, Recent Work, Experience, Testimonials, and Contact are not started — add rows as
they are built, plus their composites (`ProjectCard`, `TimelineItem`, `TestimonialCard`,
contact form)._

---

## Baseline — dark portfolio theme

The portfolio is **dark only** (see ui-tokens.md). Every new component should match these.
Values are token classes — never hex or raw Tailwind colours. This baseline will be enriched
via `/imprint` as real sections land.

| Property | Correct class |
| -------- | ------------- |
| Page background | `bg-background` (charcoal-black-900) |
| Card / panel background | `bg-card` / `bg-surface` (`#1a2329`) |
| Raised / muted surface | `bg-surface-raised` / `bg-muted` |
| Soft brand surface | `bg-primary-subtle` |
| Card / panel border | `border border-border` (`#242b32`) |
| Input border | `border-input` |
| Active / highlight border | `border-primary` (emerald-teal) |
| Focus ring | `ring-ring` (emerald-teal) |
| Shadow | `shadow-sm` (raised panels, pills); `shadow-md` (floating/elevated) |

### Radius scale (intentional hierarchy — match by element type)

| Element type | Radius |
| ------------ | ------ |
| Badge / tech tag | `rounded-md` |
| Card, input | `rounded-lg` |
| Project / testimonial card, media | `rounded-xl` |
| Hero / large panel | `rounded-2xl` |
| Pill nav, CTA, avatar, glow portrait | `rounded-full` |

### Typography

| Role | Class |
| ---- | ----- |
| Hero heading | `text-display-xl`/`text-display-2xl` `font-extrabold text-foreground` |
| Section heading | `text-h2 font-bold text-foreground` |
| Card / entry title | `text-h4`/`text-h6 font-semibold text-foreground` |
| Body / description | `text-body-sm`/`text-body-base` `text-muted-foreground` |
| Tiny labels (tags, dates) | `text-caption` / `text-label-sm` — **never** arbitrary `text-[Npx]` |

### Color

- Brand / links / active states: `text-primary` (emerald-teal).
- Body text: `text-foreground` (near-white) for primary, `text-muted-foreground` for secondary.
- The hero portrait's green glow is a deliberate `primary`-toned accent (glow/shadow), the one
  decorative flourish — keep other chrome quiet.
