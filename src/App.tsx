import { useCallback, useEffect, useRef, useState } from "react";
import Seo from "@/components/ui/Seo";
import { initializePostHog } from "./analytics/posthogInit";
import { useLandingPageAnimations } from "./animations/pages/useLandingPageAnimations";
import { FooterSignature } from "./components/ui/FooterSignature";
import { FeaturesSection } from "./components/ui/hero-subsection/FeatureSection";
import { HeroSection } from "./components/ui/hero-subsection/HeroSection";
import { PrivacySection } from "./components/ui/hero-subsection/PrivacySection";
import { Questions } from "./components/ui/hero-subsection/Questions";
import { NavBar } from "./components/ui/NavBar";
import { PWANotification } from "./components/ui/PWANotification";
import { ScreenMount } from "./components/ui/ScreenMount";
import { isRunningAsApp } from "./pwa/pwaConfig";

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

export default function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [showPWAApprovalQuestion, setShowPWAApprovalQuestion] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<DeferredPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useLandingPageAnimations(rootRef);

  useEffect(() => {
    initializePostHog();

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

  return (
    <div ref={rootRef} className="bg-background w-full min-h-screen">
      <Seo
        title="Followoo - Compare Instagram Followers"
        description="See how your Instagram following compares to others. Track your growth and engagement."
        image={"https://followoo.app/favicon.svg"}
        canonical={"https://followoo.app"}
      />
      <NavBar />

      <section className="text-foreground px-5">
        <HeroSection />
        <FeaturesSection />
      </section>

      {showPWAApprovalQuestion && (
        <ScreenMount className="flex w-full" position="bottom-center">
          <PWANotification
            onInstall={handleEnablePWA}
            onDismiss={handleDismissPWA}
          />
        </ScreenMount>
      )}

      <PrivacySection />
      <Questions />

      <section
        data-section="footer-signature"
        className="bg-background text-foreground relative h-180 overflow-hidden px-18 pt-10 lg:h-130"
      >
        <div data-animate="footer-signature">
          <FooterSignature />
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[38%]">
          <div
            data-animate="footer-brand"
            className="text-foreground text-[120px] leading-none font-semibold whitespace-nowrap md:text-[180px] lg:text-[220px]"
          >
            Followoo
          </div>
        </div>
      </section>
    </div>
  );
}
