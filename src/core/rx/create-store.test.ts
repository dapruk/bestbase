import { describe, expect, it } from 'vitest';

import { createStore } from './create-store';
import { collectStoreStates } from './rx.test-utils';

describe('createStore', () => {
  it('patches, snapshots, subscribes, and resets state', () => {
    const store = createStore({ count: 0, label: 'idle' });
    const collector = collectStoreStates(store);

    store.patchState({ count: 1 });
    store.patchState((state) => ({ label: `${state.count}:ready` }));

    expect(store.getSnapshot()).toEqual({ count: 1, label: '1:ready' });
    expect(collector.states).toEqual([
      { count: 0, label: 'idle' },
      { count: 1, label: 'idle' },
      { count: 1, label: '1:ready' },
    ]);

    store.reset();

    expect(store.getSnapshot()).toEqual({ count: 0, label: 'idle' });
    collector.stop();
  });
});
