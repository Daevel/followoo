import clsx from "clsx";

type SeparatorVariants = "primary" | "accent" | "foreground";

interface SeparatorProps {
  variant: SeparatorVariants;
}

export function Separator({ variant = "primary" }: SeparatorProps) {
  const backgroundClasses: Record<SeparatorVariants, string> = {
    primary: "bg-primary/10",
    accent: "bg-accent/10",
    foreground: "bg-foreground/10",
  };

  return (
    <div className={clsx("my-8 h-px w-full", backgroundClasses[variant])} />
  );
}
