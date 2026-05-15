import type { PwaManagerState } from './pwa.types';

interface PwaUpdatePromptProps {
  state: PwaManagerState;
}

export function PwaUpdatePrompt({ state }: PwaUpdatePromptProps) {
  if (!state.enabled || !state.updateAvailable) {
    return null;
  }

  return (
    <div role="status">
      Versi baru tersedia. Muat ulang aplikasi untuk menggunakan pembaruan.
    </div>
  );
}
