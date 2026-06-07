import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createBbaseCliFixture, withFixtureCwd } from '../testing/fixture';
import { genFeature } from './gen-feature';

function silenceLogs() {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
}

describe('genFeature', () => {
  beforeEach(() => {
    process.exitCode = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it('creates canonical feature folders and index', () => {
    silenceLogs();
    const fixture = createBbaseCliFixture();

    withFixtureCwd(fixture, () => {
      genFeature({ name: 'product' });
    });

    expect(fixture.exists('src/features/product/components/.gitkeep')).toBe(
      true
    );
    expect(fixture.exists('src/features/product/containers/.gitkeep')).toBe(
      true
    );
    expect(fixture.read('src/features/product/index.ts')).toBe('export {};\n');
  });

  it('does not write files during dry-run', () => {
    silenceLogs();
    const fixture = createBbaseCliFixture();

    withFixtureCwd(fixture, () => {
      genFeature({ dryRun: true, name: 'product' });
    });

    expect(fixture.exists('src/features/product/index.ts')).toBe(false);
  });

  it('does not overwrite existing files unless forced', () => {
    silenceLogs();
    const fixture = createBbaseCliFixture();

    withFixtureCwd(fixture, () => {
      genFeature({ name: 'product' });
      fixture.write(
        'src/features/product/index.ts',
        'export const kept = true;\n'
      );

      genFeature({ name: 'product' });
    });

    expect(fixture.read('src/features/product/index.ts')).toBe(
      'export const kept = true;\n'
    );

    withFixtureCwd(fixture, () => {
      genFeature({ force: true, name: 'product' });
    });

    expect(fixture.read('src/features/product/index.ts')).toBe('export {};\n');
  });

  it('creates list-view scaffold and router files when router is initialized', () => {
    silenceLogs();
    const fixture = createBbaseCliFixture({ routerMode: 'tanstack' });

    withFixtureCwd(fixture, () => {
      genFeature({ listView: true, name: 'product' });
    });

    expect(
      fixture.exists(
        'src/features/product/containers/product-list.container.tsx'
      )
    ).toBe(true);
    expect(
      fixture
        .read('src/features/product/containers/product-list.container.tsx')
        .includes('BbaseDataTable')
    ).toBe(true);
    expect(fixture.exists('src/router/generated/product.route.tsx')).toBe(true);
  });

  it('rejects route generation before router initialization', () => {
    silenceLogs();
    const fixture = createBbaseCliFixture();

    withFixtureCwd(fixture, () => {
      genFeature({ name: 'product', route: true });
    });

    expect(process.exitCode).toBe(1);
    expect(fixture.exists('src/features/product/index.ts')).toBe(false);

    process.exitCode = undefined;
  });
});
