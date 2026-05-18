You are working on dapruk/bestbase.

Task:
Sync the project TODO / agent discussion with the latest product decisions from the current planning discussion.

Important:
Do not create a giant ideal roadmap.
Do not mark broad foundational work as incomplete if it is already implemented.
Do not rewrite TODO.md into a generic roadmap.

Instead, add/update TODO items only for the latest discussion deltas that may not exist in the current implementation yet.

Read the repo first:
- TODO.md
- README.md
- app.config.ts
- package.json
- docs/
- src/core/guard
- src/shared/utils
- src/shared/components
- tools/bbase

Then compare current implementation against the latest planning decisions below.

The goal is to create a focused TODO sync:
- what has been decided in discussion
- what is already implemented
- what still needs adjustment
- what docs need to be updated
- what naming/config should be corrected

Do not invent unrelated tasks.

==================================================
Latest Discussion Decisions To Sync
==================================================

1. Guardap integration must follow real Guardap docs/API

Guardap docs:
https://www.npmjs.com/package/guardap

Decision:
- Basecode must not assume Guardap uses permission strings like `permissions: ['product:read']`.
- Basecode must not build a custom authorization engine.
- Basecode must not create custom `Can.tsx` or `use-can.ts`.
- Guardap already provides React helpers from `guardap/react`:
  - GuardProvider
  - useGuard
  - AccessGuard
  - withAuth
- Basecode should initialize Guardap once in one central config file and re-export its helpers.

Expected direction:
src/core/guard/
  guard.config.ts
  guard.types.ts

Optional only if needed:
  route-guard.tsx

Guardap model to document/use:
- login
- guest
- role
- group
- condition
- feature
- action
- redirect

Guardap config should be a single source of truth:
- createGuard(config) once
- read auth state from auth store/session
- map roles to Guardap permission matrix
- define groups
- define defaultRedirect
- export Guard
- re-export GuardProvider, useGuard, AccessGuard, withAuth

Route meta, if needed, should follow Guardap concepts:

type AppGuardMeta = {
  login?: boolean;
  guest?: boolean;
  role?: AppRole | readonly AppRole[];
  group?: AppGroup | readonly AppGroup[];
  condition?: AppCondition;
  feature?: AppFeature;
  action?: AppAction;
  redirectTo?: AppRoutePath;
};

TODO sync:
- Check current `src/core/guard`.
- If custom Can/useCan/guard engine exists, add TODO to remove/refactor.
- If docs mention permission string examples, add TODO to correct docs.
- If guard.config.ts is not the central source, add TODO to simplify.
- If already correct, mark as done or do not add unnecessary task.

2. General shared utilities must be documented and not recreated

Decision:
- Existing and planned utilities must be documented so future devs/AI agents do not recreate helpers from scratch.
- `docs/utilities.md` should be source of truth.
- README should link to `docs/utilities.md`.

Utilities discussed:
- url.ts
- image-url.ts
- format-currency.ts
- format-date.ts
- format-number.ts
- format-file-size.ts
- device.ts
- error.ts
- cn.ts
- string.ts
- array.ts
- object.ts
- async.ts
- index.ts

Important utility decisions:
- Date utilities should use `date-fns`.
- `formatDate`, `formatDateTime`, `formatTime` should be wrappers around date-fns.
- `completeImageUrl` should complete incomplete backend image paths using config.
- `AppImage` should use `completeImageUrl` and fallback behavior.
- `formatCurrency` default should be IDR / id-ID.
- `isMobileViewport` and `useIsMobile` should exist and be SSR-safe.
- Utility docs must include an “Instruction for Future AI Agents” section.

TODO sync:
- Check which utilities already exist.
- Do not list all as TODO if already implemented.
- Add TODO only for missing utilities, missing tests, or missing docs.
- If docs/utilities.md claims utilities are only planned but files now exist, add TODO to update docs.
- If utility docs are missing AI-agent instruction, add TODO.

3. Tailwind + shadcn/ui foundation

Decision:
- Basecode should include Tailwind + shadcn/ui.
- shadcn components should live in `src/shared/components/ui`.
- `cn()` should use `clsx` + `tailwind-merge`.
- shadcn setup should follow official docs:
  https://ui.shadcn.com/docs/installation/vite

Initial shadcn components discussed:
- button
- input
- label
- textarea
- select
- dialog
- dropdown-menu
- table
- badge
- card
- skeleton
- separator
- tooltip
- toast/sonner if used

TODO sync:
- Check current shadcn/tailwind setup.
- Add TODO only for missing config/components/docs.
- If already set up, do not create duplicate broad TODO.
- Ensure docs/ui.md mentions component location and cn utility.

4. Built-in table strategy changed

Decision:
- Do not build complex table from scratch.
- Use DiceUI Data Table as the base.
- DiceUI docs:
  https://www.diceui.com/docs/components/radix/data-table
- Create a simple office wrapper around DiceUI Data Table.

Important naming:
- Wrapper must be named `BbaseDataTable`.
- Do not name it `AppDataTable`, `BtekDataTable`, or generic custom `DataTable`.

Expected folder:
src/shared/components/data-display/bbase-data-table/
  bbase-data-table.tsx
  bbase-data-table.types.ts
  bbase-data-table.skeleton.tsx
  bbase-data-table.empty.tsx
  bbase-data-table.error.tsx
  bbase-data-table.actions.tsx
  use-bbase-data-table.ts
  bbase-data-table.utils.ts
  index.ts

Expected exported names:
- BbaseDataTable
- BbaseDataTableMode
- BbaseDataTableFilterConfig
- BbaseDataTableSearchConfig
- BbaseDataTablePaginationState
- BbaseDataTableSortingState
- BbaseDataTableRowAction
- BbaseDataTableState

Decision:
- BbaseDataTable should be a thin/simple wrapper around DiceUI Data Table.
- It should simplify search/filter/sort/pagination/row-actions setup.
- It should not call APIs.
- It should not contain business logic.
- It should not know Guardap directly.
- Raw DiceUI remains advanced escape hatch.

TODO sync:
- Check whether current table is custom DataTable or BbaseDataTable.
- If old naming exists, add TODO to rename/migrate.
- If docs mention DataTable generically, add TODO to update docs to BbaseDataTable.
- If DiceUI is not integrated, add TODO to integrate it.
- If wrapper exists but is too complex, add TODO to thin it.
- If generator list-view imports old DataTable name, add TODO to update generator templates.

5. bbase init: router setup should be thinner and configurable

Decision:
- Basecode should be thinner before router initialization.
- Add/adjust `bbase init`.
- `bbase init` should configure router mode and rendering mode.
- Router mode:
  - TanStack Router
  - React Router Framework Mode
- React Router mode specifically means **React Router Framework Mode**, not plain BrowserRouter.
- React Router framework docs:
  https://reactrouter.com/start/framework/installation

app.config.ts router shape should support:

router: {
  mode: 'uninitialized' | 'tanstack' | 'react-router-framework',
  rendering: 'spa' | 'server',
  defaultAuthenticatedPath: '/dashboard',
  defaultPublicPath: '/login',
}

Decision:
- Router choice affects generated routes, route guard adapter, typed route path, and feature generator.
- `bbase gen --route` should read router.mode.
- If router.mode is `uninitialized`, generator should error:
  "Router is not initialized. Run: npm run bbase -- init first."

TODO sync:
- Check current `tools/bbase` and `app.config.ts`.
- If router.mode already exists but uses `react-router`, add TODO to rename to `react-router-framework`.
- If `bbase init` does not exist or only partial, add TODO.
- If rendering mode is missing from app.config.ts or init prompt, add TODO.
- If generator does not read router.mode, add TODO.
- If docs say React Router plain mode, add TODO to correct to Framework Mode.

6. Router rendering mode should influence defaults

Decision:
`bbase init` should ask rendering mode:
- SPA / Client-side only
- Server-side capable / SSR-ready

Config:
router.rendering = 'spa' | 'server'

Decision:
- `server` does not mean complete SSR is magically done.
- It means base components/utilities should avoid unsafe browser-only assumptions.
- Docs must be honest.

Components/utilities affected:
- useIsMobile should be SSR-safe.
- AppImage/completeImageUrl should be deterministic and not depend on window.
- state persistence must guard localStorage/sessionStorage access.
- BbaseDataTable should read defaults from config where relevant.

TODO sync:
- Check app.config.ts for `router.rendering`.
- Check docs for explanation.
- Check utilities for direct browser access during render.
- Add focused TODOs only if missing.

7. DataTable mode config

Decision:
BbaseDataTable should support table operation mode:

dataTable: {
  mode: 'server' | 'client',
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
  enableUrlState: false,
  debounceMs: 300,
}

Important:
- Do not confuse router.rendering with dataTable.mode.
- router.rendering = SPA/server-capable app runtime.
- dataTable.mode = server/client table operations.
- BbaseDataTable should read default mode from app.config.ts.
- Individual usage can override with `mode="client"` or `mode="server"`.

TODO sync:
- Check app.config.ts for dataTable.mode.
- Check table component supports optional mode override.
- Check docs explain distinction.
- Add TODO only for missing pieces.

8. CLI naming should be bbase

Decision:
CLI should be `bbase`, not `btekfe`.

Commands:
- npm run bbase -- init
- npm run bbase -- gen feat product
- npm run bbase -- gen feat product --list-view

TODO sync:
- Search docs and scripts for `btekfe`.
- If old name remains, add TODO to rename.
- If package script already uses bbase, mark done or skip.

9. Demo usage comes later

Decision:
Before SSO Hairnerds, there should be a simple demo usage.
But this is not the current sync unless TODO is missing a future item.

Demo concept:
- Product Catalog
- list/detail/form
- Zod schema-first
- fetcher with schema validation
- BbaseDataTable
- Guardap AccessGuard usage
- state persistence
- headless list store test
- optional Hono backend later because it is fastest

TODO sync:
- Add a concise future TODO for demo usage if missing.
- Do not expand into a huge demo roadmap inside TODO unless project already has demo section.

==================================================
Output Requirement
==================================================

Update TODO.md or the current agent discussion/todo file with a focused "Discussion Sync" section.

Preferred format:

## Discussion Sync / Latest Decisions

### Guardap Integration
- [ ] ...

### Utilities
- [ ] ...

### UI Foundation
- [ ] ...

### BbaseDataTable
- [ ] ...

### bbase init / Router Mode
- [ ] ...

### Demo Usage
- [ ] ...

Rules:
- Keep this focused.
- Do not duplicate tasks already completed.
- If something is already implemented, either mark it [x] with a short note or omit it.
- If unsure, mark it [ ] with "verify".
- Do not create a giant ideal roadmap.
- Do not claim something is missing without checking files first.

After updating:
- Summarize what changed.
- Mention any decisions that were already implemented.
- Mention any decisions still missing.