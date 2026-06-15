/// <reference types="vitest/config" />

import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";
import sitemapPlugin from "vite-plugin-sitemap";
import svgr from "vite-plugin-svgr";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const routes = [
  "/instructions-to-start",
  "/get-started",
  "/privacy-and-policy",
  "/terms-and-conditions",
  "/support",
  "/updates",
];
export default defineConfig(({ isSsrBuild }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    sitemapPlugin({
      hostname: "https://followoo.app",
      dynamicRoutes: routes,
      exclude: ["/results"],
      robots: [
        {
          userAgent: "*",
          allow: "/",
          disallow: "/results",
        },
      ],
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: "Followoo",
          description:
            "Followoo - The best way to compare your Instagram followers",
          ogTitle: "Followoo",
          ogDescription:
            "Followoo - Confronta i tuoi follower Instagram in modo semplice",
        },
      },
    }),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "icons/*.svg"],
      manifest: {
        name: "Followoo - Private Instagram Export Analyzer",
        short_name: "Followoo",
        description:
          "Analyze your Instagram followers, following and unfollowers locally in your browser. No Instagram login and no server-side file upload.",
        lang: "en",
        theme_color: "#1a1a1a",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        categories: ["utilities", "productivity"],
        prefer_related_applications: false,
        icons: [
          {
            src: "/icons/pwa-icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/icons/pwa-icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/icons/pwa-icon-maskable.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Upload Instagram Data",
            short_name: "Upload",
            description: "Upload your Instagram export ZIP and start analyzing",
            url: "/get-started",
            icons: [
              {
                src: "/icons/pwa-icon-192.svg",
                sizes: "192x192",
                type: "image/svg+xml",
              },
            ],
          },
        ],
        // TODO: add real app screenshots once the final production UI is captured.
        // Recommended assets: /screenshots/pwa-mobile.png (540x720) and /screenshots/pwa-desktop.png (1280x720).
        // TODO: add PNG versions of icons for maximum browser compatibility.
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf,eot}",
        ],
        globIgnores: [
          "**/node_modules/**/*",
          ".storybook/**/*",
          "storybook-static/**/*",
        ],
        maximumFileSizeToCacheInBytes: 5000000,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\..*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  build: isSsrBuild
    ? undefined
    : {
        rollupOptions: {
          output: {
            manualChunks: {
              react: ["react", "react-dom", "react-router-dom"],
            },
          },
        },
      },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
}));
