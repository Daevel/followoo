import { DropdownCard } from "@/components/ui/DropdownCard.tsx";
import { useRef } from "react";
import { Icon } from "../../../components/ui/Icon";

const cards = [
  {
    title: "Is my Instagram data safe?",
    description:
      "Yes. Your data is never uploaded anywhere. Everything runs locally in your browser, so your information stays on your device at all times.",
  },
  {
    title: "Do you store my data?",
    description:
      "No. We don't collect, store, or track any of your personal data. The app works entirely offline using your own exported files.",
  },
  {
    title: "Do I need to log in?",
    description:
      "No login is required. You don't need to connect your Instagram account — just upload your exported data and start analyzing it instantly.",
  },
  {
    title: "Why do I need to download my data?",
    description:
      "Instagram doesn't provide direct access to your full follower data. By using your official export, we can accurately analyze your followers and show who doesn't follow you back.",
  },
];

export function Questions() {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef}
      data-section="faq"
      className="bg-accent/90 from-primary to-accent/90 flex w-full flex-col items-center rounded-b-[60px] bg-linear-to-b"
    >
      <div className="px-18 py-16">
        <div className="text-foreground mx-auto max-w-5xl text-center">
          <div className="flex justify-center">
            <div
              data-animate="section-icon"
              className="faq-icon border-foreground/90 bg-primary shadow-primary-hover flex h-15 w-15 items-center justify-center rounded-full border"
            >
              <Icon name="help" color="foreground" width={30} height={30} />
            </div>
          </div>

          <h1
            data-animate="section-heading"
            className="faq-heading hero-h1 mt-6 font-semibold"
          >
            Got questions? <br /> Here&apos;s the answers.
          </h1>

          <div className="mt-12 flex flex-col justify-center gap-y-5">
            {cards.map((card) => (
              <div
                key={card.title}
                data-animate="faq-card"
                className="faq-card w-full items-center justify-center"
              >
                <DropdownCard
                  title={card.title}
                  description={card.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
