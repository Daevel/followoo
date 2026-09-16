import { ClerkProvider } from "@clerk/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router";
import { AppRoutes } from "./AppRoutes.tsx";
import { initializePostHog } from "./analytics/posthogInit";
import { initializeSentry } from "./errors/sentryInit";
import "./index.css";

import { ToastProvider } from "./providers/ToastProvider.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

void initializeSentry();
void initializePostHog();

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  console.warn(
    "Missing VITE_CLERK_PUBLISHABLE_KEY: sign-in/account UI will not work."
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <HelmetProvider>
        <BrowserRouter>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ClerkProvider>
  </StrictMode>
);
