import { DataTable as DiceDataTable } from '@/shared/components/ui/data-table';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

import { BbaseDataTableEmpty } from './bbase-data-table.empty';
import { BbaseDataTableError } from './bbase-data-table.error';
import { BbaseDataTableSkeleton } from './bbase-data-table.skeleton';
import type { BbaseDataTableProps } from './bbase-data-table.types';
import { useBbaseDataTable } from './use-bbase-data-table';

export function BbaseDataTable<TRow, TValue = unknown>(
  props: BbaseDataTableProps<TRow, TValue>
) {
  const {
    columns,
    data,
    emptyMessage,
    error,
    filters,
    loading = false,
    search,
  } = props;
  const table = useBbaseDataTable(props);

  if (loading) {
    return <BbaseDataTableSkeleton columns={columns.length} />;
  }

  if (error) {
    return <BbaseDataTableError error={error} />;
  }

  return (
    <div className="space-y-3">
      {search || filters?.length ? (
        <div className="flex flex-wrap items-center gap-2">
          {search ? (
            <Input
              className="max-w-sm"
              placeholder={search.placeholder ?? 'Search...'}
              value={search.value}
              onChange={(event) => search.onChange(event.target.value)}
            />
          ) : null}
          {filters?.map((filter) => (
            <BbaseDataTableFilterInput filter={filter} key={filter.id} />
          ))}
        </div>
      ) : null}
      <DiceDataTable table={table} />
      {data.length === 0 ? (
        <BbaseDataTableEmpty message={emptyMessage} />
      ) : null}
    </div>
  );
}

function BbaseDataTableFilterInput({
  filter,
}: {
  filter: NonNullable<BbaseDataTableProps<unknown>['filters']>[number];
}) {
  if (filter.type === 'select' || filter.type === 'boolean') {
    return (
      <Select
        value={String(filter.value ?? '')}
        onValueChange={(value) => filter.onChange?.(value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={filter.placeholder ?? filter.label} />
        </SelectTrigger>
        <SelectContent>
          {(filter.options ?? []).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      className="w-40"
      placeholder={filter.placeholder ?? filter.label}
      type={filter.type === 'number' ? 'number' : 'text'}
      value={String(filter.value ?? '')}
      onChange={(event) => filter.onChange?.(event.target.value)}
    />
  );
}
