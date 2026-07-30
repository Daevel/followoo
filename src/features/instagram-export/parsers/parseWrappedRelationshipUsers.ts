import { isArray, isObject } from "@/lib/typeGuards";
import type { InstagramObjectArrayKeys } from "@/types/enums";
import type { InstagramUser } from "@/types/instagram.types";
import { isRelationshipObject } from "../utils/instagramUtils";

function normalizeUsernameCandidate(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim().replace(/^@+/, "");
  return trimmed.length > 0 ? trimmed : null;
}

function findLabelValue(
  labelValues: unknown[],
  expectedLabel: string
): unknown | null {
  const match = labelValues.find(
    (item) =>
      isObject(item) &&
      typeof item.label === "string" &&
      item.label.toLowerCase() === expectedLabel.toLowerCase()
  );

  return isObject(match) ? match.value : null;
}

function parseRelationshipUserEntry(entry: unknown): InstagramUser[] {
  if (!isRelationshipObject(entry)) return [];

  const stringListData = entry.string_list_data;

  if (isArray(stringListData) && stringListData.length > 0) {
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
  }

  const labelValues = entry.label_values;

  if (!isArray(labelValues) || labelValues.length === 0) {
    return [];
  }

  const username = normalizeUsernameCandidate(
    findLabelValue(labelValues, "Username")
  );

  if (!username) {
    return [];
  }

  const href = findLabelValue(labelValues, "URL");

  return [
    {
      username,
      href:
        typeof href === "string" && href.trim().length > 0
          ? href.trim()
          : `https://www.instagram.com/${username}/`,
      timestamp:
        typeof entry.timestamp === "number" ? entry.timestamp : undefined,
    },
  ];
}

export function parseRelationshipUsersFromJson(
  json: unknown,
  key?: InstagramObjectArrayKeys
): InstagramUser[] {
  if (key !== undefined && isObject(json)) {
    const keyedList = json[key];

    if (isArray(keyedList)) {
      return keyedList.flatMap(parseRelationshipUserEntry);
    }
  }

  if (isArray(json)) {
    return json.flatMap(parseRelationshipUserEntry);
  }

  return parseRelationshipUserEntry(json);
}

export function parseWrappedRelationshipUsers(
  json: unknown,
  key: InstagramObjectArrayKeys
): InstagramUser[] {
  return parseRelationshipUsersFromJson(json, key);
}
