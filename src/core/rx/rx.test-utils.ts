import type { RxStore } from './rx.types';

export function collectStoreStates<TState extends object>(
  store: RxStore<TState>
): {
  states: TState[];
  stop: () => void;
} {
  const states: TState[] = [];
  const subscription = store.subscribe((state) => states.push(state));

  return {
    states,
    stop: () => subscription.unsubscribe(),
  };
}
