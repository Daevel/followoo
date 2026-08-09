const LOCAL_API_BASE_URL = "http://localhost:8000";

export function getApiUrl(path: `/${string}`) {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  const baseUrl =
    configuredBaseUrl || (import.meta.env.DEV ? LOCAL_API_BASE_URL : "");

  if (!baseUrl) {
    throw new Error("Missing VITE_API_BASE_URL for production API calls.");
  }

  return `${baseUrl.replace(/\/$/, "")}${path}`;
}
