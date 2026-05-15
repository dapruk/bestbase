import { join } from 'node:path';

import { toCamelCase, toKebabCase, toPascalCase } from '../utils/casing';
import { writeProjectFile } from '../utils/file-writer';
import { logSummary } from '../utils/logger';

export function genStore(options: {
  dryRun?: boolean;
  feature: string;
  force?: boolean;
  name: string;
}) {
  const fileName = toKebabCase(options.name);
  const storeName = toCamelCase(options.name);
  const stateName = `${toPascalCase(options.name)}State`;
  const featureName = toKebabCase(options.feature);
  const path = join(
    'src',
    'features',
    featureName,
    'stores',
    `${fileName}.store.ts`
  );
  const content = `import { createStore } from '@/core/rx/create-store';\n\nexport interface ${stateName} {\n  ready: boolean;\n}\n\nexport const ${storeName}Store = createStore<${stateName}>({\n  ready: false,\n});\n`;
  const files =
    writeProjectFile({ content, ...options, path }) === 'created' ? [path] : [];

  logSummary(files, Boolean(options.dryRun));
}
