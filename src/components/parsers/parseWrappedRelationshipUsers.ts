import type { InstagramObjectArrayKeys } from "../../types/enums";
import type { InstagramUser } from "../../types/instagram.types";
import { isRelationshipObject } from "../utils/instagramGuards";
import { isArray, isObject } from "../utils/typeGuards";

export function parseWrappedRelationshipUsers(
  json: unknown,
  key: InstagramObjectArrayKeys,
): InstagramUser[] {
  if (!isObject(json)) return [];

  const list = json[key];

  if (!isArray(list)) return [];

  return list.flatMap((entry): InstagramUser[] => {
    if (!isRelationshipObject(entry)) return [];

    const stringListData = entry.string_list_data;

    if (!isArray(stringListData) || stringListData.length === 0) {
      return [];
    }

    const firstItem = stringListData[0];

    if (!isObject(firstItem)) {
      return [];
    }

    const username =
      typeof firstItem.value === "string" && firstItem.value.trim() !== ""
        ? firstItem.value
        : typeof entry.title === "string" && entry.title.trim() !== ""
          ? entry.title
          : null;

    if (!username) {
      return [];
    }

    return [
      {
        username,
        href:
          typeof firstItem.href === "string"
            ? firstItem.href
            : `https://instagram.com/${username}`,
        timestamp:
          typeof firstItem.timestamp === "number"
            ? firstItem.timestamp
            : undefined,
      },
    ];
  });
}