# Library Docs

How Homerio uses each third-party library — the project-specific patterns and constraints,
not general API docs. Read the relevant section before implementing a feature that touches
one of these. The app is split into `frontend/` (Next.js) and `backend/` (NestJS); sections
are grouped accordingly.

Order of authority: `node_modules/next/dist/docs` (for Next.js) → this file → general knowledge.

---

# Frontend

## axios

The single most important frontend pattern. **All authenticated backend calls go through
the shared instance** — never a bare `fetch`/`axios()`.

```typescript
// shared/lib/axios.config.ts
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // backend origin + /api
  withCredentials: true,                    // auth rides on HTTP-only cookies
})
```

The response interceptor owns cross-cutting concerns:

- **401** → single-flight token refresh (`POST /auth/refresh`) + replay original request;
  on refresh failure, redirect to `/login`. Concurrent 401s queue behind one refresh
  (`isRefreshing` + `failedQueue`).
- **403** → toast "You don't have access to that."
- **5xx** → toast a generic message + console error.

**Rules:**

- Import the default export from `@lib/axios.config` in every service.
- Services return unwrapped, typed domain data (unwrap the `{ success, message, data }` envelope → `.data.data`).
- Don't re-implement 401/403/5xx per call — the interceptor owns it.
- The refresh call uses a bare `axios.post` so it can't recurse through the interceptor.

## shadcn/ui (Radix + Base UI)

UI primitives live in `src/shared/components/ui` (button, card, input, select, dialog,
table, sheet/drawer, pagination, tooltip, …), styled with `class-variance-authority` for
variants and the design tokens.

**Rules:**

- Reuse and extend primitives from `shared/components/ui` — don't pull raw Radix/Base UI into feature code.
- Add new primitives via the shadcn workflow (`components.json`); style them with tokens, never hex.
- Compose feature-specific composites (e.g. `ProductCard`, `CartDrawer`) in the feature or `shared/components`.

## Tailwind CSS v4

- Tokens are defined with `@theme` in `shared/styles/theme.css` (imported by `app/globals.css`) — **no `tailwind.config.ts`** for colors/tokens. See ui-tokens.md.
- Utilities are generated from `--color-*`, `--text-*`, `--radius` variables (e.g. `bg-primary`, `text-foreground`, `border-border`, `text-h2`).
- For conditional/merged classes use the `cn` helper from `@lib/utils`. Never concatenate class strings by hand.

## React Hook Form + Zod

Every form. The Zod schema is the single source of truth.

```typescript
const form = useForm<CheckoutValues>({
  resolver: zodResolver(checkoutSchema),
  defaultValues: DEFAULTS,
  mode: "onBlur",
})
```

- Schemas live in the feature's `schemas/`; derive types via `z.infer`.
- Validate before calling a service. Build inputs from the shared form-field components, not raw inputs.

## Zustand

Cross-cutting client state only: `auth.store` (user/role/session) and `cart.store`
(cart + live item count for the navbar badge).

- Select narrow slices: `useCartStore((s) => s.itemCount)`.
- The cart store handles guest-cart persistence and the merge-on-login flow.
- Treat `hasRole`/auth checks as **UX only** — the backend is the authorization source of truth.

## lucide-react

Icon set. Direct named imports; size via `className` (`size-4`) or the `size` prop; color
via token-backed classes, never raw hex.

---

# Backend

## NestJS

- One **module** per domain; controllers are thin, services hold logic.
- Global `ValidationPipe` (`whitelist: true, transform: true`) in `main.ts`; `cookie-parser` enabled; CORS configured with `credentials: true` and the frontend origin.
- Use Nest exceptions (`NotFoundException`, `ForbiddenException`, …); a global exception filter shapes them into `{ success, message }`.
- A global response interceptor wraps successful returns in `{ success: true, message, data }`.

```typescript
// main.ts (essentials)
app.use(cookieParser())
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
app.enableCors({ origin: process.env.CORS_ORIGIN, credentials: true })
app.setGlobalPrefix("api")
```

## Prisma

- Single injectable `PrismaService extends PrismaClient` (connects `onModuleInit`). Inject it into services; **never** `new PrismaClient()` elsewhere.
- Schema in `prisma/schema.prisma`; change it via `npx prisma migrate dev --name <change>`; commit migrations. `prisma generate` runs on install/migrate.
- Use `select`/`include` deliberately; **never select or return `passwordHash`**.
- Money columns are `Decimal` (`@db.Decimal(10,2)`); serialize to string at the API boundary.
- Seed reference data (categories + sample products) in `prisma/seed.ts`.

```typescript
// products.service.ts
const product = await this.prisma.product.findUnique({
  where: { slug },
  include: { images: true, variants: true, category: true },
})
if (!product) throw new NotFoundException("Product not found")
```

## Passport JWT + cookies

- Two tokens: short-lived `access_token`, long-lived `refresh_token`, both **HTTP-only cookies**.
- `JwtStrategy` extracts the token from the request cookie (custom extractor), validates, and returns the user payload.
- Global `JwtAuthGuard`; `@Public()` decorator opts public routes out; `@Roles(Role.ADMIN)` + `RolesGuard` for admin.
- `/auth/refresh` validates the refresh token and re-issues both cookies. `/auth/logout` clears them.

## bcrypt

- Hash passwords with a cost factor of 10–12 on register and password change.
- Compare with `bcrypt.compare` on login. Never log, return, or expose the hash.

## class-validator + class-transformer

- Every request body is a **DTO class** with validation decorators (`@IsEmail`, `@IsString`, `@Min`, `@IsEnum`, `@IsOptional`, …).
- `whitelist: true` strips unknown properties; `transform: true` coerces query params (e.g. pagination `page`/`limit`) to their typed form.

```typescript
export class CreateReviewDto {
  @IsInt() @Min(1) @Max(5) rating: number
  @IsOptional() @IsString() title?: string
  @IsString() @MinLength(1) body: string
}
```

---

## Anthropic SDK (Claude) — AI assistant + admin insights

Homerio's AI runs **server-side in NestJS** via the official Node SDK. The
`ANTHROPIC_API_KEY` lives only in `backend/.env` — it is never exposed to the browser, and
the frontend only talks to our own NestJS endpoints (`/api/assistant/*`, `/api/admin/insights`).

```bash
npm install @anthropic-ai/sdk   # in backend/
```

```typescript
import Anthropic from "@anthropic-ai/sdk"
const anthropic = new Anthropic() // reads ANTHROPIC_API_KEY from env
```

### Model selection

| Use case | Model | Why |
| --- | --- | --- |
| **Default** | `claude-opus-4-8` | Most capable; 1M context. Use unless you have a specific reason not to. |
| AI admin insights (low volume, quality matters) | `claude-opus-4-8` | Analytics summaries / recommendations benefit from the strongest model; volume is low. |
| AI shopping assistant (higher volume, tool-driven chat) | `claude-opus-4-8` default; `claude-sonnet-4-6` for high-volume/cost-sensitive production; `claude-haiku-4-5` for the cheapest/fastest path | Downgrading is a deliberate cost decision — make it explicitly, don't default to it. |

Use the **exact** model ID strings — no date suffixes. Set thinking with
`thinking: { type: "adaptive" }` and depth with `output_config: { effort: "low" | "medium" | "high" | "max" }`
(not a token budget — `budget_tokens` is removed on these models and returns 400). For a
chat assistant, `medium` is a good balance; for admin insight synthesis, `high`.

### Shopping assistant — tool use (the agentic loop)

The assistant answers in natural language and calls **our** tools to query the catalog and
orders. Tools are backed by the same NestJS services the REST API uses (so search logic isn't
duplicated). The cleanest path is the SDK's **beta tool runner**, which runs the
call → execute → feed-result loop for you:

```typescript
import Anthropic from "@anthropic-ai/sdk"
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod"
import { z } from "zod"

const searchProducts = betaZodTool({
  name: "search_products",
  description: "Search the furniture catalog. Call this whenever the shopper asks to find, " +
    "filter, or compare products by category, material, colour, or price.",
  inputSchema: z.object({
    query: z.string().optional(),
    category: z.string().optional(),
    material: z.string().optional(),
    color: z.string().optional(),
    maxPrice: z.number().optional(),
  }),
  run: async (input) => JSON.stringify(await productsService.search(input)),
})

const getOrderStatus = betaZodTool({
  name: "get_order_status",
  description: "Look up an order's status and items. Only for the signed-in user; " +
    "call when they ask about an order or delivery.",
  inputSchema: z.object({ orderNumber: z.string() }),
  // userId is bound from the authenticated request, never taken from the model
  run: async ({ orderNumber }) =>
    JSON.stringify(await ordersService.findForUser(userId, orderNumber)),
})

const message = await anthropic.beta.messages.toolRunner({
  model: "claude-opus-4-8",
  max_tokens: 16000,
  output_config: { effort: "medium" },
  system: SHOPPING_ASSISTANT_SYSTEM,
  tools: [searchProducts, getOrderStatus],
  messages: [{ role: "user", content: userMessage }],
})
```

**Rules:**

- Tool `run` handlers call existing NestJS services — never reimplement catalog/order logic in the tool.
- **Scope every order/user tool to the authenticated `userId`** from the request — never trust an ID the model supplies. The assistant only sees the current user's orders.
- Write **prescriptive tool descriptions** (say *when* to call, not just what it does) — recent Claude models reach for tools conservatively.
- If you need fine-grained control (logging, human gates), use the **manual loop** instead: call `anthropic.messages.create({ tools, ... })`, check `response.stop_reason === "tool_use"`, execute the `tool_use` blocks, append the assistant turn + a `user` turn of `tool_result` blocks (each with the matching `tool_use_id`), and repeat until `stop_reason === "end_turn"`.

### Streaming (chat UI)

For the chat experience, stream tokens to the client. In NestJS, expose an SSE endpoint and
pipe the SDK stream:

```typescript
const stream = anthropic.messages.stream({
  model: "claude-opus-4-8",
  max_tokens: 16000,
  messages,
})
for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    sse.write(event.delta.text)
  }
}
const final = await stream.finalMessage()
```

The frontend consumes the SSE stream and renders tokens as they arrive (a `"use client"` chat component).

### AI admin insights

A single, non-streaming call that summarizes aggregated metrics. Aggregate the numbers in a
NestJS service (Prisma queries — sales totals, low-stock counts, unfulfilled orders), pass
them to Claude, and return structured insights:

```typescript
const res = await anthropic.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 4000,
  output_config: { effort: "high" },
  system: ADMIN_INSIGHTS_SYSTEM, // "You are a retail analyst. Be specific and actionable."
  messages: [{ role: "user", content: JSON.stringify(metrics) }],
})
```

For machine-consumable output (cards, action items), use **structured outputs**
(`output_config.format` with a JSON schema) so the dashboard can render fields directly
rather than parsing prose. Cache the result; don't recompute per page load.

**Rules:**

- `ANTHROPIC_API_KEY` is backend-only — never `NEXT_PUBLIC_`, never sent to the client.
- Always check `response.stop_reason` before reading `content` (handle `"refusal"` / `"max_tokens"`).
- Wrap calls in try/catch; surface a friendly fallback in the UI if the AI is unavailable — the store must work without it.

---

## Payments (out of scope)

Homerio has **no payment gateway** — this is a deliberate scope decision. Checkout creates an
order with `status: PENDING` / `paymentStatus: UNPAID` and the order is fulfilled manually by
the store team. Do not add Stripe or any payment SDK. If payments are ever introduced later,
document the provider's pattern here first — no card data should ever touch this codebase.
