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

Ask whether the commits introduce or change any durable project knowledge:

- folder structure or architecture boundaries;
- routing/page placement;
- Instagram export parsing behavior;
- relationship analysis semantics;
- privacy guarantees;
- analytics behavior around private data;
- server/API boundaries;
- PWA behavior;
- build, lint, or Husky workflow;
- OpenCode skills or project instructions;
- major dependencies or developer commands.

If yes, update the relevant project knowledge before pushing.

## Knowledge Files

Relevant Followoo knowledge files include:

```txt
.opencode/skills/project-context/SKILL.md
.opencode/skills/project-scaffolding/SKILL.md
.opencode/skills/git-commits/SKILL.md
.opencode/skills/pre-push-sync-knowledge/SKILL.md
README.md
docs/*
```

Update only the file that owns the changed knowledge.

## When To Update Knowledge

Update `.opencode/skills/project-context/SKILL.md` when commits change:

- product behavior;
- privacy model;
- supported Instagram export files;
- analytics or error reporting rules;
- tech stack or important dependencies;
- runtime shape and major commands.

Update `.opencode/skills/project-scaffolding/SKILL.md` when commits change:

- top-level folders;
- target `src` structure;
- placement rules for pages, features, services, providers, schemas, hooks, UI, server, or API code;
- migration rules.

Update `.opencode/skills/git-commits/SKILL.md` when commits change:

- commit conventions;
- scopes;
- staging or Husky behavior;
- verification expectations.

Update this skill when commits change:

- pre-push workflow;
- knowledge sync criteria;
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
git add .opencode/skills/project-context/SKILL.md
git commit -m "docs(project): update Followoo architecture context"
```

If the knowledge update is tiny and inseparable from the change, it may be included in the same commit, but separate commits are usually clearer.

## Verification Before Push

For code or config changes, run:

```bash
npm run lint
npm run build
```

For documentation-only OpenCode changes, `npm run lint` is usually enough, but `npm run build` is still appropriate when earlier commits in the push changed app code.

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
- remaining local changes, if any.
