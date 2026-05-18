# DataTable

DataTable saat ini tersedia di:

```ts
import { DataTable } from '@/shared/components/data-display/data-table';
```

Komponen ini controlled dan presentational. Ia tidak melakukan API call, tidak
menghitung permission, tidak membaca auth state, dan tidak menyimpan business
logic.

## Tanggung Jawab DataTable

- render search input
- render filter select
- render sorting trigger
- render pagination controls
- render loading skeleton
- render empty/error state
- render row actions
- emit callback perubahan state

## Tanggung Jawab Feature

Feature store/container bertanggung jawab untuk:

- menyimpan search/filter/sort/pagination
- memanggil API melalui service/fetcher
- mengatur TanStack Query
- memetakan params API
- menghitung permission row action bila dibutuhkan
- mengirim data dan state ke DataTable

## Types

Types utama:

- `DataTablePaginationState`
- `DataTableSortingState`
- `DataTableFilterState`
- `DataTableState`
- `DataTableColumn`
- `DataTableRowAction`
- `DataTableFilterConfig`

## List View

`npm run bbase -- gen feat product --list-view` membuat scaffold dasar
list/detail/form, tetapi belum membuat UI CRUD polished. Route/nav integration
masih fase berikutnya.
