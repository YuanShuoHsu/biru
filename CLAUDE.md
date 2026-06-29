# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format all files with Prettier
pnpm format:check # Check formatting without writing changes
```

No test suite is currently configured.

## Environment Variables

Copy and configure `.env` with:

- `NEXT_PUBLIC_NEXT_URL` – Frontend base URL (e.g. `http://localhost:3000`)
- `NEXT_PUBLIC_NEST_URL` – NestJS backend URL (e.g. `http://localhost:3001`)
- `NEXT_PUBLIC_MAINTENANCE` – Maintenance mode flag

All `/api/*` requests are rewritten to `NEXT_PUBLIC_NEST_URL/api/*` via `next.config.ts`.

## Architecture

### Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict mode)
- **Material UI v7** with Emotion for styling; **Tailwind CSS v4** for utilities
- **Zustand v5** for global state, **SWR v2** for data fetching
- **next-intl v4** for i18n (5 locales: `zh-TW` default, `en`, `ja`, `ko`, `zh-CN`)
- **React Hook Form** + **Zod v4** for forms and validation
- **better-auth** for authentication
- **Socket.io** client for real-time updates
- **pnpm** as the package manager

### Routing Structure

All pages live under `app/[locale]/`. Two nested route groups wrap all user-facing pages:

- `(app)` — adds the AppBar, TemporaryDrawer, and global dialogs
- `(dashboard)` — adds **parallel routes** (`@breadcrumb`, `@subheader`, `@toolbar`) rendered as named slots in the dashboard layout

The order flow path:

```
app/[locale]/(app)/(dashboard)/order/[mode]/[organizationSlug]/(stepper)/
```

Route parameter types are defined in `types/routeParams.ts` (`locale`, `mode`, `organizationSlug`). The `(stepper)` directory is a route group for shared layout without URL impact.

**When adding a new route inside `(dashboard)`**, you must also add the corresponding slot pages in all three parallel route directories (`@breadcrumb`, `@subheader`, `@toolbar`) — or a `default.tsx` fallback if the slot is unused for that route.

**Page file convention** used throughout the app:

- `page.tsx` — thin Next.js page that passes params/data to the content component
- `index.tsx` — actual page content component
- `definitions.ts` — Zod schema + inferred form type (only in form pages)

### State Management Pattern

Zustand uses a **vanilla store + Context provider** pattern to support SSR:

1. Stores are created in `stores/` as factory functions accepting initial state (e.g. `createCartStore(initialState)`)
2. Providers in `providers/` create each store instance and expose it via Context
3. Components access stores via custom hooks (e.g. `useCartStore`, `useAuthStore`)
4. Cart store uses `persist` middleware to sync with `localStorage`

All providers are composed in `components/AppProviders` — mounted at the root `app/[locale]/layout.tsx`.

### i18n Pattern

- Locale is the first URL segment: `/{locale}/path`
- Translation files: `messages/{locale}/*.json`, aggregated in `messages/index.ts`
- Use `i18n/navigation.ts` (wraps next-intl) for locale-aware `Link`, `useRouter`, `usePathname`
- Multi-locale data structures use `Record<Locale, string>` for translated content
- Server-side config: `i18n/request.ts`; locale routing config: `i18n/routing.ts`

### Data Fetching

- SWR with a custom `fetcher` in `utils/fetcher.ts` handles both JSON and text responses
- Server components prefetch data (e.g. store/menu data in layouts) and pass as SWR `fallback`
- `providers/SWRProvider.tsx` configures global SWR options and error handling via notistack

### Authentication

- `lib/auth-client.ts` configures the better-auth client with custom user fields: `firstName`, `lastName`, `lang` (locale), `emailSubscribed`, `role`
- Auth state is initialized server-side via `AuthStoreProvider` with `initialSession`
- Session stored in cookie `better-auth.session_token` (managed by better-auth)
- Middleware lives in `proxy.ts` as named exports (`proxy` function + `config`); handles i18n routing, maintenance mode redirect, and auth guard for `/auth/settings` routes
- `hooks/useAuth.ts` composes auth-related navigation menu items

### Key Utility Locations

| Concern             | Location                                                            |
| ------------------- | ------------------------------------------------------------------- |
| URL/path generation | `utils/href.ts`, `hooks/useHref.ts`                                 |
| Menu data helpers   | `utils/menus.ts` (item lookup, stock calc)                          |
| Auth utilities      | `utils/auth.ts`                                                     |
| Error extraction    | `utils/errors.ts`                                                   |
| Country data        | `utils/countries.ts`, `constants/countries.ts`                      |
| SSR detection       | `utils/useSsr.ts`                                                   |
| Backend API types   | `types/api.ts` (auto-generated by openapi-typescript — do not edit) |

### Component Conventions

- Each component lives in its own directory with an `index.tsx` entry
- MUI components are used for all UI elements; Tailwind only for layout utilities
- Forms follow the pattern: React Hook Form controller → Zod schema → MUI input with react-imask for formatted fields
- Phone validation uses `libphonenumber-js`
- Snackbar/toast notifications use `notistack` via the SWRProvider error handler

## biru-admin Sync

Mirror repo (admin panel): `/Users/yuanshuohsu/Desktop/biru-admin`. After completing any file changes, always sync to biru-admin before considering the task done.

For each changed file, read both versions and decide:

1. **Superset files** (admin has extra content — transplant only the changed hunks, never overwrite the whole file):
   `utils/menus.ts`, `CustomerPaymentForm`, `messages/*/common.json`, `types/api.ts`

2. **All other mirrored files** — if biru-admin has the same path, check whether its content differs only because it's an older version of biru (safe to `cp`) or because it has intentional admin-specific differences (transplant hunks only).

3. **Renamed or deleted files** — apply the same operation in biru-admin (rename directory, delete file).

When unsure whether a difference is intentional, read the biru-admin file first before deciding.

## Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
