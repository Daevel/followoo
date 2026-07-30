import { getPublishedUpdates } from "./updates.repository.js";

export async function retrievePublishedUpdates() {
  return getPublishedUpdates();
}
