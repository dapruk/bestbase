export interface ConsoleManagerOptions {
  isProductionRuntime: boolean | (() => boolean);
}

export interface ConsoleRestoreHandle {
  restore: () => void;
}

const suppressedMethods = ['log', 'debug', 'info'] as const;

function resolveProductionFlag(
  isProductionRuntime: ConsoleManagerOptions['isProductionRuntime']
): boolean {
  if (typeof isProductionRuntime === 'function') {
    return isProductionRuntime();
  }

  return isProductionRuntime;
}

export function configureConsole({
  isProductionRuntime,
}: ConsoleManagerOptions): ConsoleRestoreHandle {
  if (!resolveProductionFlag(isProductionRuntime)) {
    return { restore: () => undefined };
  }

  const originalMethods = suppressedMethods.map((methodName) => ({
    methodName,
    value: console[methodName],
  }));

  suppressedMethods.forEach((methodName) => {
    console[methodName] = () => undefined;
  });

  return {
    restore: () => {
      originalMethods.forEach(({ methodName, value }) => {
        console[methodName] = value;
      });
    },
  };
}
