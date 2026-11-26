import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { UserListItem } from "@/components/ui/UserListItem";
import type {
  AnalysisComparison,
  RenamedAccount,
} from "@/features/relationship/services/analysisComparisonService";
import { normalizeUsername } from "@/lib";

/** Renamed followers and followed accounts, once each. */
export function uniqueRenamed(
  comparison: AnalysisComparison
): RenamedAccount[] {
  const seen = new Set<string>();
  return [
    ...comparison.renamedFollowers,
    ...comparison.renamedFollowing,
  ].filter((pair) => {
    const key = normalizeUsername(pair.to.username);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// A small tag, "1 changed username", that opens in place: the new name
// (its profile link works) with the old one underneath. Accounts that only
// renamed count neither as unfollowed nor as new, and this says why the
// number is lower than expected without a card of its own. Opens inline,
// not as a popover, so it never covers anything on a phone.
export function RenamedAccounts({
  comparison,
}: {
  comparison: AnalysisComparison;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const renamed = uniqueRenamed(comparison);

  if (renamed.length === 0) return null;

  return (
    <div className="text-start">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((previous) => !previous)}
        className="border-brand-fg/30 bg-brand-fg/10 text-brand-fg focus-visible:shadow-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium outline-none"
      >
        {renamed.length} changed username
        <Icon
          name="singleArrowDown"
          color="current"
          width={12}
          height={12}
          aria-hidden="true"
          className={isOpen ? "rotate-180" : undefined}
        />
      </button>

      {isOpen && (
        <div
          id={panelId}
          className="border-line-subtle bg-surface-0 mt-2.5 max-w-md rounded-control border px-2 py-2"
        >
          <p className="text-fg-muted px-2 pt-1 pb-1.5 text-xs">
            Same account, new name: not counted as unfollowed.
          </p>
          <ul className="flex flex-col">
            {renamed.map(({ from, to }) => (
              <li key={`${from.username}-${to.username}`}>
                <UserListItem
                  user={to}
                  formatDate={() => `Previously @${from.username}`}
                  appearance="row"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
