import type {
  PersistedStateOptions,
  StatePersistenceAdapter,
} from './state-persistence.types';
import {
  deserializeState,
  serializeState,
  toPersistenceKey,
} from './state-serializer';

export function createMemoryPersistenceAdapter(): StatePersistenceAdapter {
  const values = new Map<string, unknown>();

  return {
    async getItem<T>(key: string) {
      return (values.get(key) as T | undefined) ?? null;
    },
    async setItem(key, value) {
      values.set(key, value);
    },
    async removeItem(key) {
      values.delete(key);
    },
    async clear(namespace) {
      Array.from(values.keys())
        .filter((key) => !namespace || key.startsWith(`${namespace}:`))
        .forEach((key) => values.delete(key));
    },
  };
}

export function createPersistedState<T>({
  adapter,
  key,
  migrate,
  namespace,
  version,
}: PersistedStateOptions<T>) {
  const persistenceKey = toPersistenceKey(key, namespace);

  return {
    async get(): Promise<T | null> {
      const storedValue = await adapter.getItem<string>(persistenceKey);
      return deserializeState(storedValue, version, migrate);
    },
    async set(value: T): Promise<void> {
      await adapter.setItem(persistenceKey, serializeState(value, version));
    },
    async remove(): Promise<void> {
      await adapter.removeItem(persistenceKey);
    },
  };
}
