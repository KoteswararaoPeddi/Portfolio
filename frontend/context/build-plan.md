# Build Plan

A from-scratch plan for Homerio (furniture e-commerce monorepo: Next.js frontend + NestJS/
Prisma/PostgreSQL backend). **Nothing here is built yet** — every item is unchecked. Mark
items `[x]` as they land and keep progress-tracker.md in sync.

## Core Principle

UI is built with mock data first and verified visually, then wired to the backend. Backend
endpoints are built per domain and verified (seed data + a quick client call) before the UI
depends on them. Every feature must be visible and testable before moving on. No invisible
phases.

---

## Phase 0 — Monorepo Foundation

- [ ] Repo layout: `frontend/` (Next.js 16 + React 19 + TS strict) and `backend/` (NestJS + TS strict)
- [ ] Frontend: Tailwind v4 + tw-animate-css pipeline; `theme.css` tokens wired into `globals.css`
- [ ] Frontend: shadcn/ui initialized (`components.json`), base primitives in `src/shared/components/ui`
- [ ] Frontend: `next-themes` ThemeProvider on `<html>` for light/dark mode (+ a theme toggle)
- [~] Frontend: route-group skeleton — `(shop)` done (layout + home); `(auth)`, `(account)`, `(admin)` pending
- [ ] Frontend: shared axios instance (`@lib/axios.config`) with `withCredentials` + interceptors
- [x] Backend: NestJS app with global `ValidationPipe` (whitelist+transform), `cookie-parser`, CORS (credentials), `api` prefix, `@nestjs/config` env validation, `/api/health` check
- [x] Backend: PostgreSQL (local PG 18) + Prisma; `schema.prisma` from the architecture.md data model; first migration applied (`init`)
- [x] Backend: `PrismaService` + `PrismaModule` (global); `prisma/seed.ts` run (6 categories + 4 sample products w/ variants + images)
- [~] Shared `ApiResponse<T>` envelope: backend `ResponseInterceptor` + `@ResponseMessage` + `AllExceptionsFilter` done; frontend `ApiResponse<T>` type pending

---

## Phase 1 — Authentication

- [ ] Backend `auth` module: register, login, logout, refresh, me, forgot/reset password
- [ ] bcrypt password hashing; JWT access + refresh as HTTP-only cookies
- [ ] `JwtStrategy` (cookie extractor), global `JwtAuthGuard`, `@Public()`, `RolesGuard` + `@Roles`
- [ ] Frontend auth pages: `/login`, `/register`, `/forgot-password`, `/reset-password` (RHF + Zod)
- [ ] Frontend `auth.store` (Zustand) + session bootstrap (`GET /auth/me`); silent refresh in interceptor
- [ ] Client route protection for `(account)` and `(admin)`; redirect rules

---

## Phase 2 — Catalog (Categories + Products)

- [~] Backend `categories` module: list done (`GET /categories`); remaining: by-slug (with children), admin CRUD
- [~] Backend `products` module: create done (`POST /products`, nested images + variants); remaining: list with filter (category, price, material, colour) + sort + pagination, by-slug with images/variants/category, update/delete
- [~] Admin **Add Product** page (`/admin/products/new`): built + wired to `POST /products` (RHF + zod + sonner). Remaining: real image upload (currently URL/sample-based), admin auth guard. *(Brought forward from Phase 7 at the developer's request.)*
- [~] Frontend home page UI: hero, featured categories, featured/new products, promos (mock done; backend wiring pending)
- [ ] Frontend catalog page: product grid, filter sidebar, sort dropdown, pagination
- [ ] Frontend category landing → filtered catalog
- [x] Frontend `ProductCard` (shared composite) + reuse across home/catalog/search (built; reused in home Trending + Limited-Time-Deal)
- [ ] Search page (`/search`) over products

---

## Phase 3 — Product Detail

- [ ] Frontend product detail page: image gallery + lightbox
- [ ] Variant picker (colour/material/size) → updates price, stock state, active image
- [ ] Specs, description, availability messaging
- [ ] Add to cart (quantity) + add to wishlist
- [ ] Reviews: backend `reviews` (list + create, one per user per product); frontend list + form (auth-gated)

---

## Phase 4 — Cart

- [ ] Backend `cart` module: get, add item, update quantity, remove item, merge (guest → user)
- [ ] Frontend `cart.store` (Zustand + `persist`/localStorage): guest cart persistence + live item-count badge
- [ ] Cart page UI: line items, quantity edit, remove, subtotal/shipping/total
- [ ] Merge guest cart into account cart on login

---

## Phase 5 — Checkout & Orders

- [ ] Backend `orders` module: create order from cart (snapshot price/labels, compute totals, decrement stock, clear cart), list mine, get by orderNumber
- [ ] Order created as `PENDING` / `UNPAID` — no payment gateway; fulfilled manually (see project-overview.md)
- [ ] Frontend checkout: choose/enter shipping address, order summary, place order
- [ ] Order confirmation + status timeline (`/orders/[orderNumber]`)
- [ ] Backend `addresses` module + frontend address CRUD used by checkout

---

## Phase 6 — Account

- [ ] `/account` overview
- [ ] `/account/orders` — order history (from Phase 5)
- [ ] `/account/addresses` — saved addresses CRUD (default address)
- [ ] `/account/profile` — edit profile + change password
- [ ] `/account/wishlist` — backend `wishlist` module + frontend list/remove

---

## Phase 7 — Admin

- [~] `/admin` dashboard: sales summary, recent orders, low-stock (UI built from design, mock data; backend wiring pending)
- [ ] `/admin/products` — list + create/edit (variants, images, stock, publish/feature)
- [ ] `/admin/categories` — category management (tree)
- [ ] `/admin/orders` — order queue + advance status (`PENDING → … → DELIVERED`, `CANCELLED`)
- [ ] All admin routes guarded server-side with `@Roles(Role.ADMIN)`; client gating for UX

---

## Phase 8 — AI Layer (Claude)

- [ ] Backend `assistant` module: Anthropic SDK wired with `ANTHROPIC_API_KEY`; tools `search_products` and `get_order_status` backed by the products/orders services (order tool scoped to the authenticated user)
- [ ] `POST /assistant/chat` streams responses over SSE; tool-use loop via the SDK tool runner
- [ ] Frontend chat UI (`"use client"`): floating assistant, renders streamed tokens, links results to product pages
- [ ] Backend `admin/insights`: aggregate sales/inventory metrics with Prisma → one Claude call → structured insights (sales trends, low-stock alerts, action items), cached
- [ ] Admin dashboard renders the AI insight cards; graceful fallback if the AI is unavailable
- [ ] Guardrails: API key server-only, try/catch + `stop_reason` handling, store works without AI

---

## Phase 9 — Polish

- [ ] Empty states, loading skeletons, and error states across pages
- [ ] Responsive pass (mobile catalog, cart, checkout)
- [ ] Accessibility pass (focus, labels, keyboard nav for gallery/menus)
- [ ] Seed richer demo data; verify full happy-path: browse → cart → checkout → track

---

## Feature Count

| Phase                         | Status      |
| ----------------------------- | ----------- |
| 0 — Monorepo Foundation       | In progress |
| 1 — Authentication            | Not started |
| 2 — Catalog                   | In progress |
| 3 — Product Detail            | Not started |
| 4 — Cart                      | Not started |
| 5 — Checkout & Orders         | Not started |
| 6 — Account                   | Not started |
| 7 — Admin                     | Not started |
| 8 — AI Layer (Claude)         | Not started |
| 9 — Polish                    | Not started |
