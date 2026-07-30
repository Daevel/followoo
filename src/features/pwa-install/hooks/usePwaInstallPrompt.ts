import { useEffect, useRef } from "react";
import { isRunningAsApp } from "@/pwa/pwaConfig";
import { toastService } from "@/services/toastService";

interface DeferredPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

const PWA_INSTALLED_KEY = "pwa-installed";
const PWA_DISMISSED_AT_KEY = "pwa-dismissed-at";
const PWA_DISMISS_DELAY_MS = 24 * 60 * 60 * 1000;

export function usePwaInstallPrompt() {
  const deferredPromptRef = useRef<DeferredPromptEvent | null>(null);
  const isAppInstalledRef = useRef(false);

  useEffect(() => {
    const installState =
      localStorage.getItem(PWA_INSTALLED_KEY) === "true" || isRunningAsApp();
    isAppInstalledRef.current = installState;

    const lastDismissedAt = Number(
      localStorage.getItem(PWA_DISMISSED_AT_KEY) ?? "0"
    );
    const isDismissedRecently =
      lastDismissedAt > 0 &&
      Date.now() - lastDismissedAt < PWA_DISMISS_DELAY_MS;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPromptRef.current = event as DeferredPromptEvent;
      localStorage.removeItem(PWA_INSTALLED_KEY);
    };

    const onAppInstalled = () => {
      isAppInstalledRef.current = true;
      localStorage.setItem(PWA_INSTALLED_KEY, "true");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    const timeoutId = window.setTimeout(() => {
      if (installState || isDismissedRecently || isAppInstalledRef.current) {
        return;
      }

      toastService.info({
        title: "Install Followoo as an app",
        description:
          "Add Followoo to your device for faster access and an app-like experience.",
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: "Install app",
          onClick: async () => {
            const deferredPrompt = deferredPromptRef.current;

            if (deferredPrompt) {
              await deferredPrompt.prompt();
              const choiceResult = await deferredPrompt.userChoice;
              deferredPromptRef.current = null;

              if (choiceResult.outcome === "accepted") {
                isAppInstalledRef.current = true;
                localStorage.setItem(PWA_INSTALLED_KEY, "true");
              }

              return;
            }

            window.alert(
              "To install Followoo, use your browser menu and choose Add to Home Screen or Install app."
            );
          },
        },
        onClose: () => {
          localStorage.setItem(PWA_DISMISSED_AT_KEY, Date.now().toString());
        },
      });
    }, 1250);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);
}
