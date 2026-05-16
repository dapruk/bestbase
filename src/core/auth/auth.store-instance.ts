import { createAuthClient } from './auth.client';
import { createAuthStore } from './auth.store';

export const authStore = createAuthStore(createAuthClient());
