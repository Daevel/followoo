import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

import { RouteAwareErrorBoundary } from "./components/errors/RouteAwareErrorBoundary.tsx";
import { ToastProvider } from "./components/providers/ToastProvider.tsx";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { GetStarted } from "./pages/GetStarted.tsx";
import { InstructionsToStart } from "./pages/InstructionsToStart.tsx";
import { PrivacyPolicy } from "./pages/PrivacyPolicy.tsx";
import { ResultPage } from "./pages/ResultPage.tsx";
import { SupportSection } from "./pages/SupportSection.tsx";
import { TermsAndConditions } from "./pages/TermsAndConditions.tsx";
import { Updates } from "./pages/Updates.tsx";
import { registerServiceWorker } from "./pwa/pwaRegister.ts";

// Register PWA Service Worker
registerServiceWorker();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <RouteAwareErrorBoundary>
          <ScrollToTop />
          <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<App />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route
              path="/instructions-to-start"
              element={<InstructionsToStart />}
            />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/privacy-and-policy" element={<PrivacyPolicy />} />
            <Route path="/support" element={<SupportSection />} />
            <Route path="/results" element={<ResultPage />} />
            <Route path="/updates" element={<Updates />} />
          </Routes>
        </RouteAwareErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
