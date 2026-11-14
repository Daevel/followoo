---
name: impact-assessment
description: Decide whether a Followoo change is "impactful" (data schema/Alembic migration, public route or endpoint contract, security/privacy boundary, feature flag, large redesign) and what full documentation sweep it then requires, including the in-repo architecture diagram (docs/architecture.md) and the Notion and Claude Project surfaces an agent cannot write. Use before pushing, when summarizing a push, or when asked whether a change needs docs updates.
---

# Impact Assessment - Followoo

## Purpose

This skill owns one decision: **is this change impactful?** If it is, it defines the full documentation sweep the change requires and what the push summary must say.

It does not own the push mechanics (inspecting `git status`/`git log`, commit strategy, checks, post-push report). Those live in `pre-push-sync-knowledge`, which calls this skill for the decision.

## When a change is impactful

A change is impactful if it meets **at least one** of these criteria. Judge the whole set of commits being pushed, not each commit alone.

1. **Data schema.** It adds or changes a table, column, constraint or index, or adds/edits a file in `backend/alembic/versions/`.
2. **Public route or endpoint contract.** It adds, removes or renames a frontend route (`src/pages`, the router, `scripts/prerender-static.mjs` route list), or adds, removes or changes the request/response shape, status codes or auth requirement of a backend endpoint (`backend/app/**/router.py`).
3. **Security or privacy boundary.** It changes:
   - what is sent to a third party (Sentry, PostHog, Clerk, EmailJS, Vercel Blob);
   - what requires authentication;
   - CORS origins, JWT/JWKS verification or rate limits;
   - what the backend stores, especially anything near the encrypted-history rules in `AGENTS.md`.
4. **Feature flag.** It introduces, removes or changes the default of a PostHog flag read through `useFeatureFlag` (`src/analytics/`).
5. **Large redesign.** It is a visual redesign that touches **8 or more files** across the shared UI surfaces:
   - `src/components/ui/**`;
   - `src/features/*/components/**`;
   - `src/pages/**`;
   - `src/index.css`;
   - `src/App.tsx`.

   It is also impactful, whatever the file count, if it renames or removes a design token in `src/index.css`.

### Why 8 files

The threshold comes from this repo's history, not from a round number:

- The homepage redesign (PR #13) touched 8 files in these paths. It changed what the README screenshots, `OG.png` and Storybook baselines show.
- The per-page restyles (PR #15: 6 files, PR #16: 3) and the navbar/scroll fix of Cluster A (5 files) stayed local to one or two screens and needed no documentation sweep.

Below 8, a UI change is almost always one screen. At 8 or more it spans the product's look.

Token renames are the exception: removing the legacy color tokens (PR #17) touched few UI files but still forced a Storybook skill update (`44b2aab`), because skills and stories reference tokens by name.

### Example

The `sync_keys` table (`backend/alembic/versions/2ea9007f2d18_add_sync_keys_table.py`, v3.1.0 Task 1) was impactful on four counts:

- a new table and migration (criterion 1);
- new `backend/app/sync` endpoints (criterion 2);
- a new privacy boundary: the backend may hold only wrapped keys (criterion 3);
- activation behind a feature flag (criterion 4).

Any one of them would have been enough.

A neutral counter-example is Cluster A's default sort change (`ResultsExperience.tsx` now opens on "Most recent"). It is user-visible, so it got a `/updates` entry, but it meets none of the criteria, so it is not impactful.

## Sweep required for an impactful change

### Surfaces the agent updates itself

Update these in the same push, ideally as separate `docs(...)` commits:

- **`README.md`**, when behavior or setup changes for a user or contributor: commands, env vars, prerequisites, what the product does.
- **The owning `SKILL.md` files.** Use the ownership map in `pre-push-sync-knowledge` ("Knowledge Files" and "When To Update Knowledge") to find which skill owns the changed knowledge. Update only the owners; do not copy knowledge into other skills.
- **`AGENTS.md`**, when a non-negotiable rule, the stack summary or the skills index changes.
- **`docs/architecture.md`**, when the change alters a component, an integration, a data flow or one of the state machines it draws (`SyncKeyProvider`, the free-analysis gate, the sync wizards). It replaced the Mermaid diagrams that used to live on Notion: update it directly, in the same push, like any other repo doc. The `docs-mermaid` CI job only proves the Mermaid still parses, so re-read the affected diagram against the code. If the change adds a new stateful flow worth drawing, add a diagram.
- **Other `docs/*`**, when the change belongs to a documented area, for example `docs/CI.md` for workflows and secrets.

### Surfaces the agent cannot write

There are two, and this agent has no access to Notion or to the Claude Project:

1. **The Notion database "🚀 Followoo SaaS Roadmap".**
2. **`claude/analisi-architetturale-saas.md`**, the project document maintained by another Claude session. It is relevant when the change touches the SaaS architecture: backend, data model, auth, billing/entitlements or sync.

Do not try to update these, and never drop them silently. **The summary of every impactful push must list both**, each one either:

- **"da aggiornare"**, with a ready-to-paste sentence for whoever does it (the founder or the other session); or
- **"non toccato"**, with a one-line reason, for example "nessun flusso cambiato".

Ready-to-paste templates, in Italian because the founder reads them; replace the placeholders:

```txt
SaaS Roadmap (Notion): segnare <voce roadmap> come <stato> - <cosa è stato consegnato>, commit <hash> su preview.
analisi-architetturale-saas.md: aggiornare la sezione <sezione> - <decisione/cambiamento architetturale>, vedi <file chiave> (commit <hash>).
```

## Output

When this skill runs as part of a push, add an **"Impatto"** block to the push summary:

- **Verdict:** "impattante" or "non impattante".
- **Criteria met:** their numbers.
- **Repo files updated** in the sweep, including whether `docs/architecture.md` changed (or "nessun diagramma cambiato").
- **The two external surfaces**, with their status, as above.

For a non-impactful push, one line is enough: "Non impattante: nessun criterio soddisfatto".
