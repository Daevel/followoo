const DEFAULT_API_BASE_URL = "http://localhost:8000";

export function getApiUrl(path: `/${string}`) {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

  return `${baseUrl.replace(/\/$/, "")}${path}`;
}
