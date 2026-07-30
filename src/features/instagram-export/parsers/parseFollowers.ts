import type { InstagramUser } from "@/types/instagram.types";
import { parseRelationshipUsersFromJson } from "./parseWrappedRelationshipUsers";

export function parseFollowers(json: unknown): InstagramUser[] {
  return parseRelationshipUsersFromJson(json);
}
