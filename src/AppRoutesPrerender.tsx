import App from "./App";
import { AppRouteTree } from "./AppRouteTree";
import { GetStarted } from "./pages/GetStarted";
import { InstructionsToStart } from "./pages/InstructionsToStart";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ResultPage } from "./pages/ResultPage";
import { SupportSection } from "./pages/SupportSection";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { Updates } from "./pages/Updates";

export function AppRoutesPrerender() {
  return (
    <AppRouteTree
      components={{
        Home: App,
        GetStarted,
        InstructionsToStart,
        PrivacyPolicy,
        ResultPage,
        SupportSection,
        TermsAndConditions,
        Updates,
      }}
    />
  );
}
