// Colors arrive as free strings from the updates API (backend default: "accent"),
// so they are mapped to static classes Tailwind can see at build time.
const backgroundClasses: Record<string, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  bg: "bg-bg",
};

export function BadgeVersion({
  version,
  backgroundColor,
}: {
  version: string;
  backgroundColor?: string;
}) {
  const backgroundClass =
    (backgroundColor && backgroundClasses[backgroundColor]) ?? "bg-bg";

  return (
    <div
      className={`p1-b inline-flex h-7 w-20 items-center justify-center rounded-[10px] px-5 py-2 align-middle ${backgroundClass}`}
    >
      <span className="font-bold">v{version}</span>
    </div>
  );
}
