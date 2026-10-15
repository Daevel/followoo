import clsx from "clsx";
import type { UserPersona } from "@/types/instagram.types";
import { personaStyles } from "./personaStyles";

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
    <div className="flex flex-col gap-2">
      <p className="text-fg-muted text-start text-[13px] font-medium">
        Filter by persona
      </p>

      <div className="border-line-subtle bg-surface-1 inline-flex max-w-full flex-wrap gap-0.5 self-start rounded-xl border p-[3px]">
        <FilterOption
          active={selectedPersona === null}
          onClick={() => onPersonaChange(null)}
          label="All"
          count={totalUsers}
        />

        {PERSONA_ORDER.map((persona) => {
          const count = personaCounts[persona];
          if (count === 0) return null;
          const { label, dotClass } = personaStyles[persona];

          return (
            <FilterOption
              key={persona}
              active={selectedPersona === persona}
              onClick={() => onPersonaChange(persona)}
              label={label}
              count={count}
              dotClass={dotClass}
            />
          );
        })}
      </div>
    </div>
  );
}

function FilterOption({
  active,
  onClick,
  label,
  count,
  dotClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dotClass?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[13px] font-medium transition-colors",
        "focus-visible:shadow-ring focus-visible:outline-none",
        active
          ? "bg-surface-2 text-fg shadow-elev-1"
          : "text-fg-muted hover:bg-surface-2/60 hover:text-fg"
      )}
    >
      {dotClass && (
        <span
          aria-hidden="true"
          className={clsx("size-1.5 shrink-0 rounded-full", dotClass)}
        />
      )}
      {label}
      <span
        className={clsx(
          "text-xs tabular-nums",
          active ? "text-brand-fg" : "text-fg-faint"
        )}
      >
        {count}
      </span>
    </button>
  );
}
