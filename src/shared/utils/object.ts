export function omitEmptyValues<TObject extends Record<string, unknown>>(
  object: TObject
) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  ) as Partial<TObject>;
}

export function pick<TObject extends object, TKey extends keyof TObject>(
  object: TObject,
  keys: readonly TKey[]
) {
  return keys.reduce<Pick<TObject, TKey>>(
    (result, key) => {
      result[key] = object[key];
      return result;
    },
    {} as Pick<TObject, TKey>
  );
}

export function omit<TObject extends object, TKey extends keyof TObject>(
  object: TObject,
  keys: readonly TKey[]
) {
  const omitted = new Set<keyof TObject>(keys);
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !omitted.has(key as keyof TObject))
  ) as Omit<TObject, TKey>;
}
