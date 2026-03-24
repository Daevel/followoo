import { Container } from "../../components/ui/Container";
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

export function FeaturesSection() {
  return (
    <section className="pt-20 pb-10">
      <Container>
        <div className="mx-auto max-w-6xl text-center">
          <div className="mx-auto max-w-2xl text-foreground">
            <h2 className="text-4xl font-semibold">
              No more snakes between your followers, guaranteed.
            </h2>
            <p className="mt-4">
              Get started in a few minutes by following my guide.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-[20px] bg-primary px-6 py-8 text-center text-foreground sm:px-8 sm:py-10"
              >
                <div className="mx-auto flex aspect-square w-24 sm:w-28 md:w-32 items-center justify-center rounded-[20px] bg-foreground">
                  <Icon
                    name="shield"
                    color="bg"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                  />
                </div>

                <div className="mt-8 flex flex-col items-center gap-y-4">
                  <h3>{card.title}</h3>
                  <p className="max-w-xs">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}