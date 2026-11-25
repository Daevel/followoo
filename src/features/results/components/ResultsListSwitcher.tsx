import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { TabButton } from "@/components/ui/TabButton";
import {
  getRelationshipGroupLabel,
  RELATIONSHIP_GROUPS,
} from "@/features/relationship/constants/relationshipGroups";
import type { TabKey } from "@/features/results/types/results.types";
import type { InstagramAnalysisResult } from "@/types/instagram.types";

type ListOption = { key: TabKey; label: string };

const dotClassOf = (key: TabKey) =>
  RELATIONSHIP_GROUPS.find((group) => group.key === key)?.dotClass;

// The three relationship groups are always one click away, the answer
// people come for first; the other lists live in the "More lists" menu.
// "Recent follow requests" stays hidden until we know whether Instagram
// lists requests you sent or received there.
const PRIMARY_LISTS: ListOption[] = [
  { key: "mutual", label: getRelationshipGroupLabel("mutual") },
  { key: "unfollowers", label: getRelationshipGroupLabel("unfollowers") },
  { key: "followersOnly", label: getRelationshipGroupLabel("followersOnly") },
];

const MORE_LISTS: ListOption[] = [
  { key: "recentUnfollowers", label: "You unfollowed" },
  { key: "blocked", label: "Blocked" },
  { key: "restricted", label: "Restricted" },
  { key: "closeFriends", label: "Close Friends" },
  { key: "hideStoriesFrom", label: "Hidden from your stories" },
  { key: "pendingFollowRequests", label: "Requests you sent" },
];

type ResultsListSwitcherProps = {
  activeTab: TabKey;
  analysis: InstagramAnalysisResult;
  onChange: (tab: TabKey) => void;
};

export function ResultsListSwitcher({
  activeTab,
  analysis,
  onChange,
}: ResultsListSwitcherProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRootRef = useRef<HTMLDivElement | null>(null);
  const activeMoreList = MORE_LISTS.find((list) => list.key === activeTab);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (!menuRootRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  function select(tab: TabKey) {
    onChange(tab);
    setIsMenuOpen(false);
  }

  return (
    // Phones: the three groups share the full width as equal tabs (number
    // on top, name on two lines), so nothing is cut or hidden off screen,
    // and "More lists" goes full width below. From `md` they sit in a row.
    <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start">
      <div
        role="tablist"
        aria-label="Relationship lists"
        className="border-line-subtle bg-surface-1 grid grid-cols-3 gap-0.5 rounded-xl border p-[3px] md:inline-flex md:whitespace-nowrap"
      >
        {PRIMARY_LISTS.map((list) => {
          const isActive = activeTab === list.key;

          return (
            <TabButton
              key={list.key}
              active={isActive}
              onClick={() => select(list.key)}
              className="h-full flex-col gap-1 px-1.5 py-2 md:flex-row md:gap-1.5 md:px-3 md:py-1.5"
            >
              {/* Phones: dot and number on top, the name gets the full
                  width below. From md: dot, name, number in one line. */}
              <span
                className={clsx(
                  "flex items-center gap-1.5 text-[15px] font-semibold tabular-nums md:order-last md:text-xs md:font-normal",
                  isActive
                    ? "text-fg md:text-brand-fg"
                    : "text-fg-muted md:text-fg-faint"
                )}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    "size-[7px] shrink-0 rounded-full md:hidden",
                    dotClassOf(list.key)
                  )}
                />
                {analysis[list.key].length}
              </span>
              <span className="flex items-center gap-1.5 text-center text-xs leading-tight md:text-[13px]">
                <span
                  aria-hidden="true"
                  className={clsx(
                    "hidden size-[7px] shrink-0 rounded-full md:inline-block",
                    dotClassOf(list.key)
                  )}
                />
                {list.label}
              </span>
            </TabButton>
          );
        })}
      </div>

      <div ref={menuRootRef} className="relative md:shrink-0">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className={clsx(
            "flex h-[40px] w-full cursor-pointer items-center justify-between gap-1.5 rounded-xl border px-3 text-[13px] font-medium whitespace-nowrap transition-colors md:inline-flex md:w-auto md:justify-start",
            "focus-visible:shadow-ring focus-visible:outline-none",
            activeMoreList
              ? "border-line-strong bg-surface-2 text-fg"
              : "border-line-subtle bg-surface-1 text-fg-muted hover:text-fg"
          )}
        >
          {activeMoreList ? (
            <>
              {activeMoreList.label}
              <ListCount count={analysis[activeMoreList.key].length} active />
            </>
          ) : (
            "More lists"
          )}
          <Icon
            name="singleArrowDown"
            color="current"
            width={14}
            height={14}
            className={clsx(
              "text-fg-muted transition-transform",
              isMenuOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            aria-label="More lists"
            className="border-line-strong bg-surface-2 shadow-elev-2 absolute top-full right-0 left-0 z-30 mt-1.5 flex flex-col rounded-[12px] border p-1 md:left-auto md:w-56"
          >
            {MORE_LISTS.map((list) => {
              const isActive = activeTab === list.key;

              return (
                <button
                  key={list.key}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => select(list.key)}
                  className={clsx(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-start text-sm transition-colors",
                    "hover:bg-line-subtle focus-visible:shadow-ring focus-visible:outline-none",
                    isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                  )}
                >
                  {list.label}
                  <span className="text-fg-faint text-xs tabular-nums">
                    {analysis[list.key].length}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ListCount({ count, active }: { count: number; active: boolean }) {
  return (
    <span
      className={clsx(
        "text-xs tabular-nums",
        active ? "text-brand-fg" : "text-fg-faint"
      )}
    >
      {count}
    </span>
  );
}
