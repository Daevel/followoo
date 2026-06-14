---
name: git-commits
description: Git commit, commit message, git status, git diff. Use when preparing, suggesting, reviewing, or creating commits for the Followoo project.
---

# Git Commits Skill - Followoo

## Purpose

Use this skill whenever preparing, suggesting, reviewing, or creating commits in Followoo.

Followoo is a single React + Vite application with Vercel/serverless endpoints and project-specific OpenCode skills. Commits should stay small, intentional, and easy to review.

## Required Checks Before Commit

Always inspect the worktree before proposing or creating a commit:

```bash
git status
git diff --stat
git diff --name-only
```

Use `git diff` when the file list is not enough to understand the change.

Before committing, also inspect recent history:

```bash
git log --oneline -10
```

Do not commit secrets, generated build output, `node_modules`, `dist`, `.env*`, or unrelated user changes.

## Husky Pre-Commit Hook

Followoo has a Husky pre-commit hook that runs:

```bash
bash scripts/pre-commit-biome.sh
```

The hook runs Biome checks and may re-stage files that were already staged. Preserve selective staging and verify `git status --short` after any failed commit attempt.

Do not skip hooks. If a hook fails, fix the blocker and retry with a new commit attempt.

## Commit Format

Use Conventional Commits:

```txt
type(scope): short description
```

Allowed common types:

```txt
feat      -> new user-facing capability
fix       -> bug fix
refactor  -> restructuring without behavior change
docs      -> docs, README, OpenCode skills, project knowledge
chore     -> maintenance not affecting runtime behavior
style     -> visual/style-only changes
test      -> tests
build     -> build system changes
ci        -> CI/CD changes
```

## Recommended Scopes

Use scopes that match Followoo areas:

```txt
app          -> app composition, routing, landing page, src/main.tsx, src/App.tsx
pages        -> route-level pages under src/pages
ui           -> reusable components under src/components/ui
analytics    -> src/analytics
animations   -> src/animations
errors       -> src/errors and error UI/modeling
pwa          -> service worker and install behavior
instagram    -> Instagram export parsing and ZIP handling
relationship -> relationship analysis, personas, health, engagement insights
support      -> support form/schema/service behavior
updates      -> updates page/API/server update retrieval
api          -> Vercel/serverless endpoints under api
server       -> server-only services/repositories under server
tooling      -> Biome, Husky, scripts, TypeScript/Vite config
storybook    -> Storybook stories/config
opencode     -> .opencode skills/configuration
docs         -> README, docs, static documentation
project      -> broad architecture or structural changes
```

Prefer a precise scope over a broad one.

## Grouping Rules

Create separate commits when changes are independently reviewable.

Good split examples:

```txt
fix(tooling): preserve staged files in pre-commit checks
refactor(project): align source architecture with scaffolding
docs(opencode): migrate agent skills configuration
```

Avoid mixing unrelated changes such as UI styling, parser behavior, OpenCode skill edits, and tooling fixes in one commit.

## Staging Rules

Use selective staging by default:

```bash
git add path/to/file path/to/folder
```

Avoid `git add .` unless every changed file belongs to the same commit. This is especially important because user changes may exist concurrently.

If the worktree contains unrelated changes, leave them unstaged and mention them in the final response.

## Verification

For TypeScript/app/architecture changes, run:

```bash
npm run lint
npm run build
```

For small documentation-only changes, `npm run lint` is usually enough if Markdown/OpenCode files are included in Biome checks.

For Storybook or shared UI changes, also consider:

```bash
npm run build-storybook
```

Report warnings separately from failures. Known acceptable warnings may include Vite chunk-size warnings if unrelated to the change.

## Output Expectations

When the user asks for a commit, respond by doing the work, not only proposing commands, unless blocked.

After committing, summarize:

- commit hashes and messages;
- checks run and results;
- any intentionally uncommitted files.
