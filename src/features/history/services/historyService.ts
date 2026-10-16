import { getApiUrl } from "@/lib/api";

export type SnapshotListItem = {
  id: string;
  createdAt: string;
};

export type SnapshotDetail = SnapshotListItem & {
  encryptedBlob: string;
  iv: string;
};

type SnapshotListItemApiResponse = {
  id: string;
  created_at: string;
};

type SnapshotDetailApiResponse = SnapshotListItemApiResponse & {
  encrypted_blob: string;
  iv: string;
};

// Every field below is already client-side ciphertext (`encryptedBlob`)
// or non-secret decryption metadata (`iv`, `createdAt`) - this module
// must never accept or return a plaintext InstagramAnalysisResult.

export async function createSnapshot(
  token: string,
  payload: { encryptedBlob: string; iv: string }
): Promise<void> {
  const response = await fetch(getApiUrl("/snapshots"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      encrypted_blob: payload.encryptedBlob,
      iv: payload.iv,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to save history snapshot (status ${response.status})`
    );
  }
}

export async function listSnapshots(
  token: string,
  options: { limit?: number; offset?: number } = {}
): Promise<SnapshotListItem[]> {
  const params = new URLSearchParams();

  if (options.limit !== undefined) {
    params.set("limit", String(options.limit));
  }

  if (options.offset !== undefined) {
    params.set("offset", String(options.offset));
  }

  const query = params.toString();
  const url = getApiUrl(`/snapshots${query ? `?${query}` : ""}`);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to list history snapshots (status ${response.status})`
    );
  }

  const payload = (await response.json()) as SnapshotListItemApiResponse[];

  return payload.map((item) => ({ id: item.id, createdAt: item.created_at }));
}

export async function getSnapshot(
  token: string,
  id: string
): Promise<SnapshotDetail> {
  const response = await fetch(getApiUrl(`/snapshots/${id}`), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load history snapshot (status ${response.status})`
    );
  }

  const payload = (await response.json()) as SnapshotDetailApiResponse;

  return {
    id: payload.id,
    createdAt: payload.created_at,
    encryptedBlob: payload.encrypted_blob,
    iv: payload.iv,
  };
}

export async function deleteSnapshot(token: string, id: string): Promise<void> {
  const response = await fetch(getApiUrl(`/snapshots/${id}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete history snapshot (status ${response.status})`
    );
  }
}
