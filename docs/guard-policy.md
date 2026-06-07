# Guard Policy

Bestbase memakai guardap latest sebagai authorization engine. Lockfile saat ini
resolve ke `1.3.0`, dan dependency sengaja memakai `latest` karena guardap juga
paket internal yang harus selalu didukung pada versi terbaru.

Folder `src/core/guard` hanya berisi integrasi tipis:

- `guard.config.ts`: membuat instance guardap melalui `createGuard()`.
- route guard adapter memakai evaluator/router driver guardap, sesuai router
  aktif.
- `guard.types.ts`: tipe route metadata yang mengikuti `GuardapRouteMeta`.
- `guard.integration.test.ts`: test integrasi terhadap evaluator guardap.

Bestbase tidak membuat:

- custom authorization engine
- `Can` wrapper lokal
- `useCan` wrapper lokal
- context guard buatan sendiri
- permission-string parser
- fallback permission check

## Metadata Route

Route guard memakai metadata guardap:

```tsx
<GuardedRoute meta={{ login: true, feature: 'dashboard', action: 'read' }}>
  <DashboardPage />
</GuardedRoute>
```

Metadata yang didukung mengikuti guardap:

- `login`
- `guest`
- `role`
- `group`
- `condition`
- `feature`
- `action`
- `redirectTo`

## Policy

Policy permission tidak didefinisikan berat di basecode. Project downstream dapat
mengganti konfigurasi `createAppGuard()` dengan `getPermissions`, `groups`,
`resolveAction`, dan config guardap lain sesuai kebutuhan.

Dokumentasi resmi: https://www.npmjs.com/package/guardap
