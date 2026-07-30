import { Navigate, Route, Routes } from "react-router";
import App from "./App.tsx";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { RouteAwareErrorBoundary } from "./errors";
import { GetStarted } from "./pages/GetStarted.tsx";
import { InstructionsToStart } from "./pages/InstructionsToStart.tsx";
import { PrivacyPolicy } from "./pages/PrivacyPolicy.tsx";
import { ResultPage } from "./pages/ResultPage.tsx";
import { SupportSection } from "./pages/SupportSection.tsx";
import { TermsAndConditions } from "./pages/TermsAndConditions.tsx";
import { Updates } from "./pages/Updates.tsx";

export function AppRoutes() {
  return (
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
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-and-policy" element={<PrivacyPolicy />} />
        <Route path="/support" element={<SupportSection />} />
        <Route path="/results" element={<ResultPage />} />
        <Route path="/updates" element={<Updates />} />
      </Routes>
    </RouteAwareErrorBoundary>
  );
}
