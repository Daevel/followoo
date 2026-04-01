import { useRef } from "react";

import { useLandingPageAnimations } from "./animations/pages/useLandingPageAnimations";
import { FooterSignature } from "./components/ui/FooterSignature";
import { FeaturesSection } from "./components/ui/hero-subsection/FeatureSection";
import { HeroSection } from "./components/ui/hero-subsection/HeroSection";
import { PrivacySection } from "./components/ui/hero-subsection/PrivacySection";
import { Questions } from "./components/ui/hero-subsection/Questions";
import { NavBar } from "./components/ui/NavBar";

export default function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLandingPageAnimations(rootRef);

  return (
    <div ref={rootRef} className="bg-background min-h-screen">
      <NavBar />

      <section className="text-foreground px-18">
        <HeroSection />
        <FeaturesSection />
      </section>

      <PrivacySection />
      <Questions />

      <section
        data-section="footer-signature"
        className="bg-background text-foreground relative h-180 overflow-hidden px-18 pt-10 lg:h-130"
      >
        <div data-animate="footer-signature">
          <FooterSignature />
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[38%]">
          <div
            data-animate="footer-brand"
            className="text-foreground text-[120px] leading-none font-semibold whitespace-nowrap md:text-[180px] lg:text-[220px]"
          >
            Followoo
          </div>
        </div>
      </section>
    </div>
  );
}
