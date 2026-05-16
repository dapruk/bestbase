import { AppRouter } from '@/router';

import { AppBootstrap } from './AppBootstrap';
import { AppProviders } from './AppProviders';

export function App() {
  return (
    <AppBootstrap>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </AppBootstrap>
  );
}
