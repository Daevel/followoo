/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import sitemapPlugin from "vite-plugin-sitemap";
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const routes = ["/", "/instructions-to-start", "/get-started", "/support", "/updates", "/results"];
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  plugins: [react(), sitemapPlugin({
    hostname: "https://followoo.app",
    dynamicRoutes: routes
  }), createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        title: "Followoo",
        description: "Followoo - The best way to compare your Instagram followers",
        ogTitle: "Followoo",
        ogDescription: "Followoo - Confronta i tuoi follower Instagram in modo semplice"
      }
    }
  }), tailwindcss(), svgr({
    svgrOptions: {
      icon: true
    }
  })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"]
        }
      }
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});