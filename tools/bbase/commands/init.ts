import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';

import { generateReactRouter } from '../generators/router/react-router';
import { generateTanStackRouter } from '../generators/router/tanstack';
import {
  readRouterMode,
  type RouterMode,
  type RouterRenderingMode,
  writeRouterMode,
} from '../utils/config-writer';
import { logError, logInfo, logSummary } from '../utils/logger';
import { installDependencies } from '../utils/package-manager';

export interface InitOptions {
  dryRun?: boolean | undefined;
  force?: boolean | undefined;
  rendering?: RouterRenderingMode | undefined;
  router?: RouterMode | undefined;
}

export async function initProject(options: InitOptions) {
  const currentMode = readRouterMode();

  if (currentMode !== 'uninitialized' && !options.force) {
    logError(
      `Router is already initialized as "${currentMode}". Re-run with --force to overwrite router setup.`
    );
    process.exitCode = 1;
    return;
  }

  const routerMode = await resolveRouterMode(options.router);
  const renderingMode = await resolveRenderingMode(options.rendering);

  const dependencyFiles = installDependencies(routerDependencies(routerMode), {
    dryRun: options.dryRun,
  }).map((packageName) => `package dependency: ${packageName}`);
  const generatorOptions = { ...options, force: true };

  const files =
    routerMode === 'tanstack'
      ? generateTanStackRouter(generatorOptions)
      : generateReactRouter(generatorOptions);
  const configPath = writeRouterMode(routerMode, {
    dryRun: options.dryRun,
    rendering: renderingMode,
  });

  logSummary([configPath, ...files, ...dependencyFiles], Boolean(options.dryRun));
  logInfo(`Router initialized: ${routerMode} (${renderingMode})`);
}

async function resolveRouterMode(router?: RouterMode) {
  if (router === 'tanstack' || router === 'react-router-framework') {
    return router;
  }

  const prompt = createInterface({ input, output });
  const answer = await prompt.question(
    'Choose router: [1] TanStack Router [2] React Router Framework Mode: '
  );
  prompt.close();

  return answer.trim() === '2' ? 'react-router-framework' : 'tanstack';
}

async function resolveRenderingMode(rendering?: RouterRenderingMode) {
  if (rendering === 'spa' || rendering === 'server') {
    return rendering;
  }

  const prompt = createInterface({ input, output });
  const answer = await prompt.question(
    'Choose rendering mode: [1] SPA / Client-side only [2] Server-side capable / SSR-ready: '
  );
  prompt.close();

  return answer.trim() === '2' ? 'server' : 'spa';
}

function routerDependencies(mode: Exclude<RouterMode, 'uninitialized'>) {
  if (mode === 'tanstack') {
    return ['@tanstack/react-router'];
  }

  return ['react-router'];
}
