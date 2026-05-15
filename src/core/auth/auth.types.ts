export type AuthStatus =
  | 'idle'
  | 'checking'
  | 'authenticated'
  | 'guest'
  | 'refreshing'
  | 'expired'
  | 'error';

export interface AuthUser {
  conditions?: Record<string, boolean>;
  id: string;
  email?: string;
  name?: string;
  permissionMatrix?: Record<string, string | string[]>;
  permissions?: string[];
  roles?: string[];
}

export interface AuthSession {
  user: AuthUser;
  expiresAt?: string;
}

export interface AuthState {
  error: string | null;
  redirectTo: string | null;
  session: AuthSession | null;
  status: AuthStatus;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthClient {
  checkSession: () => Promise<AuthSession | null>;
  login: (input: LoginInput) => Promise<AuthSession>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthSession | null>;
}
