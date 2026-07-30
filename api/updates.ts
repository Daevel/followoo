import { retrievePublishedUpdates } from "../server/updates/updates.service.js";

type JsonResponse = {
  status: (statusCode: number) => {
    json: (body: unknown) => unknown;
  };
};

export default async function handler(_req: unknown, res: JsonResponse) {
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
