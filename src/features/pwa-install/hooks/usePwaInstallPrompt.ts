import { useCallback, useEffect, useState } from "react";
import { isRunningAsApp } from "@/pwa/pwaConfig";

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
  const [showPWAApprovalQuestion, setShowPWAApprovalQuestion] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<DeferredPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    let abortController: AbortController | null = null;

    const installState =
      localStorage.getItem(PWA_INSTALLED_KEY) === "true" || isRunningAsApp();
    setIsAppInstalled(installState);

    const lastDismissedAt = Number(
      localStorage.getItem(PWA_DISMISSED_AT_KEY) ?? "0"
    );
    const isDismissedRecently =
      lastDismissedAt > 0 &&
      Date.now() - lastDismissedAt < PWA_DISMISS_DELAY_MS;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as DeferredPromptEvent);
      localStorage.removeItem(PWA_INSTALLED_KEY);
    };

    const onAppInstalled = () => {
      setIsAppInstalled(true);
      localStorage.setItem(PWA_INSTALLED_KEY, "true");
      setShowPWAApprovalQuestion(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    const runEffect = async () => {
      if (!installState && !isDismissedRecently) {
        setTimeout(() => {
          setShowPWAApprovalQuestion(true);
        }, 1250);
      }
      abortController = new AbortController();
    };

    void runEffect();
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      abortController?.abort();
    };
  }, []);

  useEffect(() => {
    let abortController: AbortController | null = null;

    const runEffect = async () => {
      if (isAppInstalled) {
        setShowPWAApprovalQuestion(false);
      }
    };

    abortController = new AbortController();

    void runEffect();

    return () => {
      abortController.abort();
    };
  }, [isAppInstalled]);

  const handleEnablePWA = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      setDeferredPrompt(null);

      if (choiceResult.outcome === "accepted") {
        setIsAppInstalled(true);
        localStorage.setItem("pwa-installed", "true");
        setShowPWAApprovalQuestion(false);
      } else {
        setShowPWAApprovalQuestion(false);
      }
      return;
    }

    const isSafari =
      typeof navigator !== "undefined" &&
      /Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent) &&
      !/CriOS/.test(navigator.userAgent);

    if (isSafari) {
      window.alert(
        "Per installare Followoo su Safari, usa il pulsante Condividi e poi seleziona Aggiungi a Home."
      );
    }

    setShowPWAApprovalQuestion(false);
  }, [deferredPrompt]);

  const handleDismissPWA = useCallback(() => {
    localStorage.setItem(PWA_DISMISSED_AT_KEY, Date.now().toString());
    setShowPWAApprovalQuestion(false);
  }, []);

  return {
    showPWAApprovalQuestion,
    handleEnablePWA,
    handleDismissPWA,
  };
}
