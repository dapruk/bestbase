# Guard Policy

Bestbase memakai guardap `1.2.0` sebagai authorization engine.

Folder `src/core/guard` hanya berisi integrasi tipis:

- `guard.config.ts`: membuat instance guardap melalui `createGuard()`.
- `RouteGuard.tsx`: adapter route TanStack yang memakai
  `evaluateTanStackGuard` dari `guardap/drivers/tanstack`.
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
