import type { InstagramUser } from "../../types/instagram.types";

export function parseFollowers(json: unknown): InstagramUser[] {
  if (!Array.isArray(json)) {
    console.warn("parseFollowers: expected array, received:", json);
    return [];
  }

  return json
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;

      const stringListData = (entry as { string_list_data?: unknown }).string_list_data;

      if (!Array.isArray(stringListData) || stringListData.length === 0) {
        return null;
      }

      const firstItem = stringListData[0];

      if (!firstItem || typeof firstItem !== "object") {
        return null;
      }

      const data = firstItem as {
        value?: unknown;
        href?: unknown;
        timestamp?: unknown;
      };

      if (typeof data.value !== "string") {
        return null;
      }

      return {
        username: data.value,
        href: typeof data.href === "string" ? data.href : undefined,
        timestamp:
          typeof data.timestamp === "number" ? data.timestamp : undefined,
      };
    })
    .filter((user): user is InstagramUser => user !== null);
}