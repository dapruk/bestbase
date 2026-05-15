import { createGuard, type GuardConfig } from 'guardap';

export type AppGuardRole = string;
export type AppGuardFeature = string;
export type AppGuardAction = string;
export type AppGuardCondition = string;
export type AppGuardGroup = string;

export interface AppGuardContext {
  conditions?: Partial<Record<AppGuardCondition, boolean>>;
  isAuthenticated: boolean;
  roles: AppGuardRole[];
}

export type AppGuardConfig = Omit<
  GuardConfig<
    AppGuardRole,
    AppGuardFeature,
    AppGuardAction,
    AppGuardCondition,
    AppGuardGroup,
    unknown,
    AppGuardContext
  >,
  'getUserState'
>;

export function createAppGuard(config: AppGuardConfig) {
  return createGuard<
    AppGuardRole,
    AppGuardFeature,
    AppGuardAction,
    AppGuardCondition,
    AppGuardGroup,
    unknown,
    AppGuardContext
  >({
    ...config,
    getUserState: (context) => ({
      conditions: context?.conditions ?? {},
      isAuthenticated: context?.isAuthenticated ?? false,
      roles: context?.roles ?? [],
    }),
  });
}

export const appGuard = createAppGuard({
  getPermissions: () => ({}),
});
