import { Icon } from "@/components/ui/Icon";
import { UserListItem } from "@/components/ui/UserListItem";
import type { InstagramUser, UserPersona } from "@/types/instagram.types";

// Illustrative sample (same usernames as the demo export): the hero shows the
// real results UI instead of a static screenshot, so it never goes stale.
const sampleUsers: { user: InstagramUser; persona: UserPersona }[] = [
  {
    user: { username: "alex.rossi", timestamp: 1773619200 },
    persona: "LURKER",
  },
  {
    user: { username: "giulia.design", timestamp: 1773619200 },
    persona: "FICKLE",
  },
  {
    user: { username: "luca.codes", timestamp: 1773619200 },
    persona: "SUPER_FAN",
  },
];

const sampleStats = [
  { label: "Followers", value: "342" },
  { label: "Mutual", value: "128" },
  { label: "Unfollowers", value: "9" },
];

const formatSampleDate = () => "Mar 16, 2026";

export function ProductPreview() {
  return (
    <div
      role="img"
      aria-label="Preview of the Followoo results page"
      className="border-line-strong bg-surface-1 overflow-hidden rounded-2xl border shadow-[0_8px_24px_rgb(0_0_0/0.45),0_40px_80px_rgb(0_0_0/0.35)]"
    >
      <div className="border-line-subtle flex items-center gap-1.5 border-b px-4 py-2.5">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="border-line-strong bg-surface-2 size-2.5 rounded-full border"
          />
        ))}
        <span className="text-fg-faint ml-2 text-xs">followoo.app/results</span>
      </div>

      <div inert className="bg-surface-0 flex flex-col gap-3 p-4 text-start">
        <div className="flex items-center justify-between gap-3">
          <p className="text-fg text-[15px] font-semibold tracking-[-0.01em]">
            Your network analysis
          </p>
          <span className="text-success inline-flex items-center gap-1 text-xs">
            <Icon
              name="lock"
              color="current"
              width={12}
              height={12}
              aria-hidden="true"
            />
            In your browser
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {sampleStats.map((stat) => (
            <div
              key={stat.label}
              className="border-line-subtle bg-surface-1 rounded-control border p-3"
            >
              <p className="text-fg-muted truncate text-[11px] font-medium">
                {stat.label}
              </p>
              <p className="text-fg mt-1 text-xl leading-none font-semibold tracking-[-0.02em] tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="border-line-subtle bg-surface-1 divide-line-subtle flex flex-col divide-y rounded-control border px-1">
          {sampleUsers.map(({ user, persona }) => (
            <div key={user.username} className="py-0.5">
              <UserListItem
                user={user}
                persona={persona}
                formatDate={formatSampleDate}
                appearance="row"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
