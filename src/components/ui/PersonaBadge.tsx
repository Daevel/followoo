import clsx from "clsx";
import type { UserPersona } from "@/types/instagram.types";

type PersonaBadgeProps = {
  persona: UserPersona;
  size?: "sm" | "md";
};

function getPersonaConfig(persona: UserPersona) {
  const config: Record<
    UserPersona,
    {
      emoji: string;
      label: string;
      bgColor: string;
      textColor: string;
      borderColor: string;
    }
  > = {
    SUPER_FAN: {
      emoji: "⭐",
      label: "Super Fan",
      bgColor: "bg-yellow-500/15",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-500/30",
    },
    ENGAGED: {
      emoji: "✨",
      label: "Engaged",
      bgColor: "bg-primary/15",
      textColor: "text-primary",
      borderColor: "border-primary/30",
    },
    FICKLE: {
      emoji: "🔄",
      label: "Fickle",
      bgColor: "bg-orange-500/15",
      textColor: "text-orange-600",
      borderColor: "border-orange-500/30",
    },
    LURKER: {
      emoji: "👀",
      label: "Lurker",
      bgColor: "bg-slate-500/15",
      textColor: "text-slate-600",
      borderColor: "border-slate-500/30",
    },
    DORMANT: {
      emoji: "😴",
      label: "Dormant",
      bgColor: "bg-gray-500/15",
      textColor: "text-gray-600",
      borderColor: "border-gray-500/30",
    },
  };

  return config[persona];
}

export function PersonaBadge({ persona, size = "md" }: PersonaBadgeProps) {
  const config = getPersonaConfig(persona);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size]
      )}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </div>
  );
}
