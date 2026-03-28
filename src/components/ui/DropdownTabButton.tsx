import { Icon } from "@/components/ui/Icon.tsx";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { useState } from "react";
import { TabButton } from "./TabButton";

type TabKey =
  | "mutual"
  | "followersOnly"
  | "unfollowers"
  | "recentUnfollowers"
  | "blocked"
  | "restricted"
  | "closeFriends"
  | "hideStoriesFrom";

type DropdownTabButtonProps = {
  title: string;
  activeTab: string;
  analysis: InstagramAnalysisResult;
  setActiveTab: (tab: TabKey) => void;
};

export function DropdownTabButton({
  title,
  activeTab,
  analysis,
  setActiveTab,
}: DropdownTabButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-foreground/10 bg-foreground/5 text-foreground ease-int-out w-full rounded-3xl border p-5 md:p-6">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-6"
        aria-expanded={isOpen}
      >
        <h4 className="pr-4 text-start">{title}</h4>

        <div className="bg-primary ease-int-out flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out">
          <div
            className={
              isOpen
                ? "rotate-180 transition-transform duration-300 ease-out"
                : "transition-transform duration-300 ease-out"
            }
          >
            <Icon
              name="singleArrowDown"
              color="foreground"
              width={18}
              height={18}
            />
          </div>
        </div>
      </button>

      <div
        className={`grid transition-all ease-in-out ${isOpen ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="grid min-h-0 gap-3 text-start md:grid-cols-2 lg:grid-cols-3">
          <TabButton
            active={activeTab === "mutual"}
            onClick={() => setActiveTab("mutual")}
          >
            Mutual ({analysis.mutual.length})
          </TabButton>

          <TabButton
            active={activeTab === "followersOnly"}
            onClick={() => setActiveTab("followersOnly")}
          >
            Followers ({analysis.followersOnly.length})
          </TabButton>

          <TabButton
            active={activeTab === "blocked"}
            onClick={() => setActiveTab("blocked")}
          >
            Blocked ({analysis.blocked.length})
          </TabButton>

          <TabButton
            active={activeTab === "restricted"}
            onClick={() => setActiveTab("restricted")}
          >
            Restricted ({analysis.restricted.length})
          </TabButton>

          <TabButton
            active={activeTab === "unfollowers"}
            onClick={() => setActiveTab("unfollowers")}
          >
            Unfollowers ({analysis.unfollowers.length})
          </TabButton>

          <TabButton
            active={activeTab === "recentUnfollowers"}
            onClick={() => setActiveTab("recentUnfollowers")}
          >
            Recent Unfollowers ({analysis.recentUnfollowers.length})
          </TabButton>

          <TabButton
            active={activeTab === "closeFriends"}
            onClick={() => setActiveTab("closeFriends")}
          >
            Close Friends ({analysis.closeFriends.length})
          </TabButton>

          <TabButton
            active={activeTab === "hideStoriesFrom"}
            onClick={() => setActiveTab("hideStoriesFrom")}
          >
            Hide Stories ({analysis.hideStoriesFrom.length})
          </TabButton>
        </div>
      </div>
    </div>
  );
}
