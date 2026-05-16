# Generator

CLI lokal dipanggil dengan `npm run bbase --`.

```bash
npm run bbase -- init
npm run bbase -- gen feat product
npm run bbase -- gen feat product --list-view
npm run bbase -- gen component product-table --feature product
npm run bbase -- gen store product-list --feature product
```

## bbase init

Basecode starts thin. Router setup is initialized through:

```bash
npm run bbase -- init
```

The init command configures router mode and rendering mode.

Router mode options:

- TanStack Router
- React Router Framework Mode

Rendering mode options:

- SPA / Client-side only
- Server-side capable / SSR-ready

Router choice affects route setup, route guard adapter, generated route files,
typed route metadata, and future `bbase gen feat --route` behavior.

Rendering mode communicates runtime assumptions to base code:

- `spa`: app assumes browser runtime and uses simpler client-side setup
- `server`: base components/utilities avoid unsafe browser-only assumptions;
  browser APIs must be used through client-safe hooks/effects

Full SSR deployment may need additional router/framework/runtime setup depending
on hosting. Server rendering mode means the basecode is prepared to avoid unsafe
client-only assumptions; it does not pretend full SSR deployment is complete.

`bbase init` updates `app.config.ts > router.mode` and
`app.config.ts > router.rendering`, creates the selected router files under
`src/router`, updates `src/router/index.ts`, creates the selected route guard
adapter, installs only the selected router dependency, and prints a summary.
React Router Framework Mode installs `react-router`; this basecode does not add
`react-router-dom` by default.

Supported flags:

- `--dry-run`
- `--force`
- `--router tanstack`
- `--router react-router-framework`
- `--rendering spa`
- `--rendering server`

Examples:

```bash
npm run bbase -- init --router tanstack --rendering spa
npm run bbase -- init --router react-router-framework --rendering server
```

If the project is already initialized, the command warns and avoids overwriting
unless `--force` is passed.

Do not manually mix TanStack Router and React Router in one project unless you
are intentionally customizing the architecture.

## Route-Aware Generation

`bbase gen` reads:

- `app.config.ts > router.mode`
- `app.config.ts > router.rendering`
- `app.config.ts > dataTable.mode`

If `router.mode` is `tanstack`, route-aware generation creates TanStack-compatible
route files or registry exports.

If `router.mode` is `react-router-framework`, route-aware generation creates
React Router-compatible route files or registry exports.

If `router.rendering` is `server`, generated components avoid direct browser API
access during render. Client-only behavior should be isolated into hooks/effects.

If `router.mode` is `uninitialized`, route-aware generation stops with:

```txt
Router is not initialized. Run: npm run bbase -- init first.
```

This applies to:

```bash
npm run bbase -- gen feat product --route
npm run bbase -- gen feat product --list-view
```

## Feature Generation

```bash
npm run bbase -- gen feat product
```

Generates a feature folder skeleton without requiring router initialization.

`--list-view` creates scaffold dasar list/detail/form: page, container, schema,
service, type, table columns, store, and headless store test. It uses
`BbaseDataTable` and requires router initialization because list-view generation
also prepares route-compatible output.

Generated list views do not hard-code table mode. `BbaseDataTable` reads
`app.config.ts > dataTable.mode` by default and can be overridden per usage.

## DataTable Mode

`app.config.ts` includes:

```ts
dataTable: {
  mode: 'server',
}
```

`server` is the default for office list pages:

- API-driven table
- parent/store controls filtering/sorting/pagination
- table emits state changes

`client` is for small already-loaded datasets:

- local table operations
- parent may still control state where useful

Per table usage can override:

```tsx
<BbaseDataTable mode="client" />
```

Do not confuse `router.rendering` with `dataTable.mode`. Router rendering is
about SPA vs server-capable runtime behavior. DataTable mode is about API-driven
vs local table operations.

Opsi penting: `--dry-run`, `--force`, `--route`, `--protected`, `--public`,
`--permission`, `--store`, `--service`, `--schema`, `--test`, `--persist`.
