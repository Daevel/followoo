interface ButtonProps {
  children: React.ReactNode;
  color?: "primary" | "accent" | "bg";
  onClick: () => void;
  disabled?: boolean;
}


export function Button({
  children,
  color = "primary",
  onClick,
  disabled = false,
}: ButtonProps) {

  const colorClasses = {
    primary: "bg-primary",
    accent: "bg-accent",
    bg: "bg-bg",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-w-36.25 min-h-10 items-center justify-center ${colorClasses[color]} text-base px-5 p1-b`}
    >
      {children}
    </button>
  );
}
