#!/usr/bin/env bash

set -e

echo "🔎 Running Biome checks before commit..."

echo "✨ Formatting, organizing imports and applying safe/unsafe fixes..."
npx biome check . --write

echo "📦 Re-adding files modified by Biome..."
git add .

echo "🧪 Verifying project after Biome fixes..."
npx biome check .

echo "✅ Biome checks passed. Commit can continue."