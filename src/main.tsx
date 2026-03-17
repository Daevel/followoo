import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { GetStarted } from "./components/pages/GetStarted.tsx";
import { InstructionsToStart } from "./components/pages/InstructionsToStart.tsx";
import { TermsAndConditions } from "./components/pages/TermsAndConditions.tsx";
import { HelpSection } from "./components/pages/HelpSection.tsx";
import { ResultPage } from "./components/pages/ResultPage.tsx";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { ToastProvider } from "./components/providers/ToastProvider.tsx";
import { Updates } from "./components/pages/Updates.tsx";
import { RouteAwareErrorBoundary } from "./components/errors/RouteAwareErrorBoundary.tsx";

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
            <Route path="/help" element={<HelpSection />} />
            <Route path="/results" element={<ResultPage />} />
            <Route path="/updates" element={<Updates />} />
          </Routes>
        </RouteAwareErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
