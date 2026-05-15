import { createContext } from 'react';

import type { AuthStore } from './auth.store';

export const AuthContext = createContext<AuthStore | null>(null);
