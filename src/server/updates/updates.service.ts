import { getPublishedUpdates } from "./updates.repository";

export async function retrievePublishedUpdates() {
  return getPublishedUpdates();
}
