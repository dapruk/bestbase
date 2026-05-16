# UI

Tailwind CSS dan shadcn/ui sudah termasuk dari awal untuk konsistensi base UI.
Setup memakai npm, Vite, CSS variables, base color `neutral`, dan shadcn preset
`radix-nova`.

Komponen shadcn hidup di:

```txt
src/shared/components/ui
```

Gunakan `cn()` dari:

```ts
import { cn } from '@/shared/utils/cn';
```

Radix primitives diinstal melalui komponen shadcn yang membutuhkannya. Prefer
komponen shadcn/ui untuk button, input, dialog, dropdown, table, badge, card,
skeleton, separator, tooltip, dan sonner agar UI dasar tetap konsisten.

Tambah komponen baru dengan CLI npm-compatible:

```bash
npx shadcn@latest add <component> --path src/shared/components/ui --yes
```

Jika CLI menulis path literal `@/...` di environment lokal, pindahkan file ke
`src/shared/components/ui` dan pastikan import mengarah ke alias `@/shared/...`.
