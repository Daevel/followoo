#!/usr/bin/env bash

set -e

echo "🔎 Running Biome checks before commit..."

staged_files=$(mktemp)
git diff --cached --name-only -z > "$staged_files"
trap 'rm -f "$staged_files"' EXIT

echo "✨ Formatting, organizing imports and applying safe/unsafe fixes..."
npx biome check . --write

echo "📦 Re-adding staged files modified by Biome..."
if [ -s "$staged_files" ]; then
  while IFS= read -r -d '' file; do
    if [ -e "$file" ]; then
      git add -A -- "$file"
    else
      git rm --cached --ignore-unmatch -- "$file" >/dev/null
    fi
  done < "$staged_files"
fi

echo "🧪 Verifying project after Biome fixes..."
npx biome check .

echo "✅ Biome checks passed. Commit can continue."
