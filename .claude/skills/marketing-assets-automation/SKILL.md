---
name: marketing-assets-automation
description: README screenshots, demo.gif, social preview OG.png, PWA manifest screenshots, docs/images. Use when a change affects how the homepage, upload page or results page look, or when asked to update screenshots, the OG image or marketing images for Followoo.
---

# Marketing Assets Automation - Followoo

## Purpose

README screenshots, the social preview image and the PWA install screenshots are generated from the real app, not edited by hand. Use this skill to know what regenerates them, when, and what an agent should (and should not) do after changing the UI.

## What gets generated

`scripts/generate-marketing-assets.mjs` (`npm run generate:assets`, after `npm run build`) serves `dist/` with `vite preview` and captures with Playwright:

```txt
docs/images/hero.png            homepage hero, desktop (README)
docs/images/upload.png          /get-started before upload, desktop (README)
docs/images/results.png         results page via the demo flow, desktop (README)
docs/images/search.png          results search + sort controls, desktop (README)
docs/images/mobile.png          results page via the demo flow, mobile (README)
docs/images/demo.gif            recorded demo flow, converted with ffmpeg (README)
public/icons/OG.png             1200x630 social preview (og:image / twitter:image)
public/screenshots/pwa-*.png    PWA manifest screenshots (vite.config.ts)
```

- Results screens always go through the product's own "Try demo" flow (demo export from Vercel Blob, see `src/data/vercelBlobStructure.ts`), never a real user export - keep it that way.
- `OG.png` is rendered from `scripts/templates/og-template.html`, which pulls every `--color-*`/`--radius-*` token from `src/index.css` at render time and embeds the freshly captured results screenshot. Redesign the social preview by editing that template, not the PNG. Its copy must never imply Instagram/Meta affiliation.
- The script pre-dismisses the PWA install toast and blocks the service worker, so neither shows up in captures. Keep README image file names stable - `README.md` references them by path.

## When it runs

`.github/workflows/regenerate-marketing-assets.yml` runs on pushes to `preview` that touch `src/features/landing`, `src/features/results`, `src/features/instagram-export`, `src/components/ui`, `src/index.css`, the generator script or its template (and on manual dispatch). If the captures differ from what is committed, it opens or updates a single PR into `preview` from `chore/marketing-assets`. It never pushes to `preview` or `main` directly and never auto-merges: a human reviews the images first.

Repository prerequisites (Settings, not code):

- Either enable "Allow GitHub Actions to create and approve pull requests", or add a fine-grained PAT as the `MARKETING_ASSETS_PR_TOKEN` secret (preferred: PRs opened with the default token do not trigger CI).
- Optional: a Clerk development key (`pk_test_...`) as the `MARKETING_ASSETS_CLERK_PUBLISHABLE_KEY` variable, so the navbar "Sign in" button renders in captures.

## Rules for agents

- Do not regenerate or hand-edit these images as part of a UI change. Push the UI change to `preview`; the workflow proposes updated assets as a reviewable PR.
- Run `npm run build && npm run generate:assets` locally only to debug the generator or the OG template, and restore the generated files afterwards (`git checkout -- docs/images public/icons/OG.png public/screenshots`) unless the user explicitly asks to commit them.
- If a UI change breaks a selector the script relies on ("Try demo", "Start analysis", the "Your Instagram network analysis" heading, `#search-users`), update the script in the same change.
- Local runs need `npx playwright install chromium`; `demo.gif` also needs `ffmpeg` on PATH (skipped with a warning otherwise).
