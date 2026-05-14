import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import sitemapPlugin from "vite-plugin-sitemap";
import svgr from "vite-plugin-svgr";

const routes = [
  "/",
  "/instructions-to-start",
  "/get-started",
  "/support",
  "/updates",
  "/results",
];

export default defineConfig({
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
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
