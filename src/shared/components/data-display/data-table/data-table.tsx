import type { DataTableProps, DataTableSortingState } from './data-table.types';
import { DataTableEmpty } from './data-table-empty';
import { DataTableError } from './data-table-error';
import { DataTablePagination } from './data-table-pagination';
import { DataTableRowActions } from './data-table-row-actions';
import { DataTableSkeleton } from './data-table-skeleton';
import { DataTableToolbar } from './data-table-toolbar';

export function DataTable<TRow>({
  columns,
  data,
  error,
  filters,
  getRowId,
  loading = false,
  onFilterChange,
  onPaginationChange,
  onRowClick,
  onSearchChange,
  onSortingChange,
  rowActions = [],
  state,
}: DataTableProps<TRow>) {
  const colSpan = columns.length + (rowActions.length > 0 ? 1 : 0);

  const toggleSorting = (columnId: string) => {
    const nextSorting: DataTableSortingState | null =
      state.sorting?.id === columnId && state.sorting.direction === 'asc'
        ? { id: columnId, direction: 'desc' }
        : state.sorting?.id === columnId
          ? null
          : { id: columnId, direction: 'asc' };

    onSortingChange?.(nextSorting);
  };

  return (
    <div>
      <DataTableToolbar
        filters={filters}
        onFilterChange={onFilterChange}
        onSearchChange={onSearchChange}
        search={state.search}
        values={state.filters}
      />
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col">
                {column.sortable ? (
                  <button
                    onClick={() => toggleSorting(column.id)}
                    type="button"
                  >
                    {column.header}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
            {rowActions.length > 0 ? <th scope="col">Aksi</th> : null}
          </tr>
        </thead>
        {loading ? (
          <DataTableSkeleton columns={colSpan} />
        ) : error ? (
          <DataTableError colSpan={colSpan} message={error} />
        ) : data.length === 0 ? (
          <DataTableEmpty colSpan={colSpan} />
        ) : (
          <tbody>
            {data.map((row, index) => (
              <tr
                key={getRowId(row, index)}
                onClick={() => onRowClick?.(row)}
                tabIndex={onRowClick ? 0 : undefined}
              >
                {columns.map((column) => (
                  <td key={column.id}>{column.cell?.(row) ?? ''}</td>
                ))}
                {rowActions.length > 0 ? (
                  <td>
                    <DataTableRowActions actions={rowActions} row={row} />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <DataTablePagination
        onChange={onPaginationChange}
        state={state.pagination}
      />
    </div>
  );
}
