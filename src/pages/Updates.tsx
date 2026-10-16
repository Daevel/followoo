import clsx from "clsx";
import { useEffect, useId, useRef, useState } from "react";
import { useStandardPageAnimation } from "@/animations/pages/useStandardPageAnimation";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { NavBar } from "@/components/ui/NavBar";
import { PageHeader } from "@/components/ui/PageHeader";
import Seo from "@/components/ui/Seo";
import { Skeleton } from "@/components/ui/Skeleton";
import { handleAppError, UnknownErrorPage } from "@/errors";
import { getApiUrl } from "@/lib/api";

type UpdateChangeGroup = {
  label: string;
  tone: "accent" | "foreground" | "primary";
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

// The stored descriptions open with "Version X.Y.Z"; the version is already
// shown next to the entry, so it is dropped from the sentence.
function describe(description: string, version: string) {
  const text = description.replace(`Version ${version} `, "").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function firstSentence(text: string) {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

// Entries open by default: the newest ones. Older ones start as a one-line row.
const OPEN_BY_DEFAULT = 2;

function ReleaseEntry({
  update,
  isLatest,
  defaultOpen,
}: {
  update: UpdateEntry;
  isLatest: boolean;
  defaultOpen: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();
  const description = describe(update.description, update.version);
  const changes = update.groups.reduce(
    (total, group) => total + group.items.length,
    0
  );

  const when = (
    <>
      <span className="text-fg font-semibold tabular-nums">
        v{update.version}
      </span>
      <time className="text-fg-muted text-[13px]">{update.releaseDate}</time>
    </>
  );

  if (!isOpen) {
    return (
      <article className="border-line-subtle border-t text-start">
        <button
          type="button"
          aria-expanded={false}
          aria-controls={panelId}
          disabled={changes === 0}
          onClick={() => setIsOpen(true)}
          className="focus-visible:shadow-ring group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 rounded-control py-5 text-start outline-none disabled:cursor-default md:grid-cols-[200px_minmax(0,1fr)_auto] md:gap-x-10"
        >
          <span className="col-start-1 row-start-1 flex flex-col gap-0.5 text-base">
            {when}
          </span>
          <span className="text-fg-muted col-span-2 col-start-1 row-start-2 text-sm leading-[1.55] md:col-span-1 md:col-start-2 md:row-start-1">
            {firstSentence(description)}
          </span>
          <span className="text-fg-muted group-hover:text-fg col-start-2 row-start-1 inline-flex items-center gap-1.5 justify-self-end text-[13px] whitespace-nowrap md:col-start-3">
            {changes === 0 ? (
              "First beta"
            ) : (
              <>
                {changes} {changes === 1 ? "change" : "changes"}
                <Icon
                  name="singleArrowDown"
                  color="current"
                  width={14}
                  height={14}
                  aria-hidden="true"
                />
              </>
            )}
          </span>
        </button>
      </article>
    );
  }

  return (
    <article
      className={clsx(
        "grid gap-4 py-10 text-start md:grid-cols-[200px_minmax(0,1fr)] md:gap-10",
        isLatest ? "pt-0" : "border-line-subtle border-t"
      )}
    >
      <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-2 self-start md:sticky md:top-24 md:flex-col md:items-start">
        <span className="flex flex-row items-baseline gap-3 text-[22px] tracking-[-0.02em] md:flex-col md:gap-2">
          {when}
        </span>
        {isLatest && (
          <Badge tone="brand" size="sm">
            Latest
          </Badge>
        )}
      </div>

      <div id={panelId} className="min-w-0">
        <p className="text-fg max-w-[640px] text-base leading-relaxed">
          {description}
        </p>

        {update.groups.length > 0 && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {update.groups.map((group) => (
              <section
                key={group.label}
                className="border-line-subtle bg-surface-1 shadow-elev-1 rounded-card border px-5 py-[18px]"
              >
                <h3 className="text-fg flex items-center justify-between text-[13px] font-semibold">
                  {group.label}
                  <span className="text-fg-faint text-xs font-medium tabular-nums">
                    {group.items.length}
                  </span>
                </h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-fg-muted flex gap-2.5 text-sm leading-normal"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-fg-faint mt-[9px] size-1 shrink-0 rounded-full"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </article>
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

        const response = await fetch(getApiUrl("/updates"));

        if (!response.ok) {
          handleAppError("error", {
            fallbackTitle: "There was a generic error.",
          });

          if (isMounted) {
            setHasError(true);
          }

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
    <>
      <Seo
        title="Product Updates - Followoo"
        description="Read the latest Followoo updates, improvements and fixes for private Instagram export analysis."
        image="https://followoo.app/icons/OG.png"
        canonical="https://followoo.app/updates"
      />
      <section className="flex min-h-svh flex-col">
        <NavBar />

        <Container size="app" className="flex flex-1 flex-col">
          <div ref={rootRef} className="flex-1 pb-20">
            <PageHeader
              kicker="Updates"
              title="What's new in Followoo."
              description="Every release, newest first: what changed and why it matters to you."
            />

            <div data-page-animate="content" className="flex w-full flex-col">
              {isLoading ? (
                <Skeleton
                  variant="list"
                  items={5}
                  lines={2}
                  shape="circle"
                  animation="wave"
                  size="lg"
                  ariaLabel="Loading updates"
                />
              ) : hasError ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <UnknownErrorPage />
                </div>
              ) : updates.length === 0 ? (
                <p className="text-fg-muted text-start">
                  No updates available yet.
                </p>
              ) : (
                updates.map((update, index) => (
                  <div key={update.id} data-page-animate="item">
                    <ReleaseEntry
                      update={update}
                      isLatest={index === 0}
                      defaultOpen={index < OPEN_BY_DEFAULT}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
