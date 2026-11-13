// Post-deploy smoke test, run by the "smoke-test" job in
// .github/workflows/ci.yml on pushes to preview/main:
//   1. waits until Vercel's GitHub Deployment for this commit succeeds
//      (Vercel's GitHub App reports one per commit - no Vercel token needed);
//   2. checks the matching Render backend answers GET /health with 200;
//   3. opens the environment's STABLE frontend URL in Chromium and checks
//      Clerk finishes loading with no Clerk-related console/network errors
//      and the "Sign in" entry point renders.
//
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_SHA, GITHUB_REF_NAME
// (preview|main), and for preview only VERCEL_AUTOMATION_BYPASS_SECRET:
// the preview alias sits behind Vercel Deployment Protection (SSO).
import { chromium } from "playwright";

const ENVIRONMENTS = {
  preview: {
    vercelEnvironment: "Preview",
    frontendUrl: "https://followoo-git-preview-daevels-projects.vercel.app",
    backendUrl: "https://followoo-api-preview.onrender.com",
    needsBypass: true,
  },
  main: {
    vercelEnvironment: "Production",
    frontendUrl: "https://followoo.app",
    backendUrl: "https://followoo-api.onrender.com",
    needsBypass: false,
  },
};

const DEPLOY_TIMEOUT_MS = 15 * 60_000;
// Render's free tier cold-starts in ~1 minute and redeploys on the same push.
const HEALTH_TIMEOUT_MS = 6 * 60_000;
const CLERK_TIMEOUT_MS = 30_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fail(title, message) {
  console.log(`::error title=${title}::${message}`);
  process.exit(1);
}

async function github(pathname) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!response.ok) throw new Error(`GitHub API HTTP ${response.status}`);
  return response.json();
}

async function waitForVercelDeployment(environment) {
  const { GITHUB_REPOSITORY: repo, GITHUB_SHA: sha } = process.env;
  const deadline = Date.now() + DEPLOY_TIMEOUT_MS;
  console.log(`Waiting for the Vercel ${environment} deployment of ${sha}...`);
  while (Date.now() < deadline) {
    const deployments = await github(
      `/repos/${repo}/deployments?sha=${sha}&environment=${environment}&per_page=5`
    );
    if (deployments.length > 0) {
      const [latest] = await github(
        `/repos/${repo}/deployments/${deployments[0].id}/statuses?per_page=1`
      );
      if (latest?.state === "success") {
        console.log("Vercel deployment is ready.");
        return;
      }
      if (latest && ["failure", "error"].includes(latest.state)) {
        fail(
          "Vercel deployment failed",
          `Status "${latest.state}" for ${sha}.`
        );
      }
    }
    await sleep(15_000);
  }
  fail(
    "Vercel deployment not ready",
    `No successful ${environment} deployment for ${sha} after ${DEPLOY_TIMEOUT_MS / 60_000} minutes.`
  );
}

async function checkHealth(backendUrl) {
  const deadline = Date.now() + HEALTH_TIMEOUT_MS;
  let lastStatus = "no response";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${backendUrl}/health`, {
        signal: AbortSignal.timeout(90_000),
      });
      if (response.status === 200) {
        console.log(`${backendUrl}/health answered 200.`);
        return;
      }
      lastStatus = `HTTP ${response.status}`;
    } catch (error) {
      lastStatus = error.name;
    }
    await sleep(10_000);
  }
  fail("Backend health check failed", `${backendUrl}/health: ${lastStatus}.`);
}

async function checkClerk({ frontendUrl, needsBypass }) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    serviceWorkers: "block",
  });

  if (needsBypass) {
    // Vercel's Protection Bypass for Automation: one request with the
    // secret header sets a bypass cookie in this context's cookie jar, so
    // the secret never appears in the page URL (where it could leak to
    // third parties through Referer or analytics). Vercel answers with a
    // 307 back to the same URL plus Set-Cookie; following it must land on
    // the app itself - a wrong secret ends on Vercel's SSO login instead.
    const response = await context.request.get(frontendUrl, {
      headers: {
        "x-vercel-protection-bypass":
          process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
        "x-vercel-set-bypass-cookie": "true",
      },
    });
    const landedOn = new URL(response.url()).host;
    if (!response.ok() || landedOn !== new URL(frontendUrl).host) {
      fail(
        "Vercel protection bypass rejected",
        `HTTP ${response.status()} from ${landedOn} (expected ${new URL(frontendUrl).host}) - check VERCEL_AUTOMATION_BYPASS_SECRET matches the project's current bypass secret.`
      );
    }
  }

  const page = await context.newPage();
  // Keep smoke-test visits out of product analytics.
  await page.route(/posthog/i, (route) => route.abort());

  const clerkErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /clerk/i.test(message.text())) {
      clerkErrors.push(`console: ${message.text().slice(0, 200)}`);
    }
  });
  page.on("requestfailed", (request) => {
    if (/clerk/i.test(request.url())) {
      clerkErrors.push(
        `request failed: ${new URL(request.url()).host} (${request.failure()?.errorText})`
      );
    }
  });

  await page.goto(frontendUrl, { waitUntil: "domcontentloaded" });
  try {
    await page.waitForFunction(() => window.Clerk?.loaded === true, null, {
      timeout: CLERK_TIMEOUT_MS,
    });
    await page
      .getByRole("button", { name: "Sign in" })
      .first()
      .waitFor({ state: "visible", timeout: 10_000 });
  } catch {
    clerkErrors.push(
      `Clerk did not finish loading (or "Sign in" did not render) within ${CLERK_TIMEOUT_MS / 1000}s`
    );
  }
  await browser.close();

  if (clerkErrors.length > 0) {
    fail("Clerk smoke test failed", clerkErrors.join(" | "));
  }
  console.log(`Clerk loaded and "Sign in" rendered on ${frontendUrl}.`);
}

async function main() {
  const target = ENVIRONMENTS[process.env.GITHUB_REF_NAME];
  if (!target) {
    console.log(`No smoke test for ref "${process.env.GITHUB_REF_NAME}".`);
    return;
  }
  if (target.needsBypass && !process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    fail(
      "Missing secret VERCEL_AUTOMATION_BYPASS_SECRET",
      "The preview alias is behind Vercel Deployment Protection. In Vercel > followoo project > Settings > Deployment Protection > Protection Bypass for Automation, create a secret, then add it as the VERCEL_AUTOMATION_BYPASS_SECRET repository secret (Settings > Secrets and variables > Actions)."
    );
  }

  await waitForVercelDeployment(target.vercelEnvironment);
  await checkHealth(target.backendUrl);
  await checkClerk(target);
}

main().catch((error) => fail("Smoke test crashed", error.message));
