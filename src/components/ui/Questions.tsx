import { Icon } from "../../components/ui/Icon";

export function Questions() {
  return (
    <section className="w-full bg-accent rounded-b-[60px]">
      <div className="px-18 py-16">
        <div className="max-w-5xl mx-auto text-center text-foreground">
          <div className="flex justify-center">
            <div className="flex h-15 w-15 items-center justify-center rounded-full border border-foreground/20 bg-accent">
              <Icon name="shield" color="foreground" width={30} height={30} />
            </div>
          </div>

          <h2 className="mt-6 text-4xl font-semibold">Got questions?</h2>

          <p className="mt-4">Here's the answers.</p>
        </div>
      </div>
    </section>
  );
}
