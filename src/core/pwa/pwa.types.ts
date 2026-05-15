export interface PwaManagerOptions {
  enabled: boolean;
  offlineFallback: boolean;
  updateMode: 'disabled' | 'prompt' | 'auto';
}

export interface PwaManagerState {
  enabled: boolean;
  updateAvailable: boolean;
}
