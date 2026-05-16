import { createMemoryPersistenceAdapter } from './create-persisted-state';
import { createWebStorageAdapter } from './state-local-storage';
import type { StatePersistenceAdapter } from './state-persistence.types';

export const stateSession: StatePersistenceAdapter =
  typeof window === 'undefined'
    ? createMemoryPersistenceAdapter()
    : createWebStorageAdapter(window.sessionStorage);
