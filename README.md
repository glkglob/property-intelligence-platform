# Property Intelligence Platform

Private beta — SaaS for UK property investors. Vite 5 · React 19 · TypeScript strict · Tailwind v4 · Supabase.

## Product positioning

- **Refurb Genius**: core refurbishment intelligence app
- **Deal Copilot**: acquisition intelligence and investor underwriting
- **Refurb IQ**: BOQ, cost planning, specifications, and contractor-ready scopes

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and fill in values before running:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SENTRY_DSN=
```

## Tests

Install test tooling first, then run:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
npm run test
```

## Modules

- **Refurb Genius** — core refurbishment estimate engine
- **Deal Copilot** — acquisition intelligence and deal scoring
- **Refurb IQ** — BOQ, cost planning, and contractor-grade outputs

## Status

The landing page is live. The authenticated app (auth, properties, estimates) is scaffolded and in active development. See `docs/BETA_PLAN.md` for roadmap.
