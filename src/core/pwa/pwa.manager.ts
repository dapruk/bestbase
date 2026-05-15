import { resolveAppConfig } from '@/core/config/resolve-app-config';

import type { PwaManagerOptions, PwaManagerState } from './pwa.types';

export function initializePwaManager(
  options: PwaManagerOptions = resolveAppConfig().pwa
): PwaManagerState {
  if (!options.enabled || options.updateMode === 'disabled') {
    return { enabled: options.enabled, updateAvailable: false };
  }

  if ('serviceWorker' in navigator) {
    void navigator.serviceWorker.getRegistration().then((registration) => {
      void registration?.update();
    });
  }

  return { enabled: true, updateAvailable: false };
}
