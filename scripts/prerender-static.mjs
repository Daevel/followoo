import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(dirname, "..");
const distDir = path.join(rootDir, "dist");
const ssrDir = path.join(rootDir, "dist-ssr");
const templatePath = path.join(distDir, "index.html");
const ssrEntryPath = path.join(ssrDir, "entry-prerender.js");

const routes = [
  "/",
  "/instructions-to-start",
  "/get-started",
  "/privacy-and-policy",
  "/terms-and-conditions",
  "/support",
  "/updates",
];

const siteUrl = "https://followoo.app";
const socialImage = `${siteUrl}/icons/pwa-icon-512.png`;

const routeSeo = {
  "/": {
    title: "Followoo - Private Instagram Followers Analyzer",
    description:
      "Analyze your Instagram export locally in your browser. Compare followers, following, mutuals and unfollowers without login or server-side file uploads.",
    canonical: siteUrl,
    schemaMarkup: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          name: "Followoo",
          url: siteUrl,
          description:
            "Privacy-first web app for analyzing Instagram followers, following and unfollowers from official export files.",
        },
        {
          "@type": "SoftwareApplication",
          "@id": `${siteUrl}/#app`,
          name: "Followoo",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web browser",
          url: siteUrl,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description:
            "Analyze your official Instagram export locally in your browser to compare followers, following, mutuals and unfollowers without an Instagram login.",
        },
      ],
    },
  },
  "/instructions-to-start": {
    title: "How to Download Instagram Followers Export - Followoo",
    description:
      "Step-by-step instructions to download your official Instagram followers and following export from Meta Accounts Center in JSON format.",
    canonical: `${siteUrl}/instructions-to-start`,
  },
  "/get-started": {
    title: "Upload Instagram Export ZIP - Followoo",
    description:
      "Start a private Instagram follower analysis by uploading your official export ZIP. Followoo processes the file locally in your browser.",
    canonical: `${siteUrl}/get-started`,
  },
  "/privacy-and-policy": {
    title: "Privacy Policy - Followoo",
    description:
      "Learn how Followoo protects your Instagram export data by processing files locally in your browser without uploading them to external servers.",
    canonical: `${siteUrl}/privacy-and-policy`,
  },
  "/terms-and-conditions": {
    title: "Terms and Conditions - Followoo",
    description:
      "Review the terms for using Followoo to analyze official Instagram export files locally in your browser.",
    canonical: `${siteUrl}/terms-and-conditions`,
  },
  "/support": {
    title: "Support - Followoo",
    description:
      "Contact Followoo support for help, bug reports or feedback about private Instagram export analysis.",
    canonical: `${siteUrl}/support`,
  },
  "/updates": {
    title: "Product Updates - Followoo",
    description:
      "Read the latest Followoo updates, improvements and fixes for private Instagram export analysis.",
    canonical: `${siteUrl}/updates`,
  },
};

function getOutputPath(route) {
  if (route === "/") {
    return path.join(distDir, "index.html");
  }

  return path.join(distDir, route.slice(1), "index.html");
}

function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function createFallbackHead(route) {
  const seo = routeSeo[route];

  if (!seo) {
    throw new Error(`Missing prerender SEO metadata for route: ${route}`);
  }

  const title = escapeAttribute(seo.title);
  const description = escapeAttribute(seo.description);
  const canonical = escapeAttribute(seo.canonical);
  const image = escapeAttribute(socialImage);
  const schema = seo.schemaMarkup
    ? `<script type="application/ld+json">${JSON.stringify(seo.schemaMarkup)}</script>`
    : "";

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}"/>`,
    `<link rel="canonical" href="${canonical}"/>`,
    `<meta property="og:title" content="${title}"/>`,
    `<meta property="og:description" content="${description}"/>`,
    '<meta property="og:type" content="website"/>',
    `<meta property="og:url" content="${canonical}"/>`,
    `<meta property="og:image" content="${image}"/>`,
    '<meta property="og:site_name" content="Followoo"/>',
    '<meta name="twitter:card" content="summary_large_image"/>',
    `<meta name="twitter:title" content="${title}"/>`,
    `<meta name="twitter:description" content="${description}"/>`,
    `<meta name="twitter:image" content="${image}"/>`,
    schema,
  ].join("");
}

function createHelmetHead(helmet) {
  if (!helmet) {
    return "";
  }

  return [
    helmet.title.toString(),
    helmet.priority.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ]
    .filter(Boolean)
    .join("");
}

function injectPrerenderedHtml(template, route, appHtml, helmet) {
  const headTags = createHelmetHead(helmet) || createFallbackHead(route);

  return template
    .replace(/<title>.*?<\/title>/, "")
    .replace(/<meta name="description" content=".*?"\s*\/>/, "")
    .replace("</head>", `${headTags}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

async function main() {
  const template = await readFile(templatePath, "utf8");
  const { render } = await import(pathToFileURL(ssrEntryPath).href);

  for (const route of routes) {
    const { appHtml, helmet } = render(route);
    const html = injectPrerenderedHtml(template, route, appHtml, helmet);
    const outputPath = getOutputPath(route);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html);

    console.log(
      `Prerendered ${route} -> ${path.relative(rootDir, outputPath)}`
    );
  }

  await rm(ssrDir, { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
