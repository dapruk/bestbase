import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

export type BbaseDataTableMode = 'server' | 'client';

export type BbaseDataTableFilterType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'date'
  | 'dateRange'
  | 'boolean';

export interface BbaseDataTableFilterOption {
  label: string;
  value: string;
}

export interface BbaseDataTableFilterConfig<TValue = unknown> {
  id: string;
  label: string;
  onChange?: ((value: TValue) => void) | undefined;
  options?: BbaseDataTableFilterOption[] | undefined;
  placeholder?: string | undefined;
  type: BbaseDataTableFilterType;
  value?: TValue | undefined;
}

export interface BbaseDataTableSearchConfig {
  onChange: (value: string) => void;
  placeholder?: string | undefined;
  value: string;
}

export type BbaseDataTablePaginationState = PaginationState;
export type BbaseDataTableSortingState = SortingState;

export interface BbaseDataTableRowAction<TRow> {
  disabled?: ((row: TRow) => boolean) | undefined;
  hidden?: ((row: TRow) => boolean) | undefined;
  label: string;
  onClick: (row: TRow) => void;
  variant?: 'default' | 'destructive' | undefined;
}

export interface BbaseDataTableState {
  pagination: BbaseDataTablePaginationState;
  search?: string | undefined;
  sorting: BbaseDataTableSortingState;
}

export interface BbaseDataTableProps<TRow, TValue = unknown> {
  columns: ColumnDef<TRow, TValue>[];
  data: TRow[];
  emptyMessage?: string | undefined;
  error?: unknown;
  filters?: BbaseDataTableFilterConfig[] | undefined;
  getRowId?: ((row: TRow, index: number) => string) | undefined;
  loading?: boolean | undefined;
  mode?: BbaseDataTableMode | undefined;
  onPaginationChange?: OnChangeFn<BbaseDataTablePaginationState> | undefined;
  onRowClick?: ((row: TRow) => void) | undefined;
  onSortingChange?: OnChangeFn<BbaseDataTableSortingState> | undefined;
  pageCount?: number | undefined;
  pagination: BbaseDataTablePaginationState;
  rowActions?: BbaseDataTableRowAction<TRow>[] | undefined;
  search?: BbaseDataTableSearchConfig | undefined;
  sorting: BbaseDataTableSortingState;
}
