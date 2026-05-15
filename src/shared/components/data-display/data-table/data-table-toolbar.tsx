import type {
  DataTableFilterConfig,
  DataTableFilterState,
} from './data-table.types';

interface DataTableToolbarProps {
  filters?: DataTableFilterConfig[] | undefined;
  onFilterChange?: ((filters: DataTableFilterState[]) => void) | undefined;
  onSearchChange?: ((search: string) => void) | undefined;
  search: string;
  values: DataTableFilterState[];
}

export function DataTableToolbar({
  filters = [],
  onFilterChange,
  onSearchChange,
  search,
  values,
}: DataTableToolbarProps) {
  return (
    <div>
      <input
        aria-label="Cari"
        onChange={(event) => onSearchChange?.(event.target.value)}
        placeholder="Cari"
        type="search"
        value={search}
      />
      {filters.map((filter) => {
        const currentValue =
          values.find((value) => value.id === filter.id)?.value ?? '';

        return (
          <label key={filter.id}>
            {filter.label}
            <select
              onChange={(event) => {
                const nextValues = values.filter(
                  (value) => value.id !== filter.id
                );

                if (event.target.value) {
                  nextValues.push({
                    id: filter.id,
                    value: event.target.value,
                  });
                }

                onFilterChange?.(nextValues);
              }}
              value={currentValue}
            >
              <option value="">Semua</option>
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        );
      })}
    </div>
  );
}
