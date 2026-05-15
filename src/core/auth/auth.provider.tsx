import { useEffect, useMemo } from 'react';

import { createAuthClient } from './auth.client';
import { AuthContext } from './auth.context';
import { createAuthStore } from './auth.store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authStore = useMemo(() => createAuthStore(createAuthClient()), []);

  useEffect(() => {
    void authStore.checkSession();
  }, [authStore]);

  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  );
}
