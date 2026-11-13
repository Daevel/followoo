import type { StorybookConfig } from "@storybook/react-vite";
import type { PluginOption } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],
  framework: "@storybook/react-vite",
  // Storybook reuses vite.config.ts. vite-plugin-sitemap writes
  // sitemap.xml/robots.txt into ./dist when the bundle closes, which
  // crashes "storybook build" wherever dist/ doesn't exist (Chromatic in
  // CI) - and Storybook has no use for a sitemap anyway.
  viteFinal: (viteConfig) => {
    const isSitemap = (plugin: PluginOption) =>
      Boolean(
        plugin &&
          typeof plugin === "object" &&
          "name" in plugin &&
          plugin.name === "vite-plugin-sitemap"
      );
    viteConfig.plugins = (viteConfig.plugins ?? [])
      .flat(Number.POSITIVE_INFINITY as 1)
      .filter((plugin) => !isSitemap(plugin as PluginOption));
    return viteConfig;
  },
};
export default config;
