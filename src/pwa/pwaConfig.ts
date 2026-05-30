/**
 * PWA Configuration
 * Type definitions and utilities for PWA features
 */

export interface PWAConfig {
  name: string;
  short_name: string;
  description: string;
  scope: string;
  start_url: string;
  display: "fullscreen" | "standalone" | "minimal-ui" | "browser";
  theme_color: string;
  background_color: string;
  orientation:
    | "any"
    | "natural"
    | "landscape"
    | "portrait"
    | "portrait-primary"
    | "portrait-secondary"
    | "landscape-primary"
    | "landscape-secondary";
}

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

export const PWA_CONFIG: PWAConfig = {
  name: "Followoo - Instagram Followers Comparison",
  short_name: "Followoo",
  description:
    "See how your Instagram following compares to others. Track your growth and engagement.",
  scope: "/",
  start_url: "/",
  display: "standalone",
  theme_color: "#1a1a1a",
  background_color: "#ffffff",
  orientation: "portrait-primary",
};

/**
 * Check if the app is running as a PWA
 */
export function isRunningAsApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as NavigatorWithStandalone).standalone === true
  );
}

/**
 * Check if the device can install PWA
 */
export function canInstallPWA(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * Get install prompt
 */
export function getInstallPrompt(): Promise<void> {
  return new Promise((resolve) => {
    window.addEventListener("beforeinstallprompt", () => {
      resolve();
    });
  });
}
