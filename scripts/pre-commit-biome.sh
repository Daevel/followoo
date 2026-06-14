#!/usr/bin/env bash

set -e

echo "🔎 Running Biome checks before commit..."

staged_files=$(mktemp)
git diff --cached --name-only -z > "$staged_files"

echo "✨ Formatting, organizing imports and applying safe/unsafe fixes..."
npx biome check . --write

echo "📦 Re-adding staged files modified by Biome..."
if [ -s "$staged_files" ]; then
  xargs -0 git add -A -- < "$staged_files"
fi

rm -f "$staged_files"

echo "🧪 Verifying project after Biome fixes..."
npx biome check .

echo "✅ Biome checks passed. Commit can continue."
