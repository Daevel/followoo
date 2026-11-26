import { useAuth } from "@clerk/react";
import { Link } from "react-router";
import { useFeatureFlag } from "@/analytics";
import { Collapse } from "@/components/ui/Collapse";
import { Icon } from "@/components/ui/Icon";
import { SYNC_FEATURE_FLAG_KEY } from "@/features/sync/constants";
import { useSyncKey } from "@/providers/SyncKeyProvider";

// One export can't tell "unfollowed you" from "never followed you": only a
// comparison of two exports can. This note says so without asking the user
// to redo anything, and says what happens next given their History state.
// It folds in once the History state is known and folds away when a real
// comparison takes its place (`hidden`).
export function ComparisonNote({
  hidden = false,
  className,
}: {
  hidden?: boolean;
  /** On the fold, e.g. spacing that should fold with the note. */
  className?: string;
}) {
  const isSyncEnabled = useFeatureFlag(SYNC_FEATURE_FLAG_KEY, false);
  const { isSignedIn } = useAuth();
  const { status } = useSyncKey();

  const isVisible =
    !hidden &&
    isSyncEnabled &&
    status !== "checking" &&
    status !== "unavailable";
  const isHistoryOn = status === "locked" || status === "unlocked";
  const text = isHistoryOn
    ? "Next time you analyze an export, Followoo compares it with this one in History. Nothing extra to do."
    : isSignedIn
      ? "Turn on encrypted History once, and every new analysis is compared with the previous one automatically."
      : "With a free account and encrypted History, every new analysis is compared with the previous one automatically.";
  const link = isHistoryOn
    ? "Open History"
    : isSignedIn
      ? "Turn on History"
      : "Learn more";

  return (
    <Collapse
      open={isVisible}
      motion="entrance"
      unmountOnClose
      className={className}
    >
      <aside className="border-brand-fg/25 flex flex-col gap-3 rounded-card border border-dashed px-4 py-3 text-start sm:flex-row sm:items-center">
        <Icon
          name="userCheck"
          color="current"
          width={18}
          height={18}
          className="text-brand-fg hidden shrink-0 sm:block"
          aria-hidden="true"
        />
        <p className="text-fg-muted flex-1 text-[13px] leading-snug">
          <strong className="text-fg font-semibold">
            Want to know exactly who unfollowed you?
          </strong>{" "}
          {text}
        </p>
        <Link
          to="/history"
          className="text-brand-fg focus-visible:shadow-ring shrink-0 rounded-control text-[13px] font-medium outline-none"
        >
          {link}
        </Link>
      </aside>
    </Collapse>
  );
}
