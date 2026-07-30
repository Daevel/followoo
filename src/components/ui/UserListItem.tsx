import { getInstagramProfileUrl } from "@/features/instagram-export/utils/instagramUtils";
import { extractFirstNameLetter } from "@/lib/searchUtils";
import type { InstagramUser, UserPersona } from "../../types/instagram.types";
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
      className="border-accent hover:bg-primary/10 flex min-w-0 items-center gap-3 rounded-[10px] border p-3 transition sm:gap-4 sm:p-4"
    >
      <div className="bg-primary/30 text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
        {initial}
      </div>

      <div className="flex min-w-0 flex-col gap-2 text-start">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="p2-b text-primary truncate">{user.username}</span>
          {persona && <PersonaBadge persona={persona} size="sm" />}
        </div>

        {formattedDate && (
          <span className="text-foreground/60 text-sm">{formattedDate}</span>
        )}
      </div>
    </a>
  );
}
