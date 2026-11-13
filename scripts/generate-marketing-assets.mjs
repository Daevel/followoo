// Regenerates the marketing assets from a real production build:
//   docs/images/{hero,upload,results,search,mobile}.png + demo.gif  (README)
//   public/icons/OG.png                                              (social preview, 1200x630)
//   public/screenshots/pwa-{mobile,desktop}.png                      (PWA manifest)
//
// Usage: npm run build && npm run generate:assets
// Requires a Playwright Chromium (`npx playwright install chromium`) and,
// for demo.gif only, ffmpeg on PATH (skipped with a warning otherwise).
// Optional: build with VITE_CLERK_PUBLISHABLE_KEY (a pk_test_... development
// key) so the navbar "Sign in" button renders; without it the captures
// simply show no sign-in entry point, as before.
//
// The results screens use the product's own demo flow ("Try demo" -> demo
// export from Vercel Blob), never a real user export. Runs in CI via
// .github/workflows/regenerate-marketing-assets.yml, which proposes the
// regenerated files as a PR - see .claude/skills/marketing-assets-automation.
import { spawn, spawnSync } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(dirname, "..");
const docsImagesDir = path.join(rootDir, "docs", "images");
const iconsDir = path.join(rootDir, "public", "icons");
const pwaScreenshotsDir = path.join(rootDir, "public", "screenshots");

const port = Number(process.env.MARKETING_ASSETS_PORT ?? 4319);
const baseUrl = `http://127.0.0.1:${port}`;

const RESULTS_HEADING = "Your Instagram network analysis";

// Every app context: dark UI, fixed locale/timezone, and no service worker,
// so the PWA "ready offline" toast never lands in a screenshot.
const baseContext = {
  colorScheme: "dark",
  locale: "en-US",
  timezoneId: "UTC",
  serviceWorkers: "block",
};

// Opens a browser context for the app, pre-seeded like a visitor who
// dismissed the "Install Followoo as an app" toast (usePwaInstallPrompt).
async function newAppContext(browser, options) {
  const context = await browser.newContext({ ...baseContext, ...options });
  await context.addInitScript(() => {
    window.localStorage.setItem("pwa-dismissed-at", String(Date.now()));
  });
  return context;
}

const written = [];

function startPreviewServer() {
  const viteBin = path.join(rootDir, "node_modules", ".bin", "vite");
  const server = spawn(
    viteBin,
    ["preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd: rootDir, stdio: ["ignore", "pipe", "pipe"] }
  );
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));
  return server;
}

async function waitForServer(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(
    `Preview server did not start on ${baseUrl} - did you run "npm run build"?`
  );
}

// True when the build in dist/ was made with a Clerk publishable key, i.e.
// the sign-in UI will render and every capture must wait for Clerk.
let hasClerkKey = false;

async function detectClerkKey() {
  const assetsDir = path.join(rootDir, "dist", "assets");
  const files = (await readdir(assetsDir)).filter((f) => f.endsWith(".js"));
  for (const file of files) {
    const source = await readFile(path.join(assetsDir, file), "utf8");
    if (/pk_(?:test|live)_[A-Za-z0-9]{10,}/.test(source)) return true;
  }
  return false;
}

// Waits for network, fonts, Clerk (when configured, so its loading state is
// never captured) and the GSAP entrance animations to finish.
async function settle(page, ms = 1500) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  if (hasClerkKey) {
    await page.waitForFunction(() => window.Clerk?.loaded === true, null, {
      timeout: 20_000,
    });
    await page.waitForLoadState("networkidle");
  }
  await page.waitForTimeout(ms);
}

async function openHome(page) {
  await page.goto(`${baseUrl}/`);
  await settle(page);
}

// Home -> "Try demo" -> "Start analysis" -> populated results page.
async function runDemoFlow(page, { pauseMs = 0 } = {}) {
  await openHome(page);
  if (pauseMs) await page.waitForTimeout(pauseMs);
  await page.getByRole("button", { name: "Try demo" }).first().click();
  await page.waitForURL("**/get-started");
  await settle(page, pauseMs || 800);
  await page.getByRole("button", { name: "Start analysis" }).click();
  await page
    .getByRole("heading", { name: RESULTS_HEADING })
    .waitFor({ timeout: 60_000 });
  await settle(page);
}

async function save(filePath, buffer) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);
  written.push(filePath);
}

async function captureDesktop(browser) {
  const context = await newAppContext(browser, {
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await openHome(page);
  await save(path.join(docsImagesDir, "hero.png"), await page.screenshot());

  await page.goto(`${baseUrl}/get-started`);
  await settle(page);
  await save(path.join(docsImagesDir, "upload.png"), await page.screenshot());

  await runDemoFlow(page);
  const resultsPng = await page.screenshot();
  await save(path.join(docsImagesDir, "results.png"), resultsPng);

  // Bring the search + sort controls near the top and focus the search.
  await page.evaluate(() => {
    const input = document.getElementById("search-users");
    if (!input) throw new Error("#search-users not found on results page");
    const top = input.getBoundingClientRect().top + window.scrollY - 320;
    window.scrollTo({ top, behavior: "instant" });
  });
  await page.locator("#search-users").focus();
  await page.waitForTimeout(800);
  await save(path.join(docsImagesDir, "search.png"), await page.screenshot());

  await context.close();
  return resultsPng;
}

async function captureMobile(browser) {
  const context = await newAppContext(browser, {
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await runDemoFlow(page);
  await save(path.join(docsImagesDir, "mobile.png"), await page.screenshot());
  await context.close();

  const pwaContext = await newAppContext(browser, {
    viewport: { width: 540, height: 720 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const pwaPage = await pwaContext.newPage();
  await openHome(pwaPage);
  await save(
    path.join(pwaScreenshotsDir, "pwa-mobile.png"),
    await pwaPage.screenshot()
  );
  await pwaContext.close();
}

function hasFfmpeg() {
  return spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
}

// Records the demo flow as video, takes the 1280x720 PWA desktop shot along
// the way, then converts the video to a palette-optimized GIF with ffmpeg.
async function captureDemoGif(browser) {
  const videoDir = await mkdtemp(path.join(os.tmpdir(), "followoo-demo-"));
  const size = { width: 1280, height: 720 };
  const context = await newAppContext(browser, {
    viewport: size,
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size },
  });
  const page = await context.newPage();
  const recordingStart = Date.now();

  await openHome(page);
  // Trim the blank frames before the homepage finished rendering.
  const trimSeconds = Math.max(0, (Date.now() - recordingStart) / 1000 - 0.2);
  await runDemoFlow(page, { pauseMs: 1200 });
  await save(
    path.join(pwaScreenshotsDir, "pwa-desktop.png"),
    await page.screenshot()
  );
  await page.mouse.move(640, 400);
  for (let step = 0; step < 12; step += 1) {
    await page.mouse.wheel(0, 70);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1200);

  const video = page.video();
  await context.close();

  if (!video) throw new Error("Playwright did not record the demo video");
  if (!hasFfmpeg()) {
    console.warn("! ffmpeg not found - skipping docs/images/demo.gif");
    await rm(videoDir, { recursive: true, force: true });
    return;
  }

  const gifPath = path.join(docsImagesDir, "demo.gif");
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-ss",
      trimSeconds.toFixed(2),
      "-i",
      await video.path(),
      "-vf",
      "fps=10,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=5",
      "-loop",
      "0",
      gifPath,
    ],
    { stdio: "inherit" }
  );
  await rm(videoDir, { recursive: true, force: true });
  if (result.status !== 0) throw new Error("ffmpeg failed to build demo.gif");
  written.push(gifPath);
}

// Pulls every --color-*/--radius-* token from src/index.css so the OG image
// always follows the real design tokens.
async function readDesignTokens() {
  const css = await readFile(path.join(rootDir, "src", "index.css"), "utf8");
  const tokens = css.match(/--(?:color|radius)-[\w-]+:\s*[^;]+;/g) ?? [];
  if (tokens.length === 0) throw new Error("No design tokens in src/index.css");
  return tokens.join("\n        ");
}

async function captureOgImage(browser, resultsPng) {
  const template = await readFile(
    path.join(dirname, "templates", "og-template.html"),
    "utf8"
  );
  const logoSvg = await readFile(
    path.join(rootDir, "public", "favicon.svg"),
    "utf8"
  );
  const html = template
    .replace("/* @tokens */", await readDesignTokens())
    .replace("<!-- @logo -->", logoSvg)
    .replace(
      "__PREVIEW_SRC__",
      `data:image/png;base64,${resultsPng.toString("base64")}`
    );

  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await save(path.join(iconsDir, "OG.png"), await page.screenshot());
  await context.close();
}

async function describe(filePath) {
  const buffer = await readFile(filePath);
  const isGif = buffer.subarray(0, 3).toString("ascii") === "GIF";
  const width = isGif ? buffer.readUInt16LE(6) : buffer.readUInt32BE(16);
  const height = isGif ? buffer.readUInt16LE(8) : buffer.readUInt32BE(20);
  const { size } = await stat(filePath);
  const kb = (size / 1024).toFixed(0);
  return `${path.relative(rootDir, filePath)}  ${width}x${height}  ${kb} KB`;
}

async function main() {
  const server = startPreviewServer();
  let browser;
  try {
    await waitForServer();
    hasClerkKey = await detectClerkKey();
    console.log(
      hasClerkKey
        ? "Clerk key found in the build: captures will include Sign in."
        : "! No Clerk key in the build: captures will not include Sign in."
    );
    browser = await chromium.launch();

    const resultsPng = await captureDesktop(browser);
    await captureMobile(browser);
    await captureDemoGif(browser);
    await captureOgImage(browser, resultsPng);

    console.log("Generated marketing assets:");
    for (const filePath of written)
      console.log(`  ${await describe(filePath)}`);
  } finally {
    await browser?.close();
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
