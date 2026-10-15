import { useEffect, useMemo, useRef, useState } from "react";
import { ANALYTICS_EVENTS, analyticsService } from "@/analytics";
import { useResultsPageAnimation } from "@/animations/pages/useResultsPageAnimation";
import { Container } from "@/components/ui/Container";
import { ChartStats } from "@/components/ui/charts/ChartCard";
import { NetworkVolatilityCard } from "@/components/ui/charts/NetworkVolatilityCard";
import { RecentUnfollowActivityChart } from "@/components/ui/charts/RecentUnfollowActivityChart";
import { ResultsPieChart } from "@/components/ui/charts/ResultPieChart";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { NavBar } from "@/components/ui/NavBar";
import { Paginator } from "@/components/ui/Paginator";
import { PersonaFilter } from "@/components/ui/PersonaFilter";
import { RelationshipHealthInsight } from "@/components/ui/RelationshipHealthInsight";
import Seo from "@/components/ui/Seo";
import { SortSelect } from "@/components/ui/SortSelect";
import { UserListItem } from "@/components/ui/UserListItem";
import { calculateNetworkVolatility } from "@/features/relationship/services/recentUnfollowActivityService";
import { calculateRelationshipHealthScore } from "@/features/relationship/services/relationshipHealthService";
import {
  classifyUserPersona,
  groupUsersByPersona,
} from "@/features/relationship/services/userPersonaService";
import {
  getResultsEmptyState,
  getResultsTabInfo,
} from "@/features/results/config/resultTabContent";
import type { SortKey, TabKey } from "@/features/results/types/results.types";
import { formatDate } from "@/lib";
import type {
  InstagramAnalysisResult,
  UserPersona,
} from "@/types/instagram.types";
import { ResultsListSwitcher } from "./ResultsListSwitcher";

export function ResultsExperience({
  analysis,
}: {
  analysis: InstagramAnalysisResult;
}) {
  const [sortBy, setSortBy] = useState<SortKey>("alphabeticalAsc");
  const [activeTab, setActiveTab] = useState<TabKey>("mutual");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<UserPersona | null>(
    null
  );

  const itemsPerPage = 20;
  const rootRef = useRef<HTMLDivElement | null>(null);

  useResultsPageAnimation(rootRef);

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

    let results = users;

    // Filter by persona
    if (selectedPersona) {
      results = results.filter(
        (user) => classifyUserPersona(user, analysis) === selectedPersona
      );
    }

    if (!normalizedQuery) {
      return results;
    }

    return results.filter((user) =>
      user.username.toLowerCase().includes(normalizedQuery)
    );
  }, [users, searchQuery, selectedPersona, analysis]);

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
    const endIndex = startIndex + itemsPerPage;

    return sortedUsers.slice(startIndex, endIndex);
  }, [sortedUsers, currentPage]);

  const chartData = useMemo(
    () => [
      { name: "Mutual", value: analysis.mutual.length },
      { name: "Follower", value: analysis.followersOnly.length },
      { name: "Following", value: analysis.unfollowers.length },
    ],
    [analysis]
  );

  const relationshipHealthInsight = useMemo(
    () => calculateRelationshipHealthScore(analysis),
    [analysis]
  );

  const networkVolatility = useMemo(
    () => calculateNetworkVolatility(analysis),
    [analysis]
  );

  function handleActiveTabChange(tab: TabKey) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function handleSearchQueryChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handlePersonaChange(persona: UserPersona | null) {
    setSelectedPersona(persona);
    setCurrentPage(1);
  }

  function handleSortChange(sort: SortKey) {
    setSortBy(sort);
    setCurrentPage(1);
  }

  const personaCounts = useMemo(
    () => groupUsersByPersona(users, analysis),
    [users, analysis]
  );

  useEffect(() => {
    if (!selectedPersona) return;

    if (personaCounts[selectedPersona] === 0) {
      setSelectedPersona(null);
    }
  }, [personaCounts, selectedPersona]);

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

  const tabInfos = useMemo(() => getResultsTabInfo(activeTab), [activeTab]);

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
          <div
            ref={rootRef}
            className="flex w-full min-w-0 flex-1 flex-col gap-6 pt-8 pb-12 text-start md:pt-12"
          >
            <header data-animate="hero-item" className="flex flex-col gap-2">
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
                Your Instagram network analysis
              </h1>
              <p className="text-fg-muted max-w-2xl text-sm leading-6 text-pretty">
                A quick overview of your relationship groups, patterns, and
                account insights.
              </p>
            </header>

            <div data-animate="hero-item">
              <ChartStats
                stats={[
                  {
                    label: "Followers",
                    value: analysis.sourceCounts.followers,
                  },
                  {
                    label: "Following",
                    value: analysis.sourceCounts.following,
                  },
                  { label: "Mutual", value: analysis.mutual.length },
                  {
                    label: "Recent unfollowers",
                    value: analysis.recentUnfollowers.length,
                  },
                ]}
              />
            </div>

            <div
              data-animate="hero-item"
              className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2"
            >
              <RelationshipHealthInsight insight={relationshipHealthInsight} />
              <ResultsPieChart
                data={chartData}
                title="Relationship breakdown"
              />
            </div>

            <div
              data-animate="hero-item"
              className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2"
            >
              <RecentUnfollowActivityChart
                recentUnfollowers={analysis.recentUnfollowers}
              />
              <NetworkVolatilityCard volatility={networkVolatility} />
            </div>

            <section
              data-animate="hero-item"
              className="border-line-subtle bg-surface-1 shadow-elev-1 flex min-w-0 flex-col rounded-card border"
            >
              <div className="border-line-subtle flex flex-col gap-4 border-b p-4 sm:p-5">
                <ResultsListSwitcher
                  activeTab={activeTab}
                  analysis={analysis}
                  onChange={handleActiveTabChange}
                />

                <div>
                  <h2 className="text-fg text-base leading-snug font-semibold tracking-[-0.01em]">
                    {tabInfos.sectionTitle}
                  </h2>
                  <p className="text-fg-muted mt-1 max-w-2xl text-[13px] leading-[1.55] text-pretty">
                    {tabInfos.description}
                  </p>
                </div>

                <PersonaFilter
                  personaCounts={personaCounts}
                  selectedPersona={selectedPersona}
                  onPersonaChange={handlePersonaChange}
                />

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
                      { label: "A-Z", value: "alphabeticalAsc" },
                      { label: "Z-A", value: "alphabeticalDesc" },
                      { label: "Most recent", value: "recentDesc" },
                      { label: "Oldest", value: "recentAsc" },
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
                          persona={classifyUserPersona(user, analysis)}
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
