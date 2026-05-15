import type { Observable, Subscription } from 'rxjs';

export type StoreUpdater<TState> =
  | Partial<TState>
  | ((state: Readonly<TState>) => TState | Partial<TState>);

export interface RxStore<TState extends object> {
  readonly state$: Observable<TState>;
  getSnapshot: () => TState;
  setState: (nextState: TState) => void;
  patchState: (updater: StoreUpdater<TState>) => void;
  reset: () => void;
  subscribe: (listener: (state: TState) => void) => Subscription;
}
