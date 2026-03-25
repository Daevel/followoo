import { useSectionReveal } from "@/lib/useSectionReveal";
import { useRef } from "react";
import { Card } from "../Card";
import { Icon, type IconName } from "../Icon";

const cards = [
  {
    title: "100% local",
    text: "Everything runs directly in your browser. Your data never leaves your device.",
    iconName: "laptop" as IconName,
  },
  {
    title: "No API access",
    text: "Followoo does not connect to your Instagram account or use any external APIs.",
    iconName: "linkOff" as IconName,
  },
  {
    title: "You stay in control",
    text: "You decide what to upload and when. Nothing is stored or tracked.",
    iconName: "userCheck" as IconName,
  },
];

export function PrivacySection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useSectionReveal(sectionRef, {
    triggerStart: "top 70%",
  });

  return (
    <section
      ref={sectionRef}
      className="bg-accent/90 from-accent/90 to-primary mt-16 w-full rounded-t-[60px] bg-linear-to-b"
    >
      <div className="px-18 py-16">
        <div className="text-foreground mx-auto max-w-5xl text-center">
          <div className="flex justify-center">
            <div className="border-foreground/90 bg-accent flex h-15 w-15 items-center justify-center rounded-full border">
              <Icon name="shield" color="foreground" width={30} height={30} />
            </div>
          </div>

          <h1 className="hero-h1 mt-6 font-semibold">
            Your privacy? <br /> Glad you asked.
          </h1>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Card
                title={card.title}
                description={card.text}
                iconName={card.iconName}
              />
            ))}
          </div>

          <div className="mt-20">
            <h2>
              I designed Followoo to be private by default. Your data stays
              where it belongs - on your device.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
