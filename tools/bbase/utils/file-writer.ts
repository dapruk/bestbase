import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export interface WriteFileOptions {
  content: string;
  dryRun?: boolean | undefined;
  force?: boolean | undefined;
  path: string;
}

export function writeProjectFile({
  content,
  dryRun = false,
  force = false,
  path,
}: WriteFileOptions): 'created' | 'skipped' {
  if (existsSync(path) && !force) {
    return 'skipped';
  }

  if (dryRun) {
    return 'created';
  }

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');

  return 'created';
}
