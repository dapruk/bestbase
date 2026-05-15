import { BehaviorSubject } from 'rxjs';

import type { RxStore, StoreUpdater } from './rx.types';

export function createStore<TState extends object>(
  initialState: TState
): RxStore<TState> {
  const subject = new BehaviorSubject<TState>(initialState);

  const getSnapshot = () => subject.getValue();

  const setState = (nextState: TState) => {
    subject.next(nextState);
  };

  const patchState = (updater: StoreUpdater<TState>) => {
    const currentState = getSnapshot();
    const patch =
      typeof updater === 'function' ? updater(currentState) : updater;

    subject.next({ ...currentState, ...patch });
  };

  const reset = () => {
    subject.next(initialState);
  };

  return {
    state$: subject.asObservable(),
    getSnapshot,
    setState,
    patchState,
    reset,
    subscribe: (listener) => subject.subscribe(listener),
  };
}
