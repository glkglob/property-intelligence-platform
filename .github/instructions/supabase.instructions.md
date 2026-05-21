---
applyTo: "src/lib/supabase*.ts,src/lib/auth.ts,src/lib/estimate.ts,src/hooks/useAuth*.ts,src/hooks/useEstimate*.ts,src/hooks/useProperties*.ts,api/**,**/*.sql"
---

# Supabase Development Instructions

## Client Initialization

The Supabase client lives at `src/lib/supabaseClient.ts`. It requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Fail fast with a clear thrown error if either is missing. Never export a `null` client that silently swallows operations.

```typescript
// Required guard at top of supabaseClient.ts
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase env vars. Copy .env.example to .env and fill values.');
}
```

## Schema Alignment

All Supabase operations must align with `docs/SUPABASE_SCHEMA.sql`. Do not reference columns or tables that do not exist there.

| Table | Columns |
|---|---|
| `properties` | id, address, postcode, type, bedrooms, created_at |
| `estimates` | id, property_id (FK), description, refurb_budget, gdv, total_cost, max_purchase_price, projected_profit, created_at |
| `deals` | id, property_id (FK), estimate_id (FK), score, recommendation, notes, created_at |

If a feature requires a new column or table, document the exact migration SQL and surface it as a deployment dependency — do not patch the UI to work around missing schema.

## Auth Rules

- Session restore: `supabase.auth.getSession()` on app load.
- Reactive session tracking: `supabase.auth.onAuthStateChange()` in auth context.
- Never store tokens manually in localStorage or cookies — Supabase manages this.
- `ProtectedRoute` must redirect to `/login` when session is `null`. It must not pass through unauthenticated users.
- After sign-in, redirect to `/properties`.
- After sign-out, redirect to `/` (landing page).

## Data Operation Contract

Every Supabase call returns `{ data, error }`. Always handle both:

```typescript
const { data, error } = await supabase.from('properties').insert(payload).select().single();
if (error) throw error; // or surface in UI state
```

- Validate inputs before writing. Use types from `src/types/`.
- Never silently swallow errors.
- Surface loading, success, and error states in the calling component or hook.

## RLS Awareness

- Do not use the `service_role` key in any frontend code.
- If data is not returned, check RLS policies first — do not work around missing policies in the UI.
- All queries are implicitly scoped to the authenticated user by RLS. Do not add manual user-id filters as a substitute for proper policies.

## Hook Patterns

Encapsulate Supabase calls in `src/hooks/`. Page components should not call Supabase directly.

```typescript
// Pattern: src/hooks/useProperties.ts
export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ...fetch logic
  return { properties, loading, error };
}
```
