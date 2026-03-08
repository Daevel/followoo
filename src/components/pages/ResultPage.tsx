import { useMemo, useState } from "react";
import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { NavBar } from "../ui/NavBar";
import { Button } from "../ui/Button";
import { clsx } from "clsx";

type TabKey = "mutual" | "unfollowed" | "followBack";

type TabButtonProps = {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={clsx(
        "transition-colors",
        {
          "bg-accent text-base": active,
          "bg-primary text-base/90": !active,
        }
      )}
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
  ],
  unfollowed: [
    "anna_01",
    "mike_dev",
    "stella.art",
    "travelguy",
    "coding.daily",
  ],
  followBack: [
    "newfriend_1",
    "newfriend_2",
    "newfriend_3",
    "newfriend_4",
    "newfriend_5",
  ],
};

export function ResultPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("mutual");

  const users = useMemo(() => {
    return mockData[activeTab];
  }, [activeTab]);

  const sectionTitle =
    activeTab === "mutual"
      ? "Mutual Friends List"
      : activeTab === "unfollowed"
        ? "Unfollowed List"
        : "Follow back List";

  return (
    <section className="min-h-svh">
      <Container>
        <NavBar />

        <div className="flex flex-col items-center pt-16 pb-6">
          <h2 className="text-3xl font-semibold leading-headers text-base md:text-4xl">
            Here's what I've found
          </h2>

          <div className="flex flex-row gap-3 align-middle items-center text-center">
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

          <div className="mt-8">
            <h3 className="text-base font-medium">{sectionTitle}</h3>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {users.map((username) => (
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
          </div>

          <div className="mt-auto pt-50">
            <FooterSignature />
          </div>
        </div>
      </Container>
    </section>
  );
}
