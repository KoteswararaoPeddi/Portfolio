# UI Registry

Living document. Updated after every shared component is built. **Read this before building
any new component** — match an existing pattern before inventing a new one.

## How to Use

Before building a component:

1. Check if a similar component already exists here (or in `src/shared/components/ui`).
2. If yes — reuse it; match its props/classes.
3. If no — build it on shadcn/ui primitives following ui-rules.md + ui-tokens.md, then add a
   row below.

After building or promoting a shared component, add it here with its file path and a short note.

---

## UI Typos / Known Issues

Record UI copy typos and other UI issues here: location (page/component + file), current
(wrong) text, correct text, status.

| # | Location (component / file) | Current text | Correct text | Status |
| - | --------------------------- | ------------ | ------------ | ------ |
|   |                             |              |              |        |

---

## Components

_Empty — Homerio is newly initialized. Log shared components here as they are built (e.g.
`ProductCard`, `CartDrawer`, `VariantPicker`, `PriceTag`, `RatingStars`)._

### Primitives (`src/shared/components/ui`)

| Component | File | Notes |
| --------- | ---- | ----- |
| Button | `ui/button.tsx` | base-ui Button + cva. Variants: default/outline/secondary/ghost/destructive/link; sizes xs–lg + icon. Pre-existing scaffold. |
| Card | `ui/card.tsx` | `Card`/`CardHeader`/`CardContent`/`CardFooter`. `bg-card border-border rounded-lg`. |
| Input | `ui/input.tsx` | Token-styled text input (`border-input`, ring on focus). |
| Badge | `ui/badge.tsx` | cva variants: default/subtle/secondary/success/warning/danger/outline. |
| Typography | `ui/typography/` | Polymorphic text component. Pre-existing scaffold. |

### Shared composites (`src/shared/components`)

| Component | File | Notes |
| --------- | ---- | ----- |
| Logo | `Logo.tsx` | "DEALP🛒RT" wordmark (ShoppingCart as the O), `text-primary`. Links home. Used in Navbar + Footer. |
| RatingStars | `RatingStars.tsx` | 5 stars (`fill-warning`) + `(N reviews)`. Props: `rating`, `reviewCount?`. |
| ProductCard | `ProductCard.tsx` | Props-driven card: image + wishlist heart, name, desc, RatingStars, price/compare/discount, View Details + Add to cart. Driven by `ProductCardData`. Reused by Trending + Limited-Time-Deal (and future catalog/search). |
| Navbar | `Navbar.tsx` | Sticky 3-row header: utility (logo/location/lang/search/account/cart), primary nav, department bar. Server component; data from `navigation.config`. |
| Footer | `features/customer/shared/components/Footer.tsx` | Customer-only chrome → lives in the **customer area** shared (not global). 4 link columns + centred logo, newsletter, monochrome social icons, bottom bar. Data from `navigation.config`. (Navbar stays in `shared/components` for now.) |
| Social icons | `icons/social-icons.tsx` | Facebook/Instagram/X/LinkedIn glyphs via `currentColor` (lucide has no brand icons; brand-hex disallowed → tinted `text-secondary`). |

### Home feature components (`src/features/customer/home/components`)

| Component | Notes |
| --------- | ----- |
| SectionHeading | Title + outline "View All" pill (buttonVariants on a Link). |
| Hero | Full-width banner: image + `bg-linear-to-r from-secondary` overlay, eyebrow/title/CTA, carousel arrows. |
| FeaturePromoGrid | 12-col bento overlapping the hero: New Year card, Gaming accessories 2×2, Winner/Redmi image promos, Philips TV card. |
| PromoBannerRow | 4 promo banner tiles. |
| TrendingProducts | 3 ProductCards + MensCollectionPromo. |
| MensCollectionPromo | "Trendd collection for men" 2×2 mini-product tiles (price + Buy Now). |
| ExploreCategories | Horizontal-scroll category tiles + next arrow. |
| BestSelling | Bento grid of promo tiles (price chip + CTA overlay), driven by `BentoTile.spanClass`. |
| LimitedTimeDeal | 5 ProductCards (reuse). |
| Testimonials | Scrollable testimonial cards (centre highlighted) + GET STARTED. |

---

## Baseline — Established 2026-06-14

_Established via `/imprint audit` over the home page build. Every new component should match these. Values are token classes (see ui-tokens.md), never hex or raw Tailwind colours._

| Property | Correct class |
| -------- | ------------- |
| Page background | `bg-background` |
| Card / panel background | `bg-card` (cards), `bg-surface` (chrome, inputs, pills) |
| Raised / muted surface | `bg-surface-raised` (image wells, mini-tiles) |
| Soft brand surface | `bg-primary-subtle` (footer, search pill, Buy-Now chips) |
| Strong brand surface | `bg-secondary` (avatars, GET STARTED) |
| Card border | `border border-border` |
| Input border | `border-input` |
| Active / highlight border | `border-primary` |
| Card padding | `p-4` |
| Section gap | `gap-16` between sections; `gap-4`/`gap-6` within |
| Shadow | `shadow-sm` (raised panels, chips, floating buttons); `shadow-md` (carousel arrows) |

### Radius scale (intentional hierarchy — match by element type)

| Element type | Radius |
| ------------ | ------ |
| Badge, mini-tile thumbnail | `rounded-md` |
| Card, input, inner image well | `rounded-lg` |
| Media / promo tile, category card, banner, testimonial card | `rounded-xl` |
| Hero, feature-promo panel | `rounded-2xl` |
| Pill, CTA, chip, avatar, count badge | `rounded-full` |

### Typography

| Role | Class |
| ---- | ----- |
| Section heading | `text-h2 font-bold text-foreground` |
| Promo card title | `text-h3 font-bold text-foreground` |
| Product card title | `text-h6 font-semibold text-foreground` |
| Body / description | `text-body-sm` or `text-body-base` + `text-muted-foreground` |
| Price | `text-h5 font-bold text-primary` |
| Tiny labels (badges, counts) | `text-caption` / `text-label-sm` — **never** arbitrary `text-[Npx]` |

### Inline link colour convention (by role)

Two inline-link colours are intentional and assigned by role — do not mix them:

| Link role | Class | Example |
| --------- | ----- | ------- |
| Product action | `text-purple-600 hover:underline` | ProductCard "View Details" |
| Navigation | `text-info hover:underline` | Navbar / Gaming card "See more" |

> `text-purple-600` is a project palette token (defined in `theme.css`), kept to match the
> design's purple product-action links. It does not adapt in dark mode — revisit when the
> dark-mode pass lands.

### Stars

Filled `fill-warning text-warning`; empty `fill-surface-raised text-border-strong` (see `RatingStars`).

---

## Admin dashboard (added 2026-06-16)

### Primitives (`src/shared/components/ui`)

| Component | File | Notes |
| --------- | ---- | ----- |
| Sidebar (+ family) | `ui/sidebar.tsx` | Official **shadcn** `Sidebar` primitive, vendored via `npx shadcn add sidebar` (CLI works locally; writes to `components.json` paths — relocated into `shared/`). Uses the `--sidebar-*` tokens. Pulls `Sheet`, `Tooltip`, `Separator`, `Skeleton`, `use-mobile`. Provider-based, client. |
| Sheet | `ui/sheet.tsx` | shadcn, base-ui Dialog. Mobile sidebar drawer. |
| Tooltip | `ui/tooltip.tsx` | shadcn, base-ui Tooltip. `TooltipProvider` wraps the admin layout. |
| Separator / Skeleton | `ui/separator.tsx`, `ui/skeleton.tsx` | shadcn deps of sidebar. |
| Table | `ui/table.tsx` | `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell`. `border-border` row dividers, `text-muted-foreground` heads. |
| Avatar | `ui/avatar.tsx` | `next/image` in a `rounded-full size-10` (override size via className). |
| Switch | `ui/switch.tsx` | Visual toggle (`role=switch`); `bg-primary` when checked. |
| Progress | `ui/progress.tsx` | Horizontal bar; data-driven width via inline `style` (justified); `indicatorClassName` to recolor. |

> **components.json fix:** aliases were `@/components/*` (wrong for our `src/shared` layout). Updated to `@/shared/components`, `@/shared/lib`, `@/shared/hooks` so future `shadcn add` lands in `src/shared`.

### Admin chrome (`src/features/admin/shared/`)

Admin-only chrome lives in the **admin area's** shared tier (not global `src/shared`), and is
rendered once in `app/(admin)/admin/layout.tsx` so **every** `/admin/*` page reuses the same
sidebar + topbar. Nav data: `features/admin/shared/config/admin-navigation.config.ts`.

| Component | File | Notes |
| --------- | ---- | ----- |
| AdminSidebar | `shared/components/AdminSidebar.tsx` | Client. Composes shadcn `Sidebar` with grouped nav from `admin-navigation.config`; active item = `bg-primary text-primary-fg`, `usePathname`. Footer: profile + Your Shop. |
| AdminTopbar | `shared/components/AdminTopbar.tsx` | Client. **Title derives from the route** via `ADMIN_NAV` (matches the sidebar), so each admin page shows its own heading. Search, bell, theme `Switch`, `Avatar`. |

### Admin feature (`src/features/admin`)

`admin` is a **feature group (area)**: `features/admin/{dashboard, shared}` (with `analytics`, `settings`, … to come). The **Dashboard** feature is `features/admin/dashboard/{components/<section>/, data/*.data.ts}`. Group-shared lives in `features/admin/shared/`: `shared/components/` (`TrendBadge`, `DetailsButton`, `StatusDot`) and `shared/types/admin.types.ts` (`Trend` etc. — at the group level because the shared atoms depend on it). Likewise **`customer`** is the customer-facing area: `features/customer/{home, shared}`. The **Home** feature is `features/customer/home/{components/<section>/, data/, types/}`; group-shared `SectionHeading` lives in `features/customer/shared/components/` (reusable by future customer features — catalog, search, …).

| Section | Notes |
| ------- | ----- |
| summary-cards | `StatCard` (×2) + `PendingCanceledCard`. |
| weekly-report | **client**; recharts `AreaChart` (`isAnimationActive={false}`), week toggle, mini-stats. |
| realtime-users | **client**; recharts `BarChart`. |
| sales-by-country | flag + `Progress` (purple) + `TrendBadge`; faint world-map bg. |
| transactions / best-selling | `Table` + `StatusDot` + `DetailsButton`. |
| top-products / add-new-product | product/category lists. |

> **recharts:** chart colors use `var(--primary)` etc. (token strings valid in SVG). Charts set `isAnimationActive={false}` so they paint on first render (also fixes blank charts in headless capture). The SSR `width(-1)` build warning is benign (ResponsiveContainer can't measure during prerender).

---

## Forms — Add Product (added 2026-06-17)

First real form in the project. Stack: `react-hook-form` + `zod` (`@hookform/resolvers/zod`) + `sonner` toasts. New form primitives are styled **native elements** (forwardRef) so they bind with RHF `register()` directly; richer controls use `<Controller>`.

### Form primitives (`src/shared/components/ui`)

| Component | File | Notes |
| --------- | ---- | ----- |
| Label | `ui/label.tsx` | `<label>`, `text-body-sm font-medium text-foreground select-none`. |
| Textarea | `ui/textarea.tsx` | forwardRef `<textarea>`; mirrors `Input` (`border-input bg-surface rounded-lg`, focus ring), `min-h-24`, `aria-invalid:border-destructive`. |
| Select | `ui/select.tsx` | forwardRef styled **native** `<select>` (`appearance-none`, `pr-9`) + absolute `ChevronDown`. Pass `<option>`s as children. register-friendly. |
| Checkbox | `ui/checkbox.tsx` | forwardRef native checkbox; `size-4 rounded border-input accent-primary` (brand-green check). |
| Radio | `ui/radio.tsx` | forwardRef native radio; `size-4 accent-primary`. Group by shared `name`. |
| Field | `ui/field.tsx` | Wrapper: `Label` + control (children) + `error` (`text-body-sm text-danger`). `flex flex-col gap-1.5`. Optional `hint` (muted "(Optional)"). |

Shared envelope type added: `src/shared/types/api-response.ts` (`ApiResponse<T>`), mirrors the backend. `Toaster` (sonner, `position="top-right" richColors`) mounted once in `app/(admin)/admin/layout.tsx`.

### Add Product feature (`src/features/admin/products`)

New feature under the admin area: `products/{api, data, schemas, types, components/add-product}`. Page is thin: `app/(admin)/admin/products/new/page.tsx` → `<AddProductForm />`. Sidebar "Add Products" already links here.

| Piece | Notes |
| ----- | ----- |
| AddProductForm | **client**. `useForm` + `FormProvider`; maps form values → `CreateProductBody` → `createProduct()` (POST /products); sonner toast; Publish vs Save-to-draft set `isPublished`. Fetches categories client-side for the dropdown. |
| BasicDetails / Pricing / Inventory / Categories / UploadImage cards | Each a `Card` (`gap-5 p-6`, `text-h4 font-semibold` heading); consume `useFormContext()`. Controlled bits via `Controller`: tax radios, Unlimited `Switch`, color swatch, image gallery. |
| AddProductHeader | Title + search `Input` + outline "Save to draft" + primary "Publish product" + icon "+". |

**Pattern notes:**
- **Two-column admin form layout:** `grid grid-cols-1 gap-6 lg:grid-cols-3` with the main column `lg:col-span-2` and the side column the remaining cell. **Avoid arbitrary track values like `lg:grid-cols-[2fr_1fr]`** — they failed to render reliably here; the `grid-cols-3 + col-span-2` idiom is the standard.
- **Image gallery (UploadImageCard):** matches the SVG — square preview (`aspect-square`) with Browse/Replace pills, then a `flex flex-wrap gap-3` strip of **selected** thumbnails (`w-24` wrapper + `Image` sized `h-28 w-24`), each with a top-right circle-× remove button, followed by a dashed "Add image" tile (`border-dashed border-border-strong`, green `CirclePlus` + label). "Add image"/Browse append the next sample asset; × / Replace remove (no upload endpoint yet). Defaults to 2 sample images to mirror the design's populated state.
- **Two gotchas hit here (use these, not the alternatives):** small fixed thumbnails use `next/image` with explicit `width`/`height`, **not** `fill` (fill collapsed inside the fixed box). Corner badges use **positive** insets (`right-1 top-1`); the negative form (`-right-1.5`) didn't apply and fell back to top-left.
- **Product colour swatches are content, not tokens:** the actual colour is data (hex in `data/add-product.data.ts`) applied via `style={{ backgroundColor }}`. This is the one sanctioned hex path — selection chrome (`border-primary ring-primary/40`) still uses tokens. Never use hex for component chrome.
- **Card heading:** sections inside a form use `text-h4 font-semibold text-foreground` (vs `text-h2/h3` for page/section headings).
