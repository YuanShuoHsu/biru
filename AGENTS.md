# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format all files with Prettier
pnpm format:check # Check formatting without writing changes
pnpm codegen      # Regenerate types/api.ts from NestJS OpenAPI spec (requires biru-api running on :3001)
```

No test suite is currently configured.

The pre-commit hook (Husky + lint-staged) runs `pnpm format`, `pnpm lint`, and `prettier --write` on staged files. Do not bypass with `--no-verify`.

## Environment Variables

Copy and configure `.env` with:

- `NEXT_PUBLIC_NEXT_URL` – Frontend base URL (e.g. `http://localhost:3000`)
- `NEXT_PUBLIC_NEST_URL` – NestJS backend URL (e.g. `http://localhost:3001`)
- `NEXT_PUBLIC_MAINTENANCE` – Maintenance mode flag
- `NEXT_PUBLIC_ADMIN_URL` – biru-admin URL (redirect target after accepting an organization invitation)

All `/api/*` requests are rewritten to `NEXT_PUBLIC_NEST_URL/api/*` via `next.config.ts`.

## Architecture

### Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict mode)
- **Material UI v9** with Emotion for styling; **Tailwind CSS v4** for utilities
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
- Pages whose data only changes on navigation use SSR props directly, without SWR; SWR (with server-prefetched `fallback`) is only for pages that stay open waiting for live updates
- `providers/SWRProvider.tsx` configures global SWR options and error handling via notistack

### Authentication

- `lib/auth-client.ts` configures the better-auth client and its custom user fields
- Auth state is initialized server-side via `AuthStoreProvider` with `initialSession`
- Middleware lives in `proxy.ts` as named exports (`proxy` function + `config`); handles i18n routing, maintenance mode redirect, and auth guard for the member account pages (`/auth/{coupons,orders,points,settings}`)

### Key Utility Locations

| Concern                | Location                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| URL/path generation    | `utils/href.ts`, `hooks/useHref.ts`                                                       |
| Menu data helpers      | `utils/menus.ts` (item lookup, stock calc)                                                |
| Money formatting       | `hooks/useFormatMoney.ts` (the only formatter — don't add a util or call `Intl` directly) |
| Order mode + table     | `hooks/useOrderModeLabel.ts` (single combined label)                                      |
| Order QR session       | `utils/orderQrSession.ts` (server-only, cached per request)                               |
| Auth utilities         | `utils/auth.ts`                                                                           |
| Error extraction       | `utils/errors.ts`                                                                         |
| Country data           | `utils/countries.ts`, `constants/countries.ts`                                            |
| Client-only UI toggles | `utils/useSsr.ts` (theme switcher only — never use it to blank out content for hydration) |
| Backend API types      | `types/api.ts` (auto-generated by openapi-typescript — do not edit)                       |

### Component Conventions

- Each component lives in its own directory with an `index.tsx` entry
- MUI components are used for all UI elements, styled with `styled()` (no `sx`); Tailwind is only used in the root layout
- Forms follow the pattern: Zod schema → React Hook Form (`register`, or `useWatch` + `setValue` + `formState.errors` for non-native inputs; avoid `Controller`) → MUI input, with `components/TextMaskCustom` (react-imask) for formatted fields
- Phone validation uses `libphonenumber-js`
- Snackbar/toast notifications use `notistack` (`useSnackbar`); SWR errors are already toasted globally by `SWRProvider`

## biru-admin Sync

Mirror repo (admin panel): `/Users/yuanshuohsu/Desktop/biru-admin`. After completing any file changes, always sync to biru-admin before considering the task done.

Only files both repos use are mirrored: a file only one repo uses is not created in the other, and a changed file with no copy in the mirror needs no sync unless the task makes the mirror use it.

For each changed file, read both versions and decide:

1. **Superset files** (admin has extra content — transplant only the changed hunks, never overwrite the whole file):
   `utils/menus.ts`, `CustomerPaymentForm`, `messages/*/common.json`, `types/api.ts`

2. **All other mirrored files** — if biru-admin has the same path, check whether its content differs only because it's an older version of biru (safe to `cp`) or because it has intentional admin-specific differences (transplant hunks only).

3. **Same path, different file** — `utils/orders.ts`, `utils/banners.ts`, `utils/openingHours.ts`, `utils/storePhotos.ts`, `types/banners.ts`, `types/storePhotos.ts` are separate admin implementations; merge only the relevant change by hand, never `cp`.

4. **Renamed or deleted files** — apply the same operation in biru-admin (rename directory, delete file).

When unsure whether a difference is intentional, read the biru-admin file first before deciding.

## Code Comments

**Default: no comment.** Write one only when its absence would cause a mistake — it states a consequence or precondition that lives outside the code:

- `// 店家角色尚未選到店家時不打 API，否則會落到平台管理員專用端點` (would 403)
- `// palette 色位名不能含小寫 "mode"，否則 MUI 產不出 CSS 變數` (framework trap)

The test: delete it. Would a competent editor now make a wrong change? If the honest answer is only "會比較難懂", leave it deleted.

**Official documentation links are wanted.** When code follows a specific page of the official docs — a library (Next.js, MUI, better-auth, Drizzle, NestJS, …), an external API spec (ECPay, data.gov.tw, …) or a regulation (law.moj.gov.tw) — put a `// https://…` link to that page above the code, or at the top of the file when the whole file follows it, pointing at the installed version when the site versions its docs. Keep existing links; when the code no longer follows the linked page, fix or delete the link in the same change. Links don't count toward the one-or-two-comments signal below.

Never write:

- a restatement of the next line, or of a field/constant name (`// 取得目前語系` on `useLocale()`)
- the reasoning from our conversation, or a defence of your own tradeoff
- JSDoc on a private helper
- a description of what the code currently does — it becomes a lie after the next change

**Adding more than one or two comments to a change is itself the signal** that the code isn't saying enough. Fix the naming or the structure instead; do not narrate.

**Never reintroduce a removed comment.** Even when a comment would pass the test above, if the user has said they do not want one there, or the comment was deleted before, a later change must not add it back — the user's decision outranks this rule. If you have something to say about it, say it in your reply, not in the code.

When a change makes an existing comment false, fix or delete it in the same change — a stale comment is worse than none. Don't hardcode identifiers into comments; they rot into misinformation after a rename.

## Implementation Approach

**Default: act, don't ask.** Ask only when the answer changes the data model, an API contract, or requires an irreversible or outward-facing action (shared-DB migration, deploy, push). For every other ambiguity, decide and proceed, then list the assumptions you made in the reply so the user can correct them afterward. This overrides "If uncertain, ask" in the vendored guidelines below.

Decide in this order:

1. **Official docs for the installed version** — check the version in `package.json` / `node_modules` first, never rely on memory. Next.js (`node_modules/next/dist/docs/`, next-devtools MCP), MUI (mui-mcp), better-auth, Drizzle, NestJS, next-intl, SWR, Zod, etc. Use the documented pattern over a workaround; never use APIs the docs mark deprecated.
2. **The existing pattern in this repo** — when the docs leave room, match how the codebase already does it.
3. **The most mainstream option** — when neither settles it.

## Behavioral Guidelines

Vendored from <https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md> (headings demoted one level). Don't add rules here — put project rules in the sections above, so this stays diffable against upstream.

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

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
