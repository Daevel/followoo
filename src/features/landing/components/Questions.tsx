import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { DropdownCard } from "@/components/ui/DropdownCard.tsx";
import { Icon } from "@/components/ui/Icon";

export const faqCards = [
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
      "You never need to connect your Instagram account. Your first analysis works without signing up; after that, a free Followoo account is required. Your export is still analyzed only in your browser.",
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
      className="border-line-subtle border-t py-20 md:py-24"
    >
      <Container
        size="app"
        className="grid gap-10 text-start lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <span
              data-animate="section-icon"
              className="border-brand-fg/20 bg-brand-fg/10 text-brand-fg flex size-8 items-center justify-center rounded-control border"
            >
              <Icon
                name="help"
                color="current"
                width={16}
                height={16}
                aria-hidden="true"
              />
            </span>
            <p className="text-brand-fg text-[13px] font-medium">FAQ</p>
          </div>

          <h2
            data-animate="section-heading"
            className="text-fg mt-4 text-[28px] leading-tight font-semibold tracking-[-0.03em] sm:text-[32px]"
          >
            Got questions?
          </h2>
          <p
            data-animate="section-subheading"
            className="text-fg-muted mt-3 text-base leading-7"
          >
            Here are the answers.
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          {faqCards.map((card) => (
            <div key={card.title} data-animate="faq-card">
              <DropdownCard title={card.title} description={card.description} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
