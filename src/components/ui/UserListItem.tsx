import type { InstagramUser } from "../../types/instagram.types";
import { getInstagramProfileUrl } from "../utils/instagram";
import { extractFirstNameLetter } from "../utils/searchUtils";

function formatDate(timestamp?: number) {
  if (!timestamp) return null;

  const date = new Date(timestamp * 1000);

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

type UserListItemProps = {
  user: InstagramUser;
  formatDate: (timestamp?: number) => string | null;
};

export function UserListItem({ user }: UserListItemProps) {
  const href = getInstagramProfileUrl(user);
  const initial = extractFirstNameLetter(user.username.toUpperCase());
  const formattedDate = formatDate(user.timestamp);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={`Open @${user.username} on Instagram`}
      className="border-accent hover:bg-primary/10 flex items-center gap-4 rounded-[10px] border p-4 transition"
    >
      <div className="bg-primary/30 text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
        {initial}
      </div>

      <div className="flex min-w-0 flex-col text-start">
        <span className="p2-b text-primary truncate">{user.username}</span>

        {formattedDate && (
          <span className="text-foreground/60 mt-1 text-sm">
            {formattedDate}
          </span>
        )}
      </div>
    </a>
  );
}
