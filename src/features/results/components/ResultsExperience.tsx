import { useEffect, useMemo, useRef, useState } from "react";
import { ANALYTICS_EVENTS, analyticsService } from "@/analytics";
import { useResultsPageAnimation } from "@/animations/pages/useResultsPageAnimation";
import { Container } from "@/components/ui/Container";
import { NetworkVolatilityCard } from "@/components/ui/charts/NetworkVolatilityCard";
import { RecentUnfollowActivityChart } from "@/components/ui/charts/RecentUnfollowActivityChart";
import { ResultsPieChart } from "@/components/ui/charts/ResultPieChart";
import { DropdownTabButton } from "@/components/ui/DropdownTabButton";
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

        <Container className="flex min-h-svh max-w-6xl flex-col overflow-x-hidden">
          <div
            ref={rootRef}
            className="mx-auto flex w-full min-w-0 flex-1 flex-col items-center px-3 pt-14 pb-8 text-center sm:px-4 md:px-6 md:pt-20"
          >
            <h1
              data-animate="hero-item"
              className="leading-headers text-foreground max-w-4xl text-balance text-3xl font-semibold sm:text-4xl md:text-5xl"
            >
              Your Instagram network analysis
            </h1>

            <p
              data-animate="hero-item"
              className="text-foreground/70 mt-4 max-w-2xl text-pretty text-sm leading-6 sm:text-base md:text-lg md:leading-7"
            >
              A quick overview of your relationship groups, patterns, and
              account insights.
            </p>

            <div
              data-animate="hero-item"
              className="border-foreground/10 bg-foreground/5 mt-5 flex w-full flex-wrap items-center justify-center gap-2 rounded-[18px] border px-3 py-2 text-xs text-foreground/75 sm:w-auto sm:gap-3 sm:rounded-full sm:px-4 sm:text-sm"
            >
              <span>Imported source records</span>
              <span className="text-foreground font-semibold">
                {analysis.sourceCounts.followers} followers
              </span>
              <span className="text-foreground/30">/</span>
              <span className="text-foreground font-semibold">
                {analysis.sourceCounts.following} following
              </span>
            </div>

            <div data-animate="hero-item" className="mt-6 flex w-full flex-row">
              <RelationshipHealthInsight insight={relationshipHealthInsight} />
            </div>

            <div
              data-animate="hero-item"
              className="mt-8 grid w-full min-w-0 grid-cols-1 gap-5 lg:mt-10 lg:grid-cols-2"
            >
              <ResultsPieChart
                data={chartData}
                title="Relationship breakdown"
              />
              <RecentUnfollowActivityChart
                recentUnfollowers={analysis.recentUnfollowers}
              />
            </div>

            <div data-animate="hero-item" className="mt-8 w-full">
              <NetworkVolatilityCard volatility={networkVolatility} />
            </div>

            <div data-animate="hero-item" className="mt-8 w-full">
              <DropdownTabButton
                title="Explore your connections"
                activeTab={activeTab}
                analysis={analysis}
                setActiveTab={handleActiveTabChange}
              />
            </div>

            <div className="border-foreground/10 bg-foreground/5 text-foreground mt-6 w-full min-w-0 rounded-[10px] border p-4 sm:p-5 md:p-8">
              <div className="w-full">
                <div className="flex w-full flex-col items-center gap-y-2 text-center max-sm:items-start max-sm:text-start">
                  <h3
                    data-animate="hero-item"
                    className="text-foreground text-xl font-semibold sm:text-2xl"
                  >
                    {tabInfos.sectionTitle}
                  </h3>

                  <p
                    data-animate="hero-item"
                    className="text-foreground/75 max-w-2xl text-pretty text-sm leading-6 md:text-base"
                  >
                    {tabInfos.description}
                  </p>
                </div>

                <div data-animate="hero-item" className="mt-6 w-full px-0">
                  <PersonaFilter
                    personaCounts={personaCounts}
                    selectedPersona={selectedPersona}
                    onPersonaChange={handlePersonaChange}
                  />
                </div>

                <div
                  data-animate="hero-item"
                  className="mt-8 flex w-full flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between"
                >
                  <div className="w-full md:max-w-lg">
                    <label
                      htmlFor="search-users"
                      className="l2-r text-foreground/80 mb-2 block text-start"
                    >
                      Search username
                    </label>

                    <Input
                      id="search-users"
                      type="text"
                      placeholder="Type a username..."
                      value={searchQuery}
                      onChange={(e) => handleSearchQueryChange(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="w-full md:w-auto">
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

                <p
                  data-animate="hero-item"
                  className="text-foreground/60 mt-6 text-start text-sm"
                >
                  {filteredUsers.length} result
                  {filteredUsers.length === 1 ? "" : "s"}
                </p>

                <div data-animate="hero-item" className="mt-6">
                  {emptyState ? (
                    <div className="border-foreground/10 bg-foreground/5 flex min-h-56 w-full flex-col items-center justify-center rounded-[10px] border px-4 py-10 text-center sm:px-6">
                      <h4 className="text-foreground text-lg font-semibold sm:text-xl">
                        {emptyState.title}
                      </h4>

                      <p className="text-foreground/80 mt-3 max-w-md text-sm leading-6">
                        {emptyState.description}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-5">
                      {paginatedUsers.map((user) => (
                        <div key={user.username} data-animate="list-item">
                          <UserListItem
                            user={user}
                            formatDate={formatDate}
                            persona={classifyUserPersona(user, analysis)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!emptyState && totalPages > 1 && (
                  <div data-animate="hero-item" className="mt-8">
                    <Paginator
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
