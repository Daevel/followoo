import type { InstagramUser } from "../../types/instagram.types";

export function parseFollowing(json: unknown): InstagramUser[] {
  if (!json || typeof json !== "object") {
    console.warn("parseFollowing: invalid json", json);
    return [];
  }

  const list = (json as { relationships_following?: unknown })
    .relationships_following;

  if (!Array.isArray(list)) {
    console.warn("parseFollowing: relationships_following is not an array", list);
    return [];
  }

  console.log("parseFollowing list length:", list.length);
  console.log("parseFollowing first item:", list[0]);

  const parsed = list
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

      if (!username) {
        return null;
      }

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
    .filter((user): user is InstagramUser => user !== null);

  console.log("parseFollowing parsed length:", parsed.length);

  return parsed;
}