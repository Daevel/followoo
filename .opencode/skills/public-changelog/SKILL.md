---
name: public-changelog
description: Decide whether a completed change belongs on the public /updates page and, if so, write and publish the entry. Use when a roadmap version or notable change is completed and could be user-facing.
---

# Public Changelog - Followoo

## Purpose

`/updates` (`src/pages/Updates.tsx`) is a public, user-facing page, not an internal one. Use this skill whenever a roadmap version (tracked in the Notion "Followoo SaaS Roadmap") or any standalone change is completed, to decide whether it deserves an entry there and, if so, to write and publish one correctly.

## Decision Rule

An entry belongs on `/updates` only if an end user could notice it or directly benefit from it: a new feature, a UI/UX change, support for a new Instagram export shape, a fix for a bug a user could have hit, a pricing/plan change, a meaningfully faster or more reliable experience the user would actually perceive.

Do not publish entries for changes that are invisible to the end user, even when they are large or important internally:

- test coverage / unit tests
- CI/CD pipelines, Chromatic, deploy tooling
- backend connection pooling, rate limiting, database migrations (Alembic)
- error tracking / observability (Sentry) setup
- folder/architecture refactors, legacy structure migrations
- OpenCode skill or internal documentation fixes
- dependency bumps with no visible behavior change

A version can close fully on the roadmap and still have zero `/updates` entries if every task was infrastructure work - that is expected, not a gap. Followoo's v2.1.0 (unit tests, CI/CD, pooling, rate limiting, Alembic, legacy structure migration, Sentry) is exactly this case and intentionally has no public entry.

If a purely internal version still deserves a trust signal (e.g. "we made the service more reliable"), write it generically, without internal version numbers, technical terms, or a rundown of what changed internally - and treat this as optional, not the default.

## Copy Rules

Reuse the product copy rules from `project-context/SKILL.md`: be direct and reassuring about local processing, never imply official Instagram/Meta affiliation, do not overpromise, use plain terms (`followers`, `following`, `not following you back`, `recent unfollowers`, `blocked users`).

Additional rules specific to changelog entries:

- Write in English. The product UI (including the `/updates` page itself) is currently English-only - see `project-context/SKILL.md`'s note on the absence of i18n. Do not write entries in Italian even if internal planning docs (Notion, roadmap prompts) are in Italian.
- `description` is one short, benefit-oriented sentence - what changed for the user, not how it was built.
- `groups` (see `UpdateChangeGroup` in `src/data/updates/updates.types.ts`) break the entry into short bullet lists with a `label` (e.g. "New", "Improved", "Fixed") and a `tone` (`"accent"` or `"primary"`); keep each `items` line to a single user-facing statement.
- `version` is a public-facing label shown as a badge; it does not have to match the internal Notion roadmap version number 1:1 - use it only if a version number is meaningful to users, otherwise prefer a short descriptive label.
- `slug` must be unique and URL-safe (kebab-case).

## Publishing Mechanism

There is no admin UI or write endpoint yet for `/updates` - `backend/app/updates/router.py` only exposes `GET /updates`, and `python-backend/SKILL.md` lists `admin_updates` (authenticated content management) as a future, not-yet-built feature. Until that exists, publishing an entry means inserting a row directly into the `updates` table on the Neon Postgres database, matching the shape in `backend/alembic/schema.py`:

```sql
insert into updates (
  slug, product_name, version, release_date, description, badge_background_color, groups, is_published, published_at
) values (
  'example-slug',
  'Followoo',
  'v3.0.0',
  '2026-10-01',
  'Short, user-facing sentence about what changed.',
  'accent',
  '[{"label": "New", "tone": "accent", "items": ["User-facing bullet one.", "User-facing bullet two."]}]'::jsonb,
  false,
  null
);
```

Insert with `is_published = false` and `published_at = null` first, so the entry can be reviewed before going live. Only flip `is_published` to `true` and set `published_at = now()` once the copy has been approved by the user - this is public, user-facing copy, distinct from internal Notion roadmap notes.

A data-only insert does not need an `alembic revision`. If this manual-insert workflow is used often enough to become a bottleneck, consider building the `admin_updates` feature instead of continuing to insert rows by hand.

## When Not To Use This Skill

Do not use this skill to decide what goes into the Notion roadmap, commit messages, or internal skill documentation - those track work for the team, not communication to end users, and follow their own conventions (`git-commits`, `pre-push-sync-knowledge`).
