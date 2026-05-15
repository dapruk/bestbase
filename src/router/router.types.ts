import type { AppGuardRouteMeta } from '@/core/guard/guard.types';

export interface AppRouteMeta extends AppGuardRouteMeta {
  title?: string;
}
