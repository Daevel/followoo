import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { TabButton } from "@/components/ui/TabButton";
import type { TabKey } from "@/features/results/types/results.types";
import type { InstagramAnalysisResult } from "@/types/instagram.types";

type ListOption = { key: TabKey; label: string };

// The five lists people open most are always one click away; the rest live
// in the "More lists" menu.
const PRIMARY_LISTS: ListOption[] = [
  { key: "mutual", label: "Mutual" },
  { key: "followersOnly", label: "Follower" },
  { key: "unfollowers", label: "Following" },
  { key: "recentUnfollowers", label: "Recent unfollowers" },
  { key: "blocked", label: "Blocked" },
];

const MORE_LISTS: ListOption[] = [
  { key: "restricted", label: "Restricted" },
  { key: "closeFriends", label: "Close friends" },
  { key: "hideStoriesFrom", label: "Hide stories" },
  { key: "pendingFollowRequests", label: "Pending requests" },
  { key: "recentFollowRequests", label: "Recent requests" },
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
    <div className="flex min-w-0 items-start gap-2">
      {/* scrolls horizontally on phones instead of wrapping */}
      <div className="min-w-0 overflow-x-auto [scrollbar-width:none]">
        <div
          role="tablist"
          aria-label="Relationship lists"
          className="border-line-subtle bg-surface-1 inline-flex gap-0.5 rounded-xl border p-[3px] whitespace-nowrap"
        >
          {PRIMARY_LISTS.map((list) => (
            <TabButton
              key={list.key}
              active={activeTab === list.key}
              onClick={() => select(list.key)}
            >
              {list.label}
              <ListCount
                count={analysis[list.key].length}
                active={activeTab === list.key}
              />
            </TabButton>
          ))}
        </div>
      </div>

      <div ref={menuRootRef} className="relative shrink-0">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className={clsx(
            "inline-flex h-[40px] cursor-pointer items-center gap-1.5 rounded-xl border px-3 text-[13px] font-medium whitespace-nowrap transition-colors",
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
            className="border-line-strong bg-surface-2 shadow-elev-2 absolute top-full right-0 z-30 mt-1.5 flex w-56 flex-col rounded-[12px] border p-1"
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
