---
name: implement-feature
description: "Use when implementing a new feature, page, or hook in the Property Intelligence Platform. Enforces golden path priority, beta product rules, and Supabase schema alignment."
---

# Implement Feature: $ARGUMENTS

## Context

Property Intelligence Platform — private beta for UK property investors.
Stack: Vite 5 · React 19 · TypeScript strict · Tailwind v4 · Supabase.

**Golden path (protect above all else):**
1. Sign in / session restore → `/login`
2. Create or open project → `/properties` → `/properties/new`
3. Enter property details → `/properties/:id`
4. Run analysis → `/estimate/:propertyId`
5. Save results → `estimates` table
6. Revisit project and take a next action

**Priority order:** build blockers → auth failures → data loss → broken golden path → observability → UX → polish.

## Required Workflow

### 1. Inspect First (do not skip)

Before writing any code, read:
- `docs/SUPABASE_SCHEMA.sql` — confirm tables and columns you'll use exist
- `src/types/` — find the existing type definitions
- `src/hooks/` — check if a relevant hook already exists
- `src/lib/` — check existing utilities and the Supabase client
- The specific page or component being modified

### 2. State Your Understanding

In one paragraph: what is the current state, what gap needs filling, and what risk exists.

### 3. Plan the Smallest Safe Change

- What files will be created or modified?
- Are there any Supabase schema dependencies (missing columns / tables)?
- Are there missing env vars or migrations?
- What could regress?

If any ambiguity could cause the wrong implementation, ask one clarifying question before proceeding.

### 4. Implement

Follow all rules in `CLAUDE.md`:
- Schema-aligned types only
- Supabase calls in hooks, not page components
- Explicit loading / empty / error / success states
- `trackEvent()` at key moments
- Dark theme: `bg-slate-950`, `text-white`, `emerald-400` accent
- No invented tables, columns, API routes, or env vars

### 5. Validate

Confirm each item:
- [ ] `npm run build` passes with no TypeScript errors
- [ ] Golden path not broken by this change
- [ ] Loading, empty, error, and success states handled
- [ ] No auth or RLS regressions
- [ ] Analytics events fired at key points
- [ ] Unfinished adjacent features remain gated

### 6. Report

Structure your response exactly as:

**Understanding** — what the problem actually is

**Approach** — why this is the smallest safe change

**Code changes** — files modified and what changed in each

**Tests / validation** — what was verified and how

**Caveats** — migrations required, env vars needed, remaining risks
