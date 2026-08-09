import { lazy, Suspense } from "react";
import { AppRouteTree } from "./AppRouteTree";

const Home = lazy(() => import("./App"));
const GetStarted = lazy(() =>
  import("./pages/GetStarted").then((module) => ({
    default: module.GetStarted,
  }))
);
const InstructionsToStart = lazy(() =>
  import("./pages/InstructionsToStart").then((module) => ({
    default: module.InstructionsToStart,
  }))
);
const PrivacyPolicy = lazy(() =>
  import("./pages/PrivacyPolicy").then((module) => ({
    default: module.PrivacyPolicy,
  }))
);
const ResultPage = lazy(() =>
  import("./pages/ResultPage").then((module) => ({
    default: module.ResultPage,
  }))
);
const SupportSection = lazy(() =>
  import("./pages/SupportSection").then((module) => ({
    default: module.SupportSection,
  }))
);
const TermsAndConditions = lazy(() =>
  import("./pages/TermsAndConditions").then((module) => ({
    default: module.TermsAndConditions,
  }))
);
const Updates = lazy(() =>
  import("./pages/Updates").then((module) => ({
    default: module.Updates,
  }))
);

export function AppRoutes() {
  return (
    <AppRouteTree
      components={{
        Home,
        GetStarted,
        InstructionsToStart,
        PrivacyPolicy,
        ResultPage,
        SupportSection,
        TermsAndConditions,
        Updates,
      }}
      wrapper={(routes) => <Suspense fallback={null}>{routes}</Suspense>}
    />
  );
}
