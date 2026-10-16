import clsx from "clsx";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";

export type LegalSection = {
  /** Anchor id, also used by the table of contents. */
  id: string;
  title: string;
  body: ReactNode;
};

export type LegalSummaryPoint = {
  icon: IconName;
  title: string;
  description: string;
};

type LegalDocumentProps = {
  title: string;
  lastUpdated: string;
  summary: LegalSummaryPoint[];
  sections: LegalSection[];
  contactTitle: string;
};

// Shared layout for the legal pages: header, plain-language summary, sticky
// table of contents with scroll spy, numbered prose and a closing contact card.
export function LegalDocument({
  title,
  lastUpdated,
  summary,
  sections,
  contactTitle,
}: LegalDocumentProps) {
  const [activeId, pinSection] = useActiveSection(
    sections.map((section) => section.id)
  );

  return (
    <>
      <PageHeader
        kicker="Legal"
        title={title}
        meta={
          <>
            <Badge size="sm">Last updated {lastUpdated}</Badge>
            <span>{sections.length} sections</span>
          </>
        }
      />

      <section
        data-page-animate="callout"
        aria-label="In short"
        className="border-line-subtle bg-surface-1 shadow-elev-1 rounded-card border p-5 text-start sm:p-6"
      >
        <p className="text-fg-muted text-xs font-medium">In short</p>
        <ul className="mt-4 grid gap-4 md:grid-cols-3 md:gap-5">
          {summary.map((point) => (
            <li
              key={point.title}
              className="text-fg-muted flex gap-2.5 text-sm leading-[1.55] md:flex-col md:gap-2"
            >
              <Icon
                name={point.icon}
                color="current"
                width={18}
                height={18}
                className="text-brand-fg mt-0.5 shrink-0 md:mt-0"
                aria-hidden="true"
              />
              <span>
                <span className="text-fg font-medium">{point.title}.</span>{" "}
                {point.description}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div
        data-page-animate="content"
        className="mt-8 grid items-start gap-8 pb-20 lg:mt-10 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-16"
      >
        <TableOfContents
          sections={sections}
          activeId={activeId}
          onSelect={pinSection}
        />

        <div className="max-w-[680px] min-w-0 text-start">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={clsx(
                "scroll-mt-24 py-7",
                index > 0 ? "border-line-subtle border-t" : "pt-0"
              )}
            >
              <h2 className="text-fg flex items-baseline gap-3 text-lg font-semibold tracking-[-0.015em]">
                <span className="text-fg-faint min-w-5 text-[13px] font-medium tabular-nums">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <p className="text-fg-muted mt-2.5 text-[15px] leading-[1.7] md:pl-8">
                {section.body}
              </p>
            </section>
          ))}

          <div className="border-line-subtle bg-surface-1 shadow-elev-1 mt-4 flex flex-col gap-4 rounded-card border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-fg text-base font-semibold tracking-[-0.01em]">
                {contactTitle}
              </h2>
              <p className="text-fg-muted mt-1 text-sm">
                Use the support form and I&apos;ll get back to you.
              </p>
            </div>
            <Link
              to="/support"
              className={clsx(
                buttonClasses({ variant: "secondary", size: "md" }),
                "shrink-0"
              )}
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function TableOfContents({
  sections,
  activeId,
  onSelect,
}: {
  sections: LegalSection[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const links = sections.map((section, index) => (
    <a
      key={section.id}
      href={`#${section.id}`}
      onClick={() => onSelect(section.id)}
      aria-current={activeId === section.id ? "location" : undefined}
      className={clsx(
        "focus-visible:shadow-ring block border-l py-1.5 pl-3.5 text-[13px] leading-snug outline-none",
        activeId === section.id
          ? "border-brand-fg text-fg"
          : "border-line-subtle text-fg-muted hover:text-fg"
      )}
    >
      {index + 1}. {section.title}
    </a>
  ));

  return (
    <>
      <details className="group border-line-subtle bg-surface-1 rounded-card border text-start lg:hidden">
        <summary className="text-fg flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
          On this page · {sections.length} sections
          <Icon
            name="singleArrowDown"
            color="current"
            width={16}
            height={16}
            className="text-fg-muted transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <nav aria-label="On this page" className="px-4 pb-4">
          {links}
        </nav>
      </details>

      <nav
        aria-label="On this page"
        className="sticky top-24 hidden text-start lg:block"
      >
        <p className="text-fg-faint mb-2.5 text-xs font-medium">On this page</p>
        {links}
      </nav>
    </>
  );
}

// Id of the last section whose heading has scrolled past the top of the
// viewport (below the sticky nav); the first section until then. A section
// picked from the table of contents stays active while the jump scrolls,
// since the last ones can't reach the top of a short page.
function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);
  const pinnedUntil = useRef(0);
  const key = ids.join("|");

  const pinSection = useCallback((id: string) => {
    pinnedUntil.current = Date.now() + 1000;
    setActiveId(id);
  }, []);

  useEffect(() => {
    const sectionIds = key.split("|");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (Date.now() < pinnedUntil.current) return;
      let current = sectionIds[0] ?? null;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 120) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [key]);

  return [activeId, pinSection] as const;
}
