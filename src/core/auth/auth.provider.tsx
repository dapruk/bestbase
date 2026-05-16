import { useEffect } from 'react';

import { AuthContext } from './auth.context';
import { authStore } from './auth.store-instance';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    void authStore.checkSession();
  }, []);

  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  );
}
