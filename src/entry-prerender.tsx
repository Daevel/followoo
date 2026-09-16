import { ClerkProvider } from "@clerk/react";
import { renderToString } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { MemoryRouter } from "react-router";
import { AppRoutesPrerender } from "./AppRoutesPrerender";
import { ToastProvider } from "./providers/ToastProvider";

HelmetProvider.canUseDOM = false;

type HelmetContext = {
  helmet?: HelmetServerState;
};

export function render(route: string) {
  const helmetContext: HelmetContext = {};
  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      {/* NavBar renders Clerk's <Show>/<SignInButton>/<UserButton>, which
          throw without a ClerkProvider ancestor - this SSR entry is
          separate from src/main.tsx's client entry, so it needs its own. */}
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      >
        <MemoryRouter initialEntries={[route]}>
          <ToastProvider>
            <AppRoutesPrerender />
          </ToastProvider>
        </MemoryRouter>
      </ClerkProvider>
    </HelmetProvider>
  );

  return {
    appHtml,
    helmet: helmetContext.helmet,
  };
}
