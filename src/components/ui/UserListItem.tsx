import { getInstagramProfileUrl } from "@/features/instagram-export/utils/instagramUtils";
import { extractFirstNameLetter } from "@/lib/searchUtils";
import type { InstagramUser, UserPersona } from "../../types/instagram.types";
import { Icon } from "./Icon";
import { PersonaBadge } from "./PersonaBadge";

type UserListItemProps = {
  user: InstagramUser;
  formatDate: (timestamp?: number) => string | null;
  persona?: UserPersona;
};

export function UserListItem({ user, formatDate, persona }: UserListItemProps) {
  const href = getInstagramProfileUrl(user);
  const initial = extractFirstNameLetter(user.username.toUpperCase());
  const formattedDate = formatDate(user.timestamp);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={`Open @${user.username} on Instagram`}
      className="group border-line-subtle bg-surface-1 hover:bg-surface-2 focus-visible:shadow-ring flex min-w-0 items-center gap-3 rounded-control border px-3 py-2.5 transition-colors focus-visible:outline-none"
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
            {formattedDate}
          </span>
        )}
      </div>

      {persona && <PersonaBadge persona={persona} size="sm" />}

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
