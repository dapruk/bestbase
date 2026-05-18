# UI

UI fase ini masih minimal. Bestbase belum memasang Tailwind, shadcn/ui, atau
design system kompleks.

Komponen shared yang tersedia:

- `src/shared/components/feedback/empty-state.tsx`
- `src/shared/components/feedback/error-state.tsx`
- `src/shared/components/feedback/loading-state.tsx`
- `src/shared/components/feedback/confirm-dialog.tsx`
- `src/shared/components/data-display/data-table/*`

Prinsip:

- komponen shared harus bebas domain
- jangan letakkan API call di presentational component
- jangan letakkan auth/permission logic di DataTable
- feature container/store mengatur behavior

Design system lengkap bisa ditambahkan pada fase berikutnya.
