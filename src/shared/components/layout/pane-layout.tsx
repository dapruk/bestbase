import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { cn } from '@/shared/utils/cn';

type PaneLayoutStackAt = 'never' | 'sm' | 'md' | 'lg' | 'xl';

interface PaneLayoutProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  gap?: number | string;
  stackAt?: PaneLayoutStackAt;
}

interface PaneProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  size?: number | string;
}

const stackClassByBreakpoint: Record<PaneLayoutStackAt, string> = {
  never: 'flex-row',
  sm: 'flex-col sm:flex-row',
  md: 'flex-col md:flex-row',
  lg: 'flex-col lg:flex-row',
  xl: 'flex-col xl:flex-row',
};

function toCssSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value;
}

function toPaneWidth(value: number | string) {
  if (typeof value === 'number') return `${value}%`;
  if (value.endsWith('%')) return value;
  return undefined;
}

function RootLayout({
  children,
  className,
  gap = 16,
  stackAt = 'md',
  style,
  ...props
}: PaneLayoutProps) {
  return (
    <div
      className={cn(
        'flex w-full items-stretch',
        stackClassByBreakpoint[stackAt],
        className
      )}
      style={{ ...style, gap: toCssSize(gap) }}
      {...props}
    >
      {children}
    </div>
  );
}

function Pane({ children, className, size, style, ...props }: PaneProps) {
  const paneWidth = size === undefined ? undefined : toPaneWidth(size);
  const sizeClass =
    size !== undefined && paneWidth === undefined ? String(size) : 'flex-1';
  const paneStyle: CSSProperties =
    paneWidth === undefined
      ? (style ?? {})
      : { ...style, flexBasis: paneWidth };

  return (
    <div
      className={cn('flex min-w-0 overflow-hidden p-1', sizeClass, className)}
      style={paneStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export const PaneLayout = Object.assign(RootLayout, {
  Pane,
});
