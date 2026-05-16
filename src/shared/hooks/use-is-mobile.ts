import { useCallback, useEffect, useState } from 'react';

import { resolveAppConfig } from '@/core/config/resolve-app-config';
import { getMobileBreakpoint, isMobileViewport } from '@/shared/utils/device';

export interface UseIsMobileOptions {
  breakpoint?: number | undefined;
}

export function useIsMobile(options: UseIsMobileOptions = {}) {
  const rendering = resolveAppConfig().router.rendering;
  const breakpoint = options.breakpoint ?? getMobileBreakpoint();
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return isMobileViewport(window.innerWidth, breakpoint);
  }, [breakpoint]);
  const [isMobile, setIsMobile] = useState(() =>
    rendering === 'server' ? false : getSnapshot()
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const query = `(max-width: ${breakpoint - 1}px)`;
    const media = window.matchMedia?.(query);
    const update = () => setIsMobile(getSnapshot());

    update();

    if (media) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint, getSnapshot]);

  return isMobile;
}
