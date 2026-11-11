import { getApiUrl } from "@/lib/api";

export type UserPlan = "base" | "pro";

export type CurrentUser = {
  userId: string;
  email: string | null;
  plan: UserPlan;
};

type CurrentUserApiResponse = {
  user_id: string;
  email: string | null;
  plan: UserPlan;
};

export async function fetchCurrentUser(token: string): Promise<CurrentUser> {
  const response = await fetch(getApiUrl("/users/me"), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to load current user (status ${response.status})`);
  }

  const payload = (await response.json()) as CurrentUserApiResponse;

  return {
    userId: payload.user_id,
    email: payload.email,
    plan: payload.plan,
  };
}

export async function logUsageEvent(
  token: string,
  eventType: string
): Promise<void> {
  const response = await fetch(getApiUrl("/usage-events"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // No Instagram export/relationship data ever belongs in this body -
    // only a generic event name, matching backend/app/users/schemas.py.
    body: JSON.stringify({ event_type: eventType }),
  });

  if (!response.ok) {
    throw new Error(`Failed to log usage event (status ${response.status})`);
  }
}
