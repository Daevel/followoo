import type { InstagramRawUser, InstagramUser } from "../../types/instagram.types";
import { isNumber, isObject, isString } from "./typeGuards";
import type { InstagramRawRelationshipObject } from "../../types/instagram.types";

export function isRawInstagramUser(value: unknown): value is InstagramRawUser {
  if (!isObject(value)) return false;

  const { value: username, href, timestamp } = value;

  return (
    isString(username) &&
    (href === undefined || isString(href)) &&
    (timestamp === undefined || isNumber(timestamp))
  );
}

export function isInstagramUser(value: unknown): value is InstagramUser {
  if (!isObject(value)) return false;

  return (
    isString(value.value) &&
    (value.href === undefined || isString(value.href)) &&
    (value.timestamp === undefined || isNumber(value.timestamp))
  );
}

export function isRelationshipObject(
  value: unknown,
): value is InstagramRawRelationshipObject {
  return isObject(value);
}
