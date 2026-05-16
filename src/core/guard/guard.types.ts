import type { GuardapRouteMeta } from 'guardap';

export type AppRole = 'superadmin' | 'admin' | 'staff' | 'viewer';

export type AppFeature = 'dashboard' | 'products' | 'settings';

export type AppAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'archive'
  | 'approve';

export type AppCondition = 'active' | 'verified';

export type AppGroup = 'management' | 'staff';

export type AppRoutePath =
  | '/'
  | '/login'
  | '/dashboard'
  | '/product'
  | '/product/create'
  | '/forbidden'
  | '/not-found';

export type AppGuardMeta = GuardapRouteMeta<
  AppRole,
  AppFeature,
  AppAction,
  AppCondition,
  AppGroup,
  AppRoutePath
> & {
  public?: boolean | undefined;
};
