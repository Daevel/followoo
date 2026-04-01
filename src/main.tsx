import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

import { RouteAwareErrorBoundary } from "./components/errors/RouteAwareErrorBoundary.tsx";
import { GetStarted } from "./components/pages/GetStarted.tsx";
import { InstructionsToStart } from "./components/pages/InstructionsToStart.tsx";
import { ResultPage } from "./components/pages/ResultPage.tsx";
import { SupportSection } from "./components/pages/SupportSection.tsx";
import { TermsAndConditions } from "./components/pages/TermsAndConditions.tsx";
import { Updates } from "./components/pages/Updates.tsx";
import { ToastProvider } from "./components/providers/ToastProvider.tsx";
import { ScrollToTop } from "./components/ui/ScrollToTop";

createRoot(document.getElementById("root")!).render(
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
            <Route path="/support" element={<SupportSection />} />
            <Route path="/results" element={<ResultPage />} />
            <Route path="/updates" element={<Updates />} />
          </Routes>
        </RouteAwareErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
