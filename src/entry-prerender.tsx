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
      <MemoryRouter initialEntries={[route]}>
        <ToastProvider>
          <AppRoutesPrerender />
        </ToastProvider>
      </MemoryRouter>
    </HelmetProvider>
  );

  return {
    appHtml,
    helmet: helmetContext.helmet,
  };
}
