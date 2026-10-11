import { getApiUrl } from "@/lib/api";

export type KdfParams = {
  algorithm: string;
  hash: string;
  iterations: number;
  iv: string;
};

export type SyncCredentials =
  | { active: false }
  | {
      active: true;
      wrappedMasterKeyPassphrase: string;
      kdfSaltPassphrase: string;
      kdfParamsPassphrase: KdfParams;
      wrappedMasterKeyRecovery: string;
      kdfSaltRecovery: string;
      kdfParamsRecovery: KdfParams;
    };

type SyncCredentialsApiResponse = {
  active: boolean;
  wrapped_master_key_passphrase?: string;
  kdf_salt_passphrase?: string;
  kdf_params_passphrase?: KdfParams;
  wrapped_master_key_recovery?: string;
  kdf_salt_recovery?: string;
  kdf_params_recovery?: KdfParams;
};

export type ActivateSyncPayload = {
  wrappedMasterKeyPassphrase: string;
  kdfSaltPassphrase: string;
  kdfParamsPassphrase: KdfParams;
  wrappedMasterKeyRecovery: string;
  kdfSaltRecovery: string;
  kdfParamsRecovery: KdfParams;
};

export type RotatePassphrasePayload = {
  wrappedMasterKeyPassphrase: string;
  kdfSaltPassphrase: string;
  kdfParamsPassphrase: KdfParams;
};

// Every field below is already client-side ciphertext/KDF metadata -
// this module must never accept or return a passphrase, recovery code,
// or master key in plaintext. See src/features/sync/crypto/.

export async function fetchSyncCredentials(
  token: string
): Promise<SyncCredentials> {
  const response = await fetch(getApiUrl("/sync/credentials"), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load sync credentials (status ${response.status})`
    );
  }

  const payload = (await response.json()) as SyncCredentialsApiResponse;

  if (!payload.active) {
    return { active: false };
  }

  return {
    active: true,
    wrappedMasterKeyPassphrase: payload.wrapped_master_key_passphrase as string,
    kdfSaltPassphrase: payload.kdf_salt_passphrase as string,
    kdfParamsPassphrase: payload.kdf_params_passphrase as KdfParams,
    wrappedMasterKeyRecovery: payload.wrapped_master_key_recovery as string,
    kdfSaltRecovery: payload.kdf_salt_recovery as string,
    kdfParamsRecovery: payload.kdf_params_recovery as KdfParams,
  };
}

export async function activateSync(
  token: string,
  payload: ActivateSyncPayload
): Promise<void> {
  const response = await fetch(getApiUrl("/sync/activate"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wrapped_master_key_passphrase: payload.wrappedMasterKeyPassphrase,
      kdf_salt_passphrase: payload.kdfSaltPassphrase,
      kdf_params_passphrase: payload.kdfParamsPassphrase,
      wrapped_master_key_recovery: payload.wrappedMasterKeyRecovery,
      kdf_salt_recovery: payload.kdfSaltRecovery,
      kdf_params_recovery: payload.kdfParamsRecovery,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to activate sync (status ${response.status})`);
  }
}

export async function rotateSyncPassphrase(
  token: string,
  payload: RotatePassphrasePayload
): Promise<void> {
  const response = await fetch(getApiUrl("/sync/rotate-passphrase"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wrapped_master_key_passphrase: payload.wrappedMasterKeyPassphrase,
      kdf_salt_passphrase: payload.kdfSaltPassphrase,
      kdf_params_passphrase: payload.kdfParamsPassphrase,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to rotate sync passphrase (status ${response.status})`
    );
  }
}
