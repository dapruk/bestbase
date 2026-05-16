import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

import { logInfo } from './logger';

export function isDependencyInstalled(packageName: string) {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  return Boolean(
    packageJson.dependencies?.[packageName] ??
    packageJson.devDependencies?.[packageName]
  );
}

export function installDependencies(
  packages: string[],
  options: { dryRun?: boolean | undefined } = {}
) {
  const missingPackages = packages.filter(
    (packageName) => !isDependencyInstalled(packageName)
  );

  if (missingPackages.length === 0) {
    return [];
  }

  if (options.dryRun) {
    logInfo(`[dry-run] npm install ${missingPackages.join(' ')}`);
    return missingPackages;
  }

  execFileSync('npm', ['install', ...missingPackages], {
    stdio: 'inherit',
  });

  return missingPackages;
}
