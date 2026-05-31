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
import { Icon, type IconName } from "../components/ui/Icon";
import { Input } from "../components/ui/Input";
import { Loading } from "../components/ui/Loading";
import { NavBar } from "../components/ui/NavBar";
import { Paginator } from "../components/ui/Paginator";
import { RelationshipHealthInsight } from "../components/ui/RelationshipHealthInsight";
import { ScreenMount } from "../components/ui/ScreenMount";
import { Separator } from "../components/ui/Separator";
import { Skeleton } from "../components/ui/Skeleton";
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

type ButtonStoryProps = {
  background: "primary" | "accent" | "bg";
  foreground: "foreground";
  disabled: boolean;
  icon?: string;
  label: string;
};

export function ButtonStory({
  background = "primary",
  foreground = "foreground",
  disabled = false,
  icon,
  label = "Button",
}: ButtonStoryProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        background={background}
        foreground={foreground}
        disabled={disabled}
        icon={icon as IconName}
      >
        {label}
      </Button>
    </div>
  );
}

ButtonStory.args = {
  background: "primary",
  foreground: "foreground",
  disabled: false,
  label: "Button",
};

ButtonStory.argTypes = {
  background: {
    control: { type: "select" },
    options: ["primary", "accent", "bg"],
    description: "Background color of the button",
  },
  disabled: {
    control: { type: "boolean" },
    description: "Disable the button",
  },
  label: {
    control: { type: "text" },
    description: "Button label text",
  },
  icon: {
    control: { type: "text" },
    description: "Optional icon name",
  },
};

type CardStoryProps = {
  title: string;
  description: string;
  iconName: string;
};

export function CardStory({
  title = "Secure growth",
  description = "A compact card example with icon and text.",
  iconName = "shield",
}: CardStoryProps) {
  return (
    <div className="max-w-sm">
      <Card
        title={title}
        description={description}
        iconName={iconName as IconName}
      />
    </div>
  );
}

CardStory.args = {
  title: "Secure growth",
  description: "A compact card example with icon and text.",
  iconName: "shield",
};

CardStory.argTypes = {
  title: {
    control: { type: "text" },
    description: "Card title",
  },
  description: {
    control: { type: "text" },
    description: "Card description",
  },
  iconName: {
    control: { type: "text" },
    description: "Icon name for the card",
  },
};

type CheckboxStoryProps = {
  checked: boolean;
  label: string;
  hasError: boolean;
};

export function CheckboxStory({
  checked = false,
  label = "Option",
  hasError = false,
}: CheckboxStoryProps) {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox checked={checked} label={label} hasError={hasError} />
    </div>
  );
}

CheckboxStory.args = {
  checked: false,
  label: "Option",
  hasError: false,
};

CheckboxStory.argTypes = {
  checked: {
    control: { type: "boolean" },
    description: "Whether the checkbox is checked",
  },
  label: {
    control: { type: "text" },
    description: "Checkbox label text",
  },
  hasError: {
    control: { type: "boolean" },
    description: "Show error state",
  },
};

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

type FabIconStoryProps = {
  icon: IconName;
  background: "primary" | "accent" | "bg";
  disabled: boolean;
};

export function FabIconStory({
  icon = "upload",
  background = "primary",
  disabled = false,
}: FabIconStoryProps) {
  return (
    <div className="flex gap-4">
      <FabIcon icon={icon} background={background} disabled={disabled} />
    </div>
  );
}

FabIconStory.args = {
  icon: "upload",
  background: "primary",
  disabled: false,
};

FabIconStory.argTypes = {
  icon: {
    control: { type: "text" },
    description: "Icon name",
  },
  background: {
    control: { type: "select" },
    options: ["primary", "accent", "bg"],
    description: "Background color",
  },
  disabled: {
    control: { type: "boolean" },
    description: "Disable the fab icon",
  },
};

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

type InputStoryProps = {
  placeholder: string;
  variant: "input" | "textarea";
  hasError: boolean;
};

export function InputStory({
  placeholder = "Enter text",
  variant = "input",
  hasError = false,
}: InputStoryProps) {
  return (
    <div className="flex max-w-lg flex-col gap-4">
      <Input placeholder={placeholder} variant={variant} hasError={hasError} />
    </div>
  );
}

InputStory.args = {
  placeholder: "Enter text",
  variant: "input",
  hasError: false,
};

InputStory.argTypes = {
  placeholder: {
    control: { type: "text" },
    description: "Input placeholder text",
  },
  variant: {
    control: { type: "select" },
    options: ["input", "textarea"],
    description: "Input variant type",
  },
  hasError: {
    control: { type: "boolean" },
    description: "Show error state",
  },
};

type LoadingStoryProps = {
  loading: boolean;
};

export function LoadingStory({ loading = true }: LoadingStoryProps) {
  return <Loading loading={loading} />;
}

LoadingStory.args = {
  loading: true,
};

LoadingStory.argTypes = {
  loading: {
    control: { type: "boolean" },
    description: "Show loading state",
  },
};

export function NavBarStory() {
  return <NavBar />;
}

type PaginatorStoryProps = {
  currentPage: number;
  totalPages: number;
};

export function PaginatorStory({
  currentPage = 2,
  totalPages = 8,
}: PaginatorStoryProps) {
  const [page, setPage] = useState(currentPage);

  return (
    <Paginator
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}

PaginatorStory.args = {
  currentPage: 2,
  totalPages: 8,
};

PaginatorStory.argTypes = {
  currentPage: {
    control: { type: "number" },
    description: "Current page number",
  },
  totalPages: {
    control: { type: "number" },
    description: "Total number of pages",
  },
};

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

type SeparatorStoryProps = {
  variant: "primary" | "accent" | "foreground";
};

export function SeparatorStory({ variant = "primary" }: SeparatorStoryProps) {
  return (
    <div>
      <p>Top content</p>
      <Separator variant={variant} />
      <p>Bottom content</p>
    </div>
  );
}

SeparatorStory.args = {
  variant: "primary",
};

SeparatorStory.argTypes = {
  variant: {
    control: { type: "select" },
    options: ["primary", "accent", "foreground"],
    description: "Separator variant",
  },
};

type SkeletonLoaderCircleStoryProps = {
  size: "sm" | "md" | "lg";
};

export function SkeletonLoaderCircleStory({
  size = "md",
}: SkeletonLoaderCircleStoryProps) {
  return (
    <div className="flex items-center gap-4">
      <SkeletonLoaderCircle size={size} />
    </div>
  );
}

SkeletonLoaderCircleStory.args = {
  size: "md",
};

SkeletonLoaderCircleStory.argTypes = {
  size: {
    control: { type: "select" },
    options: ["sm", "md", "lg"],
    description: "Size of the skeleton loader",
  },
};

type SortSelectStoryProps = {
  value: string;
};

export function SortSelectStory({ value = "recent" }: SortSelectStoryProps) {
  const [selectedValue, setSelectedValue] = useState(value);
  const options = [
    { label: "Recent first", value: "recent" },
    { label: "Oldest first", value: "oldest" },
    { label: "Most popular", value: "popular" },
  ];

  return (
    <div className="max-w-xs">
      <SortSelect
        value={selectedValue}
        options={options}
        onChange={setSelectedValue}
      />
    </div>
  );
}

SortSelectStory.args = {
  value: "recent",
};

SortSelectStory.argTypes = {
  value: {
    control: { type: "select" },
    options: ["recent", "oldest", "popular"],
    description: "Default selected value",
  },
};

type TabButtonStoryProps = {
  active: boolean;
  label: string;
};

export function TabButtonStory({
  active = false,
  label = "Tab Button",
}: TabButtonStoryProps) {
  const [isActive, setIsActive] = useState(active);

  return (
    <TabButton active={isActive} onClick={() => setIsActive((prev) => !prev)}>
      {label}
    </TabButton>
  );
}

TabButtonStory.args = {
  active: false,
  label: "Tab Button",
};

TabButtonStory.argTypes = {
  active: {
    control: { type: "boolean" },
    description: "Whether the tab is active",
  },
  label: {
    control: { type: "text" },
    description: "Tab button label",
  },
};

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

export function ScreenMountStory() {
  return (
    <>
      <div className="min-h-[40vh] rounded-[10px] border border-primary/20 bg-primary/5 p-6">
        <p className="text-foreground/80">
          Questo è il contenuto della pagina. Il componente montato da
          `ScreenMount` è posizionato in overlay sullo schermo.
        </p>
      </div>

      <ScreenMount position="bottom-left">
        <Card
          title="Floating card"
          description="Una card montata tramite ScreenMount, completa di posizione fissa sullo schermo."
          iconName="happyFace"
        />
      </ScreenMount>
    </>
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

type BadgeVersionStoryProps = {
  version: string;
  backgroundColor?: string;
};

export function BadgeVersionStory({
  version = "1.0.0",
  backgroundColor = "primary",
}: BadgeVersionStoryProps) {
  return (
    <div className="flex gap-4">
      <BadgeVersion version={version} backgroundColor={backgroundColor} />
    </div>
  );
}

BadgeVersionStory.args = {
  version: "1.0.0",
  backgroundColor: "primary",
};

BadgeVersionStory.argTypes = {
  version: {
    control: { type: "text" },
    description: "Version string",
  },
  backgroundColor: {
    control: { type: "text" },
    description: "Background color",
  },
};

type CalloutStoryProps = {
  title: string;
  variant: "info" | "warning" | "success";
  children: string;
};

export function CalloutStory({
  title = "Information",
  variant = "info",
  children = "This is a callout component for important information.",
}: CalloutStoryProps) {
  return (
    <Callout title={title} variant={variant}>
      {children}
    </Callout>
  );
}

CalloutStory.args = {
  title: "Information",
  variant: "info",
  children: "This is a callout component for important information.",
};

CalloutStory.argTypes = {
  title: {
    control: { type: "text" },
    description: "Callout title",
  },
  variant: {
    control: { type: "select" },
    options: ["info", "warning", "success"],
    description: "Callout variant",
  },
  children: {
    control: { type: "text" },
    description: "Callout content",
  },
};

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

export function SkeletonStory({
  animation = "wave",
}: {
  animation?: "pulse" | "wave";
}) {
  return (
    <>
      <div className="flex flex-col gap-2 mt-6 transition-colors">
        <h2>Rectangle shape</h2>
        <Skeleton
          size="sm"
          ariaLabel="Loading content"
          className="w-full"
          animation={animation}
          shape="rectangle"
        />
        <Skeleton
          size="md"
          ariaLabel="Loading content"
          className="w-full"
          animation={animation}
          shape="rectangle"
        />
        <Skeleton
          size="lg"
          ariaLabel="Loading content"
          className="w-full"
          animation={animation}
          shape="rectangle"
        />
      </div>

      <div className="flex flex-col gap-2 mt-6 transition-colors">
        <h2>Circle shape</h2>
        <Skeleton
          size="sm"
          ariaLabel="Loading content"
          className="w-full"
          animation={animation}
          shape="circle"
        />
        <Skeleton
          size="md"
          ariaLabel="Loading content"
          className="w-full"
          animation={animation}
          shape="circle"
        />
        <Skeleton
          size="lg"
          ariaLabel="Loading content"
          className="w-full"
          animation={animation}
          shape="circle"
        />
      </div>
    </>
  );
}

SkeletonStory.args = {
  animation: "wave",
};

SkeletonStory.argTypes = {
  animation: {
    control: { type: "select" },
    options: ["wave", "pulse"],
    description: "Animation type for the skeleton loaders",
  },
};
