import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { BadgeVersion } from "../components/ui/BadgeVersion";
import { Button } from "../components/ui/Button";
import { Callout } from "../components/ui/Callout";
import { Card } from "../components/ui/Card";
import { Checkbox } from "../components/ui/Checkbox";
import { Container } from "../components/ui/Container";
import { EngagementPatternChart } from "../components/ui/charts/EngagementPatternChart";
import { ResultsPieChart } from "../components/ui/charts/ResultPieChart";
import { DropdownCard } from "../components/ui/DropdownCard";
import { DropdownTabButton } from "../components/ui/DropdownTabButton";
import { FabIcon } from "../components/ui/FabIcon";
import { FooterSignature } from "../components/ui/FooterSignature";
import { HeroIllustrations } from "../components/ui/HeroIllustrations";
import { HeroSection } from "../components/ui/hero-subsection/HeroSection";
import { Icon } from "../components/ui/Icon";
import { Input } from "../components/ui/Input";
import { Loading } from "../components/ui/Loading";
import { NavBar } from "../components/ui/NavBar";
import { Paginator } from "../components/ui/Paginator";
import { RelationshipHealthInsight } from "../components/ui/RelationshipHealthInsight";
import { Separator } from "../components/ui/Separator";
import { SkeletonLoaderCircle } from "../components/ui/SkeletonLoaderCircle";
import { SortSelect } from "../components/ui/SortSelect";
import { TabButton } from "../components/ui/TabButton";
import { Toast, type ToastItem } from "../components/ui/Toast";
import { UserListItem } from "../components/ui/UserListItem";
import { ZipDropzone } from "../components/ui/ZipDropzone";

const meta: Meta = {
  title: "UI/Components",
};

export default meta;

const sampleAnalysis = {
  mutual: [
    { username: "anna", timestamp: 1680000000 },
    { username: "mario", timestamp: 1680001000 },
  ],
  followersOnly: [
    { username: "luca", timestamp: 1680002000 },
    { username: "giulia", timestamp: 1680003000 },
  ],
  unfollowers: [{ username: "paolo", timestamp: 1680004000 }],
  recentUnfollowers: [
    { username: "alice", timestamp: 1680005000 },
    { username: "marco", timestamp: 1680006000 },
  ],
  blocked: [{ username: "sara", timestamp: 1680007000 }],
  restricted: [{ username: "filippo", timestamp: 1680008000 }],
  closeFriends: [{ username: "lucia", timestamp: 1680009000 }],
  hideStoriesFrom: [{ username: "elena", timestamp: 1680010000 }],
};

const sampleUser = {
  username: "followoo_user",
  timestamp: 1680012000,
};

const samplePieData = [
  { name: "Mutual", value: 42 },
  { name: "Followers", value: 18 },
  { name: "Unfollowers", value: 7 },
  { name: "Blocked", value: 2 },
];

const infoToast: ToastItem = {
  id: "toast-3",
  title: "Info message",
  description: "Here is some information for you.",
  variant: "info",
};
const warningToast: ToastItem = {
  id: "toast-2",
  title: "Warning message",
  description: "Please review the information above.",
  variant: "warning",
};
const successToast: ToastItem = {
  id: "toast-1",
  title: "Success message",
  description: "The operation was completed successfully.",
  variant: "success",
};

const allIconNames = [
  "check",
  "close",
  "shield",
  "menu",
  "upload",
  "warning",
  "help",
  "eye",
  "code",
  "linkOff",
  "download",
  "happyFace",
  "neutralFace",
] as const;

export function ButtonStory() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button background="primary" foreground="foreground">
        Primary label
      </Button>
      <Button background="accent" foreground="foreground" icon="arrowRight">
        Accent icon right
      </Button>
      <Button background="bg" foreground="foreground" disabled>
        Disabled
      </Button>
    </div>
  );
}

export function CardStory() {
  return (
    <div className="max-w-sm">
      <Card
        title="Secure growth"
        description="A compact card example with icon and text."
        iconName="shield"
      />
    </div>
  );
}

export function CheckboxStory() {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox checked label="Option selected" />
      <Checkbox label="Option not selected" />
      <Checkbox hasError label="Error state" />
    </div>
  );
}

export function ContainerStory() {
  return (
    <Container className="border-foreground/20 border border-dashed p-6">
      <p>This content is wrapped by the Container component.</p>
    </Container>
  );
}

export function DropdownCardStory() {
  return (
    <div className="max-w-md">
      <DropdownCard
        title="More details"
        description="Detailed content appears when the card is expanded."
      />
    </div>
  );
}

export function DropdownTabButtonStory() {
  const [activeTab, setActiveTab] = useState("mutual");

  return (
    <div className="max-w-2xl">
      <DropdownTabButton
        title="Relationship groups"
        activeTab={activeTab}
        analysis={sampleAnalysis}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export function FabIconStory() {
  return (
    <div className="flex gap-4">
      <FabIcon icon="upload" />
      <FabIcon icon="check" background="accent" />
      <FabIcon icon="menu" disabled />
    </div>
  );
}

export function FooterSignatureStory() {
  return <FooterSignature />;
}

export function HeroIllustrationsStory() {
  return <HeroIllustrations />;
}

export function IconStory() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {allIconNames.map((name) => (
        <div
          key={name}
          className="border-foreground/10 bg-foreground/5 rounded-xl border p-4 text-center"
        >
          <Icon name={name} width={32} height={32} />
          <p className="mt-3 text-sm">{name}</p>
        </div>
      ))}
    </div>
  );
}

export function InputStory() {
  return (
    <div className="flex max-w-lg flex-col gap-4">
      <Input placeholder="Single line input" />
      <Input variant="textarea" placeholder="Multi-line textarea" />
      <Input hasError placeholder="Error state" />
    </div>
  );
}

export function LoadingStory() {
  return <Loading loading />;
}

export function NavBarStory() {
  return <NavBar />;
}

export function PaginatorStory() {
  const [page, setPage] = useState(2);

  return <Paginator currentPage={page} totalPages={8} onPageChange={setPage} />;
}

export function RelationshipHealthInsightStory() {
  return (
    <div className="max-w-md">
      <RelationshipHealthInsight
        insight={{
          color: "foreground",
          level: "healthy",
          title: "Network health",
          score: 81,
          description: "Your Instagram network looks strong and engaged.",
        }}
      />
    </div>
  );
}

export function SeparatorStory() {
  return (
    <div>
      <p>Top content</p>
      <Separator variant="primary" />
      <p>Bottom content</p>
    </div>
  );
}

export function SkeletonLoaderCircleStory() {
  return (
    <div className="flex items-center gap-4">
      <SkeletonLoaderCircle size="sm" />
      <SkeletonLoaderCircle size="md" />
      <SkeletonLoaderCircle size="lg" />
    </div>
  );
}

export function SortSelectStory() {
  const [value, setValue] = useState("recent");
  const options = [
    { label: "Recent first", value: "recent" },
    { label: "Oldest first", value: "oldest" },
    { label: "Most popular", value: "popular" },
  ];

  return (
    <div className="max-w-xs">
      <SortSelect value={value} options={options} onChange={setValue} />
    </div>
  );
}

export function TabButtonStory() {
  const [active, setActive] = useState(false);

  return (
    <TabButton active={active} onClick={() => setActive((prev) => !prev)}>
      {active ? "Active state" : "Inactive state"}
    </TabButton>
  );
}

export function ToastStory() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return <Button onClick={() => setVisible(true)}>Show toast again</Button>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Toast
        toast={infoToast}
        duration={10000}
        onClose={() => setVisible(false)}
      />
      <Toast
        toast={warningToast}
        duration={10000}
        onClose={() => setVisible(false)}
      />
      <Toast
        toast={successToast}
        duration={10000}
        onClose={() => setVisible(false)}
      />
    </div>
  );
}

export function UserListItemStory() {
  return (
    <div className="max-w-sm">
      <UserListItem
        user={sampleUser}
        formatDate={(timestamp) =>
          timestamp ? new Date(timestamp * 1000).toLocaleDateString() : null
        }
      />
    </div>
  );
}

export function ZipDropzoneStory() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  return (
    <div className="max-w-xl">
      <ZipDropzone file={file} onFileChange={setFile} onError={setError} />
      {error && <p className="text-accent mt-3 text-sm">{error}</p>}
    </div>
  );
}

export function BadgeVersionStory() {
  return (
    <div className="flex gap-4">
      <BadgeVersion version="1.0.0" />
      <BadgeVersion version="2.1.5" backgroundColor="accent" />
    </div>
  );
}

export function CalloutStory() {
  return (
    <Callout title="Information" variant="info">
      This is a callout component for important information.
    </Callout>
  );
}

export function EngagementPatternChartStory() {
  return (
    <EngagementPatternChart
      recentUnfollowers={sampleAnalysis.recentUnfollowers}
    />
  );
}

export function ResultsPieChartStory() {
  return <ResultsPieChart data={samplePieData} title="Overview" />;
}

export function HeroSectionStory() {
  return <HeroSection />;
}

export function ScrollToTopStory() {
  return (
    <div className="border-foreground/20 border border-dashed p-6">
      <p>ScrollToTop renders without visual output.</p>
    </div>
  );
}
