import type { DataTablePaginationState } from './data-table.types';

interface DataTablePaginationProps {
  onChange?: ((pagination: DataTablePaginationState) => void) | undefined;
  state: DataTablePaginationState;
}

export function DataTablePagination({
  onChange,
  state,
}: DataTablePaginationProps) {
  const totalPages = state.totalItems
    ? Math.max(1, Math.ceil(state.totalItems / state.pageSize))
    : undefined;

  return (
    <div>
      <button
        disabled={state.pageIndex <= 0}
        onClick={() => onChange?.({ ...state, pageIndex: state.pageIndex - 1 })}
        type="button"
      >
        Sebelumnya
      </button>
      <span>
        Halaman {state.pageIndex + 1}
        {totalPages ? ` dari ${totalPages}` : ''}
      </span>
      <button
        disabled={totalPages ? state.pageIndex + 1 >= totalPages : false}
        onClick={() => onChange?.({ ...state, pageIndex: state.pageIndex + 1 })}
        type="button"
      >
        Berikutnya
      </button>
    </div>
  );
}
