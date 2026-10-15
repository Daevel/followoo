import { Badge, type BadgeTone } from "./Badge";

// Colors arrive as free strings from the updates API (backend default:
// "accent"); the former color names map to badge tones.
const toneByColor: Record<string, BadgeTone> = {
  primary: "brand",
  accent: "brand",
  bg: "neutral",
};

export function BadgeVersion({
  version,
  backgroundColor,
}: {
  version: string;
  backgroundColor?: string;
}) {
  const tone: BadgeTone =
    (backgroundColor ? toneByColor[backgroundColor] : undefined) ?? "neutral";

  return (
    <Badge tone={tone} className="tabular-nums">
      v{version}
    </Badge>
  );
}
