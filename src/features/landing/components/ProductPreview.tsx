import { Icon } from "@/components/ui/Icon";

// Illustrative sample shaped like the real results page (answer first, the
// follow-back rate ring, then the network bars), so the hero matches what
// people get after the analysis. Numbers are made up and consistent:
// 128 following, 119 mutual, 9 don't follow back, 342 followers.
const SAMPLE = {
  following: 128,
  followers: 342,
  mutual: 119,
  notFollowingBack: 9,
};
const RATE = Math.round((SAMPLE.mutual / SAMPLE.following) * 100);
const RING_RADIUS = 15;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const bars = [
  {
    label: "People you follow",
    total: SAMPLE.following,
    rest: SAMPLE.following - SAMPLE.mutual,
    restClass: "bg-data-3",
  },
  {
    label: "People who follow you",
    total: SAMPLE.followers,
    rest: SAMPLE.followers - SAMPLE.mutual,
    restClass: "bg-data-2",
  },
];

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
            Your results
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

        <div className="border-line-strong bg-surface-1 flex items-center gap-4 rounded-card border bg-[radial-gradient(120%_140%_at_0%_0%,color-mix(in_srgb,var(--color-success)_16%,transparent),transparent_55%)] p-4">
          <div className="min-w-0 flex-1">
            <p className="text-fg-muted flex items-center gap-1.5 text-[11px] font-medium">
              <span
                aria-hidden="true"
                className="bg-data-3 size-1.5 rounded-full"
              />
              Don&apos;t follow you back
            </p>
            <p className="text-fg mt-1 text-[40px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
              {SAMPLE.notFollowingBack}
            </p>
            <p className="text-fg-muted mt-1 text-xs">
              of the{" "}
              <strong className="text-fg font-semibold">
                {SAMPLE.following} people you follow
              </strong>
            </p>
            <span className="bg-brand text-on-brand mt-3 inline-flex rounded-control px-3 py-1.5 text-xs font-semibold">
              See who →
            </span>
          </div>
          <div className="relative size-[72px] shrink-0">
            <svg
              viewBox="0 0 36 36"
              aria-hidden="true"
              className="size-full -rotate-90"
            >
              <circle
                cx={18}
                cy={18}
                r={RING_RADIUS}
                fill="none"
                strokeWidth={3.2}
                className="stroke-surface-2"
              />
              <circle
                cx={18}
                cy={18}
                r={RING_RADIUS}
                fill="none"
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeDasharray={RING_LENGTH}
                strokeDashoffset={RING_LENGTH * (1 - RATE / 100)}
                className="stroke-success"
              />
            </svg>
            <span className="text-fg absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">
              {RATE}%
            </span>
          </div>
        </div>

        <div className="border-line-subtle bg-surface-1 flex flex-col gap-2.5 rounded-card border p-4">
          {bars.map((bar) => (
            <div key={bar.label}>
              <p className="text-fg flex justify-between text-xs">
                {bar.label}
                <span className="font-semibold tabular-nums">{bar.total}</span>
              </p>
              <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full">
                <span
                  className="bg-data-1"
                  style={{ width: `${(SAMPLE.mutual / bar.total) * 100}%` }}
                />
                <span className={`${bar.restClass} flex-1`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
