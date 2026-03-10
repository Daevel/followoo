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


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
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
        <Route path="/help" element={<HelpSection />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
