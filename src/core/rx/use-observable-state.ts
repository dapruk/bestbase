import { useSyncExternalStore } from 'react';

import type { RxStore } from './rx.types';

export function useObservableState<TState extends object>(
  store: RxStore<TState>
): TState {
  return useSyncExternalStore(
    (onStoreChange) => {
      const subscription = store.subscribe(() => onStoreChange());
      return () => subscription.unsubscribe();
    },
    store.getSnapshot,
    store.getSnapshot
  );
}
