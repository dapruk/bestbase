import type { ComponentProps } from 'react';

import type { Button } from '@/shared/components/ui/button';

type ShadcnButtonVariant = NonNullable<
  ComponentProps<typeof Button>['variant']
>;

export type BaseButtonVariant =
  | ShadcnButtonVariant
  | 'soft'
  | 'danger-soft'
  | 'brand';

export interface ResolvedBaseButtonVariant {
  className?: string;
  variant: ShadcnButtonVariant;
}

export function resolveBaseButtonVariant(
  variant: BaseButtonVariant = 'default'
): ResolvedBaseButtonVariant {
  if (variant === 'soft') {
    return {
      variant: 'secondary',
      className: 'bg-muted text-foreground hover:bg-muted/80',
    };
  }

  if (variant === 'danger-soft') {
    return {
      variant: 'destructive',
      className: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
    };
  }

  if (variant === 'brand') {
    return {
      variant: 'default',
      className: 'bg-primary text-primary-foreground hover:bg-primary/90',
    };
  }

  return { variant };
}
