import clsx from "clsx";
import type { UserPersona } from "@/types/instagram.types";
import { PersonaBadge } from "./PersonaBadge";

type PersonaFilterProps = {
  personaCounts: Record<UserPersona, number>;
  selectedPersona: UserPersona | null;
  onPersonaChange: (persona: UserPersona | null) => void;
};

const PERSONA_ORDER: UserPersona[] = [
  "SUPER_FAN",
  "ENGAGED",
  "FICKLE",
  "LURKER",
  "DORMANT",
];

export function PersonaFilter({
  personaCounts,
  selectedPersona,
  onPersonaChange,
}: PersonaFilterProps) {
  const totalUsers = Object.values(personaCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-foreground/70 text-sm font-medium">
        Filter by persona
      </p>

      <div className="flex max-w-full flex-wrap gap-2">
        {/* All button */}
        <button
          type="button"
          onClick={() => onPersonaChange(null)}
          className={clsx(
            "rounded-full border px-3 py-2 text-sm font-medium transition-all sm:px-4",
            selectedPersona === null
              ? "bg-primary/20 text-primary border-primary/30"
              : "bg-foreground/5 text-foreground/70 border-foreground/10 hover:bg-foreground/10"
          )}
        >
          All ({totalUsers})
        </button>

        {/* Persona buttons */}
        {PERSONA_ORDER.map((persona) => {
          const count = personaCounts[persona];
          if (count === 0) return null;

          return (
            <button
              type="button"
              key={persona}
              onClick={() => onPersonaChange(persona)}
              className={clsx(
                "min-w-0 rounded-full border px-2.5 py-2 transition-all sm:px-3",
                selectedPersona === persona
                  ? "bg-primary/20 border-primary/30"
                  : "bg-foreground/5 border-foreground/10 hover:bg-foreground/10"
              )}
            >
              <div className="flex min-w-0 items-center gap-2">
                <PersonaBadge persona={persona} size="sm" />
                <span className="text-foreground/70 text-xs font-semibold">
                  ({count})
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
