---
name: husky-pre-commit
description: Husky pre-commit hook, scripts/pre-commit-biome.sh, Biome auto-fix on commit, "Running Biome checks before commit" output, --no-verify. Use when a commit triggers the hook, the hook fails or changes files, or an agent meets this hook for the first time.
---

# Husky Pre-Commit Hook - Followoo

Quick reference: what the hook is and why it exists. For the commit workflow itself (staging, format, scopes, what to do after a failed commit) see `.claude/skills/git-commits/SKILL.md`.

## What runs

`.husky/pre-commit` runs `npm run precommit`, which runs `bash scripts/pre-commit-biome.sh`. The script:

1. **Records the staged files** (`git diff --cached --name-only -z`).
2. **Runs `npx biome check . --write`** on the whole repository. This formats, organizes imports and applies safe and unsafe fixes.
3. **Re-stages only the files that were already staged**, so Biome's fixes to them land in the commit. A staged deletion stays a deletion.
4. **Runs `npx biome check .` again** without `--write`. Anything Biome cannot fix by itself fails the hook, and the commit does not happen.

## Why it exists

Every commit that reaches `preview` or `main` is Biome-clean, so the CI `npm run lint` step does not fail on formatting. Re-staging keeps selective staging intact: you commit what you staged plus Biome's fixes to those same files, nothing else.

## What to know

- **It writes to the whole repo.** Step 2 can also reformat files you did not stage. Those changes stay unstaged in the working tree. Check `git status --short` after committing and do not sweep them into an unrelated commit.
- **Commits print the hook's banner.** Output such as "🔎 Running Biome checks before commit..." is normal, not an error.
- **Never skip it.** Do not use `--no-verify`, `HUSKY=0`, or anything else that bypasses the hook. If it fails, fix what Biome reports and commit again.
- **Who keeps this current.** If `.husky/` or `scripts/pre-commit-biome.sh` changes, update this skill as part of `pre-push-sync-knowledge`.
