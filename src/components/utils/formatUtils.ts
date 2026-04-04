export function formatDate(timestamp?: number) {
  if (!timestamp) return null;

  const date = new Date(timestamp * 1000);

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
