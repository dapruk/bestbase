import { createWebStorageAdapter } from './state-local-storage';
import type { StatePersistenceAdapter } from './state-persistence.types';

export const stateSession: StatePersistenceAdapter = createWebStorageAdapter(
  window.sessionStorage
);
