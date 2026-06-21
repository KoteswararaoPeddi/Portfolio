# UI Tokens

Design tokens for the **Homerio** storefront, as defined in
`frontend/src/shared/styles/theme.css` (imported by `app/globals.css`). These are the real,
in-use tokens — an **ocean-green** primary, **cyprus** (deep teal) secondary, slate neutrals.
Use these exact tokens throughout; never hardcode hex or use raw Tailwind color classes.

> Source of truth: `src/shared/styles/theme.css`. If a token changes there, update this file.
> The palette can be re-themed later (it's a clean modern furniture aesthetic today); when it
> changes, regenerate this doc from `theme.css`.

---

## How It's Structured

`theme.css` has four layers (Tailwind v4 — no `tailwind.config.ts` for tokens):

1. **`@theme` foundation** — raw palette scales (`--color-ocean-green-*`, `--color-cyprus-*`,
   `--color-neutral-*`, plus red/amber/green/blue and a typography scale). These generate
   utilities like `bg-ocean-green-600`, `text-h2`.
2. **`:root` semantic layer** — named CSS vars that point at the palette (`--primary`,
   `--secondary`, `--background`, `--foreground`, `--border`, …) **and** shadcn aliases
   (`--card`, `--popover`, `--muted`, `--accent`, `--destructive`, `--sidebar-*`).
3. **`.dark`** — overrides only the semantic vars; shadcn aliases follow automatically through
   the `var()` chain.
4. **`@theme inline`** — bridges the semantic vars into Tailwind's `--color-*` namespace so
   utilities (`bg-primary`, `text-foreground`, `border-border`, `bg-card`, …) are generated.
   `inline` keeps them referencing the vars so `.dark` overrides apply.

```tsx
// Correct — generated utility classes
className="bg-primary text-primary-fg"
className="bg-card text-foreground border-border"

// Correct — CSS variable directly when a utility doesn't fit
style={{ color: "var(--primary)" }}

// Never — hardcoded hex / raw Tailwind colors
className="bg-[#3a8858] text-gray-600"
className="bg-emerald-700"
```

For conditional/merged classes, always use `cn` from `@lib/utils`.

---

## Semantic Tokens (use these in components)

| Role                 | Utility examples                                | Light value (via palette)        |
| -------------------- | ----------------------------------------------- | -------------------------------- |
| Primary (brand)      | `bg-primary` `text-primary` `border-primary`    | ocean-green-600 `#3a8858`        |
| Primary hover        | `bg-primary-hover`                              | ocean-green-700                  |
| Primary subtle       | `bg-primary-subtle`                             | ocean-green-100                  |
| On-primary text      | `text-primary-fg`                               | `#ffffff`                        |
| Secondary            | `bg-secondary` `text-secondary`                 | cyprus-900 `#003037`             |
| Danger / destructive | `bg-danger` / `bg-destructive`                  | red-600                          |
| Warning              | `bg-warning`                                    | amber-500                        |
| Success              | `bg-success`                                    | green-600                        |
| Info                 | `bg-info`                                       | blue-600                         |
| Page background      | `bg-background`                                 | neutral-50                       |
| Surface / card       | `bg-surface` / `bg-card`                        | `#ffffff`                        |
| Raised surface       | `bg-surface-raised` / `bg-muted`                | neutral-100                      |
| Foreground text      | `text-foreground` / `text-card-foreground`      | neutral-900                      |
| Muted text           | `text-muted-foreground`                         | neutral-500                      |
| Subtle text          | `text-subtle-foreground`                        | neutral-400                      |
| Border               | `border-border`                                 | neutral-200                      |
| Strong border        | `border-border-strong`                          | neutral-300                      |
| Input border         | `border-input`                                  | neutral-200                      |
| Focus ring           | `ring-ring` / `outline-ring`                    | ocean-green-500                  |

Each colored role also has `-hover`, `-subtle`, and `-fg` variants (e.g. `bg-danger-subtle`,
`text-warning-fg`). The dealer/admin **sidebar** has its own `--sidebar-*` family.

> Note on `accent`: the shadcn `--accent` alias maps to the raised surface (neutral-100),
> matching shadcn's "subtle hover" convention — it is **not** a vivid brand accent. For brand
> emphasis use `primary` / `secondary`. (The palette also defines `aqua-spring`, `surf-crest`,
> and `purple` scales in the foundation layer; they're available as `bg-aqua-spring-500` etc.
> but are not part of the semantic set — prefer semantic tokens.)

---

## Typography Scale

Defined in `@theme` → generates `text-*` size utilities:

| Utility            | Size  |  | Utility           | Size |
| ------------------ | ----- |--| ----------------- | ---- |
| `text-display-2xl` | 52px  |  | `text-body-lg`    | 16px |
| `text-display-xl`  | 48px  |  | `text-body-base`  | 14px |
| `text-display-lg`  | 35px  |  | `text-body-sm`    | 12px |
| `text-h1`          | 29px  |  | `text-label-lg`   | 14px |
| `text-h2`          | 24px  |  | `text-label-base` | 12px |
| `text-h3`          | 20px  |  | `text-label-sm`   | 11px |
| `text-h4`          | 16px  |  | `text-caption`    | 11px |
| `text-h5`          | 14px  |  |                   |      |
| `text-h6`          | 12px  |  |                   |      |

Font family is the default `font-sans` (applied to `html` in `globals.css`). If a brand
display font is added later, load it via `next/font/google` and wire it into `@theme` —
document it here.

---

## Radius

`--radius: 0.625rem` (10px). shadcn derives `rounded-sm/md/lg/xl` from it. Use the
`rounded-*` utilities, not arbitrary pixel radii.

---

## Dark Mode

`@custom-variant dark (&:is(.dark *))` is declared, and `.dark` overrides the semantic vars
(primary shifts to ocean-green-400, surfaces to neutral-900/950, etc.). The shadcn aliases
follow automatically through the `var()` chain — so dark mode requires **no** extra alias
block.

**Important:** for dark mode to resolve correctly, the `dark` class must sit on the **same
`<html>` element** as `:root` (the `next-themes` default). There is no theme toggle wired up
yet — add `ThemeProvider` in `app/layout.tsx` first, then update this note.

---

## Invariants

- Never hardcode hex in components — use the token utilities (or `var(--token)` when a
  utility doesn't fit).
- Never use raw Tailwind color classes (`bg-emerald-700`, `text-gray-600`) — only project tokens.
- Primary brand is ocean-green (`primary`); secondary is cyprus (`secondary`). Don't swap in
  Tailwind's built-in green/teal scales.
- Borders default to `border-border`; use `border-strong` for stronger edges, `border-input`
  for form fields. Never `border-gray-*`.
- Prefer semantic tokens over raw palette utilities; reach for a raw scale (`bg-ocean-green-200`)
  only for one-off decorative needs.
- Radius comes from `--radius` via `rounded-*` — don't hardcode pixel radii.
