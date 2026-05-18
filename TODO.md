# TODO

## Reusable Production Hardening

Implement these reusable patterns from Hairnerds Booking and Membership as Bestbase modules/presets.

### Cache-Busting App Versioning

- Add an `appVersion` module that reads bundled `APP_VERSION` from `import.meta.env.VITE_APP_VERSION`.
- Fetch `/version.json?t=<timestamp>` with `cache: "no-store"` and `Cache-Control: no-cache`.
- Compare bundled `APP_VERSION`, remote `/version.json.version`, and saved `localStorage.app_version`.
- On mismatch, clear app client state, browser Cache Storage, and service workers when needed.
- Preserve or re-set only `localStorage.app_version` after clearing storage.
- Hard reload with a cache-busting query param such as `__app_reload=<now>`.
- Add reload-loop protection with `sessionStorage.app_version_reload_attempt`.
- Run the first version check before rendering React.
- Re-check on `pageshow`, `visibilitychange`, `focus`, and `online`.
- Generate `public/version.json` during deploy/image build from `VITE_APP_VERSION`.
- Make auth/state cleanup pluggable so apps can inject logout, cookie clearing, and storage cleanup.

Suggested API:

```ts
type AppVersionCheckResult =
  | "latest"
  | "saved-version-updated"
  | "reload-started"
  | "skipped"
  | "reload-loop-stopped";

checkAppVersion(): Promise<AppVersionCheckResult>;
checkAppVersionOnce(): Promise<AppVersionCheckResult>;
watchAppVersion(): () => void;
resetApp(): Promise<void>;
clearBrowserCache(): Promise<void>;
```

### Production Console Suppression

- Add `configureConsole()` as an early startup utility.
- Suppress only `console.log`, `console.debug`, and `console.info`.
- Keep `console.warn` and `console.error` visible.
- Detect production through project config/env predicate, not hardcoded domains.

Suggested API:

```ts
configureConsole({
  isProductionRuntime: () => boolean,
});
```

### PR Build Workflow

- Add a reusable `.github/workflows/pr-build.yml` template.
- Trigger on pull requests to `development`.
- Use `npm ci` and `npm run build`.
- Match Bestbase Node requirements from `package.json`.
- Consider exposing this through the `bbase` CLI:

```bash
npm run bbase init --with-pr-build
npm run bbase gen workflow pr-build
```

### Acceptance Criteria

- Old bundles detect new `/version.json` and hard reload with cache busting.
- Reload loop protection prevents infinite reloads.
- App state cleanup is configurable per app.
- Production hides `log/debug/info` but preserves `warn/error`.
- Pull requests to `development` run install and build checks.
