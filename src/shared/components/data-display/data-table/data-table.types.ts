export interface DataTablePaginationState {
  pageIndex: number;
  pageSize: number;
  totalItems?: number;
}

export interface DataTableSortingState {
  direction: 'asc' | 'desc';
  id: string;
}

export interface DataTableFilterState {
  id: string;
  value: string;
}

export interface DataTableState {
  filters: DataTableFilterState[];
  pagination: DataTablePaginationState;
  search: string;
  sorting: DataTableSortingState | null;
}

export interface DataTableColumn<TRow> {
  cell?: (row: TRow) => React.ReactNode;
  header: React.ReactNode;
  id: string;
  sortable?: boolean;
}

export interface DataTableRowAction<TRow> {
  disabled?: (row: TRow) => boolean;
  label: string;
  onClick: (row: TRow) => void;
}

export interface DataTableFilterConfig {
  id: string;
  label: string;
  options?: Array<{ label: string; value: string }>;
}

export interface DataTableProps<TRow> {
  columns: DataTableColumn<TRow>[];
  data: TRow[];
  error?: string | null;
  filters?: DataTableFilterConfig[];
  getRowId: (row: TRow, index: number) => string;
  loading?: boolean;
  onFilterChange?: (filters: DataTableFilterState[]) => void;
  onPaginationChange?: (pagination: DataTablePaginationState) => void;
  onRowClick?: (row: TRow) => void;
  onSearchChange?: (search: string) => void;
  onSortingChange?: (sorting: DataTableSortingState | null) => void;
  rowActions?: DataTableRowAction<TRow>[];
  state: DataTableState;
}
