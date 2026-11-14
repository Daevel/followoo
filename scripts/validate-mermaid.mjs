#!/usr/bin/env node
// Parses every ```mermaid block in the given Markdown files (default:
// docs/architecture.md) with the real Mermaid parser and exits 1 if any
// block has a syntax error. Syntax only - it never renders, so no browser
// is needed: Mermaid's parser runs in Node on top of a jsdom window.
//
// Usage: node scripts/validate-mermaid.mjs [file.md ...]
// Run by: `npm run docs:check-mermaid`, CI job `docs-mermaid` (ci.yml).

import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const files = process.argv.slice(2);
if (files.length === 0) files.push("docs/architecture.md");

// Mermaid touches window/document at import time (DOMPurify), even for
// parse(), so the globals must exist before the dynamic import.
const { window } = new JSDOM("<!doctype html><html><body></body></html>");
globalThis.window = window;
globalThis.document = window.document;

const { default: mermaid } = await import("mermaid");
mermaid.initialize({ startOnLoad: false });

const FENCE = /^```mermaid[^\n]*\n([\s\S]*?)^```\s*$/gm;

let blocks = 0;
let failures = 0;

for (const file of files) {
  const text = await readFile(file, "utf8");

  for (const match of text.matchAll(FENCE)) {
    blocks += 1;
    const line = text.slice(0, match.index).split("\n").length;

    try {
      await mermaid.parse(match[1]);
      console.log(`ok   ${file}:${line}`);
    } catch (error) {
      failures += 1;
      const message = String(error?.message ?? error);
      console.log(`FAIL ${file}:${line}\n${message}\n`);
      // GitHub Actions annotation, pointing at the block's opening fence.
      if (process.env.GITHUB_ACTIONS) {
        const firstLine = message.split("\n")[0];
        console.log(
          `::error file=${file},line=${line}::Invalid Mermaid block: ${firstLine}`
        );
      }
    }
  }
}

if (blocks === 0) {
  console.error(`No mermaid blocks found in: ${files.join(", ")}`);
  process.exit(1);
}

console.log(`\n${blocks - failures}/${blocks} mermaid blocks valid`);
process.exit(failures > 0 ? 1 : 0);
