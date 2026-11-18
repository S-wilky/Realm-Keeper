# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What Realm Keeper is

A system-agnostic worldbuilding and tabletop RPG campaign tool: Tomes (the core content unit), Worlds, Campaigns, live Sessions (VTT), and Maps.

**Read [`docs/planning-doc-v7.md`](docs/planning-doc-v7.md) before starting any feature work.** It is the source of truth for product direction, feature tiers (Must Ship / Should Ship / Post-Alpha / Post-Beta), guiding principles, and architecture decisions. It changes as plans change; when code and the doc disagree, ask rather than guess.

Do **not** use `README.md` as a source of truth. It is outdated (for example, it overstates the role of AI features) and will be rewritten.

## Current state of the code

The existing app (articles, the current dashboard, sessions, chatbot/AI screens) was built as a school final project under deadline. It is being **replaced**, not extended.

- **Build new alongside the old code.** Don't refactor legacy screens in place or add features to them. Reusing ideas and structures (e.g. the session map viewport in `frontend/src/components/Sessions (VTT)/`) as a reference or starting point is encouraged, but put the result in new files.
- **Don't delete legacy code** unless asked; it will be removed once replacements exist.
- **Leave `ai-service/` alone.** AI features are de-emphasized, especially for launch. A Python server will be needed for AI later; that's a future decision.
- **`backend/` (Express) is going away.** Don't add to it. The backend direction (likely a Python service, see the planning doc) is still being finalized.
- The new **Tome data model** (tomes, blocks, connections, versions, grants, RLS, RPCs) lives in `supabase/migrations/` (Nov 2026). New frontend work should target these tables, not the legacy `articles` tables.

## Decisions already made

- **Block editor: Tiptap.** (The planning doc may still list BlockNote vs. Tiptap as open; Tiptap is the decision.)
- **Data/auth/storage/realtime: Supabase.** RLS on every table. Schema changes only via Supabase CLI migration files in `supabase/migrations/`, never through the dashboard.
- **Frontend:** React 19 + TypeScript + Vite, Tailwind v4, React Router, Zustand. Deployed to Netlify (`netlify.toml`, base `frontend/`).
- Guiding principles in the planning doc apply to every feature, especially: GM secrets must be protected by design, mobile-first for prep/reference, system-agnostic by default.

## Repository layout

```
frontend/            React + Vite app (the main codebase)
  src/pages/         Route screens (mostly legacy)
  src/components/    UI components (Sessions (VTT)/ holds the map viewport)
  src/services/      Supabase client and data access
  src/types/database.generated.ts   Generated Supabase types; don't hand-edit
supabase/migrations/ Database schema (source of truth for the DB)
docs/                Planning documents
backend/             Legacy Express stub (being removed)
ai-service/          Legacy AI service (leave alone)
```

## Common commands

From `frontend/`:

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

From the repo root, regenerate Supabase types after a migration:

```bash
npm run types:local    # from local Supabase
npm run types:remote   # from the hosted project
```

Frontend env vars (in `frontend/.env`, never committed): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISH_KEY`. Never commit secrets.

## Git workflow

- `develop` is the integration branch. `main` is for releases.
- Create feature branches off `develop` (e.g. `feature/tome-editor`) and open PRs into `develop`. Release PRs from `develop` into `main` are done by Shane.
- Never commit directly to `main` or `develop`.
- Don't open PRs or push unless Shane asks.
- Before proposing a change, run `npm run lint` and `npm run type-check` in `frontend/` if you touched frontend code, and fix anything you introduced.

## Working preferences

- Shane is new to Claude Code and to parts of software development. Explain non-obvious decisions briefly and plainly.
- When a task touches an open question in the planning doc, ask before choosing.
