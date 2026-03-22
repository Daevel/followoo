import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { NavBar } from "./components/ui/NavBar";
import { FeaturesSection } from "./components/ui/FeatureSection";
import { HeroSection } from "./components/ui/HeroSection";
import { PrivacySection } from "./components/ui/PrivacySection";
import { Questions } from "./components/ui/Questions";
import { FooterSignature } from "./components/ui/FooterSignature";

export default function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='hero-item']",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        },
      );

      gsap.fromTo(
        "[data-animate='hero-illustration']",
        {
          opacity: 0,
          y: 32,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <section className="px-18 text-foreground">
        <HeroSection />
        <FeaturesSection />
      </section>

      <PrivacySection />
      <Questions />

      <section className="relative overflow-hidden bg-background px-18 pt-10 h-130 text-foreground">
        <FooterSignature />

        <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[38%]">
          <div className="text-[220px] font-semibold leading-none text-foreground whitespace-nowrap">
            Followoo
          </div>
        </div>
      </section>
    </div>
  );
}
