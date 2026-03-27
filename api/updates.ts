import type { VercelRequest, VercelResponse } from "@vercel/node";
import { retrievePublishedUpdates } from "../src/services/updates/updates.service";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  try {
    const updates = await retrievePublishedUpdates();

    return res.status(200).json({
      data: updates,
    });
  } catch (error) {
    console.error("Failed to load updates", error);

    return res.status(500).json({
      error: "Failed to load updates",
    });
  }
}
