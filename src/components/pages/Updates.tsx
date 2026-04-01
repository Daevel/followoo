import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { handleAppError } from "@/errors";
import { useEffect, useRef, useState } from "react";
import { UnknownErrorPage } from "../errors/ui/UnknownErrorPage";
import { BadgeVersion } from "../ui/BadgeVersion";
import { Container } from "../ui/Container";
import { NavBar } from "../ui/NavBar";
import { Separator } from "../ui/Separator";
import { SkeletonLoaderCircle } from "../ui/SkeletonLoaderCircle";

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
  className?: string;
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
  className,
}: {
  title: string;
  description: string;
  groups: UpdateChangeGroup[];
  badgeVersion: string;
  badgeBackgroundColor?: string;
  releaseDate: string;
  className?: string;
}) {
  return (
    <section className={`text-foreground w-full ${className ?? ""}`}>
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

  useStandardPageAnimation(rootRef, {
    animateItems: !isLoading && !hasError && updates.length > 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function retrieveUpdates() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch("/api/updates");

        if (!response.ok) {
          handleAppError("error", {
            fallbackTitle: "There was a generic error.",
          });
          return;
        }

        const payload = (await response.json()) as UpdatesApiResponse;

        if (!isMounted) {
          return;
        }

        setUpdates(payload.data ?? []);
      } catch (error) {
        handleAppError(error, {
          fallbackTitle: "Unable to load updates right now.",
        });

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
            data-page-animate="heading"
            className="leading-headers text-foreground text-4xl font-semibold md:text-5xl"
          >
            Followoo updates
          </h1>

          <p data-page-animate="subheading" className="text-foreground/70 mt-3">
            Here you can find the latest improvements and features added to
            Followoo.
          </p>

          <div
            data-page-animate="content"
            className="mt-10 flex w-full flex-col gap-8"
          >
            {isLoading ? (
              <div className="flex flex-row items-center justify-center p-20 align-middle">
                <SkeletonLoaderCircle size="lg" color="primary" />
              </div>
            ) : hasError ? (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <UnknownErrorPage />
              </div>
            ) : updates.length === 0 ? (
              <div className="text-foreground/70">
                No updates available yet.
              </div>
            ) : (
              updates.map((update, index) => (
                <div
                  key={update.id}
                  data-page-animate="item"
                  className="update-heading w-full"
                >
                  <UpdateSection
                    className="update-card"
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
