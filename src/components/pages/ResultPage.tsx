import { ANALYTICS_EVENTS, analyticsService } from "@/analytics";
import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { InstagramAnalysisResult } from "../../types/instagram.types";
import { calculateRelationshipHealthScore } from "../services/relationshipHealthService";
import { ResultsPieChart } from "../ui/charts/ResultPieChart";
import { Container } from "../ui/Container";
import { DropdownTabButton } from "../ui/DropdownTabButton";
import { Input } from "../ui/Input";
import { NavBar } from "../ui/NavBar";
import { Pagination } from "../ui/Paginator";
import { RelationshipHealthInsight } from "../ui/RelationshipHealthInsight";
import { SortSelect } from "../ui/SortSelect";
import { UserListItem } from "../ui/UserListItem";
import { formatDate } from "../utils/utils";

type SortKey =
  | "alphabeticalAsc"
  | "alphabeticalDesc"
  | "recentDesc"
  | "recentAsc";

type TabKey =
  | "mutual"
  | "followersOnly"
  | "unfollowers"
  | "recentUnfollowers"
  | "blocked"
  | "restricted"
  | "closeFriends"
  | "hideStoriesFrom";

export function ResultPage() {
  const location = useLocation();
  const analysis = location.state as InstagramAnalysisResult | undefined;

  const [sortBy, setSortBy] = useState<SortKey>("alphabeticalAsc");
  const [activeTab, setActiveTab] = useState<TabKey>("mutual");
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 20;

  // MOMENTANEO

  if (!analysis) {
    return <Navigate to="/get-started" replace />;
  }

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

      default:
        return [];
    }
  }, [activeTab, analysis]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return users;

    return users.filter((user) =>
      user.username.toLowerCase().includes(normalizedQuery),
    );
  }, [users, searchQuery]);

  const hasUsersInCurrentTab = users.length > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasFilteredUsers = filteredUsers.length > 0;

  const emptyState = useMemo(() => {
    if (!hasUsersInCurrentTab) {
      switch (activeTab) {
        case "mutual":
          return {
            title: "No mutual followers yet",
            description:
              "We couldn't find any users who follow you back in this export.",
          };
        case "followersOnly":
          return {
            title: "No followers found",
            description:
              "There are no users in this export who follow you without being followed back.",
          };
        case "unfollowers":
          return {
            title: "No unfollowers found",
            description:
              "Good news — everyone you follow appears to follow you back.",
          };
        case "recentUnfollowers":
          return {
            title: "No recent unfollowers found",
            description:
              "We couldn't find any recent unfollow activity in this export.",
          };
        case "blocked":
          return {
            title: "No blocked users found",
            description: "There are no blocked users available in this export.",
          };
        case "restricted":
          return {
            title: "No restricted users found",
            description:
              "There are no restricted users available in this export.",
          };
        case "closeFriends":
          return {
            title: "No close friends users found",
            description: "There are no close friends available in this export.",
          };

        case "hideStoriesFrom":
          return {
            title: "You don't hide your stories to none for now",
            description: "There are no story hiders available in this export.",
          };
      }
    }

    if (hasSearchQuery && !hasFilteredUsers) {
      return {
        title: "No users match your search",
        description: `We couldn't find any username matching`,
      };
    }

    return null;
  }, [activeTab, hasUsersInCurrentTab, hasSearchQuery, hasFilteredUsers]);

  const sortedUsers = useMemo(() => {
    const nextUsers = [...filteredUsers];

    switch (sortBy) {
      case "alphabeticalAsc":
        return nextUsers.sort((a, b) => a.username.localeCompare(b.username));

      case "alphabeticalDesc":
        return nextUsers.sort((a, b) => b.username.localeCompare(a.username));

      case "recentDesc":
        return nextUsers.sort(
          (a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0),
        );

      case "recentAsc":
        return nextUsers.sort(
          (a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0),
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
      { name: "Followers only", value: analysis.followersOnly.length },
      { name: "Unfollowers", value: analysis.unfollowers.length },
      { name: "Recent unfollowers", value: analysis.recentUnfollowers.length },
      { name: "Blocked", value: analysis.blocked.length },
      { name: "Restricted", value: analysis.restricted.length },
      { name: "Close friends", value: analysis.closeFriends.length },
      { name: "Hide stories", value: analysis.hideStoriesFrom.length },
    ],
    [analysis],
  );

  const relationshipHealthInsight = useMemo(
    () => calculateRelationshipHealthScore(analysis),
    [analysis],
  );

  useEffect(() => {
    analyticsService.track(ANALYTICS_EVENTS.RESULTS_TAB_CHANGED, {
      tab: activeTab,
      count: users.length,
    });
  }, [activeTab, users.length]);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) return;

    analyticsService.track(ANALYTICS_EVENTS.RESULTS_SEARCH_USED, {
      tab: activeTab,
      query_length: normalizedQuery.length,
    });
  }, [searchQuery, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortBy, searchQuery]);

  const tabInfos: { sectionTitle: string; description: string } =
    useMemo(() => {
      switch (activeTab) {
        case "mutual":
          return {
            sectionTitle: "Mutual",
            description: "People you follow who also follow you back.",
          };
        case "followersOnly":
          return {
            sectionTitle: "Followers",
            description: "People who follow you, but you don't follow back.",
          };
        case "unfollowers":
          return {
            sectionTitle: "Unfollowers",
            description: "People you follow, but who don't follow you back.",
          };
        case "recentUnfollowers":
          return {
            sectionTitle: "Recent Unfollowers",
            description: "People who recently unfollowed you.",
          };
        case "blocked":
          return {
            sectionTitle: "Blocked",
            description: "People you have blocked on Instagram.",
          };
        case "restricted":
          return {
            sectionTitle: "Restricted",
            description:
              "People you have restricted. They can still see your content, but their activity is limited (e.g. message read status and online visibility).",
          };
        case "closeFriends":
          return {
            sectionTitle: "Close Friends",
            description:
              "People in your Close Friends list who can see your private stories.",
          };
        case "hideStoriesFrom":
          return {
            sectionTitle: "Hide Story",
            description: "People you have hidden your stories from.",
          };
      }
    }, [activeTab]);

  const rootRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="flex min-h-svh flex-col">
      <NavBar />
      <Container className="flex min-h-svh flex-col">
        <div
          ref={rootRef}
          className="flex flex-1 flex-col items-center pt-15 pb-6 text-center"
        >
          <h1
            data-animate="hero-item"
            className="leading-headers text-foreground text-3xl font-semibold md:text-4xl"
          >
            Here's what I've found!
          </h1>

          <div data-animate="hero-item" className="mt-8 w-full">
            <RelationshipHealthInsight insight={relationshipHealthInsight} />
          </div>

          <div className="mt-8 w-full">
            <ResultsPieChart data={chartData} title="Results overview" />
          </div>

          <div data-animate="hero-item" className="mt-6 w-full pt-2 pb-3">
            <div className="flex gap-3 px-1">
              <DropdownTabButton
                title="Connections"
                activeTab={activeTab}
                analysis={analysis}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>

          <div className="mt-8 w-full">
            <div className="mt-3 flex w-full flex-col items-center gap-y-3 max-sm:text-start">
              <h3 data-animate="hero-item" className="text-foreground">
                {tabInfos.sectionTitle}
              </h3>
              <p data-animate="hero-item" className="text-foreground">
                {tabInfos.description}
              </p>
            </div>

            <div
              data-animate="hero-item"
              className="mt-8 flex w-full flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between"
            >
              <div className="w-full md:max-w-md">
                <label
                  htmlFor="search-users"
                  className="l2-r text-foreground/80 mb-2 block text-start"
                >
                  Search user
                </label>

                <Input
                  id="search-users"
                  type="text"
                  placeholder="Type a username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="w-full md:w-auto">
                <SortSelect
                  label="Sort by"
                  value={sortBy}
                  onChange={setSortBy}
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

            <div data-animate="hero-item" className="mt-8">
              {emptyState ? (
                <div className="border-foreground/10 bg-foreground/5 flex min-h-56 w-full flex-col items-center justify-center border px-6 py-10 text-center">
                  <h4 className="text-foreground text-lg font-medium">
                    {emptyState.title}
                  </h4>

                  <p className="text-foreground/80 mt-3 max-w-md text-sm">
                    {emptyState.description}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {paginatedUsers.map((user) => (
                    <UserListItem
                      key={user.username}
                      user={user}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </div>

            {!emptyState && totalPages > 1 && (
              <div data-animate="hero-item">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
