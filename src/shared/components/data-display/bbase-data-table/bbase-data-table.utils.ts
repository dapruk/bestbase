import { resolveAppConfig } from '@/core/config/resolve-app-config';

import type {
  BbaseDataTablePaginationState,
  BbaseDataTableSortingState,
  BbaseDataTableState,
} from './bbase-data-table.types';

export function toApiPaginationParams(
  pagination: BbaseDataTablePaginationState
) {
  return {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  };
}

export function toApiSortingParams(sorting: BbaseDataTableSortingState) {
  const firstSort = sorting[0];

  if (!firstSort) {
    return {};
  }

  return {
    sort: firstSort.id,
    order: firstSort.desc ? 'desc' : 'asc',
  };
}

export function createInitialTableState(
  overrides: Partial<BbaseDataTableState> = {}
): BbaseDataTableState {
  const config = resolveAppConfig();

  return {
    pagination: {
      pageIndex: 0,
      pageSize: config.dataTable.defaultPageSize,
      ...overrides.pagination,
    },
    search: overrides.search ?? '',
    sorting: overrides.sorting ?? [],
  };
}

export function resetTablePage<TState extends BbaseDataTableState>(
  state: TState
): TState {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      pageIndex: 0,
    },
  };
}
