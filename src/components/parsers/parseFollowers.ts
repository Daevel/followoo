import type { InstagramUser } from "../../types/instagram.types";
import { isRawInstagramUser, isRelationshipObject } from "../utils/instagramGuards";
import { isArray } from "../utils/typeGuards";
import { normalizeInstagramUser } from "../utils/utils";

export function parseFollowers(json: unknown): InstagramUser[] {
  if (!isArray(json)) return [];

  return json.flatMap((entry): InstagramUser[] => {
    if (!isRelationshipObject(entry)) return [];

    const { string_list_data } = entry;

    if (!isArray(string_list_data) || string_list_data.length === 0) {
      return [];
    }

    const firstItem = string_list_data[0];

    if (!isRawInstagramUser(firstItem)) {
      return [];
    }

    return [normalizeInstagramUser(firstItem)];
  });
}