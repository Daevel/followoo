import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { NavBar } from "../ui/NavBar";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Paginator";
import { gsap } from "gsap";
import type { InstagramAnalysisResult } from "../../types/instagram.types";
import { formatDate } from "../utils/utils";
import { UserListItem } from "../ui/UserListItem";
import { SortSelect } from "../ui/SortSelect";
import { Input } from "../ui/Input";
import { ANALYTICS_EVENTS, analyticsService } from "@/analytics";

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

type TabButtonProps = {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      background={active ? "accent" : "primary"}
      foreground="foreground"
      className="mt-0 shrink-0 whitespace-nowrap transition-colors px-4 py-2"
    >
      {children}
    </Button>
  );
}

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

  useEffect(() => {
    analyticsService.track(ANALYTICS_EVENTS.RESULTS_TAB_CHANGED, {
      tab: activeTab,
      count: users.length,
    })
  }, [activeTab, users.length])

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='hero-item']",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="min-h-svh flex flex-col">
      <Container className="min-h-svh flex flex-col">
        <NavBar />

        <div
          ref={rootRef}
          className="flex flex-col items-center pt-15 pb-6 text-center flex-1"
        >
          <h1
            data-animate="hero-item"
            className="text-3xl font-semibold leading-headers text-foreground md:text-4xl"
          >
            Here's what I've found!
          </h1>

          <div
            data-animate="hero-item"
            className="mt-6 w-full overflow-x-auto custom-scrollbar pt-2 pb-3"
          >
            <div className="flex min-w-max gap-3 px-1">
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

          <div className="mt-8 w-full">
            <div className="flex flex-col mt-3 w-full items-center gap-y-3 max-sm:text-start">
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
                  className="mb-2 block text-start l2-r text-foreground/80"
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
                <div className="flex min-h-56 w-full flex-col items-center justify-center border border-foreground/10 bg-foreground/5 px-6 py-10 text-center">
                  <h4 className="text-lg font-medium text-foreground">
                    {emptyState.title}
                  </h4>

                  <p className="mt-3 max-w-md text-sm text-foreground/80">
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

        <FooterSignature />
      </Container>
    </section>
  );
}
