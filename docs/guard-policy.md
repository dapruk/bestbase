# Guard Policy

Bestbase memakai guardap `1.2.0` sebagai authorization engine. Layer
`core/guard` hanya membuat satu instance Guardap di
`src/core/guard/guard.config.ts` dan adapter route tipis.

Model Guardap yang dipakai:

- `createGuard(config)`
- `role`
- `group`
- `condition`
- `feature`
- `action`
- `login` / `guest`
- `redirect`

Gunakan helper React dari instance yang sama:

```tsx
import { AccessGuard } from '@/core/guard/guard.config';

<AccessGuard login feature="products" action="create">
  <CreateProductButton />
</AccessGuard>;
```

Direct checks memakai fluent API Guardap:

```ts
import { Guard } from '@/core/guard/guard.config';

Guard.requireLogin().allowed();
Guard.requireRole('admin').allowed();
Guard.require('read').on('products').allowed();
Guard.requireLogin().redirect('/login');
```

Bestbase tidak membuat custom `Can`, `useCan`, permission-string parser, policy
string layer, resource ABAC engine, atau authorization engine lokal. Dokumentasi
resmi: https://www.npmjs.com/package/guardap
