# Code Standards

Conventions for the **Portfolio** frontend (Next.js). Follow these every session without
exception; they prevent pattern drift. See architecture.md for structure.

---

## Engineering Mindset

- **Think before implementing** — understand what and why before writing code.
- **Read context files first** — verify against architecture.md and project-overview.md.
- **Scope is sacred** — build only what the current section requires.
- **Every section must be testable** — if it can't be verified visually after implementation, it's incomplete.
- **Clean over clever** — simple, readable code a junior can follow beats clever abstractions.
- **One thing at a time** — complete one section fully before starting the next.
- **Fail gracefully** — handle errors at the boundary; surface human-readable messages; never let a promise float.
- **Plan for reuse** — decide where logic/UI belongs (section-local vs. shared) before writing it; build small, composable units.
- **Build outside-in** — scaffold `page.tsx` with stubbed sections first, then primitives, then flesh out each section, with the dev server live.

---

## TypeScript

- Strict mode is on — no exceptions.
- Never use `any` — use `unknown` and narrow.
- Avoid type assertions (`as`) unless truly necessary, and comment why.
- All function parameters and return types are explicitly typed.
- Use `type` for object shapes/unions; `interface` for extendable shapes (component props).
- All async code handles its errors.
- `const` by default; `let` only when reassignment is required.

---

## Next.js 16

- App Router only. React 19 APIs throughout.
- **This is not the Next.js in your training data** — read `node_modules/next/dist/docs/` before using a Next.js-specific feature; heed deprecation notices (see `AGENTS.md`).
- Components are **Server Components by default**. Add `"use client"` only when the component needs `useState`/`useReducer`/`useEffect`, browser APIs/event listeners, or a client-only library (e.g. an interactive shadcn bit). The portfolio is mostly static — most sections are Server Components. The contact form and any scroll-spy/animation hook are the typical client boundaries.
- Never add `"use client"` to a layout unless required. Push the boundary as low in the tree as possible.
- Pages/layouts in `src/app` stay thin — they compose section components and hold no business logic.
- Use `next/font` for fonts (Poppins is wired in the root layout), `next/image` for images, and `next/link` for in-page links / anchors.

### Folder & file architecture

- `src/app/*` — route entries only (route groups, layouts, `page.tsx`). The site is one route
  (`/`); the `(customer)` route group holds the layout shell and home page.
- `src/features/sections/` — the page's sections, **one section per file** (`Hero.tsx`,
  `RecentWork.tsx`, …). A section carries only the folders it actually uses, from this
  vocabulary: `components/` (section composites like `ProjectCard`, `TimelineItem`), `data/`
  (authored content the UI renders), `hooks/`, `utils/`, `types/`. Sub-structure nests by
  kebab-case folder + an `index.ts` barrel when a section grows several composites.
- **Promote on the second use.** A composite used by one section stays section-local; promote
  it to `src/shared/components` only once a second place needs it. `shared` never imports from
  `features`/`app`.
- `src/shared/` — `components/ui` (shadcn primitives) + shared composites (`Navbar`, `Footer`,
  `Logo`), `config/` (navigation links), `constants/`, `lib/` (`utils.ts`), `hooks/`, `types/`,
  `styles/theme.css`.
- **Build outside-in:** scaffold `page.tsx` with stubbed sections first, then primitives, then
  flesh out each section.

### Forms & validation (contact form only)

- The contact form is the **only** form in the app. If it validates on the client, build it
  with **React Hook Form + Zod** (both installed); the Zod schema is the single source of
  truth, lives in the section's `schemas/`, and types are derived with `z.infer`.
- There is **no submission backend** in this repo. The form is a `mailto:` or a no-op
  confirmation until a real target is specified. A simple `mailto:`/state-only form does not
  need RHF/Zod — keep it plain in that case.
- Always show the form's states: validation errors, a disabled/submitting state, and a
  success/confirmation message (see ui-rules.md → States).

---

## Reuse Before Creating

Plan and reuse before you write. Duplication is a bug — the same helper or component built
twice will drift and break.

1. **Search first** — grep `src/shared/components/ui`, `src/shared/components`,
   `src/shared/lib`, and the section's own `components/`/`utils/` for something that already
   does the job. Never reimplement an existing helper.
2. **Extend, don't fork** — if an existing utility or component is close, extend it (extra
   prop, optional param, variant) rather than cloning it into a near-duplicate.
3. **Place by reach** — used by one section → keep it section-local
   (`features/sections/components` or `utils`); used by two or more → promote to `src/shared`.
   Promote on the *second* use, not in anticipation.

Authoring rules:

- **Components** are composable and **props-driven** — no business logic baked in. Build on
  `shared/components/ui` (shadcn) primitives; compose section composites (`ProjectCard`,
  `TestimonialCard`, `TimelineItem`) from them.
- **Utilities** are pure, single-purpose, fully typed — one concern per function; compose
  small functions rather than one that does everything.
- After building or promoting a shared component, add a row to **ui-registry.md** so the next
  session reuses it instead of rebuilding it.

---

## Split for Logic & Content

Keep logic and content out of components so they stay simple and readable.

- **Pages/layouts stay thin** — they compose section components; no business logic.
- **Content lives in `data/`**, derived/stateful logic in **hooks**, pure transforms in
  **utils**, and (if used) form rules in **Zod schemas**. A component should mostly wire these
  together and render.
- If a piece can't be verified after you write it, it isn't done — extract until it can be.

---

## Constants vs. Config vs. Data

Three buckets hold values outside components; they answer different questions. Create the
right one when the need arises — don't inline magic values, render-driving objects, or
content into components.

**Constants** — the authoritative *value* of something. Create one when a literal (string,
number, simple lookup) is referenced in more than one place or carries meaning.

- Pure data: primitives, `as const` maps. **No icons, no Tailwind classes, no JSX.**
- Lives in `constants/` — section-local or `src/shared/constants/`.
- Examples: section ids (`#home`, `#work`, …), a max-width container value.

**Config** — a structured object/array that drives how something *renders or behaves*. Create
one when a component would otherwise hardcode a list of options or branch on a type to pick
icons/labels/styles.

- Composes constants plus presentation: icons, labels, token classes, grouped into objects a
  component maps over.
- Lives in `config/` — section-local or `src/shared/config/`.
- Examples: the navbar/footer navigation links; a social-links list with icon + label.

**Data** — static **content** the UI renders (not behaviour, not a single authoritative value).
Create one when a section renders a list or block of content that would otherwise be hardcoded.

- Plain content records: projects, experience entries, testimonials, hero/intro copy. May
  reference image paths; **no icons/JSX/token classes** (that's config).
- Lives in `data/` — section-local (`features/sections/data/`), as per-section files
  (`projects.data.ts`, `experience.data.ts`, `testimonials.data.ts`) behind a `data/index.ts`
  barrel.
- The `data/` files are the **source of truth** for everything the page shows — there is no
  backend.

Rules:

- **Config may import constants; constants must never import config.** Config composes
  constants into render-ready shapes; `data/` is plain content.
- Decide by the test: *is it the authoritative value of something?* → **constant**. *Does it
  map a type to icons/labels/styles or drive behaviour?* → **config**. *Is it just content the
  UI renders?* → **data**.
- File naming: kebab-case — constants `*.ts` / `*-constants.ts`, config `*.config.ts`, data
  `*.data.ts`.

---

## Naming

- **Folders:** kebab-case — `recent-work`, `project-card`.
- **Component files:** PascalCase — `ProjectCard.tsx`, `TimelineItem.tsx`. One component per file.
- **Hooks:** `useX.ts`.
- **Constants/config/data:** kebab-case (`navigation.config.ts`, `projects.data.ts`,
  `section-ids.ts`).

---

## Component Structure

```typescript
"use client" // only if needed

// 1. External imports
import { useState } from "react"
import { Button } from "@components/ui/button"

// 2. Internal imports (shared, then section)
import { cn } from "@lib/utils"
import { PROJECTS } from "@features/sections/data"

// 3. Types
type Props = { id?: string }

// 4. Component
export function RecentWork({ id }: Props) {
  // state · derived · handlers · JSX
}
```

- Prefer named exports (route entries `page.tsx`/`layout.tsx` are the only defaults). Section
  files may use a default export only if that is the established local convention — prefer
  named for consistency with shared composites.
- No inline styles; style with Tailwind classes using the design tokens. The one sanctioned
  inline-style exception is applying a data-driven colour (e.g. a tech-tag accent stored as a
  hex in `data/`) via `style={{ … }}`; component *chrome* still uses tokens.
- No hardcoded hex or raw Tailwind color literals — use tokens (ui-tokens.md).

---

## Error Handling

- Never use empty catch blocks.
- Console errors carry a context prefix: `[ContactForm]`, `[useScrollSpy]`.
- User-facing errors are human-readable — surface contact-form validation/submit errors inline
  next to the field or form, never a raw error string.

---

## Environment Variables

The portfolio needs **no environment variables** to build or run — it has no backend and no
secrets. Do not hardcode anything that ought to be configurable, but in practice there is
nothing to configure today.

If the contact form is later pointed at a real submission target (a serverless endpoint or a
3rd-party form service), expose only its **public** URL via a `NEXT_PUBLIC_`-prefixed variable
and document it here. **Never** put a secret in a `NEXT_PUBLIC_` variable, and never commit one
— there is no server in this repo to hold a secret safely.

---

## Import Aliases (frontend `tsconfig.json`)

```typescript
import { Button } from "@components/ui/button"   // ./src/shared/components/ui
import { Navbar } from "@components/Navbar"        // ./src/shared/components
import { cn } from "@lib/utils"                    // ./src/shared/lib
import { PROJECTS } from "@features/sections/data" // ./src/features/...
// Never: import { Button } from "../../../shared/components/ui/button"
```

Available: `@/*`, `@app/*`, `@features/*`, `@shared/*`, `@components/*`, `@lib/*`.

---

## Comments

- No comments restating what the code does — code should be self-explanatory.
- Comments only for **why** — a non-obvious decision or constraint.
- Never leave `TODO` comments in committed code.

---

## Dependencies

Don't install a package without a clear reason. First check: does shadcn/ui already provide
the component? does Next.js/React already provide it? is there a simpler native option? The
app is intentionally lean (frontend only, no data layer) — avoid adding axios, a state library,
charts, or a backend SDK. The stack is documented in architecture.md and `package.json` —
update the Stack table when adding a dependency.
