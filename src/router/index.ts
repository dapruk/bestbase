import { createElement } from 'react';

import { resolveAppConfig } from '@/core/config/resolve-app-config';
import { AppLayout } from '@/layouts/AppLayout';

export function AppRouter() {
  const config = resolveAppConfig();

  return createElement(
    AppLayout,
    null,
    createElement(
      'section',
      null,
      createElement('h1', null, 'Router is not initialized'),
      createElement(
        'p',
        null,
        'Run ',
        createElement('code', null, 'npm run bbase -- init'),
        ' to initialize ',
        config.router.mode === 'uninitialized'
          ? 'a router'
          : `${config.router.mode} router files`,
        '.'
      )
    )
  );
}
