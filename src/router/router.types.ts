import type { AppGuardMeta } from '@/core/guard/guard.types';

export interface AppRouteMeta extends AppGuardMeta {
  title?: string;
}
