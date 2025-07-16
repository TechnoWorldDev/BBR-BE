export function buildUpdatePayload<T extends object>(data: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key in data) {
    if (data[key] !== undefined) {
      result[key] = data[key];
    }
  }

  return result;
}
