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

All pages live under `app/[locale]/`. The order flow uses deeply nested dynamic segments:

```
app/[locale]/order/[mode]/[storeSlug]/[tableNumber]/[partySize]/(stepper)/
```

Route parameter types are defined in `types/routeParams.ts`. The `(stepper)` directory is a route group (parentheses) for shared layout without URL impact.

### State Management Pattern

Zustand uses a **vanilla store + Context provider** pattern to support SSR:

1. Stores are created in `stores/` as factory functions accepting initial state (e.g. `createCartStore(initialState)`)
2. Providers in `providers/` create each store instance and expose it via Context
3. Components access stores via custom hooks (e.g. `useCartStore`, `useAuthStore`)
4. Cart store uses `persist` middleware to sync with `localStorage`

All providers are composed in `app/[locale]/providers/` — server providers (`index.tsx`) wrap client providers (`client.tsx`).

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
- Auth state is initialized via `hooks/useAuthInitializer.ts` on client mount
- Access token stored in cookie `biru-auth`
- `hooks/useAuth.ts` composes auth-related navigation menu items

### Key Utility Locations

| Concern | Location |
|---|---|
| URL/path generation | `utils/href.ts`, `hooks/useHref.ts`, `hooks/useOrderPaths.ts` |
| Menu data helpers | `utils/menu.ts` (item lookup, stock calc) |
| Auth utilities | `utils/auth.ts` |
| Error extraction | `utils/errors.ts` |
| Country data | `utils/countries.ts`, `constants/countries.ts` |
| SSR store hydration | `utils/stores.ts` |

### Component Conventions

- Each component lives in its own directory with an `index.tsx` entry
- MUI components are used for all UI elements; Tailwind only for layout utilities
- Forms follow the pattern: React Hook Form controller → Zod schema → MUI input with react-imask for formatted fields
- Phone validation uses `libphonenumber-js`
- Snackbar/toast notifications use `notistack` via the SWRProvider error handler
