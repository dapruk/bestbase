import { RouterProvider } from '@tanstack/react-router';

import { router } from '@/router';

import { AppBootstrap } from './AppBootstrap';
import { AppProviders } from './AppProviders';

export function App() {
  return (
    <AppBootstrap>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </AppBootstrap>
  );
}
