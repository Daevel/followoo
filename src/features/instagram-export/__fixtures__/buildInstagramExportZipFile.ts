import JSZip from "jszip";

// JSZip reads a Blob/File via the browser's FileReader API. Vitest's "unit"
// project runs in Node, which has File/Blob but no FileReader, so JSZip
// would otherwise reject a real File with "unsupported type". This
// minimal polyfill is only ever imported by tests, never by app code.
if (typeof FileReader === "undefined") {
  class NodeFileReaderPolyfill {
    onload: ((event: { target: { result: ArrayBuffer } }) => void) | null =
      null;
    onerror: ((event: { target: { error: unknown } }) => void) | null = null;

    readAsArrayBuffer(blob: Blob): void {
      blob
        .arrayBuffer()
        .then((result) => {
          this.onload?.({ target: { result } });
        })
        .catch((error: unknown) => {
          this.onerror?.({ target: { error } });
        });
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: minimal Node-only test polyfill for a browser global.
  (globalThis as any).FileReader = NodeFileReaderPolyfill;
}

// Builds an in-memory ZIP File from a map of zip-relative path -> JSON
// content, mirroring the shape of a real Instagram export archive.
export async function buildInstagramExportZipFile(
  entries: Record<string, unknown>,
  fileName = "instagram-export.zip"
): Promise<File> {
  const zip = new JSZip();

  for (const [path, content] of Object.entries(entries)) {
    zip.file(path, JSON.stringify(content));
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return new File([blob], fileName, { type: "application/zip" });
}
