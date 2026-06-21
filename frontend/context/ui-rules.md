# UI Rules

How Homerio's UI should look, behave, and read. Pairs with ui-tokens.md (colors/typography)
and ui-registry.md (built components). Keep the storefront, account, and admin visually
consistent — shared tokens and primitives, one set of conventions.

---

## Layout

- **Storefront** content sits in a centered container (max ~1280–1440px) with comfortable
  horizontal padding; sections are generously spaced (furniture shopping is visual — let
  images breathe).
- **Top navbar** on all storefront/account pages: logo, category menu, search, cart (with
  live item-count badge), account. Sticky on scroll.
- **Footer** with shop links, support, and legal.
- **Admin** uses a persistent left **sidebar** (`--sidebar-*` tokens) + a top bar; content
  area is a padded surface.
- Build mobile-first; the navbar collapses to a menu/drawer, the catalog filters move into a
  sheet, and grids reflow to fewer columns.

---

## Cards & Surfaces

- Product cards and content panels use `bg-card` with `border border-border` and a `rounded-lg`
  radius (from `--radius`); add a subtle shadow for raised elements.
- Page background is `bg-background`; raised/muted panels use `bg-surface-raised` / `bg-muted`.
- Product imagery is the hero of a card — keep card chrome quiet so photos carry the design.

---

## Components (use shadcn primitives)

- Build on the primitives in `src/shared/components/ui` (button, card, input, select, dialog,
  sheet, table, pagination, tooltip, …). Don't hand-roll equivalents.
- Promote a feature component to `shared/components` only once a second feature needs it.
- Buttons: `primary` for the main action (add to cart, place order, save), a quiet/outline
  variant for secondary actions, ghost for tertiary. One primary action per view.
- Forms use the shared form-field components (label + control + error), driven by RHF + Zod.

---

## Color & Type Usage

- Follow ui-tokens.md. Brand actions and active states use `primary` (ocean-green); `secondary`
  (cyprus) for complementary emphasis. Feedback uses `success`/`warning`/`danger`/`info`.
- Use the typography scale (`text-h1`…`text-h6`, `text-body-*`, `text-label-*`) rather than
  arbitrary sizes. Headings establish hierarchy; body text stays at `text-body-base`.
- Never hardcode hex or use raw Tailwind color classes.

---

## Commerce-specific patterns

- **Price** is prominent on cards and product detail; show a struck-through compare-at price
  only when a real sale price exists.
- **Stock state** is explicit: "In stock", "Only N left" (warning tone), "Out of stock"
  (disabled add-to-cart).
- **Variant selection** (colour/material/size) uses clearly labeled, keyboard-accessible
  controls; selecting a variant updates price, stock, and the active image.
- **Cart feedback** is immediate: adding to cart updates the navbar badge and confirms via a
  toast or mini-cart — never a silent action.
- **Ratings** use filled/empty stars plus the numeric average and review count.

---

## AI shopping assistant (chat)

- A persistent entry point (floating button or navbar action) opens a chat panel/drawer.
- **Stream responses** — render tokens as they arrive (the backend streams over SSE); show a typing indicator while waiting, never a frozen spinner for the whole reply.
- When the assistant returns products, render them as **the same `ProductCard`/result components** used elsewhere and link into product pages — don't invent a chat-only product layout.
- Keep it scoped and honest: order lookups only work when signed in (prompt to log in otherwise); if the AI is unavailable, the panel shows a friendly fallback and the rest of the store keeps working.
- No API keys or model calls on the client — the panel talks only to our `/assistant/chat` endpoint.

The **admin AI insights** render as cards on the dashboard (trend, low-stock alert, action item), each with a short Claude-written summary; show an empty/fallback state when no insights are available.

---

## Dark mode

- Light/dark is driven by `next-themes` (class on `<html>`); every surface must use the semantic tokens so it adapts automatically — never hardcode a light-only colour.
- Provide a visible theme toggle (navbar/account). Verify product imagery, badges, and the AI chat panel read well in both modes.

---

## States (never skip these)

- **Empty states** for every list (empty cart, no orders, no wishlist, no search results):
  short guiding text + a CTA back into the catalog.
- **Loading**: skeletons for grids/detail, disabled buttons with a spinner for submits.
- **Error**: human-readable message + a retry where it makes sense; never a raw error string.

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
- ✅ Add to cart · Place order · Save address · Track order

### 3. Keep labels short

Form labels are concise.

- ❌ "Please enter your full legal name"
- ✅ "Full name"

### 4. Error messages explain the problem

Tell the user **what went wrong** and **how to fix it**.

- ❌ "Invalid input"
- ✅ "Enter a valid email address." · "Password must contain at least 8 characters."

### 5. Empty states guide the user

- ❌ "No data found."
- ✅ "Your cart is empty. Browse the catalog to get started." · "No orders yet. Place your first order to see it here."

### 6. Success messages confirm completion

- ❌ "Success!"
- ✅ "Changes saved successfully" · "Order placed"

### 7. Avoid unnecessary punctuation

No trailing periods in short UI text (buttons, labels, toasts). Periods are fine for longer
sentences in descriptions/body copy.

- ✅ Button: "Save changes" / ❌ "Save changes."
- ✅ Toast: "Profile updated successfully" / ❌ "Profile updated successfully."

**Never use a long hyphen (em dash `—` or en dash `–`) in UI content.** Use a comma, or
rewrite as a separate sentence.

- ❌ "Free delivery on every order — no minimum."
- ✅ "Free delivery on every order, no minimum."

### 8. Maintain consistency

Pick one term and use it everywhere — don't mix "Sign in / Sign out" with "Login / Logout".

### 9. Use sentence case

Sentence case for UI text (the modern default, used by Google/Microsoft).

- ✅ "Create account" · "Forgot password?" · "Update profile"
- ❌ "Create Account" · "Forgot Password?"

### 10. Reduce cognitive load

Don't make users read more than necessary; write a single, refined thought.

- ❌ "Everything you need to furnish every room, crafted with care and delivered to your door. Free shipping included."
- ✅ "Quality furniture for every room, delivered free."

---

## Do Nots

- **Never use a long hyphen (em dash `—` or en dash `–`) in UI content** (labels, buttons, toasts, headings, body copy). Use a comma, or rewrite as a separate sentence.
- Never use raw Tailwind color classes (`bg-emerald-700`, `text-gray-600`) — use tokens only.
- Never define colors in a config file — tokens live in `theme.css` (`@theme`).
- Never ship a list/detail view without empty, loading, and error states.
- Never make "add to cart" a silent action — always confirm.
- Never show a raw error message to users.
- Never put business logic in a `page.tsx` — compose feature components.
