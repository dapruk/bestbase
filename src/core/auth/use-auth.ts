import { useContext } from 'react';

import { useObservableState } from '@/core/rx/use-observable-state';

import { AuthContext } from './auth.context';

export function useAuth() {
  const authStore = useContext(AuthContext);

  if (!authStore) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return {
    ...useObservableState(authStore),
    checkSession: authStore.checkSession,
    login: authStore.login,
    logout: authStore.logout,
    refreshSession: authStore.refreshSession,
    setRedirectIntent: authStore.setRedirectIntent,
  };
}
