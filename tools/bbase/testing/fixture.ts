import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export interface BbaseCliFixture {
  exists(path: string): boolean;
  path: string;
  read(path: string): string;
  write(path: string, content: string): void;
}

export function createBbaseCliFixture(
  options: {
    routerMode?: 'react-router-framework' | 'tanstack' | 'uninitialized';
    routerRendering?: 'server' | 'spa';
  } = {}
): BbaseCliFixture {
  const path = mkdtempSync(join(tmpdir(), 'bbase-cli-'));
  const routerMode = options.routerMode ?? 'uninitialized';
  const routerRendering = options.routerRendering ?? 'spa';

  writeFileSync(
    join(path, 'package.json'),
    JSON.stringify({ dependencies: {}, devDependencies: {} }),
    'utf8'
  );
  writeFileSync(
    join(path, 'app.config.ts'),
    `export default {\n  router: {\n    mode: '${routerMode}',\n    rendering: '${routerRendering}',\n  },\n};\n`,
    'utf8'
  );

  return {
    exists(relativePath) {
      return existsSync(join(path, relativePath));
    },
    path,
    read(relativePath) {
      return readFileSync(join(path, relativePath), 'utf8');
    },
    write(relativePath, content) {
      writeFileSync(join(path, relativePath), content, 'utf8');
    },
  };
}

export function withFixtureCwd<T>(fixture: BbaseCliFixture, callback: () => T) {
  const previousCwd = process.cwd();
  process.chdir(fixture.path);

  try {
    return callback();
  } finally {
    process.chdir(previousCwd);
  }
}
