import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router";
import { AppRoutes } from "./AppRoutes.tsx";
import { initializePostHog } from "./analytics/posthogInit";
import "./index.css";

import { ToastProvider } from "./providers/ToastProvider.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

initializePostHog();

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
