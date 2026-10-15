import { useRef } from "react";
import { Link } from "react-router";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import type { IconName } from "@/components/ui/Icon";

const cards = [
  {
    title: "Easy setup",
    text: "Download your Instagram data and get started in minutes.",
    iconName: "download" as IconName,
  },
  {
    title: "Private by design",
    text: "Your data stays on your device. No uploads, no API calls.",
    iconName: "lock" as IconName,
  },
  {
    title: "Instant insights",
    text: "Quickly see who unfollowed you with simple filters.",
    iconName: "eye" as IconName,
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef}
      data-section="features"
      className="border-line-subtle border-t py-20 md:py-24"
    >
      <Container size="app" className="text-start">
        <p className="text-brand-fg text-[13px] font-medium">How it works</p>
        <h2
          data-animate="section-heading"
          className="text-fg mt-2 max-w-2xl text-[28px] leading-tight font-semibold tracking-[-0.03em] sm:text-4xl"
        >
          No more guessing who&apos;s real and who&apos;s not
        </h2>

        <p
          data-animate="section-subheading"
          className="text-fg-muted mt-4 max-w-xl text-base leading-7"
        >
          Get started in a few minutes by following the step-by-step{" "}
          <Link
            to="/instructions-to-start"
            className="text-brand-fg underline-offset-2 hover:underline"
          >
            guide
          </Link>
          .
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} data-animate="feature-card">
              <Card
                title={card.title}
                description={card.text}
                iconName={card.iconName}
                tone="brand"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
