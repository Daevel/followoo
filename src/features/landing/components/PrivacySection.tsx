import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";

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

function FlowNode({
  icon,
  title,
  caption,
  off = false,
}: {
  icon: IconName;
  title: string;
  caption: string;
  off?: boolean;
}) {
  return (
    <div
      className={
        off
          ? "border-line-strong text-fg-faint flex flex-col items-center gap-2 rounded-xl border border-dashed p-4 text-center"
          : "border-brand-fg/35 bg-surface-2 text-brand-fg flex flex-col items-center gap-2 rounded-xl border p-4 text-center"
      }
    >
      <Icon
        name={icon}
        color="current"
        width={22}
        height={22}
        aria-hidden="true"
      />
      <span className="text-fg text-sm font-semibold">{title}</span>
      <span className="text-fg-muted text-xs">{caption}</span>
    </div>
  );
}

export function PrivacySection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef}
      data-section="privacy"
      className="border-line-subtle border-t py-20 md:py-24"
    >
      <Container
        size="app"
        className="grid items-center gap-12 text-start lg:grid-cols-2 lg:gap-16"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              data-animate="section-icon"
              className="border-brand-fg/20 bg-brand-fg/10 text-brand-fg flex size-8 items-center justify-center rounded-control border"
            >
              <Icon
                name="shield"
                color="current"
                width={16}
                height={16}
                aria-hidden="true"
              />
            </span>
            <p className="text-brand-fg text-[13px] font-medium">
              Your privacy? Glad you asked.
            </p>
          </div>

          <h2
            data-animate="section-heading"
            className="text-fg mt-5 text-2xl leading-[1.35] font-medium tracking-[-0.02em] sm:text-[26px]"
          >
            &ldquo;I designed Followoo to be private by default. Your data stays
            where it belongs - on your device.&rdquo;
          </h2>

          <div
            data-animate="section-subheading"
            className="mt-6 flex items-center gap-3"
          >
            <span
              aria-hidden="true"
              className="border-line-strong bg-surface-2 text-fg flex size-9 items-center justify-center rounded-full border text-[13px] font-semibold"
            >
              LA
            </span>
            <span className="text-sm">
              <span className="text-fg block">Luigi Avitabile</span>
              <span className="text-fg-muted text-[13px]">
                Creator of Followoo
              </span>
            </span>
          </div>

          <ul className="border-line-subtle mt-8 flex flex-col border-t">
            {cards.map((card) => (
              <li
                key={card.title}
                data-animate="privacy-card"
                className="border-line-subtle flex gap-3 border-b py-4"
              >
                <Icon
                  name={card.iconName}
                  color="current"
                  width={18}
                  height={18}
                  className="text-brand-fg mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-fg-muted text-sm leading-6">
                  <span className="text-fg block font-medium">
                    {card.title}
                  </span>
                  {card.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-animate="section-subheading"
          className="border-line-subtle bg-surface-1 shadow-elev-1 min-w-0 rounded-card border p-6 sm:p-7"
        >
          <p className="text-fg-muted text-xs font-medium">
            Where your data goes
          </p>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <FlowNode
              icon="laptop"
              title="Your browser"
              caption="Reads and analyzes"
            />
            <span className="relative flex w-10 items-center justify-center sm:w-16">
              <span className="border-line-strong absolute inset-x-0 top-1/2 border-t border-dashed" />
              <span className="border-danger/40 bg-surface-1 text-danger relative flex size-7 items-center justify-center rounded-full border">
                <Icon
                  name="close"
                  color="current"
                  width={12}
                  height={12}
                  aria-hidden="true"
                />
              </span>
            </span>
            <FlowNode
              icon="code"
              title="Servers"
              caption="Never involved"
              off
            />
          </div>

          <div className="border-line-subtle mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <p className="text-fg-muted text-[13px]">
              The code is public: check it yourself.
            </p>
            <a
              href="https://github.com/Daevel/followoo"
              target="_blank"
              rel="noreferrer"
              className="text-fg hover:bg-surface-2 focus-visible:shadow-ring inline-flex h-8 items-center gap-2 rounded-control px-3 text-[13px] font-medium transition-colors focus-visible:outline-none"
            >
              <Icon
                name="code"
                color="current"
                width={14}
                height={14}
                aria-hidden="true"
              />
              View on GitHub
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
