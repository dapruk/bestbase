import { resolveAppConfig } from '@/core/config/resolve-app-config';

export interface MobileBreakpointConfig {
  mobile?: number | undefined;
}

export function getMobileBreakpoint(config?: MobileBreakpointConfig) {
  return config?.mobile ?? resolveAppConfig().ui.breakpoints.mobile ?? 768;
}

export function isMobileViewport(
  width: number,
  breakpoint = getMobileBreakpoint()
) {
  return width < breakpoint;
}
