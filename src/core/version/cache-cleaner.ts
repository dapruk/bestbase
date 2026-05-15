export interface CacheCleanerOptions {
  preserveLocalStorageKeys?: string[];
}

export async function clearCacheStorage(): Promise<void> {
  if (!('caches' in window)) {
    return;
  }

  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
}

export function clearSessionStorage(): void {
  window.sessionStorage.clear();
}

export function clearLocalStorage(options: CacheCleanerOptions = {}): void {
  const preserved = new Map<string, string>();

  options.preserveLocalStorageKeys?.forEach((key) => {
    const value = window.localStorage.getItem(key);

    if (value !== null) {
      preserved.set(key, value);
    }
  });

  window.localStorage.clear();
  preserved.forEach((value, key) => window.localStorage.setItem(key, value));
}

export function clearAppScopedLocalStorage(namespace: string): void {
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(`${namespace}:`))
    .forEach((key) => window.localStorage.removeItem(key));
}
