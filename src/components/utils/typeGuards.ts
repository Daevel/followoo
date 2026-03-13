export function isNull(value: unknown): value is null {
  return value === null;
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T,
): value is T[] {
  return isArray(value) && value.every(guard);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return !isNull(value) && typeof value === "object" && !isArray(value);
}

export function isString(value: unknown): value is string {
  return !isNull(value) && typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return !isNull(value) && typeof value === "number";
}
