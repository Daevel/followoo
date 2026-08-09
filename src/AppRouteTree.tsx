import type { ComponentType, ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { RouteAwareErrorBoundary } from "./errors";

type AppRouteComponents = {
  Home: ComponentType;
  GetStarted: ComponentType;
  InstructionsToStart: ComponentType;
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
    InstructionsToStart,
    PrivacyPolicy,
    ResultPage,
    SupportSection,
    TermsAndConditions,
    Updates,
  } = components;

  const routes = (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/" element={<Home />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/instructions-to-start" element={<InstructionsToStart />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-and-policy" element={<PrivacyPolicy />} />
      <Route path="/support" element={<SupportSection />} />
      <Route path="/results" element={<ResultPage />} />
      <Route path="/updates" element={<Updates />} />
    </Routes>
  );

  return (
    <RouteAwareErrorBoundary>
      <ScrollToTop />
      {wrapper ? wrapper(routes) : routes}
    </RouteAwareErrorBoundary>
  );
}
