import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BadgeVersion } from "../ui/BadgeVersion";
import { Container } from "../ui/Container";
import { NavBar } from "../ui/NavBar";
import { Separator } from "../ui/Separator";

type UpdateChangeGroup = {
  label: string;
  tone: "accent" | "primary";
  items: string[];
};

type UpdateEntry = {
  id: string;
  productName: string;
  version: string;
  releaseDate: string;
  description: string;
  badgeBackgroundColor?: string;
  groups: UpdateChangeGroup[];
};

type UpdatesApiResponse = {
  data: UpdateEntry[];
};

function UpdateSection({
  title,
  description,
  groups,
  badgeVersion,
  badgeBackgroundColor,
  releaseDate,
}: {
  title: string;
  description: string;
  groups: UpdateChangeGroup[];
  badgeVersion: string;
  badgeBackgroundColor?: string;
  releaseDate: string;
}) {
  return (
    <section className="text-foreground w-full">
      <div className="flex flex-row items-center gap-3">
        <h2 className="l1-b">{title}</h2>
        <BadgeVersion
          version={badgeVersion}
          backgroundColor={badgeBackgroundColor}
        />
      </div>

      <div className="flex">
        <span className="text-foreground/80 mt-3 text-sm">{releaseDate}</span>
      </div>

      <div className="flex">
        <div className="p1-r mt-5 w-full">
          <p>{description}</p>

          {groups.map((group) => {
            const toneClass =
              group.tone === "primary" ? "text-primary/80" : "text-accent/80";

            return (
              <div key={group.label}>
                <p className={`${toneClass} mt-4 font-medium`}>{group.label}</p>

                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Updates() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [updates, setUpdates] = useState<UpdateEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='hero-item']",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [updates, isLoading, hasError]);

  useEffect(() => {
    let isMounted = true;

    async function retrieveUpdates() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch("/api/updates");

        if (!response.ok) {
          throw new Error("Failed to retrieve updates");
        }

        const payload = (await response.json()) as UpdatesApiResponse;

        if (!isMounted) {
          return;
        }

        setUpdates(payload.data ?? []);
      } catch (error) {
        console.error("Failed to load updates", error);

        if (!isMounted) {
          return;
        }

        setHasError(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void retrieveUpdates();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />

      <Container className="flex min-h-svh flex-col">
        <div
          ref={rootRef}
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start pt-16 pb-10"
        >
          <h1
            data-animate="hero-item"
            className="leading-headers text-foreground text-4xl font-semibold md:text-5xl"
          >
            Followoo updates
          </h1>

          <p data-animate="hero-item" className="text-foreground/70 mt-3">
            Here you can find the latest improvements and features added to
            Followoo.
          </p>

          <div className="mt-10 flex w-full flex-col gap-8">
            {isLoading ? (
              <div data-animate="hero-item" className="text-foreground/70">
                Loading updates...
              </div>
            ) : hasError ? (
              <div
                data-animate="hero-item"
                className="text-destructive text-foreground"
              >
                Unable to load updates right now.
              </div>
            ) : updates.length === 0 ? (
              <div data-animate="hero-item" className="text-foreground/70">
                No updates available yet.
              </div>
            ) : (
              updates.map((update, index) => (
                <div
                  key={update.id}
                  data-animate="hero-item"
                  className="w-full"
                >
                  <UpdateSection
                    title={update.productName}
                    description={update.description}
                    groups={update.groups}
                    badgeVersion={update.version}
                    badgeBackgroundColor={update.badgeBackgroundColor}
                    releaseDate={update.releaseDate}
                  />

                  {index < updates.length - 1 ? (
                    <div className="mt-8">
                      <Separator variant="foreground" />
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
