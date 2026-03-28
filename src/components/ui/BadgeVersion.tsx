export function BadgeVersion({
  version,
  backgroundColor,
}: {
  version: string;
  backgroundColor?: string;
}) {
  return (
    <div
      className={`p1-b inline-flex h-7 w-20 items-center justify-center rounded-[10px] px-5 py-2 align-middle ${backgroundColor ? `bg-${backgroundColor}` : "bg-bg"}`}
    >
      <span className="font-bold">v{version}</span>
    </div>
  );
}
