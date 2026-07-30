import { Button } from "./Button";

type TabButtonProps = {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

export function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      background={active ? "accent" : "primary"}
      foreground="foreground"
      className="mt-0 min-w-0 px-3 py-2 text-sm break-words whitespace-normal transition-colors sm:px-4"
    >
      {children}
    </Button>
  );
}
