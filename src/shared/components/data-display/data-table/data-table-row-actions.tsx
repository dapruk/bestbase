import type { DataTableRowAction } from './data-table.types';

interface DataTableRowActionsProps<TRow> {
  actions: DataTableRowAction<TRow>[];
  row: TRow;
}

export function DataTableRowActions<TRow>({
  actions,
  row,
}: DataTableRowActionsProps<TRow>) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div>
      {actions.map((action) => (
        <button
          disabled={action.disabled?.(row)}
          key={action.label}
          onClick={() => action.onClick(row)}
          type="button"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
