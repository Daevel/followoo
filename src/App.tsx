import { FooterSignature } from "./components/ui/FooterSignature";
import { Button } from "./components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "./components/ui/Container";
import { HeroIllustrations } from "./components/ui/HeroIllustrations";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function App() {
  const navigate = useNavigate();
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
    <section className="min-h-svh flex flex-col">
      <Container className="min-h-svh flex flex-col">
        <div
          ref={rootRef}
          className="flex flex-1 flex-col items-center pt-24 pb-6 text-center md:pt-28"
        >
          <div className="flex w-full max-w-180 flex-col items-center text-center">
            <h1
              data-animate="hero-item"
              className="text-5xl font-semibold leading-headers text-foreground md:text-6xl"
            >
              Followoo
            </h1>

            <p
              data-animate="hero-item"
              className="mt-5 max-w-[20rem] text-sm text-foreground/90 md:max-w-[34rem] md:text-lg md:leading-relaxed"
            >
              Analyze your Instagram followers privately using your official
              Instagram data export.
            </p>

            <p
              data-animate="hero-item"
              className="mt-4 max-w-[22rem] text-sm text-foreground/90 md:max-w-[36rem] md:text-base"
            >
              No login required · No API access · 100% local analysis
            </p>

            <p
              data-animate="hero-item"
              className="mt-3 text-sm text-foreground/70 md:text-base"
            >
              Your Instagram data never leaves your browser.
            </p>

            <Link
              data-animate="hero-item"
              to="/instructions-to-start"
              className="mt-8 text-foreground underline transition-colors hover:text-primary"
            >
              How to download your Instagram data →
            </Link>

            <div data-animate="hero-item" className="mt-8">
              <Button
                background="primary"
                foreground="foreground"
                icon="arrowRight"
                iconPosition="right"
                onClick={() => navigate("/get-started")}
                className="min-w-52 px-8"
              >
                Analyze my followers
              </Button>
            </div>

            <p
              data-animate="hero-item"
              className="mt-3 text-xs text-foreground/60 md:text-sm"
            >
              Works with the official Instagram export (.zip)
            </p>

            <div
              data-animate="hero-item"
              className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-foreground/80"
            >
              <span>✓ Mutual followers</span>
              <span>✓ Unfollowers</span>
              <span>✓ Recent unfollowers</span>
            </div>

            <div
              data-animate="hero-illustration"
              className="mt-10 w-full pt-4 md:mt-12"
            >
              <HeroIllustrations />
            </div>
          </div>
        </div>

        <FooterSignature />
      </Container>
    </section>
  );
}