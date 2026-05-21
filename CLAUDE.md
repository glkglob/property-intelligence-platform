# Property Intelligence Platform — Agent Instructions

## Project Context

Private beta SaaS for UK property investors. Stack: Vite 5 + React 19 + TypeScript (strict) + Tailwind v4 + Supabase. The landing page is fully implemented. The authenticated app is scaffolded but not yet wired.

## Golden Path (protect above all else)

1. Sign in / session restore → `/login`
2. Create or open project → `/properties` → `/properties/new`
3. Enter property details → `/properties/:id`
4. Run analysis → `/estimate/:propertyId`
5. Save results → persisted to Supabase `estimates` table
6. Revisit project and take a next action → `/properties/:id`

Any change that breaks or destabilises this path requires explicit justification.

## Priority Order

1. Build and deploy blockers
2. Auth or session failures
3. Data loss or failed saves
4. Broken golden-path workflows
5. Analytics and observability gaps
6. UX clarity issues
7. Nice-to-have polish

Do not work on lower-priority items while higher-priority ones remain unresolved.

## Current State (scaffolding baseline)

| Item | Status |
|---|---|
| Landing page | ✅ Fully implemented |
| TypeScript types (`src/types/`) | ✅ Defined |
| Supabase schema (`docs/SUPABASE_SCHEMA.sql`) | ✅ Documented |
| Analytics stub (`src/lib/analytics.ts`) | ✅ Placeholder wired |
| Routing (`src/routes/AppRoutes.tsx`) | ❌ Only renders `<LandingPage />` |
| Auth (`src/lib/auth.ts`) | ❌ All functions throw |
| Supabase client (`src/lib/supabaseClient.ts`) | ❌ Commented out, exports null |
| `ProtectedRoute` | ❌ Passes through without auth check |
| All pages except LandingPage | ❌ Empty placeholders |
| Hooks | ❌ None exist |

## Working Rules

- Inspect existing code, routing, data flow, Supabase usage, and build config before editing.
- Make the smallest safe change that solves the actual problem.
- Preserve the current architecture unless redesign is explicitly required.
- Keep diffs tight, reviewable, and low-risk. Avoid unrelated refactors, formatting churn, or broad renames.
- Use explicit typed interfaces. Prefer schema-aligned types from `src/types/` over ad hoc UI shapes.
- Keep business logic out of UI components. Hooks (`src/hooks/`) and lib functions (`src/lib/`) first.
- Reuse existing utilities, hooks, route patterns, styles, and conventions.

## Strict Do-Nots

- Do not invent Supabase tables, columns, or migrations beyond `docs/SUPABASE_SCHEMA.sql`.
- Do not fake production-ready behavior (no mock auth that silently pretends to be real).
- Do not create dead-end UI or link users into non-functional flows.
- Do not expose unfinished routes without gating (feature flag, auth guard, or "coming soon").
- Do not weaken auth, RLS, or tenant isolation.
- Do not hardcode secrets, API keys, tokens, or service-role credentials.
- Do not move sensitive logic into the browser if it belongs on the server.
- Do not patch schema drift in UI code — identify the exact migration gap.
- Do not add large new frameworks for a single task.
- Do not casually expand product scope.

## Beta Product Rules

- Prefer feature flags, gated visibility, or "coming soon" states for unfinished functionality.
- Hide unstable features rather than exposing misleading placeholders.
- The landing page must not route users into a known broken flow.
- One deployed codebase; control visibility safely.

## Tech Stack Constraints

**Vite + React 19 + TypeScript (strict):**
- Keep the app buildable at every step.
- Explicit loading, empty, error, and success states for all async operations.
- Validate all forms. Handle async cleanup with `AbortController` or effect cleanup.
- No class components. Use hooks.

**Tailwind v4:**
- Dark theme: `bg-slate-950` primary background, `text-white`, `border-white/10` borders.
- Accent: `emerald-400` for primary action buttons and highlights.
- Use utility classes directly. No new CSS files unless required.

**Supabase:**
- Required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Fail clearly at startup if env vars are missing — never export a null client.
- Validate all writes. Handle `{ data, error }` tuples explicitly.
- Preserve RLS and tenant isolation.
- A placeholder client must not pretend to save data.

**Analytics (`src/lib/analytics.ts`):**
- Call `trackEvent()` at key golden-path moments.
- Required events: `signup_viewed`, `session_restore`, `property_created`, `estimate_started`, `estimate_completed`, `save_failed`.
- The no-op stub is safe in dev — wire a real provider (PostHog/Sentry) before public launch.

## Supabase Schema Reference

See `docs/SUPABASE_SCHEMA.sql` for full DDL. Tables:

- `properties(id uuid, address, postcode, type, bedrooms, created_at)`
- `estimates(id uuid, property_id FK, description, refurb_budget, gdv, total_cost, max_purchase_price, projected_profit, created_at)`
- `deals(id uuid, property_id FK, estimate_id FK, score, recommendation ['proceed'|'review'|'reject'], notes, created_at)`

Do not add columns or tables without a documented migration.

## File Conventions

```
src/
  components/   # Reusable UI — PascalCase .tsx
  pages/        # Route-level components — PascalCase .tsx
  lib/          # Business logic, Supabase client, utilities
  hooks/        # Custom React hooks — useXxx.ts
  types/        # TypeScript interfaces — schema-aligned
  routes/       # React Router config
api/            # Serverless functions — placeholder, not deployed
docs/           # Schema, deployment, product docs
```

Hooks go in `src/hooks/`, not inline in page components.

## Response Format for Non-Trivial Tasks

1. **Understanding** — what is the actual problem
2. **Approach** — smallest safe change, trade-offs noted
3. **Code changes** — tight, reviewable diff
4. **Tests / validation** — happy path + edge cases + error states
5. **Caveats** — remaining risks, required migrations, env changes

## Definition of Done

A task is done only when:
- The requested change is implemented cleanly
- Affected golden-path flows are validated
- No auth, save, typing, routing, or build regressions introduced
- Errors are handled clearly
- Unfinished features are gated honestly
- Any migrations or env changes are explicitly documented
- Response covers what changed, why, how it was validated, and remaining risks
