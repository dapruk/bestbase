import { api } from '@/core/http/fetcher';

import type { StatePersistenceAdapter } from './state-persistence.types';

export function createStateRedis(endpoint: string): StatePersistenceAdapter {
  return {
    async getItem<T>(key: string) {
      return api.get<T | null>(endpoint, { params: { key } });
    },
    async setItem(key, value) {
      await api.put(endpoint, { key, value });
    },
    async removeItem(key) {
      await api.delete(endpoint, { params: { key } });
    },
    async clear(namespace) {
      await api.delete(endpoint, { params: { namespace } });
    },
  };
}

export const stateRedis = createStateRedis('/state/persistence');
