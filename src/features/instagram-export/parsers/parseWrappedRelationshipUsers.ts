import { isArray, isObject } from "@/lib/typeGuards";
import type { InstagramObjectArrayKeys } from "@/types/enums";
import type { InstagramUser } from "@/types/instagram.types";
import { isRelationshipObject } from "../utils/instagramUtils";

// Instagram's `label_values` export format labels this field in the
// export's own requested language, not always English - e.g. "Nome
// utente" for an export requested in Italian (confirmed on real
// exports). Extend this list (lowercase) as other languages are
// reported; comparison below is already case-insensitive.
const USERNAME_LABELS = ["username", "nome utente"];

function normalizeUsernameCandidate(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim().replace(/^@+/, "");
  return trimmed.length > 0 ? trimmed : null;
}

function findLabelValue(
  labelValues: unknown[],
  expectedLabels: string | string[]
): unknown | null {
  const candidates = (
    Array.isArray(expectedLabels) ? expectedLabels : [expectedLabels]
  ).map((label) => label.toLowerCase());

  const match = labelValues.find(
    (item) =>
      isObject(item) &&
      typeof item.label === "string" &&
      candidates.includes(item.label.toLowerCase())
  );

  return isObject(match) ? match.value : null;
}

/**
 * Last resort when no known label matches `USERNAME_LABELS` - every real
 * export observed so far uses exactly three `label_values` entries, in
 * this order (URL, display name, username). If a future language isn't
 * in the list above yet, this still recovers the username by position
 * instead of silently returning nothing.
 */
function findUsernameByPosition(labelValues: unknown[]): unknown | null {
  if (labelValues.length !== 3) return null;

  const last = labelValues[2];
  return isObject(last) ? last.value : null;
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
    findLabelValue(labelValues, USERNAME_LABELS) ??
      findUsernameByPosition(labelValues)
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
