import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { NavBar } from "../ui/NavBar";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Paginator";
import { gsap } from "gsap";

type TabKey = "mutual" | "unfollowed" | "followBack";

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

const mockData = {
  mutual: [
    "elle.evel",
    "user2",
    "user3",
    "user4",
    "user5",
    "user6",
    "user7",
    "user8",
    "user9",
    "user10",
    "user11",
    "user12",
    "user13",
    "user14",
    "user15",
    "user16",
    "user17",
    "user18",
    "user19",
    "user20",
    "user21",
    "elle.evel",
    "user2",
    "user3",
    "user4",
    "user5",
    "user6",
    "user7",
    "user8",
    "user9",
    "user10",
    "user11",
    "user12",
    "user13",
    "user14",
    "user15",
    "user16",
    "user17",
    "user18",
    "user19",
    "user20",
    "user21",
  ],
  unfollowed: [
    "anna_01",
    "mike_dev",
    "stella.art",
    "travelguy",
    "coding.daily",
    "foodie_lover",
    "fitness_fan",
    "nature_photos",
    "music_junkie",
    "bookworm",
    "fashionista",
    "gamer_girl",
    "sports_fanatic",
    "movie_buff",
    "tech_geek",
    "art_enthusiast",
    "photography_lover",
    "coffee_addict",
    "cat_person",
    "dog_person",
    "fitness_freak",
    "travel_bug",
    "food_critic",
  ],
  followBack: [
    "newfriend_1",
    "newfriend_2",
    "newfriend_3",
    "newfriend_4",
    "newfriend_5",
    "newfriend_6",
    "newfriend_7",
    "newfriend_8",
    "newfriend_9",
    "newfriend_10",
    "newfriend_11",
    "newfriend_12",
    "newfriend_13",
    "newfriend_14",
    "newfriend_15",
    "newfriend_16",
    "newfriend_17",
    "newfriend_18",
    "newfriend_19",
    "newfriend_20",
    "newfriend_21",
  ],
};

export function ResultPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("mutual");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  const users = useMemo(() => mockData[activeTab], [activeTab]);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return users.slice(startIndex, endIndex);
  }, [users, currentPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [activeTab]);

  const sectionTitle =
    activeTab === "mutual"
      ? "Mutual Friends List"
      : activeTab === "unfollowed"
        ? "Unfollowed List"
        : "Follow back List";

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

      gsap.fromTo(
        "[data-animate='hero-illustration']",
        {
          opacity: 0,
          y: 32,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
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
              Mutual
            </TabButton>

            <TabButton
              active={activeTab === "unfollowed"}
              onClick={() => setActiveTab("unfollowed")}
            >
              Unfollowed
            </TabButton>

            <TabButton
              active={activeTab === "followBack"}
              onClick={() => setActiveTab("followBack")}
            >
              Follow back
            </TabButton>
          </div>

          <div className="mt-8 w-full">
            <h3
              data-animate="hero-item"
              className="text-foreground font-medium"
            >
              {sectionTitle}
            </h3>

            <div
              data-animate="hero-item"
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-30"
            >
              {paginatedUsers.map((username) => (
                <a
                  key={username}
                  href={`https://instagram.com/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p2-b text-primary transition hover:underline"
                >
                  {username}
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
