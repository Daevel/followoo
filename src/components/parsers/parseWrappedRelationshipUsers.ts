// parsers/parseWrappedRelationshipUsers.ts
import type { InstagramUser } from "../../types/instagram.types";

function isNonNull<T>(value: T | null): value is T {
  return value !== null;
}

export function parseWrappedRelationshipUsers(
  json: unknown,
  key: string,
): InstagramUser[] {
  if (!json || typeof json !== "object") {
    console.warn("parseWrappedRelationshipUsers: invalid json", json);
    return [];
  }

  const list = (json as Record<string, unknown>)[key];

  if (!Array.isArray(list)) {
    console.warn(
      `parseWrappedRelationshipUsers: key "${key}" is not an array`,
      json,
    );
    return [];
  }

  return list
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;

      const typedEntry = entry as {
        title?: unknown;
        string_list_data?: unknown;
      };

      const stringListData = typedEntry.string_list_data;
      const firstItem =
        Array.isArray(stringListData) && stringListData.length > 0
          ? stringListData[0]
          : null;

      const typedFirstItem =
        firstItem && typeof firstItem === "object"
          ? (firstItem as {
              value?: unknown;
              href?: unknown;
              timestamp?: unknown;
            })
          : null;

      const username =
        typeof typedEntry.title === "string" && typedEntry.title.trim() !== ""
          ? typedEntry.title
          : typeof typedFirstItem?.value === "string"
            ? typedFirstItem.value
            : null;

      if (!username) return null;

      return {
        username,
        href:
          typeof typedFirstItem?.href === "string"
            ? typedFirstItem.href
            : `https://instagram.com/${username}`,
        timestamp:
          typeof typedFirstItem?.timestamp === "number"
            ? typedFirstItem.timestamp
            : undefined,
      };
    })
    .filter(isNonNull);
}