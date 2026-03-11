import type { InstagramUser } from "../../types/instagram.types";
import { extractFirstNameLetter } from "../utils/utils";

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
  const href = user.href ?? `https://instagram.com/${user.username}`;
  const initial = extractFirstNameLetter(user.username.toUpperCase());
  const formattedDate = formatDate(user.timestamp);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={`Open @${user.username} on Instagram`}
      className="flex items-center gap-4 border border-accent p-4 transition hover:bg-primary/10"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/30 text-sm font-bold text-foreground">
        {initial}
      </div>

      <div className="flex min-w-0 flex-col text-start">
        <span className="truncate p2-b text-primary">{user.username}</span>

        {formattedDate && (
          <span className="mt-1 text-sm text-foreground/60">
            {formattedDate}
          </span>
        )}
      </div>
    </a>
  );
}
