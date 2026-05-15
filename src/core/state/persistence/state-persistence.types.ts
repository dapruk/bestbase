export interface StatePersistenceAdapter {
  getItem: <T>(key: string) => Promise<T | null>;
  setItem: <T>(key: string, value: T) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear?: (namespace?: string) => Promise<void>;
}

export interface PersistedStateEnvelope<T> {
  data: T;
  updatedAt: string;
  version: number;
}

export interface PersistedStateOptions<T> {
  adapter: StatePersistenceAdapter;
  key: string;
  namespace?: string;
  version: number;
  migrate?: (value: unknown, fromVersion: number) => T;
}
