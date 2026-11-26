import type { ComponentType, ReactNode } from "react";
import { Route, Routes } from "react-router";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { RouteAwareErrorBoundary } from "./errors";

type AppRouteComponents = {
  Home: ComponentType;
  GetStarted: ComponentType;
  History: ComponentType;
  InstructionsToStart: ComponentType;
  NotFound: ComponentType;
  PrivacyPolicy: ComponentType;
  ResultPage: ComponentType;
  SupportSection: ComponentType;
  TermsAndConditions: ComponentType;
  Updates: ComponentType;
};

type AppRouteTreeProps = {
  components: AppRouteComponents;
  wrapper?: (children: ReactNode) => ReactNode;
};

export function AppRouteTree({ components, wrapper }: AppRouteTreeProps) {
  const {
    Home,
    GetStarted,
    History,
    InstructionsToStart,
    NotFound,
    PrivacyPolicy,
    ResultPage,
    SupportSection,
    TermsAndConditions,
    Updates,
  } = components;

  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/instructions-to-start" element={<InstructionsToStart />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-and-policy" element={<PrivacyPolicy />} />
      <Route path="/support" element={<SupportSection />} />
      <Route path="/results" element={<ResultPage />} />
      <Route path="/history" element={<History />} />
      <Route path="/updates" element={<Updates />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
    <RouteAwareErrorBoundary>
      <ScrollToTop />
      {wrapper ? wrapper(routes) : routes}
    </RouteAwareErrorBoundary>
  );
}
