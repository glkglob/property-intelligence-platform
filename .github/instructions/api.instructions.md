---
applyTo: "api/**"
---

# API / Serverless Function Instructions

## Current Status

The `api/` directory is a placeholder. These functions are **not deployed**. Before wiring any serverless function:

1. Confirm the deployment platform (Vercel / Netlify / other).
2. Add the required platform config (`vercel.json`, `netlify.toml`, etc.).
3. Ensure env vars are provisioned in the deployment environment, not just `.env`.
4. Test locally with `vercel dev` or equivalent before merging.

## Handler Contract

Every handler must:

1. Validate the HTTP method at the top — return 405 for unsupported methods.
2. Parse and validate the request payload with explicit type guards.
3. Return typed responses — no `any`.
4. Handle errors with appropriate HTTP status codes and a `{ error: string }` body.
5. Include a leading comment documenting: purpose, expected env vars, and deployment platform.

```typescript
// Example minimal handler shape
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  // validate, process, respond
}
```

## Secrets

- Never hardcode secrets, API keys, or service-role credentials.
- Access via `process.env.VAR_NAME` — never `import.meta.env` (server context, not Vite).
- Do not use the Supabase `service_role` key unless the operation absolutely requires it, and never expose it to the client.

## Estimate Calculation (`api/estimate.ts`)

When implemented, this handler should:
- Accept a validated property input payload matching `src/types/property.ts`.
- Return a structured result matching `src/types/estimate.ts`.
- Never perform raw Supabase writes from the API — let the client write the result after validation.
- Document the exact calculation logic with inline comments (this is core business logic).

## Do Not Imply Readiness

If a handler is a placeholder, mark it clearly:

```typescript
// TODO: Not yet deployed. Requires PLATFORM_X config and VAR_NAME env var.
export default async function handler() {
  return new Response(JSON.stringify({ error: 'Not implemented' }), { status: 501 });
}
```

Do not return fake data that implies the function works.
