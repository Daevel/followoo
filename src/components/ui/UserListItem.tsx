import clsx from "clsx";
import { getInstagramProfileUrl } from "@/features/instagram-export/utils/instagramUtils";
import { extractFirstNameLetter } from "@/lib/searchUtils";
import type { InstagramUser } from "../../types/instagram.types";
import { Badge } from "./Badge";
import { Icon } from "./Icon";

type UserListItemProps = {
  user: InstagramUser;
  formatDate: (timestamp?: number) => string | null;
  /** What the date means in this list, e.g. "Follows you since". */
  datePrefix?: string;
  /** Short facts from other lists, e.g. "Close Friend"; shown as badges. */
  badges?: readonly string[];
  /** `row` drops border and fill, for lists already inside a card. */
  appearance?: "card" | "row";
};

export function UserListItem({
  user,
  formatDate,
  datePrefix,
  badges = [],
  appearance = "card",
}: UserListItemProps) {
  const href = getInstagramProfileUrl(user);
  const initial = extractFirstNameLetter(user.username.toUpperCase());
  const formattedDate = formatDate(user.timestamp);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={`Open @${user.username} on Instagram`}
      className={clsx(
        "group hover:bg-surface-2 focus-visible:shadow-ring flex min-w-0 items-center gap-3 rounded-control px-3 py-2.5 transition-colors focus-visible:outline-none",
        appearance === "card" && "border-line-subtle bg-surface-1 border"
      )}
    >
      <div className="border-line-strong bg-surface-2 text-fg flex size-9 shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold">
        {initial}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-start">
        <span className="text-fg truncate text-sm font-medium">
          @{user.username}
        </span>
        {formattedDate && (
          <span className="text-fg-muted text-xs tabular-nums">
            {datePrefix ? `${datePrefix} ${formattedDate}` : formattedDate}
          </span>
        )}
        {badges.length > 0 && (
          <span className="mt-1 flex flex-wrap gap-1.5 sm:hidden">
            {badges.map((badge) => (
              <Badge key={badge} size="sm">
                {badge}
              </Badge>
            ))}
          </span>
        )}
      </div>

      {badges.length > 0 && (
        <span className="hidden shrink-0 flex-wrap justify-end gap-1.5 sm:flex">
          {badges.map((badge) => (
            <Badge key={badge} size="sm">
              {badge}
            </Badge>
          ))}
        </span>
      )}

      <Icon
        name="arrowRight"
        color="current"
        width={14}
        height={14}
        className="text-fg-faint group-hover:text-fg-muted shrink-0 transition-colors"
        aria-hidden="true"
      />
    </a>
  );
}
