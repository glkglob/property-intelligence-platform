---
applyTo: "src/pages/**/*.tsx"
---

# Page Component Instructions

## Four-State Requirement

Every page that fetches data must have explicit UI for all four states. Never render a blank div or `<p>Coming soon</p>` on a live route.

| State | Component / Pattern |
|---|---|
| Loading | `<LoadingState />` from `src/components/LoadingState.tsx` |
| Empty | Explanation of what's missing + a clear CTA (e.g. "Create your first property") |
| Error | Surface the error message + retry action or back navigation |
| Success | The primary content |

## Unimplemented Pages

Pages not yet built must be one of:
- Removed from the router entirely, **or**
- Gated behind auth + a clearly labelled "coming soon" state, **or**
- Unreachable from any live navigation element

Do not link placeholder pages from the landing page, the navbar, or any working page.

## Golden Path Build Order

Implement pages in this sequence. Do not build secondary features while earlier steps are incomplete.

1. `/login` — Supabase email/password sign-in, redirect to `/properties` on success
2. `/signup` — Supabase sign-up, redirect to `/properties` on success
3. `/properties` — List user's properties fetched from Supabase, link to `/properties/new`
4. `/properties/new` — Create property form, save to `properties` table, redirect to `/properties/:id`
5. `/properties/:id` — Property detail, associated estimates, next-action CTAs
6. `/estimate/:propertyId` — Estimate form + result, save to `estimates` table

`DealCopilot` and `RefurbIQ` are secondary. Gate them with "coming soon" until the golden path is stable.

## Layout & Styling

Match the visual language of `LandingPage.tsx`:
- Page background: `bg-slate-950`
- Body text: `text-white` / `text-white/70` for secondary text
- Borders: `border-white/10`
- Primary action buttons: `bg-emerald-400 text-slate-950 hover:bg-emerald-300`
- Card / panel background: `bg-white/5` with `border border-white/10 rounded-2xl`
- No new CSS files. Tailwind utilities only.

## Analytics

Call `trackEvent()` from `src/lib/analytics.ts` on these events:

```typescript
// On mount
trackEvent('page_viewed', { page: 'properties' });

// On form submission
trackEvent('property_created');
trackEvent('estimate_started', { propertyId });
trackEvent('estimate_completed', { propertyId });

// On failure
trackEvent('save_failed', { context: 'new_property', error: error.message });
```

## Routing Conventions

- Use React Router `<Link>` for nav links and `useNavigate()` for programmatic navigation.
- Never use `window.location.href` assignments.
- Extract route params with `useParams<{ id: string }>()`.
- After successful saves, navigate explicitly — do not rely on the user pressing back.
- `ProtectedRoute` wraps all authenticated pages. Do not duplicate auth checks inside page components.

## Data Fetching

- Call custom hooks from `src/hooks/` — do not call Supabase directly in page components.
- Show `<LoadingState />` while `loading` is true.
- If `error` is non-null, render an error message with retry or home navigation.
- Do not render form inputs before data is loaded (avoids flash of empty form).
