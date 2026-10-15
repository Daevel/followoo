import type { RefObject } from "react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { ProductPreview } from "./ProductPreview";

const proofPoints = ["100% local", "No API calls", "Open Source (MIT)"];

type HeroSectionProps = {
  /** Wraps the hero actions; the homepage watches it to reveal the nav CTA. */
  ctaRef?: RefObject<HTMLDivElement | null>;
};

export function HeroSection({ ctaRef }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section data-section="hero" className="pt-12 pb-20 md:pt-20 md:pb-24">
      <Container
        size="app"
        className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-14"
      >
        <div className="flex min-w-0 flex-col items-start text-start">
          <div data-animate="hero-trust">
            <Badge
              tone="brand"
              icon={
                <Icon
                  name="shield"
                  color="current"
                  width={12}
                  height={12}
                  aria-hidden="true"
                />
              }
            >
              Your data never leaves your device
            </Badge>
          </div>

          <h1
            data-animate="hero-title"
            className="text-fg mt-5 text-[40px] leading-[1.05] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-[56px]"
          >
            See who doesn&apos;t follow you back on{" "}
            <span className="text-brand-fg">Instagram</span>.
          </h1>

          <p className="text-fg-muted mt-5 max-w-[470px] text-base leading-7 sm:text-lg">
            Upload your official Instagram export: Followoo analyzes it in your
            browser and shows followers, mutuals and recent unfollowers.
          </p>

          <div
            ref={ctaRef}
            data-animate="hero-actions"
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Button
              size="lg"
              icon="arrowRight"
              iconPosition="right"
              onClick={() =>
                navigate("/get-started", { state: { isDemo: false } })
              }
            >
              Analyze your data
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon="eye"
              onClick={() =>
                navigate("/get-started", { state: { isDemo: true } })
              }
            >
              Try demo
            </Button>
          </div>

          <ul className="text-fg-muted mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
            {proofPoints.map((point) => (
              <li
                key={point}
                data-animate="hero-coin"
                className="inline-flex items-center gap-1.5"
              >
                <Icon
                  name="check"
                  color="current"
                  width={14}
                  height={14}
                  className="text-success"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div data-animate="hero-visual" className="min-w-0">
          <ProductPreview />
        </div>
      </Container>
    </section>
  );
}
