import { useEffect, useState } from 'react';

import { resolveAppConfig } from '@/core/config/resolve-app-config';
import { configureFetcher } from '@/core/http/fetcher';
import { initializePwaManager } from '@/core/pwa/pwa.manager';
import type { PwaManagerState } from '@/core/pwa/pwa.types';
import { PwaUpdatePrompt } from '@/core/pwa/PwaUpdatePrompt';
import { configureConsole } from '@/core/runtime/console.manager';
import {
  checkAppVersionOnce,
  watchAppVersion,
} from '@/core/version/app-version.manager';
import { LoadingState } from '@/shared/components/feedback/loading-state';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [ready, setReady] = useState(false);
  const [pwaState, setPwaState] = useState<PwaManagerState>({
    enabled: false,
    updateAvailable: false,
  });

  useEffect(() => {
    let mounted = true;
    let stopWatchingAppVersion: (() => void) | undefined;

    async function bootstrap() {
      const config = resolveAppConfig();

      configureConsole({
        isProductionRuntime:
          config.runtime.console.suppressInProduction &&
          config.app.environment === 'production',
      });

      configureFetcher({
        onForbidden: config.fetcher.onForbidden,
        onUnauthorized: config.fetcher.onUnauthorized,
      });

      await checkAppVersionOnce(config);
      const nextPwaState = initializePwaManager();
      stopWatchingAppVersion = watchAppVersion(config).stop;

      if (mounted) {
        setPwaState(nextPwaState);
        setReady(true);
      }
    }

    void bootstrap();

    return () => {
      mounted = false;
      stopWatchingAppVersion?.();
    };
  }, []);

  if (!ready) {
    return <LoadingState title="Menyiapkan aplikasi" />;
  }

  return (
    <>
      {children}
      <PwaUpdatePrompt state={pwaState} />
    </>
  );
}
