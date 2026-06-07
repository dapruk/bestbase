import { Loader2 } from 'lucide-react';
import { forwardRef, type ComponentProps, type ReactNode } from 'react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

import {
  type BaseButtonVariant,
  resolveBaseButtonVariant,
} from './base-button-variants';

export interface BaseButtonProps extends Omit<
  ComponentProps<typeof Button>,
  'asChild' | 'variant'
> {
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  rightIcon?: ReactNode;
  variant?: BaseButtonVariant;
}

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    {
      children,
      className,
      disabled,
      fullWidth = false,
      leftIcon,
      loading = false,
      loadingText,
      rightIcon,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const loadingPosition = rightIcon ? 'right' : 'left';
    const showLeftIcon = leftIcon && (!loading || loadingPosition === 'right');
    const showRightIcon = rightIcon && (!loading || loadingPosition === 'left');
    const resolvedVariant = resolveBaseButtonVariant(variant);

    return (
      <Button
        ref={ref}
        aria-busy={loading || undefined}
        className={cn(
          resolvedVariant.className,
          'relative cursor-pointer',
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        variant={resolvedVariant.variant}
        {...props}
      >
        {showLeftIcon || (loading && loadingPosition === 'left') ? (
          <span
            aria-hidden
            className="inline-flex items-center justify-center [&>*]:shrink-0"
            data-icon="inline-start"
          >
            {loading && loadingPosition === 'left' ? (
              <Loader2 className="animate-spin" />
            ) : (
              leftIcon
            )}
          </span>
        ) : null}

        <span className="inline-flex items-center justify-center">
          {loading && loadingText ? loadingText : children}
        </span>

        {showRightIcon || (loading && loadingPosition === 'right') ? (
          <span
            aria-hidden
            className="inline-flex items-center justify-center [&>*]:shrink-0"
            data-icon="inline-end"
          >
            {loading && loadingPosition === 'right' ? (
              <Loader2 className="animate-spin" />
            ) : (
              rightIcon
            )}
          </span>
        ) : null}
      </Button>
    );
  }
);

BaseButton.displayName = 'BaseButton';
