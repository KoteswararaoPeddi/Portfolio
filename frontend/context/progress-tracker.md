# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately
know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 0/2/7 — Foundation + Home page UI + Admin dashboard UI + backend scaffold + first full-stack admin feature (Add Product)
**Last completed (Add Product — full-stack, wired):** Built the admin **Add Product** page at
`app/(admin)/admin/products/new` from `context/designs/Add Product.svg`, **wired end-to-end** to
`POST /api/products`. Shipped:
- **Backend extended to fit the design:** Prisma `Product` gained `salePrice?`, `taxIncluded`,
  `saleStartsAt?`, `saleEndsAt?`, `tags[]`; `ProductVariant` gained `stockStatus` (new enum
  `StockStatus`) + `isUnlimited`. Migration `add_product_pricing_inventory_fields` applied.
  `CreateProductDto`/variant DTO extended (variant **`sku` now optional**, auto-generated from
  slug+colour+index). Added minimal **`GET /api/categories`** (needed for the category dropdown's
  real FK ids).
- **Frontend:** installed `react-hook-form` + `zod` + `@hookform/resolvers` + `sonner` (project's
  first form). New primitives: `Label`, `Textarea`, `Select` (native), `Checkbox`, `Radio`, `Field`;
  `Toaster` mounted in admin layout; `ApiResponse<T>` shared type added; `.env.local` sets
  `NEXT_PUBLIC_API_URL=http://localhost:3001/api`.
- **Feature** `features/admin/products/{api,data,schemas,types,components/add-product}`: RHF+zod form,
  `FormProvider` sub-cards (Basic Details, Pricing, Inventory, Upload Image, Categories), maps values
  → `CreateProductBody` → `createProduct()` with toast feedback; Publish vs Save-to-draft.
- **Verified:** backend `tsc` clean; `GET /categories` + a full `POST /products` (all new fields,
  auto-SKU, image, relations) returned 201 against the live DB; frontend `tsc` clean; `next build`
  passes (`/admin/products/new` compiled); headless screenshot matches the SVG (two columns, all
  sections). Image upload still URL/sample-based (no storage endpoint); endpoint still unguarded.
**Earlier (backend Phase 2 — create product):** Added the **`POST /api/products`**
endpoint (`backend/src/products/`). Admin-facing create from the "Add Product" design. Shipped:
- `products.module.ts` (registered in `app.module.ts`), `products.controller.ts`
  (`POST /products` → 201, `@ResponseMessage('Product created')`), `products.service.ts`.
- DTOs (class-validator): `CreateProductDto` with nested `images[]` (URLs only — files are
  uploaded separately, body carries `url`/`alt`/`position`) and required `variants[]`
  (`@ArrayMinSize(1)`); `CreateProductImageDto`, `CreateProductVariantDto`.
- Service: single nested Prisma write (product + images + variants), returns product with
  `category`/`images`/`variants`. Slug uses caller value or auto-derives from `name`, with
  `-2/-3…` suffix on collision (explicit duplicate slug → 409). Missing `categoryId` → 404.
  Prisma `P2002` (slug / variant SKU) translated → 409.
- **No auth guard yet** — backend has no auth/roles module; marked the spot in the controller
  where `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)` plug in once auth lands.
- Verified: `tsc --noEmit` clean. Not yet run against the live DB / not frontend-wired.
**Earlier (backend Phase 0 scaffold):** Stood up the **NestJS backend** in `backend/`
(NestJS 11 + Prisma 6, TS strict). Shipped:
- Project config: `package.json`, `tsconfig`(strict), `nest-cli.json`, `.gitignore`,
  `.env.example` + `.env` (all env vars from code-standards), `README.md`.
- `prisma/schema.prisma` — full data model from architecture.md; Prisma client generated.
  `prisma/seed.ts` — idempotent upserts: 6 furniture categories + sample products/variants/images.
- NestJS foundation: `main.ts` (global `api` prefix, `ValidationPipe` whitelist+transform,
  `cookie-parser`, CORS credentials, shutdown hooks); `app.module.ts`; `config/`
  (`configuration.ts` + `env.validation.ts` via class-validator, `DATABASE_URL` required).
- `prisma/` `PrismaService` (connects on init) + global `PrismaModule`.
- `common/`: `ApiResponse<T>` type, global `ResponseInterceptor` + `@ResponseMessage`
  decorator, global `AllExceptionsFilter` (envelope-shaped errors, no stack leaks).
- `health/` module → `GET /api/health` (DB ping) for verifiability.
- DB live: local **PostgreSQL 18** (`postgresql-x64-18`), database `homerio`. First migration
  `init` applied; seed run (6 categories, 4 products). `DATABASE_URL` in `backend/.env` uses
  user `postgres`; the `$` in the password is percent-encoded (`%24`) so dotenv/Prisma parse it.
- Verified: `npm install` clean, `prisma generate` + `migrate dev` + `db:seed` ok, `nest build`
  + `tsc --noEmit` (incl. seed) clean. Live: `GET /api/health` →
  `{success, message:"Service healthy", data:{status:"ok", database:"up", uptime}}`;
  unknown route → `{success:false, message, data:null}` (404) via the exception filter.
**Earlier (admin dashboard):** Built the **admin dashboard** at `app/(admin)/admin/`
from `context/designs/Dashboard.svg`. Frontend only, mock data. Shipped:
- `(admin)/admin` `layout.tsx` (shadcn `SidebarProvider` + `AdminSidebar` + `SidebarInset`
  + `AdminTopbar`, wrapped in `TooltipProvider`) and `page.tsx` (composes 8 sections).
- Vendored shadcn `Sidebar` (+ Sheet/Tooltip/Separator/Skeleton/use-mobile) via the CLI;
  relocated into `src/shared` and fixed `components.json` aliases.
- New primitives: `Table`, `Avatar`, `Switch`, `Progress`. Admin chrome `AdminSidebar`/
  `AdminTopbar` + `shared/config/admin-navigation.config.ts`.
- `features/admin` (per-section components + config + types): summary cards, weekly report
  (recharts area), realtime users (recharts bar), sales-by-country, transactions table,
  top products, best-selling table, add-new-product. Added `recharts`.
- 12 embedded images extracted from the SVG → `public/admin-*.png`; flags use emoji.
- Verified: `tsc` clean, `next build` (`/admin` prerendered), screenshot-checked all sections.

**Earlier — Home page UI:** Built the complete storefront **home page** UI from the
`context/designs` reference (a "Dealport" marketplace landing). Frontend only, mock
data — not yet wired to the backend. Shipped:
- `(shop)` route group: `layout.tsx` (Navbar + main + Footer) and `page.tsx` (home).
  Root `layout.tsx` no longer hardcodes `<main>`; old root `page.tsx` removed.
- Shared primitives: `Card`, `Input`, `Badge` (token-styled, shadcn pattern).
- Shared composites: `Logo`, `RatingStars`, `ProductCard`, `Navbar`, `Footer`,
  `icons/social-icons`. Nav/footer data in `shared/config/navigation.config.ts`.
- Home feature: `features/home/{components,config,types}` — Hero, FeaturePromoGrid,
  PromoBannerRow, TrendingProducts, MensCollectionPromo, ExploreCategories,
  BestSelling (bento), LimitedTimeDeal, Testimonials. Content in
  `home-content.config.ts`. Catalog types in `shared/types/catalog.ts`.
- `public/` design images renamed to semantic kebab-case names.
- Verified: `tsc --noEmit` clean, `next build` succeeds (`/` prerendered static),
  visually screenshot-checked against the design across all sections.
**Next:** Wire the home page to the backend (Phase 2 catalog endpoints), then continue
Phase 0 backend scaffold (NestJS + Prisma) and Phase 1 auth. Add `next-themes` toggle +
mobile drawer/sheet for the navbar (currently desktop-first).

---

## Progress

See build-plan.md for the full per-feature breakdown.

- [~] Phase 0 — Monorepo Foundation (backend live: NestJS + Prisma + PG migrated/seeded; remaining: home page backend wiring + frontend `ApiResponse<T>` type + `next-themes` toggle)
- [ ] Phase 1 — Authentication
- [~] Phase 2 — Catalog (Categories + Products) — `POST /api/products` (create) + `GET /api/categories` (list) done; admin **Add Product** page wired end-to-end. Remaining: products list/detail/update/delete, category by-slug + admin CRUD, image upload endpoint, admin guard
- [ ] Phase 3 — Product Detail
- [ ] Phase 4 — Cart
- [ ] Phase 5 — Checkout & Orders
- [ ] Phase 6 — Account
- [ ] Phase 7 — Admin
- [ ] Phase 8 — AI Layer (Claude)
- [ ] Phase 9 — Polish

---

## Decisions Made During Build

- **Stack:** Next.js (App Router) + Tailwind v4 + shadcn/ui (frontend); NestJS + PostgreSQL + Prisma (backend).
- **Repo:** monorepo, two folders — `frontend/` and `backend/`.
- **Auth:** JWT access + refresh as HTTP-only cookies; backend is the authorization source of truth.
- **AI:** Claude / Anthropic (`@anthropic-ai/sdk`), server-side only — AI shopping assistant (tool use + SSE) and AI admin insights. Default model `claude-opus-4-8`. `ANTHROPIC_API_KEY` never reaches the client.
- **State:** Zustand for global state; cart store persisted to localStorage (`persist` middleware).
- **Theming:** light/dark mode via `next-themes`; mobile-responsive.
- **Payments:** no payment gateway (deliberate) — orders are created as `PENDING`/`UNPAID` and fulfilled manually. No Stripe/PayPal.

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._

> **Note on existing scaffold:** the repo currently contains a partial frontend scaffold from
> setup (a `Button`, the `theme.css` token system, an axios stub, route constants). Reuse or
> replace these as Phase 0 proceeds; treat build-plan.md as the authoritative target.

### Home page build — decisions / deviations

- **Brand:** the design reference is a "Dealport" marketplace, so the home page renders that
  branding (logo, footer) verbatim, while the engineering rules/tokens stay Homerio's.
- **Where rules beat the design (user said "follow the rules"):**
  - **No em/en dash** in UI copy — the hero "Discover the Latest Deals –" and the testimonials
    subtitle were rewritten without the dash.
  - **Social icons rendered monochrome** (`text-secondary`) — lucide 1.17 ships no brand icons
    and brand-colour hex is disallowed by the token rules, so inline glyphs inherit a token colour.
- **"View Details" link** uses the project `purple-600` palette token (no semantic purple token
  exists) to match the design's purple links — a palette token, not a raw Tailwind colour.
- **Mobile:** layout is responsive (grids reflow), but the navbar mega-menu and filter sheet/drawer
  are deferred to a later pass; current navbar is desktop-first. No `next-themes` toggle yet.
- **Images:** all interactivity (search, add-to-cart, wishlist, carousel arrows) is visual only —
  components are server components with mock data, to be wired in Phase 2.

### Home feature — folder restructure + fixes (later pass)

- **Per-section structure:** `features/home/components/` now has one kebab-case folder per
  section (`hero/`, `feature-promo-grid/`, `promo-banner-row/`, `trending-products/`,
  `explore-categories/`, `best-selling/`, `limited-time-deal/`, `testimonials/`,
  `section-heading/`), each with an `index.ts` barrel; `components/index.ts` re-exports the
  public components (page import unchanged). `home-content.config.ts` was split into
  per-section files under `config/` + a `config/index.ts` barrel. Convention recorded in
  code-standards.md. `TestimonialCard` extracted from `Testimonials`.
- **Button text bug (fixed):** `cn()` used a bare `twMerge` that didn't know the custom
  type-scale tokens, so it conflated `text-label-*` (size) with `text-*-foreground` (colour)
  and dropped the colour — buttons rendered dark-on-dark (GET STARTED worst). Fixed by
  `extendTailwindMerge` registering the custom font sizes in `shared/lib/utils.ts`. Any
  custom `text-size` token added to `theme.css` must also be added to that list.
- **Navbar:** changed from `bg-surface/95 backdrop-blur` to opaque `bg-surface shadow-sm`
  (content was bleeding through on scroll).

### Feature-module convention (adopted for all features)

- Features are self-contained vertical slices; folder vocabulary `components/ api/ hooks/
  schemas/ data/ config/ constants/ utils/ types/` (only what's used). Three-tier promotion:
  feature-local → `features/<name>/shared/` → global `src/shared/`. Codified in code-standards.
- **`data/` vs `config/`:** `data/` = static content the UI renders (`*.data.ts`); `config/`
  = render-driving maps (icons/labels/options). This reverses the earlier "no data/ bucket".
- **Migrated existing features:** `home` and `admin` `config/` → `data/` (`*.config.ts` →
  `*.data.ts`, barrel + imports updated); added feature `shared/` tiers — `home/shared/components/SectionHeading`,
  `admin/shared/components/{TrendBadge,DetailsButton,StatusDot}`. `tsc` clean, build passes.
- **Build order:** outside-in — `page.tsx` (stubs) → primitives → components, dev server live.
  Recorded in code-standards Engineering Mindset.
- **Feature groups (areas):** both areas are now groups — `features/admin/{dashboard, shared}`
  (admin-facing) and `features/customer/{home, shared}` (customer-facing); analytics/settings/
  catalog/… drop in alongside. Dashboard → `admin/dashboard/{components, data}`, group types →
  `admin/shared/types/admin.types.ts`. Home → `customer/home/{components, data, types}`,
  `SectionHeading` promoted to `customer/shared/components/` (generic, reusable across customer
  features). `(shop)`/`(admin)` route groups unchanged. Codified in code-standards. `tsc`/build clean.
- **Admin chrome → admin area:** `AdminSidebar`/`AdminTopbar` + `admin-navigation.config` moved
  from global `src/shared` to `features/admin/shared/{components,config}` (admin-only chrome).
  Rendered once in `(admin)/admin/layout.tsx`, so all `/admin/*` pages share them. `AdminTopbar`
  title now derives from the route (`ADMIN_NAV`). (Customer `Navbar`/`Footer` still in
  `src/shared/components` — move to `features/customer/shared/` is the parallel follow-up.)
- **Customer chrome (partial) + route rename:** `Footer` moved to
  `features/customer/shared/components/Footer.tsx` (customer-only chrome); **`Navbar` stays in
  `src/shared/components`** for now (per instruction). Route group `app/(shop)/` renamed to
  **`app/(customer)/`** (route groups don't change URLs — `/` is unaffected). `navigation.config`
  still in `shared/config` (used by both Navbar and Footer). `tsc`/build clean.
