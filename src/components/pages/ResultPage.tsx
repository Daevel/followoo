import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { NavBar } from "../ui/NavBar";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Paginator";
import { gsap } from "gsap";
import type { InstagramAnalysisResult } from "../../types/instagram.types";

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
  | "blocked";

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
      className="mt-0 transition-colors"
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

  const itemsPerPage = 20;

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

      default:
        return [];
    }
  }, [activeTab, analysis]);

  const sortedUsers = useMemo(() => {
    const nextUsers = [...users];

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
  }, [users, sortBy]);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return sortedUsers.slice(startIndex, endIndex);
  }, [sortedUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortBy]);

  const sectionTitle = useMemo(() => {
    switch (activeTab) {
      case "mutual":
        return "Mutual (you follow each other)";

      case "followersOnly":
        return "Followers (they follow you, you don't follow them)";

      case "unfollowers":
        return "Unfollowers (you follow them, they don't follow you)";

      case "recentUnfollowers":
        return "Recent Unfollowers (someone who has recently unfollowed you)";

      case "blocked":
        return "Blocked (people who you blocked)";

      default:
        return "";
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
            className="mt-6 flex flex-row flex-wrap gap-3 items-center justify-center"
          >
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
          </div>

          <div className="mt-8 w-full">
            <h3
              data-animate="hero-item"
              className="text-foreground font-medium"
            >
              {sectionTitle}
            </h3>

            <div className="mt-6 flex items-center justify-center gap-3">
              <label htmlFor="sort-users" className="text-foreground">
                Sort by
              </label>

              <select
                id="sort-users"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="bg-primary text-foreground px-3 py-2 border border-primary"
              >
                <option value="alphabeticalAsc">A-Z</option>
                <option value="alphabeticalDesc">Z-A</option>
                <option value="recentDesc">Most recent</option>
                <option value="recentAsc">Oldest</option>
              </select>
            </div>

            <div
              data-animate="hero-item"
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-30"
            >
              {paginatedUsers.map((user) => (
                <a
                  key={user.username}
                  href={user.href ?? `https://instagram.com/${user.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p2-b text-primary transition hover:underline"
                >
                  {user.username}
                </a>
              ))}
            </div>

            {totalPages > 1 && (
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
