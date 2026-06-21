# Architecture

Homerio is a **monorepo** with a Next.js frontend and a NestJS backend in one repository.
The frontend renders the storefront/account/admin UI and calls the backend over REST; the
backend owns all persistence and business logic (catalog, cart, orders, auth) on PostgreSQL
via Prisma.

```
Homerio/
├── frontend/        → Next.js 16 (App Router) + Tailwind v4 + shadcn/ui
└── backend/         → NestJS REST API + Prisma + PostgreSQL
```

---

## Stack

### Frontend (`frontend/`)

| Layer        | Tool                          | Purpose                                        |
| ------------ | ----------------------------- | ---------------------------------------------- |
| Framework    | Next.js 16 (App Router)       | Routing, rendering, route groups               |
| UI runtime   | React 19                      | Component model                                |
| Language     | TypeScript (strict)           | Throughout                                     |
| Styling      | Tailwind CSS v4 + tw-animate-css | Utility styling and animation               |
| Components   | shadcn/ui (Radix + Base UI)   | Accessible UI primitives in `src/shared/components/ui` |
| Icons        | lucide-react                  | Icon set                                       |
| Charts       | recharts                      | Admin dashboard charts (area, bar) — client components; colors via `var(--token)` |
| HTTP         | axios                         | REST client to the backend (cookie auth, interceptors) |
| Forms        | React Hook Form + Zod         | Form state, validation, schemas                |
| Client state | Zustand (+ persist)           | Cart (localStorage-persisted) + auth/session state |
| Theming      | next-themes                   | Light/dark mode (class on `<html>`)            |
| AI chat UI   | (consumes backend SSE)        | Streaming shopping-assistant chat — no AI keys on the client |

### Backend (`backend/`)

| Layer        | Tool                          | Purpose                                        |
| ------------ | ----------------------------- | ---------------------------------------------- |
| Framework    | NestJS                        | Modular REST API (controllers/services/modules) |
| Language     | TypeScript (strict)           | Throughout                                     |
| ORM          | Prisma                        | Type-safe DB access + migrations               |
| Database     | PostgreSQL                    | Primary datastore                              |
| Auth         | Passport (JWT) + bcrypt       | JWT access/refresh in HTTP-only cookies, password hashing |
| Validation   | class-validator + class-transformer | DTO validation via global `ValidationPipe` |
| AI           | @anthropic-ai/sdk (Claude)    | Shopping assistant (tool use) + admin insights — server-side only |
| Config       | @nestjs/config                | Env management                                 |
| API docs     | @nestjs/swagger               | OpenAPI docs at `/api/docs` (non-production only) |

> The frontend holds **no** database access and **no** secrets beyond `NEXT_PUBLIC_API_URL`.
> The backend is the source of truth for data and authorization.

---

## Frontend Folder Structure

Feature-based. Routing lives in `src/app` (thin route entries using route groups), domain
logic lives in `src/features/*`, and cross-cutting UI/utilities live in `src/shared`.

```
frontend/
├── AGENTS.md                                → Agent guidance (Next.js 16 caveats)
├── components.json                          → shadcn/ui config
├── next.config.ts
├── context/                                 → These docs
└── src/
    ├── app/                                 → App Router. Route groups only; pages stay thin.
    │   ├── layout.tsx                        → Root layout, providers, fonts
    │   ├── globals.css                       → Tailwind entry + imports theme.css
    │   ├── (customer)/                        → Public storefront (customer-facing)
    │   │   ├── page.tsx                      → Home
    │   │   ├── products/                     → Catalog + products/[slug]
    │   │   ├── categories/[slug]/
    │   │   ├── search/
    │   │   ├── cart/
    │   │   ├── checkout/
    │   │   └── orders/[orderNumber]/
    │   ├── (auth)/                           → login / register / forgot-password / reset-password
    │   ├── (account)/account/                → overview / orders / addresses / profile / wishlist
    │   └── (admin)/admin/                     → dashboard / products / categories / orders
    │
    ├── features/                            → Domain features (components + hooks + api + schemas)
    │   ├── home/
    │   ├── catalog/                          → grid, filters, sort, pagination
    │   ├── product/                          → gallery, variant picker, specs, reviews
    │   ├── cart/
    │   ├── checkout/
    │   ├── orders/
    │   ├── account/
    │   ├── auth/
    │   └── admin/                            → products, categories, orders management
    │
    └── shared/                              → Cross-cutting, framework-agnostic
        ├── components/
        │   ├── ui/                           → shadcn/ui primitives (button, dialog, table, …)
        │   └── …                             → shared composites (navbar, footer, providers, form/)
        ├── store/                            → Zustand stores (auth.store, cart.store)
        ├── lib/
        │   ├── axios.config.ts               → shared axios instance + interceptors
        │   └── utils.ts                       → cn() + shared helpers
        ├── constants/                        → authoritative values (routes, order-status, page size)
        ├── config/                           → render-driving objects (status→icon/label maps, filter options)
        ├── hooks/
        ├── types/
        └── styles/
            └── theme.css                      → design tokens (see ui-tokens.md)
```

### Import aliases (`frontend/tsconfig.json`)

```jsonc
"@/*":          ["./src/*"]
"@app/*":       ["./src/app/*"]
"@features/*":  ["./src/features/*"]
"@shared/*":    ["./src/shared/*"]
"@components/*": ["./src/shared/components/*"]
"@lib/*":       ["./src/shared/lib/*"]
```

Use these — never deep relative imports. `cn` is imported from `@lib/utils`; the axios
instance from `@lib/axios.config`.

---

## Backend Folder Structure

NestJS, one module per domain. Prisma is exposed through a single injectable service.

```
backend/
├── prisma/
│   ├── schema.prisma                        → Data model (see below)
│   ├── migrations/
│   └── seed.ts                               → Seed categories + sample products
├── src/
│   ├── main.ts                               → Bootstrap: global ValidationPipe, cookie-parser, CORS (credentials)
│   ├── app.module.ts
│   ├── prisma/                               → PrismaModule + PrismaService
│   ├── config/                               → env schema + config module
│   ├── common/                               → guards, decorators (@CurrentUser, @Roles), filters, interceptors
│   ├── auth/                                 → controller, service, JWT strategies, DTOs, guards
│   ├── users/
│   ├── addresses/
│   ├── categories/
│   ├── products/                             → products + variants + images
│   ├── cart/
│   ├── orders/
│   ├── reviews/
│   ├── wishlist/
│   ├── assistant/                            → AI shopping assistant (Anthropic SDK, tool use, SSE stream)
│   └── admin/                                → admin ops + AI insights (Claude summary over aggregated metrics)
└── .env                                      → DATABASE_URL, JWT secrets, cookie config, ANTHROPIC_API_KEY
```

---

## Data Model (Prisma)

PostgreSQL via Prisma. Money is stored as `Decimal`. Order line items snapshot price and
labels so historical orders are stable even if a product later changes.

```prisma
enum Role          { CUSTOMER ADMIN }
enum AddressType   { SHIPPING BILLING }
enum OrderStatus   { PENDING PAID PROCESSING SHIPPED DELIVERED CANCELLED }
enum PaymentStatus { UNPAID PAID REFUNDED }

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  firstName    String
  lastName     String
  phone        String?
  role         Role      @default(CUSTOMER)
  addresses    Address[]
  orders       Order[]
  reviews      Review[]
  cart         Cart?
  wishlist     WishlistItem[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Address {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName   String
  line1      String
  line2      String?
  city       String
  state      String
  postalCode String
  country    String      @default("US")
  phone      String?
  type       AddressType @default(SHIPPING)
  isDefault  Boolean     @default(false)
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  imageUrl    String?
  parentId    String?
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  products    Product[]
  createdAt   DateTime   @default(now())
}

model Product {
  id          String           @id @default(cuid())
  name        String
  slug        String           @unique
  description String
  categoryId  String
  category    Category         @relation(fields: [categoryId], references: [id])
  brand       String?
  basePrice   Decimal          @db.Decimal(10, 2)
  isPublished Boolean          @default(false)
  isFeatured  Boolean          @default(false)
  images      ProductImage[]
  variants    ProductVariant[]
  reviews     Review[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  alt       String?
  position  Int     @default(0)
}

model ProductVariant {
  id         String      @id @default(cuid())
  productId  String
  product    Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku        String      @unique
  color      String?
  material   String?
  size       String?
  dimensions String?     // e.g. "200 × 90 × 85 cm"
  price      Decimal     @db.Decimal(10, 2)
  stock      Int         @default(0)
  cartItems  CartItem[]
  orderItems OrderItem[]
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String         @id @default(cuid())
  cartId    String
  cart      Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  quantity  Int            @default(1)
  @@unique([cartId, variantId])
}

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique          // human-friendly, e.g. HMR-100234
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)
  subtotal        Decimal       @db.Decimal(10, 2)
  shippingFee     Decimal       @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)
  shippingAddress Json          // snapshot of the address at purchase time
  items           OrderItem[]
  placedAt        DateTime      @default(now())
}

model OrderItem {
  id           String          @id @default(cuid())
  orderId      String
  order        Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variantId    String?
  variant      ProductVariant? @relation(fields: [variantId], references: [id])
  productName  String          // snapshot
  variantLabel String          // snapshot, e.g. "Charcoal / Linen"
  unitPrice    Decimal         @db.Decimal(10, 2)
  quantity     Int
  lineTotal    Decimal         @db.Decimal(10, 2)
}

model Review {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  rating    Int      // 1–5
  title     String?
  body      String
  createdAt DateTime @default(now())
  @@unique([productId, userId])
}

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  createdAt DateTime @default(now())
  @@unique([userId, productId])
}
```

---

## REST API Surface (prefix `/api`)

| Area       | Endpoints (representative) |
| ---------- | -------------------------- |
| Auth       | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /auth/me`, `POST /auth/forgot-password`, `POST /auth/reset-password` |
| Categories | `GET /categories`, `GET /categories/:slug`; admin `POST/PATCH/DELETE /categories` |
| Products   | `GET /products` (filter/sort/paginate), `GET /products/:slug`; admin `POST/PATCH/DELETE /products`, variant + image sub-routes |
| Cart       | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`, `POST /cart/merge` |
| Orders     | `POST /orders` (checkout), `GET /orders` (mine), `GET /orders/:orderNumber`; admin `GET /admin/orders`, `PATCH /admin/orders/:id/status` |
| Reviews    | `GET /products/:id/reviews`, `POST /products/:id/reviews` |
| Wishlist   | `GET /wishlist`, `POST /wishlist/:productId`, `DELETE /wishlist/:productId` |
| Addresses  | `GET/POST/PATCH/DELETE /addresses` |
| Assistant  | `POST /assistant/chat` (SSE stream) — AI shopping assistant with tools (`search_products`, `get_order_status`) |
| Admin AI   | `GET /admin/insights` (admin) — Claude summary over aggregated sales/inventory metrics |

Responses use a consistent envelope `{ success, message, data }` (`ApiResponse<T>`).

---

## Data Flow

### Reads

```
Component (server or client)
        ↓
Feature service in features/<name>/api/*.service.ts
        ↓
axiosInstance.get(...)  →  request carries auth cookies (withCredentials)
        ↓
NestJS controller → service → PrismaService → PostgreSQL
        ↓
{ success, message, data } → component renders
```

### Writes

```
User action → React Hook Form + Zod validate (client)
        ↓
Feature service axiosInstance.post/patch/delete(...)
        ↓
NestJS controller (DTO validated by global ValidationPipe) → service → Prisma
        ↓
sonner/toast feedback + refetch / router refresh
```

### AI shopping assistant (tool use)

```
Chat message (client)  →  POST /api/assistant/chat (SSE)
        ↓
NestJS assistant module → Anthropic SDK (Claude) with tools
        ↓
Claude calls search_products / get_order_status (tool runner)
        ↓
tools run via the products/orders services, scoped to the authenticated user → results fed back
        ↓
Claude streams the answer → SSE → chat UI renders tokens live
```

The `ANTHROPIC_API_KEY` never leaves the backend. **Admin insights** are the same idea
without streaming: aggregate metrics with Prisma → one Claude call → structured summary
cached for the dashboard.

---

## Authentication & Authorization

- **Backend issues JWTs as HTTP-only cookies:** a short-lived `access_token` and a
  long-lived `refresh_token`. Passwords are hashed with bcrypt.
- **Transport:** axios is configured with `withCredentials: true`; the browser sends cookies
  automatically. Tokens are never read from JS.
- **NestJS guards:** a global `JwtAuthGuard` (reading the token from the cookie via a
  Passport strategy) protects authenticated routes; a `@Public()` decorator opts routes out.
  A `RolesGuard` + `@Roles(Role.ADMIN)` gate admin routes.
- **Silent refresh:** the frontend axios response interceptor catches a `401`, calls
  `POST /api/auth/refresh` once (single-flight, queuing concurrent 401s), replays the
  original request on success, and redirects to `/login` on failure.
- **Frontend gating is UX only** — the backend is the source of truth for authorization.
  Client route protection (e.g. account/admin) optimistically checks the session from the
  Zustand auth store and redirects when missing.

---

## Invariants

Rules the AI agent must never violate:

- The frontend never accesses a database and holds no secrets beyond `NEXT_PUBLIC_API_URL`.
  All persistence and business rules live in the NestJS backend.
- `frontend/src/app/*` holds route entries only — compose feature components; no business
  logic, no direct axios calls in pages.
- All authenticated frontend requests go through the shared `axiosInstance` — never a bare
  `fetch`/`axios` (except the refresh call, which must not recurse through the interceptor).
- A feature never imports another feature's internals; cross-cutting code lives in
  `src/shared`. `shared` never imports from `features`/`app`.
- Every NestJS endpoint validates input with a DTO (`class-validator`); the global
  `ValidationPipe` runs with `whitelist: true`.
- All Prisma access goes through `PrismaService` — never instantiate `PrismaClient` ad hoc.
- Money is `Decimal`; order line items snapshot price + labels at purchase time — never
  recompute a historical order from current product data.
- Auth tokens are HTTP-only cookies — never read or store tokens in JS/localStorage.
- Admin-only operations are guarded server-side with `@Roles(Role.ADMIN)`; client gating is
  never sufficient on its own.
- All AI runs server-side: `ANTHROPIC_API_KEY` is backend-only and never `NEXT_PUBLIC_`. AI
  tools are backed by existing services and scoped to the authenticated user — the model
  never receives or chooses a `userId`. The store must work if the AI is unavailable.
- No payment gateway — checkout creates `PENDING`/`UNPAID` orders fulfilled manually. Do not
  add Stripe or any payment SDK.
- No hardcoded hex values or raw Tailwind color classes in components — use the design
  tokens (see ui-tokens.md).
