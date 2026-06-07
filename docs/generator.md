# Generator

CLI lokal dipanggil dengan:

```bash
npm run bbase -- ...
```

Command yang tersedia saat ini:

```bash
npm run bbase -- gen feat product
npm run bbase -- gen feat product --list-view
npm run bbase -- gen component product-table --feature product
npm run bbase -- gen store product-list --feature product
npm run bbase -- gen page dashboard --dashboard-page
```

## Feature

```bash
npm run bbase -- gen feat product
```

Membuat skeleton:

```txt
src/features/product/
  components/
  containers/
  stores/
  hooks/
  services/
  schemas/
  types/
  utils/
  constants/
  pages/
  index.ts
```

Generator memakai kebab-case untuk file/folder dan PascalCase untuk nama
komponen.

## List View

```bash
npm run bbase -- gen feat product --list-view
```

Membuat scaffold dasar:

- types
- permission constants
- schemas
- service dengan schema fetcher
- list/detail/form containers
- list/detail/form pages
- mapper

Preset ini belum membuat:

- route registration otomatis
- nav registration
- full CRUD UI
- polished table columns
- modal action workflows

## Component

```bash
npm run bbase -- gen component product-table --feature product
```

Membuat komponen sederhana di feature target.

## Store

```bash
npm run bbase -- gen store product-list --feature product
```

Membuat RxJS store ringan berbasis `createStore()`.

## Dashboard Page

```bash
npm run bbase -- gen page dashboard --dashboard-page
```

Membuat halaman dashboard siap edit:

- KPI cards
- chart placeholder berbasis data array
- recent activity panel
- quick actions memakai `BaseButton`
- layout panel memakai `PaneLayout`

Template ini presentational. State client tetap di RxJS store/container,
server-state tetap di TanStack Query, dan IO tetap lewat service/fetcher.

## Opsi

Opsi yang sudah dikenali parser:

- `--dry-run`
- `--force`
- `--route`
- `--path`
- `--protected`
- `--public`
- `--permission`
- `--nav`
- `--store`
- `--service`
- `--schema`
- `--test`
- `--persist`
- `--list-view`
- `--dashboard-page`

Beberapa opsi route/nav masih scaffold-only pada fase ini.
