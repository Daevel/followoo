import type { InstagramUser } from "../../types/instagram.types";

export type EngagementPeriod = "week" | "month" | "all";

export type TimelineDataPoint = {
  period: string;
  date: Date;
  count: number;
  percentage: number;
};

export type EngagementPatternResult = {
  data: TimelineDataPoint[];
  totalUnfollowers: number;
  peakPeriod: TimelineDataPoint | null;
  averagePerPeriod: number;
  trend: "increasing" | "decreasing" | "stable";
};

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

function formatWeekRange(startDate: Date): string {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function groupByMonth(
  users: InstagramUser[],
): Map<string, { date: Date; count: number }> {
  const groupMap = new Map<string, { date: Date; count: number }>();

  users.forEach((user) => {
    if (!user.timestamp) return;

    const date = new Date(user.timestamp * 1000);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    groupMap.set(monthKey, {
      date: startOfMonth,
      count: (groupMap.get(monthKey)?.count ?? 0) + 1,
    });
  });

  return groupMap;
}

function groupByWeek(
  users: InstagramUser[],
): Map<string, { date: Date; count: number }> {
  const groupMap = new Map<string, Date>();
  const weekCounts = new Map<string, number>();

  users.forEach((user) => {
    if (!user.timestamp) return;

    const date = new Date(user.timestamp * 1000);
    const weekStart = getStartOfWeek(date);
    const weekKey = weekStart.getTime().toString();

    if (!groupMap.has(weekKey)) {
      groupMap.set(weekKey, weekStart);
    }
    weekCounts.set(weekKey, (weekCounts.get(weekKey) ?? 0) + 1);
  });

  const result = new Map<string, { date: Date; count: number }>();

  Array.from(groupMap.entries())
    .sort((a, b) => a[1].getTime() - b[1].getTime())
    .forEach(([key, weekDate]) => {
      const count = weekCounts.get(key) ?? 0;
      const period = formatWeekRange(weekDate);
      result.set(period, { date: weekDate, count });
    });

  return result;
}

export function calculateEngagementPattern(
  recentUnfollowers: InstagramUser[],
  period: EngagementPeriod = "month",
): EngagementPatternResult {
  const unfollowersWithTimestamp = recentUnfollowers.filter(
    (user) => user.timestamp,
  );

  if (unfollowersWithTimestamp.length === 0) {
    return {
      data: [],
      totalUnfollowers: 0,
      peakPeriod: null,
      averagePerPeriod: 0,
      trend: "stable",
    };
  }

  let groupedData: Map<string, { date: Date; count: number }>;

  if (period === "month") {
    groupedData = groupByMonth(unfollowersWithTimestamp);
  } else {
    groupedData = groupByWeek(unfollowersWithTimestamp);
  }

  const sortedEntries = Array.from(groupedData.entries())
    .map(([periodStr, data]) => {
      return { periodStr, count: data.count, date: data.date };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const totalUnfollowers = sortedEntries.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const timelineData: TimelineDataPoint[] = sortedEntries.map(
    ({ periodStr, count, date }) => ({
      period:
        period === "month"
          ? date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : periodStr,
      date,
      count,
      percentage: (count / totalUnfollowers) * 100,
    }),
  );

  const peakPeriod =
    timelineData.length > 0
      ? timelineData.reduce((max, current) =>
          current.count > max.count ? current : max,
        )
      : null;

  const averagePerPeriod =
    timelineData.length > 0 ? totalUnfollowers / timelineData.length : 0;

  // Calcola trend: confronta prima metà con seconda metà
  let trend: "increasing" | "decreasing" | "stable" = "stable";

  if (timelineData.length > 4) {
    const midpoint = Math.floor(timelineData.length / 2);
    const firstHalf = timelineData
      .slice(0, midpoint)
      .reduce((sum, item) => sum + item.count, 0);
    const secondHalf = timelineData
      .slice(midpoint)
      .reduce((sum, item) => sum + item.count, 0);

    const avgFirst = firstHalf / midpoint;
    const avgSecond = secondHalf / (timelineData.length - midpoint);

    if (avgSecond > avgFirst * 1.2) {
      trend = "increasing";
    } else if (avgSecond < avgFirst * 0.8) {
      trend = "decreasing";
    }
  }

  return {
    data: timelineData,
    totalUnfollowers,
    peakPeriod,
    averagePerPeriod,
    trend,
  };
}
