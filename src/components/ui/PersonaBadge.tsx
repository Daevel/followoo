import type { UserPersona } from "@/types/instagram.types";
import { Badge } from "./Badge";
import { personaStyles } from "./personaStyles";

type PersonaBadgeProps = {
  persona: UserPersona;
  size?: "sm" | "md";
};

// Neutral pill with the persona's data-palette dot: the same color the
// persona has in the filter and in the charts.
export function PersonaBadge({ persona, size = "md" }: PersonaBadgeProps) {
  const { label, dotClass } = personaStyles[persona];

  return (
    <Badge size={size} dotClass={dotClass}>
      {label}
    </Badge>
  );
}
