import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { ANALYTICS_EVENTS, analyticsService } from "@/analytics";
import { useResultsPageAnimation } from "@/animations/pages/useResultsPageAnimation";
import { Container } from "@/components/ui/Container";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { NavBar } from "@/components/ui/NavBar";
import { Paginator } from "@/components/ui/Paginator";
import Seo from "@/components/ui/Seo";
import { SortSelect } from "@/components/ui/SortSelect";
import { UserListItem } from "@/components/ui/UserListItem";
import { HistorySavePrompt } from "@/features/history/components/HistorySavePrompt";
import type { RelationshipGroupCounts } from "@/features/relationship/constants/relationshipGroups";
import { calculateFollowBackRate } from "@/features/relationship/services/followBackRateService";
import {
  buildRelationshipFactIndex,
  getRelationshipFacts,
} from "@/features/relationship/services/relationshipFactsService";
import {
  LIST_HASHES,
  tabFromHash,
} from "@/features/results/config/resultListLinks";
import {
  getResultsEmptyState,
  getResultsTabInfo,
} from "@/features/results/config/resultTabContent";
import type { SortKey, TabKey } from "@/features/results/types/results.types";
import { formatDate } from "@/lib";
import type { InstagramAnalysisResult } from "@/types/instagram.types";
import { ComparisonNote } from "./ComparisonNote";
import { ImproveActions } from "./ImproveActions";
import { NetworkComposition } from "./NetworkComposition";
import { ResultsHero } from "./ResultsHero";
import { ResultsListSwitcher } from "./ResultsListSwitcher";

// Outline shown for a moment around the lists when a link opens one, in
// the color of the list's group.
const FLASH_CLASSES: Partial<Record<TabKey, string>> = {
  mutual: "ring-data-1/60",
  unfollowers: "ring-data-3/60",
  followersOnly: "ring-data-2/60",
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ResultsExperience({
  analysis,
  isHistorySavePending = false,
}: {
  analysis: InstagramAnalysisResult;
  /** Fresh analysis that wasn't saved because history was locked. */
  isHistorySavePending?: boolean;
}) {
  const [sortBy, setSortBy] = useState<SortKey>("recentDesc");
  // Opens on the list in the address (#…) or on the answer people come
  // for: who doesn't follow them back.
  const [activeTab, setActiveTab] = useState<TabKey>(
    () =>
      (typeof window !== "undefined" && tabFromHash(window.location.hash)) ||
      "unfollowers"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListFlashing, setIsListFlashing] = useState(false);

  const itemsPerPage = 20;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listsRef = useRef<HTMLElement | null>(null);
  const flashTimeoutRef = useRef<number | null>(null);

  useResultsPageAnimation(rootRef, activeTab);

  const counts: RelationshipGroupCounts = useMemo(
    () => ({
      mutual: analysis.mutual.length,
      unfollowers: analysis.unfollowers.length,
      followersOnly: analysis.followersOnly.length,
    }),
    [analysis]
  );
  const followersTotal = counts.mutual + counts.followersOnly;
  const followingTotal = counts.mutual + counts.unfollowers;

  const followBackRate = useMemo(
    () => calculateFollowBackRate(analysis),
    [analysis]
  );

  const factIndex = useMemo(
    () => buildRelationshipFactIndex(analysis),
    [analysis]
  );

  const users = useMemo(() => {
    switch (activeTab) {
      case "mutual":
        return analysis.mutual;
      case "followersOnly":
        return analysis.followersOnly;
      case "unfollowers":
        return analysis.unfollowers;
      case "recentUnfollowers":
        return analysis.recentUnfollowers;
      case "blocked":
        return analysis.blocked;
      case "restricted":
        return analysis.restricted;
      case "closeFriends":
        return analysis.closeFriends;
      case "hideStoriesFrom":
        return analysis.hideStoriesFrom;
      case "pendingFollowRequests":
        return analysis.pendingFollowRequests;
      case "recentFollowRequests":
        return analysis.recentFollowRequests;
      default:
        return [];
    }
  }, [activeTab, analysis]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return users;

    return users.filter((user) =>
      user.username.toLowerCase().includes(normalizedQuery)
    );
  }, [users, searchQuery]);

  const hasUsersInCurrentTab = users.length > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasFilteredUsers = filteredUsers.length > 0;

  const emptyState = useMemo(
    () =>
      getResultsEmptyState({
        activeTab,
        hasUsersInCurrentTab,
        hasSearchQuery,
        hasFilteredUsers,
      }),
    [activeTab, hasUsersInCurrentTab, hasSearchQuery, hasFilteredUsers]
  );

  const sortedUsers = useMemo(() => {
    const nextUsers = [...filteredUsers];

    switch (sortBy) {
      case "alphabeticalAsc":
        return nextUsers.sort((a, b) => a.username.localeCompare(b.username));
      case "alphabeticalDesc":
        return nextUsers.sort((a, b) => b.username.localeCompare(a.username));
      case "recentDesc":
        return nextUsers.sort(
          (a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)
        );
      case "recentAsc":
        return nextUsers.sort(
          (a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0)
        );
      default:
        return nextUsers;
    }
  }, [filteredUsers, sortBy]);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedUsers, currentPage]);

  // The open list goes in the address, so Back and reload land on it.
  useEffect(() => {
    const hash = `#${LIST_HASHES[activeTab]}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(window.history.state, "", hash);
    }
  }, [activeTab]);

  useEffect(
    () => () => {
      if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
    },
    []
  );

  function handleActiveTabChange(tab: TabKey) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  /** From "See who", "Open list" and the network bars: show that list. */
  function openList(tab: TabKey) {
    handleActiveTabChange(tab);
    listsRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    setIsListFlashing(true);
    if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = window.setTimeout(
      () => setIsListFlashing(false),
      1400
    );
  }

  function handleSearchQueryChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleSortChange(sort: SortKey) {
    setSortBy(sort);
    setCurrentPage(1);
  }

  useEffect(() => {
    analyticsService.track(ANALYTICS_EVENTS.RESULTS_TAB_CHANGED, {
      tab: activeTab,
      count: users.length,
    });
  }, [activeTab, users.length]);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      return;
    }

    analyticsService.track(ANALYTICS_EVENTS.RESULTS_SEARCH_USED, {
      tab: activeTab,
      query_length: normalizedQuery.length,
    });
  }, [searchQuery, activeTab]);

  const tabInfo = useMemo(() => getResultsTabInfo(activeTab), [activeTab]);

  return (
    <>
      <Seo
        title="Analysis Results - Followoo"
        description="View your private Instagram relationship analysis for the current browser session."
        image="https://followoo.app/icons/OG.png"
        canonical="https://followoo.app/results"
        noIndex
      />
      <section className="flex min-h-svh flex-col">
        <NavBar />

        <Container size="app" className="flex min-h-svh flex-col">
          {/* Reading order: the answer, what the totals are made of, how
              to improve, then the lists. */}
          <div
            ref={rootRef}
            className="flex w-full min-w-0 flex-1 flex-col gap-5 pt-8 pb-12 text-start md:pt-12"
          >
            <header data-animate="hero-item" className="flex flex-col gap-1.5">
              <p className="text-success inline-flex items-center gap-1.5 text-xs font-medium">
                <Icon
                  name="lock"
                  color="current"
                  width={12}
                  height={12}
                  aria-hidden="true"
                />
                Processed in your browser
              </p>
              <h1 className="text-fg text-[28px] leading-tight font-semibold tracking-[-0.025em] text-balance sm:text-[32px]">
                Your results
              </h1>
              <p className="text-fg-muted text-sm tabular-nums">
                {followersTotal} followers · {followingTotal} following ·
                analyzed on your device
              </p>
            </header>

            {isHistorySavePending && (
              <div data-animate="hero-item" className="empty:hidden">
                <HistorySavePrompt analysis={analysis} />
              </div>
            )}

            <div data-animate="hero-item">
              <ResultsHero
                followBackRate={followBackRate}
                notFollowingBackCount={counts.unfollowers}
                onSeeWho={() => openList("unfollowers")}
              />
            </div>

            <div data-animate="hero-item">
              <NetworkComposition counts={counts} onOpenList={openList} />
            </div>

            <div data-animate="hero-item" className="empty:hidden">
              <ImproveActions counts={counts} onOpenList={openList} />
            </div>

            <div data-animate="hero-item" className="empty:hidden">
              <ComparisonNote />
            </div>

            <section
              ref={listsRef}
              id="results-lists"
              aria-label="Lists"
              data-animate="hero-item"
              className={clsx(
                "border-line-subtle bg-surface-1 shadow-elev-1 flex min-w-0 scroll-mt-20 flex-col rounded-card border ring-0 transition-shadow duration-500",
                isListFlashing &&
                  clsx("ring-2", FLASH_CLASSES[activeTab] ?? "ring-brand-fg/60")
              )}
            >
              <div className="border-line-subtle flex flex-col gap-4 border-b p-4 sm:p-5">
                <ResultsListSwitcher
                  activeTab={activeTab}
                  analysis={analysis}
                  onChange={handleActiveTabChange}
                />

                <div className="border-line-subtle bg-surface-0 grid gap-3 rounded-control border px-4 py-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-6">
                  <div>
                    <h2 className="text-fg text-sm font-semibold">
                      {tabInfo.sectionTitle}
                    </h2>
                    <p className="text-fg-muted mt-1 text-[13px] leading-[1.55] text-pretty">
                      {tabInfo.description}
                    </p>
                  </div>
                  {tabInfo.action && (
                    <div>
                      <p className="text-brand-fg text-sm font-semibold">
                        What you can do
                      </p>
                      <p className="text-fg-muted mt-1 text-[13px] leading-[1.55] text-pretty">
                        {tabInfo.action}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex w-full flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <Field
                    label="Search username"
                    htmlFor="search-users"
                    className="md:max-w-sm"
                  >
                    <Input
                      id="search-users"
                      type="text"
                      placeholder="Type a username..."
                      value={searchQuery}
                      onChange={(e) => handleSearchQueryChange(e.target.value)}
                    />
                  </Field>

                  <SortSelect
                    label="Sort by"
                    value={sortBy}
                    onChange={handleSortChange}
                    options={[
                      { label: "Name, A-Z", value: "alphabeticalAsc" },
                      { label: "Name, Z-A", value: "alphabeticalDesc" },
                      {
                        label: "Date followed, newest first",
                        value: "recentDesc",
                      },
                      {
                        label: "Date followed, oldest first",
                        value: "recentAsc",
                      },
                    ]}
                    className="w-full md:w-auto"
                  />
                </div>
              </div>

              <div className="p-2 sm:p-3">
                <p
                  aria-live="polite"
                  className="text-fg-muted px-2 pt-1 pb-2 text-[13px] tabular-nums"
                >
                  {filteredUsers.length} result
                  {filteredUsers.length === 1 ? "" : "s"}
                </p>

                {emptyState ? (
                  <div className="flex min-h-48 w-full flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
                    <h3 className="text-fg text-base font-semibold">
                      {emptyState.title}
                    </h3>
                    <p className="text-fg-muted mt-2 max-w-md text-[13px] leading-[1.55]">
                      {emptyState.description}
                    </p>
                  </div>
                ) : (
                  <ul className="divide-line-subtle flex flex-col divide-y">
                    {paginatedUsers.map((user) => (
                      <li
                        key={user.username}
                        data-animate="list-item"
                        className="py-0.5"
                      >
                        <UserListItem
                          user={user}
                          formatDate={formatDate}
                          datePrefix={tabInfo.dateLabel}
                          badges={getRelationshipFacts(
                            factIndex,
                            user.username,
                            activeTab
                          ).map((fact) => fact.label)}
                          appearance="row"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {!emptyState && totalPages > 1 && (
                <div className="border-line-subtle border-t px-4 pb-4 sm:px-5">
                  <Paginator
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}
