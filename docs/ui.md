# UI

UI fase ini sudah memakai Tailwind dan shadcn/ui. Komponen shadcn berada di
`src/shared/components/ui`, dan helper class name memakai `cn()` dari
`src/shared/utils/cn.ts`.

Komponen shared yang tersedia:

- `src/shared/components/feedback/empty-state.tsx`
- `src/shared/components/feedback/error-state.tsx`
- `src/shared/components/feedback/loading-state.tsx`
- `src/shared/components/feedback/confirm-dialog.tsx`
- `src/shared/components/data-display/bbase-data-table/*`
- `src/shared/components/layout/pane-layout.tsx`
- `src/shared/components/ui/*`

Prinsip:

- komponen shared harus bebas domain
- jangan letakkan API call di presentational component
- jangan letakkan auth/permission logic di BbaseDataTable
- feature container/store mengatur behavior
- ikuti prinsip state basebranch: component presentational, container mengatur
  flow, RxJS store untuk client state, TanStack Query untuk server state
- gunakan `PaneLayout` untuk template dashboard atau halaman yang butuh komposisi
  panel responsif

Tambah komponen shadcn baru dengan pola official Vite setup, lalu simpan hasil
ke `src/shared/components/ui`.
