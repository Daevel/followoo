import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { FooterSignature } from "./components/ui/FooterSignature";
import { FeaturesSection } from "./components/ui/hero-subsection/FeatureSection";
import { HeroSection } from "./components/ui/hero-subsection/HeroSection";
import { PrivacySection } from "./components/ui/hero-subsection/PrivacySection";
import { Questions } from "./components/ui/hero-subsection/Questions";
import { NavBar } from "./components/ui/NavBar";

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
    <div className="bg-background min-h-screen">
      <NavBar />

      <section className="text-foreground px-18">
        <HeroSection />
        <FeaturesSection />
      </section>

      <PrivacySection />
      <Questions />

      <section className="bg-background text-foreground relative h-180 overflow-hidden px-18 pt-10 lg:h-130">
        <FooterSignature />

        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[38%]">
          <div className="text-foreground text-[120px] leading-none font-semibold whitespace-nowrap md:text-[180px] lg:text-[220px]">
            Followoo
          </div>
        </div>
      </section>
    </div>
  );
}
