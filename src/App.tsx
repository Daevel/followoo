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
          className="flex flex-col items-center pt-30 pb-6 text-center flex-1"
        >
          <div className="flex flex-col items-center text-center">
            <h1
              data-animate="hero-item"
              className="text-4xl font-semibold leading-headers text-foreground md:text-5xl"
            >
              Followoo
            </h1>

            <p
              data-animate="hero-item"
              className="mt-4 max-w-[18rem] text-sm text-foreground/90 md:max-w-[24rem] md:text-foreground"
            >
              Welcome to follow/unfollow instagram compare app
            </p>

            <Link
              data-animate="hero-item"
              to="/instructions-to-start"
              className="mt-8 text-foreground underline"
            >
              Don't know how to start?
            </Link>

            <div data-animate="hero-item" className="mt-10">
              <Button
                background="primary"
                foreground="foreground"
                icon="arrowRight"
                iconPosition="right"
                onClick={() => navigate("/get-started")}
              >
                Get started
              </Button>
            </div>

            <div
              data-animate="hero-illustration"
              className="mt-auto w-full pt-12"
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
