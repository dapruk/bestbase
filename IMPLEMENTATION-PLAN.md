# Bestbase Implementation Plan

## Problem Statement

Bestbase already has much of the platform foundation: Guardap integration,
shared utilities, Tailwind/shadcn UI, BbaseDataTable, auth-ready fetcher, state
persistence, versioning, and a local `bbase` CLI.

Remaining risk is not missing demo UI. Risk is maintainability when this repo is
used as base code for downstream repos:

- CLI generation is still hard to update safely because templates are embedded
  in command files.
- CLI has no tests, so generated file structure can regress silently.
- Page templates stop at list pages; auth and dashboard templates are still
  missing or too minimal for downstream teams to edit productively.
- Config updates rely on regex replacement against `app.config.ts`.
- Generated route index files can be overwritten instead of merged.
- Guardap should track latest because Guardap is an owned package, and Bestbase
  should support the newest Guardap CLI/router typing features.
- Docs drifted from implementation in several areas.
- There is no published/updateable CLI path for downstream repos.
- There is no `doctor` or `upgrade` flow to tell downstream repos what changed.

Creating demo pages is out of scope.

## Solution

Treat Bestbase as two products:

1. Basecode template: reusable app foundation copied or cloned into new repos.
2. Bestbase CLI/tooling: versioned tool that generates, checks, and upgrades
   pieces inside downstream repos.

The CLI should become the update surface. Downstream repos should not need to
manually diff this repository for config, generator, Guardap, router, or lint
changes.

## Phase 1: Sync Current Foundation

- Keep `guardap` dependency on `latest`, with lockfile currently resolving to
  `1.3.0`.
- Update docs that still mention Guardap `1.2.0`.
- Update docs that still point to generic `DataTable`; canonical wrapper is
  `BbaseDataTable`.
- Update UI docs to reflect Tailwind/shadcn already installed.
- Update utility docs to reflect existing `src/shared/utils`.
- Add a short TODO link to this plan instead of expanding TODO into a giant
  roadmap.
- Run `npm run typecheck` and `npm run test:unit` after Guardap update.

## Phase 2: Harden CLI Before Adding More Generators

- Add CLI test harness around `tools/bbase`.
- Test `init`, `gen feat`, `gen component`, `gen store`, `--dry-run`,
  `--force`, invalid flags, missing args, and overwrite protection.
- Move embedded generated file strings out of command files into template
  modules.
- Keep templates typed: each template receives one context object and returns
  planned file writes.
- Add a single `PlanWrite` model: path, content, mode, overwrite policy.
- Make generator output deterministic and snapshot-testable.
- Replace ad hoc arg parsing with a small command parser that can validate
  unknown flags.
- Make help text list every supported option and its status.
- Fix generated `src/router/generated/index.ts` behavior so new routes merge
  exports instead of replacing previous generated exports.
- Add `bbase doctor` to inspect router mode, Guardap version, docs drift, known
  config shape, and common missing dependencies.

## Phase 3: Improve Generated File Structures

- Keep `gen feat` folder structure as current canonical feature shape.
- Add page template generation:
  - `--auth-pages`: login, register, forgot password, and optional reset
    password.
  - `--list-page`: usable BbaseDataTable page variants.
  - `--dashboard-page`: KPI cards, chart panels, activity list, and layout
    sections ready to edit.
- Make `--list-view` generate a thin BbaseDataTable list flow only:
  container/store/service/schema/types/pages/columns/mapper/test.
- Add list page variants:
  `basic`, `crud`, `filterable`, `readonly`, and `picker`.
- Make dashboard page variants:
  `overview`, `operations`, `analytics`, and `executive`.
- Dashboard templates should use placeholder data and typed view models, but no
  fake backend or demo domain.
- Dashboard output should include KPI card data, simple chart data shape,
  quick-action area, recent activity area, and empty/loading/error-ready slots.
- Generated page components must follow the basebranch state-management
  principle: components stay presentational, feature containers orchestrate UI
  state, RxJS stores hold client state, TanStack Query holds server state, and
  services/fetcher perform IO.
- Add reusable layout primitives under `src/shared/components/layout`.
- Add `PaneLayout` as the first layout primitive, but port it with safe styling:
  use `cn()` from `src/shared/utils/cn.ts`, avoid dynamic Tailwind classes such
  as `gap-${gap}` and `w-[${value}]`, and prefer CSS variables or inline style
  for dynamic gap/width.
- Do not generate polished CRUD/demo screens.
- Add explicit generated comments only where downstream owners need to know
  whether files are safe to edit.
- Add optional route registration that respects active router mode.
- Add optional nav registration only after navigation source of truth is
  defined.
- Add optional Guardap route meta generation using Guardap concepts:
  `login`, `guest`, `role`, `group`, `condition`, `feature`, `action`,
  `redirectTo`.
- Add generator tests that assert emitted imports compile against public exports.
- Add generator docs for generated ownership: files meant to be edited vs files
  meant to be regenerated.

## Phase 4: Adopt Guardap 1.3.0 Features

- Confirm current Guardap imports still compile against `1.3.0`.
- Decide where Bestbase should use Guardap's own `guardap init`:
  recommend: document it as the low-level escape hatch, while `bbase init`
  remains Bestbase-specific.
- Add `bbase guard init` or `bbase init --guard` only if it adds Bestbase
  defaults beyond Guardap's CLI.
- Use Guardap typed router redirect helpers where router definitions can supply
  redirect path types.
- For TanStack Router, evaluate `createTanStackRouterDriver` once route tree is
  generated centrally.
- For React Router route objects, use `defineReactRouterRoutes` when React
  Router support graduates from placeholder.
- Keep `src/core/guard/guard.config.ts` the central source of truth.
- Do not add local `Can`, `useCan`, permission-string parser, or custom authz
  engine.

## Phase 5: Publish And Update Strategy

- Publish CLI separately from the app template, recommended package name:
  `@dapruk/bbase`.
- Expose bin:
  `bbase`.
- Keep app template repo private or public independently from CLI package.
- Add release scripts:
  `npm run cli:build`, `npm run cli:test`, `npm run cli:pack`,
  `npm publish --access public` if scoped package is public.
- Version CLI semver separately from generated app version.
- Add `bbase upgrade` with small, composable migrations:
  config migration, docs sync, Guardap update, generator template refresh,
  eslint/tsconfig/vite config refresh.
- Add `bbase upgrade --dry-run` that prints file plan.
- Add `bbase upgrade --apply` only after tests cover merge behavior.
- Use config merge APIs, not regex, for JSON configs.
- For TypeScript config files, prefer AST edits or bounded replace helpers with
  tests and clear failure messages.
- Add marker comments only in generated sections that are owned by CLI.
- Avoid overwriting downstream-owned app code unless `--force` is explicit.

## Phase 6: Config Ownership Model

- Define config ownership classes:
  base-owned, downstream-owned, and shared.
- Base-owned examples: generated route index sections, CLI metadata file,
  template manifest.
- Downstream-owned examples: feature business code, pages, auth backend
  implementation, API endpoints.
- Shared examples: `app.config.ts`, router config, eslint config, tsconfig,
  vite config.
- Add `.bestbase/manifest.json` to downstream repos with:
  Bestbase CLI version, template version, last applied migrations, router mode,
  rendering mode, Guardap target version, and managed file sections.
- Make every update command read manifest first and fail with actionable output
  if repo state is unknown.

## Phase 7: Docs And Release Gates

- Keep `README.md` short and link to docs.
- Keep docs describing current implementation only.
- Add CLI reference docs generated or verified from CLI help.
- Add migration docs per CLI release.
- Add testing gate:
  `npm run typecheck`, `npm run lint`, `npm run format:check`,
  `npm run test:unit`.
- Add package smoke test for CLI:
  pack CLI, install into temp fixture, run `bbase init`, run `bbase gen feat`.
- Add fixture tests for downstream upgrade scenarios.

## Tiny Commit Plan

1. Update Guardap dependency to latest and sync lockfile.
2. Sync Guardap docs/version wording.
3. Sync DataTable docs to `BbaseDataTable`.
4. Sync UI and utilities docs to current repo state.
5. Add this implementation plan.
6. Add CLI test harness with one smoke test for help output.
7. Add CLI fixture helpers for temp repo generation.
8. Add tests for `gen feat` base folder structure.
9. Add tests for `gen feat --list-view`.
10. Add `PaneLayout` shared layout primitive.
11. Add tests for `PaneLayout` sizing and class behavior.
12. Add `--auth-pages` templates.
13. Add `--list-page` variant templates.
14. Add `--dashboard-page` variant templates.
15. Add tests for overwrite protection and `--force`.
16. Extract generator write planning into shared `PlanWrite`.
17. Move feature templates into template modules.
18. Move router templates into template modules.
19. Replace route index overwrite with merge behavior.
20. Add `bbase doctor` read-only checks.
21. Add `.bestbase/manifest.json` writer during `bbase init`.
22. Replace config regex updates with tested config update helpers.
23. Add Guardap 1.3 typed redirect/router integration where router mode is
    mature enough.
24. Add CLI package build metadata and `bin`.
25. Add CLI pack smoke test.
26. Add `bbase upgrade --dry-run`.
27. Add first guarded `bbase upgrade --apply` migration.

## Testing Decisions

- Test generated external behavior: files created, imports compile, overwrite
  policy respected, CLI exit codes correct.
- Do not test implementation details of template functions beyond deterministic
  output.
- Use fixture repos for CLI tests.
- Use snapshot tests only for generated file output that is intentionally stable.
- Keep app tests headless unless UI behavior must be validated.

## Out Of Scope

- Creating demo pages or polished sample CRUD.
- Building a custom authorization engine.
- Replacing Guardap helpers with local wrappers.
- Making DataTable perform API calls or permission decisions.
- Generating dashboards tied to fake business domains.
- Solving downstream business-domain architecture.
- Publishing app template as npm package before CLI update flow is proven.
