/**
 * base64 <-> raw bytes, for carrying binary crypto material (ciphertext,
 * salts, IVs) as JSON strings over the wire and in the backend's `text`
 * columns. No DOM needed - `btoa`/`atob` are globals in both the browser
 * and this project's test environments (Node, jsdom).
 */

export function bytesToBase64(bytes: Uint8Array<ArrayBuffer>): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

export function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}
