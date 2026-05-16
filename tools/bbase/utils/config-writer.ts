import { readFileSync, writeFileSync } from 'node:fs';

export type RouterMode =
  | 'uninitialized'
  | 'tanstack'
  | 'react-router-framework';
export type RouterRenderingMode = 'spa' | 'server';

export function readRouterMode(path = 'app.config.ts'): RouterMode {
  const content = readFileSync(path, 'utf8');
  const match = content.match(/router:\s*\{[\s\S]*?mode:\s*'([^']+)'/u);
  const mode = match?.[1];

  if (mode === 'tanstack' || mode === 'react-router-framework') return mode;
  return 'uninitialized';
}

export function readRouterRendering(path = 'app.config.ts'): RouterRenderingMode {
  const content = readFileSync(path, 'utf8');
  const match = content.match(
    /router:\s*\{[\s\S]*?rendering:\s*'([^']+)'/u
  );
  return match?.[1] === 'server' ? 'server' : 'spa';
}

export function writeRouterMode(
  mode: Exclude<RouterMode, 'uninitialized'>,
  options: {
    dryRun?: boolean | undefined;
    path?: string | undefined;
    rendering: RouterRenderingMode;
  }
) {
  const path = options.path ?? 'app.config.ts';
  const content = readFileSync(path, 'utf8');
  const nextContent = content
    .replace(
    /(router:\s*\{[\s\S]*?mode:\s*)'[^']+'/u,
    `$1'${mode}'`
    )
    .replace(
      /(router:\s*\{[\s\S]*?rendering:\s*)'[^']+'/u,
      `$1'${options.rendering}'`
    );

  if (!options.dryRun) {
    writeFileSync(path, nextContent, 'utf8');
  }

  return path;
}
