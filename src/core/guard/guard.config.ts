import type { PermissionMatrix } from 'guardap';
import { createGuard } from 'guardap/react';

import { authStore } from '@/core/auth/auth.store-instance';

import type {
  AppAction,
  AppCondition,
  AppFeature,
  AppGroup,
  AppRole,
  AppRoutePath,
} from './guard.types';

const appRoles = ['superadmin', 'admin', 'staff', 'viewer'] as const;

function isAppRole(role: string): role is AppRole {
  return (appRoles as readonly string[]).includes(role);
}

export function resolveAppPermissions(
  roles: readonly AppRole[]
): PermissionMatrix<AppFeature> {
  if (roles.includes('superadmin')) {
    return { '*': '*' };
  }

  const permissions: PermissionMatrix<AppFeature> = {};

  for (const role of roles) {
    if (role === 'admin') {
      permissions.dashboard = mergePermission(permissions.dashboard, 'r');
      permissions.products = mergePermission(permissions.products, 'crudaa');
      permissions.settings = mergePermission(permissions.settings, 'ru');
    }

    if (role === 'staff') {
      permissions.dashboard = mergePermission(permissions.dashboard, 'r');
      permissions.products = mergePermission(permissions.products, 'cru');
    }

    if (role === 'viewer') {
      permissions.dashboard = mergePermission(permissions.dashboard, 'r');
      permissions.products = mergePermission(permissions.products, 'r');
    }
  }

  return permissions;
}

function mergePermission(
  current: string | string[] | undefined,
  next: string
): string {
  return Array.from(new Set(`${permissionToString(current)}${next}`)).join('');
}

function permissionToString(permission: string | string[] | undefined) {
  return Array.isArray(permission) ? permission.join('') : (permission ?? '');
}

export const Guard = createGuard<
  AppRole,
  AppFeature,
  AppAction,
  AppCondition,
  AppGroup,
  unknown,
  AppRoutePath
>({
  getUserState: () => {
    const auth = authStore.getSnapshot();

    if (auth.status !== 'authenticated' || !auth.session) {
      return {
        roles: [],
        conditions: {},
        isAuthenticated: false,
      };
    }

    const user = auth.session.user;
    const roles = (user.roles ?? []).filter(isAppRole);

    return {
      ...user,
      roles,
      conditions: {
        active: true,
        verified: Boolean(user.conditions?.verified),
        ...user.conditions,
      },
      isAuthenticated: true,
    };
  },
  getPermissions: (roles) => resolveAppPermissions(roles),
  groups: {
    management: ['superadmin', 'admin'],
    staff: ['staff'],
  },
  defaultRedirect: '/login',
});

export const { GuardProvider, useGuard, AccessGuard, withAuth } = Guard;
