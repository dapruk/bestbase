import { afterEach, describe, expect, it, vi } from 'vitest';

import { configureConsole } from './console.manager';

const originalConsole = {
  debug: console.debug,
  error: console.error,
  info: console.info,
  log: console.log,
  warn: console.warn,
};

describe('console manager', () => {
  afterEach(() => {
    console.debug = originalConsole.debug;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
  });

  it('suppresses log, debug, and info in production runtime', () => {
    const log = vi.fn();
    const debug = vi.fn();
    const info = vi.fn();
    console.log = log;
    console.debug = debug;
    console.info = info;

    configureConsole({ isProductionRuntime: true });

    console.log('hidden');
    console.debug('hidden');
    console.info('hidden');

    expect(log).not.toHaveBeenCalled();
    expect(debug).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
  });

  it('keeps warn and error active', () => {
    const warn = vi.fn();
    const error = vi.fn();
    console.warn = warn;
    console.error = error;

    configureConsole({ isProductionRuntime: true });

    console.warn('visible');
    console.error('visible');

    expect(warn).toHaveBeenCalledWith('visible');
    expect(error).toHaveBeenCalledWith('visible');
  });

  it('restores suppressed methods', () => {
    const log = vi.fn();
    console.log = log;

    const handle = configureConsole({ isProductionRuntime: true });
    handle.restore();
    console.log('visible again');

    expect(log).toHaveBeenCalledWith('visible again');
  });
});
