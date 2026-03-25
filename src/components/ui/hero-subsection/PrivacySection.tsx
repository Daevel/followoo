import { Icon } from "../Icon";

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
    <section className="bg-accent/90 mt-16 w-full rounded-t-[60px]">
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
              <div
                key={card.title}
                className="bg-primary text-foreground rounded-[20px] px-6 py-8 text-center sm:px-8 sm:py-10"
              >
                <div className="bg-foreground mx-auto flex aspect-square w-24 items-center justify-center rounded-[20px] sm:w-28 md:w-32">
                  <Icon
                    name="shield"
                    color="bg"
                    className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
                  />
                </div>

                <div className="mt-8 flex flex-col items-center gap-y-4">
                  <h3>{card.title}</h3>
                  <p className="max-w-xs">{card.text}</p>
                </div>
              </div>
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
