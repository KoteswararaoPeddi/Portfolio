# Project Overview

## About the Project

**Homerio** is a furniture store with a brain — an online store for **home furniture**
(sofas, beds, chairs, tables, storage, décor) with a **Claude-powered AI layer**. Shoppers
browse a curated catalog, filter and sort within categories, open a product to choose a
variant (colour / material / size), add it to a cart, and check out to place an order they
can then track — or just **chat with an AI shopping assistant** that finds products, checks
prices, and looks up their orders. Registered customers manage their profile, saved
addresses, wishlist, and order history. The store team gets a lightweight admin surface to
manage the catalog, inventory, and orders, plus an **AI insights dashboard** (Claude-generated
sales trends, low-stock alerts, and action items). The UI is mobile-responsive with **light/
dark mode**.

This is a **monorepo** with two apps in one repository:

- **`frontend/`** — Next.js 16 (App Router) storefront + account + admin UI, styled with
  Tailwind CSS v4 and shadcn/ui.
- **`backend/`** — NestJS REST API backed by PostgreSQL via Prisma.

The frontend talks to the backend over REST (axios, cookie-based auth). All persistence,
business rules, pricing, and order logic live in the NestJS backend; the frontend renders
and orchestrates the experience.

---

## The Problem It Solves

Buying furniture online is high-consideration: shoppers want clear photos, real
dimensions, material and colour options, honest stock and delivery expectations, and a
checkout that doesn't lose them. Homerio gives customers a fast, trustworthy storefront —
rich product detail, variant selection, a persistent cart, and transparent order tracking —
while giving the store a single place to manage products, stock, and incoming orders.

---

## Pages

### Storefront (public + customer)

```
/                        → Home: hero, featured categories, featured/new products, promos
/products                → Catalog: grid with filters (category, price, material, colour), sort, pagination
/products/[slug]         → Product detail: gallery, variants, price, stock, specs, reviews, add to cart
/categories/[slug]       → Category landing → filtered catalog
/search                  → Search results
/cart                    → Cart: line items, quantities, totals
/checkout                → Shipping address, contact, order summary, place order
/orders/[orderNumber]    → Order confirmation + tracking
```

### Account (authenticated customer)

```
/account                 → Overview
/account/orders          → Order history
/account/addresses       → Saved addresses (CRUD)
/account/profile         → Profile + change password
/account/wishlist        → Saved products
```

### Auth

```
/login                   → Email + password sign in
/register                → Create account
/forgot-password         → Request reset
/reset-password          → Set new password
```

### Admin (store team, role-gated)

```
/admin                   → Dashboard (sales, orders, low-stock)
/admin/products          → Product list + create/edit (variants, images, stock)
/admin/categories        → Category management
/admin/orders            → Order queue + status updates
```

---

## Navigation

- **Storefront:** top navbar (logo, category menu, search, cart, account) + footer. Cart
  shows a live item-count badge.
- **Account:** simple sub-navigation (overview, orders, addresses, profile, wishlist).
- **Admin:** persistent left sidebar (dashboard, products, categories, orders) + top bar.

---

## Core Customer Flow

### Discover

Home page surfaces featured categories and products. The catalog (`/products`) and category
pages render a product grid with **filters** (category, price range, material, colour),
**sort** (newest, price asc/desc, top rated), and **pagination**. Search matches product
name, description, and category.

### Product detail (`/products/[slug]`)

- Image gallery (multiple images, zoom/lightbox).
- **Variant selection** — colour / material / size; selecting a variant updates price,
  stock status, and the active image.
- Price, availability ("In stock" / "Only N left" / "Out of stock"), and delivery note.
- Specs (dimensions, material, weight, assembly), full description.
- Customer reviews (rating + text) and average rating.
- **Add to cart** (quantity selector) and **add to wishlist**.

### Cart (`/cart`)

Persistent cart (server-backed for signed-in users, local for guests; merged on login).
Line items show product, variant, unit price, quantity (editable), and line total. Shows
subtotal, estimated shipping, and total. Proceeds to checkout.

### Checkout (`/checkout`)

- Shipping address (pick a saved address or enter a new one) and contact details.
- Order summary with line items and totals.
- **Place order** — creates the order in the backend. Payment is taken as a follow-up step
  (see scope below); the order is created with a `PENDING` payment status.

### Order tracking (`/orders/[orderNumber]`)

Confirmation screen plus a status timeline (`PENDING → PAID → PROCESSING → SHIPPED →
DELIVERED`, with `CANCELLED`). Visible in account order history.

### Account & auth

Email/password registration and login; JWT issued by the backend as **HTTP-only cookies**.
Customers manage profile, addresses, wishlist, and order history.

---

## Lead Domain Model (high level)

Detailed Prisma schema lives in **architecture.md**. The core entities:

- **User** (role: `CUSTOMER` / `ADMIN`) with **Addresses**.
- **Category** (self-referential for sub-categories) → **Product**.
- **Product** → **ProductImage** and **ProductVariant** (sku, colour, material, size,
  price, stock).
- **Cart** → **CartItem** (references a variant).
- **Order** → **OrderItem** (price/labels snapshotted at purchase time).
- **Review** and **WishlistItem**.

---

## Features In Scope

- Home page: hero, featured categories, featured/new products, promo sections
- Catalog with category filter, price/material/colour filters, sort, pagination
- Product detail with image gallery, variant selection, specs, stock, reviews
- Search across products
- Cart (guest + authenticated, merged on login) with quantity edits and totals
- Checkout with saved/new shipping address and order placement
- Order confirmation and status tracking; order history
- Customer accounts: profile, change password, addresses (CRUD), wishlist
- Email/password auth with JWT HTTP-only cookies and silent refresh
- Product reviews and ratings
- **AI shopping assistant** (Claude): natural-language product search/filter, recommendations, and order lookup (signed-in), with streaming responses
- **AI admin insights** (Claude): sales trends, low-stock alerts, and actionable recommendations on the admin dashboard
- Real-time stock validation (cart and checkout reflect live inventory)
- Light/dark mode (mobile-responsive)
- Admin: product/variant/inventory management, categories, order status management
- Role-based access (customer vs admin)

---

## Features Out of Scope (initial build)

- **Payments / checkout gateway** — no Stripe, PayPal, or any payment SDK. Checkout creates a
  `PENDING` / `UNPAID` order fulfilled manually by the store team. Deliberately kept simple.
- Multi-vendor / marketplace sellers (single store only)
- Internationalization, multi-currency, tax/VAT engines
- Recommendation engine / personalization
- Returns/RMA workflow, gift cards, loyalty points
- Native mobile app
- Real-time chat / live support

---

## Target Users

- **Shoppers** — people furnishing a home who want clear product info, variant choices,
  and a smooth, trustworthy checkout.
- **Store team (admin)** — staff who manage the catalog, stock levels, and fulfil orders.

---

## Success Criteria

- A shopper can go from the home page to a placed order in a few minutes.
- Catalog filtering, sorting, and pagination return correct results quickly.
- Product detail clearly communicates variants, real dimensions, price, and stock.
- The cart survives navigation and login (guest cart merges into the account cart).
- Checkout reliably creates an order with correct totals and an address snapshot.
- Customers can track order status and review past orders.
- Admins can create/edit products with variants, images, and stock, and advance order status.
- Auth is secure (HTTP-only cookies, hashed passwords) and sessions refresh silently.
- UI is visually consistent across storefront, account, and admin (shared tokens/components).
