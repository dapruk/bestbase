import { describe, expect, it } from 'vitest';

import {
  createMemoryPersistenceAdapter,
  createPersistedState,
} from './create-persisted-state';
import {
  deserializeState,
  serializeState,
  toPersistenceKey,
} from './state-serializer';

describe('state persistence', () => {
  it('stores versioned values through the async adapter interface', async () => {
    const persisted = createPersistedState({
      adapter: createMemoryPersistenceAdapter(),
      key: 'table',
      namespace: 'bestbase',
      version: 1,
    });

    await persisted.set({ page: 2 });

    await expect(persisted.get()).resolves.toEqual({ page: 2 });
  });

  it('falls back on invalid state and supports migrations', () => {
    expect(deserializeState('{bad json', 1)).toBeNull();

    const oldValue = serializeState({ name: 'old' }, 1);
    const migrated = deserializeState(oldValue, 2, (value) => ({
      ...(value as { name: string }),
      migrated: true,
    }));

    expect(migrated).toEqual({ name: 'old', migrated: true });
  });

  it('blocks sensitive persistence keys', () => {
    expect(() => toPersistenceKey('accessToken', 'bestbase')).toThrow(
      /Sensitive key/
    );
  });
});
