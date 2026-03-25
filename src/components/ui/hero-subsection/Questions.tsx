import { Icon } from "../../../components/ui/Icon";
import { DropdownCard } from "@/components/ui/DropdownCard.tsx";

const cards = [
  {
    title: "Is my Instagram data safe?",
    description:
      "Yes. Your data is never uploaded anywhere. Everything runs locally in your browser, so your information stays on your device at all times.",
  },
  {
    title: "Do you store my data?",
    description:
      "No. We don’t collect, store, or track any of your personal data. The app works entirely offline using your own exported files.",
  },
  {
    title: "Do I need to log in?",
    description:
      "No login is required. You don’t need to connect your Instagram account — just upload your exported data and start analyzing it instantly.",
  },
  {
    title: "Why do I need to download my data?",
    description:
      "Instagram doesn’t provide direct access to your full follower data. By using your official export, we can accurately analyze your followers and show who doesn’t follow you back.",
  },
];

export function Questions() {
  return (
    <section className="bg-accent/90 w-full rounded-b-[60px]">
      <div className="px-18 py-16">
        <div className="text-foreground mx-auto max-w-5xl text-center">
          <div className="flex justify-center">
            <div className="border-foreground/90 bg-primary flex h-15 w-15 items-center justify-center rounded-full border">
              <Icon name="help" color="foreground" width={30} height={30} />
            </div>
          </div>

          <h1 className="hero-h1 mt-6 font-semibold">
            Got questions? <br /> Here's the answers.
          </h1>

          <div className="mt-12 flex flex-col items-center gap-y-5">
            {cards.map((card) => (
              <DropdownCard
                key={card.title}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
