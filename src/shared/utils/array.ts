export function uniqueBy<TItem, TKey>(
  items: readonly TItem[],
  getKey: (item: TItem) => TKey
) {
  const seen = new Set<TKey>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function groupBy<TItem, TKey extends PropertyKey>(
  items: readonly TItem[],
  getKey: (item: TItem) => TKey
) {
  return items.reduce<Record<TKey, TItem[]>>(
    (groups, item) => {
      const key = getKey(item);
      groups[key] = [...(groups[key] ?? []), item];
      return groups;
    },
    {} as Record<TKey, TItem[]>
  );
}

export function chunkArray<TItem>(items: readonly TItem[], size: number) {
  if (size <= 0) return [];
  const chunks: TItem[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export function compactArray<TItem>(
  items: readonly (TItem | false | null | undefined)[]
) {
  return items.filter(Boolean) as TItem[];
}
