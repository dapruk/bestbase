import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { createElement } from 'react';

import { resolveAppConfig } from '@/core/config/resolve-app-config';
import { Button } from '@/shared/components/ui/button';

import { BbaseDataTableActions } from './bbase-data-table.actions';
import type { BbaseDataTableProps } from './bbase-data-table.types';

export function useBbaseDataTable<TRow, TValue = unknown>({
  columns,
  data,
  getRowId,
  mode,
  onPaginationChange,
  onSortingChange,
  pageCount,
  pagination,
  rowActions = [],
  sorting,
}: BbaseDataTableProps<TRow, TValue>) {
  const tableMode = mode ?? resolveAppConfig().dataTable.mode;
  const tableColumns: ColumnDef<TRow, TValue | unknown>[] =
    rowActions.length > 0
      ? [
          ...columns,
          {
            id: 'actions',
            enableHiding: false,
            enableSorting: false,
            header: '',
            cell: ({ row }) =>
              BbaseDataTableActions<TRow>({
                actions: rowActions,
                row: row.original,
                children: createElement(
                  Button,
                  {
                    'aria-label': 'Open row actions',
                    size: 'icon',
                    variant: 'ghost',
                  },
                  createElement(MoreHorizontal)
                ),
              }),
          },
        ]
      : columns;

  // TanStack Table intentionally returns non-memoizable table APIs.
  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable({
    columns: tableColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    ...(tableMode === 'client'
      ? {
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
        }
      : {}),
    ...(getRowId ? { getRowId } : {}),
    manualFiltering: tableMode === 'server',
    manualPagination: tableMode === 'server',
    manualSorting: tableMode === 'server',
    ...(onPaginationChange ? { onPaginationChange } : {}),
    ...(onSortingChange ? { onSortingChange } : {}),
    ...(pageCount === undefined ? {} : { pageCount }),
    state: {
      pagination,
      sorting,
    },
  });
}
