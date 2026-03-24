import { Icon } from "../../components/ui/Icon";

const cards = [
  {
    title: "Simple",
    text: "Download your Instagram data following my guide here",
  },
  {
    title: "Safe",
    text: "Use your export inside the getting started page and start to analyze your data.",
  },
  {
    title: "Fast",
    text: "See who unfollowed your using by filtering your friends between your tabs.",
  },
];

export function PrivacySection() {
  return (
    <section className="w-full bg-accent/90 rounded-t-[60px] mt-16">
      <div className="px-18 py-16">
        <div className="max-w-5xl mx-auto text-center text-foreground">
          <div className="flex justify-center">
            <div className="flex h-15 w-15 items-center justify-center rounded-full border border-foreground/90 bg-accent">
              <Icon name="shield" color="foreground" width={30} height={30} />
            </div>
          </div>

          <h1 className="mt-6 hero-h1 font-semibold">
            Your privacy? <br/> Glad you asked.
          </h1>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-[20px] bg-primary px-6 py-8 text-center text-foreground sm:px-8 sm:py-10"
              >
                <div className="mx-auto flex aspect-square w-24 sm:w-28 md:w-32 items-center justify-center rounded-[20px] bg-foreground">
                  <Icon name="shield" color="bg" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
                </div>

                <div className="mt-8 flex flex-col items-center gap-y-4">
                  <h3>{card.title}</h3>
                  <p className="max-w-xs">{card.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2>I designed Followoo to be private by default. Your data stays where it belongs - on your device.</h2>
          </div>
        </div>
      </div>
    </section>
  );
}
