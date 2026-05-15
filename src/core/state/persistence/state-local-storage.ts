import type { StatePersistenceAdapter } from './state-persistence.types';
import {
  deserializeState,
  serializeState,
  toPersistenceKey,
} from './state-serializer';

export function createWebStorageAdapter(
  storage: Storage,
  namespace?: string,
  version = 1
): StatePersistenceAdapter {
  return {
    async getItem<T>(key: string) {
      return deserializeState<T>(
        storage.getItem(toPersistenceKey(key, namespace)),
        version
      );
    },
    async setItem(key, value) {
      storage.setItem(
        toPersistenceKey(key, namespace),
        serializeState(value, version)
      );
    },
    async removeItem(key) {
      storage.removeItem(toPersistenceKey(key, namespace));
    },
    async clear(clearNamespace = namespace) {
      if (!clearNamespace) {
        storage.clear();
        return;
      }

      Object.keys(storage)
        .filter((key) => key.startsWith(`${clearNamespace}:`))
        .forEach((key) => storage.removeItem(key));
    },
  };
}

export const stateLocalStorage: StatePersistenceAdapter =
  createWebStorageAdapter(window.localStorage);
