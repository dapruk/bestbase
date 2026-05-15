import type { GuardapRouteMeta } from 'guardap';

import type {
  AppGuardAction,
  AppGuardCondition,
  AppGuardFeature,
  AppGuardGroup,
  AppGuardRole,
} from './guard.config';

export interface AppGuardRouteMeta extends GuardapRouteMeta<
  AppGuardRole,
  AppGuardFeature,
  AppGuardAction,
  AppGuardCondition,
  AppGuardGroup,
  string
> {
  public?: boolean | undefined;
}
