export async function ensureMinimumDelay(
  startTime: number,
  minimumDelay: number,
) {
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(0, minimumDelay - elapsed);

  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
}
