---
name: pre-push-sync-knowledge
description: Git push, pre-push, project knowledge, internal documentation. Use before suggesting or running git push to keep Followoo agent knowledge synchronized.
---

# Pre-Push Knowledge Sync Skill - Followoo

## Purpose

Use this skill before suggesting or running `git push` in Followoo.

The goal is to ensure pushed commits are coherent and that Followoo's internal project knowledge stays aligned with code changes.

## Required Pre-Push Flow

Before pushing, inspect:

```bash
git status
git log --oneline origin/<branch>..HEAD
git show --stat HEAD
```

If the upstream branch name is unknown, inspect `git status` first.

## Knowledge Sync Decision

Two questions, in this order:

1. **Is the push impactful?** This skill does not define that. Apply `.claude/skills/impact-assessment/SKILL.md`. It owns the criteria (schema/migrations, public route or endpoint contracts, security/privacy boundary, feature flags, large redesigns), the full sweep an impactful push requires, and the external surfaces (Notion, Claude Project) the push summary must list.
2. **Does it change any durable knowledge an owning file documents?** Even a non-impactful push can make a knowledge file stale, for example a new script in `scripts/`, a change to the Husky hook or a new folder. Use "Knowledge Files" and "When To Update Knowledge" below to find the owner and update it before pushing.

## Knowledge Files

Relevant Followoo knowledge files include:

```txt
.claude/skills/project-context/SKILL.md
.claude/skills/project-scaffolding/SKILL.md
.claude/skills/git-commits/SKILL.md
.claude/skills/pre-push-sync-knowledge/SKILL.md
.claude/skills/python-backend/SKILL.md
.claude/skills/storybook-component-creation/SKILL.md
.claude/skills/public-changelog/SKILL.md
.claude/skills/marketing-assets-automation/SKILL.md
.claude/skills/impact-assessment/SKILL.md
.claude/skills/husky-pre-commit/SKILL.md
.claude/skills/scripts-folder/SKILL.md
AGENTS.md
README.md
docs/architecture.md
docs/*
```

Update only the file that owns the changed knowledge.

## When To Update Knowledge

Update `.claude/skills/project-context/SKILL.md` when commits change:

- product behavior;
- privacy model;
- supported Instagram export files;
- analytics or error reporting rules;
- tech stack or important dependencies;
- runtime shape and major commands.

Update `.claude/skills/project-scaffolding/SKILL.md` when commits change:

- top-level folders;
- target `src` structure;
- placement rules for pages, features, services, providers, schemas, hooks, UI, server, or API code;
- migration rules.

Update `.claude/skills/git-commits/SKILL.md` when commits change:

- commit conventions;
- scopes;
- staging or Husky behavior;
- verification expectations.

Update `.claude/skills/husky-pre-commit/SKILL.md` when commits change `.husky/` or `scripts/pre-commit-biome.sh`.

Update `.claude/skills/scripts-folder/SKILL.md` when a file in `scripts/` is added, removed, renamed or changes purpose.

Update `docs/architecture.md` when commits change a component, an integration, a data flow or a state machine its diagrams draw (`SyncKeyProvider`, the free-analysis gate, the sync wizards). Re-read the affected diagram against the code: the `docs-mermaid` CI job only checks that the Mermaid parses.

Update `.claude/skills/impact-assessment/SKILL.md` when commits change:

- what counts as an impactful change;
- the documentation surfaces an impactful change must sweep, including the external Notion/Claude Project ones.

Update this skill when commits change:

- pre-push workflow;
- the ownership map in this section;
- required checks before push.

## When Not To Update Knowledge

Do not update knowledge for:

- typo-only changes;
- small visual tweaks;
- local refactors that do not establish a new pattern;
- routine formatting;
- temporary experiments not meant to be pushed as durable conventions.

## Commit Strategy

Prefer a dedicated docs commit for knowledge updates:

```bash
git add .claude/skills/project-context/SKILL.md
git commit -m "docs(project): update Followoo architecture context"
```

If the knowledge update is tiny and inseparable from the change, it may be included in the same commit, but separate commits are usually clearer.

## Verification Before Push

For code or config changes, run:

```bash
npm run lint
npm run build
```

For documentation-only skill changes, `npm run lint` is usually enough, but `npm run build` is still appropriate when earlier commits in the push changed app code.

Respect the Husky pre-commit hook. Do not skip hooks.

## Push Readiness

Push only when:

- commits are coherent and separated by area;
- knowledge files are updated if needed;
- required checks passed or failures are understood and reported;
- `git status` is clean, or contains only intentionally unpushed user changes;
- no secrets or generated build artifacts are staged.

After pushing, report:

- pushed branch;
- commit hashes/messages;
- checks run;
- remaining local changes, if any;
- the "Impatto" block defined by `impact-assessment`. It is one line when the push is not impactful. When it is, it says whether `docs/architecture.md` changed and lists the two external surfaces: never omit them silently.
