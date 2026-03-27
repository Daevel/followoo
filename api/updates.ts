import type { VercelRequest, VercelResponse } from "@vercel/node";
import { retrievePublishedUpdates } from "../src/server/updates/updates.service.js";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  try {
    console.log(
      "FOLLOWOO_DATABASE_URL exists:",
      Boolean(process.env.FOLLOWOO_DATABASE_URL),
    );

    const updates = await retrievePublishedUpdates();

    console.log("Retrieved updates count:", updates.length);
    console.log("Retrieved updates:", updates);

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
