import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createBbaseCliFixture, withFixtureCwd } from '../testing/fixture';
import { genPage } from './gen-page';

function silenceLogs() {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
}

describe('genPage', () => {
  beforeEach(() => {
    process.exitCode = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it('creates a dashboard page template', () => {
    silenceLogs();
    const fixture = createBbaseCliFixture();

    withFixtureCwd(fixture, () => {
      genPage({ name: 'dashboard', template: 'dashboard' });
    });

    const content = fixture.read('src/pages/dashboard/DashboardPage.tsx');

    expect(content).toContain('import { BaseButton }');
    expect(content).toContain('import { PaneLayout }');
    expect(content).toContain('const kpis');
    expect(content).toContain('Weekly performance');
    expect(content).toContain('Recent activity');
  });

  it('creates auth page templates', () => {
    silenceLogs();
    const fixture = createBbaseCliFixture();

    withFixtureCwd(fixture, () => {
      genPage({ name: 'auth', template: 'auth' });
    });

    expect(fixture.read('src/pages/login/LoginPage.tsx')).toContain(
      'export function LoginPage()'
    );
    expect(fixture.read('src/pages/register/RegisterPage.tsx')).toContain(
      'export function RegisterPage()'
    );
    expect(
      fixture.read('src/pages/forgot-password/ForgotPasswordPage.tsx')
    ).toContain('export function ForgotPasswordPage()');
  });

  it('rejects unknown page templates', () => {
    silenceLogs();
    const fixture = createBbaseCliFixture();

    withFixtureCwd(fixture, () => {
      genPage({ name: 'dashboard' });
    });

    expect(process.exitCode).toBe(1);
    expect(fixture.exists('src/pages/dashboard/DashboardPage.tsx')).toBe(false);
  });
});
