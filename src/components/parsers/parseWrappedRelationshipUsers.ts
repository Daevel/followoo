import type { InstagramObjectArrayKeys } from "../../types/enums";
import type { InstagramUser } from "../../types/instagram.types";
import { isRelationshipObject } from "../utils/instagramGuards";
import { isArray, isObject } from "../utils/typeGuards";

function normalizeUsernameCandidate(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

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
      normalizeUsernameCandidate(firstItem.value) ??
      normalizeUsernameCandidate(entry.title);

    if (!username) {
      return [];
    }

    return [
      {
        username,
        href:
          typeof firstItem.href === "string"
            ? firstItem.href
            : `https://www.instagram.com/${username}/`,
        timestamp:
          typeof firstItem.timestamp === "number"
            ? firstItem.timestamp
            : undefined,
      },
    ];
  });
}