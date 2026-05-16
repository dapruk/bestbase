# Data Table

`BbaseDataTable` adalah wrapper office-friendly di atas DiceUI Data Table.
Dokumentasi DiceUI: https://www.diceui.com/docs/components/radix/data-table

Raw DiceUI/TanStack setup tetap tersedia untuk kebutuhan advanced, tetapi default
fitur list sebaiknya memakai:

```tsx
import { BbaseDataTable } from '@/shared/components/data-display/bbase-data-table';
```

`BbaseDataTable` menyederhanakan wiring yang biasanya berulang: search, filter,
sorting, pagination, row actions, loading, empty, dan error state. Komponen ini
tidak memanggil API, tidak membaca permission, dan tidak menyimpan business
logic.

Pattern server-side list view:

- state search/filter/sort/pagination hidup di feature store
- query dan mapping params hidup di container
- column definition hidup di feature component folder
- row actions difilter oleh container sesuai kebutuhan fitur
- API params memakai `page = pageIndex + 1` dan `limit = pageSize`
- sorting pertama dimap ke `sort` dan `order`

Helper yang tersedia:

```ts
toApiPaginationParams(state.pagination);
toApiSortingParams(state.sorting);
createInitialTableState();
resetTablePage(state);
```

Generator `bbase --list-view` membuat scaffold yang memakai
`BbaseDataTable`, menyimpan table state di `*-list.store.ts`, dan menambahkan
headless test untuk behavior state dasar.
