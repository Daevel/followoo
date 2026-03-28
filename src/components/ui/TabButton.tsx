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
      className="mt-0 shrink-0 px-4 py-2 whitespace-nowrap transition-colors"
    >
      {children}
    </Button>
  );
}
