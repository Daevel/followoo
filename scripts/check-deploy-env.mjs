// Checks that every environment variable a deploy needs EXISTS on Vercel
// (preview + production) and on both Render services - names only. Values
// are never requested in clear, printed or compared.
//
// Usage: VERCEL_TOKEN=... RENDER_API_KEY=... node scripts/check-deploy-env.mjs
// Run by the "deploy-env-check" job in .github/workflows/ci.yml on pushes to
// preview/main. Exits 1 with a list of what is missing and where.

const VERCEL_PROJECT = "followoo";
const VERCEL_TEAM_SLUG = "daevels-projects";

// Keep in sync with .env.example (frontend) and backend/README.md (backend).
// Optional variables (VITE_SENTRY_DSN, FOLLOWOO_SENTRY_DSN, ...) are left out
// on purpose: the app works without them.
const VERCEL_REQUIRED = {
  production: [
    "VITE_API_BASE_URL",
    "VITE_CLERK_PUBLISHABLE_KEY",
    "VITE_POSTHOG_API_KEY",
    "VITE_POSTHOG_API_HOST",
    "VITE_EMAILJS_SERVICE_ID",
    "VITE_EMAILJS_TEMPLATE_ID",
    "VITE_EMAILJS_PUBLIC_KEY",
  ],
  preview: [
    "VITE_API_BASE_URL",
    "VITE_CLERK_PUBLISHABLE_KEY",
    "VITE_POSTHOG_API_KEY",
    "VITE_POSTHOG_API_HOST",
    "VITE_EMAILJS_SERVICE_ID",
    "VITE_EMAILJS_TEMPLATE_ID",
    "VITE_EMAILJS_PUBLIC_KEY",
  ],
};

const RENDER_REQUIRED = {
  "followoo-api": [
    "FOLLOWOO_DATABASE_URL",
    "FOLLOWOO_CORS_ORIGINS",
    "FOLLOWOO_CLERK_JWKS_URL",
  ],
  "followoo-api-preview": [
    "FOLLOWOO_DATABASE_URL",
    "FOLLOWOO_CORS_ORIGINS",
    "FOLLOWOO_CLERK_JWKS_URL",
  ],
};

const SECRET_HELP = {
  VERCEL_TOKEN:
    "Vercel > Account Settings > Tokens (https://vercel.com/account/settings/tokens), scoped to the team that owns the followoo project",
  RENDER_API_KEY:
    "Render > Account Settings > API Keys (https://dashboard.render.com/u/settings#api-keys)",
};

function annotate(level, title, message) {
  // GitHub Actions annotation; plain text elsewhere.
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::${level} title=${title}::${message}`);
  } else {
    console.log(`${level.toUpperCase()}: ${title} - ${message}`);
  }
}

async function getJson(url, token) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!response.ok) {
    // Body intentionally not printed: it could echo request details.
    throw new Error(`${new URL(url).host} answered HTTP ${response.status}`);
  }
  return response.json();
}

async function vercelEnvNames(token) {
  const url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT}/env?slug=${VERCEL_TEAM_SLUG}`;
  const { envs = [] } = await getJson(url, token);
  const byTarget = { production: new Set(), preview: new Set() };
  for (const env of envs) {
    for (const target of env.target ?? []) {
      // A branch-scoped preview var only counts if it applies to "preview".
      if (target === "preview" && env.gitBranch && env.gitBranch !== "preview")
        continue;
      byTarget[target]?.add(env.key);
    }
  }
  return byTarget;
}

// Render responses wrap items as { service }, { envVar }, { envGroup };
// unwrap defensively so a shape change fails loudly instead of silently.
const unwrap = (item, key) => item?.[key] ?? item;

async function renderEnvNames(token, serviceName) {
  const api = "https://api.render.com/v1";
  const services = await getJson(
    `${api}/services?name=${encodeURIComponent(serviceName)}&limit=20`,
    token
  );
  const service = services
    .map((item) => unwrap(item, "service"))
    .find((s) => s.name === serviceName);
  if (!service) return null;

  const names = new Set();
  const envVars = await getJson(
    `${api}/services/${service.id}/env-vars?limit=100`,
    token
  );
  for (const item of envVars) names.add(unwrap(item, "envVar").key);

  // Variables can also come from environment groups linked to the service.
  const groups = await getJson(`${api}/env-groups?limit=100`, token);
  for (const group of groups.map((item) => unwrap(item, "envGroup"))) {
    const linked = (group.serviceLinks ?? []).some((l) => l.id === service.id);
    if (!linked) continue;
    const detail = await getJson(`${api}/env-groups/${group.id}`, token);
    for (const envVar of detail.envVars ?? []) names.add(envVar.key);
  }
  return names;
}

async function main() {
  const missingSecrets = Object.keys(SECRET_HELP).filter(
    (name) => !process.env[name]
  );
  for (const name of missingSecrets) {
    annotate(
      "error",
      `Missing secret ${name}`,
      `Add ${name} as a repository secret (Settings > Secrets and variables > Actions). Create it at: ${SECRET_HELP[name]}.`
    );
  }
  if (missingSecrets.length > 0) process.exit(1);

  const problems = [];

  const vercel = await vercelEnvNames(process.env.VERCEL_TOKEN);
  for (const [target, required] of Object.entries(VERCEL_REQUIRED)) {
    for (const name of required) {
      if (!vercel[target].has(name))
        problems.push(`Vercel (${target}): ${name}`);
    }
  }

  for (const [serviceName, required] of Object.entries(RENDER_REQUIRED)) {
    const names = await renderEnvNames(process.env.RENDER_API_KEY, serviceName);
    if (!names) {
      problems.push(
        `Render: service "${serviceName}" not found for this API key`
      );
      continue;
    }
    for (const name of required) {
      if (!names.has(name)) problems.push(`Render (${serviceName}): ${name}`);
    }
  }

  if (problems.length > 0) {
    for (const problem of problems) {
      annotate("error", "Missing deploy env var", problem);
    }
    process.exit(1);
  }
  console.log("All required deploy environment variables are present.");
}

main().catch((error) => {
  annotate("error", "Deploy env check failed", error.message);
  process.exit(1);
});
