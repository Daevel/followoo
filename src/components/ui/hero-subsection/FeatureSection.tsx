import { useSectionReveal } from "@/lib/useSectionReveal";
import { useRef } from "react";
import { Card } from "../Card";
import type { IconName } from "../Icon";

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

  useSectionReveal(sectionRef, {
    triggerStart: "top 70%",
  });

  return (
    <section ref={sectionRef} className="pt-20 pb-10">
      <div className="mx-auto max-w-6xl text-center">
        <div className="text-foreground mx-auto max-w-2xl">
          <h2 className="section-heading text-4xl font-semibold">
            No more snakes between your followers, guaranteed.
          </h2>
          <p className="section-subheading mt-4">
            Get started in a few minutes by following my guide.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card
              title={card.title}
              description={card.text}
              iconName={card.iconName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
