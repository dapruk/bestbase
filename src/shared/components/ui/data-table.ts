import type { Column, ColumnSort, Row, RowData } from '@tanstack/react-table';

import type { FilterItemSchema } from '@/shared/components/ui/parsers';

export { DataTable } from './data-table-root';

export const dataTableConfig = {
  filterVariants: [
    'text',
    'number',
    'range',
    'date',
    'dateRange',
    'select',
    'multiSelect',
  ],
  joinOperators: ['and', 'or'],
  operators: [
    'iLike',
    'notILike',
    'eq',
    'ne',
    'inArray',
    'notInArray',
    'isEmpty',
    'isNotEmpty',
    'lt',
    'lte',
    'gt',
    'gte',
    'isBetween',
    'isRelativeToToday',
  ],
} as const;

export type DataTableConfig = typeof dataTableConfig;

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: TData is used in the TableMeta interface
  interface TableMeta<TData extends RowData> {
    queryKeys?: QueryKeys;
  }

  // biome-ignore lint/correctness/noUnusedVariables: TData and TValue are used in the ColumnMeta interface
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}

export interface QueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
}

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FilterOperator = DataTableConfig['operators'][number];
export type FilterVariant = DataTableConfig['filterVariants'][number];
export type JoinOperator = DataTableConfig['joinOperators'][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: 'update' | 'delete';
}

export function getColumnPinningStyle<TData>({
  column,
}: {
  column: Column<TData>;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px hsl(var(--border)) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px hsl(var(--border)) inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}
