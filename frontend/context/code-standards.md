# Code Standards

Conventions for **both apps** in the Homerio monorepo — the Next.js `frontend/` and the
NestJS `backend/`. Follow these every session without exception; they prevent pattern
drift. See architecture.md for structure and the data model.

---

## Engineering Mindset

- **Think before implementing** — understand what and why before writing code.
- **Read context files first** — verify against architecture.md and project-overview.md.
- **Scope is sacred** — build only what the current feature requires.
- **Every feature must be testable** — if it can't be verified after implementation, it's incomplete.
- **Clean over clever** — simple, readable code a junior can follow beats clever abstractions.
- **One thing at a time** — complete one feature fully before starting the next.
- **Fail gracefully** — handle errors at the boundary; surface human-readable messages; never let a promise float.
- **Plan for reuse** — decide where logic/UI belongs (feature-local vs. shared) before writing it; build small, composable units.

---

## TypeScript (both apps)

- Strict mode is on — no exceptions.
- Never use `any` — use `unknown` and narrow.
- Avoid type assertions (`as`) unless truly necessary, and comment why.
- All function parameters and return types are explicitly typed.
- Use `type` for object shapes/unions; `interface` for extendable shapes (component props, `ApiResponse<T>`, Nest DTO classes use `class`).
- All async code handles its errors.
- `const` by default; `let` only when reassignment is required.

---

## Frontend — Next.js 16

- App Router only. React 19 APIs throughout.
- **This is not the Next.js in your training data** — read `node_modules/next/dist/docs/` before using a Next.js-specific feature; heed deprecation notices (see `AGENTS.md`).
- Components are Server Components by default. Add `"use client"` only when the component needs `useState`/`useReducer`/`useEffect`, browser APIs/event listeners, or a client-only library (Zustand store, shadcn interactive bits).
- Never add `"use client"` to a layout unless required.
- Pages/layouts in `src/app` stay thin — they compose feature components and hold no business logic.

### Frontend folder & file architecture

- `src/app/*` — route entries only (route groups, layouts, `page.tsx`).
- `src/features/<name>/` — one domain feature as a **self-contained vertical slice**. It carries only the folders it actually uses, from this vocabulary: `components/`, `api/` (axios services), `hooks/`, `schemas/` (Zod), `data/` (static content / mock data), `config/` (render-driving maps), `constants/`, `utils/`, `types/`. Sub-features nest (e.g. `components/lead-queue/{table, toolbar}`).
- **Feature groups (areas):** a `features/<area>/` may be a **group** that contains several sub-features plus a group-level `shared/` — e.g. `admin/{dashboard, analytics, settings, shared}` (admin-facing) and `customer/{home, …, shared}` (customer-facing). Each sub-feature (`admin/dashboard/`) is itself a full vertical slice; the group's `shared/` holds code used across the area's features (its types/atoms). So nesting runs **area → feature → (per-section components)**.
- **Three-tier promotion:** feature-local → **`features/<area>/shared/`** (group-shared; mirrors the vocabulary: `shared/components/`, `shared/types/`, …) → global **`src/shared/`** (truly cross-cutting). A type/atom used by a group's `shared/` must live in that `shared/` (not inside a sub-feature), so `shared` never depends on a feature. Promote outward only on real reuse.
- **`data/` vs `config/`:** **`data/`** holds static **content** the UI renders (product lists, testimonials, dashboard mock rows) as per-section/per-variant files (`hero.data.ts`, `trending.data.ts`) with a `data/index.ts` barrel. **`config/`** is reserved for **render-driving maps** (status→icon/label, filter/option lists, nav items). `constants/` stays authoritative primitive values. (See "Constants vs. Config".)
- **Per-section organisation (multi-section features like `home`/`admin`):** inside `components/`, give each section its own kebab-case folder with an `index.ts` barrel (e.g. `components/trending-products/{TrendingProducts.tsx, MensCollectionPromo.tsx, index.ts}`); a top-level `components/index.ts` re-exports each section's public component so pages import from `@features/<name>/components`. One component per file; folders kebab-case, component files PascalCase.
- **Build outside-in:** scaffold `page.tsx` with stubbed sections first, then primitives, then flesh out components (see Engineering Mindset).
- `src/shared/` — `components/ui` (shadcn) + shared composites, `store/` (Zustand), `lib/` (axios, utils), `constants/`, `config/`, `hooks/`, `types/`, `styles/`.
- A feature never imports another feature's internals; shared code goes through `src/shared`. `shared` never imports from `features`/`app`.

### Frontend backend calls (axios services)

All API access goes through the shared axios instance — never a bare `fetch`/`axios()`.

```typescript
// features/<name>/api/<thing>.service.ts
import axiosInstance from "@lib/axios.config"
import type { ApiResponse } from "@shared/types/api"

export const fetchProduct = async (slug: string): Promise<Product> => {
  const { data } = await axiosInstance.get<ApiResponse<Product>>(`/products/${slug}`)
  return data.data
}
```

- Network logic lives in `*.service.ts` — never inside components.
- Backend envelope is `ApiResponse<T> = { success: boolean; message: string; data: T }` — unwrap `.data.data` and return typed domain objects.
- The instance is `withCredentials: true`; auth rides on HTTP-only cookies — never read/attach tokens manually.
- The response interceptor handles 401 (single-flight refresh + replay → `/login`), 403, and 5xx. Don't re-implement per call. The refresh call uses a bare `axios.post` so it can't recurse.

### Frontend forms & validation

- Build forms with **React Hook Form + Zod**; the Zod schema is the single source of truth.
- Schemas live in the feature's `schemas/`. Derive types with `z.infer`.
- Validate all input before calling a service.

### Frontend state

- **Zustand** for genuinely cross-cutting state only: `auth.store` (session/user/role) and `cart.store` (cart + item count). Select narrow slices (`useStore((s) => s.x)`); never subscribe to the whole store.
- The cart store uses the `persist` middleware (localStorage) so a guest cart survives reloads; merge it into the server cart on login.
- Prefer local component state + props otherwise.

---

## Reuse Before Creating

Plan and reuse before you write. Duplication is a bug — the same helper or component built
twice will drift and break.

1. **Search first** — grep `src/shared/components/ui`, `src/shared/components`, `src/shared/utils`/`lib`, and the feature's own `components/`/`utils/` for something that already does the job. Never reimplement an existing helper.
2. **Extend, don't fork** — if an existing utility or component is close, extend it (extra prop, optional param, variant) rather than cloning it into a near-duplicate.
3. **Place by reach** — used by one feature → keep it feature-local (`features/<name>/components` or `utils`); used by two or more → promote to `src/shared`. Promote on the *second* use, not in anticipation.

Authoring rules:

- **Components** are composable and **props-driven** — no data fetching or business logic baked in. Build on `shared/components/ui` (shadcn) primitives; compose feature composites (`ProductCard`, `VariantPicker`, `CartLineItem`) from them.
- **Utilities** are pure, single-purpose, fully typed — one concern per function; compose small functions rather than one that does everything.
- After building or promoting a shared component, add a row to **ui-registry.md** so the next session reuses it instead of rebuilding it.

---

## Split for Testability

Keep logic out of components so it can be tested without rendering.

- **Pages/layouts stay thin** — they compose feature components; no business logic.
- **Network logic lives in `*.service.ts`**, form rules in **Zod schemas**, derived/stateful logic in **hooks**, and pure transforms in **utils** — each unit-testable in isolation. A component should mostly wire these together and render.
- On the backend, the same split is the module shape: **controllers** route, **services** hold logic (testable without HTTP), **Prisma** is injected (mockable).
- If a piece can't be verified after you write it, it isn't done — extract the logic until it can be.

---

## Constants vs. Config vs. Data

Three buckets hold values outside components; they answer different questions. Create the right
one when the need arises — don't inline magic values, render-driving objects, or content into components.

**Constants** — the authoritative *value* of something. Create one when a literal (string,
number, enum, simple lookup) is referenced in more than one place or carries domain meaning.

- Pure data: primitives, `as const` enums, simple key→value maps. **No icons, no Tailwind classes, no JSX.**
- Lives in `constants/` — feature-local (`features/<name>/constants/`) or `src/shared/constants/`.
- Examples: `ORDER_STATUS` values, `PAGE_SIZE`, route paths, the roles map.

**Config** — a structured object/array that drives how a feature *behaves or renders*. Create
one when a component would otherwise hardcode a list of options or branch on a type to pick
icons/labels/styles.

- Composes constants plus presentation: icons, labels, token classes, grouped into objects a component maps over.
- Lives in `config/` — feature-local or `src/shared/config/`.
- Examples: order-status → `{ label, icon, tokenClass }` map; catalog filter/sort option lists; admin sidebar items.

**Data** — static **content** the UI renders (not behaviour, not a single authoritative value).
Create one when a section/page renders a list or block of content that would otherwise be
hardcoded in the component.

- Plain content records: product lists, testimonials, dashboard mock rows/metrics, per-page copy. May reference images/paths; **no icons/JSX/token classes** (that's config).
- Lives in `data/` — feature-local (`features/<name>/data/`), as per-section/per-variant files (`hero.data.ts`, `trending.data.ts`) behind a `data/index.ts` barrel.
- Examples: `TRENDING_PRODUCTS`, `TESTIMONIALS`, `TRANSACTIONS`, footer/landing per-page content.
- Until the backend is wired, `data/` is the mock-content source the components render.

Rules:

- **Config may import constants; constants must never import config.** Config composes constants into render-ready shapes; `data/` is plain content.
- Decide by the test: *is it the authoritative value of something?* → **constant**. *Does it map a type to icons/labels/styles or drive behaviour?* → **config**. *Is it just content the UI renders?* → **data**.
- File naming: kebab-case — constants `*.ts` / `*-constants.ts`, config `*.config.ts`, data `*.data.ts`.

---

## Backend — NestJS

- One **module** per domain (`auth`, `products`, `cart`, `orders`, …); each owns its controller(s), service(s), and DTOs.
- **Controllers** are thin: route, validate (DTO), delegate to a service, shape the response. No business logic, no Prisma calls in controllers.
- **Services** hold business logic and are the only place that touches `PrismaService`.
- **DTOs** are classes decorated with `class-validator`; the global `ValidationPipe` runs with `{ whitelist: true, transform: true }`.
- **PrismaService** is the single injectable DB client (extends `PrismaClient`, connects on init). Never `new PrismaClient()` anywhere else.
- Return typed data; wrap responses in the shared `{ success, message, data }` envelope via a response interceptor or explicit shaping.
- Use Nest's exception classes (`NotFoundException`, `BadRequestException`, `ForbiddenException`, …) — never throw raw strings.

```typescript
// products/products.controller.ts
@Controller("products")
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Public()
  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    return this.products.findBySlug(slug) // service throws NotFoundException if missing
  }
}
```

### Auth (backend)

- JWT access + refresh issued as **HTTP-only cookies** (`httpOnly`, `secure` in prod, `sameSite`).
- Passwords hashed with **bcrypt**; never log or return a `passwordHash`.
- Passport JWT strategy reads the token from the cookie. Global `JwtAuthGuard`; `@Public()` opts out; `@Roles(Role.ADMIN)` + `RolesGuard` for admin routes.
- A `@CurrentUser()` decorator exposes the authenticated user to handlers.

### Prisma & migrations

- Schema changes go through `prisma migrate dev` (never hand-edit the DB). Commit migrations.
- Use `select`/`include` deliberately — never over-fetch; never return `passwordHash`.
- Money is `Decimal`; convert to string at the API boundary to avoid float drift.

### AI (Anthropic / Claude)

All AI runs server-side via `@anthropic-ai/sdk` (see library-docs.md for the full patterns).

- `ANTHROPIC_API_KEY` is **backend-only** — never `NEXT_PUBLIC_`, never sent to the client. The frontend calls our own endpoints (`/assistant/*`, `/admin/insights`), never the Anthropic API directly.
- AI tools (`search_products`, `get_order_status`, …) are thin wrappers over existing services — never reimplement catalog/order logic in a tool. **Scope user/order tools to the authenticated `userId`** from the request; never trust an ID the model supplies.
- Use the model IDs and `effort` guidance from library-docs.md; default `claude-opus-4-8`. Set thinking with `{ type: "adaptive" }` — never `budget_tokens`.
- Wrap AI calls in try/catch and check `stop_reason`; the store must degrade gracefully if the AI is down. AI never mutates data — it reads via tools only; mutations go through the normal validated endpoints.

### No payments

There is no payment gateway. Checkout creates a `PENDING`/`UNPAID` order; fulfilment is
manual. Do not add Stripe or any payment SDK, env var, or webhook.

---

## Naming (both apps)

- **Folders:** kebab-case — `product-detail`, `add-to-cart`.
- **Frontend component files:** PascalCase — `ProductCard.tsx`, `CartDrawer.tsx`. One component per file.
- **Hooks:** `useX.ts`.
- **Frontend services:** `*.service.ts`.
- **Nest files:** `*.controller.ts`, `*.service.ts`, `*.module.ts`, `*.dto.ts`, `*.guard.ts`, `*.strategy.ts`.
- **Constants/config:** kebab-case (`order-status.ts`, `permission-routes.ts`).

---

## Component Structure (frontend)

```typescript
"use client" // only if needed

// 1. External imports
import { useState } from "react"
import { Button } from "@components/ui/button"

// 2. Internal imports (shared, then feature)
import { useCartStore } from "@shared/store/cart.store"
import { addToCart } from "@features/cart/api/cart.service"

// 3. Types
type Props = { variantId: string }

// 4. Component
export function AddToCartButton({ variantId }: Props) {
  // state · derived · handlers · JSX
}
```

- Prefer named exports (route entries `page.tsx`/`layout.tsx` are the only defaults).
- No inline styles; style with Tailwind classes using the design tokens.
- No hardcoded hex or raw Tailwind color literals — use tokens (ui-tokens.md).

---

## Error Handling

- Never use empty catch blocks.
- Frontend console errors carry a context prefix: `[cart.service]`, `[ProductCard]`.
- Backend throws typed Nest exceptions; a global exception filter shapes them into the `{ success, message }` envelope. Never leak stack traces or internals to clients.
- User-facing errors are human-readable; surface via `sonner` toasts on the frontend.

---

## Environment Variables

Never hardcode a URL, key, or secret.

| App      | Variable              | Used for                                            |
| -------- | --------------------- | --------------------------------------------------- |
| frontend | `NEXT_PUBLIC_API_URL` | axios `baseURL` (the backend origin + `/api`)       |
| backend  | `DATABASE_URL`        | Postgres connection (Prisma)                        |
| backend  | `JWT_ACCESS_SECRET`   | Sign access tokens                                  |
| backend  | `JWT_REFRESH_SECRET`  | Sign refresh tokens                                 |
| backend  | `ACCESS_TOKEN_TTL` / `REFRESH_TOKEN_TTL` | Token lifetimes                  |
| backend  | `COOKIE_DOMAIN` / `CORS_ORIGIN` | Cookie scope + allowed frontend origin     |
| backend  | `ANTHROPIC_API_KEY`   | Claude AI (assistant + admin insights) — server-side only |

`NEXT_PUBLIC_` exposes a variable to the browser — never prefix a secret with it. Backend
secrets live only in `backend/.env`, never in the frontend.

---

## Import Aliases (frontend `tsconfig.json`)

```typescript
import { Button } from "@components/ui/button"       // ./src/shared/components/ui
import { cn } from "@lib/utils"                       // ./src/shared/lib
import axiosInstance from "@lib/axios.config"
import { useAuthStore } from "@shared/store/auth.store"
import { fetchProducts } from "@features/catalog/api/products.service"
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
the component? does Next.js/React/Nest already provide it? is there a simpler native option?
The stack is documented in architecture.md and each app's `package.json` — update the Stack
table when adding a dependency.
